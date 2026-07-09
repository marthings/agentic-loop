import { BarChart3, Home, Layers, Settings, Tags } from 'lucide-react'
import { SidebarNavItem } from './SidebarNavItem'

export type SidebarItem = 'list' | 'labels' | 'history' | 'settings'

const navItems: { id: SidebarItem; label: string; icon: typeof Home }[] = [
  { id: 'list', label: 'All Tasks', icon: Home },
  { id: 'labels', label: 'Labels', icon: Tags },
  { id: 'history', label: 'History', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  /** Nav highlight; null on detail / modals (all items default). */
  activeItem: SidebarItem | null
  onNavigate: (item: SidebarItem) => void
}

/** Sidebar — shared app chrome; composes SidebarNavItem instances. */
export function Sidebar({ activeItem, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <Layers className="w-5 h-5 text-[var(--fgm-accent-foreground)]" />
        </div>
        <div>
          <div className="font-semibold tracking-tight text-xl">MakeJam</div>
          <div className="text-[10px] text-[var(--fgm-text-secondary)] -mt-1">Task tracker</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <SidebarNavItem
              key={item.id}
              label={item.label}
              icon={<Icon className="w-4 h-4" />}
              state={activeItem !== null && activeItem === item.id ? 'active' : 'default'}
              onClick={() => onNavigate(item.id)}
            />
          )
        })}
        <div className="pt-4 text-xs text-[var(--fgm-text-secondary)] px-3">
          Spec from{' '}
          <a
            href="https://www.figma.com/board/Qyo8JqnW7hQ4neaBAzG9K9"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            FigJam sitemap
          </a>
        </div>
      </nav>
    </aside>
  )
}