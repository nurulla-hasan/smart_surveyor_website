## Mobile Responsive Optimization Plan

### 1. Map Toolbar (`src/components/maps/map-toolbar.tsx`)
- **Responsive Layout**: Use media queries (`md:hidden`) to switch between layouts.
- **Mobile Menu**: Replace individual buttons with a single "Menu" button that opens a `Sheet` containing all tools (Upload, Saved Maps, Layers).
- **Search Bar**: Make it full width on mobile with a cleaner look.

### 2. Survey Controls (`src/components/maps/survey-controls.tsx`)
- **Compact Top Bar**: Redesign the area stats bar to be smaller and translucent on mobile.
- **Bottom Action Sheet**: Instead of floating buttons blocking the view, use a collapsible bottom sheet for actions (Undo, Reset, Save).
- **Thumb-Friendly**: Ensure main actions (Add Point) are easily reachable.

### 3. Save Dialog (`src/components/maps/map-dialogs.tsx`)
- **Adaptive Component**: Detect screen size.
- **Mobile**: Render as a `Sheet` (Bottom Sheet) with full width inputs.
- **Desktop**: Render as a centered `Dialog` (Modal).

### 4. Saved Maps Drawer (`src/components/maps/saved-maps-drawer.tsx`)
- **Responsive Position**: `side="bottom"` on mobile (taking up half screen) and `side="left"` on desktop.