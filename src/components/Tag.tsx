import type { MouseEvent } from 'react'

interface TagProps {
  label: string
  selected?: boolean
  onClick?: (e: MouseEvent) => void
}

/** Tag — spec in FigJam, design in the Figma library (Code Connect). */
export function Tag({ label, selected = false, onClick }: TagProps) {
  const cls = `tag ${selected ? 'tag-selected' : ''}`.trim()
  if (!onClick) return <span className={cls}>{label}</span>
  return (
    <button type="button" className={cls} onClick={onClick} aria-pressed={selected}>
      {label}
    </button>
  )
}
