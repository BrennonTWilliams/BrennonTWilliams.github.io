---
title: graphrag-claude-code
category: AI & Dev Tooling
status: Archive
repo: https://github.com/BrennonTWilliams/graphrag-claude-code
summary: A fork of Microsoft's GraphRAG that swaps the OpenAI API for the Claude CLI as the model backend, with local embeddings via Ollama. Integrates as a pure adapter through GraphRAG's official ModelFactory API — no core framework code modified.
icon: i-lucide-network
---

## Overview
A fork of Microsoft's GraphRAG that replaces the entire OpenAI API surface with Claude — using the Claude CLI as the model backend rather than direct API calls. The adapter integrates through GraphRAG's official `ModelFactory` API, so no core framework code was modified. Local embeddings via Ollama keep data fully on-device; only LLM calls leave the machine.

## How It Works
GraphRAG expects models registered via `ModelFactory.register_chat()`. This project registers a `claude_code` type that routes requests through Claude CLI subprocesses with subscription auth (Claude Pro/Max). Because GraphRAG only accepts `api_key` or `azure_managed_identity` auth types, the adapter uses `azure_managed_identity` as a passthrough — actual authentication happens at the CLI layer, not the API layer.

Response format conversion is a key challenge: Claude returns natural language or markdown-wrapped JSON, while GraphRAG expects strict tuple delimiters (`<|>`, `##`) for entity extraction and structured JSON for community reports. A response formatter detects the output type and converts accordingly.

## Pipeline Architecture
1. **Entity Extraction** — Haiku (fast, cheap) identifies entities and relationships across document chunks
2. **Community Detection** — Clusters related entities into semantic groups
3. **Community Reports** — Sonnet generates structured summaries (title, rating, findings) for each community
4. **Embeddings** — `nomic-embed-text` via local Ollama; zero cost, fully private

## Query Modes
- **Global Search** — Community-based; map phase scores all reports for relevance, reduce phase synthesizes a comprehensive answer. Best for broad themes and summaries.
- **Local Search** — Entity-centric; embeds the query locally, searches entity/relationship neighborhood. Best for specific facts.
- **DRIFT Search** — Entity-to-entity traversal; default fallback when no mode specified.

## Performance
Real-world benchmark: 11-minute indexing run over 2 interview transcripts produced 78 entities and 6 community reports. Total cost: ~$2 in Claude subscription usage + $0 for embeddings.

## Technical Highlights
- **Pure adapter pattern** — No GraphRAG internals modified; integrates exclusively via public `ModelFactory` API
- **Subscription auth** — Works with Claude Pro/Max; no API keys required
- **Local embeddings** — `nomic-embed-text` via Ollama; data never leaves the machine
- **Multi-model strategy** — Haiku for extraction speed, Sonnet for report quality, Opus available for complex reasoning
- **Response format conversion** — Detects and converts community report JSON vs. entity tuple formats from Claude's natural language output
- **Cross-platform CLI discovery** — Finds Claude executable via dev workspace path, `~/.claude/local/claude`, system PATH, or bare fallback
- **94% test coverage** — 172/183 tests passing across contract, integration, and unit suites

## Tech Stack
Python, Microsoft GraphRAG 2.5+, Claude CLI (Pro/Max subscription), Ollama (`nomic-embed-text`), Pydantic 2, tqdm
