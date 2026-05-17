---
title: lmc-voice
category: Voice & Agents
status: active
order: 3
repo: https://github.com/BrennonTWilliams/lmc-voice
summary: A production-grade, self-hosted real-time voice AI assistant. WebRTC audio in, streaming LLM, and tool execution across four provider categories — runs fully offline or against cloud providers, with enterprise monitoring across the stack.
svg: lmc-voice.png
---

## Overview
LMC Voice is a production-grade, self-hosted real-time voice AI assistant. Spoken queries are handled by a full pipeline: WebRTC audio capture via LiveKit, VAD-based turn detection (Silero), speech-to-text, streaming LLM processing with structured output via BAML, tool execution across four provider categories, and text-to-speech response — all with sub-second acknowledgment latency. The system runs entirely offline (Ollama + local Whisper) or with cloud providers, and is deployed on home infrastructure via Coolify with enterprise-level monitoring.

## Architecture
The backend is a Python 3.12 async agent using LiveKit Agents as the voice pipeline host. A BAML engine handles structured LLM calls — one function for conversational response (ProcessChat) and separate background functions for tool selection (SelectTool / SelectNextTool). Four concurrent observer agents run on an event bus alongside the main voice loop: a Reasoning Observer, Tool Observer (predicts needed tools using sentence-transformer embeddings), Context Observer, and Orchestration Observer. The frontend is a Next.js + React 19 app using LiveKit React Components, also packaged as a cross-platform desktop app via Tauri 2.0 (Windows, macOS, iOS).

## Key Features
- **End-to-end streaming**: WebRTC audio in → Deepgram STT → Ollama/OpenAI LLM → ElevenLabs TTS out, fully streamed with no buffering delay
- **Four-provider tool router**: Native tools (web search, file read), MCP servers (Playwright, filesystem), Computer Use (screenshot, click, type, hotkey), and Z.AI vision analysis — with health checks, timeout management, and graceful degradation
- **VAD turn detection**: Silero VAD handles natural conversation turns without push-to-talk
- **Tool prediction**: Embedding-based prefetch in background observer; users get faster tool responses because tool selection starts before the LLM response finishes
- **Immediate acknowledgment**: Agent yields "Let me check that" (~100ms) before expensive LLM/tool calls, so users never wait in silence
- **Offline-first**: Fully runnable with Ollama LLM + faster-whisper STT — no API costs, no data leaving the machine
- **Enterprise monitoring**: Prometheus metrics, 32 Grafana dashboard panels, 28 alert rules, Jaeger distributed tracing, Kibana logs, cAdvisor container metrics
- **Cross-platform**: Same codebase as web app, Windows/macOS desktop, and iOS app (Tauri v2 + native plugins)
- **Multi-provider fallback chains**: STT: Deepgram → Speaches → local Whisper; TTS: ElevenLabs → Deepgram → Cartesia → Kokoro
- **Message truncation strategies**: Sliding window, importance-scored, and hybrid modes to preserve context across long sessions

## Tech Stack
**Backend**: Python 3.12, LiveKit Agents 1.5.1, BAML 0.220.0, MCP ≥1.20.0, Silero VAD, faster-whisper, sentence-transformers, Prometheus client, Deepgram, ElevenLabs
**Frontend**: Next.js 16, React 19, TypeScript 5.7, LiveKit React Components 2.7, Framer Motion, Krisp noise suppression
**Desktop**: Tauri 2.0, Rust (tokio, sqlx, reqwest)
**Infra**: LiveKit Server, Docker Compose, Coolify, Prometheus, Grafana, Jaeger, Kibana
