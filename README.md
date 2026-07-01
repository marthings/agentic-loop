# figma-make-jam

**FigJam → Code → Figma**

This is an experimental workspace to treat **FigJam as the primary source of truth** for documentation, architecture, decisions and component contracts for a React application — while still shipping high-fidelity, reviewable designs into Figma.

## The intended loop

1. **FigJam** — Collaborative planning and living documentation (architecture, flows, specs, tradeoffs).
2. **Code** (this React app) — Faithful implementation of the documented intent.
3. **Figma** — "Ship design" step: use the running code + `prototype-to-figma` to generate structured Figma frames for handoff, review, and canonical design system maintenance.

The goal is to find a lightweight, sustainable workflow where FigJam stays the place teams go for "why and how we decided", the React codebase is the executable truth, and Figma remains excellent for visual assets and cross-functional review.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 to see the current demo UI (a small living status board for the workflow itself).

## Project layout

- `src/` — The React implementation layer
- `docs/` — Local mirrors and specs (FigJam structure, workflow details, tokens)
- `README.md` — This file (high-level)
- `docs/WORKFLOW.md` — Detailed process, rules, and sync practices
- `docs/FIGJAM-BOARD.md` — The proposed content + structure for the canonical FigJam board

## Current status (as of 2026-06-29)

- React + Vite + TS + Tailwind scaffolded
- Design tokens started in CSS (intentionally aligned with what we will map to Figma Variables)
- Demo UI that illustrates the three-layer model
- Workflow and FigJam board structure documented locally

## Next steps (we'll do together)

- [ ] Flesh out first real features in the demo app (so we have something concrete to document + ship)
- [ ] Connect Figma MCP server (in your client)
- [ ] Generate the official FigJam board using the structure in `docs/FIGJAM-BOARD.md` (via `generate-project-plan` skill or manual)
- [ ] Implement a small feature fully through the loop: document in FigJam → code → ship via prototype-to-figma
- [ ] Define token + component sync strategy (Figma Variables ↔ code)

## Useful links

- **Todo App — Project board (FigJam, source of truth):** https://www.figma.com/board/Qyo8JqnW7hQ4neaBAzG9K9
- **Mapping (board ↔ Code ↔ Figma):** [`docs/MAPPING.md`](docs/MAPPING.md)
- **Workflow (super basic):** [`docs/WORKFLOW.md`](docs/WORKFLOW.md)
- **Figma design file (captured screens):** https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF
- Deployed preview: *(TBD)*

---

This repo itself is the first "product" we're using to validate the workflow.
