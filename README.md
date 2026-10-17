# 🎙️ EchoFlow AI: Real-Time Speech-to-Speech Voice Normalizer

> **Hack2skill AI Builder Cup 2026 Submission**  
> *Powered by Google Cloud Run & Gemini Live API (`BidiGenerateContent`)*

---

## 🚀 Executive Summary

In global enterprise contact centers, cross-border engineering bridges, and distributed teams, **rapid cadence rushes (>220 WPM), heavy non-native dialect pacing, and cognitive hesitation particles** cause conversational friction. This results in repeated clarification loops, inflated Average Handle Time (AHT), agent burnout, and customer frustration.

**EchoFlow AI** is a real-time, low-latency speech-to-speech normalization system. It ingests 16kHz audio from a speaker, evaluates speech cadence in continuous 20ms chunks (640 bytes), and enables calibrated executive pacing (**140–160 WPM**) — while **preserving the speaker's original fundamental pitch ($F_0$) envelope and voice identity** through pitch-preserving playback speed calibration.

---

## ⚡ Technical Specifications & Design Targets

| Dimension | Design Specification / SLA Target | Audited Implementation / Evidence | Measurement Type |
| :--- | :--- | :--- | :--- |
| **End-to-End Latency** | `< 550 ms SLA Target` | **418.5 ms Budget** (Ingestion 18ms + Relay 284ms + DSP 108ms + Jitter 8ms) | Theoretical Budget Model; live RTT measured in Near-Live screen |
| **Cadence Normalization** | `140–160 WPM Target` | **150 WPM Calibrated** (Normalizes 220+ WPM hurried speech to 150 WPM) | Deterministic syllable timing & WPM assertion |
| **Pitch Retention ($F_0$)** | `> 90% Target Correlation` | **`preservesPitch = true`** on browser media player & Web Audio DSP | Browser acoustic playback engine |
| **Audio Chunk Framing** | `20 ms frame` | **640 bytes exact** (16kHz 16-bit Linear PCM mono) | Frame validation in `demo_runner.py` & `SelfTestView.tsx` |
| **Drop-Oldest Queue** | Zero buffer stalls | **Drop-oldest policy** prevents streaming backpressure | Asyncio queue buffer test |
| **Stateless Privacy** | 0 audio disk writes | **100% Ephemeral volatile RAM** circular buffers | Zero audio temporary files created on disk |

---

## 🏗️ System Architecture

```text
┌────────────────────────┐         WebSocket (16kHz PCM)         ┌─────────────────────────────────┐
│     Client / Agent     │ ────────────────────────────────────► │      EchoFlow Gateway           │
│   (Web Audio / Mic)    │ ◄──────────────────────────────────── │    (FastAPI on Cloud Run)       │
└────────────────────────┘        Normalized Audio (24kHz PCM)   └───────────────┬─────────────────┘
                                                                                 │
                                                                                 │ Bidi WebSockets
                                                                                 │ (20ms frame buffer: 640B)
                                                                                 ▼
                                                                 ┌─────────────────────────────────┐
                                                                 │        Gemini Live API          │
                                                                 │  (BidiGenerateContent Stream)   │
                                                                 │    • System Prompt Pacing       │
                                                                 │    • 140-160 WPM Normalization  │
                                                                 │    • F0 Pitch Envelope Match    │
                                                                 └─────────────────────────────────┘
```

1. **Client Audio Capture:** Web Audio API captures Linear PCM at 16kHz mono, transmitting 20ms chunks (320 samples = 640 bytes) via WebSocket.
2. **Streaming Gateway (`server.ts` & `main.py`):** Bidirectional relay between client and Google's Gemini Live Bidi endpoint with drop-oldest buffer guards and IP rate limiting for unauthenticated calls.
3. **Gemini Live Engine:** Normalizes speech cadence directly without intermediate ASR$\rightarrow$MT$\rightarrow$TTS serial cascade bottlenecks.
4. **Resynthesis Output:** Returns 24kHz PCM audio frames back to the client jitter buffer with measured round-trip latency.
5. **GCP Console UI & Studio (`src/`):** Left sidebar navigation, archetype quick tests, natural voice recording, video comparison with live voice ingest, PBX call simulator, and single-source ROI engine.

---

## 📁 Repository Structure

