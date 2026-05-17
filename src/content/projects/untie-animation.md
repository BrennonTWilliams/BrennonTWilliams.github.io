---
title: UntieAnimation
category: Game AI
status: archive
order: 14
repo: https://github.com/BrennonTWilliams/untie-ai
summary: A Unity animation framework that decouples AI decisions from animation logic. The agent emits named actions; physics-aware blending, predictive transitions, and editor-driven configuration handle everything that follows.
svg: untie-animation.svg
---

## Overview
Traditional game animation setups hardwire behavior to visuals — changing how a character acts means touching both AI code and animation logic at the same time, in separate places. UntieAnimation breaks that coupling: the AI sends named decisions, and the animation system handles everything that follows. New characters, behaviors, and animation styles can be built entirely in the editor by composing configuration files, with no code changes required.

## Key Features
- **Independent animation layers** — upper body and lower body animate simultaneously without blocking each other, so a character can aim and strafe at the same time with no manual coordination.
- **Physics-aware motion blending** — movement looks natural because blend weights are calculated from actual velocity and turn rate each frame, rather than clamped to fixed animation states.
- **Predictive transitions** — the system starts a deceleration blend before a character physically stops, using remaining path distance to anticipate the stop ahead of time.
- **Hot-swappable animation sets** — switch between animation sets (unarmed, rifle, pistol) at runtime without visible restarts or animation glitches.
- **Fully editor-driven configuration** — every character, behavior, state, and parameter is defined through Unity asset files; adding a new character type requires no new code, only new assets.
- **Pathfinding-agnostic design** — animation observers react to movement events (destination reached, new path started) without any knowledge of which pathfinding system is in use.

## Background
The core design problem with traditional Unity animation setups is per-character manual wiring — transitions are hardcoded, parameter names are scattered across scripts, and any behavior change risks breaking animation logic. For AI-controlled characters, this friction compounds: the agent layer and the visual layer are too tangled to change independently.

UntieAnimation treats animation as a pure output layer. Agent decisions flow in as named actions; the animation system converts them into motion entirely on its own. Neither side has any knowledge of the other's internals, so both can change independently.

## Tech Stack
C#, Unity, Mecanim, ScriptableObjects, Final IK, Kinematic Character Controller, NodeCanvas
