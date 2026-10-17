#!/usr/bin/env bash
# ==============================================================================
# EchoFlow AI: Google Cloud Run Deployment Script
# Hack2skill AI Builder Cup Submission
# ==============================================================================

set -euo pipefail

# ANSI Styling
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SERVICE_NAME="echoflow-gateway"
REGION="us-central1"
PROJECT_ID="${GCP_PROJECT:-$(gcloud config get-value project 2>/dev/null || echo '')}"

echo -e "${CYAN}====================================================================${NC}"
echo -e "${CYAN}     EchoFlow AI - Google Cloud Run Serverless WebSocket Deploy     ${NC}"
echo -e "${CYAN}====================================================================${NC}"

# Check for GCP Project
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}Warning: GCP_PROJECT is not set. Checking gcloud config...${NC}"
    if ! gcloud config get-value project >/dev/null 2>&1; then
        echo -e "${RED}Error: No active GCP project configured. Run 'gcloud config set project <ID>' first.${NC}"
        exit 1
    fi
    PROJECT_ID=$(gcloud config get-value project)
fi

echo -e "Target GCP Project: ${GREEN}${PROJECT_ID}${NC}"
echo -e "Target Region:      ${GREEN}${REGION}${NC}"
echo -e "Service Name:       ${GREEN}${SERVICE_NAME}${NC}"

# Validate GEMINI_API_KEY
if [ -z "${GEMINI_API_KEY:-}" ]; then
    echo -e "${YELLOW}Notice: GEMINI_API_KEY is not defined in current shell environment.${NC}"
    echo -e "${YELLOW}You can set it via Cloud Run secrets or configure it in Google Secret Manager.${NC}"
fi

echo -e "\n${CYAN}[1/3] Enabling required Google Cloud APIs...${NC}"
gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    --project "${PROJECT_ID}"

echo -e "\n${CYAN}[2/3] Building and Deploying to Google Cloud Run...${NC}"
# Deploy service directly from source with WebSocket-optimized flags
gcloud run deploy "${SERVICE_NAME}" \
    --source . \
    --region "${REGION}" \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 2Gi \
    --cpu 2 \
    --concurrency 80 \
    --timeout 3600 \
    --session-affinity \
    --min-instances 1 \
    --max-instances 10 \
    --set-env-vars "APP_ENV=production,GEMINI_API_KEY=${GEMINI_API_KEY:-}" \
    --project "${PROJECT_ID}"

echo -e "\n${CYAN}[3/3] Retrieving Service URL & Health Probe...${NC}"
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" --platform managed --region "${REGION}" --format 'value(status.url)' --project "${PROJECT_ID}")

echo -e "\n${GREEN}====================================================================${NC}"
echo -e "${GREEN}✓ EchoFlow AI Gateway Successfully Deployed to Google Cloud Run!${NC}"
echo -e "${GREEN}====================================================================${NC}"
echo -e "HTTP Base URL:      ${CYAN}${SERVICE_URL}${NC}"
echo -e "Health Endpoint:    ${CYAN}${SERVICE_URL}/health${NC}"
echo -e "Stats Endpoint:     ${CYAN}${SERVICE_URL}/api/stats${NC}"
echo -e "WebSocket Stream:   ${CYAN}wss://${SERVICE_URL#https://}/ws/stream${NC}"
echo -e "--------------------------------------------------------------------"
echo -e "To launch the Streamlit Telemetry Dashboard connected to Cloud Run:"
echo -e "${YELLOW}GATEWAY_WS_URL=wss://${SERVICE_URL#https://}/ws/stream streamlit run app.py${NC}"
