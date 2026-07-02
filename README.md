# agentic-loop

**FigJam → Code → Figma** — an experiment in a governed, repeatable product loop, demoed with a small **Todo App**.

## The loop — who owns what

- **FigJam** — source of truth for **documentation & specs** (the project board: sitemap flow + per-page requirements & user stories).
- **Code** (this repo) — the executable implementation. We iterate here first.
- **Figma design file** — source of truth for **design & tokens** (captured screens; color / spacing / radius / typography variables + text styles).

Authority: **FigJam → Design → Code.** Build in code, port into the design file (capture + token/style sync); manual Figma edits flow back to code.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5174 for the Todo App demo.

## Backlog

Tracked as GitHub Issues on the **Agentic workflow** project board:
https://github.com/users/marthings/projects/1

## Project layout

- `src/` — React app (Vite + TS + Tailwind); `src/components/` — Button, Card, StatusBadge (+ Code Connect)
- `docs/` — workflow, mapping (board ↔ code ↔ Figma), design tokens
- `.claude/commands/verify-figma.md` — read-only drift check (code ↔ Figma)

## Links

- **Project board (FigJam):** https://www.figma.com/board/Qyo8JqnW7hQ4neaBAzG9K9
- **Design file (Figma):** https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF
- **Backlog (GitHub Project):** https://github.com/users/marthings/projects/1
- **Mapping:** [`docs/MAPPING.md`](docs/MAPPING.md)
- **Workflow:** [`docs/WORKFLOW.md`](docs/WORKFLOW.md)
- Deployed preview: *(TBD — see backlog)*

The workflow document also defines the Git policy: one issue per short-lived branch, squash-only
pull request merges, rebasing onto `main`, and automatic branch cleanup.
