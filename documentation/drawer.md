# Drawer Component Documentation

A complete reference guide for creating consistent drawers in the HRGA application, based on the Calendar New Event drawer implementation.

## Overview

Drawers are slide-in panels from the right side of the screen used for creating/editing content. They provide a focused workspace without navigating away from the current context.

**Reference Implementation**: `createEventDrawer()` in `src/components/app-shell.js` (line 1858)

---

## DOM Structure

```
.{drawer-name}-overlay (fixed, full viewport)
  └── .{drawer-name}-overlay__backdrop (click to close)
  └── aside.{drawer-name} (the drawer panel)
      ├── .{drawer-name}__header
      │   ├── .{drawer-name}__header-left
      │   │   ├── .{drawer-name}__back (chevron-left icon)
      │   │   └── .{drawer-name}__title (h2)
      │   └── .{drawer-name}__close (x icon)
      ├── .{drawer-name}__body (scrollable content area)
      │   └── [form sections using drawer-form__* classes]
      └── .{drawer-name}__footer
          └── .{drawer-name}__footer-actions
              ├── Save button (primary)
              └── Cancel button (ghost)
```

---

## CSS Specifications (All Values in Pixels)

### Container Dimensions

| Property | Value | Notes |
|----------|-------|-------|
| `--drawer-width` | `min(50vw, 48rem)` | 768px max, 50% viewport width |
| `max-width` | `calc(100vw - 16px)` | 16px margin on mobile |

### Overlay

```css
.{drawer-name}-overlay {
  position: fixed;
  inset: 0;
  display: block;
  pointer-events: none;
  z-index: 30;
}

.{drawer-name}-overlay.is-open {
  pointer-events: auto;
}
```

### Backdrop

```css
.{drawer-name}-overlay__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: oklch(0.18 0.02 255 / 0.42);
  opacity: 0;
  transition: opacity 260ms ease;
}

.{drawer-name}-overlay.is-open .{drawer-name}-overlay__backdrop {
  opacity: 1;
}
```

### Drawer Panel

```css
.{drawer-name} {
  width: var(--drawer-width);
  max-width: calc(100vw - 16px);
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  display: grid;                    /* Critical for layout */
  grid-template-rows: auto 1fr auto; /* Header, Body (flex), Footer */
  background: #ffffff;
  border-left: 1px solid oklch(0.9 0.01 255);
  box-shadow: -12px 0 40px oklch(0.18 0.02 255 / 0.12);
  transform: translateX(100%);
  opacity: 0;
  will-change: transform, opacity;
  transition:
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease;
}

.{drawer-name}-overlay.is-open .{drawer-name} {
  transform: translateX(0);
  opacity: 1;
}
```

---

## Header Specifications

### Header Container

```css
.{drawer-name}__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid oklch(0.9 0.01 255);
}
```

### Header Left (Back + Title)

```css
.{drawer-name}__header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

### Title

```css
.{drawer-name}__title {
  margin: 0;
  font-family: "Outfit", sans-serif;
  font-size: 15px;
  font-weight: 600;
}
```

### Back/Close Buttons

```css
.{drawer-name}__back,
.{drawer-name}__close {
  border: 0;
  background: transparent;
  color: oklch(0.46 0.02 255);
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  cursor: pointer;
}

.{drawer-name}__back:hover,
.{drawer-name}__back:focus-visible,
.{drawer-name}__close:hover,
.{drawer-name}__close:focus-visible {
  background: oklch(0.96 0.01 255);
}
```

---

## Body Specifications

### Container

```css
.{drawer-name}__body {
  overflow-y: auto;
  overflow-x: visible;
  padding: 14px 20px 18px 30px;
  display: grid;
  align-content: start;
  gap: 12px;
  scrollbar-gutter: stable;
}
```

**Padding**: Top 14px, Right 20px, Bottom 18px, Left 30px

---

## Form Elements (drawer-form__* classes)

### Section Container

```css
.drawer-form__section {
  display: block;
}

