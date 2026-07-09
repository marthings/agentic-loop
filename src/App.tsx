import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Button } from './components/Button'
import { Card } from './components/Card'
import { Dropdown } from './components/Dropdown'
import { Sidebar, type SidebarItem } from './components/Sidebar'
import { Tag } from './components/Tag'
import { StatusBadge, type TaskStatus } from './components/StatusBadge'

interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  dueDate: string
  createdAt: string
  completedAt: string | null
  labels: string[]
}

const initialTasks: Task[] = [
  { id: 1, title: 'Setup project structure', description: 'Initialize Vite + TS + Tailwind', status: 'Done', dueDate: '2026-06-20', createdAt: '2026-06-15', completedAt: '2026-06-19', labels: ['infra'] },
  { id: 2, title: 'Design tokens in CSS', description: 'Define color, spacing, radius vars', status: 'In Progress', dueDate: '2026-06-28', createdAt: '2026-06-18', completedAt: null, labels: ['design', 'tokens'] },
  { id: 3, title: 'List view with search', description: 'Build tasks table + filters', status: 'Todo', dueDate: '2026-07-01', createdAt: '2026-06-25', completedAt: null, labels: ['frontend'] },
]

// 'design, Frontend , design' → ['design', 'frontend']
function parseLabels(raw: string): string[] {
  return [...new Set(raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean))]
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'Todo', label: 'Todo' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
]

// Share: a task encoded into a ?share= link, decoded on load
function decodeSharedTask(): Task | null {
  if (typeof window === 'undefined') return null
  const raw = new URLSearchParams(window.location.search).get('share')
  if (!raw) return null
  try {
    // Older share links predate timestamps — default them
    const parsed = JSON.parse(decodeURIComponent(atob(raw))) as Partial<Task>
    return {
      createdAt: new Date().toISOString().split('T')[0],
      completedAt: null,
      labels: [],
      ...parsed,
    } as Task
  } catch {
    return null
  }
}

