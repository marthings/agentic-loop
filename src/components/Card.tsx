import type { HTMLAttributes } from 'react'

/** Card — surface container. Design in the Figma library (Code Connect). */
export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`.trim()} {...props} />
}