.drawer-form__section > *:not(:first-child) {
  margin-top: 12px;  /* 12px spacing between elements in section */
}
```

### Section Label (with Icon)

```css
.drawer-form__section-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: oklch(0.42 0.02 255);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
```

**Usage**:
```javascript
function createSectionLabel(iconName, text) {
  const label = createElement("div", "drawer-form__section-label");
  const icon = createElement("span", "drawer-form__section-icon");
  const copy = createElement("span", "drawer-form__section-text", text);
  icon.append(createIcon(iconName));
  label.append(icon, copy);
  return label;
}
```

### Form Group

```css
.drawer-form__group {
  display: grid;
  gap: 5px;  /* 5px spacing between label and input */
}
```

### Label

```css
.drawer-form__label {
  color: oklch(0.3 0.02 255);  /* Dark text */
  font-size: 12px;
  font-weight: 500;
}
```

**Font Color**: `oklch(0.3 0.02 255)` - Dark readable color

### Required Field Indicator

```css
.drawer-form__required {
  color: #c15656;  /* Red for required */
  font-weight: 700;
}
```

### Title Input (Primary Text Input)

```css
.drawer-form__title-input {
  flex: 1;
  border: 0;
  background: transparent;
  color: oklch(0.18 0.02 255);
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  min-height: 40px;
}

.drawer-form__title-input::placeholder {
  color: oklch(0.5 0.02 255);
}
```

### Standard Input

```css
.drawer-form__input {
  width: 100%;
  border: 1px solid oklch(0.88 0.01 255);
  border-radius: 10px;
  padding: 0 12px;
  min-height: 40px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
}

.drawer-form__input:focus,
.drawer-form__textarea:focus {
  border-color: #8f96ef;
  box-shadow: 0 0 0 3px oklch(0.55 0.12 281 / 0.1);
}

.drawer-form__input::placeholder {
  color: oklch(0.7 0.02 255);
}
```

### Date Input

```css
.drawer-form__date-input {
  width: 100%;
  border: 1px solid oklch(0.88 0.01 255);
  border-radius: 10px;
  padding: 0 12px;
  min-height: 40px;
  font-family: inherit;
  font-size: 14px;
}
```

### Select (Native)

```css
.drawer-form__native-select {
  width: 100%;
  appearance: none;
  border: 1px solid oklch(0.88 0.01 255);
  border-radius: 10px;
  padding: 0 28px 0 12px;
  min-height: 40px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
}
```

---

## Footer Specifications

### Footer Container

```css
.{drawer-name}__footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 14px 16px;  /* Top/Bottom 14px, Left/Right 16px */
  border-top: 1px solid oklch(0.9 0.01 255);
}
```

### Footer Actions

```css
.{drawer-name}__footer-actions {
  display: flex;
  gap: 10px;  /* 10px spacing between Save and Cancel */
}
```

### Buttons

```css
.{drawer-name}__button {
  border-radius: 999px;  /* Fully rounded */
  padding: 10px 18px;    /* Top/Bottom 10px, Left/Right 18px */
  border: 1px solid oklch(0.88 0.01 255);
  background: #ffffff;
  color: oklch(0.36 0.02 255);
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
}

.{drawer-name}__button--primary {
  border: 0;
  background: #6f74d8;  /* Primary blue */
  color: #ffffff;
  box-shadow: 0 10px 18px oklch(0.42 0.09 282 / 0.18);
}

.{drawer-name}__button--ghost {
  background: transparent;
}

