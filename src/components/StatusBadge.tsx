export type TaskStatus = 'Todo' | 'In Progress' | 'Done'

const statusStyles: Record<TaskStatus, string> = {
  'Done': 'bg-[#d0fae5] text-[#007a55]',
  'In Progress': 'bg-[#dbeafe] text-[#1e40af]',
  'Todo': 'bg-[#fef3c6] text-[#854d0e]',
}

/** StatusBadge — task status pill. Design in the Figma library (Code Connect). */
export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`text-[12px] px-2 py-0.5 rounded-[4px] ${statusStyles[status]}`}>
      {status}
    </span>
  )
}
