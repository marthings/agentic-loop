// Re-capture seam, step 4 (after componentize): replace captured sidebar with Sidebar instance.
//
// HOW TO FILL:
// - FRAME_ID: page frame after seam-swap + bind + componentize
// - SIDEBAR_SET_ID: from docs/MAPPING.md components table (Sidebar)
// - ACTIVE_ITEM: Figma variant name — 'All Tasks' | 'Labels' | 'History' | 'Settings'
//
// Finds the first child named 'Sidebar' or 256px-wide left column under the App root frame.

const FRAME_ID = 'FRAME_ID_HERE';
const SIDEBAR_SET_ID = '229:240';
const ACTIVE_ITEM = 'All Tasks';

const VIEW_TO_ACTIVE = {
  list: 'All Tasks',
  labels: 'Labels',
  history: 'History',
  settings: 'Settings',
  create: 'All Tasks',
  detail: 'All Tasks',
};

const frame = await figma.getNodeByIdAsync(FRAME_ID);
const appRoot = frame.children.find(c => c.type === 'FRAME' && c.width >= 1400) || frame.children[0];
if (!appRoot) return { error: 'no app root' };

let sidebarNode = appRoot.children.find(c => c.name === 'Sidebar' || (c.type === 'FRAME' && c.width >= 250 && c.width <= 270));
if (!sidebarNode) return { error: 'sidebar not found', appChildren: appRoot.children.map(c => ({ name: c.name, w: c.width })) };

const sidebarSet = await figma.getNodeByIdAsync(SIDEBAR_SET_ID);
const variantName = 'Active item=' + ACTIVE_ITEM;
const variant = sidebarSet.children.find(c => c.name === variantName);
if (!variant) return { error: 'variant not found', variantName };

const inst = variant.createInstance();
const parent = sidebarNode.parent;
const idx = parent.children.indexOf(sidebarNode);
parent.insertChild(idx, inst);
inst.x = sidebarNode.x;
inst.y = sidebarNode.y;
sidebarNode.remove();

return { frame: frame.name, instanceId: inst.id, active: ACTIVE_ITEM };