# PRD PROMPT: HRGA IMAJIN Workspace Management System

## 1. PROJECT OVERVIEW

**Application Name:** HRGA IMAJIN  
**Purpose:** Enterprise HR & General Affairs management system with asset lifecycle management  
**Tech Stack:** Vanilla JavaScript, Vite, custom CSS, PDF.js for document preview  
**Color Format:** OKLCH (not RGB/HSL)

---

## 2. DESIGN TOKENS

### 2.1 Colors

```css
/* Primary Accent */
--accent: oklch(0.62 0.19 265);        /* #6f74d8 - Primary purple */
--accent-hover: oklch(0.55 0.22 265);   /* Hover state */
--accent-light: oklch(0.75 0.15 265);   /* Light accent for backgrounds */
--accent-dark: oklch(0.52 0.22 265);    /* Dark accent for pressed */

/* Backgrounds */
--bg: oklch(0.94 0.005 255);            /* Main background - light gray #f0f0f2 */
--surface: oklch(0.98 0.005 255);       /* Card/surface background - near white */
--surface-raised: oklch(1 0 0);         /* Elevated surfaces (white) */
--surface-overlay: oklch(0.96 0.005 255); /* Overlay backgrounds */

/* Text */
--text: oklch(0.95 0.01 260);           /* Strong text - near white */
--text-secondary: oklch(0.77 0.02 260); /* Soft text - gray */
--text-muted: oklch(0.63 0.02 260);     /* Muted/placeholder text */

/* Borders */
--border: oklch(0.91 0.01 265);         /* Default border */
--border-strong: oklch(0.85 0.015 265); /* Stronger border */
--border-focus: oklch(0.62 0.19 265);   /* Focus state border */

/* Status Colors */
--success: oklch(0.72 0.19 145);         /* Green - approved/active */
--success-bg: oklch(0.95 0.15 145 / 0.12);
--success-text: oklch(0.55 0.15 145);

--warning: oklch(0.75 0.18 85);          /* Orange - pending/warning */
--warning-bg: oklch(0.95 0.15 85 / 0.12);
--warning-text: oklch(0.55 0.15 85);

--danger: oklch(0.63 0.24 25);           /* Red - rejected/danger */
--danger-bg: oklch(0.95 0.2 25 / 0.12);
--danger-text: oklch(0.55 0.2 25);

--info: oklch(0.68 0.17 250);            /* Blue - info */
--info-bg: oklch(0.95 0.15 250 / 0.12);
--info-text: oklch(0.55 0.15 250);

--neutral: oklch(0.55 0.02 265);         /* Neutral gray */
--neutral-bg: oklch(0.94 0.01 265 / 0.1);
--neutral-text: oklch(0.55 0.02 265);
```

### 2.2 Typography

```css
/* Body Font - Plus Jakarta Sans */
--font-body: "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
font-weight: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

/* Headings Font - Outfit */
--font-heading: "Outfit", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
font-weight: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

/* Font Sizes */
--text-xs: 0.75rem;       /* 12px - badges, captions */
--text-sm: 0.8125rem;     /* 13px - secondary text */
--text-base: 0.875rem;    /* 14px - body text */
--text-lg: 1rem;          /* 16px - large body */
--text-xl: 1.25rem;       /* 20px - section titles */
--text-2xl: 1.5rem;       /* 24px - page titles */
--text-3xl: 2rem;         /* 32px - major headings */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Letter Spacing */
--tracking-tight: -0.01em;
--tracking-normal: 0;
--tracking-wide: 0.05em;  /* Used for uppercase labels */
```

### 2.3 Spacing

```css
--space-0: 0;
--space-px: 1px;
--space-0-5: 0.125rem;   /* 2px */
--space-1: 0.25rem;       /* 4px */
--space-1-5: 0.375rem;    /* 6px */
--space-2: 0.5rem;        /* 8px */
--space-2-5: 0.625rem;    /* 10px */
--space-3: 0.75rem;       /* 12px */
--space-3-5: 0.875rem;    /* 14px */
--space-4: 1rem;          /* 16px */
--space-5: 1.25rem;       /* 20px */
--space-6: 1.5rem;        /* 24px */
--space-7: 1.75rem;       /* 28px */
--space-8: 2rem;          /* 32px */
--space-9: 2.25rem;       /* 36px */
--space-10: 2.5rem;       /* 40px */
--space-12: 3rem;         /* 48px */
--space-14: 3.5rem;       /* 56px */
--space-16: 4rem;         /* 64px */
```

### 2.4 Border Radius

```css
--radius-none: 0;
--radius-sm: 6px;           /* Small elements */
--radius-md: 8px;           /* Default elements */
--radius-lg: 12px;          /* Cards, panels */
--radius-xl: 16px;          /* Large panels */
--radius-2xl: 20px;         /* Modals */
--radius-full: 9999px;      /* Pills, avatars */
```

### 2.5 Shadows

```css
--shadow-xs: 0 1px 2px oklch(0 0 0 / 0.04);
--shadow-sm: 0 1px 3px oklch(0 0 0 / 0.06), 0 1px 2px oklch(0 0 0 / 0.04);
--shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.06), 0 2px 4px -1px oklch(0 0 0 / 0.04);
--shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.08), 0 4px 6px -2px oklch(0 0 0 / 0.04);
--shadow-xl: 0 20px 25px -5px oklch(0 0 0 / 0.08), 0 10px 10px -5px oklch(0 0 0 / 0.03);
--shadow-drawer: -4px 0 24px oklch(0 0 0 / 0.12);
--shadow-dropdown: 0 4px 12px oklch(0 0 0 / 0.1);
```

### 2.6 Animation

