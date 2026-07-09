import type { ReactNode } from 'react'
import { BarChart3, Home, Layers, Settings, Tags } from 'lucide-react'

export type SidebarItem = 'list' | 'labels' | 'history' | 'settings'

const navItems: { id: SidebarItem; label: string; icon: ReactNode }[] = [
  { id: 'list', label: 'All Tasks', icon: <Home className="w-4 h-4" /> },
  { id: 'labels', label: 'Labels', icon: <Tags className="w-4 h-4" /> },
  { id: 'history', label: 'History', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
]

interface SidebarProps {
  /** Nav highlight; null on detail (no sidebar destination). */
  activeItem: SidebarItem | null
  onNavigate: (item: SidebarItem) => void
}

/** Sidebar — shared app chrome; spec in FigJam, design in the Figma library (Code Connect). */
export function Sidebar({ activeItem, onNavigate }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--fgm-border)] bg-[var(--fgm-bg-secondary)] pl-[16px] pr-[17px] py-[16px] flex flex-col">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-9 h-9 rounded-xl bg-[var(--fgm-accent)] flex items-center justify-center">
          <Layers className="w-5 h-5 text-[var(--fgm-accent-foreground)]" />
        </div>
        <div>
          <div className="font-semibold tracking-tight text-xl">MakeJam</div>
          <div className="text-[10px] text-[var(--fgm-text-secondary)] -mt-1">Task tracker</div>
        </div>
      </div>

      <nav className="space-y-1 mb-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              activeItem !== null && activeItem === item.id
                ? 'bg-[var(--fgm-accent-light)] text-[var(--fgm-accent)] font-medium'
                : 'hover:bg-[var(--fgm-border)] text-[var(--fgm-text-secondary)]'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
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