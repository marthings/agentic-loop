# FigJam Board Structure — Source of Truth

This document defines the canonical sections and content we want in the FigJam board that serves as documentation for figma-make-jam.

When the Figma MCP is connected, we can use this as input to `generate-project-plan` or build it section-by-section with `use_figma` + diagram tools.

---

## Board Metadata (top strip or intro)

- **Project**: figma-make-jam
- **Purpose**: Documentation + planning source of truth for the React app
- **Links**:
  - GitHub repo
  - Live preview (when deployed)
  - Companion Figma Design file(s)
  - This repo's `docs/` folder (backup)
- **Last updated**: (date)
- **Owners**: (you + any collaborators)

---

## Recommended Sections (left column)

### 1. Overview & Motivation
- Short compelling description of the experiment.
- Why FigJam-first + still shipping to Figma.
- Current phase (scaffolding / first feature / iterating workflow).

### 2. Goals, Non-Goals & Success Metrics
**Goals** (examples):
- Validate a practical FigJam → Code → Figma loop
- Keep documentation where planning happens (whiteboard)
- Produce reviewable, structured Figma output without manual redrawing
- Make the relationship between decisions and implementation obvious

**Non-Goals**:
- Not a replacement for a full design system process
- Not trying to make FigJam the pixel-perfect visual source (that's Figma)
- Not full CI/CD or production app (for now)

**Success Metrics**:
- Time to go from idea in FigJam → working code
- Fidelity of prototype-to-figma output vs original implementation
- How often the team refers to the FigJam board vs scattered docs

### 3. Architecture & Tech Stack
- Simple architecture diagram (client only for now, or add API layer later)
- Stack:
  - React 19 + Vite + TS
  - Tailwind v4
  - Future: possible Storybook, design token pipeline, etc.
- Folder conventions and key entry points

### 4. Design Tokens & Theming
- Current token set (from `src/index.css`)
- Mapping plan to Figma Variables
- Light / Dark handling
- Spacing scale (8pt grid)
- Future: how we will keep them in sync (manual first, then automated)

### 5. Component Library
This is critical.

For each significant component, document:
- Name + file location
- Purpose / when to use
- Props / Variants (with clear names)
- States (default, hover, focus, disabled, loading, error…)
- Visual rules (if any not obvious from tokens)
- Accessibility notes
- FigJam representation: simple frame or just very clear text spec + example

Example starter list:
- Button (primary / secondary / ghost + sizes)
- Card
- Badge
- Input / Form primitives
- Status indicators
- Navigation elements (if we add any)

### 6. Features & User Flows
One top-level section per major area, or use nested sections.

Inside each:
- Description
- Key screens / states
- Flow diagram (connectors)
- Edge cases & error states
- Links to code implementation
- Link to shipped Figma frames (once created)

Initial candidate flows (we can evolve):
- Main demo / status view
- Component explorer (if built)
- Any settings or preference flow

### 7. Design Decisions Log
Chronological or grouped.

Format per decision:
- Date
- Decision title
- Context / problem
- Chosen option
- Alternatives considered (brief)
- Link to deeper discussion (if any)
- Impacted areas (components, flows, architecture)

### 8. Implementation Status (Table – very useful)

Columns:
- Area / Feature
- FigJam section
- Code status (Not started / In progress / Stable)
- Figma shipped? (link or "no")
- Last sync date
- Notes / Open items

This table is one of the highest-leverage things on the board. Update it often.

### 9. Open Questions & Risks
- Use orange or red-tinted stickies or a dedicated section.
- Anything that blocks progress or needs input from others.

---

## Right Column — Diagrams

Use the right side for larger visual artifacts:

- High-level architecture diagram
- Main user flow diagram(s)
- Component anatomy / variant matrix (if useful)
- Data model (if we add backend concepts later)
- "Current vs Target" if we do workflow evolutions

Use `generate_diagram` where appropriate once the skill is active.

---

## Visual Style in FigJam (recommended)

Follow the style from `generate-project-plan` references when possible:
- Pale colored sections for content (different hue per major topic)
- Clean H2 headers inside sections (no section title bar label)
- Consistent typography
- White diagram sections on the right

---

## How to bootstrap this board

**Option A (preferred when MCP works)**:
1. Load `generate-project-plan`
2. Use the content of this file + `WORKFLOW.md` as the "PRD" + codebase context
3. Go through the interactive steps and generate the board

**Option B**:
- Manually create a new FigJam file
- Create sections following the list above
- Copy key content from this markdown
- Use Figma's text + sticky + connector tools
- Add a metadata header at the top

**Option C** (hybrid):
- Create skeleton manually
- Then use targeted `use_figma` scripts to fill structured parts (tables, decisions, status)

---

## Maintenance

- After any significant work session, spend 5 minutes updating the board:
  - New decision?
  - Status table row changed?
  - New component added to code → document the contract in the Component Library section
- Before shipping a flow to Figma, make sure the relevant FigJam section is up to date.

This keeps the board as actual source of truth instead of becoming stale.
