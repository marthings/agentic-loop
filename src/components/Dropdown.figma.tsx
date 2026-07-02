import figma from '@figma/code-connect'
import { Dropdown } from './Dropdown'

// Figma: Dropdown (variant set) — node 106:20 in the design file
figma.connect(
  Dropdown,
  'https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=106-20',
  {
    props: {
      label: figma.string('Label'),
    },
    example: ({ label }) => (
      <Dropdown
        value={label}
        options={[{ value: label, label }]}
        onChange={() => {}}
      />
    ),
  },
)