```css
/* Durations */
--duration-fast: 120ms;
--duration-normal: 240ms;
--duration-slow: 360ms;
--duration-slower: 500ms;

/* Easings */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Z-Index Scale */
--z-base: 0;
--z-dropdown: 100;
--z-sticky: 200;
--z-drawer: 300;
--z-modal: 400;
--z-tooltip: 500;
--z-toast: 600;
```

---

## 3. LAYOUT SYSTEM

### 3.1 Overall Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│ Sidebar (collapsible: 84px rail ↔ 84px+230px expanded)                 │
│ ┌──────────┬────────────────────────────────────────┐                   │
│ │  84px    │  230px (expanded only)                 │                   │
│ │  Rail    │  Panel                                 │                   │
│ │          │                                        │                   │
│ │  Logo    │  App Title                             │                   │
│ │  (48px)  │                                        │                   │
│ │          │  ── Section Header ──                   │                   │
│ │  Nav     │  • Nav Item                            │                   │
│ │  Icons   │  • Nav Item                            │                   │
│ │  (40px)  │                                        │                   │
│ │          │  ── Another Section ──                  │                   │
│ │          │  • Nav Item                            │                   │
│ │          │                                        │                   │
│ │  User    │                                        │                   │
│ │  Avatar  │                                        │                   │
│ └──────────┴────────────────────────────────────────┘                   │
├────────────────────────────────────────────────────────────────────────┤
│ Content Stage (remaining width)                                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │                                                                    │ │
│ │  Workspace View (full height, scrollable)                          │ │
│ │                                                                    │ │
│ │  ┌──────────────────────────────────────────────────────────────┐ │ │
│ │  │ Workspace Header                                              │ │ │
│ │  │ Eyebrow + Title          [View Toggle] [Actions...]        │ │ │
│ │  ├──────────────────────────────────────────────────────────────┤ │ │
│ │  │ Toolbar: [Search] [Filter] [Count]                          │ │ │
│ │  ├──────────────────────────────────────────────────────────────┤ │ │
│ │  │ ┌────────────────────────────────────────────────────────┐   │ │ │
│ │  │ │ Table Header (sticky)                                  │   │ │ │
│ │  │ ├────────────────────────────────────────────────────────┤   │ │ │
│ │  │ │ Table Body (scrollable)                                │   │ │ │
│ │  │ │ ...rows...                                             │   │ │ │
│ │  │ └────────────────────────────────────────────────────────┘   │ │ │
│ │  └──────────────────────────────────────────────────────────────┘ │ │
│ │                                                                    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Sidebar Dimensions

```css
/* Sidebar Container */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 84px;  /* Rail width when collapsed */
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  z-index: var(--z-sticky);
  transition: width var(--duration-slow) var(--ease-out);
}

/* Expanded state */
.sidebar.is-expanded {
  width: calc(84px + 230px);  /* 314px total */
}

/* Rail (left side, always visible) */
.sidebar__rail {
  width: 84px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-3) 0;
  flex-shrink: 0;
}

/* Brand/Logo */
.brand {
  width: 48px;
  height: 48px;
  margin-bottom: var(--space-6);
  flex-shrink: 0;
}

.brand__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Rail Navigation */
.rail-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) 0;
}

/* Rail Nav Item */
.rail-nav__item {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out);
}

.rail-nav__item:hover {
  background: oklch(0 0 0 / 0.04);
}

.rail-nav__item.is-active {
  background: oklch(0.62 0.19 265 / 0.12);
  color: var(--accent);
}

/* Active Marker (pill behind icon) */
.sidebar__active-marker {
  position: absolute;
  left: -10px;
  width: 4px;
  height: 24px;
  background: var(--accent);
  border-radius: 0 var(--radius-full) var(--radius-full) 0;
  transition: transform var(--duration-slow) var(--ease-out),
              opacity var(--duration-normal) var(--ease-out);
  opacity: 0;
}

/* Panel (right side, expandable) */
.sidebar__panel {
  position: absolute;
  left: 84px;
  top: 0;
  width: 230px;
  height: 100%;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: var(--space-4);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-slow) var(--ease-out);
  overflow-y: auto;
}

.sidebar.is-expanded .sidebar__panel {
  opacity: 1;
  pointer-events: auto;
}

/* Panel Title */
.panel__title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--space-6);
}

/* Panel Body */
.panel__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

/* User Avatar in Rail */
.rail-nav__user {
  margin-top: auto;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border);
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: var(--space-3);
}

.rail-nav__avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: oklch(0.62 0.19 265 / 0.15);
  color: var(--accent);
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-out);
}

.rail-nav__avatar:hover {
  transform: scale(1.05);
}
```

### 3.3 Content Stage Dimensions

```css
/* Content Stage Container */
.content-stage {
  margin-left: 84px;  /* Match rail width */
  min-height: 100vh;
  background: var(--bg);
  transition: margin-left var(--duration-slow) var(--ease-out);
}

.sidebar.is-expanded ~ .content-stage {
  margin-left: calc(84px + 230px);  /* Match expanded sidebar */
}

/* Content Area */
.content-stage__content {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
}

/* Content Placeholder (empty state) */
.content-stage__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  margin-bottom: var(--space-2);
}

.content-stage__title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--space-1);
}

.content-stage__meta {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
```

### 3.4 Workspace Layout

