# Mapping — Sitemap ↔ Code ↔ Figma

The single pointer file. Each sitemap page ties to its code and (later) its Figma frame.
Process is in [`WORKFLOW.md`](./WORKFLOW.md): **add page to FigJam → write code → capture into Figma.**

## Sources

- 📋 **Todo App — Project board** (FigJam, source of truth for docs & specs): https://www.figma.com/board/Qyo8JqnW7hQ4neaBAzG9K9 — zones: Project · Sitemap (flow) · Page specs
- 🗂️ **Backlog**: GitHub Project "Agentic workflow" (Issues) — https://github.com/users/marthings/projects/1
- 💻 **Code**: this repo — `src/App.tsx`
- 🎨 **Figma design file** (captured screens): https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF
- 🎟️ **Design tokens ↔ Figma**: collections **Color** (Light/Dark), **Spacing**, **Radius**, **Font Size**, **Line Height** + six **text styles** (Display/Title/Heading/Body/Label/Caption) in the design file (canonical for tokens). Captured screens are **bound** to them — fills/strokes/radii reference the variables; text nodes use the styles. Code mirror in `src/index.css`. See [`design-tokens.md`](./design-tokens.md).

## Pages

| Page | Dev URL | Code | Figma frame |
|------|---------|------|-------------|
| Home / Task List | `/` | `src/App.tsx` — `currentView === 'list'` (incl. multi-select bulk delete, due-date sort #4, label filter #5) | [node 150:20](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=150-20) |
| Home / Task List + success banner | `/?view=list&success=1` | `src/App.tsx` — `currentView === 'list'` with success feedback banner visible (from #11; seed for capture) | [node 174:20](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=174-20) |
| New Task | `/?view=create` | `src/App.tsx` — `currentView === 'create'` (incl. labels input #5, status uses Dropdown #45) | [node 151:20](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=151-20) |
| Task Detail | `/?view=detail` · `/?share=…` | `src/App.tsx` — `currentView === 'detail'` (incl. Share link, labels input #5, status uses Dropdown #45) | [node 152:20](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=152-20) |
| Settings | `/?view=settings` | `src/App.tsx` — `currentView === 'settings'` (incl. dark mode toggle, default status uses Dropdown #45) | [node 117:2](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=117-2) |
| History & Stats | `/?view=history` | `src/App.tsx` — `currentView === 'history'` (status breakdown #30 + due-date insights #31 + activity #33) | [node 118:2](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=118-2) |

All frames are bound to the variables/text styles **and componentized** where applicable. 

**Overlays pattern:** For transient layers like success banners, capture the main view + seeded overlay state separately. **Captured frames must contain only the pure design** — no text or extra descriptions inside the frames. Place the banner frame **below** the main one (see 162:20 below 150:20). Only core views use the standard left-to-right layout. All notes go in this file and FigJam. See skill `capture.md`.

When a new page is added to the sitemap, add a row here. After re-capturing, the frame node id may change — **update the link immediately** using the exact node-id from the capture response. Then run verify. Treat this as the final step of any capture work.

## Components (code ↔ Figma ↔ Code Connect)

Reusable components live in `src/components/`, are built as real Figma components (variant sets bound to our variables/text styles), and are linked with Code Connect files.

| Component | Code | Figma node | Code Connect |
|-----------|------|------------|--------------|
| Button | `src/components/Button.tsx` | [20:7](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=20-7) (Primary/Secondary) | `Button.figma.tsx` |
| Card | `src/components/Card.tsx` | [23:2](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=23-2) | `Card.figma.tsx` |
| StatusBadge | `src/components/StatusBadge.tsx` | [23:10](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=23-10) (Todo/In Progress/Done) | `StatusBadge.figma.tsx` |
| Dropdown | `src/components/Dropdown.tsx` | [106:20](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=106-20) (Closed/Open, TEXT prop `Label`) | `Dropdown.figma.tsx` |
| Tag | `src/components/Tag.tsx` | [147:24](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=147-24) (Default/Selected, TEXT prop `Label`) | `Tag.figma.tsx` |

**This table + the `.figma.tsx` files are our canonical mapping** — they don't depend on Code Connect
being enabled. The `.figma.tsx` files are precise and machine-readable even unpublished (component →
node URL + variant/prop mapping). Keep them honest with a **verify pass**: read the Figma component's
property definitions via the MCP and diff against the code prop unions + the `.figma.tsx` enum maps.
Last verified consistent (Button `Variant`=Primary/Secondary, StatusBadge `Status`=Todo/In Progress/Done).

**Code Connect (optional upgrade):** the in-Figma Dev-Mode display is **gated** — it requires an
Organization/Enterprise plan with a Dev or Full seat (this file is on a Pro team). When available:
`npx figma connect publish` (needs `@figma/code-connect` + a `FIGMA_ACCESS_TOKEN`). The `.figma.tsx`
files are already in the right format; nothing to rewrite. They're excluded from the app build via
`tsconfig.app.json`.

_Last updated: 2026-07-07_ (unified status selects to Dropdown in forms, #45)
