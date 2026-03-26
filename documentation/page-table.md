# Page Table Documentation

A complete reference guide for creating consistent data tables in the HRGA application, based on the Assets workspace implementation.

## Overview

Data tables display structured data with search, filter, and export/import capabilities. They provide a clean, organized way to browse and manage records.

**Reference Implementation**: `createAssetsWorkspace()` in `src/components/app-shell.js` (line 3140)

---

## DOM Structure

```
.{page}-workspace (section container)
  ├── .{page}-workspace__header
  │   ├── .{page}-workspace__title-block
  │   │   ├── .{page}-workspace__eyebrow (subtitle)
  │   │   └── .{page}-workspace__title (h2)
  │   └── .{page}-workspace__actions
  │       ├── Import button
  │       └── Export button
  │
  ├── .{page}-workspace__toolbar
  │   ├── .{page}-workspace__search
  │   │   ├── input.{page}-workspace__search-input
  │   │   └── span.{page}-workspace__search-icon
  │   ├── .{page}-workspace__filter
  │   │   ├── button.{page}-workspace__filter-btn
  │   │   │   ├── span.{page}-workspace__filter-icon
  │   │   │   └── span (filter label)
  │   │   └── div.{page}-workspace__filter-dropdown
  │   │       └── button.{page}-workspace__filter-option (multiple)
  │   └── span.{page}-workspace__count ("Showing X of Y items")
  │
  └── .{page}-workspace__table-wrapper
      └── table.{page}-workspace__table
          ├── thead (sticky header)
          │   └── tr
          │       └── th (multiple, with widths)
          └── tbody (scrollable body)
              ├── tr (multiple rows)
              │   ├── td (data cells)
              │   └── td (action cell with kebab menu)
              └── tr.{page}-workspace__empty-row (when no data)
                  └── td (colspan, "No items found")
```

---

## CSS Specifications (All Values in Pixels)

### Container

```css
.{page}-workspace {
  padding: 32px 48px;
  gap: 0;
  background: oklch(0.94 0.005 255);
}
```

**Padding**: Top 32px, Right 48px, Bottom 0, Left 48px

---

## Header Specifications

### Header Container

```css
.{page}-workspace__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
}
```

**Gap**: 32px between title block and actions

### Title Block

```css
.{page}-workspace__title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
```

### Eyebrow (Subtitle)

```css
.{page}-workspace__eyebrow {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: oklch(0.5 0.02 280);
}
```

### Title

```css
.{page}-workspace__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: oklch(0.18 0.02 255);
}
```

### Actions (Import/Export Buttons)

```css
.{page}-workspace__actions {
  display: flex;
  gap: 10px;
}

.{page}-workspace__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border: 1px solid oklch(0.8 0.01 280);
  border-radius: 8px;
  background: #ffffff;
  color: oklch(0.35 0.02 280);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.{page}-workspace__btn:hover {
  border-color: oklch(0.65 0.02 280);
  background: oklch(0.97 0.008 280);
}

.{page}-workspace__btn .ui-icon {
  font-size: 15px;
}
```

**Gap between buttons**: 10px

---

## Toolbar Specifications

### Toolbar Container

```css
.{page}-workspace__toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 4px 0;
}
```

**Gap**: 16px between search, filter, and count

### Search Input

```css
.{page}-workspace__search {
  position: relative;
  flex: 1;
  max-width: 280px;
}

.{page}-workspace__search-input {
  width: 100%;
  padding: 10px 16px 10px 38px;
  border: 1px solid oklch(0.8 0.01 280);
  border-radius: 10px;
  font-size: 13px;
  color: oklch(0.22 0.02 260);
  background: #ffffff;
  outline: none;
  transition: all 0.15s ease;
}

.{page}-workspace__search-input:focus {
  border-color: #8f96ef;
  box-shadow: 0 0 0 3px oklch(0.55 0.12 281 / 0.15);
}

.{page}-workspace__search-input::placeholder {
  color: oklch(0.65 0.02 280);
}

.{page}-workspace__search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: oklch(0.55 0.02 280);
  pointer-events: none;
}
```

**Search max-width**: 280px
**Padding**: Top/Bottom 10px, Left 38px (room for icon), Right 16px

