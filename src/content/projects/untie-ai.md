---
title: UntieAI
category: Game AI
status: archive
order: 13
repo: https://github.com/BrennonTWilliams/untie-ai
summary: A C# Utility AI framework for Unity that replaces behavior trees and FSMs with a composable scoring pipeline. Pairs with an Influence Mapping layer for spatial reasoning so agents weigh regions of the world, not just direct object relationships.
icon: i-lucide-brain
cover: untie-ai.jpg
---

## Overview
UntieAI is a C# Utility AI framework for Unity that replaces behavior trees and FSMs with a composable scoring pipeline: sensor inputs are normalized, shaped by response curves, and scored against weighted utility functions to produce emergent, context-aware decisions. It pairs with a Spatial Intelligence layer built on Influence Mapping — grid-based float arrays where entity influence radiates outward and accumulates additively, letting agents reason about regions of the game world rather than just direct object relationships.

## Key Features
- Hierarchical decision pipeline (AIBrain → Behavior → Reasoner → Option → Consideration) fully defined as ScriptableObjects — designer-configurable without recompilation
- Response curve library with 10+ curve types (linear, logistic, logit, sine, parabolic, normal distribution, bounce) for shaping how sensor inputs map to utility scores
- Radial influence propagation with additive multi-source accumulation — threat density and spatial opportunity emerge from overlapping stamps, not explicit rules
- Future-position prediction: moving entities are stamped at both current and predicted next-cell positions, enabling anticipatory spatial threat modeling
- Multi-faction influence maps with map compositing (`AddMap`) and sub-map extraction (`GetSubMap`) for localized spatial queries
- Lazy sensor caching with per-frame timestamp tracking — expensive inputs (e.g., visible enemy counts) are computed once and reused across all considerations
- Real-time editor gizmo overlay with configurable visualization modes (tiles, stamps, entity positions, boundary markers) for inspecting spatial reasoning during play

## Tech Stack
C#, Unity, URP

## Background
Built to move past the rigidity of behavior trees — where every edge case requires a new branch — and FSMs, which collapse when agents need to weigh competing priorities simultaneously. Influence mapping shifts spatial reasoning from "which object do I target?" to "which area of the world is most advantageous?", producing more natural and tactically interesting agent behavior.
