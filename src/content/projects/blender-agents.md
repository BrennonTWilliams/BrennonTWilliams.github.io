---
title: blender-agents
category: Voice & Agents
status: active
order: 2
repo: https://github.com/BrennonTWilliams/blender-agents
summary: A production AI automation platform that runs Claude agents inside Blender for complex 3D tasks driven from natural language. A structured OODA loop autonomously executes 245 operations across 25 capability domains — modeling, rigging, materials, geometry nodes, and more.
svg: blender-agents.svg
cover: blender-agents.jpg
---

## Overview
blender-agents is a production-grade AI automation platform that runs Claude agents directly inside Blender to execute complex 3D tasks from natural language. It goes well beyond one-shot bpy scripting: a structured OODA (Observe-Orient-Decide-Act) loop drives autonomous, multi-step execution across 245 operations and 25 capability domains — modeling, materials, rendering, physics, animation, rigging, geometry nodes, grease pencil, and CAD/3D printing. Specialized pipelines handle complete character workflows including auto-rigging and 3D-to-2D sprite sheet conversion.

## Key Features
- **OODA agent loop** — Claude autonomously selects operations, executes them in Blender, observes resulting scene state, and iterates until measurable success criteria are met
- **245 operations across 25 domains** — full coverage of modeling, materials, rendering, physics, animation, rigging, geometry nodes, grease pencil, CAD/3D printing, and more; all auto-discovered from a capability registry
- **Specfile task system** — YAML task definitions separate *what* (technique families, phase boundaries, quality thresholds) from *how* (operation selection, iteration strategy), making complex workflows declarative and reproducible
- **Checkpoint/resume** — workflow state is persisted as a JSON snapshot after every operation; interrupted workflows resume from the exact point of failure across process restarts
- **Auto-rigging pipeline** — automatic Rigify metarig generation for T-pose characters, bone alignment via iterative optimization, and automatic weight painting with quality validation; supports human, cat, bird, wolf, horse, and more
- **3D-to-2D sprite conversion** — full pipeline from GLB import → Line Art modifiers → sprite baking → animation-ready PNG sheet generation
- **Quality gates & measurable success criteria** — phase-specific thresholds with type-safe measurable fields (vertex counts, triangle budgets); automatic retry with avoid-pattern constraints that steer the agent away from approaches that previously failed
- **RLM V3 hybrid context architecture** — minimal base context (~400 chars) plus 6 on-demand query sources (phase criteria, scene summary, operation list, recent history, guidance, constraints), giving the agent precise control over its own context window
- **Railway-oriented error handling** — `Result[T, E]` monad pattern throughout the codebase; no exceptions as control flow, explicit typed error propagation at every layer
- **3-tier evaluation framework** — 14 atomic specfile test cases, 5 multi-phase workflow tests, and 1 full end-to-end character pipeline for regression coverage

## Architecture
Seven-layer abstraction hierarchy with clear separation of concerns:

1. **CLI** — command routing and execution modes: `ooda`, `direct`, `direct-long`, `auto-rig`, `convert-to-2d`
2. **Workflow persistence** — YAML specfiles define task intent; JSON state files checkpoint execution progress
3. **AI integration** — Claude CLI integration, OODA prompt generation, natural-language-to-specfile generation
4. **Capability registry** — 245 operations organized in 25 domain registries, auto-discovered by metadata
5. **Core system** — `Result[T, E]` monad, base agent framework, async execution context
6. **Connection layer** — socket-based JSON-RPC for communicating with the Blender subprocess
7. **Blender bridge** — Blender addon that receives RPC calls and executes operations on the main thread via timer callbacks

## Tech Stack
Python 3.11+, Blender 5.0+ Python API (bpy), Rigify, Claude API, YAML, JSON, Socket JSON-RPC, Pytest, Pyright, Ruff

## Background
Built to solve the hard problem of making AI agents reliable in long-running, iterative, domain-specific workflows — not just issuing one-shot Blender scripts that frequently fail silently or produce incorrect geometry. The core insight driving the architecture is the specfile/OODA split: pre-specifying *what* success looks like (measurable criteria, phase boundaries, technique constraints) frees Claude to reason only about *how* to get there, dramatically improving reliability on complex tasks like character rigging or multi-phase scene construction that take 10+ minutes to execute.
