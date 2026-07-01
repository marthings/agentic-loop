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

## Adding a new page

1. **FigJam** — add a new page box to the sitemap: name, `Requirements` (bullets), `User stories` (1–2). Wire a connector from the page it's reached from.
2. **Code** — implement it in `src/App.tsx`, faithful to the requirements. Make sure it's reachable by a URL (we route with `?view=…` query params).
3. **Figma** — once it works, capture it into the design file (see below) and note the frame in `MAPPING.md`.

That's the whole process. Keep it light.

## Capturing a screen into Figma

The design file is filled by capturing the **running dev server** (we use `localhost:5174`). The capture needs Figma's `capture.js` script on the page, which we keep **out** of `index.html` so it never ships to production — add it only while capturing:

1. Start the dev server (`npm run dev`).
2. Temporarily add to `index.html` `<head>`:
   `<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>`
3. Ask Claude to "capture the views into the design file" — it drives the Figma MCP `generate_figma_design` tool, opens each view's URL with the capture hash, and polls until done.
4. Remove the script tag again.

Each capture adds/updates a frame in the [design file](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF). Captures are raw frames (pixel-perfect layout), not design-system components — fine for review/handoff.
