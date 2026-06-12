# Context Navigation Overflow Menu Primitive Contract

Layer: 03-primitive  
Family: context-navigation  
Status: review-ready

## Purpose

`context-navigation-overflow-menu` governs the More trigger and expandable menu used when context-navigation items exceed available mobile slots.

It preserves overflow reachability. It must not silently drop primary or utility items.

## Token Dependencies

- `context-navigation-overflow-menu-frame`

## Primitive Dependencies

- `context-navigation-item-control` for the More trigger only.

## Behavior

- The More trigger is a native utility item control.
- Overflow panel items use the existing source `.menu-item` anatomy from `src/frontend/designSystem/assets/styles.css`.
- Destination overflow items render as plain `.menu-item` links with `role="menuitem"`.
- Utility overflow items render as plain `.menu-item.menu-item-button` native buttons with `role="menuitem"`.
- Overflow panel items must not render context-navigation icons, context-navigation item labels, stacked mobile bottom-bar anatomy, or context-navigation item-control markup inside the panel.
- The trigger exposes `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls`.
- Click toggles the menu.
- Escape closes the menu and restores focus to the trigger.
- Outside click closes the menu.
- Activating a destination menu item follows native link behavior after closing.
- Activating a utility menu item closes the menu and emits the same activation event shape used by context-navigation utility controls.

## Consumer Boundary

Allowed:

- Use inside context-navigation patterns when mobile slots cannot show every primary or utility item.

Denied:

- Do not use as a generic menu, drawer, select, tooltip, app router, or command palette.
- Do not use for drawer payloads or product workflow actions outside context navigation.

## Proof

Default proof route:

- `/design-system/default/primitives/context-navigation-overflow-menu`

Runtime seam:

- `src/frontend/designSystem/layers/03-primitive/context-navigation-overflow-menu/index.mjs`
