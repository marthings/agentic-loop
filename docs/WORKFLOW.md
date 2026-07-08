# Workflow — super basic

**One loop, three steps:**

```
1. FigJam sitemap   →   2. Code   →   3. Figma design file
   (plan the page)       (build it)     (capture the result)
```

## The rule

**Nothing gets built until it's a page on the sitemap.**

When we want a new page, we say *"add a page called X"* and it goes on the FigJam sitemap **first** — with a name, simple requirements, and a user story or two. Only then do we write code. After the code works, we capture it into the Figma design file.

## The three sources

| Step | Where | Source of truth for |
|------|-------|----------------------|
| 1. **Plan** | [Todo App — Project board (FigJam)](https://www.figma.com/board/Qyo8JqnW7hQ4neaBAzG9K9) | **Documentation & specs** — project overview, sitemap flow, per-page requirements & user stories. (Backlog lives in [GitHub Issues / Project](https://github.com/users/marthings/projects/1).) |
| 2. **Build** | This repo — `src/App.tsx` | The executable implementation (we iterate here first) |
| 3. **Design** | [Figma design file](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF) | **Design & tokens** — captured screens, color/spacing/radius variables, typography text styles |

**Authority: FigJam → Design → Code.** We iterate in code first, then port to the design file
(capture + token/style sync). Manual adjustments in the design file flow back to code. So tokens are
bidirectional with the **design file as canonical**.

See [`MAPPING.md`](./MAPPING.md) for which sitemap page maps to which code, and
[`design-tokens.md`](./design-tokens.md) for the token/typography bridge.

**Compact one-page loop checklist** (keep this open): [`LOOP-CHECKLIST.md`](./LOOP-CHECKLIST.md) — also excellent for understanding how the whole loop works.

## Adding a new page

1. **FigJam** — add a new page box to the sitemap: name, `Requirements` (bullets), `User stories` (1–2). Wire a connector from the page it's reached from.
2. **Code** — implement it in `src/App.tsx`, faithful to the requirements. Make sure it's reachable by a URL (we route with `?view=…` query params). See the skill's "Deep-linkable views" section for the full pattern and why it matters.
3. **Figma** — once it works, capture it into the design file (see below) and note the frame in `MAPPING.md`.

That's the whole process. Keep it light.

## Git and pull requests

Keep `main` linear and let each merged pull request represent one finished backlog item.

1. Start from an updated `main`: `git switch main && git pull --ff-only`.
2. Create one short-lived branch per issue, for example `codex/issue-35-history-stats`.
3. Do not combine unrelated issues in the same branch or pull request.
4. If `main` moves, update the branch with `git fetch origin` followed by
   `git rebase origin/main`. Do not merge `main` into the feature branch.
5. Verify the change, push the branch, and open a pull request containing `Closes #N`.
6. Merge using **Squash and merge** only. Delete the branch after the merge and do not reuse it.
7. Land dependencies before starting work that builds on them. Avoid parallel branches that
   modify the same files.

   **When two issues touch the same file anyway** (e.g. incremental UI work on the main view):
   - Batch into one branch if small and related.
   - Otherwise land the first, then rebase the second onto updated main.
   - Use "Depends on #N" or "Follows #N" in the issue/PR.
   - For layout changes that force many re-captures, group the work so the seam runs once.

## Code merged without capture

Sometimes the code PR lands before Figma is updated — e.g. a focused code change ships first, or
capture is deferred because it touches many frames. That leaves an intentional gap: **code is
canonical for behavior; Figma frames are stale until re-captured.**

**Preferred:** capture in the same branch before merge (one PR closes the full loop).

**When capture is deferred**, file a follow-up GitHub issue **at merge time** (don't leave it as a
PR comment or a note in `MAPPING.md` alone):

1. **Title:** `Re-capture frames after <summary> (#N)` — where `#N` is the merged code issue.
2. **Label:** `design`
3. **Link:** `Depends on #N` in the issue body.
4. **Scope:** one issue per batched capture pass — list every affected frame from `MAPPING.md`
   (shared chrome like sidebar/header usually means *all* page frames).
5. **Checklist:** dev URL, current Figma node id, and acceptance (seams run, `MAPPING.md` updated,
   verify passes).

Example: [#49](https://github.com/marthings/agentic-loop/issues/49) follows
[#47](https://github.com/marthings/agentic-loop/issues/47) (sidebar Quick Stats removed in code;
six frames + success banner pending re-capture).

Recommended GitHub repository settings under **Settings → General → Pull Requests**:

- Enable **Allow squash merging**.
- Disable **Allow merge commits** and **Allow rebase merging**.
- Enable **Automatically delete head branches**.

Protect `main` with an active branch ruleset under **Settings → Rules → Rulesets**:

- Require a pull request before merging.
- Require linear history.
- Block force pushes and branch deletion.
- Require build and lint status checks once CI is configured.

Existing published history is not rewritten. These rules keep new history clean without a
disruptive force-push.

## Capturing a screen into Figma

The design file is filled by capturing the **running dev server** (we use `localhost:5174`). The capture needs Figma's `capture.js` script on the page, which we keep **out** of `index.html` so it never ships to production — add it only while capturing:

1. Start the dev server (`npm run dev`).
2. Temporarily add to `index.html` `<head>`:
   `<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>`
3. Ask Claude to "capture the views into the design file" — it drives the Figma MCP `generate_figma_design` tool, opens each view's URL with the capture hash, and polls until done.
4. Remove the script tag again.

Each capture adds/updates a frame in the [design file](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF). Captures are raw frames (pixel-perfect layout), not design-system components — fine for review/handoff.

**For overlays/banners (e.g. success feedback after create):** Capture the base view + a seeded state (e.g. `/?view=list&success=1`). Captured frames must contain **only the pure design** — no text or extra descriptions inside the frames. Place the overlay frame **below** the main artboard (second row). Only core views use the standard left-to-right layout. Update MAPPING.md and FigJam spec only. See `capture.md` in the skill.