```css
/* Workspace Container */
.workspace {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* Workspace Header */
.workspace__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
  flex-wrap: wrap;
}

/* Title Block */
.workspace__title-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.workspace__eyebrow {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.workspace__title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.workspace__meta {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
}

/* Actions Container */
.workspace__actions {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

/* View Toggle */
.workspace__view-toggle {
  display: flex;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-1);
  gap: var(--space-1);
}

.workspace__toggle-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.workspace__toggle-btn:hover {
  color: var(--text);
}

.workspace__toggle-btn.is-active {
  background: var(--surface-raised);
  color: var(--text);
  box-shadow: var(--shadow-xs);
}

.workspace__toggle-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 var(--space-1);
  background: oklch(0 0 0 / 0.06);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}

/* Toolbar */
.workspace__toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

/* Search Input */
.workspace__search {
  position: relative;
  flex: 1;
  max-width: 320px;
}

.workspace__search-input {
  width: 100%;
  height: 36px;
  padding: 0 var(--space-3) 0 var(--space-8);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text);
  background: var(--surface-raised);
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.workspace__search-input::placeholder {
  color: var(--text-muted);
}

.workspace__search-input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px oklch(0.62 0.19 265 / 0.12);
}

.workspace__search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

/* Filter */
.workspace__filter {
  position: relative;
}

.workspace__filter-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 36px;
  padding: 0 var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.workspace__filter-btn:hover {
  border-color: var(--border-strong);
}

.workspace__filter-dropdown {
  position: absolute;
  top: calc(100% + var(--space-2));
  right: 0;
  min-width: 160px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-dropdown);
  padding: var(--space-1);
  z-index: var(--z-dropdown);
  display: none;
}

.workspace__filter-dropdown.is-open {
  display: block;
  animation: fadeIn var(--duration-fast) var(--ease-out);
}

.workspace__filter-option {
  display: block;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text);
  text-align: left;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.workspace__filter-option:hover {
  background: oklch(0 0 0 / 0.04);
}

.workspace__filter-option.is-active {
  background: oklch(0.62 0.19 265 / 0.08);
  color: var(--accent);
  font-weight: 500;
}

/* Count Label */
.workspace__count {
  margin-left: auto;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-muted);
}
```

### 3.5 Table Dimensions

```css
/* Table Wrapper */
.workspace__table-wrapper {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* Table */
.workspace__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

/* Table Header */
.workspace__table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--surface);
}

.workspace__table th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

/* Table Body */
.workspace__table tbody {
  display: block;
  max-height: calc(100vh - 320px);  /* Adjust based on layout */
  overflow-y: auto;
}

.workspace__table thead,
.workspace__table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

/* Table Row */
.workspace__table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background var(--duration-fast) var(--ease-out);
}

.workspace__table tbody tr:hover {
  background: oklch(0 0 0 / 0.02);
}

.workspace__table tbody tr:last-child {
  border-bottom: none;
}

/* Table Cell */
.workspace__table td {
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text);
  vertical-align: middle;
}

/* Column Widths (example for Assets table) */
.workspace__table th:nth-child(1),
.workspace__table td:nth-child(1) { width: 38%; }

.workspace__table th:nth-child(2),
.workspace__table td:nth-child(2) { width: 14%; }

.workspace__table th:nth-child(3),
.workspace__table td:nth-child(3) { width: 14%; }

.workspace__table th:nth-child(4),
.workspace__table td:nth-child(4) { width: 10%; }

.workspace__table th:nth-child(5),
.workspace__table td:nth-child(5) { width: 15%; }

.workspace__table th:nth-child(6),
.workspace__table td:nth-child(6) { width: 9%; text-align: center; }

/* Empty Row */
.workspace__table .workspace__empty-row td {
  padding: var(--space-12);
  text-align: center;
  color: var(--text-muted);
}
```

---

## 4. COMPONENTS

### 4.1 Buttons

#### Primary Button
```css
.btn--primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 36px;
  padding: 0 var(--space-4);
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

.btn--primary:hover {
  background: var(--accent-hover);
}

.btn--primary:active {
  background: var(--accent-dark);
  transform: scale(0.98);
}

.btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

#### Ghost Button
```css
.btn--ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 36px;
  padding: 0 var(--space-4);
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn--ghost:hover {
  background: oklch(0 0 0 / 0.04);
  border-color: var(--border-strong);
}

.btn--ghost:active {
  background: oklch(0 0 0 / 0.06);
}
```

#### Danger Button
```css
.btn--danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 36px;
  padding: 0 var(--space-4);
  background: var(--danger);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn--danger:hover {
  background: oklch(0.58 0.26 25);
}
```

#### Icon Button
```css
.btn--icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.btn--icon:hover {
  background: oklch(0 0 0 / 0.04);
  color: var(--text);
}

.btn--icon svg {
  width: 18px;
  height: 18px;
}
```

#### Button with Text and Icon
```css
.workspace__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 36px;
  padding: 0 var(--space-4);
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.workspace__btn svg {
  width: 16px;
  height: 16px;
}
```

### 4.2 Drawers

#### Drawer Structure
```css
/* Overlay */
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer);
  display: none;
}

.drawer-overlay.is-open {
  display: block;
}

/* Backdrop */
.drawer-overlay__backdrop {
  position: absolute;
  inset: 0;
  background: oklch(0 0 0 / 0.4);
  backdrop-filter: blur(4px);
  border: none;
  cursor: pointer;
}

/* Drawer Panel */
.drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: min(50vw, 48rem);  /* 50% viewport or max 768px */
  height: 100%;
  background: var(--surface-raised);
  box-shadow: var(--shadow-drawer);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform var(--duration-slow) var(--ease-out);
}

.drawer-overlay.is-open .drawer {
  transform: translateX(0);
}

/* Drawer Header */
.drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.drawer__header-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.drawer__back,
.drawer__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.drawer__back:hover,
.drawer__close:hover {
  background: oklch(0 0 0 / 0.04);
  color: var(--text);
}

.drawer__back svg,
.drawer__close svg {
  width: 18px;
  height: 18px;
}

