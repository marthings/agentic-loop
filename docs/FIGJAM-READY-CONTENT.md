# figma-make-jam – FigJam Starter Content (Copy-Paste Ready)

Use this to quickly build a test FigJam board on your free tier account.

**Board Title:**
figma-make-jam – Documentation & Architecture (TEST)

---

## 1. Top Metadata (create at the very top)

Use a horizontal layout of small text boxes or a single text block + emojis:

```
Project: figma-make-jam     |     Owner: Martin + Grok     |     Updated: 2026-06-29
Status: Early Experiment     |     Live Demo: http://localhost:5173
Repo: Local (figma-make-jam)     |     Goal: Test FigJam as source of truth
```

Add a couple of links as actual hyperlinks if possible.

---

## 2. Overview & Motivation

**Use a violet/purple-ish pale section color**

### Why this exists
We're experimenting with a new way of working:
**FigJam as the single source of truth for documentation** for a React app, combined with shipping implemented designs back into Figma.

Instead of scattered Notion docs, PR descriptions, and Figma comments, most planning, architecture, component contracts, and decisions live in one collaborative FigJam board.

### The loop we're testing
FigJam (intent & specs) → Code (faithful implementation) → Figma (shipped visual frames via prototype-to-figma)

Current phase: **Scaffolding + first test board**

---

## 3. Goals, Non-Goals & Success Metrics

**Use green section**

### Goals
- Validate a practical FigJam-first documentation workflow
- Keep decisions and specs where the team actually plans (whiteboard)
- Make traceability easy: code should link back to FigJam sections
- Successfully "ship" real UI from working code into structured Figma frames

### Non-Goals (v1)
- Not replacing a full production design system process
- Not trying to make FigJam pixel-perfect design files (Figma's job)
- Not building a production app yet — this is a workflow lab

### Success Metrics (stickies)
- Can go from idea documented in FigJam → working React code in < 1 day
- When we run prototype-to-figma, the output is recognizable and useful
- The FigJam board becomes the place people check first (instead of asking in chat)

---

## 4. Architecture & Tech Stack

**Use blue section**

### Current Stack
- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Design tokens**: CSS custom properties in src/index.css
- **Icons**: lucide-react

### Key files / entry points
- src/App.tsx — current demo UI
- src/index.css — tokens + base styles
- docs/ — local copies of workflow and specs

### Diagram note
[Add a simple diagram on the right: Browser box with "React App" containing "Demo UI" and "Component examples"]

---

## 5. Design Tokens & Theming

**Use teal/cyan section**

### Current Tokens (from code)
```
--fgm-bg
--fgm-bg-secondary
--fgm-text
--fgm-text-secondary
--fgm-border
--fgm-accent (#5b2eff)
--fgm-accent-light
--fgm-success
--fgm-warning

Radii: sm(6px), md(10px), lg(16px)
Spacing: 4px / 8px / 12px / 16px / 24px / 32px   (8px grid)
```

### Plans
- Map these to Figma Variables (manual first)
- Support light + dark mode (already partially in CSS)
- Future: one-way or two-way sync with design tokens

---

## 6. Component Library

**Use orange or indigo section**

Document the main building blocks.

### Button
- **File**: src/App.tsx (demo)
- **Variants**: primary, secondary
- **States**: default, hover, focus
- **Props ideas**: variant, size, disabled, loading, icon?
- **Notes**: Currently styled with .btn classes. Will be turned into real reusable component.

### Card
- **Current usage**: Main content containers in the demo
- **Visual**: white bg, border, rounded-lg (16px), padding 24px
- **Hover**: subtle shadow

### Badge
- Small pill labels (e.g. "COMPONENT", "EXPERIMENT IN PROGRESS")
- Background uses --fgm-accent-light, text --fgm-accent

### Status indicators
- Green dot = good
- Orange dot = partial / in progress

**Action**: Once we have more components, expand this section with exact API contracts.

---

## 7. Features & User Flows

**Current main flow (demo)**

1. User lands on page
2. Sees hero explaining the FigJam → Code → Figma concept
3. Sees the 3-layer workflow cards (clickable to highlight)
4. Sees live Implementation Status table
5. Sees the recommended FigJam structure

**Key states**:
- Default view
- After clicking a workflow step (highlights active)

**Future candidate flows**:
- Component Playground page
- Settings / preferences panel

---

## 8. Design Decisions Log

Use yellow section or individual colored stickies.

**Decision 1** – 2026-06-29
**Title**: Use FigJam as primary docs instead of Markdown + Notion
**Chosen**: Yes — because planning happens in whiteboards anyway
**Why**: Reduces duplication and makes decisions more visible
**Alternatives considered**: Keep using README + separate design doc

**Decision 2** – 2026-06-29
**Title**: Tailwind v4 + CSS custom properties for tokens
**Chosen**: Tailwind for speed + CSS vars for future Figma sync
**Impact**: All components should prefer the --fgm-* variables

**Decision 3**
**Title**: "Ship design" means using prototype-to-figma, not screenshots
**Chosen**: Structured Figma frames with annotations > flat images

---

## 9. Implementation Status (TABLE)

Create this as a real FigJam table or columns of stickies.

| Area                    | Status          | Code link          | Figma shipped? | Last synced | Notes                     |
|-------------------------|-----------------|--------------------|----------------|-------------|---------------------------|
| Workflow docs           | Stable          | docs/              | No             | 2026-06-29  | Good starting point       |
| React scaffold + demo   | Stable          | src/App.tsx        | No             | 2026-06-29  | Current demo visual       |
| Design tokens           | Partial         | src/index.css      | No             | 2026-06-29  | Basic set in place        |
| First real FigJam board | In progress     | This board         | N/A            | Today       | **We are here**           |
| Component library       | Not started     | -                  | No             | -           | Need to extract from demo |
| First feature flow      | Not started     | -                  | No             | -           | Pick one soon             |
| prototype-to-figma test | Not started     | -                  | -              | -           | Requires MCP connection   |

---

## 10. Open Questions & Risks (use pink/red stickies)

- How will we keep tokens in sync long-term?
- Should we add Storybook?
- What should the first "real" feature we run through the full loop be?
- Free tier limitations on FigJam files / collaboration?
- How do we handle temporary explorations that aren't ready for the board?

---

## Right Column – Diagrams

**Diagram 1: High Level Workflow**
Three big boxes in a flow:
[FigJam] → [React Code] → [Figma Design Frames]
With arrows and small labels underneath each.

**Diagram 2: Current App Architecture**
Simple box:
Browser
└── React 19 + Vite
    ├── Demo UI (status + workflow cards)
    └── Design Tokens (CSS vars)

**Diagram 3 (future)**: Component → Code → Figma component mapping

---

## Visual Tips for this board (follow these for consistency)

- Use **Section** nodes for main areas (not frames)
- Set section name to empty string (title lives inside as big text)
- Use pale background fills:
  - Violet/purple for Overview
  - Green for Goals
  - Blue for Architecture/Tokens
  - Orange/Yellow for Components + Decisions
  - White or very light for diagram areas on the right
- Keep generous spacing (similar to 64px between sections)
- Add the status table near the bottom so it's easy to update

---

## How to build this quickly

1. Create new FigJam file
2. Title it as above
3. Add metadata at top
4. Create sections left-to-right / top-to-bottom following the numbered list
5. Copy text from this file into the sections
6. On the right, draw 1-2 simple diagrams using shapes + connectors
7. Add the status table (you can make a FigJam table or use columns of text + shapes)

Once the board exists, paste the link here and we can refine it together, add more dummy decisions, or start the first real feature spec.