### Filter Button & Dropdown

```css
.{page}-workspace__filter {
  position: relative;
}

.{page}-workspace__filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid oklch(0.8 0.01 280);
  border-radius: 10px;
  background: #ffffff;
  color: oklch(0.4 0.02 280);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.{page}-workspace__filter-btn:hover {
  border-color: oklch(0.65 0.02 280);
  background: oklch(0.97 0.008 280);
}

.{page}-workspace__filter-icon {
  color: oklch(0.5 0.02 280);
}

.{page}-workspace__filter-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 140px;
  padding: 6px;
  border: 1px solid oklch(0.8 0.01 280);
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 8px 24px oklch(0.12 0.03 260 / 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.15s ease;
  z-index: 100;
}

.{page}-workspace__filter-dropdown.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.{page}-workspace__filter-option {
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: oklch(0.35 0.02 280);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.1s ease;
}

.{page}-workspace__filter-option:hover {
  background: oklch(0.93 0.01 280);
}

.{page}-workspace__filter-option.is-active {
  background: oklch(0.55 0.18 280 / 0.12);
  color: #6f74d8;
  font-weight: 500;
}
```

**Filter dropdown min-width**: 140px
**Dropdown padding**: 6px
**Option padding**: 8px 12px

### Count Label

```css
.{page}-workspace__count {
  font-size: 12px;
  color: oklch(0.5 0.02 280);
  font-weight: 500;
  white-space: nowrap;
}
```

---

## Table Specifications

### Table Wrapper

```css
.{page}-workspace__table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid oklch(0.86 0.01 280);
  border-radius: 12px;
  overflow: hidden;
  min-height: 0;
}
```

**Border radius**: 12px
**Border**: 1px solid `oklch(0.86 0.01 280)`

### Table Container

```css
.{page}-workspace__table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}
```

### Table Header (Sticky)

```css
.{page}-workspace__table thead {
  position: sticky;
  top: 0;
  background: oklch(0.96 0.008 280);
  z-index: 10;
  flex-shrink: 0;
  border-bottom: 1px solid oklch(0.82 0.01 280);
}
```

**Header background**: `oklch(0.96 0.008 280)`
**Border-bottom**: 1px solid `oklch(0.82 0.01 280)`

### Header Cells (th)

```css
.{page}-workspace__table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: oklch(0.5 0.02 280);
}
```

**Padding**: Top/Bottom 14px, Left/Right 16px
**Font size**: 10px
**Letter-spacing**: 1px
**Text-transform**: uppercase

### Table Body (Scrollable)

```css
.{page}-workspace__table tbody {
  display: block;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

/* Custom scrollbar */
.{page}-workspace__table tbody::-webkit-scrollbar {
  width: 8px;
}

.{page}-workspace__table tbody::-webkit-scrollbar-track {
  background: oklch(0.94 0.01 280);
}

.{page}-workspace__table tbody::-webkit-scrollbar-thumb {
  background: oklch(0.55 0.18 280);
  border-radius: 4px;
}

.{page}-workspace__table tbody::-webkit-scrollbar-thumb:hover {
  background: oklch(0.48 0.2 280);
}
```

**Scrollbar width**: 8px
**Scrollbar thumb border-radius**: 4px

### Data Rows (tr)

```css
.{page}-workspace__table thead,
.{page}-workspace__table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.{page}-workspace__table tbody tr {
  transition: background 120ms ease;
}

.{page}-workspace__table tbody tr:hover {
  background: oklch(0.55 0.18 280 / 0.04);
}
```

**Hover transition**: 120ms ease

### Data Cells (td)

```css
.{page}-workspace__table td {
  padding: 14px 16px;
  font-size: 13px;
  color: oklch(0.22 0.02 260);
  border-bottom: 1px solid oklch(0.91 0.008 280);
}

.{page}-workspace__table tbody tr:last-child td {
  border-bottom: none;
}
```

**Padding**: Top/Bottom 14px, Left/Right 16px
**Font size**: 13px
**Border-bottom**: 1px solid `oklch(0.91 0.008 280)`

### First Column (Name/Title)

