# Project Rules (CLAUDE.md)

## Project Overview

- Repo: Pixel Morph Ecosystem (像素风开放世界变形生物链小游戏)
- Status: Early stage (PRD-only, no implementation yet)
- Source of truth for requirements: `PRD.md`

## Read First

- `PRD.md` — product requirements and scope
- `README.md` — repo intro (minimal for now)

## Tech Stack

- Not locked yet.
- See `PRD.md` for suggested stack (Canvas + PixiJS/Phaser + TypeScript + Vite).
- Final stack decisions should be recorded in this file once chosen.

## Repo Structure

- `PRD.md` — requirements
- `README.md` — summary
- `CLAUDE.md` — project rules (this file)

## Development Workflow

- Use `PRD.md` to drive planning.
- Create feature plans under `.agents/plans/` (when the workflow kit is installed).
- Implement in small, validated steps; keep commits atomic.

## Testing & Validation

- No tests yet.
- Once stack is chosen, define:
  - build command
  - test command
  - lint/format command

## Conventions (Initial)

- Keep logic simple and deterministic (MVP focus).
- Favor readability over cleverness.
- Document any non-obvious gameplay rules in comments or docs.
