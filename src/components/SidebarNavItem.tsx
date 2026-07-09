import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type SidebarNavItemState = 'default' | 'active'

interface SidebarNavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon: ReactNode
  /** Active = current route; default uses :hover in CSS (Hover variant in Figma only). */
  state?: SidebarNavItemState
}

/** Sidebar nav row — spec in FigJam; Figma SidebarNavItem (State=Default/Active/Hover). */
export function SidebarNavItem({
  label,
  icon,
  state = 'default',
  className = '',
  ...props
}: SidebarNavItemProps) {
  return (
    <button
      type="button"
      className={`sidebar-nav-item sidebar-nav-item--${state} ${className}`.trim()}
      aria-current={state === 'active' ? 'page' : undefined}
      {...props}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}