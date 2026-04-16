---
title: swan
category: Voice & Agents
status: Archive
repo: https://github.com/BrennonTWilliams/swan
summary: A lean Python multi-agent framework (~1,200 lines) that scales from a single CLI process to distributed Celery workers without changing agent code. BAML-typed LLM contracts replace stringly-typed outputs, and Microsandbox isolates execution.
svg: project-swan.svg
---

## Overview
Most multi-agent frameworks make you choose between two bad options: a simple prototype that collapses under production load, or a heavyweight orchestration platform that's too complex to extend. Swan is a third path — a lean Python system (~1,200 lines of core code) that starts as a single CLI process and scales horizontally to distributed Celery workers without changing agent code. Agents are type-safe plugins. LLM decisions are structured contracts, not freeform strings. Execution happens inside sandboxed containers. The same agent logic runs locally or across a fleet of workers.

## Key Features
- **Pluggable agent registry** — Agents implement a `BaseAgent` ABC and self-register via `AgentRegistry`. New agent types (terminal, web, file, database) are added without modifying orchestration logic.
- **BAML-typed LLM decisions** — The core `DetermineNextStep` function is defined in BAML, which auto-generates Pydantic models (`CommandExecution`, `ClarificationRequest`, `DoneForNow`). The orchestrator pattern-matches on the return type, never on raw strings.
- **4-queue Celery routing** — Tasks route to specialized queues: `orchestration`, `agent_execution`, `result_processing`, `state_management`. Workers can be dedicated to a single queue, enabling horizontal scaling without contention.
- **Microsandbox execution isolation** — Terminal commands run inside Microsandbox instances (<100ms creation time vs. seconds for Docker). Each `TerminalAgent` uses lazy initialization and async context management for automatic cleanup.
- **Dual-mode state store** — `ThreadStore` runs either in-memory (CLI/dev mode) or Redis-backed (production). Detection is automatic; the system degrades gracefully without Redis rather than failing.
- **Multi-provider LLM switching** — Five clients are configured in BAML (GPT-4o, Gemini Pro, Gemini Flash, Ollama Qwen3, Ollama Devstral). Switching providers requires changing one line in the BAML definition, not Python code.
- **Per-task retry policies** — `error_handling.py` defines task-specific retry configs with exponential backoff (capped at 5 min), severity filtering (won't retry `ValueError`/`TypeError`), and dead-letter queue readiness.
- **Three deployment modes** — CLI (`python main.py "task"`), FastAPI server (`--server`), or distributed Celery (`--celery` + `start_worker.py`). Docker Compose brings up all three worker types as a full stack.

## Background
The design problem swan addresses is operational fragility in multi-agent systems: agents that work in dev break under concurrent load because state isn't thread-safe, task failures cascade without retry logic, and LLM outputs are stringly typed so any schema change silently corrupts downstream behavior.

Swan's answer was to treat each layer as a solved problem in a different field and compose them: Celery for distributed task reliability (a mature, battle-tested system with sophisticated retry primitives), Redis for shared state across workers, BAML for LLM output contracts, and Microsandbox for execution isolation. The core orchestration logic stays simple because each concern is delegated to infrastructure that already handles it well.

## Tech Stack
Python, BAML (BoundaryML), Celery, Redis, FastAPI, Microsandbox