.drawer__title {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

/* Drawer Body */
.drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* Drawer Footer */
.drawer__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.drawer__footer-actions {
  display: flex;
  gap: var(--space-3);
}

.drawer__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 36px;
  padding: 0 var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.drawer__button--primary {
  background: var(--accent);
  color: white;
  border: none;
}

.drawer__button--primary:hover {
  background: var(--accent-hover);
}

.drawer__button--ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
}

.drawer__button--ghost:hover {
  background: oklch(0 0 0 / 0.04);
}

.drawer__button--danger {
  background: var(--danger);
  color: white;
  border: none;
}

.drawer__button--danger:hover {
  background: oklch(0.58 0.26 25);
}

/* Drawer Form */
.drawer-form__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.drawer-form__section-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  margin-bottom: var(--space-1);
}

.drawer-form__section-label svg {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.drawer-form__group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.drawer-form__label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text);
}

.drawer-form__required {
  color: var(--danger);
}

.drawer-form__title-input {
  width: 100%;
  height: 40px;
  padding: 0 var(--space-3);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text);
  transition: all var(--duration-fast) var(--ease-out);
}

.drawer-form__title-input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px oklch(0.62 0.19 265 / 0.12);
}

.drawer-form__title-input::placeholder {
  color: var(--text-muted);
}

.drawer-form__native-select {
  width: 100%;
  height: 40px;
  padding: 0 var(--space-8) 0 var(--space-3);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
}

.drawer-form__native-select:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px oklch(0.62 0.19 265 / 0.12);
}

.drawer-form__textarea {
  width: 100%;
  min-height: 100px;
  padding: var(--space-3);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text);
  resize: vertical;
  transition: all var(--duration-fast) var(--ease-out);
}

.drawer-form__textarea:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px oklch(0.62 0.19 265 / 0.12);
}

.drawer-form__date-input {
  width: 100%;
  height: 40px;
  padding: 0 var(--space-3);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text);
}

.drawer-form__row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

/* Detail Fields */
.detail-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.detail-field__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.detail-field__value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text);
}

.detail-field__link {
  color: var(--accent);
  text-decoration: none;
}

.detail-field__link:hover {
  text-decoration: underline;
}

/* Detail Value (read-only display) */
.user-detail-drawer__value,
.site-detail-drawer__value,
.dept-detail-drawer__value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text);
  padding: var(--space-2) 0;
}
```

#### Drawer Dimensions Summary
| Element | Width | Height | Other |
|---------|-------|--------|-------|
| Drawer Overlay | 100vw | 100vh | Fixed, full screen |
| Drawer Panel | min(50vw, 48rem) | 100vh | 50% viewport or max 768px |
| Drawer Header | 100% | auto | padding: 20px |
| Drawer Body | 100% | flex: 1 | scrollable, padding: 20px |
| Drawer Footer | 100% | auto | padding: 16px 20px |
| Form Input | 100% | 40px | border-radius: 8px |
| Form Section | 100% | auto | gap: 16px |

### 4.3 Status Badges

```css
/* Base Badge */
.workspace__status {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 var(--space-2-5);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  white-space: nowrap;
}

/* Success (approved, active, good, completed) */
.workspace__status--success {
  background: var(--success-bg);
  color: var(--success-text);
}

/* Warning (pending, inspection, queued) */
.workspace__status--warning {
  background: var(--warning-bg);
  color: var(--warning-text);
}

/* Danger (rejected, damaged, danger) */
.workspace__status--danger {
  background: var(--danger-bg);
  color: var(--danger-text);
}

/* Info (in progress, scheduled) */
.workspace__status--info {
  background: var(--info-bg);
  color: var(--info-text);
}

/* Neutral (default, inactive) */
.workspace__status--neutral {
  background: var(--neutral-bg);
  color: var(--neutral-text);
}

/* Status Badge Variations */
.status-badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 var(--space-2-5);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
}

.status-badge--success {
  background: var(--success-bg);
  color: var(--success-text);
}

.status-badge--warning {
  background: var(--warning-bg);
  color: var(--warning-text);
}

.status-badge--danger {
  background: var(--danger-bg);
  color: var(--danger-text);
}

.status-badge--info {
  background: var(--info-bg);
  color: var(--info-text);
}
```

### 4.4 Kebab Menus

```css
/* Kebab Button */
.workspace__kebab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.workspace__kebab-btn:hover {
  background: oklch(0 0 0 / 0.04);
  color: var(--text);
}

.workspace__kebab-btn svg {
  width: 18px;
  height: 18px;
}

/* Kebab Dropdown */
.workspace__kebab-dropdown {
  position: absolute;
  top: calc(100% + var(--space-1));
  right: 0;
  min-width: 160px;
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-dropdown);
  padding: var(--space-1);
  z-index: var(--z-dropdown);
  display: none;
}

.workspace__kebab-dropdown.is-open {
  display: block;
  animation: fadeIn var(--duration-fast) var(--ease-out);
}

/* Kebab Option */
.workspace__kebab-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text);
  text-align: left;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.workspace__kebab-option:hover {
  background: oklch(0 0 0 / 0.04);
}

.workspace__kebab-option svg {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.workspace__kebab-option--danger {
  color: var(--danger-text);
}

.workspace__kebab-option--danger svg {
  color: var(--danger-text);
}

.workspace__kebab-option--danger:hover {
  background: var(--danger-bg);
}

/* Kebab in Action Cell */
.workspace__table td:last-child {
  position: relative;
  text-align: center;
}

.workspace__kebab-dropdown {
  position: absolute;
  right: var(--space-4);
}
```

### 4.5 Cards

#### User Card
```css
.user-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-out);
}

.user-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-sm);
}

.user-card__identity {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
}

.user-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: oklch(0.62 0.19 265 / 0.12);
  color: var(--accent);
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-card__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-0-5);
  min-width: 0;
}

