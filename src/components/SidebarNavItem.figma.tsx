import figma from '@figma/code-connect'
import { SidebarNavItem, type SidebarNavItemState } from './SidebarNavItem'

// Figma: SidebarNavItem — node 251:399 in the design file
figma.connect(
  SidebarNavItem,
  'https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=251-399',
  {
    props: {
      state: figma.enum('State', {
        Default: 'default',
        Active: 'active',
        Hover: 'default',
      }),
      label: figma.string('Label'),
    },
    example: ({ state, label }) => (
      <SidebarNavItem
        state={state as SidebarNavItemState}
        label={label as string}
        icon={<span className="w-4 h-4" />}
      />
    ),
  },
)