.{drawer-name}__button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  box-shadow: none;
}
```

**Button Order**: Save (primary) first, then Cancel (ghost)

---

## Spacing Summary (Pixels)

| Element | Spacing |
|---------|---------|
| Header padding | 16px 20px |
| Body padding | 14px 20px 18px 30px |
| Footer padding | 14px 16px |
| Section gap (body) | 12px |
| Group gap | 5px |
| Form section children | 12px |
| Header left gap | 8px |
| Footer actions gap | 10px |
| Footer content gap | 12px |
| Section label icon gap | 6px |

---

## Font Specifications

| Element | Font Family | Size | Weight | Color |
|---------|-------------|------|--------|-------|
| Title | "Outfit", sans-serif | 15px | 600 | oklch(0.18 0.02 255) |
| Section Label | inherit | 12px | 600 | oklch(0.42 0.02 255) |
| Form Label | inherit | 12px | 500 | oklch(0.3 0.02 255) |
| Input text | inherit | 14-15px | 500 | oklch(0.18 0.02 255) |
| Input placeholder | inherit | 14-15px | 400 | oklch(0.5-0.7 0.02 255) |
| Button | inherit | 13px | 400 | #fff / oklch(0.36 0.02 255) |

---

## Color Specifications (OKLCH)

| Purpose | Color |
|---------|-------|
| Primary text | `oklch(0.18 0.02 255)` or `oklch(0.3 0.02 255)` |
| Secondary text | `oklch(0.42 0.02 255)` or `oklch(0.46 0.02 255)` |
| Muted text | `oklch(0.5 0.02 255)` |
| Placeholder | `oklch(0.7 0.02 255)` |
| Border | `oklch(0.88 0.01 255)` or `oklch(0.9 0.01 255)` |
| Background | `#ffffff` |
| Primary button | `#6f74d8` |
| Required indicator | `#c15656` |

---

## JavaScript Implementation Pattern

### Basic Drawer Function Template

