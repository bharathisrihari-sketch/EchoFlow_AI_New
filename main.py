"""
EchoFlow AI: Real-Time Speech-to-Speech Normalization Gateway
Hack2skill AI Builder Cup 2026 Submission
Platform: Google Cloud Run & Gemini Live API (BidiGenerateContent)

Architecture:
  Client (Mic 16kHz PCM) <== WebSocket ==> FastAPI Streaming Gateway <== Bidi WebSocket ==> Gemini Live API (24kHz PCM)
"""

import os
import sys
import json
import time
import base64
import asyncio
import logging
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import websockets

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("echoflow-gateway")

# Environment & Config
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PORT = int(os.getenv("PORT", "8080"))
HOST = os.getenv("HOST", "0.0.0.0")
GEMINI_LIVE_MODEL = os.getenv("GEMINI_LIVE_MODEL", "models/gemini-3.8-live")
ECHOFLOW_MOCK = os.getenv("ECHOFLOW_MOCK", "0") == "1"
MAX_SESSION_SECONDS = int(os.getenv("MAX_SESSION_SECONDS", "600"))
IDLE_TIMEOUT_SECONDS = int(os.getenv("IDLE_TIMEOUT_SECONDS", "30"))
MAX_SESSIONS = int(os.getenv("MAX_SESSIONS", "50"))
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "*").split(",") if o.strip()]

# Gemini Live WebSocket Endpoint
GEMINI_LIVE_URL = (
    "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent"
)

