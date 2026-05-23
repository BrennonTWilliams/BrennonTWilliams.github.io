---
title: deep-codebase
category: AI & Dev Tooling
status: active
order: 4
website: https://deep-codebase.com
summary: A CLI tool that uses Tree-sitter parsing and Claude AI to extract working implementations and map architectures from any open-source codebase. Produces byte-accurate snippets, dependency chains, and integration notes — built for developers who need code, not documentation.
icon: i-lucide-search-code
svg: deep-codebase.png
cover: deep-codebase.jpg
---

## Overview

deep-codebase is a CLI tool that uses AI to extract working implementations and map architectures from any public open-source codebase. Built for developers who need production-ready code — not documentation — it combines Tree-sitter structural parsing with Claude AI to deliver byte-accurate snippets, dependency chains, and integration notes, ready to drop into your project.

*"For developers who need working code from open-source projects, not just documentation."*

## How It Works

Two primary commands serve distinct use cases:

- **`extract`** — Implementation extraction mode. Finds the code you need, traces its dependencies, and outputs integration-ready snippets with call-flow context. (default: 20 snippets)
- **`analyze`** — Architecture learning mode. Maps design patterns, data flows, and system structure for understanding how a codebase is built. (default: 3 snippets)

Analysis runs through a 6-stage async pipeline:
1. **Repository** — Clone with optional sparse checkout (60–90% size reduction for large monorepos)
2. **Parsing** — Multi-language Tree-sitter ASTs (~35–50% faster than alternatives)
3. **Pattern Detection** — Identify 12+ architectural and design patterns
4. **Data Flow Analysis** — Track data movement and flag security implications
5. **AI Analysis** — Multi-provider inference with intelligent fallback
6. **Report Generation** — Markdown, JSON, or HTML output

## Key Features

- **Intelligent snippet selection** — Hybrid TF-IDF semantic scoring + call graph dependency tracking cuts token waste by up to 90%
- **Checkpoint/resume** — Never lose progress; large codebase analyses can resume mid-run
- **Progressive streaming** — See results in real-time as each stage completes
- **Multi-provider AI** — Claude CLI (default), BAML-compatible local models (LM Studio, Ollama), or auto-fallback
- **Adaptive confidence refinement** — Analysis loops until 95% confidence plateau, then early-stops
- **Architecture diagram generation** — Auto-generates state graphs, data flow, and optimization pipeline visuals
- **Security scanning** — Built-in vulnerability detection and secret identification with file:line attribution
- **Query templates** — Save and reuse analysis queries across repos
- **Comparative analysis** — `batch` and `compare` commands for multi-repo side-by-side analysis
- **18-language support** — Python, TypeScript, TSX, Vue, Go, Rust, Java, Kotlin, Swift, C/C#/C++, and more

## Example Queries

```bash
# Extract an implementation for direct integration
deep-codebase extract https://github.com/auth0/node-jsonwebtoken "JWT token creation and validation"

# Understand how a system is architected
deep-codebase analyze https://github.com/facebook/react "How does the virtual DOM reconciler work?"

# Discover what's extractable from a repo
deep-codebase extractable https://github.com/All-Hands-AI/OpenHands

# Watch mode for continuous analysis during development
deep-codebase watch https://github.com/some/repo "rate limiting middleware"
```

## Tech Stack

**Core**: Python 3.9–3.12, Click, Rich (terminal UI), Pydantic
**Parsing**: Tree-sitter + tree-sitter-languages (18 languages)
**AI**: Claude API via Claude CLI, BAML (local model support)
**ML/Semantic**: scikit-learn (TF-IDF), sentence-transformers, FAISS (similarity search)
**NLP**: spaCy (query intent parsing)
**Graph Analysis**: NetworkX (call graphs, dependency tracing)
**Infrastructure**: GitPython, aiofiles, Watchdog (watch mode), Microsandbox (runtime execution)
