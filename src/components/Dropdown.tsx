import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  ariaLabel?: string
  className?: string
}

/** Dropdown — spec in FigJam, design in the Figma library (Code Connect). */
export function Dropdown({ value, options, onChange, ariaLabel, className = '' }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex(o => o.value === value)))
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const select = (option: DropdownOption) => {
    onChange(option.value)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) { setOpen(true); return }
      const delta = e.key === 'ArrowDown' ? 1 : -1
      setActiveIndex(i => (i + delta + options.length) % options.length)
      return
    }
    if ((e.key === 'Enter' || e.key === ' ') && open) {
      e.preventDefault()
      select(options[activeIndex])
    }
  }

  return (
    <div ref={rootRef} className={`dropdown ${className}`.trim()}>
      <button
        type="button"
        className="dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen(o => !o)}
        onKeyDown={onKeyDown}
      >
        <span className="flex-1 text-left truncate">{selected?.label ?? value}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-[var(--fgm-text-secondary)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="dropdown-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option, i) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`dropdown-option ${i === activeIndex ? 'dropdown-option-active' : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => select(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