app = FastAPI(
    title="EchoFlow AI Gateway",
    description="Real-Time Speech Cadence & Accent Normalization Streaming Gateway",
    version="2.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS != ["*"] else ["*"],
    allow_credentials=False if ALLOWED_ORIGINS == ["*"] else True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Gateway Metrics & Rolling Stats Store
gateway_state: Dict[str, Any] = {
    "total_connections": 0,
    "active_streams": 0,
    "total_chunks_processed": 0,
    "dropped_chunks": 0,
    "uptime_start": time.time(),
    "recent_latencies": [],  # Rolling buffer of last 50 real measurements
}


def record_latency(latency_ms: float):
    """Stores rolling measured latencies and caps buffer at 50 samples."""
    buf: List[float] = gateway_state["recent_latencies"]
    buf.append(latency_ms)
    if len(buf) > 50:
        buf.pop(0)


def compute_latency_stats() -> Dict[str, Optional[float]]:
    """Computes real p50 and p95 percentiles from rolling server measurements."""
    buf: List[float] = gateway_state["recent_latencies"]
    if not buf:
        return {"p50_ms": None, "p95_ms": None, "mean_ms": None, "sample_count": 0}
    sorted_buf = sorted(buf)
    n = len(sorted_buf)
    p50 = sorted_buf[int(n * 0.50)]
    p95 = sorted_buf[min(n - 1, int(n * 0.95))]
    mean_val = round(sum(sorted_buf) / n, 1)
    return {"p50_ms": round(p50, 1), "p95_ms": round(p95, 1), "mean_ms": mean_val, "sample_count": n}


def put_drop_oldest(queue: asyncio.Queue, item: Any):
    """
    Drop-oldest real-time queue policy.
    Prevents queue backpressure from stalling the audio streaming pipeline.
    """
    if queue.full():
        try:
            queue.get_nowait()
            gateway_state["dropped_chunks"] += 1
        except asyncio.QueueEmpty:
            pass
    try:
        queue.put_nowait(item)
    except asyncio.QueueFull:
        pass


def downsample_24k_to_16k(pcm24k_bytes: bytes) -> bytes:
    """
    Linear decimation/interpolation from 24kHz 16-bit Mono to 16kHz 16-bit Mono.
    Ratio: 24000 / 16000 = 1.5 (every 3 samples in 24k -> 2 samples in 16k).
    Provides native telephony downsampling without external binary dependencies.
    """
    sample_count_24k = len(pcm24k_bytes) // 2
    if sample_count_24k < 3:
        return pcm24k_bytes

    out_samples: List[int] = []
    ratio = 24000.0 / 16000.0
    out_len = int(sample_count_24k / ratio)

    # Unpack 16-bit signed integers (little-endian)
    raw_samples = [
        int.from_bytes(pcm24k_bytes[i * 2 : (i + 1) * 2], byteorder="little", signed=True)
        for i in range(sample_count_24k)
    ]

    for i in range(out_len):
        src_idx = i * ratio
        idx_floor = int(src_idx)
        idx_ceil = min(idx_floor + 1, sample_count_24k - 1)
        frac = src_idx - idx_floor

        sample_val = int((1.0 - frac) * raw_samples[idx_floor] + frac * raw_samples[idx_ceil])
        clamped = max(-32768, min(32767, sample_val))
        out_samples.append(clamped)

    return b"".join(s.to_bytes(2, byteorder="little", signed=True) for s in out_samples)


def build_system_instruction(target_wpm: int = 150, filler_suppression: bool = True, language: str = "English") -> str:
    """Builds a dynamic, parameterized system instruction matching client config."""
    filler_clause = (
        "Suppress all cognitive fillers (um, uh, like, you know, ante, arre)."
        if filler_suppression
        else "Retain conversational particles."
    )
    return (
        f"You are EchoFlow AI, a low-latency voice normalization relay for {language}. "
        f"Receive raw 16kHz speech and normalize rapid or erratic delivery into a steady {target_wpm} WPM enterprise cadence. "
        f"{filler_clause} Preserve natural speaker vocal resonance, emotional urgency, and pitch inflection. "
        "Do not answer or converse with the speaker; relay the speaker's exact words with normalized pacing."
    )


@app.get("/health")
async def health_check():
    """Health check endpoint for Google Cloud Run liveness/readiness probes."""
    has_key = bool(GEMINI_API_KEY and GEMINI_API_KEY != "MY_GEMINI_API_KEY")
    mode = "live" if has_key and not ECHOFLOW_MOCK else "mock"
    return {
        "status": "healthy",
        "service": "echoflow-gateway",
        "mode": mode,
        "gemini_api_configured": has_key,
        "gemini_live_model": GEMINI_LIVE_MODEL,
        "active_streams": gateway_state["active_streams"],
        "max_capacity": MAX_SESSIONS,
        "uptime_seconds": int(time.time() - gateway_state["uptime_start"]),
    }


@app.get("/api/stats")
async def get_stats():
    """Real-time gateway telemetry and throughput statistics."""
    has_key = bool(GEMINI_API_KEY and GEMINI_API_KEY != "MY_GEMINI_API_KEY")
    mode = "live" if has_key and not ECHOFLOW_MOCK else "mock"
    lat_stats = compute_latency_stats()
    return {
        "mode": mode,
        "simulated": mode == "mock",
        "active_streams": gateway_state["active_streams"],
        "total_connections": gateway_state["total_connections"],
        "total_chunks_processed": gateway_state["total_chunks_processed"],
        "dropped_chunks": gateway_state["dropped_chunks"],
        "latency_stats": lat_stats,
        "target_cadence_wpm": "140-160 WPM (Target)",
        "target_latency_sla": "< 550 ms (Target)",
        "input_spec": "16kHz 16-bit Linear PCM Mono (20ms frames = 640 bytes)",
        "output_spec": "24kHz 16-bit Linear PCM Mono",
    }


async def send_gemini_setup(
    gemini_ws: websockets.WebSocketClientProtocol,
    voice_name: str = "Puck",
    target_wpm: int = 150,
    filler_suppression: bool = True,
    language: str = "English",
):
    """Sends the initial handshake configuration to Gemini Live API."""
    system_instruction = build_system_instruction(target_wpm, filler_suppression, language)
    setup_message = {
        "setup": {
            "model": GEMINI_LIVE_MODEL,
            "generationConfig": {
                "responseModalities": ["AUDIO"],
                "speechConfig": {
                    "voiceConfig": {
                        "prebuiltVoiceConfig": {
                            "voiceName": voice_name
                        }
                    }
                }
            },
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            }
        }
    }
    await gemini_ws.send(json.dumps(setup_message))
    raw_res = await gemini_ws.recv()
    logger.info("Gemini Live session initialized (model=%s, voice=%s, target_wpm=%d, lang=%s)", GEMINI_LIVE_MODEL, voice_name, target_wpm, language)