```css
.{page}-workspace__table td:nth-child(1) {
  font-weight: 500;
  color: oklch(0.2 0.02 260);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## Status Badge

```css
.{page}-workspace__status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.{page}-workspace__status--available {
  background: oklch(0.72 0.14 145);
  color: oklch(0.35 0.08 145);
}

.{page}-workspace__status--in-use {
  background: oklch(0.65 0.18 280);
  color: #6f74d8;
}

.{page}-workspace__status--maintenance {
  background: oklch(0.88 0.08 85);
  color: oklch(0.5 0.12 75);
}

.{page}-workspace__status--retired {
  background: oklch(0.9 0.01 255);
  color: oklch(0.45 0.02 255);
}
```

**Padding**: Top/Bottom 4px, Left/Right 10px
**Font size**: 11px
**Letter-spacing**: 0.05em
**Text-transform**: uppercase

---

## Action Kebab Menu

### Kebab Button

```css
.{page}-workspace__kebab-btn {
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  border-radius: 8px;
  color: oklch(0.5 0.02 280);
  cursor: pointer;
  transition: all 0.15s ease;
  display: grid;
  place-items: center;
}

.{page}-workspace__kebab-btn:hover {
  background: oklch(0.92 0.01 280);
  color: oklch(0.35 0.02 280);
}
```

### Kebab Dropdown

```css
.{page}-workspace__kebab-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  min-width: 150px;
  padding: 6px;
  border: 1px solid oklch(0.8 0.01 280);
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 8px 24px oklch(0.12 0.03 260 / 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.15s ease;
  z-index: 100;
}

.{page}-workspace__kebab-dropdown.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
```

**Kebab dropdown min-width**: 150px
**Top offset**: calc(100% + 4px)

### Kebab Menu Items

```css
.{page}-workspace__kebab-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: oklch(0.3 0.02 280);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.1s ease;
}

.{page}-workspace__kebab-option:hover {
  background: oklch(0.94 0.005 255);
  color: oklch(0.2 0.02 255);
}

.{page}-workspace__kebab-option--danger {
  color: #c15656;
}

.{page}-workspace__kebab-option--danger:hover {
  background: oklch(0.92 0.08 25);
  color: #b33e3e;
}

.{page}-workspace__kebab-option .ui-icon {
  font-size: 15px;
  flex-shrink: 0;
}
```

**Padding**: Top/Bottom 9px, Left/Right 12px
**Gap between icon and text**: 10px

---

## Empty State

```css
.{page}-workspace__empty-row {
  text-align: center;
}

.{page}-workspace__empty-row td {
  padding: 48px 24px;
  color: oklch(0.6 0.02 280);
  font-size: 14px;
}
```

**Padding**: Top/Bottom 48px, Left/Right 24px

---

## Column Width Template

Example column distribution for a 6-column table:

| Column | Width | Percentage |
|--------|-------|------------|
| Name/Title | 38% | 38% |
| ID/Number | 14% | 14% |
| Category/Type | 14% | 14% |
| Location/Site | 10% | 10% |
| Status | 15% | 15% |
| Action | 9% | 9% |

**Total**: 100%

---

## Font Specifications

| Element | Font Family | Size | Weight | Color |
|---------|-------------|------|--------|-------|
| Eyebrow | inherit | 11px | 600 | oklch(0.5 0.02 280) |
| Title | inherit | 22px | 700 | oklch(0.18 0.02 255) |
| Button text | inherit | 13px | 500 | oklch(0.35 0.02 280) |
| Search input | inherit | 13px | 400 | oklch(0.22 0.02 260) |
| Filter button | inherit | 13px | 500 | oklch(0.4 0.02 280) |
| Count label | inherit | 12px | 500 | oklch(0.5 0.02 280) |
| Table header | inherit | 10px | 700 | oklch(0.5 0.02 280) |
| Table cell | inherit | 13px | 400 | oklch(0.22 0.02 260) |
| First column | inherit | 13px | 500 | oklch(0.2 0.02 260) |
| Status badge | inherit | 11px | 600 | (varies by tone) |
| Kebab option | inherit | 13px | 400 | oklch(0.3 0.02 280) |

---

## Color Specifications (OKLCH)

| Purpose | Color |
|---------|-------|
| Workspace background | `oklch(0.94 0.005 255)` |
| White background | `#ffffff` |
| Border (light) | `oklch(0.86 0.01 280)` |
| Border (medium) | `oklch(0.8 0.01 280)` |
| Border (dark) | `oklch(0.82 0.01 280)` |
| Border (cell) | `oklch(0.91 0.008 280)` |
| Primary text | `oklch(0.18 0.02 255)` or `oklch(0.2 0.02 260)` |
| Secondary text | `oklch(0.22 0.02 260)` or `oklch(0.3 0.02 280)` |
| Muted text | `oklch(0.4 0.02 280)` or `oklch(0.5 0.02 280)` |
| Icon | `oklch(0.5 0.02 280)` |
| Primary button/accent | `#6f74d8` |
| Danger | `#c15656` or `#b33e3e` |
| Hover background | `oklch(0.55 0.18 280 / 0.04)` |
| Table header bg | `oklch(0.96 0.008 280)` |

