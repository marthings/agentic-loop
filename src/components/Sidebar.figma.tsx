import figma from '@figma/code-connect'
import { Sidebar } from './Sidebar'

// Figma: Sidebar (composed SidebarNavItem instances) — node 251:472
// activeItem is code-only: Figma sets per-item State on child instances (see sidebar-swap.js).
figma.connect(
  Sidebar,
  'https://www.figma.com/design/HM0wHv6sz11nOjnifpBXjF?node-id=251-472',
  {
    example: () => <Sidebar activeItem="list" onNavigate={() => {}} />,
  },
)