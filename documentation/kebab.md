# Kebab Menu Component Documentation

A complete reference guide for creating consistent kebab menus (three-dot action menus) in the HRGA application.

## Overview

Kebab menus provide quick access to actions (View, Edit, Delete/Remove) for list items. They appear as a three-dot icon (⋮) that reveals a dropdown menu when clicked.

## DOM Structure

```
.kebab-btn (button)
  └── span (the ⋮ icon)
    
.kebab-dropdown (div, hidden by default)
  └── .kebab-option (button) - View
  └── .kebab-option (button) - Edit
  └── .kebab-option.is-danger (button) - Remove/Delete
```

---

## Component Specifications

### Kebab Button

| Property | Value |
|----------|-------|
| Element | `<button>` |
| Width | `28px` |
| Height | `28px` |
| Border Radius | `6px` |
| Background | `transparent` |
| Cursor | `pointer` |
| Transition | `background 150ms ease` |
| Icon | `⋮` (Unicode: U+22EE) |
| Icon Size | `16px` |
| Icon Color | `#666666` |

#### Button States

| State | Background | Notes |
|-------|------------|-------|
| Default | `transparent` | |
| Hover | `oklch(0.92 0.01 280)` | Light purple tint |
| Active/Pressed | `oklch(0.88 0.01 280)` | Darker on click |

#### CSS

```css
.{component}__kebab-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: background 150ms ease;
  flex-shrink: 0;
}

.{component}__kebab-btn:hover {
  background: oklch(0.92 0.01 280);
}
```

#### HTML

```html
<button class="{component}__kebab-btn" type="button">
  <span style="font-size:16px;color:#666;">⋮</span>
</button>
```

---

### Dropdown Menu

| Property | Value |
|----------|-------|
| Element | `<div>` |
| Position | `absolute` |
| Position Right | `16px` from parent |
| Position Top | `50%` from parent |
| Transform | `translateY(-50%)` (vertically centered) |
| Min Width | `140px` |
| Max Width | `auto` (based on content) |
| Background | `#ffffff` (white) |
| Border | `1px solid oklch(0.88 0.01 280)` |
| Border Radius | `10px` |
| Box Shadow | `0 4px 16px oklch(0.12 0.03 260 / 0.15)` |
| Z-Index | `100` |
| Padding | `6px` (internal spacing) |

#### States

| State | Display | Opacity |
|-------|---------|---------|
| Closed (Default) | `none` | N/A |
| Open | `block` | 1 |

#### CSS

```css
.{component}__kebab-dropdown {
  display: none;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  min-width: 140px;
  background: white;
  border: 1px solid oklch(0.88 0.01 280);
  border-radius: 10px;
  box-shadow: 0 4px 16px oklch(0.12 0.03 260 / 0.15);
  z-index: 100;
  overflow: hidden;
  padding: 6px;
}
```

---

### Menu Options

| Property | Value |
|----------|-------|
| Element | `<button>` |
| Display | `flex` |
| Flex Direction | `row` |
| Align Items | `center` |
| Gap | `10px` (between icon and label) |
| Width | `100%` |
| Padding | `10px 12px` |
| Border Radius | `6px` |
| Background | `transparent` |
| Font Size | `13px` |
| Font Weight | `500` (medium) |
| Color | `oklch(0.3 0.02 260)` |
| Text Align | `left` |
| Transition | `background 100ms ease` |
| Icon Size | `14px x 14px` |
| Icon Stroke Width | `2px` |
| Icon Color | `currentColor` (inherits from parent) |

#### Option States

| State | Background | Color |
|-------|------------|-------|
| Default | `transparent` | `oklch(0.3 0.02 260)` |
| Hover | `oklch(0.96 0.005 280)` | `oklch(0.3 0.02 260)` |

#### Danger Option (Delete/Remove)

| State | Background | Color |
|-------|------------|-------|
| Default | `transparent` | `oklch(0.55 0.2 25)` (red) |
| Hover | `oklch(0.92 0.08 25 / 0.15)` | `oklch(0.55 0.2 25)` |

#### CSS

```css
.{component}__kebab-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 13px;
  color: oklch(0.3 0.02 260);
  cursor: pointer;
  transition: background 100ms ease;
  text-align: left;
}

.{component}__kebab-option:hover {
  background: oklch(0.96 0.005 280);
}

/* Danger variant for destructive actions */
.{component}__kebab-option.is-danger {
  color: oklch(0.55 0.2 25);
}

.{component}__kebab-option.is-danger:hover {
  background: oklch(0.92 0.08 25 / 0.15);
}
```

---

## Behavior

### Opening the Menu

1. User clicks the kebab button (⋮)
2. Dropdown menu appears with `display: block`
3. Menu is positioned vertically centered on the button

### Closing the Menu

The menu closes when:
1. **User clicks outside** - A `document.addEventListener("click")` closes all dropdowns
2. **User clicks a menu option** - Executes action and closes menu
3. **User clicks another kebab button** - Closes all other dropdowns first, opens the clicked one

### Multiple Kebab Menus

When there are multiple kebab menus (e.g., in a list), only one dropdown can be open at a time:

```javascript
function closeAllKebabMenus(except = null) {
  allKebabMenus.forEach(({ btn, dropdown }) => {
    if (dropdown !== except) {
      dropdown.style.display = "none";
    }
  });
}
```

### Click Event Handling