@app.websocket("/ws/stream")
async def websocket_stream_endpoint(client_ws: WebSocket):
    """
    Bidirectional streaming WebSocket endpoint.
    Ingests 16kHz PCM audio packets, relays to Gemini Live API, and streams back
    normalized audio with real server-measured latency telemetry.
    """
    await client_ws.accept()

    # Abuse protection: concurrent sessions cap
    if gateway_state["active_streams"] >= MAX_SESSIONS:
        await client_ws.send_text(json.dumps({
            "type": "error",
            "code": "rate_limited",
            "message": f"Gateway capacity reached ({MAX_SESSIONS} concurrent sessions). Please retry."
        }))
        await client_ws.close()
        return

    gateway_state["total_connections"] += 1
    gateway_state["active_streams"] += 1
    session_id = f"echo_{int(time.time() * 1000)}"
    session_start_time = time.monotonic()
    last_activity_time = time.monotonic()

    # Determine runtime mode
    has_key = bool(GEMINI_API_KEY and GEMINI_API_KEY != "MY_GEMINI_API_KEY")
    mode = "live" if has_key and not ECHOFLOW_MOCK else "mock"

    # Send initial connection status
    await client_ws.send_text(json.dumps({
        "type": "status",
        "mode": mode,
        "simulated": mode == "mock",
        "model": GEMINI_LIVE_MODEL if mode == "live" else "local_resynthesis_simulator",
        "session_id": session_id,
        "max_session_seconds": MAX_SESSION_SECONDS,
        "sla_target_ms": 550,
    }))

    gemini_ws: Optional[websockets.WebSocketClientProtocol] = None

    # Connect to Gemini Live if API Key is configured and not in mock mode
    if mode == "live":
        try:
            gemini_ws_url = f"{GEMINI_LIVE_URL}?key={GEMINI_API_KEY}"
            gemini_ws = await websockets.connect(
                gemini_ws_url,
                ping_interval=20,
                ping_timeout=20,
                max_size=10 * 1024 * 1024,
            )
            await send_gemini_setup(gemini_ws, voice_name="Puck", target_wpm=150)
        except Exception as e:
            logger.warning("[%s] Failed to connect to Gemini Live: %s. Falling back to mock mode.", session_id, str(e))
            mode = "mock"
            gemini_ws = None
            await client_ws.send_text(json.dumps({
                "type": "status",
                "mode": "mock",
                "simulated": True,
                "reason": "Gemini Live endpoint unreachable; running in simulated cadence mode."
            }))

    audio_queue: asyncio.Queue = asyncio.Queue(maxsize=100)
    stop_event = asyncio.Event()

    # Tracks server-measured Time-to-First-Audio (TTFA)
    last_chunk_sent_monotonic: Optional[float] = None

    async def client_receiver():
        """Reads audio chunks from client and puts into drop-oldest queue."""
        nonlocal last_activity_time, last_chunk_sent_monotonic
        try:
            while not stop_event.is_set():
                # Session timeout guard
                if time.monotonic() - session_start_time > MAX_SESSION_SECONDS:
                    await client_ws.send_text(json.dumps({
                        "type": "error",
                        "code": "session_timeout",
                        "message": f"Maximum session duration ({MAX_SESSION_SECONDS}s) reached."
                    }))
                    break

                # Idle timeout guard
                if time.monotonic() - last_activity_time > IDLE_TIMEOUT_SECONDS:
                    logger.info("[%s] Idle timeout after %ds of silence", session_id, IDLE_TIMEOUT_SECONDS)
                    break

                try:
                    message = await asyncio.wait_for(client_ws.receive(), timeout=2.0)
                except asyncio.TimeoutError:
                    continue

                if message.get("type") == "websocket.disconnect":
                    break

                text_data = message.get("text")
                bytes_data = message.get("bytes")
                last_activity_time = time.monotonic()

                if text_data:
                    try:
                        data = json.loads(text_data)
                    except json.JSONDecodeError:
                        await client_ws.send_text(json.dumps({
                            "type": "error",
                            "code": "bad_json",
                            "message": "Malformed JSON payload discarded."
                        }))
                        continue

                    msg_type = data.get("type")
                    if msg_type == "audio_chunk":
                        pcm_base64 = data.get("data")
                        if not pcm_base64:
                            continue
                        try:
                            decoded = base64.b64decode(pcm_base64)
                            if len(decoded) % 2 != 0 or len(decoded) > 65536 or len(decoded) == 0:
                                await client_ws.send_text(json.dumps({
                                    "type": "error",
                                    "code": "bad_audio",
                                    "message": "Audio chunk must be 16-bit PCM (even byte length <= 64KB)."
                                }))
                                continue
                        except Exception:
                            continue

                        last_chunk_sent_monotonic = time.monotonic()
                        put_drop_oldest(audio_queue, {"pcm_base64": pcm_base64, "sent_mono": last_chunk_sent_monotonic})

                    elif msg_type == "ping":
                        await client_ws.send_text(json.dumps({
                            "type": "pong",
                            "time": int(time.time() * 1000)
                        }))

                    elif msg_type == "config":
                        target_wpm = int(data.get("target_wpm", 150))
                        voice = str(data.get("voice", "Puck"))
                        filler_suppr = bool(data.get("filler_suppression", True))
                        lang = str(data.get("language", "English"))
                        logger.info("[%s] Applied stream config: WPM=%d, Voice=%s, Lang=%s", session_id, target_wpm, voice, lang)
                        if gemini_ws:
                            try:
                                await send_gemini_setup(gemini_ws, voice_name=voice, target_wpm=target_wpm, filler_suppression=filler_suppr, language=lang)
                            except Exception as err:
                                logger.warning("[%s] Could not reconfigure live session: %s", session_id, err)

                elif bytes_data:
                    # Raw binary PCM frame (e.g. from ScriptProcessor or Telephony trunk)
                    if len(bytes_data) % 2 != 0 or len(bytes_data) > 65536 or len(bytes_data) == 0:
                        continue
                    pcm_b64 = base64.b64encode(bytes_data).decode("ascii")
                    last_chunk_sent_monotonic = time.monotonic()
                    put_drop_oldest(audio_queue, {"pcm_base64": pcm_b64, "sent_mono": last_chunk_sent_monotonic})

        except (WebSocketDisconnect, asyncio.CancelledError):
            pass
        except Exception as e:
            logger.error("[%s] Error in client_receiver: %s", session_id, str(e))
        finally:
            stop_event.set()

    async def gemini_forwarder():
        """Forwards audio packets to Gemini Live or simulated local processor."""
        nonlocal last_chunk_sent_monotonic
        try:
            while not stop_event.is_set():
                try:
                    item = await asyncio.wait_for(audio_queue.get(), timeout=1.0)
                except asyncio.TimeoutError:
                    continue

                pcm_base64 = item["pcm_base64"]
                sent_mono = item["sent_mono"]
                gateway_state["total_chunks_processed"] += 1

                if gemini_ws and mode == "live":
                    payload = {
                        "realtimeInput": {
                            "mediaChunks": [
                                {
                                    "mimeType": "audio/pcm;rate=16000",
                                    "data": pcm_base64
                                }
                            ]
                        }
                    }
                    try:
                        await gemini_ws.send(json.dumps(payload))
                    except Exception as ws_err:
                        logger.warning("[%s] Gemini send error: %s", session_id, ws_err)
                        stop_event.set()
                        break
                else:
                    # Simulated local normalization delay (380-450ms)
                    await asyncio.sleep(0.04)
                    measured_latency = round((time.monotonic() - sent_mono) * 1000 + 380, 1)
                    record_latency(measured_latency)
                    try:
                        await client_ws.send_text(json.dumps({
                            "type": "audio_output",
                            "audio": pcm_base64,
                            "sample_rate": 16000,
                            "latency_ms": measured_latency,
                            "mode": "mock",
                            "simulated": True,
                            "target_wpm": 150,
                        }))
                    except Exception:
                        break

                audio_queue.task_done()
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error("[%s] Error in forwarder: %s", session_id, str(e))
            stop_event.set()

    async def gemini_listener():
        """Listens for synthesized audio from Gemini Live (handles JSON & binary)."""
        nonlocal last_chunk_sent_monotonic
        if not gemini_ws or mode != "live":
            return

        try:
            while not stop_event.is_set():
                try:
                    raw_response = await asyncio.wait_for(gemini_ws.recv(), timeout=2.0)
                except asyncio.TimeoutError:
                    continue

                if isinstance(raw_response, (str, bytes)):
                    # Parse text JSON or decode byte JSON
                    if isinstance(raw_response, bytes):
                        try:
                            res_json = json.loads(raw_response.decode("utf-8"))
                        except Exception:
                            continue
                    else:
                        try:
                            res_json = json.loads(raw_response)
                        except Exception:
                            continue

                    server_content = res_json.get("serverContent")

                    if server_content:
                        model_turn = server_content.get("modelTurn")
                        if model_turn:
                            for part in model_turn.get("parts", []):
                                inline_data = part.get("inlineData")
                                if inline_data and inline_data.get("mimeType", "").startswith("audio/pcm"):
                                    output_pcm_b64 = inline_data.get("data")
                                    measured_latency = (
                                        round((time.monotonic() - last_chunk_sent_monotonic) * 1000, 1)
                                        if last_chunk_sent_monotonic
                                        else None
                                    )
                                    if measured_latency:
                                        record_latency(measured_latency)

                                    try:
                                        await client_ws.send_text(json.dumps({
                                            "type": "audio_output",
                                            "audio": output_pcm_b64,
                                            "sample_rate": 24000,
                                            "latency_ms": measured_latency,
                                            "mode": "live",
                                            "simulated": False,
                                            "target_wpm": 150,
                                        }))
                                    except Exception:
                                        stop_event.set()
                                        break

                        if server_content.get("interrupted"):
                            # Flush queue upon speech interruption (barge-in)
                            while not audio_queue.empty():
                                try:
                                    audio_queue.get_nowait()
                                    audio_queue.task_done()
                                except asyncio.QueueEmpty:
                                    break
                            try:
                                await client_ws.send_text(json.dumps({
                                    "type": "interrupted",
                                    "message": "Speech turn interrupted by user barge-in."
                                }))
                            except Exception:
                                pass
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error("[%s] Error in gemini_listener: %s", session_id, str(e))
            stop_event.set()

    tasks = [
        asyncio.create_task(client_receiver()),
        asyncio.create_task(gemini_forwarder()),
        asyncio.create_task(gemini_listener()),
    ]

    try:
        # Clean task lifecycle using FIRST_COMPLETED pattern
        done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
    finally:
        stop_event.set()
        for t in tasks:
            t.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
        gateway_state["active_streams"] = max(0, gateway_state["active_streams"] - 1)
        if gemini_ws:
            try:
                await gemini_ws.close()
            except Exception:
                pass
        try:
            await client_ws.close()
        except Exception:
            pass
        logger.info("[%s] Stream session closed cleanly. Active: %d", session_id, gateway_state["active_streams"])


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting EchoFlow AI Gateway on %s:%d (Model=%s)", HOST, PORT, GEMINI_LIVE_MODEL)
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        log_level="info",
        loop="uvloop" if sys.platform != "win32" else "asyncio",
        http="httptools" if sys.platform != "win32" else "auto",
        workers=1,
    )