```text
├── server.ts                    # Full-Stack Express + WebSocket streaming gateway & Gemini bridge
├── main.py                      # FastAPI + Gemini Live WebSocket streaming gateway
├── app.py                       # Streamlit Telemetry & Control Dashboard
├── demo_runner.py               # 12-point automated benchmark test runner & verification harness
├── Dockerfile                   # Production container definition for Google Cloud Run
├── requirements.txt             # Python production dependencies
├── cloud_deploy.sh              # One-click Cloud Run deployment script with Secret Manager
├── package.json                 # Node dependencies (React 19, Tailwind, Express, @google/genai)
├── firestore.rules              # Firestore security rules (owner-only access, validated schema)
├── src/                         # React 19 + Tailwind CSS GCP Console UI
│   ├── App.tsx                  # Master application entry with Left Sidebar layout
│   ├── types.ts                 # TypeScript data contracts & telemetry definitions
│   ├── config/
│   │   ├── languages.ts         # 6 dialect cadence configurations & system prompts
│   │   └── navigation.ts        # URL hash routing (0-9 numbered screens + reference group)
│   ├── components/
│   │   ├── GcpConsoleNav.tsx    # Left sidebar navigation with visit tracking ticks & drawer
│   │   ├── JudgeGuideView.tsx   # 0. Presenter guide with live vs simulated matrix
│   │   ├── QuickTestView.tsx    # 1. Quick test (3 demographic archetypes, file upload, vault)
│   │   ├── UnifiedVoiceStudio.tsx # 2. Normalizer voice studio, transcriber, & chatbot
│   │   ├── MyVoiceView.tsx      # 3. My voice calibration & pitch-preserving playback
│   │   ├── VideoComparison.tsx  # 4. Synchronized dual-track video player
│   │   ├── NearLiveView.tsx     # 5. Near-live WebSocket streaming & measured RTT ping
│   │   ├── PbxCallSimulator.tsx # 6. Two-party PBX call simulator with cadence gate
│   │   ├── RoiCalculator.tsx    # 7. Single-source mathematical ROI engine & PDF memo
│   │   ├── CascadingSitemap.tsx # 8. Pipeline architecture map & system flow
│   │   ├── TelephonyAndGcp.tsx  # 8. Cloud topology & SIP telephony webhooks
│   │   ├── EthicsCompliance.tsx # 9. Trust, linguistic equity, & privacy charter
│   │   ├── MasterDocumentation.tsx # Reference: User operations manual
│   │   ├── RecommendedTestOrder.tsx # Reference: Recommended judge test sequence
│   │   ├── OfflineReferenceHub.tsx # Reference: 12-test empirical benchmark matrix
│   │   ├── CodeInspector.tsx    # Reference: In-app code viewer & bundle exporter
│   │   ├── SelfTestView.tsx     # Reference: Automated assertions & verifiable audit report
│   │   ├── AboutPage.tsx        # Reference: About EchoFlow & submitter
│   │   ├── ContactPage.tsx      # Reference: Enterprise pilot contact
│   │   ├── GlobalTelemetryBar.tsx # Real-time latency, cadence, and DSP SLA bar
│   │   ├── FirebaseAuthBar.tsx  # Firebase auth status indicator
│   │   └── FloatingGeminiAgent.tsx # Floating interactive engineering assistant
│   └── utils/
│       └── audioUtils.ts        # RIFF/WAVE header injection for 16kHz & 24kHz PCM audio playback
└── README.md                    # Project documentation, claims vs evidence, & setup guide
```

---

## 💰 Single-Source Mathematical ROI Model

EchoFlow uses a unified, deterministic mathematical formula implemented identically in Python (`demo_runner.py`), Node.js (`server.ts`), and React (`RoiCalculator.tsx`):

$$\text{Total Annual Calls} = \text{Seats} \times \text{Calls/Day} \times \text{Work Days}$$
$$\text{Minutes Saved Per Call} = \text{Baseline AHT} \times \frac{\text{Reduction \%}}{100}$$
$$\text{Annual Hours Recovered} = \frac{\text{Total Calls} \times \text{Minutes Saved}}{60}$$
$$\text{Net Annual Savings} = \text{Annual Hours Recovered} \times \text{Loaded Hourly Rate}$$

