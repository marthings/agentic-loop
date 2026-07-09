import figma from '@figma/code-connect'
import { Sidebar, type SidebarItem } from './Sidebar'

// Figma: Sidebar (active nav variant set) — node 229:240 in the design file
figma.connect(
  Sidebar,
  'https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=229-240',
  {
    props: {
      activeItem: figma.enum('Active item', {
        'All Tasks': 'list',
        Labels: 'labels',
        History: 'history',
        Settings: 'settings',
      }),
    },
    example: ({ activeItem }) => (
      <Sidebar activeItem={activeItem as SidebarItem} onNavigate={() => {}} />
    ),
  },
)