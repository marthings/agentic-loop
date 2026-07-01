import figma from '@figma/code-connect'
import { StatusBadge } from './StatusBadge'

// Figma: StatusBadge (status set) — node 23:10 in the design file
figma.connect(
  StatusBadge,
  'https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=23-10',
  {
    props: {
      status: figma.enum('Status', {
        Todo: 'Todo',
        'In Progress': 'In Progress',
        Done: 'Done',
      }),
    },
    example: ({ status }) => <StatusBadge status={status} />,
  },
)