---

## Spacing Summary (Pixels)

| Element | Spacing |
|---------|---------|
| Workspace padding | 32px 48px |
| Header gap | 32px |
| Title block gap | 4px |
| Actions button gap | 10px |
| Toolbar gap | 16px |
| Toolbar padding | 4px 0 |
| Table wrapper radius | 12px |
| Th padding | 14px 16px |
| Td padding | 14px 16px |
| Status badge padding | 4px 10px |
| Kebab button size | 32px |
| Kebab dropdown padding | 6px |
| Kebab option padding | 9px 12px |
| Filter dropdown padding | 6px |
| Filter option padding | 8px 12px |
| Empty state padding | 48px 24px |

---

## JavaScript Implementation Pattern

### Basic Page Template

```javascript
function create{Entity}Workspace(activeApp) {
  const wrapper = createElement("section", "{entity}-workspace");
  const meta = {entity.toUpperCase()}_PAGE_META.{Entity};

  // ===== HEADER =====
  const header = createElement("div", "{entity}-workspace__header");
  const titleBlock = createElement("div", "{entity}-workspace__title-block");
  const eyebrow = createElement("p", "{entity}-workspace__eyebrow", meta.eyebrow);
  const title = createElement("h2", "{entity}-workspace__title", meta.title);
  const actions = createElement("div", "{entity}-workspace__actions");
  const importBtn = createElement("button", "{entity}-workspace__btn");
  const exportBtn = createElement("button", "{entity}-workspace__btn");

  importBtn.type = "button";
  importBtn.setAttribute("aria-label", "Import {entities}");
  importBtn.append(createIcon("import"), createElement("span", null, "Import"));

  exportBtn.type = "button";
  exportBtn.setAttribute("aria-label", "Export {entities}");
  exportBtn.append(createIcon("export"), createElement("span", null, "Export"));

  exportBtn.addEventListener("click", () => {
    const filteredRecords = getFiltered{Entity}Records(
      activeApp,
      state.{entity}s.searches,
      state.{entity}s.filters,
    );
    export{Entity}sToCSV(filteredRecords);
  });

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".csv";
  fileInput.style.display = "none";
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      import{Entity}sFromCSV(file, activeApp);
    }
    fileInput.value = "";
  });
  importBtn.addEventListener("click", () => fileInput.click());

  titleBlock.append(eyebrow, title);
  actions.append(importBtn, exportBtn, fileInput);
  header.append(titleBlock, actions);

  // ===== TOOLBAR =====
  const toolbar = createElement("div", "{entity}-workspace__toolbar");
  const searchWrap = createElement("div", "{entity}-workspace__search");
  const searchInput = createElement("input", "{entity}-workspace__search-input");
  const searchIcon = createElement("span", "{entity}-workspace__search-icon");
  const filterWrap = createElement("div", "{entity}-workspace__filter");
  const filterBtn = createElement("button", "{entity}-workspace__filter-btn");
  const filterIcon = createElement("span", "{entity}-workspace__filter-icon");
  const filterDropdown = createElement("div", "{entity}-workspace__filter-dropdown");

  searchInput.type = "text";
  searchInput.placeholder = "Search {entities}...";
  searchInput.setAttribute("aria-label", "Search {entities}");
  searchInput.value = state.{entity}s.search;
  searchInput.addEventListener("input", (e) => {
    state.{entity}s.search = e.target.value;
    render();
  });

  searchIcon.append(createIcon("search"));

  filterDropdown.setAttribute("role", "listbox");
  filterDropdown.setAttribute("aria-label", "Filter options");

  filterBtn.type = "button";
  filterBtn.setAttribute("aria-label", "Filter {entities}");
  filterBtn.setAttribute("aria-haspopup", "listbox");
  filterBtn.setAttribute("aria-expanded", "false");
  filterIcon.append(createIcon("filter"));
  filterBtn.append(
    filterIcon,
    createElement("span", null, getFilterLabel(state.{entity}s.filter)),
  );

  let isFilterOpen = false;

  filterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isFilterOpen = !isFilterOpen;
    filterDropdown.classList.toggle("is-open", isFilterOpen);
    filterBtn.setAttribute("aria-expanded", String(isFilterOpen));
  });

  document.addEventListener("click", () => {
    isFilterOpen = false;
    filterDropdown.classList.remove("is-open");
    filterBtn.setAttribute("aria-expanded", "false");
  });

  filterDropdown.addEventListener("click", (e) => e.stopPropagation());

  {ENTITY}_FILTERS.forEach(([value, label]) => {
    const isActive = state.{entity}s.filter === value;
    const option = createElement(
      "button",
      `{entity}-workspace__filter-option${isActive ? " is-active" : ""}`,
      label,
    );
    option.type = "button";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(isActive));
    option.addEventListener("click", () => {
      state.{entity}s.filter = value;
      filterBtn.querySelector("span").textContent = label;
      isFilterOpen = false;
      filterDropdown.classList.remove("is-open");
      filterBtn.setAttribute("aria-expanded", "false");
      filterBtn.focus();
      render();
    });
    filterDropdown.append(option);
  });

  searchWrap.append(searchInput, searchIcon);
  filterWrap.append(filterBtn, filterDropdown);

  const filteredRecords = getFiltered{Entity}Records(
    activeApp,
    state.{entity}s.search,
    state.{entity}s.filter,
  );
  const totalCount = activeApp.{entity}s?.length || 0;
  const countLabel = createElement(
    "span",
    "{entity}-workspace__count",
    `Showing ${filteredRecords.length} of ${totalCount} {entities}`
  );

  toolbar.append(searchWrap, filterWrap, countLabel);

  // ===== TABLE =====
  const tableWrapper = createElement("div", "{entity}-workspace__table-wrapper");
  const table = createElement("table", "{entity}-workspace__table");
  const thead = createElement("thead");
  const tbody = createElement("tbody");

  tbody.addEventListener("scroll", () => {
    if (tbody.scrollTop > 0) {
      table.classList.add("{entity}-workspace__table-body--scrolled");
    } else {
      table.classList.remove("{entity}-workspace__table-body--scrolled");
    }
  });

  const headerRow = createElement("tr");

  const columns = [
    { label: "{ENTITY} NAME", width: "38%" },
    { label: "ID", width: "14%" },
    { label: "CATEGORY", width: "14%" },
    { label: "LOCATION", width: "10%" },
    { label: "STATUS", width: "15%" },
    { label: "ACTION", width: "9%" },
  ];

  columns.forEach((col) => {
    const th = createElement("th", null, col.label);
    th.style.width = col.width;
    headerRow.append(th);
  });

  thead.append(headerRow);

  if (filteredRecords.length === 0) {
    const emptyRow = createElement("tr", "{entity}-workspace__empty-row");
    const emptyCell = createElement("td", null, `No ${{entity}}s found`);
    emptyCell.colSpan = columns.length;
    emptyRow.append(emptyCell);
    tbody.append(emptyRow);
  } else {
    filteredRecords.forEach((record) => {
      const row = createElement("tr");
      row.dataset.{entity}Id = record.id;

      // Name cell
      const nameCell = createElement("td", null, record.name);

      // ID cell
      const idCell = createElement("td", null, record.id);

      // Category cell
      const categoryCell = createElement("td", null, record.category);

      // Location cell
      const locationCell = createElement("td", null, record.location);

      // Status cell
      const statusCell = createElement("td");
      const statusBadge = createElement(
        "span",
        `{entity}-workspace__status {entity}-workspace__status--${record.statusTone}`,
        record.status,
      );
      statusCell.append(statusBadge);

      // Action cell with kebab
      const actionCell = createElement("td");
      const kebabBtn = createElement("button", "{entity}-workspace__kebab-btn");
      kebabBtn.type = "button";
      kebabBtn.setAttribute("aria-label", "{Entity} actions");
      kebabBtn.append(createIcon("more-vertical"));

      const kebabDropdown = createElement("div", "{entity}-workspace__kebab-dropdown");
      kebabDropdown.setAttribute("role", "menu");

      const menuItems = [
        { label: "View", icon: "eye", action: () => view{Entity}(record) },
        { label: "Edit", icon: "edit", action: () => edit{Entity}(record) },
        { label: "Delete", icon: "trash", action: () => delete{Entity}(record), danger: true },
      ];

      let isKebabOpen = false;

      kebabBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        isKebabOpen = !isKebabOpen;
        kebabDropdown.classList.toggle("is-open", isKebabOpen);
      });

      document.addEventListener("click", () => {
        isKebabOpen = false;
        kebabDropdown.classList.remove("is-open");
      });

      menuItems.forEach((item) => {
        const menuBtn = createElement(
          "button",
          `{entity}-workspace__kebab-option${item.danger ? " {entity}-workspace__kebab-option--danger" : ""}`,
        );
        menuBtn.type = "button";
        menuBtn.setAttribute("role", "menuitem");
        menuBtn.append(
          createIcon(item.icon),
          createElement("span", null, item.label),
        );
        menuBtn.addEventListener("click", () => {
          item.action();
          isKebabOpen = false;
          kebabDropdown.classList.remove("is-open");
        });
        kebabDropdown.append(menuBtn);
      });

      actionCell.append(kebabBtn, kebabDropdown);

      row.append(nameCell, idCell, categoryCell, locationCell, statusCell, actionCell);
      tbody.append(row);
    });
  }

  table.append(thead, tbody);
  tableWrapper.append(table);

  // ===== ASSEMBLE =====
  wrapper.append(header, toolbar, tableWrapper);

  return wrapper;
}
```