```javascript
function create{Entity}Drawer(state, closeDrawer, onSave, isOpen = false) {
  // 1. Create DOM structure
  const overlay = createElement(
    "div",
    `{entity}-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", `{entity}-drawer-overlay__backdrop`);
  const drawer = createElement("aside", `{entity}-drawer`);
  const header = createElement("div", `{entity}-drawer__header`);
  const headerLeft = createElement("div", `{entity}-drawer__header-left`);
  const backButton = createElement("button", `{entity}-drawer__back`);
  const title = createElement("h2", `{entity}-drawer__title`, "New {Entity}");
  const closeButton = createElement("button", `{entity}-drawer__close`);
  const body = createElement("div", `{entity}-drawer__body`);
  const footer = createElement("div", `{entity}-drawer__footer`);

  // 2. Set attributes and add event listeners
  overlay.setAttribute("aria-hidden", String(!state.is{Entity}DrawerOpen));
  drawer.setAttribute("aria-label", "New {entity} drawer");
  backdrop.type = "button";
  backButton.type = "button";
  closeButton.type = "button";

  backButton.append(createIcon("chevron-left"));
  closeButton.append(createIcon("close"));

  backdrop.addEventListener("click", closeDrawer);
  backButton.addEventListener("click", closeDrawer);
  closeButton.addEventListener("click", closeDrawer);

  // 3. Build body content with form sections
  const section = createElement("div", "drawer-form__section");
  section.append(createSectionLabel("icon-name", "Section Title"));

  const group = createElement("div", "drawer-form__group");
  const label = createElement("label", "drawer-form__label");
  label.append(createElement("span", "", "Field Name"), createElement("span", "drawer-form__required", " *"));

  const input = createElement("input", "drawer-form__title-input");
  input.type = "text";
  input.value = state.{entity}Draft.fieldName;
  input.placeholder = "Enter value";
  input.addEventListener("input", (event) => {
    state.{entity}Draft.fieldName = event.target.value;
  });

  group.append(label, input);
  section.append(group);
  body.append(section);

  // 4. Build footer with Save/Cancel buttons
  const footerLeft = createElement("div", `{entity}-drawer__footer-actions`);
  const cancelButton = createElement(
    "button",
    `{entity}-drawer__button ${entity}-drawer__button--ghost`,
    "Cancel",
  );
  const saveButton = createElement(
    "button",
    `{entity}-drawer__button ${entity}-drawer__button--primary`,
    "Save",
  );

  const saveEnabled = is{Entity}DraftValid(state.{entity}Draft);
  cancelButton.type = "button";
  saveButton.type = "button";
  saveButton.disabled = !saveEnabled;

  cancelButton.addEventListener("click", closeDrawer);
  saveButton.addEventListener("click", () => {
    if (!is{Entity}DraftValid(state.{entity}Draft)) {
      return;
    }
    onSave();
  });

  footerLeft.append(saveButton, cancelButton);
  footer.append(footerLeft);

  // 5. Assemble final structure
  headerLeft.append(backButton, title);
  header.append(headerLeft, closeButton);
  drawer.append(header, body, footer);
  overlay.append(backdrop, drawer);

  return overlay;
}
```

### Close Function

```javascript
function close{Entity}Drawer() {
  state.is{Entity}DrawerOpen = false;
  state.{entity}Draft = getInitial{Entity}Draft();
  render();
}
```

### Save Function

```javascript
function save{Entity}Draft() {
  const { entity }App = get{Entity}App();
  const new{Entity} = {
    id: `{entity}-${Date.now()}`,
    name: state.{entity}Draft.name,
    // ... other fields
  };
  { entity }App.{ entity }s.push(new{Entity});
  state.activeItem = "All {Entity}s";
  state.lastAction = "{entity}-created";
  state.is{Entity}DrawerOpen = false;
  state.{entity}Draft = getInitial{Entity}Draft();
  render();
}
```

### Opening the Drawer

```javascript
function open{Entity}Drawer() {
  state.lastAction = "new-{entity}";
  state.activeItem = "New {Entity}";
  state.{entity}Draft = getInitial{Entity}Draft();
  state.is{Entity}DrawerOpen = true;
  render();
}
```

### Render Integration

```javascript
// In main render() function
if (state.is{Entity}DrawerOpen) {
  const { entity }DrawerOverlay = create{Entity}Drawer(
    state,
    close{Entity}Drawer,
    save{Entity}Draft,
    false,
  );
  shell.append({ entity }DrawerOverlay);
  requestAnimationFrame(() => {
    void { entity }DrawerOverlay.offsetWidth;
    requestAnimationFrame(() => {
      if ({ entity }DrawerOverlay.isConnected) {
        { entity }DrawerOverlay.classList.add("is-open");
      }
    });
  });
}
```

---

## CSS Template

Copy and replace `{drawer-name}` with your drawer's name (e.g., `user-drawer`, `asset-drawer`):

```css
/* Overlay */
.{drawer-name}-overlay {
  position: fixed;
  inset: 0;
  display: block;
  pointer-events: none;
  z-index: 30;
}

.{drawer-name}-overlay.is-open {
  pointer-events: auto;
}

.{drawer-name}-overlay__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: oklch(0.18 0.02 255 / 0.42);
  opacity: 0;
  transition: opacity 260ms ease;
}

.{drawer-name}-overlay.is-open .{drawer-name}-overlay__backdrop {
  opacity: 1;
}

/* Drawer Panel */
.{drawer-name} {
  width: var(--drawer-width);
  max-width: calc(100vw - 16px);
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: #ffffff;
  border-left: 1px solid oklch(0.9 0.01 255);
  box-shadow: -12px 0 40px oklch(0.18 0.02 255 / 0.12);
  transform: translateX(100%);
  opacity: 0;
  will-change: transform, opacity;
  transition:
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 300ms ease;
}

.{drawer-name}-overlay.is-open .{drawer-name} {
  transform: translateX(0);
  opacity: 1;
}

/* Header */
.{drawer-name}__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid oklch(0.9 0.01 255);
}

.{drawer-name}__header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.{drawer-name}__title {
  margin: 0;
  font-family: "Outfit", sans-serif;
  font-size: 15px;
  font-weight: 600;
}

