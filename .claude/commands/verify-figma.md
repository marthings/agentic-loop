---
description: Verify the Figma ↔ code mapping is consistent (read-only drift check)
---

Run a **read-only** drift check between code and the Figma design file
(`HM0wHv6sz11nOjnifpBXjF`). This is our own "Code Connect substitute" — it keeps the three layers
(FigJam ↔ Code ↔ Design) honest without the gated Figma feature.

Use `docs/MAPPING.md` and `docs/design-tokens.md` as the expected mapping (read them first so the
check stays current as those grow). **Do not change anything** — only read and report.

Check three things:

1. **Components** — for each row in the component table of `docs/MAPPING.md`, read the Figma
   component's property definitions via the Figma MCP
   (`use_figma`: `node.componentPropertyDefinitions`, returning VARIANT `variantOptions` and other
   prop types). Compare:
   - VARIANT options ⇄ the code prop union (e.g. `ButtonVariant`, `TaskStatus`) **and** the
     `figma.enum(...)` keys in the matching `src/components/*.figma.tsx`.
   - TEXT / BOOLEAN props ⇄ a corresponding code prop.

2. **Tokens** — read the Figma variable collections (Color, Spacing, Radius, Font Size, Line Height)
   and the text styles via the MCP. Compare names/values against `src/index.css`
   (`--fgm-*` and `--fgm-text-*`).

3. **Mapping integrity** — confirm every Figma `node-id` referenced in `docs/MAPPING.md` still
   resolves.

**Report** a short table: ✅ consistent / ⚠️ drift, and for each ⚠️ the exact mismatch plus which
side is the source of truth to fix (tokens/design → Figma is canonical; component prop names →
code). If everything matches, say so in one line. Never mutate the file.
