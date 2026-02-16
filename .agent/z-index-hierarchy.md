# Z-Index Hierarchy Standards

This document defines the z-index layering system for the application to ensure proper stacking order.

## Layer Hierarchy

### Base Layers (0-99)
- Canvas: `z-0` (default)
- Background elements: `z-1` to `z-9`

### UI Components (100-299)
- Topbar: `z-100`
- Sidebar: `z-100`
- Property Panel: `z-100`
- **FloatingToolbar: `z-50`** (must stay below modals)
- Tooltips: `z-200`

### Modals & Overlays (300+)
- AI Modal: `z-[300]`
- Profile Menu Dropdown: `z-[400]`
- Subscription Modal: `z-[500]`
- **Future Popups: `z-[500]` and above**

## Rules

1. **All modals/popups MUST use `z-[300]` or higher** to stay above canvas and toolbars
2. **Stacking order for overlays:**
   - Base modals: 300-399
   - Dropdowns/menus: 400-499
   - Full-screen overlays: 500-599
   - Critical alerts: 600+

3. **Never use z-index below 100 for interactive overlays**

## Current Implementation

| Component | Z-Index | File |
|-----------|---------|------|
| Canvas | default (0) | InfiniteCanvas.tsx |
| Topbar | 100 | TopBar.tsx |
| AI Modal | 300 | AIModal.tsx |
| Profile Menu | 400 | ProfileMenu.tsx |
| Subscription Modal | 500 | SubscriptionModal.tsx |

## Adding New Popups

When creating new popup components:
1. Use `z-[500]` as default for full-screen modals
2. Use `z-[400]` for dropdown menus
3. Always include backdrop: `fixed inset-0 bg-black/70`
4. Add `overflow-hidden` to modal containers for proper border-radius rendering
