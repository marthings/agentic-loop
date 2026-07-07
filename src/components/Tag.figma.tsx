import figma from '@figma/code-connect'
import { Tag } from './Tag'

// Figma: Tag (variant set) — node 147:24 in the design file
figma.connect(
  Tag,
  'https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=147-24',
  {
    props: {
      label: figma.string('Label'),
      selected: figma.enum('State', {
        Default: false,
        Selected: true,
      }),
    },
    example: ({ label, selected }) => <Tag label={label} selected={selected} />,
  },
)
