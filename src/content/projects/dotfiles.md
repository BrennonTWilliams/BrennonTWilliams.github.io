---
title: dotfiles
category: Infrastructure & Dev Environment
status: Active
repo: https://github.com/BrennonTWilliams/dotfiles
summary: A cross-platform development environment framework managed with GNU Stow — every tool from terminal emulator to shell prompt is tuned together with a unified Gruvbox theme, conflict-resolving install, and a sub-50ms shell startup target.
icon: i-lucide-terminal
---

## Overview
A cross-platform development environment framework managed with GNU Stow — not just a config dump. Every tool from terminal emulator to shell prompt is tuned together with a unified Gruvbox theme, shared keybinding muscle memory, and a bootstrap system that sets up a new machine from scratch, handles conflicts intelligently, and validates the result with a post-install health check.

## Key Features
- **Starship prompt build system** — Modular source files (`formats/`, `modules/`, `modes/`) compiled by a 361-line build script into 5 switchable prompt modes (compact, standard, verbose, gruvbox-rainbow, gruvbox-rainbow-light) with TOML validation on each build
- **Smart installation with conflict resolution** — `install.sh` (502 lines) backed by a `conflict-resolution.sh` library (21KB) that detects GNU Stow conflicts, shows side-by-side diffs via `delta`, and merges known config types (gitconfig, shell, TOML/YAML) before symlinking; automatic backup to timestamped directory
- **Cross-platform shell abstraction** — `zsh_cross_platform` (940 lines) detects OS, Linux distro, desktop environment (Sway/Wayland/X11/i3), and active terminal at runtime; resolves 21 platform-specific paths (Homebrew, npm, conda, etc.) into a cached associative array for O(1) lookup
- **Performance-optimized shell startup** — targets <50ms; lazy-loads conda (saves 100–200ms), caches VSCode shell integration, and conditionally loads a 162-abbreviation system (`DOTFILES_ABBR_MODE`) organized across 8 files
- **WezTerm config with Kitty keyboard protocol** — 867-line config with 30+ keybindings, automatic dark/light Gruvbox theme switching via `wezterm.gui.get_appearance()`, pane management that mirrors tmux muscle memory, and Kitty keyboard protocol enabled for Neovim 0.10+ (correctly distinguishes Esc vs Ctrl+[, Tab vs Ctrl+I)
- **Neovim with multi-LLM AI integration** — CodeCompanion.nvim configured with two adapters: Anthropic API (Claude) and Mercury-2 via Inception Labs; LSP auto-install via Mason (lua_ls, ts_ls, pyright), Treesitter, Zen Mode, and Telescope fuzzy finder
- **Health check and recovery system** — `health-check.sh` (434 lines) validates every major component post-install (shell paths, terminal configs, packages, LSP, Starship); `recover.sh` (600 lines) restores from any timestamped backup interactively
- **Pre-commit ShellCheck hook** — runs ShellCheck on all staged shell scripts with colored pass/fail output and graceful fallback when ShellCheck isn't installed

## Tech Stack
Lua, Shell (zsh/bash), TOML, GNU Stow, Starship, Neovim, WezTerm, Ghostty, tmux, Homebrew (Brewfile, 100+ packages)
