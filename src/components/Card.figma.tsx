import figma from '@figma/code-connect'
import { Card } from './Card'

// Figma: Card — node 23:2 in the design file
figma.connect(
  Card,
  'https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=23-2',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({ children }) => <Card>{children}</Card>,
  },
)
