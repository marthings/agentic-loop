# FigJam-Driven Loop — Compact Checklist

**One rule:** Nothing gets built until it is planned in FigJam (name + requirements + user stories on the sitemap).  
**Authority:** FigJam (docs & specs) → Figma (design & tokens) → Code (implementation).

## High-Level Flow

```
Plan in FigJam   →   Build in Code   →   Capture to Figma   →   adjust in Figma
     ▲──────────────────────────────────────────────────────────────┘
```

## Mode B — The Loop (for an existing page or change)

### 0. Backlog
- Pick the issue, move to **In Progress** on the GitHub Project board.
- `design`-labeled? Verify the referenced Figma nodes still exist first.
- Create short-lived branch from updated `main`:
  ```bash
  git switch main && git pull --ff-only
  git switch -c codex/issue-N-short-name
  ```

### 1. FigJam (Plan) — do this *before* writing code
- Add or update the page in the sitemap + spec section (name, route, `Requirements`, `User stories`, connector).
- Small refinement / consistency fix? Add 1–2 bullets to the existing page section + log a dated decision in the **Project** zone.
- Log notable decisions in the Project zone.
- Reference the issue number.

### 2. Code (Build)
- Implement faithfully to the FigJam spec.
- Make the view **deep-linkable** from a cold URL (`?view=...`).
- Update `docs/MAPPING.md`.
- **Run verify** (see below).

### 3. Figma (Capture)
- Start dev server.
- Temporarily add the capture script to `index.html` (remove it afterwards).
- Capture views **one at a time** (foreground tab only) using `generate_figma_design`.
- **Re-capture?** Run the full seam in order for each frame:
  1. `seam-swap.js` (delete stale, rename/position new, strip overlays)
  2. `bind-and-style.js`
  3. `componentize.js` (update CONFIG for composites if needed)
  4. `docs/scripts/sidebar-swap.js` (Sidebar instance + set each `SidebarNavItem` child `State` from `ACTIVE_LABEL`)
- **Immediately** update `docs/MAPPING.md` with the new node IDs from the capture response.
- **Run verify**.

**Overlays & transient UI (banners, toasts, highlights):** Capture the main view in default state + a seeded state with the banner visible (e.g. `/?view=list&success=1`). Captured frames must contain **only the pure design** — no text or extra descriptions inside the frames. Place the overlay frame **below** the main artboard (second row). Only core views use the standard left-to-right layout. Update MAPPING.md and FigJam spec only. See `capture.md` (in skill) for the pattern. In this project, the success banner frame is below the main Task List (162:20 below 150:20).

### 4. Ship
- Commit: short, imperative, references the issue (`Unify selects to Dropdown (closes #45)`).
- Push + `gh pr create ... --body "Closes #N"`.
- Human merges (squash only). Branch is deleted.
- **Capture deferred?** At merge time, file a follow-up `design` issue: `Re-capture frames after … (#N)`,
  `Depends on #N`, checklist of frames from `MAPPING.md`. See `WORKFLOW.md` → *Code merged without capture*.
  Example: #49 follows #47.

## Must-Do Habits at the Seams

- **Update MAPPING.md** right after every capture + seam pass (use the exact node-id from the tool).
- **Run verify**:
  - After code changes (before capture)
  - After capture / re-capture + seams
  - After token sync or component changes
- **Land first.** Never run parallel branches that touch the same files. Use `Depends on #N`.
- Remove capture.js before shipping.

## Quick Verify Checklist (run at seams)

- Components: Figma property definitions match code + `.figma.tsx` mapping?
- Tokens & text styles: names/values match code? Frames are bound?
- Mapping integrity: every node-id in MAPPING still exists and points to the right thing?
- Report ✅ / ⚠️ + which side is canonical (Figma for design/tokens by default).

## Common Gotchas

- **Code merged without capture** → file a `design` follow-up issue at merge (batched frame checklist).
  Don't rely on PR comments or `MAPPING.md` notes alone.
- Capture is always a **cold** URL → deep-linkable state is required.
- Re-capture **wipes** bindings, styles, and component instances → re-run the full seam.
- Node IDs change on re-capture → update MAPPING immediately.
- Form values and some controls often don't survive capture.
- Browser extension overlays get captured → seam-swap strips the common ones.

## Inbound / Reverse Flow (design → code)

When design, tokens, or QA find issues, they become GitHub issues (the single queue) and flow back through the loop.

**Compact flow:**
1. **Token/component drift** (from verify): Create deduped issue "Sync code to Figma: <thing>" labeled `design`/`tokens`. Do this deliberately, not on every verify.
2. **Frame review / consistency** (from Figma changes): Designer shares frame URL. Read with `get_design_context` + `get_screenshot`, compare to code + MAPPING, propose issues. Designer approves before filing. Label `design`. Use the templates in the skill's `references/inbound-issues.md`.
3. **QA / usability findings**: Direct to labeled issues (`qa`/`usability`/`bug`).
4. Always verify node liveness before picking up a `design` issue (stale ids after re-captures).

See the skill's `references/inbound-issues.md` for full details and templates.

## One-Page References (read when you need depth)

- `capture.md` (seam details)
- `componentize-capture.md` (component matching rules & CONFIG)
- `build-sitemap.md` (FigJam board structure + decision logging)
- `inbound-issues.md` (how design changes become GitHub issues)
- `sync-tokens.md` / `bind-variables.md` (token bridge)
- `components-code-connect.md` (component contracts + verify details)

**Keep this checklist open while running the loop.** It is deliberately short so you can follow it without getting lost in the detailed references.