### Validated Deployment Scenarios:
1. **Standard Enterprise Support Scenario:**
   - Parameters: 500 seats, 35 calls/day, 250 work days, 6.8 min AHT, **18.0% AHT reduction**, $28.00/hr loaded rate.
   - Total Calls: $500 \times 35 \times 250 = 4,375,000$ calls.
   - Time Saved/Call: $6.8 \times 0.18 = 1.224$ min ($73.4$ seconds).
   - Hours Recovered: $(4,375,000 \times 1.224) / 60 =$ **$89,250$ hours/year**.
   - Net Dollar Savings: $89,250 \times \$28 =$ **$\$2,499,000$ net savings annually**.
2. **High-Volume BPO Scenario:**
   - Parameters: 500 seats, 44 calls/day, 250 work days ($5,500,000$ calls/year), 6.8 min AHT, **18.5% AHT reduction** ($1.258$ min saved/call), $28.00/hr loaded rate.
   - Hours Recovered: $(5,500,000 \times 1.258) / 60 =$ **$115,500$ hours/year**.
   - Net Dollar Savings: $115,500 \times \$28 =$ **$\$3,234,000$ net savings annually**.

---

## 📊 Claims vs Evidence Matrix

| Claim in UI / Documentation | Technical Implementation | Code Evidence | Verification Status |
| :--- | :--- | :--- | :--- |
| **Pitch-Preserving Speed Adjustment** | Browser HTMLMediaElement `preservesPitch` | `MyVoiceView.tsx`, `VideoComparison.tsx` | Verified in browser audio engine |
| **Single-Source ROI Determinism** | Exact mathematical formula across Python & TS | `demo_runner.py` TC-01, `server.ts` `/api/roi-calculate` | Verified (89,250 hrs / $2.499M) |
| **640-Byte Audio Framing** | 20ms frame at 16kHz 16-bit mono PCM | `demo_runner.py` TC-02, `SelfTestView.tsx` AUTO-09 | Deterministically verified |
| **Stateless Ephemeral Processing** | In-memory circular buffer without audio disk persistence | `demo_runner.py` TC-09, `server.ts` | Verified (0 audio files on disk) |
| **End-to-End Latency Target (<550ms)** | Theoretical budget model: 18ms + 284ms + 108ms + 8ms = 418.5ms | `demo_runner.py` TC-07 (Spec check), `NearLiveView.tsx` | Spec budget verified; live RTT measured |
| **Multi-Lingual Cadence Presets** | 6 global dialects (Tamil, Telugu, Hindi, French, German, English) | `src/config/languages.ts`, `server.ts` | Verified across all 6 presets |

---

## ⚠️ Known Limitations & Operational Realities

1. **Acoustic Feedback in Near-Live Mode**: When using a laptop's built-in microphone and speakers simultaneously without headphones, near-live audio playback can loop back into the microphone. **Judges are strongly advised to wear headphones when testing Near-Live streaming.**
2. **Browser Web Speech API Support**: Client-side `SpeechRecognition` is natively supported in Google Chrome and Microsoft Edge. In Firefox and Safari, transcription falls back seamlessly to server-side Gemini processing.
3. **Gemini Live Bidi API Key**: Real-time live audio bidirectional streaming requires a valid `GEMINI_API_KEY`. When unconfigured, the application runs in self-contained deterministic demonstration and DSP mode.
4. **Cloud Run Cold Starts**: When scaling from zero instances, the initial container cold start may require 1.5–2.0 seconds before reaching steady-state warm latency.

---

## 🔧 Setup & Environment Variables

### Environment Variables
Configure these variables in your deployment environment or Secret Manager:

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key for Live Bidi streaming | `""` | Optional (Required for live AI streaming) |
| `PORT` | Listening HTTP port | `3000` (Node) / `8080` (Cloud Run) | No |
| `APP_ENV` | Application environment (`development` / `production`) | `production` | No |

### Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite
npm test  # Executes python3 demo_runner.py

# 3. Start development server (serves React SPA + Express API on port 3000)
npm run dev

# 4. Build production bundle
npm run build

# 5. Start production server
npm start
```

### Deploying to Google Cloud Run

```bash
# Deploys full-stack React UI + Express API + WebSocket Gateway
./cloud_deploy.sh
```
The script uses Google Secret Manager (`--set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest`) if configured, or falls back to the current shell environment variable with a security notice.
