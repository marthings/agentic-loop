export type TaskStatus = 'Todo' | 'In Progress' | 'Done'

const statusTokens: Record<TaskStatus, { bg: string; text: string }> = {
  'Done': { bg: '--fgm-success-bg', text: '--fgm-success-text' },
  'In Progress': { bg: '--fgm-info-bg', text: '--fgm-info-text' },
  'Todo': { bg: '--fgm-warning-bg', text: '--fgm-warning-text' },
}

/** StatusBadge — task status pill. Design in the Figma library (Code Connect). */
export function StatusBadge({ status }: { status: TaskStatus }) {
  const t = statusTokens[status]
  return (
    <span
      className="text-[12px] px-2 py-0.5 rounded-[4px]"
      style={{ backgroundColor: `var(${t.bg})`, color: `var(${t.text})` }}
    >
      {status}
    </span>
  )
}