function App() {
  const sharedTask = decodeSharedTask()
  const [tasks, setTasks] = useState<Task[]>(
    sharedTask && !initialTasks.some(t => t.id === sharedTask.id)
      ? [...initialTasks, sharedTask]
      : initialTasks
  )
  // Deep-link: ?view=detail defaults to the first task; ?share=… opens a shared task
  const initialDetail =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('view') === 'detail'
      ? initialTasks[0]
      : null
  const initialSelected = sharedTask ?? initialDetail
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'settings' | 'history' | 'labels'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('share')) return 'detail'
      const v = params.get('view')
      if (v === 'create') return 'list' // legacy seed → list + create modal
      if (v === 'detail') return 'detail'
      if (v === 'settings') return 'settings'
      if (v === 'history') return 'history'
      if (v === 'labels') return 'labels'
    }
    return 'list'
  })
  const createDialogRef = useRef<HTMLDialogElement>(null)
  const [createModalOpen, setCreateModalOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    return params.get('create') === '1' || params.get('view') === 'create'
  })
  const [selectedTask, setSelectedTask] = useState<Task | null>(initialSelected)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | Task['status']>('All')
  // List: ids of tasks selected for bulk actions
  const [selectedIds, setSelectedIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return []
    if (new URLSearchParams(window.location.search).get('bulkDelete')) {
      return initialTasks.map(t => t.id)
    }
    return []
  })
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('bulkDelete') === '1'
  })
  const [createErrors, setCreateErrors] = useState<{ title?: string }>({})
  // Settings: default status applied to newly created tasks
  const [defaultStatus, setDefaultStatus] = useState<Task['status']>('Todo')
  // Share: transient "copied" feedback + a notice when opened from a shared link
  const [shareMsg, setShareMsg] = useState('')
  const [openedFromShare, setOpenedFromShare] = useState(!!sharedTask)
  const [successMsg, setSuccessMsg] = useState('')
  const [highlightedId, setHighlightedId] = useState<number | null>(null)
  // Settings: theme (light/dark) — toggles the .dark class + persists
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('fgm-theme') as 'light' | 'dark') || 'light'
    return 'light'
  })
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('fgm-theme', theme)
  }, [theme])

  // Support seeding success banner for captures (e.g. /?view=list&success=1)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (currentView === 'list') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('success')) {
        setSuccessMsg('Task created successfully!')
        // no auto-clear for capture/demo state
      }
    }
  }, [currentView])

  useEffect(() => {
    if (selectedIds.length === 0) setBulkDeleteConfirm(false)
  }, [selectedIds])

  useEffect(() => {
    const dialog = createDialogRef.current
    if (!dialog) return
    if (createModalOpen && !dialog.open) dialog.showModal()
    else if (!createModalOpen && dialog.open) dialog.close()
  }, [createModalOpen])

  useEffect(() => {
    const dialog = createDialogRef.current
    if (!dialog) return
    const onClose = () => {
      setCreateModalOpen(false)
      setCreateErrors({})
      if (typeof window === 'undefined') return
      const params = new URLSearchParams(window.location.search)
      if (!params.get('create') && params.get('view') !== 'create') return
      params.delete('create')
      if (params.get('view') === 'create') params.delete('view')
      const qs = params.toString()
      window.history.replaceState({}, '', qs ? `/?${qs}` : '/')
    }
    dialog.addEventListener('close', onClose)
    return () => dialog.removeEventListener('close', onClose)
  }, [])

  // Form state for create/edit
  const [form, setForm] = useState(() =>
    initialSelected
      ? { title: initialSelected.title, description: initialSelected.description, status: initialSelected.status, dueDate: initialSelected.dueDate, labels: initialSelected.labels.join(', ') }
      : { title: '', description: '', status: 'Todo' as Task['status'], dueDate: '', labels: '' }
  )

  // Label filter (#5) — click a chip to filter by that label
  const [labelFilter, setLabelFilter] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return new URLSearchParams(window.location.search).get('label')
  })

  const q = searchTerm.trim().toLowerCase()
  const filteredTasks = tasks
    .filter(t =>
      (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || t.status === statusFilter) &&
      (!labelFilter || t.labels.includes(labelFilter))
    )

  // Due-date sort (#4) — cycles asc → desc → off from the Due column header
  const [dueSort, setDueSort] = useState<'none' | 'asc' | 'desc'>('none')
  const cycleDueSort = () => setDueSort(s => (s === 'none' ? 'asc' : s === 'asc' ? 'desc' : 'none'))
  const sortedTasks = dueSort === 'none'
    ? filteredTasks
    : [...filteredTasks].sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return dueSort === 'asc' ? a.dueDate.localeCompare(b.dueDate) : b.dueDate.localeCompare(a.dueDate)
      })

  // Stats reflect the current search/filter (the visible list), not the full set
  const stats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter(t => t.status === 'Todo').length,
    inProgress: filteredTasks.filter(t => t.status === 'In Progress').length,
    done: filteredTasks.filter(t => t.status === 'Done').length,
  }

  const historyStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'Todo').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length,
  }
  const completionRate = historyStats.total === 0
    ? 0
    : Math.round((historyStats.done / historyStats.total) * 100)
  const statusBreakdown = [
    { status: 'Todo' as const, count: historyStats.todo, color: 'var(--fgm-warning)' },
    { status: 'In Progress' as const, count: historyStats.inProgress, color: 'var(--fgm-accent)' },
    { status: 'Done' as const, count: historyStats.done, color: 'var(--fgm-success)' },
  ]

  // Due-date insights (#31) — dueDate is 'YYYY-MM-DD', so string compare against local today works
  const pad2 = (n: number) => String(n).padStart(2, '0')
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`
  const soon = new Date(now)
  soon.setDate(soon.getDate() + 7)
  const soonStr = `${soon.getFullYear()}-${pad2(soon.getMonth() + 1)}-${pad2(soon.getDate())}`
  const dueDateBuckets = [
    {
      key: 'overdue',
      label: 'Overdue',
      color: 'var(--fgm-danger)',
      tasks: tasks.filter(t => t.dueDate && t.dueDate < todayStr && t.status !== 'Done'),
      emptyText: 'Nothing overdue — nice work.',
    },
    {
      key: 'due-soon',
      label: 'Due soon',
      color: 'var(--fgm-warning)',
      tasks: tasks.filter(t => t.dueDate && t.dueDate >= todayStr && t.dueDate <= soonStr && t.status !== 'Done'),
      emptyText: 'Nothing due in the next 7 days.',
    },
    {
      key: 'no-due-date',
      label: 'No due date',
      color: 'var(--fgm-text-secondary)',
      tasks: tasks.filter(t => !t.dueDate),
      emptyText: 'Every task has a due date.',
    },
  ]

  // Activity (#33) — completedAt drives throughput + recently completed
  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekAgoStr = `${weekAgo.getFullYear()}-${pad2(weekAgo.getMonth() + 1)}-${pad2(weekAgo.getDate())}`
  const completedTasks = tasks.filter(t => t.status === 'Done' && t.completedAt)
  const completedThisWeek = completedTasks.filter(t => t.completedAt! >= weekAgoStr).length
  const recentlyCompleted = [...completedTasks]
    .sort((a, b) => b.completedAt!.localeCompare(a.completedAt!))
    .slice(0, 3)

  const openDetail = (task: Task) => {
    setSelectedTask(task)
    setForm({ title: task.title, description: task.description, status: task.status, dueDate: task.dueDate, labels: task.labels.join(', ') })
    setCurrentView('detail')
    setOpenedFromShare(false)
  }

  const goToList = (options?: { success?: string; highlight?: number; label?: string }) => {
    setCurrentView('list')
    setSelectedTask(null)
    setForm({ title: '', description: '', status: 'Todo', dueDate: '', labels: '' })
    setOpenedFromShare(false)
    setLabelFilter(options?.label ?? null)
    if (options?.success) {
      setSuccessMsg(options.success)
      if (options.highlight) setHighlightedId(options.highlight)
      setTimeout(() => {
        setSuccessMsg('')
        setHighlightedId(null)
      }, 2500)
    } else {
      setSuccessMsg('')
      setHighlightedId(null)
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams()
      if (options?.label) {
        params.set('view', 'list')
        params.set('label', options.label)
      } else if (options?.success) {
        params.set('view', 'list')
        params.set('success', '1')
      }
      const qs = params.toString()
      window.history.replaceState({}, '', qs ? `/?${qs}` : '/')
    }
  }

  const openCreateModal = () => {
    setSuccessMsg('')
    setHighlightedId(null)
    setCreateErrors({})
    setForm({ title: '', description: '', status: defaultStatus, dueDate: '', labels: '' })
    setCreateModalOpen(true)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      params.set('create', '1')
      if (params.get('view') === 'create') params.delete('view')
      if (!params.get('view')) params.set('view', 'list')
      window.history.replaceState({}, '', `/?${params.toString()}`)
    }
  }

  const closeCreateModal = () => {
    setCreateModalOpen(false)
    createDialogRef.current?.close()
  }

  const goToSettings = () => {
    setSuccessMsg('')
    setHighlightedId(null)
    setCurrentView('settings')
    setSelectedTask(null)
    setOpenedFromShare(false)
    if (typeof window !== 'undefined') window.history.replaceState({}, '', '/?view=settings')
  }

  const goToHistory = () => {
    setSuccessMsg('')
    setHighlightedId(null)
    setCurrentView('history')
    setSelectedTask(null)
    setOpenedFromShare(false)
    if (typeof window !== 'undefined') window.history.replaceState({}, '', '/?view=history')
  }

  const goToLabels = () => {
    setSuccessMsg('')
    setHighlightedId(null)
    setCurrentView('labels')
    setSelectedTask(null)
    setOpenedFromShare(false)
    if (typeof window !== 'undefined') window.history.replaceState({}, '', '/?view=labels')
  }

  const labelStats = [...tasks.reduce((map, task) => {
    for (const label of task.labels) map.set(label, (map.get(label) || 0) + 1)
    return map
  }, new Map<string, number>()).entries()].sort((a, b) => a[0].localeCompare(b[0]))

  const shareTask = async () => {
    if (!selectedTask) return
    const payload = btoa(encodeURIComponent(JSON.stringify(selectedTask)))
    const url = `${window.location.origin}/?share=${payload}`
    try {
      await navigator.clipboard.writeText(url)
      setShareMsg('Link copied to clipboard')
    } catch {
      setShareMsg('Copy this link: ' + url)
    }
    setTimeout(() => setShareMsg(''), 3000)
  }

  const clearAllTasks = () => {
    if (!confirm('Clear all tasks? This cannot be undone.')) return
    setTasks([])
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setCreateErrors({ title: 'Title is required.' })
      return
    }
    setCreateErrors({})
    const newTask: Task = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      dueDate: form.dueDate || new Date().toISOString().split('T')[0],
      createdAt: todayStr,
      completedAt: form.status === 'Done' ? todayStr : null,
      labels: parseLabels(form.labels),
    }
    setTasks([...tasks, newTask])
    closeCreateModal()
    setSuccessMsg('Task created successfully!')
    setHighlightedId(newTask.id)
    setTimeout(() => {
      setSuccessMsg('')
      setHighlightedId(null)
    }, 2500)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams()
      params.set('view', 'list')
      params.set('success', '1')
      window.history.replaceState({}, '', `/?${params.toString()}`)
    }
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTask) return
    const updated = tasks.map(t =>
      t.id === selectedTask.id
        ? {
            ...t,
            title: form.title.trim(),
            description: form.description.trim(),
            status: form.status,
            dueDate: form.dueDate,
            labels: parseLabels(form.labels),
            // status → Done stamps completedAt (kept if already Done); leaving Done clears it
            completedAt: form.status === 'Done' ? (t.completedAt ?? todayStr) : null,
          }
        : t
    )
    setTasks(updated)
    goToList()
  }

  const handleDelete = () => {
    if (!selectedTask) return
    if (!confirm('Delete this task?')) return
    setTasks(tasks.filter(t => t.id !== selectedTask.id))
    goToList()
  }

  const toggleSelect = (id: number) =>
    setSelectedIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id])
  const toggleSelectAll = () => {
    const allSelected = filteredTasks.length > 0 && filteredTasks.every(t => selectedIds.includes(t.id))
    setSelectedIds(allSelected ? [] : filteredTasks.map(t => t.id))
  }
  const requestBulkDelete = () => {
    if (selectedIds.length === 0) return
    setBulkDeleteConfirm(true)
  }

  const cancelBulkDelete = () => setBulkDeleteConfirm(false)

  const confirmBulkDelete = () => {
    const count = selectedIds.length
    if (count === 0) return
    setTasks(tasks.filter(t => !selectedIds.includes(t.id)))
    setSelectedIds([])
    setBulkDeleteConfirm(false)
    setSuccessMsg(`Deleted ${count} task${count === 1 ? '' : 's'}.`)
    setTimeout(() => setSuccessMsg(''), 2500)
  }

  const sidebarActive: SidebarItem | null =
    currentView === 'list' ? 'list'
    : currentView === 'labels' ? 'labels'
    : currentView === 'history' ? 'history'
    : currentView === 'settings' ? 'settings'
    : null

  const handleSidebarNavigate = (item: SidebarItem) => {
    if (item === 'settings') goToSettings()
    else if (item === 'history') goToHistory()
    else if (item === 'labels') goToLabels()
    else goToList()
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--fgm-bg)] text-[var(--fgm-text)]">
      <Sidebar activeItem={sidebarActive} onNavigate={handleSidebarNavigate} />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {/* LIST VIEW */}
          {currentView === 'list' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
                  <p className="text-[var(--fgm-text-secondary)]">Your tasks, all in one place</p>
                </div>
                <Button variant="primary" onClick={openCreateModal} className="px-[19px] py-[11px] rounded-[10px]">+ New Task</Button>
              </div>

              {/* Stats - match Figma node 7:3 exact paddings/sizes */}
              <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
                <div className="bg-[var(--fgm-bg)] border border-[var(--fgm-border)] rounded-[var(--fgm-radius-lg)] p-[var(--fgm-space-6)] w-full sm:w-[289.5px] flex-shrink-0">
                  <div className="text-[var(--fgm-text-label-size)] text-[var(--fgm-text-secondary)]">Total</div>
                  <div className="text-[var(--fgm-text-title-size)] leading-[var(--fgm-text-title-line)] font-semibold tracking-[0.07px]">{stats.total}</div>
                </div>
                <div className="bg-[var(--fgm-bg)] border border-[var(--fgm-border)] rounded-[var(--fgm-radius-lg)] p-[var(--fgm-space-6)] w-full sm:w-[289.5px] flex-shrink-0">
                  <div className="text-[var(--fgm-text-label-size)] text-[var(--fgm-text-secondary)]">Todo</div>
                  <div className="text-[var(--fgm-text-title-size)] leading-[var(--fgm-text-title-line)] font-semibold tracking-[0.07px]">{stats.todo}</div>
                </div>
                <div className="bg-[var(--fgm-bg)] border border-[var(--fgm-border)] rounded-[var(--fgm-radius-lg)] p-[var(--fgm-space-6)] w-full sm:w-[289.5px] flex-shrink-0">
                  <div className="text-[var(--fgm-text-label-size)] text-[var(--fgm-text-secondary)]">In Progress</div>
                  <div className="text-[var(--fgm-text-title-size)] leading-[var(--fgm-text-title-line)] font-semibold tracking-[0.07px]">{stats.inProgress}</div>
                </div>
                <div className="bg-[var(--fgm-bg)] border border-[var(--fgm-border)] rounded-[var(--fgm-radius-lg)] p-[var(--fgm-space-6)] w-full sm:w-[289.5px] flex-shrink-0">
                  <div className="text-[var(--fgm-text-label-size)] text-[var(--fgm-text-secondary)]">Done</div>
                  <div className="text-[var(--fgm-text-title-size)] leading-[var(--fgm-text-title-line)] font-semibold tracking-[0.07px]">{stats.done}</div>
                </div>
              </div>

              {successMsg && (
                <div className="mb-4 p-3 rounded-[10px] bg-[var(--fgm-accent-light)] text-[var(--fgm-accent)] text-sm">
                  {successMsg}
                </div>
              )}

              {/* Filters - pt after stats to match design */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4 pt-1">
                <div className="relative w-full sm:flex-1 sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search title or description..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="border border-[var(--fgm-border)] rounded-md px-[13px] py-[9px] pr-8 text-sm w-full bg-[var(--fgm-bg)]"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--fgm-text-secondary)] hover:text-[var(--fgm-text)] text-base leading-none"
                    >×</button>
                  )}
                </div>
                <Dropdown
                  value={statusFilter}
                  onChange={v => setStatusFilter(v as 'All' | Task['status'])}
                  ariaLabel="Filter by status"
                  className="w-full sm:w-[140px]"
                  options={[
                    { value: 'All', label: 'All Status' },
                    { value: 'Todo', label: 'Todo' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Done', label: 'Done' },
                  ]}
                />
                {labelFilter && (
                  <Tag label={`${labelFilter} ✕`} selected onClick={() => setLabelFilter(null)} />
                )}
                {selectedIds.length > 0 && !bulkDeleteConfirm && (
                  <Button
                    variant="secondary"
                    onClick={requestBulkDelete}
                    className="border border-[var(--fgm-danger)] text-[var(--fgm-danger)]"
                    aria-haspopup="dialog"
                  >
                    Delete selected ({selectedIds.length})…
                  </Button>
                )}
              </div>

              {bulkDeleteConfirm && (
                <Card
                  role="alertdialog"
                  aria-labelledby="bulk-delete-title"
                  aria-describedby="bulk-delete-desc"
                  className="mb-4 border-[var(--fgm-danger)]"
                >
                  <h2 id="bulk-delete-title" className="text-heading mb-1">Delete selected tasks?</h2>
                  <p id="bulk-delete-desc" className="text-body text-[var(--fgm-text-secondary)] mb-4">
                    You are about to permanently delete {selectedIds.length} task{selectedIds.length === 1 ? '' : 's'}.
                    This cannot be undone.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button type="button" variant="secondary" onClick={cancelBulkDelete}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={confirmBulkDelete}
                      className="border border-[var(--fgm-danger)] bg-[var(--fgm-danger)] text-white hover:opacity-90"
                    >
                      Delete {selectedIds.length} task{selectedIds.length === 1 ? '' : 's'}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Table - matches Figma card p-25 rounded-16 */}
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-left border-b border-[var(--fgm-border)] text-[var(--fgm-text-secondary)]">
                      <th className="p-3 w-8">
                        <input
                          type="checkbox"
                          checked={filteredTasks.length > 0 && filteredTasks.every(t => selectedIds.includes(t.id))}
                          onChange={toggleSelectAll}
                          aria-label="Select all tasks"
                        />
                      </th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">
                        <button
                          type="button"
                          onClick={cycleDueSort}
                          aria-label={`Sort by due date${dueSort === 'asc' ? ', ascending' : dueSort === 'desc' ? ', descending' : ''}`}
                          className="inline-flex items-center gap-1 font-semibold hover:text-[var(--fgm-accent)]"
                        >
                          Due
                          {dueSort === 'asc' ? <ArrowUp className="w-3.5 h-3.5" />
                            : dueSort === 'desc' ? <ArrowDown className="w-3.5 h-3.5" />
                            : <ArrowUpDown className="w-3.5 h-3.5 text-[var(--fgm-text-secondary)]" />}
                        </button>
                      </th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTasks.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-[var(--fgm-text-secondary)]">No tasks found.</td></tr>}
                    {sortedTasks.map(task => (
                      <tr key={task.id} onClick={() => openDetail(task)} className={`border-b border-[var(--fgm-border)] last:border-0 hover:bg-[var(--fgm-bg-secondary)] cursor-pointer ${highlightedId === task.id ? 'bg-[var(--fgm-accent-light)]' : ''}`}>
                        <td className="p-3" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(task.id)}
                            onChange={() => toggleSelect(task.id)}
                            aria-label={`Select ${task.title}`}
                          />
                        </td>
                        <td className="p-3 font-medium">
                          <div className="flex items-center gap-2 flex-wrap">
                            {task.title}
                            {task.labels.map(l => (
                              <Tag
                                key={l}
                                label={l}
                                selected={l === labelFilter}
                                onClick={e => { e.stopPropagation(); setLabelFilter(f => (f === l ? null : l)) }}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="p-3 text-[var(--fgm-text-secondary)]">{task.dueDate}</td>
                        <td className="p-3 text-right"><button className="text-xs underline">View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </Card>
              <p className="text-xs mt-2 text-[var(--fgm-text-secondary)]">Click any row to open it. Your data lives in this browser session.</p>
            </>
          )}

          {/* DETAIL VIEW */}
          {currentView === 'detail' && selectedTask && (
            <div className="max-w-2xl">
              <button onClick={() => goToList()} className="text-sm mb-4 flex items-center gap-1 hover:underline">← Back to list</button>

              {openedFromShare && (
                <div className="mb-4 text-sm rounded-[10px] border border-[var(--fgm-border)] bg-[var(--fgm-accent-light)] text-[var(--fgm-accent)] px-3 py-2">
                  📎 You opened this from a shared link — it's been added to your list.
                </div>
              )}

              <h1 className="text-2xl font-semibold mb-4">{selectedTask.title}</h1>

              <form onSubmit={handleUpdate} className="space-y-4 card mb-6">
                <div>
                  <label className="block text-sm mb-1">Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-[var(--fgm-border)] rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-[var(--fgm-border)] rounded px-3 py-2 h-28" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Status</label>
                    <Dropdown
                      value={form.status}
                      onChange={v => setForm({ ...form, status: v as TaskStatus })}
                      ariaLabel="Status"
                      className="w-full"
                      options={statusOptions}
                    />
                  </div>
                  <div>
                    <label htmlFor="detail-due-date" className="block text-sm mb-1">Due date</label>
                    <input
                      id="detail-due-date"
                      type="date"
                      value={form.dueDate}
                      onChange={e => setForm({ ...form, dueDate: e.target.value })}
                      aria-describedby="detail-due-date-hint"
                      className="w-full border border-[var(--fgm-border)] rounded px-3 py-2"
                    />
                    <p id="detail-due-date-hint" className="text-xs text-[var(--fgm-text-secondary)] mt-1">
                      Optional. Click to pick a date — the empty placeholder is year-month-day, not an error.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Labels</label>
                  <input value={form.labels} onChange={e => setForm({...form, labels: e.target.value})} placeholder="design, frontend" className="w-full border border-[var(--fgm-border)] rounded px-3 py-2" />
                </div>
                <div className="flex flex-wrap gap-3 pt-2 items-center">
                  <Button type="button" variant="secondary" onClick={() => handleDelete()}>Delete</Button>
                  <Button type="button" variant="secondary" onClick={shareTask}>Share</Button>
                  <Button type="submit" variant="primary" className="flex-1">Save Changes</Button>
                </div>
                {shareMsg && <p className="text-xs text-[var(--fgm-accent)] pt-1 break-all">{shareMsg}</p>}
              </form>

              <div className="text-xs text-[var(--fgm-text-secondary)]">
                Changes are saved in this browser session.
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {currentView === 'settings' && (
            <div className="max-w-lg">
              <h1 className="text-2xl font-semibold mb-1">Settings</h1>
              <p className="text-sm text-[var(--fgm-text-secondary)] mb-6">App preferences.</p>

              <div className="space-y-6">
                {/* Appearance / dark mode */}
                <Card>
                  <label className="block text-sm font-medium mb-1">Appearance</label>
                  <p className="text-xs text-[var(--fgm-text-secondary)] mb-3">Switch between light and dark theme. Saved on this device.</p>
                  <div className="flex gap-2">
                    <Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => setTheme('light')}>Light</Button>
                    <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => setTheme('dark')}>Dark</Button>
                  </div>
                </Card>

                {/* Default status for new tasks */}
                <Card>
                  <label className="block text-sm font-medium mb-1">Default status for new tasks</label>
                  <p className="text-xs text-[var(--fgm-text-secondary)] mb-3">New tasks start with this status pre-selected.</p>
                  <Dropdown
                    value={defaultStatus}
                    onChange={v => setDefaultStatus(v as TaskStatus)}
                    ariaLabel="Default status"
                    className="w-full"
                    options={statusOptions}
                  />
                </Card>

                {/* Clear all tasks */}
                <Card>
                  <label className="block text-sm font-medium mb-1">Clear all tasks</label>
                  <p className="text-xs text-[var(--fgm-text-secondary)] mb-3">Remove every task. This cannot be undone.</p>
                  <Button variant="secondary" onClick={clearAllTasks} className="border border-[var(--fgm-border)]">Clear all tasks</Button>
                </Card>

                {/* About */}
                <Card>
                  <div className="text-sm font-medium mb-1">About</div>
                  <div className="text-sm text-[var(--fgm-text-secondary)]">MakeJam Tasks</div>
                  <div className="text-sm text-[var(--fgm-text-secondary)]">Version 0.1.0 • FigJam-driven workflow demo</div>
                </Card>
              </div>
            </div>
          )}

          {/* LABELS VIEW */}
          {currentView === 'labels' && (
            <div className="max-w-2xl">
              <h1 className="text-title mb-1">Labels</h1>
              <p className="text-body text-[var(--fgm-text-secondary)] mb-6">
                All labels used across your tasks. Click a label to filter the task list.
              </p>

              {labelStats.length === 0 ? (
                <Card>
                  <h2 className="text-heading mb-1">No labels yet</h2>
                  <p className="text-body text-[var(--fgm-text-secondary)]">
                    Add labels when creating or editing a task — they will show up here.
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {labelStats.map(([label, count]) => (
                    <Card key={label} className="flex items-center justify-between gap-4">
                      <Tag
                        label={label}
                        onClick={() => goToList({ label })}
                      />
                      <span className="text-caption text-[var(--fgm-text-secondary)] whitespace-nowrap">
                        {count} task{count === 1 ? '' : 's'}
                      </span>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HISTORY VIEW — status breakdown (#30) + due-date insights (#31) */}
          {currentView === 'history' && (
            <div className="max-w-3xl">
              <h1 className="text-title mb-1">History</h1>
              <p className="text-body text-[var(--fgm-text-secondary)] mb-6">See how your tasks are progressing.</p>

              {historyStats.total === 0 ? (
                <Card>
                  <h2 className="text-heading mb-1">No task data yet</h2>
                  <p className="text-body text-[var(--fgm-text-secondary)]">
                    Create a task to start tracking your progress.
                  </p>
                </Card>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <p className="text-caption text-[var(--fgm-text-secondary)] mb-2">Total tasks</p>
                      <p className="text-display">{historyStats.total}</p>
                    </Card>
                    <Card>
                      <p className="text-caption text-[var(--fgm-text-secondary)] mb-2">Completion rate</p>
                      <p className="text-display">{completionRate}%</p>
                    </Card>
                  </div>

                  <Card>
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-heading">Status breakdown</h2>
                        <p className="text-body text-[var(--fgm-text-secondary)]">Distribution across all tasks.</p>
                      </div>
                      <span className="text-label">{historyStats.done} of {historyStats.total} done</span>
                    </div>

                    <div
                      className="flex h-3 overflow-hidden rounded-[var(--fgm-radius-sm)] bg-[var(--fgm-bg-secondary)] mb-6"
                      role="img"
                      aria-label={`${historyStats.todo} todo, ${historyStats.inProgress} in progress, ${historyStats.done} done`}
                    >
                      {statusBreakdown.map(item => item.count > 0 && (
                        <div
                          key={item.status}
                          style={{
                            backgroundColor: item.color,
                            width: `${(item.count / historyStats.total) * 100}%`,
                          }}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {statusBreakdown.map(item => (
                        <div key={item.status} className="flex items-center justify-between gap-3">
                          <StatusBadge status={item.status} />
                          <span className="text-heading">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Due-date insights (#31) */}
                  <Card>
                    <div className="mb-6">
                      <h2 className="text-heading">Due-date insights</h2>
                      <p className="text-body text-[var(--fgm-text-secondary)]">Where your deadlines stand today.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {dueDateBuckets.map(bucket => (
                        <div key={bucket.key}>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              aria-hidden="true"
                              className="inline-block w-2 h-2 rounded-full"
                              style={{ backgroundColor: bucket.color }}
                            />
                            <span className="text-caption text-[var(--fgm-text-secondary)]">{bucket.label}</span>
                          </div>
                          <p className="text-display mb-2">{bucket.tasks.length}</p>
                          {bucket.tasks.length === 0 ? (
                            <p className="text-caption text-[var(--fgm-text-secondary)]">{bucket.emptyText}</p>
                          ) : (
                            <ul className="space-y-1">
                              {bucket.tasks.slice(0, 3).map(t => (
                                <li key={t.id} className="text-caption flex items-center justify-between gap-2">
                                  <span className="truncate">{t.title}</span>
                                  {t.dueDate && <span className="text-[var(--fgm-text-secondary)] shrink-0">{t.dueDate}</span>}
                                </li>
                              ))}
                              {bucket.tasks.length > 3 && (
                                <li className="text-caption text-[var(--fgm-text-secondary)]">+{bucket.tasks.length - 3} more</li>
                              )}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Activity (#33) */}
                  <Card>
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-heading">Activity</h2>
                        <p className="text-body text-[var(--fgm-text-secondary)]">What got done, and when.</p>
                      </div>
                      <span className="text-label">{completedThisWeek} completed this week</span>
                    </div>
                    {recentlyCompleted.length === 0 ? (
                      <p className="text-caption text-[var(--fgm-text-secondary)]">
                        Nothing completed yet — finish a task and it shows up here.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {recentlyCompleted.map(t => (
                          <li key={t.id} className="flex items-center justify-between gap-3">
                            <span className="text-body truncate">{t.title}</span>
                            <span className="text-caption text-[var(--fgm-text-secondary)] shrink-0">Done {t.completedAt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <dialog
        ref={createDialogRef}
        aria-labelledby="create-dialog-title"
        aria-describedby="create-dialog-desc"
        className="create-dialog"
      >
        <form onSubmit={handleCreate} className="create-dialog-panel">
          <h2 id="create-dialog-title" className="text-title mb-1">New Task</h2>
          <p id="create-dialog-desc" className="text-body text-[var(--fgm-text-secondary)] mb-6">Add a new task.</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="create-title" className="block text-sm mb-1">Title *</label>
              <input
                id="create-title"
                value={form.title}
                onChange={e => {
                  setForm({ ...form, title: e.target.value })
                  if (createErrors.title) setCreateErrors({})
                }}
                aria-invalid={!!createErrors.title}
                aria-describedby={createErrors.title ? 'create-title-error' : undefined}
                className={`w-full border rounded px-3 py-2 ${createErrors.title ? 'border-[var(--fgm-danger)]' : 'border-[var(--fgm-border)]'}`}
              />
              {createErrors.title && (
                <p id="create-title-error" role="alert" className="text-xs text-[var(--fgm-danger)] mt-1">
                  {createErrors.title}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="create-description" className="block text-sm mb-1">Description</label>
              <textarea
                id="create-description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border border-[var(--fgm-border)] rounded px-3 py-2 h-24"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Status</label>
                <Dropdown
                  value={form.status}
                  onChange={v => setForm({ ...form, status: v as TaskStatus })}
                  ariaLabel="Status"
                  className="w-full"
                  options={statusOptions}
                />
              </div>
              <div>
                <label htmlFor="create-due-date" className="block text-sm mb-1">Due date</label>
                <input
                  id="create-due-date"
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })}
                  aria-describedby="create-due-date-hint"
                  className="w-full border border-[var(--fgm-border)] rounded px-3 py-2"
                />
                <p id="create-due-date-hint" className="text-xs text-[var(--fgm-text-secondary)] mt-1">
                  Optional. Click to pick a date — the empty placeholder is year-month-day, not an error.
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="create-labels" className="block text-sm mb-1">Labels</label>
              <input
                id="create-labels"
                value={form.labels}
                onChange={e => setForm({ ...form, labels: e.target.value })}
                placeholder="design, frontend"
                className="w-full border border-[var(--fgm-border)] rounded px-3 py-2"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={closeCreateModal} className="flex-1">Cancel</Button>
              <Button type="submit" variant="primary" className="flex-1">Create Task</Button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  )
}

export default App