.user-card__name {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-card__email {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-card__role {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
  padding: var(--space-1) var(--space-2);
  background: oklch(0 0 0 / 0.04);
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.user-card__status {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.user-card__status--active {
  background: var(--success-bg);
  color: var(--success-text);
}

.user-card__status--inactive {
  background: var(--neutral-bg);
  color: var(--neutral-text);
}
```

#### Org Settings Item
```css
.org-settings__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.org-settings__item:hover {
  border-color: var(--border-strong);
}

.org-settings__item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: oklch(0 0 0 / 0.04);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.org-settings__item-icon svg {
  width: 20px;
  height: 20px;
}

.org-settings__item-info {
  flex: 1;
  min-width: 0;
}

.org-settings__item-name {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--space-0-5);
}

.org-settings__item-meta {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.org-settings__item-badge {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  padding: var(--space-1) var(--space-2);
  background: oklch(0 0 0 / 0.04);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  white-space: nowrap;
}

.org-settings__kebab-btn {
  position: relative;
}

.org-settings__kebab-dropdown {
  right: 0;
}
```

### 4.6 Approval Progress

```css
.approval-progress {
  display: flex;
  align-items: center;
  gap: 0;
  padding: var(--space-4) 0;
}

.approval-progress__step {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.approval-progress__label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
}

.approval-progress__step--completed .approval-progress__label {
  color: var(--success-text);
}

.approval-progress__step--current .approval-progress__label {
  color: var(--text);
}

.approval-progress__step--rejected .approval-progress__label {
  color: var(--danger-text);
}

.approval-progress__connector {
  width: 48px;
  height: 2px;
  background: var(--border);
  margin: 0 var(--space-2);
  flex-shrink: 0;
}
```

---

## 5. MODULES & WORKSPACES

### 5.1 Calendar Module

#### Calendar Workspace
```css
.calendar-workspace {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  height: 100%;
}

.calendar-workspace__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.calendar-workspace__title-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.calendar-workspace__eyebrow {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.calendar-workspace__title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.calendar-workspace__actions {
  display: flex;
  gap: var(--space-3);
}

/* Event List */
.calendar-workspace__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex: 1;
  overflow-y: auto;
}

/* Event Card */
.calendar-event {
  display: flex;
  align-items: stretch;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.calendar-event:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}

.calendar-event__time-bar {
  width: 4px;
  flex-shrink: 0;
}

.calendar-event__content {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.calendar-event__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-3);
}

.calendar-event__title {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.calendar-event__time {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.calendar-event__meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.calendar-event__location,
.calendar-event__participants {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.calendar-event__tags {
  display: flex;
  gap: var(--space-2);
  margin-left: auto;
}
```

#### Event Drawer Fields
| Field | Type | Required | Width |
|-------|------|----------|-------|
| Title | text input | Yes | 100% |
| Description | textarea | No | 100% |
| Start Date | datetime-local | Yes | 50% |
| End Date | datetime-local | Yes | 50% |
| Location | text input | No | 100% |
| Participants | multi-select | No | 100% |
| Tags | multi-select | No | 100% |
| Attachments | file upload | No | 100% |
| Reminders | multi-select | No | 100% |

### 5.2 Assets Module

#### Asset Dashboard
```css
.asset-dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.asset-dashboard__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

@media (max-width: 1024px) {
  .asset-dashboard__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

.asset-dashboard__stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.asset-dashboard__stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.asset-dashboard__stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: white;
}

.asset-dashboard__stat-value {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text);
}

.asset-dashboard__stat-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

/* Quick Actions */
.asset-dashboard__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.asset-dashboard__section-title {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text);
}

.asset-dashboard__actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
}

@media (max-width: 1024px) {
  .asset-dashboard__actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.asset-dashboard__action-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.asset-dashboard__action-card:hover {
  border-color: var(--accent);
  background: oklch(0.62 0.19 265 / 0.04);
}

.asset-dashboard__action-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: oklch(0.62 0.19 265 / 0.1);
  border-radius: var(--radius-md);
  color: var(--accent);
  flex-shrink: 0;
}

.asset-dashboard__action-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-0-5);
}

.asset-dashboard__action-title {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text);
}

.asset-dashboard__action-meta {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
```

#### Asset Request Workspace
```css
.asset-request-workspace {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.asset-request-workspace__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.asset-request-workspace__title-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.asset-request-workspace__eyebrow {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.asset-request-workspace__title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text);
  margin: 0;
}
```

#### Asset Request Table Columns
| View Mode | Columns |
|-----------|---------|
| Requester | ASSET (20%), PURPOSE (25%), DURATION (10%), STATUS (15%), SUBMITTED (15%), ACTION (15%) |
| Approver | EMPLOYEE (18%), TEAM (12%), ASSET (18%), PURPOSE (22%), STATUS (13%), ACTION (17%) |

#### Asset Inventory Table Columns
| Column | Width |
|--------|-------|
| ASSET NAME | 38% |
| ASSET NUMBER | 14% |
| CATEGORY | 14% |
| SITE | 10% |
| STATUS | 15% |
| ACTION | 9% |

### 5.3 User Management Module

```css
.user-management-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.user-management-view__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.user-management-view__titles {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.user-management-view__eyebrow {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.user-management-view__title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.user-management-view__meta {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
}

.user-management-view__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-4);
}
```

#### Organization Settings
```css
.org-settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.org-settings__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.org-settings__title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.org-settings__header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.org-settings__segmented {
  display: flex;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-1);
  gap: var(--space-1);
}

