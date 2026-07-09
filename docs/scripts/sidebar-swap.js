// Re-capture seam, step 4 (after componentize): replace captured sidebar with Sidebar instance
// and set each SidebarNavItem child State (Default | Active).
//
// HOW TO FILL:
// - FRAME_ID: page frame after seam-swap + bind + componentize
// - SIDEBAR_ID: Sidebar component from docs/MAPPING.md (composed, not a variant set)
// - ACTIVE_LABEL: 'All Tasks' | 'Labels' | 'History' | 'Settings' | null (all Default)
//
// Finds the first child named 'Sidebar' or 256px-wide left column under the App root frame.

const FRAME_ID = 'FRAME_ID_HERE';
const SIDEBAR_ID = '251:472';
const ACTIVE_LABEL = 'All Tasks';

const VIEW_TO_ACTIVE_LABEL = {
  list: 'All Tasks',
  labels: 'Labels',
  history: 'History',
  settings: 'Settings',
  create: null,
  detail: null,
};

const frame = await figma.getNodeByIdAsync(FRAME_ID);
const appRoot = frame.children.find(c => c.type === 'FRAME' && c.width >= 1400) || frame.children[0];
if (!appRoot) return { error: 'no app root' };

let sidebarNode = appRoot.children.find(
  c => c.name === 'Sidebar' || (c.type === 'FRAME' && c.width >= 250 && c.width <= 270),
);
if (!sidebarNode) {
  return { error: 'sidebar not found', appChildren: appRoot.children.map(c => ({ name: c.name, w: c.width })) };
}

const sidebarComp = await figma.getNodeByIdAsync(SIDEBAR_ID);
if (!sidebarComp || sidebarComp.type !== 'COMPONENT') {
  return { error: 'Sidebar component not found', SIDEBAR_ID };
}

const inst = sidebarComp.createInstance();
const parent = sidebarNode.parent;
const idx = parent.children.indexOf(sidebarNode);
parent.insertChild(idx, inst);
inst.x = sidebarNode.x;
inst.y = sidebarNode.y;
sidebarNode.remove();

const nav = inst.findOne(n => n.name === 'Navigation');
const updated = [];
if (nav) {
  for (const child of nav.children) {
    if (child.type !== 'INSTANCE' || !child.name.startsWith('NavItem/')) continue;
    const label = child.name.replace('NavItem/', '');
    const state = ACTIVE_LABEL && label === ACTIVE_LABEL ? 'Active' : 'Default';
    child.setProperties({ State: state });
    updated.push({ label, state });
  }
}

return { frame: frame.name, instanceId: inst.id, activeLabel: ACTIVE_LABEL, updated };