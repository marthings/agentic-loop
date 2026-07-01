# Design Tokens — figma-make-jam

These are the current implementation tokens living in `src/index.css`.

The long-term intention is bidirectional sync with Figma Variables.

## Current Tokens (CSS custom properties)

```css
--fgm-bg
--fgm-bg-secondary
--fgm-text
--fgm-text-secondary
--fgm-border
--fgm-accent
--fgm-accent-foreground
--fgm-accent-light
--fgm-success
--fgm-warning

--fgm-radius-sm  (6px)
--fgm-radius-md  (10px)
--fgm-radius-lg  (16px)

--fgm-space-1 (4px)
--fgm-space-2 (8px)
--fgm-space-3 (12px)
--fgm-space-4 (16px)
--fgm-space-6 (24px)
--fgm-space-8 (32px)
```

## Usage in code

```tsx
<div className="p-6 rounded-2xl border bg-[var(--fgm-bg)] ...">
```

Tailwind v4 can also consume these via `@theme` (see current `index.css`).

## Mapping to Figma (live)

These tokens live in the [Figma design file](https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF)
as **Variables** so code and design share one vocabulary. Color/spacing/radius were originally
authored in code and pushed to Figma; going forward the **design file is canonical for tokens** —
edits there flow back to code. The sync is idempotent (matched by name). Driven by the
`figjam-driven-workflow` skill (`references/sync-tokens.md`).

**Naming convention** — CSS custom property → `Collection / variable` (prefix stripped):

| Code | Figma |
|------|-------|
| `--fgm-accent` | `Color / accent` (modes: Light, Dark) |
| `--fgm-space-4` | `Spacing / 4` |
| `--fgm-radius-md` | `Radius / md` |

Collections in Figma: **Color** (10 vars, Light/Dark modes), **Spacing** (6), **Radius** (3).
The `.dark` overrides in `index.css` populate the Dark mode; unthemed colors share the same value
across modes.

**Naming source:** code had the established convention (`--fgm-*`), so the Figma variable names
mirror it. (Where neither end has a convention — e.g. typography below — we define it in the
canonical end, the design file.)

**The captured screens are bound to these variables** (fills, strokes, corner radii reference
`Color/*` and `Radius/*` rather than hardcoded values). So switching the Color collection to Dark
mode in Figma rethemes the screens. Verify what a frame references with the Figma MCP
`get_variable_defs` (its "check design").

To re-sync after changing tokens: ask Claude to "sync the tokens into Figma" (push routine), then
"bind the views" if screens were re-captured.

## Typography (design file is source of truth)

Unlike colors/spacing (born in code), the type scale was **defined in the design file** — it didn't
exist as code tokens before. Role-based naming, font **Inter**:

| Text style | Size / line | Weight | Figma variables |
|------------|-------------|--------|-----------------|
| Display | 30 / 36 | Semi Bold | `Font Size/display`, `Line Height/display` |
| Title | 24 / 32 | Semi Bold | `Font Size/title`, `Line Height/title` |
| Heading | 18 / 28 | Semi Bold | `Font Size/heading`, `Line Height/heading` |
| Body | 14 / 22 | Regular | `Font Size/body`, `Line Height/body` |
| Label | 14 / 20 | Medium | `Font Size/label`, `Line Height/label` |
| Caption | 12 / 16 | Regular | `Font Size/caption`, `Line Height/caption` |

In Figma: collections **Font Size** (6) + **Line Height** (6); six **text styles** bound to them.
The captured screens have these styles applied. The code mirror lives in `src/index.css`
(`--fgm-text-*` tokens + `.text-display/.text-title/.text-heading/.text-body/.text-label/.text-caption`
classes). Since the design file is canonical for type, edit the scale there and reflect back to code.

## Next token work

- Add shadow / elevation tokens (define in the design file, reflect to code)
- Add motion tokens (durations, easings) once we have animations
- Adopt the `.text-*` classes in `App.tsx` to replace ad-hoc Tailwind type utilities