.{drawer-name}__back,
.{drawer-name}__close {
  border: 0;
  background: transparent;
  color: oklch(0.46 0.02 255);
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  cursor: pointer;
}

.{drawer-name}__back:hover,
.{drawer-name}__back:focus-visible,
.{drawer-name}__close:hover,
.{drawer-name}__close:focus-visible {
  background: oklch(0.96 0.01 255);
}

/* Body */
.{drawer-name}__body {
  overflow-y: auto;
  overflow-x: visible;
  padding: 14px 20px 18px 30px;
  display: grid;
  align-content: start;
  gap: 12px;
  scrollbar-gutter: stable;
}

/* Footer */
.{drawer-name}__footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid oklch(0.9 0.01 255);
}

.{drawer-name}__footer-actions {
  display: flex;
  gap: 10px;
}

.{drawer-name}__button {
  border-radius: 999px;
  padding: 10px 18px;
  border: 1px solid oklch(0.88 0.01 255);
  background: #ffffff;
  color: oklch(0.36 0.02 255);
  cursor: pointer;
  font-size: 13px;
}

.{drawer-name}__button--primary {
  border: 0;
  background: #6f74d8;
  color: #ffffff;
  box-shadow: 0 10px 18px oklch(0.42 0.09 282 / 0.18);
}

.{drawer-name}__button--ghost {
  background: transparent;
}

.{drawer-name}__button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  box-shadow: none;
}
```

---

## Common Icons

Add these to the `icons` object in `createIcon()` function:

| Icon Name | SVG |
|-----------|-----|
| `user` | User profile icon |
| `briefcase` | Work/employment icon |
| `shield` | Security/access icon |
| `calendar` | Calendar icon |
| `clock` | Time icon |
| `location` | Location icon |
| `description` | Description/note icon |
| `reminder` | Bell/notification icon |
| `attachment` | Paperclip icon |
| `close` | X icon |
| `chevron-left` | Left arrow icon |

---

## Best Practices

1. **Always use CSS Grid with `grid-template-rows: auto 1fr auto`** for the drawer container - this enables proper scrolling and keeps the footer visible at the bottom.

2. **Reuse `drawer-form__*` classes** - Don't create custom form element classes unless absolutely necessary.

3. **Use `createSectionLabel()` helper** for consistent section headers with icons.

4. **Button order in footer**: Save (primary) first, then Cancel (ghost).

5. **Validation**: Disable the Save button until the form is valid. Use a validation function like `is{Entity}DraftValid()`.

6. **Animation**: Use `requestAnimationFrame` twice for smooth slide-in animation when opening the drawer.

7. **Accessibility**: Always set `aria-hidden`, `aria-label`, and proper `type` attributes on buttons.

8. **State management**: Reset draft state when closing the drawer to prevent stale data.

9. **Spacing consistency**: Use the documented pixel values for consistent spacing across all drawers.

10. **Font colors**: Use the OKLCH color values provided for consistent text hierarchy.

---

## Troubleshooting

### Drawer not appearing
- Check that `overlay` is appended to the shell
- Verify `is-open` class is being added after render
- Ensure `z-index` is 30 or higher

### Body not scrollable
- **Critical**: Ensure drawer has `display: grid` with `grid-template-rows: auto 1fr auto`
- Body should have `overflow-y: auto` and `align-content: start`

### Footer buttons not visible
- **Critical**: Grid layout must be `grid-template-rows: auto 1fr auto` (not flex)
- Check that footer is appended to drawer AFTER body

### Animation not working
- Use double `requestAnimationFrame` for adding `is-open` class
- Ensure `will-change: transform, opacity` is set

### Font color too light
- Use `oklch(0.3 0.02 255)` for labels, not lighter values
- For input text, use `oklch(0.18 0.02 255)` for maximum contrast
- Never use pure black `#000` - use OKLCH colors with slight chroma

---

## Changelog

- **2026-03-26**: Initial documentation based on Calendar New Event drawer
