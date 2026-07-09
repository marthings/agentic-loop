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
| Home / Task List | `/` | `src/App.tsx` — `currentView === 'list'` (incl. multi-select bulk delete w/ in-app confirm #13, due-date sort #4, label filter #5; Sidebar instance, active All Tasks) | [node 252:368](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=252-368) |
| Home / Task List + success banner | `/?view=list&success=1` | `src/App.tsx` — list after create modal submit; success feedback banner visible (#11; seed for capture) | [node 253:368](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=253-368) |
| Home / Task List + bulk delete confirm | `/?view=list&bulkDelete=1` | `src/App.tsx` — `currentView === 'list'` with all tasks selected + bulk-delete `alertdialog` open (#13; seed for capture) | [node 254:368](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=254-368) |
| Home / Task List + create modal | `/?create=1` (legacy `/?view=create`) | `src/App.tsx` — list view with centered `<dialog>` open (`openCreateModal`; labels #5, Dropdown #45, due-date hint #9, inline validation #10) | [node 255:368](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=255-368) |
| Task Detail | `/?view=detail` · `/?share=…` | `src/App.tsx` — `currentView === 'detail'` (Share link, labels #5, Dropdown #45, due-date hint #9) | [node 256:368](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=256-368) |
| Settings | `/?view=settings` | `src/App.tsx` — `currentView === 'settings'` (incl. dark mode toggle, default status uses Dropdown #45) | [node 257:368](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=257-368) |
| History & Stats | `/?view=history` | `src/App.tsx` — `currentView === 'history'` (status breakdown #30 + due-date insights #31 + activity #33) | [node 258:368](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=258-368) |
| Labels | `/?view=labels` | `src/App.tsx` — `currentView === 'labels'` (label overview + click chip → `/?view=list&label={name}`; #61) | [node 227:68](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=227-68) |

All frames are bound to the variables/text styles **and componentized** where applicable.

**Interaction annotations (#61):** The Labels frame has native Dev Mode annotations — frame-level flow summary (blue **Interaction**) plus per-chip click → list-filter notes. Tag chips remain raw captures with orange **DS drift** notes (Tag not yet in componentize CONFIG). 

**Overlays pattern:** For transient layers like success banners or bulk-delete confirm, capture the main view + seeded overlay state separately. **Captured frames must contain only the pure design** — no text or extra descriptions inside the frames. Place overlay frames **below** the main row (217:69 at y=913 below 216:69; 218:69 bulk-delete at x=1600, y=913). Only core views use the standard left-to-right layout. All notes go in this file and FigJam. See skill `capture.md`.

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
| SidebarNavItem | `src/components/SidebarNavItem.tsx` | [251:399](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=251-399) (State=Default/Active/Hover, TEXT `Label`) | `SidebarNavItem.figma.tsx` |
| Sidebar | `src/components/Sidebar.tsx` | [251:472](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=251-472) (composes 4× SidebarNavItem; per-item State set in seam) | `Sidebar.figma.tsx` |

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

_Last updated: 2026-07-09_ (Re-captured after SidebarNavItem #71; Sidebar composes 4× SidebarNavItem with per-frame Active state in seam.)_