.org-settings__segment-btn {
  padding: var(--space-2) var(--space-4);
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.org-settings__segment-btn:hover {
  color: var(--text);
}

.org-settings__segment-btn.is-active {
  background: var(--surface-raised);
  color: var(--text);
  box-shadow: var(--shadow-xs);
}

.org-settings__add-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 36px;
  padding: 0 var(--space-4);
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.org-settings__add-btn:hover {
  background: var(--accent-hover);
}

.org-settings__content {
  min-height: 200px;
}

.org-settings__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
```

---

## 6. WORKFLOWS

### 6.1 Asset Request Approval Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           APPROVAL FLOW PIPELINE                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌─────────────┐      ┌─────────┐      ┌──────────┐      ┌─────────────┐   │
│   │   PENDING   │ ───► │  HRGA   │ ───► │ FINANCE  │ ───► │ PURCHASING  │   │
│   │ Team Leader │      │Approval │      │ Approval │      │    Final    │   │
│   └─────────────┘      └─────────┘      └──────────┘      └─────────────┘   │
│         │                                                         │          │
│         ▼                                                         ▼          │
│   ┌─────────────┐                                           ┌───────────┐   │
│   │  REJECTED   │                                           │ APPROVED  │   │
│   └─────────────┘                                           └───────────┘   │
│                                                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Approval Stages
| Stage | Permission Required | Next Stage |
|-------|---------------------|------------|
| Team Leader | `approve_team_leader` | HRGA |
| HRGA | `approve_hrga` | Finance |
| Finance | `approve_finance` | Purchasing |
| Purchasing | `approve_purchasing` | Approved |
| Rejected | - | - |

#### Approval Actions
- **Approve**: Move to next stage
- **Reject**: Set status to "Rejected"
- **Request Revision**: Set status to "Needs Revision"

### 6.2 Asset Checkout Flow

```
┌─────────────────┐
│  CREATE REQUEST │
└────────┬────────┘
         ▼
┌─────────────────────┐
│ WAITING CONFIRMATION│◄────┐
└────────┬────────────┘     │
         ▼                 │
┌─────────────────────┐    │
│ READY FOR HANDOVER  │────┘
└────────┬────────────┘
         ▼
┌─────────────────────┐
│     CHECKED OUT     │
└─────────────────────┘
```

### 6.3 Asset Check-in Flow

```
┌─────────────────┐
│   CREATE RETURN │
└────────┬────────┘
         ▼
┌─────────────────────┐
│ INSPECTION NEEDED   │
└────────┬────────────┘
         ▼
┌─────────────────────┐
│       CLOSED        │
└─────────────────────┘
```

### 6.4 Mutation Flow

```
┌─────────────────┐
│  CREATE REQUEST │
└────────┬────────┘
         ▼
┌─────────────────────┐
│       QUEUED        │
└────────┬────────────┘
         ▼
┌─────────────────────┐
│     IN TRANSIT      │
└────────┬────────────┘
         ▼
┌─────────────────────┐
│     COMPLETED       │
└─────────────────────┘
```

---

## 7. DATA MODELS

### 7.1 Asset Record
```typescript
interface AssetRecord {
  id: string;
  name: string;
  assetNumber: string;
  category: string;
  location: string;
  status: "Active" | "Maintenance" | "Retired";
  statusTone: "success" | "warning" | "danger";
  purchaseDate: string;
  warrantyExpiry: string;
  assignedTo: string;
  notes: string;
}
```

### 7.2 Asset Request
```typescript
interface AssetRequest {
  id: string;
  employee: string;
  team: string;
  requestedAsset: string;
  assetCategory: string;
  siteAsset: string;
  purchaseLink: string;
  assetPrice: string;
  purpose: string;
  estimatedTime: string;
  deadlineDate: string;
  approvalStage: "team_leader" | "hrga" | "finance" | "purchasing";
  status: string;
  statusTone: "pending" | "approved" | "rejected";
  submittedAt: string;
  approvalHistory: ApprovalAction[];
}

interface ApprovalAction {
  stage: string;
  action: "approved" | "rejected" | "revised";
  by: string;
  at: string;
}
```

### 7.3 CheckOut
```typescript
interface CheckOut {
  id: string;
  assetId: string;
  assetName: string;
  requester: string;
  location: string;
  pickupAt: string;
  returnPlan: string;
  status: "Waiting Confirmation" | "Ready for Handover" | "Checked Out";
  statusTone: "pending" | "info" | "success";
  notes: string;
}
```

### 7.4 CheckIn
```typescript
interface CheckIn {
  id: string;
  assetId: string;
  assetName: string;
  returnedBy: string;
  receivedAt: string;
  condition: "Good" | "Needs minor repair" | "Needs lens cleaning" | "Damaged";
  conditionTone: "success" | "warning" | "danger";
  status: "Inspection Needed" | "Closed";
  statusTone: "warning" | "success";
  notes: string;
}
```

### 7.5 Mutation
```typescript
interface Mutation {
  id: string;
  assetId: string;
  assetName: string;
  fromLocation: string;
  toLocation: string;
  initiatedBy: string;
  scheduledAt: string;
  status: "Queued" | "In Transit" | "Completed";
  statusTone: "pending" | "info" | "success";
}
```

### 7.6 Maintenance Request
```typescript
interface MaintenanceRequest {
  id: string;
  assetId: string;
  assetName: string;
  issue: string;
  requester: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  priorityTone: "danger" | "warning" | "info";
  status: "Pending Review" | "In Progress" | "Scheduled";
  statusTone: "warning" | "info" | "info";
}
```

### 7.7 User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  status: "Active" | "Inactive";
  joinDate: string;
  permissions: string[];
}
```

### 7.8 Site
```typescript
interface Site {
  id: string;
  name: string;
  code: string;
  address: string;
}
```

### 7.9 Department
```typescript
interface Department {
  id: string;
  name: string;
  code: string;
  site: string;
  head: string;
  employees: number;
}
```

---

## 8. PERMISSIONS

```typescript
const PERMISSIONS = {
  // Calendar
  "calendar_view": "View Calendar",
  "calendar_create": "Create Events",
  "calendar_edit": "Edit Events",
  "calendar_delete": "Delete Events",
  
  // Asset Management
  "assets_view": "View Assets",
  "assets_create": "Create Assets",
  "assets_edit": "Edit Assets",
  "assets_delete": "Delete Assets",
  "assets_export": "Export Assets",
  "assets_import": "Import Assets",
  
  // Asset Operations
  "checkout_create": "Create Check Out",
  "checkout_approve": "Approve Check Out",
  "checkin_create": "Create Check In",
  "checkin_approve": "Process Check In",
  "mutation_create": "Create Mutation",
  "mutation_approve": "Approve Mutation",
  "maintenance_create": "Create Maintenance",
  "maintenance_approve": "Process Maintenance",
  
  // Approvals
  "approve_team_leader": "Approve as Team Leader",
  "approve_hrga": "Approve as HRGA",
  "approve_finance": "Approve as Finance",
  "approve_purchasing": "Approve as Purchasing",
  
  // User Management
  "users_view": "View Users",
  "users_create": "Create Users",
  "users_edit": "Edit Users",
  "users_delete": "Delete Users",
  
  // Organization
  "org_sites_view": "View Sites",
  "org_sites_manage": "Manage Sites",
  "org_depts_view": "View Departments",
  "org_depts_manage": "Manage Departments",
};
```

---

## 9. ICONS

### Icon Set (Inline SVG)

```javascript
const icons = {
  "chevron-left": `<path d="m15 18-6-6 6-6"/>`,
  "chevron-right": `<path d="m9 18 6-6-6-6"/>`,
  "close": `<path d="M18 6 6 18M6 6l12 12"/>`,
  "plus": `<path d="M12 5v14M5 12h14"/>`,
  "search": `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>`,
  "filter": `<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>`,
  "more-vertical": `<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>`,
  "eye": `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`,
  "edit": `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>`,
  "trash": `<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`,
  "check": `<polyline points="20 6 9 17 4 12"/>`,
  "log-out": `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,
  "log-in": `<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>`,
  "arrow-left-right": `<polyline points="17 11 21 7 17 3"/><line x1="21" y1="7" x2="9" y2="7"/><polyline points="7 21 3 17 7 13"/><line x1="15" y1="17" x2="3" y2="17"/>`,
  "import": `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>`,
  "export": `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
  "user": `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  "package": `<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>`,
  "calendar": `<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  "clock": `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  "tool": `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  "git-branch": `<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>`,
  "description": `<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>`,
};
```

---

## 10. ANIMATIONS

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

/* Animation Classes */
.animate-fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.animate-fade-in-up {
  animation: fadeInUp var(--duration-normal) var(--ease-out);
}

.animate-scale-in {
  animation: scaleIn var(--duration-normal) var(--ease-out);
}

/* Staggered animations for lists */
.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 50ms; }
.stagger-item:nth-child(3) { animation-delay: 100ms; }
.stagger-item:nth-child(4) { animation-delay: 150ms; }
.stagger-item:nth-child(5) { animation-delay: 200ms; }
/* ... continue pattern */
```

---

## 11. RESPONSIVE BREAKPOINTS

```css
/* Mobile: < 640px */
@media (max-width: 639px) {
  .sidebar {
    width: 0;
    overflow: hidden;
  }
  
  .sidebar.is-expanded {
    width: 100%;
  }
  
  .content-stage {
    margin-left: 0;
  }
  
  .workspace__header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .workspace__actions {
    justify-content: flex-start;
  }
  
  .workspace__toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .workspace__search {
    max-width: none;
  }
  
  .workspace__table-wrapper {
    overflow-x: auto;
  }
}

