---
title: MC-Vault
category: Infrastructure & Dev Environment
status: active
order: 6
summary: A custom Obsidian knowledge base built on a hybrid LYT/PARA structure. 39+ automation scripts and 11 background macOS services continuously sync the vault with GitHub activity, Raindrop bookmarks, and Claude Code sessions.
icon: i-lucide-vault
---

## Overview
MC-Vault is a custom Obsidian knowledge base built on a hybrid LYT/PARA structure and powered by 39+ automation scripts and 11 background macOS services that continuously sync the vault with GitHub activity, Raindrop bookmarks, and Claude Code sessions. The automation layer turns a passive note archive into an active, self-organizing knowledge system.

## Key Features
- Rule-driven inbox router (`inbox_watcher.py`) with YAML-configured priority tiers, conflict detection, and misroute auditing — auto-sorts dropped files to the correct project or topic folder without manual intervention
- Multi-source daily note injection: GitHub commits, Raindrop bookmarks, and Claude Code session summaries all flow into dated daily notes via marker-based content injection
- AI-assisted note transformation via `process-raw.py`: raw source files processed through the Claude CLI into structured summary, entity, and concept notes using a configurable extraction schema
- NLP link suggestion engine (`suggest-links.py`) computes pairwise Jaccard similarity across ~1,900+ vault notes to surface non-obvious connections and populate `## Related` sections
- Git-based vault backup (`vault_backup.py`) with auto-generated semantic commit messages that categorize changed files by type (Daily Notes, Scripts, Work, etc.)
- Unified service management CLI (`vault_services.py`) controls all 11 launchd background services — start, stop, restart, and tail logs from a single interface

## Tech Stack
Obsidian, Python, Shell scripting, Dataview, Templater, launchd, Claude CLI