---

## Export/Import Functions

### Export to CSV

```javascript
function export{Entity}sToCSV(records) {
  if (records.length === 0) {
    alert("No records to export");
    return;
  }

  const headers = ["Name", "ID", "Category", "Location", "Status"];
  const csvRows = [headers.join(",")];

  records.forEach((record) => {
    const row = [
      `"${record.name}"`,
      `"${record.id}"`,
      `"${record.category}"`,
      `"${record.location}"`,
      `"${record.status}"`,
    ];
    csvRows.push(row.join(","));
  });

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `{entity}s-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

### Import from CSV

```javascript
function import{Entity}sFromCSV(file, activeApp) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const text = e.target.result;
    const rows = text.split("\n").filter((row) => row.trim());

    if (rows.length < 2) {
      alert("CSV file is empty or invalid");
      return;
    }

    // Skip header row
    const dataRows = rows.slice(1);
    let imported = 0;

    dataRows.forEach((row) => {
      const values = parseCSVRow(row);
      if (values.length >= 5) {
        const new{Entity} = {
          id: `{entity}-${Date.now()}-${imported}`,
          name: values[0].replace(/"/g, ""),
          code: values[1].replace(/"/g, ""),
          category: values[2].replace(/"/g, ""),
          location: values[3].replace(/"/g, ""),
          status: values[4].replace(/"/g, ""),
          statusTone: getStatusTone(values[4].replace(/"/g, "")),
        };
        activeApp.{entity}s.push(new{Entity});
        imported++;
      }
    });

    alert(`Successfully imported ${imported} ${imported === 1 ? "{entity}" : "{entity}s"}`);
    render();
  };

  reader.readAsText(file);
}

function parseCSVRow(row) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
```

