# ==============================================================================
# EchoFlow AI - Production Cloud Run Container
# Real-Time Voice Normalization Streaming Gateway
# Hack2skill AI Builder Cup Submission
# ==============================================================================

FROM python:3.11-slim AS base

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080 \
    HOST=0.0.0.0 \
    APP_ENV=production

# Install essential system dependencies for high-performance audio & networking
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    ca-certificates \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY main.py .
COPY app.py .
COPY cloud_deploy.sh .

# Create non-root system user for security compliance on Cloud Run
RUN useradd -u 1001 -m echouser && \
    chown -R echouser:echouser /app

USER echouser

# Expose target port
EXPOSE 8080

# Healthcheck for container orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Launch low-latency FastAPI Gateway with uvloop and httptools on $PORT
CMD exec uvicorn main:app \
    --host 0.0.0.0 \
    --port ${PORT:-8080} \
    --workers 1 \
    --loop uvloop \
    --http httptools \
    --timeout-keep-alive 65 \
    --ws websockets \
    --ws-ping-interval 20 \
    --ws-ping-timeout 20
