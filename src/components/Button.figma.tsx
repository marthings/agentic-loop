import figma from '@figma/code-connect'
import { Button } from './Button'

// Figma: Button (variant set) — node 20:7 in the design file
figma.connect(
  Button,
  'https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=20-7',
  {
    props: {
      variant: figma.enum('Variant', {
        Primary: 'primary',
        Secondary: 'secondary',
      }),
      label: figma.string('Label'),
    },
    example: ({ variant, label }) => <Button variant={variant}>{label}</Button>,
  },
)