/* Tablet: 640px - 1024px */
@media (min-width: 640px) and (max-width: 1024px) {
  .workspace__view-toggle {
    order: 3;
    width: 100%;
  }
  
  .asset-dashboard__stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .user-management-view__list {
    grid-template-columns: 1fr;
  }
}

/* Desktop: > 1024px */
@media (min-width: 1025px) {
  .workspace__header {
    flex-wrap: nowrap;
  }
  
  .workspace__actions {
    flex-shrink: 0;
  }
  
  .asset-dashboard__stats {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 12. ACCESSIBILITY

```css
/* Focus Visible */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 13. SAMPLE SCREEN LAYOUTS

### 13.1 Workspace Header Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Asset Management                                                            │
│  Asset Request                                        [My Requests] [Queue]  │
│  Submit and track asset requests                                         [+ New Request] │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  [🔍 Search requests...]    [All ✓]                          Showing 8 items │
├─────────────────────────────────────────────────────────────────────────────┤
│ EMPLOYEE          │ TEAM    │ ASSET      │ PURPOSE      │ STATUS  │ ACTION  │
├───────────────────┼─────────┼────────────┼──────────────┼─────────┼─────────┤
│ Budi Santoso      │ IT      │ MacBook... │ Developme... │ Pending │    ⋮    │
│ Anita Wijaya      │ Design  │ Dell Mo... │ Design work  │ Pending │    ⋮    │
│ ...               │ ...     │ ...        │ ...          │ ...     │    ⋮    │
└───────────────────┴─────────┴────────────┴──────────────┴─────────┴─────────┘
```

### 13.2 Drawer Layout

```
┌──────────────────────────────────────────┐
│ ←  Request Details                   ✕   │
├──────────────────────────────────────────┤
│                                          │
│  👤 Identity                             │
│  ┌────────────────────────────────────┐  │
│  │ Requester Name                     │  │
│  │ Budi Santoso                       │  │
│  ├────────────────────────────────────┤  │
│  │ Department                        │  │
│  │ IT                                 │  │
│  └────────────────────────────────────┘  │
│                                          │
│  📦 Requested Item                       │
│  ┌────────────────────────────────────┐  │
│  │ Item Name                          │  │
│  │ MacBook Pro 16"                    │  │
│  ├──────────────────┬─────────────────┤  │
│  │ Category         │ Site Asset      │  │
│  │ Electronics      │ Headquarters    │  │
│  ├──────────────────┴─────────────────┤  │
│  │ Asset Price (IDR)                  │  │
│  │ 45.000.000                         │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ⏰ Request Status                       │
│  ┌────────────────────────────────────┐  │
│  │ Status                             │  │
│  │ Pending Team Leader                │  │
│  ├────────────────────────────────────┤  │
│  │ Submitted                          │  │
│  │ 25 Mar 2026 | 14:30               │  │
│  └────────────────────────────────────┘  │
│                                          │
│  🔀 Approval Progress                    │
│  ┌────────────────────────────────────┐  │
│  │ ✓ Team Leader → ● HRGA → ○ Fina... │  │
│  └────────────────────────────────────┘  │
│                                          │
├──────────────────────────────────────────┤
│                    [Reject]  [Approve]   │
└──────────────────────────────────────────┘
```

### 13.3 Sidebar Expanded Layout

```
┌────────────────────────────────────────────┐
│ ┌────┐ ┌────────────────────────────────┐ │
│ │    │ │ Assets                         │ │
│ │ 🎯 │ │                                │ │
│ │    │ │ ─── Overview ───              │ │
│ ├────┤ │ • Dashboard                    │ │
│ │    │ │                                │ │
│ │ 📦 │ │ ─── Transactions ───           │ │
│ │    │ │ • Asset Request    ← active   │ │
│ │    │ │ • Check Out                   │ │
│ │    │ │ • Check In                    │ │
│ ├────┤ │ • Mutation                     │ │
│ │    │ │ • Maintenance                 │ │
│ │ 👤 │ │                                │ │
│ │    │ │ ─── Inventory ───             │ │
│ │    │ │ • Inventory                   │ │
│ │    │ │ • Stock Opname                │ │
│ │    │ │ • Access Control              │ │
│ └────┘ └────────────────────────────────┘ │
└────────────────────────────────────────────┘
     84px               230px
```

---

## 14. IMPLEMENTATION CHECKLIST

### Layout
- [ ] Sidebar with rail and panel
- [ ] Content stage with scroll
- [ ] Responsive breakpoints

### Components
- [ ] Buttons (primary, ghost, danger, icon)
- [ ] Inputs (text, select, textarea, date)
- [ ] Drawers (open/close animation, form layout)
- [ ] Tables (sticky header, scroll, hover states)
- [ ] Badges (all tones)
- [ ] Kebab menus (open/close, click outside)
- [ ] Cards (user, action, stat)
- [ ] View toggles (segmented control)

### Modules
- [ ] Calendar with event creation
- [ ] Asset Dashboard with stats
- [ ] Asset Inventory with CRUD
- [ ] Asset Request with approval flow
- [ ] Check Out/In workflow
- [ ] Mutation tracking
- [ ] Maintenance requests
- [ ] User Management
- [ ] Organization Settings

### Interactions
- [ ] Form validation
- [ ] Drawer open/close
- [ ] Kebab menu toggle
- [ ] Filter dropdown
- [ ] View mode toggle
- [ ] Approval actions

### Data
- [ ] State management
- [ ] Data persistence (localStorage)
- [ ] Mock data initialization
- [ ] CSV import/export

---

## 15. KEY IMPLEMENTATION NOTES

1. **OKLCH Colors**: Use OKLCH format for all colors to ensure consistent perceptual color spacing. Convert to hex/rgb only for CSS output if needed.

2. **Drawer Animation**:
```javascript
// Opening
drawer.classList.add('is-open');

// Closing with timeout
setTimeout(() => {
  drawer.classList.remove('is-open');
  // Clean up or remove from DOM
}, 360); // Match CSS transition duration
```

3. **Kebab Menu**:
```javascript
// Close on click outside
document.addEventListener('click', (e) => {
  if (!kebabBtn.contains(e.target)) {
    dropdown.classList.remove('is-open');
  }
});
```

4. **Table Scroll Shadow**:
```javascript
tbody.addEventListener('scroll', () => {
  if (tbody.scrollTop > 0) {
    thead.classList.add('has-shadow');
  } else {
    thead.classList.remove('has-shadow');
  }
});
```

5. **Indonesian Formatting**:
```javascript
// Price
Number(value).toLocaleString('id-ID'); // "45.000.000"

// Date
new Date().toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
}); // "25 Mar 2026"

// DateTime
new Date().toLocaleString('id-ID'); // "25/03/2026 14:30:00"
```

6. **Approval Progress Calculation**:
```javascript
const stageOrder = ['team_leader', 'hrga', 'finance', 'purchasing', 'approved'];
const currentIndex = stageOrder.indexOf(request.approvalStage);

stageOrder.forEach((stage, index) => {
  if (index < currentIndex) {
    // Completed
  } else if (index === currentIndex) {
    // Current
  } else {
    // Pending
  }
});
```

7. **Permission Check**:
```javascript
function hasPermission(user, permission) {
  return user.permissions?.includes(permission) || false;
}

function canApproveAtStage(user, stage) {
  const permissionMap = {
    'team_leader': 'approve_team_leader',
    'hrga': 'approve_hrga',
    'finance': 'approve_finance',
    'purchasing': 'approve_purchasing',
  };
  return hasPermission(user, permissionMap[stage]);
}
```