---

## Filter Definition

```javascript
const {ENTITY}_FILTERS = [
  ["all", "All"],
  ["active", "Active"],
  ["inactive", "Inactive"],
  ["pending", "Pending"],
];

function getFilterLabel(filterValue) {
  const filter = {ENTITY}_FILTERS.find(([value]) => value === filterValue);
  return filter ? filter[1] : "All";
}
```

---

## Filter Function

```javascript
function getFiltered{Entity}Records(activeApp, search, filter) {
  let records = activeApp.{entity}s || [];

  // Apply search filter
  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    records = records.filter((record) =>
      record.name.toLowerCase().includes(searchLower) ||
      record.id.toLowerCase().includes(searchLower) ||
      record.category.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter
  if (filter && filter !== "all") {
    records = records.filter((record) => record.status === filter);
  }

  return records;
}
```

---

## Status Tone Helper

```javascript
function getStatusTone(status) {
  const toneMap = {
    "Available": "available",
    "Active": "available",
    "In Use": "in-use",
    "Maintenance": "maintenance",
    "Pending": "maintenance",
    "Retired": "retired",
    "Inactive": "retired",
  };
  return toneMap[status] || "available";
}
```

---

## CSS Template

Copy and replace `{page}` or `{entity}` with your page name:

```css
/* Container */
.{page}-workspace {
  padding: 32px 48px;
  gap: 0;
  background: oklch(0.94 0.005 255);
}

/* Header */
.{page}-workspace__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
}

.{page}-workspace__title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.{page}-workspace__eyebrow {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: oklch(0.5 0.02 280);
}

.{page}-workspace__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: oklch(0.18 0.02 255);
}

.{page}-workspace__actions {
  display: flex;
  gap: 10px;
}

.{page}-workspace__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border: 1px solid oklch(0.8 0.01 280);
  border-radius: 8px;
  background: #ffffff;
  color: oklch(0.35 0.02 280);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.{page}-workspace__btn:hover {
  border-color: oklch(0.65 0.02 280);
  background: oklch(0.97 0.008 280);
}

/* Toolbar */
.{page}-workspace__toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 4px 0;
}

.{page}-workspace__search {
  position: relative;
  flex: 1;
  max-width: 280px;
}

.{page}-workspace__search-input {
  width: 100%;
  padding: 10px 16px 10px 38px;
  border: 1px solid oklch(0.8 0.01 280);
  border-radius: 10px;
  font-size: 13px;
  color: oklch(0.22 0.02 260);
  background: #ffffff;
  outline: none;
  transition: all 0.15s ease;
}

.{page}-workspace__search-input:focus {
  border-color: #8f96ef;
  box-shadow: 0 0 0 3px oklch(0.55 0.12 281 / 0.15);
}

.{page}-workspace__search-input::placeholder {
  color: oklch(0.65 0.02 280);
}

.{page}-workspace__search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: oklch(0.55 0.02 280);
  pointer-events: none;
}

.{page}-workspace__count {
  font-size: 12px;
  color: oklch(0.5 0.02 280);
  font-weight: 500;
  white-space: nowrap;
}

/* Filter */
.{page}-workspace__filter {
  position: relative;
}

.{page}-workspace__filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid oklch(0.8 0.01 280);
  border-radius: 10px;
  background: #ffffff;
  color: oklch(0.4 0.02 280);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.{page}-workspace__filter-btn:hover {
  border-color: oklch(0.65 0.02 280);
  background: oklch(0.97 0.008 280);
}

.{page}-workspace__filter-icon {
  color: oklch(0.5 0.02 280);
}

.{page}-workspace__filter-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 140px;
  padding: 6px;
  border: 1px solid oklch(0.8 0.01 280);
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 8px 24px oklch(0.12 0.03 260 / 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.15s ease;
  z-index: 100;
}

.{page}-workspace__filter-dropdown.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.{page}-workspace__filter-option {
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: oklch(0.35 0.02 280);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.1s ease;
}

.{page}-workspace__filter-option:hover {
  background: oklch(0.93 0.01 280);
}

.{page}-workspace__filter-option.is-active {
  background: oklch(0.55 0.18 280 / 0.12);
  color: #6f74d8;
  font-weight: 500;
}

/* Table */
.{page}-workspace__table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid oklch(0.86 0.01 280);
  border-radius: 12px;
  overflow: hidden;
  min-height: 0;
}

.{page}-workspace__table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.{page}-workspace__table thead {
  position: sticky;
  top: 0;
  background: oklch(0.96 0.008 280);
  z-index: 10;
  flex-shrink: 0;
  border-bottom: 1px solid oklch(0.82 0.01 280);
}

.{page}-workspace__table tbody {
  display: block;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.{page}-workspace__table tbody::-webkit-scrollbar {
  width: 8px;
}

.{page}-workspace__table tbody::-webkit-scrollbar-track {
  background: oklch(0.94 0.01 280);
}

.{page}-workspace__table tbody::-webkit-scrollbar-thumb {
  background: oklch(0.55 0.18 280);
  border-radius: 4px;
}

.{page}-workspace__table thead,
.{page}-workspace__table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.{page}-workspace__table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: oklch(0.5 0.02 280);
}

.{page}-workspace__table td {
  padding: 14px 16px;
  font-size: 13px;
  color: oklch(0.22 0.02 260);
  border-bottom: 1px solid oklch(0.91 0.008 280);
}

.{page}-workspace__table tbody tr {
  transition: background 120ms ease;
}

.{page}-workspace__table tbody tr:hover {
  background: oklch(0.55 0.18 280 / 0.04);
}

.{page}-workspace__table tbody tr:last-child td {
  border-bottom: none;
}

.{page}-workspace__table td:nth-child(1) {
  font-weight: 500;
  color: oklch(0.2 0.02 260);
}

/* Status Badge */
.{page}-workspace__status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.{page}-workspace__status--available {
  background: oklch(0.72 0.14 145);
  color: oklch(0.35 0.08 145);
}

.{page}-workspace__status--in-use {
  background: oklch(0.65 0.18 280);
  color: #6f74d8;
}

.{page}-workspace__status--maintenance {
  background: oklch(0.88 0.08 85);
  color: oklch(0.5 0.12 75);
}

.{page}-workspace__status--retired {
  background: oklch(0.9 0.01 255);
  color: oklch(0.45 0.02 255);
}

/* Kebab Menu */
.{page}-workspace__kebab-btn {
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  border-radius: 8px;
  color: oklch(0.5 0.02 280);
  cursor: pointer;
  transition: all 0.15s ease;
  display: grid;
  place-items: center;
}

.{page}-workspace__kebab-btn:hover {
  background: oklch(0.92 0.01 280);
  color: oklch(0.35 0.02 280);
}

.{page}-workspace__kebab-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  min-width: 150px;
  padding: 6px;
  border: 1px solid oklch(0.8 0.01 280);
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 8px 24px oklch(0.12 0.03 260 / 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.15s ease;
  z-index: 100;
}

.{page}-workspace__kebab-dropdown.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.{page}-workspace__kebab-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: oklch(0.3 0.02 280);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.1s ease;
}

.{page}-workspace__kebab-option:hover {
  background: oklch(0.94 0.005 255);
  color: oklch(0.2 0.02 255);
}

.{page}-workspace__kebab-option--danger {
  color: #c15656;
}

.{page}-workspace__kebab-option--danger:hover {
  background: oklch(0.92 0.08 25);
  color: #b33e3e;
}

/* Empty State */
.{page}-workspace__empty-row {
  text-align: center;
}

.{page}-workspace__empty-row td {
  padding: 48px 24px;
  color: oklch(0.6 0.02 280);
  font-size: 14px;
}
```

---

## Best Practices

1. **Always use sticky header** - The table header stays visible when scrolling through large datasets.

2. **Use flex layout for table** - Set `display: flex` on the table with `flex-direction: column` for proper scrolling behavior.

3. **Set fixed column widths** - Use `table-layout: fixed` with specific widths for predictable column sizes.

4. **Provide empty state** - Show "No items found" when filtered results are empty.

5. **Add hover effects** - Row hover effects improve readability and interaction feedback.

6. **Use status badges** - Color-coded status badges make it easy to scan item states.

7. **Include export/import** - Allow users to export data to CSV and import from CSV for bulk operations.

8. **Implement search and filter** - Search by name/ID and filter by status for better data navigation.

9. **Add kebab menu for actions** - Keep the action column minimal with a kebab menu for View/Edit/Delete.

10. **Handle keyboard navigation** - Add Escape key to close dropdowns and Enter key for options.

---

## Changelog

- **2026-03-26**: Initial documentation based on Assets workspace implementation