```javascript
kebabBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent document click from immediately closing
  const isCurrentlyOpen = kebabDropdown.style.display === "block";
  closeAllKebabMenus(kebabDropdown); // Close others
  kebabDropdown.style.display = isCurrentlyOpen ? "none" : "block";
});

document.addEventListener("click", () => {
  kebabDropdown.style.display = "none"; // Close on outside click
});
```

---

## Menu Items

### Standard Actions

| Action | Label | Icon | Danger |
|--------|-------|------|--------|
| View | "View" | Eye icon | No |
| Edit | "Edit" | Pencil icon | No |
| Delete/Remove | "Remove" / "Delete" | Trash icon | Yes |

### Icon SVGs

```html
<!-- Eye (View) -->
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>

<!-- Pencil (Edit) -->
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
</svg>

<!-- Trash (Delete/Remove) -->
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
</svg>
```

---

## JavaScript Implementation Pattern

### Basic Template

```javascript
function createKebabMenu(item, itemData, callbacks) {
  // 1. Create the kebab button
  const kebabBtn = createElement("button", "{component}__kebab-btn");
  kebabBtn.innerHTML = '<span style="font-size:16px;color:#666;">⋮</span>';
  
  // 2. Create the dropdown container
  const kebabDropdown = createElement("div", "{component}__kebab-dropdown");
  
  // 3. Define menu items
  const menuItems = [
    { label: "View", icon: "eye", action: "view" },
    { label: "Edit", icon: "edit", action: "edit" },
    { label: "Remove", icon: "trash", action: "remove", danger: true },
  ];
  
  // 4. Create menu option buttons
  menuItems.forEach(menu => {
    const menuBtn = createElement("button", `{component}__kebab-option${menu.danger ? " is-danger" : ""}`);
    menuBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${getIconSvg(menu.icon)}
      </svg>
      ${menu.label}
    `;
    
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllKebabMenus();
      if (callbacks && callbacks[menu.action]) {
        callbacks[menu.action](itemData);
      }
    });
    
    kebabDropdown.append(menuBtn);
  });
  
  // 5. Track this menu in the global list
  allKebabMenus.push({ btn: kebabBtn, dropdown: kebabDropdown });
  
  // 6. Add click handler to toggle dropdown
  kebabBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isCurrentlyOpen = kebabDropdown.style.display === "block";
    closeAllKebabMenus(kebabDropdown);
    kebabDropdown.style.display = isCurrentlyOpen ? "none" : "block";
  });
  
  // 7. Close dropdown when clicking outside
  document.addEventListener("click", () => {
    kebabDropdown.style.display = "none";
  });
  
  return { kebabBtn, kebabDropdown };
}
```

### Global State for Multiple Menus

```javascript
// Outside the createKebabMenu function
const allKebabMenus = [];

function closeAllKebabMenus(except = null) {
  allKebabMenus.forEach(({ btn, dropdown }) => {
    if (dropdown !== except) {
      dropdown.style.display = "none";
    }
  });
}

// Call closeAllKebabMenus.length = 0 when re-rendering the list
```

---

## Color Summary

### Neutral Actions (View, Edit)

| Element | Color | OKLCH |
|---------|-------|-------|
| Button Default | Transparent | N/A |
| Button Hover | Light purple | `oklch(0.92 0.01 280)` |
| Icon | Dark gray | `#666666` |
| Option Text | Dark gray | `oklch(0.3 0.02 260)` |
| Option Hover | Very light purple | `oklch(0.96 0.005 280)` |

### Danger Actions (Delete/Remove)

| Element | Color | OKLCH |
|---------|-------|-------|
| Option Text | Red | `oklch(0.55 0.2 25)` |
| Option Hover | Light red tint | `oklch(0.92 0.08 25 / 0.15)` |

### Dropdown Container

| Property | Color | OKLCH |
|----------|-------|-------|
| Background | White | `#ffffff` |
| Border | Light gray | `oklch(0.88 0.01 280)` |
| Shadow | Semi-transparent dark | `oklch(0.12 0.03 260 / 0.15)` |

---

## Accessibility

1. **Button role**: Use `<button>` element for semantic correctness
2. **Type attribute**: Always set `type="button"` to prevent form submission
3. **Click propagation**: Use `e.stopPropagation()` on kebab button to prevent immediate close
4. **Focus management**: Dropdown closes when user clicks outside

---

## Best Practices

1. **Use danger styling for destructive actions** - Delete/Remove should always use the `.is-danger` class with red color

2. **Close other dropdowns when opening** - Users expect only one dropdown open at a time

3. **Use `stopPropagation()`** - Prevents the document click handler from immediately closing the dropdown

4. **Track all menus in a global array** - Enables closing all dropdowns when one opens

5. **Reinitialize array on list re-render** - Call `allKebabMenus.length = 0` before re-rendering the list

6. **Consistent icon sizing** - All icons should be `14px x 14px` with `stroke-width: 2`

---

## Troubleshooting

### Dropdown not appearing
- Check if `display: none` is being overridden
- Ensure parent has `position: relative` if using `position: absolute`
- Verify `z-index` is high enough

### Dropdown being clipped
- Parent container might have `overflow: hidden`
- Try using `position: fixed` for the dropdown instead

### Multiple dropdowns open at once
- Ensure `closeAllKebabMenus()` is called before opening
- Check that all kebab buttons are tracked in `allKebabMenus`

---

## Changelog

- **2026-03-26**: Initial documentation based on Organization Settings kebab menu
