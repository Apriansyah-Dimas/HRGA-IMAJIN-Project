// User Management Feature Module
// This file contains all user-management related functions
// Fully standalone - no dependency on app-shell.js

import { workspaceApps } from "../../data/navigation.js";
import { 
  createElement, 
  createIcon, 
  createNativeSelect,
  formatDrawerDateLabel,
  formatDateInput,
  MONTH_NAMES
} from "../../core/core.js";

// ===== User Management Helpers =====

export function getUserManagementApp() {
  return workspaceApps.find((app) => app.id === "user-management");
}

export function getSites() {
  const app = getUserManagementApp();
  return app?.sites || [];
}

export function getDepartments() {
  const app = getUserManagementApp();
  return app?.departments || [];
}

// ===== User Management State =====

export function getInitialUsersState() {
  return {
    searchQuery: "",
    filterRole: "all",
    filterStatus: "all",
    selectedUserId: null,
    kebabMenuOpenId: null,
  };
}

export function getInitialUserDraft() {
  return {
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    joinDate: new Date().toISOString().split("T")[0],
    role: "custom",
    permissions: [],
    sendInvitation: true,
    status: "Active",
  };
}

export function getInitialSiteDraft() {
  return {
    name: "",
    code: "",
    address: "",
  };
}

export function getInitialDeptDraft() {
  return {
    name: "",
    code: "",
  };
}

export function isUserDraftValid(draft) {
  return (
    draft.name?.trim() &&
    draft.email?.trim() &&
    draft.department &&
    draft.position &&
    draft.joinDate
  );
}

export function getUserStatusTone(status) {
  switch (status) {
    case "Active":
      return "active";
    case "Pending":
      return "pending";
    case "Suspended":
      return "suspended";
    default:
      return "pending";
  }
}

// ===== User Management UI Components =====

export function createUserManagementPanel(activeApp) {
  const wrapper = createElement("section", "user-management-view");
  
  const header = createElement("div", "user-management-view__header");
  const eyebrow = createElement("p", "user-management-view__eyebrow", "Team management");
  const title = createElement("h1", "user-management-view__title", "USERS");
  const meta = createElement("p", "user-management-view__meta", "Manage user accounts, roles, and permissions across the organization.");
  
  header.append(eyebrow, title, meta);
  
  const content = createElement("div", "user-management-view__list");
  
  wrapper.append(header, content);
  
  return wrapper;
}

export function createUsersWorkspace(activeApp, state = {}, callbacks = {}) {
  const wrapper = createElement("section", "users-workspace");
  
  // Header toolbar wrapper
  const headerToolbar = createElement("div", "users-workspace__header-toolbar");
  
  // Left side: Title + Search + Filter
  const headerLeft = createElement("div", "users-workspace__header-left");
  
  const header = createElement("div", "users-workspace__header");
  const titleBlock = createElement("div", "users-workspace__title-block");
  const eyebrow = createElement("p", "users-workspace__eyebrow", "Team management");
  const title = createElement("h1", "users-workspace__title", "USERS");
  
  const actions = createElement("div", "users-workspace__actions");
  const addBtn = createElement("button", "users-workspace__btn");
  addBtn.type = "button";
  addBtn.append(createIcon("plus"), createElement("span", null, "Add User"));
  addBtn.addEventListener("click", () => {
    if (callbacks.onAddUser) callbacks.onAddUser();
  });
  
  actions.append(addBtn);
  titleBlock.append(eyebrow, title);
  header.append(titleBlock, actions);
  
  // Toolbar with search and filter
  const toolbar = createElement("div", "users-workspace__toolbar");
  const search = createElement("div", "users-workspace__search");
  const searchInput = createElement("input", "users-workspace__search-input");
  const searchIcon = createElement("span", "users-workspace__search-icon");
  const filter = createElement("div", "users-workspace__filter");
  const filterBtn = createElement("button", "users-workspace__filter-btn");
  const filterIcon = createElement("span", "users-workspace__filter-icon");
  
  searchInput.type = "search";
  searchInput.placeholder = "Search users...";
  searchInput.value = state.users?.searchQuery || "";
  searchInput.addEventListener("input", (e) => {
    if (callbacks.onSearch) callbacks.onSearch(e.target.value);
  });
  
  searchIcon.append(createIcon("search"));
  
  filterBtn.type = "button";
  filterBtn.append(createIcon("filter"), createElement("span", null, "Filter"));
  
  filterBtn.addEventListener("click", () => {
    const currentFilter = state.users?.filterStatus || "all";
    const filters = ["all", "active", "pending", "suspended"];
    const currentIndex = filters.indexOf(currentFilter);
    const nextFilter = filters[(currentIndex + 1) % filters.length];
    if (callbacks.onFilterChange) callbacks.onFilterChange(nextFilter);
  });
  
  const users = activeApp?.users || [];
  const filteredUsers = users.filter(user => {
    const query = state.users?.searchQuery?.toLowerCase() || "";
    if (query && !user.name?.toLowerCase().includes(query) && !user.email?.toLowerCase().includes(query)) {
      return false;
    }
    const statusFilter = state.users?.filterStatus || "all";
    if (statusFilter !== "all" && user.statusTone !== statusFilter) {
      return false;
    }
    return true;
  });
  
  search.append(searchInput, searchIcon);
  toolbar.append(search, filter);
  headerLeft.append(header, toolbar);
  
  // Right side: Import/Export + Showing count
  const headerRight = createElement("div", "users-workspace__header-right");
  
  const importExport = createElement("div", "users-workspace__import-export");
  const importBtn = createElement("button", "users-workspace__btn users-workspace__btn--secondary");
  importBtn.type = "button";
  importBtn.append(createIcon("import"), createElement("span", null, "Import"));
  
  const exportBtn = createElement("button", "users-workspace__btn users-workspace__btn--secondary");
  exportBtn.type = "button";
  exportBtn.append(createIcon("export"), createElement("span", null, "Export"));
  
  importExport.append(importBtn, exportBtn);
  
  const count = createElement("span", "users-workspace__count");
  const totalUsers = users.length;
  const showingUsers = filteredUsers.length;
  count.textContent = `Showing ${showingUsers} of ${totalUsers} users`;
  
  headerRight.append(importExport, count);
  
  headerToolbar.append(headerLeft, headerRight);
  
  // Table
  const tableWrapper = createElement("div", "users-workspace__table-wrapper");
  const table = createElement("table", "users-workspace__table");
  const thead = createElement("thead");
  const tbody = createElement("tbody");
  
  // Header row
  const headerRow = createElement("tr");
  ["User", "Email", "Department", "Position", "Status", ""].forEach((text, i) => {
    const th = createElement("th", `col-${i}`, text);
    headerRow.append(th);
  });
  thead.append(headerRow);
  
  // User rows
  if (filteredUsers.length === 0) {
    const emptyRow = createElement("tr", "users-workspace__empty-row");
    const emptyTd = createElement("td", null, "No users found");
    emptyTd.colSpan = 6;
    emptyRow.append(emptyTd);
    tbody.append(emptyRow);
  } else {
    filteredUsers.forEach(user => {
      const row = createElement("tr");
      
      // User cell
      const userCell = createElement("td", "users-workspace__user-cell");
      const avatar = createElement("div", "users-workspace__user-avatar");
      avatar.textContent = user.name?.charAt(0)?.toUpperCase() || "U";
      const userInfo = createElement("div", "users-workspace__user-info");
      const userName = createElement("div", "users-workspace__user-name", user.name);
      const userEmail = createElement("div", "users-workspace__user-email", user.email);
      userInfo.append(userName, userEmail);
      userCell.append(avatar, userInfo);
      
      // Other cells
      const deptCell = createElement("td", null, user.department || "-");
      const posCell = createElement("td", null, user.position || "-");
      
      // Status cell
      const statusCell = createElement("td");
      const status = createElement("span", `users-workspace__status users-workspace__status--${user.statusTone || "pending"}`, user.status || "Pending");
      statusCell.append(status);
      
      // Actions cell
      const actionsCell = createElement("td");
      const kebabBtn = createElement("button", "users-workspace__kebab-btn");
      kebabBtn.type = "button";
      kebabBtn.append(createIcon("more-vertical"));
      
      // Wire up kebab button - show simple menu
      kebabBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Close any other open menus first
        document.querySelectorAll('.users-workspace__dropdown').forEach(el => el.remove());
        
        const dropdown = createElement("div", "users-workspace__dropdown");
        const viewItem = createElement("button", "users-workspace__dropdown-item", "View Details");
        const editItem = createElement("button", "users-workspace__dropdown-item", "Edit User");
        const suspendItem = createElement("button", "users-workspace__dropdown-item", user.status === "Active" ? "Suspend User" : "Activate User");
        
      viewItem.type = "button";
      editItem.type = "button";
      suspendItem.type = "button";
      
      viewItem.addEventListener("click", () => {
        dropdown.remove();
        if (callbacks.onUserView) callbacks.onUserView(user);
      });
      
      editItem.addEventListener("click", () => {
        dropdown.remove();
        if (callbacks.onUserEdit) callbacks.onUserEdit(user);
      });
      
      suspendItem.addEventListener("click", () => {
        dropdown.remove();
        if (callbacks.onUserToggleStatus) callbacks.onUserToggleStatus(user);
      });
      
      dropdown.append(viewItem, editItem, suspendItem);
      actionsCell.appendChild(dropdown);
      
      // Close dropdown when clicking outside
      const closeDropdown = (evt) => {
        if (!dropdown.contains(evt.target)) {
          dropdown.remove();
          document.removeEventListener('click', closeDropdown);
        }
      };
      setTimeout(() => document.addEventListener('click', closeDropdown), 0);
      });
      
      actionsCell.append(kebabBtn);
      
      row.append(userCell, deptCell, posCell, statusCell, actionsCell);
      tbody.append(row);
    });
  }
  
  table.append(thead, tbody);
  tableWrapper.append(table);
  
  wrapper.append(headerToolbar, tableWrapper);
  
  return wrapper;
}

export function createUserCard(user, callbacks = {}) {
  const card = createElement("article", "user-card");
  
  const identity = createElement("div", "user-card__identity");
  const avatar = createElement("div", "user-card__avatar");
  const avatarInitial = createElement("span", null, user.name?.charAt(0)?.toUpperCase() || "U");
  const copy = createElement("div", "user-card__copy");
  const name = createElement("h3", "user-card__name", user.name);
  const email = createElement("p", "user-card__email", user.email);
  
  const role = createElement("span", "user-card__role", user.role === "admin" ? "Admin" : "User");
  const status = createElement("span", `user-card__status user-card__status--${user.statusTone || "pending"}`, user.status);
  
  avatar.append(avatarInitial);
  identity.append(avatar, copy);
  copy.append(name, email);
  card.append(identity, role, status);
  
  if (callbacks.onClick) {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => callbacks.onClick(user));
  }
  
  return card;
}

export function createUserDetailDrawer(state, closeDrawer, onSave, mode = "view", isOpen = false) {
  const overlay = createElement(
    "div",
    `user-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "user-drawer-overlay__backdrop");
  const drawer = createElement("div", "user-drawer");
  const header = createElement("div", "user-drawer__header");
  const headerLeft = createElement("div", "user-drawer__header-left");
  const title = createElement("h3", "user-drawer__title", mode === "create" ? "New User" : "User Details");
  const closeBtn = createElement("button", "user-drawer__close");
  const body = createElement("div", "user-drawer__body");
  const footer = createElement("div", "user-drawer__footer");
  const footerActions = createElement("div", "user-drawer__footer-actions");
  
  closeBtn.append(createIcon("close"));
  closeBtn.type = "button";
  closeBtn.addEventListener("click", closeDrawer);
  backdrop.type = "button";
  backdrop.addEventListener("click", closeDrawer);
  
  const draft = state.userDraft;
  
  // Name field
  const nameGroup = createElement("div", "drawer-form__group");
  const nameLabel = createElement("label", "drawer-form__label", "Full Name");
  const nameInput = createElement("input", "drawer-form__input");
  nameInput.type = "text";
  nameInput.value = draft.name || "";
  nameInput.addEventListener("input", (e) => {
    state.userDraft.name = e.target.value;
  });
  nameGroup.append(nameLabel, nameInput);
  
  // Email field
  const emailGroup = createElement("div", "drawer-form__group");
  const emailLabel = createElement("label", "drawer-form__label", "Email");
  const emailInput = createElement("input", "drawer-form__input");
  emailInput.type = "email";
  emailInput.value = draft.email || "";
  emailInput.addEventListener("input", (e) => {
    state.userDraft.email = e.target.value;
  });
  emailGroup.append(emailLabel, emailInput);
  
  // Phone field
  const phoneGroup = createElement("div", "drawer-form__group");
  const phoneLabel = createElement("label", "drawer-form__label", "Phone");
  const phoneInput = createElement("input", "drawer-form__input");
  phoneInput.type = "tel";
  phoneInput.value = draft.phone || "";
  phoneInput.addEventListener("input", (e) => {
    state.userDraft.phone = e.target.value;
  });
  phoneGroup.append(phoneLabel, phoneInput);
  
  // Department field
  const deptGroup = createElement("div", "drawer-form__group");
  const deptLabel = createElement("label", "drawer-form__label", "Department");
  const deptSelect = createNativeSelect(
    getDepartments().map(d => [d.id, d.name]),
    draft.department || "",
    (value) => { state.userDraft.department = value; }
  );
  deptGroup.append(deptLabel, deptSelect);
  
  // Position field
  const positionGroup = createElement("div", "drawer-form__group");
  const positionLabel = createElement("label", "drawer-form__label", "Position");
  const positionInput = createElement("input", "drawer-form__input");
  positionInput.type = "text";
  positionInput.value = draft.position || "";
  positionInput.addEventListener("input", (e) => {
    state.userDraft.position = e.target.value;
  });
  positionGroup.append(positionLabel, positionInput);
  
  // Join Date field
  const joinDateGroup = createElement("div", "drawer-form__group");
  const joinDateLabel = createElement("label", "drawer-form__label", "Join Date");
  const joinDateInput = createElement("input", "drawer-form__date-input");
  joinDateInput.type = "date";
  joinDateInput.value = draft.joinDate || "";
  joinDateInput.addEventListener("change", (e) => {
    state.userDraft.joinDate = e.target.value;
  });
  joinDateGroup.append(joinDateLabel, joinDateInput);
  
  // Role options
  const roleGroup = createElement("div", "drawer-form__group");
  const roleLabel = createElement("label", "drawer-form__label", "Role");
  const roleOptions = createElement("div", "drawer-form__role-options");
  const roleAdmin = createElement("label", "drawer-form__role-option");
  const roleAdminRadio = document.createElement("input");
  roleAdminRadio.type = "radio";
  roleAdminRadio.name = "role";
  roleAdminRadio.value = "admin";
  roleAdminRadio.checked = draft.role === "admin";
  roleAdminRadio.addEventListener("change", () => {
    state.userDraft.role = "admin";
  });
  roleAdmin.append(roleAdminRadio, document.createTextNode("Admin"));
  
  const roleCustom = createElement("label", "drawer-form__role-option");
  const roleCustomRadio = document.createElement("input");
  roleCustomRadio.type = "radio";
  roleCustomRadio.name = "role";
  roleCustomRadio.value = "custom";
  roleCustomRadio.checked = draft.role === "custom";
  roleCustomRadio.addEventListener("change", () => {
    state.userDraft.role = "custom";
  });
  roleCustom.append(roleCustomRadio, document.createTextNode("Custom"));
  
  roleOptions.append(roleAdmin, roleCustom);
  roleGroup.append(roleLabel, roleOptions);
  
  body.append(nameGroup, emailGroup, phoneGroup, deptGroup, positionGroup, joinDateGroup, roleGroup);
  
  // Footer buttons
  const cancelBtn = createElement("button", "user-drawer__button user-drawer__button--ghost", "Cancel");
  const saveBtn = createElement("button", "user-drawer__button user-drawer__button--primary", "Save");
  
  cancelBtn.type = "button";
  saveBtn.type = "button";
  
  cancelBtn.addEventListener("click", closeDrawer);
  saveBtn.addEventListener("click", () => {
    if (onSave) onSave();
  });
  
  footerActions.append(cancelBtn, saveBtn);
  footer.append(footerActions);
  
  headerLeft.append(title);
  header.append(headerLeft, closeBtn);
  drawer.append(header, body, footer);
  overlay.append(backdrop, drawer);
  
  return overlay;
}

export function createUserInput(state, field, value, placeholder) {
  const input = createElement("input", "drawer-form__input");
  input.type = "text";
  input.value = value || "";
  input.placeholder = placeholder || "";
  input.addEventListener("input", (e) => {
    state.userDraft[field] = e.target.value;
  });
  return input;
}

export function createUserPasswordInput(state, field, value, placeholder) {
  const wrapper = createElement("div", "drawer-form__password-wrap");
  const input = createElement("input", "drawer-form__input");
  const toggle = createElement("button", "drawer-form__password-toggle");
  
  input.type = "password";
  input.value = value || "";
  input.placeholder = placeholder || "";
  input.addEventListener("input", (e) => {
    state.userDraft[field] = e.target.value;
  });
  
  toggle.type = "button";
  toggle.append(createIcon("eye"));
  toggle.addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password";
  });
  
  wrapper.append(input, toggle);
  return wrapper;
}

// ===== Organization Settings =====

export function createOrganizationSettingsView(state, activeApp, callbacks = {}) {
  const wrapper = createElement("div", "org-settings");
  
  const header = createElement("div", "org-settings__header");
  const headerTop = createElement("div", "org-settings__header-top");
  const title = createElement("h1", "org-settings__title", "Organization Settings");
  const tabs = createElement("div", "org-settings__tabs");
  const sitesTab = createElement("button", `org-settings__tab${state.orgSettingsActiveTab === "sites" ? " is-active" : ""}`, "Sites");
  const deptsTab = createElement("button", `org-settings__tab${state.orgSettingsActiveTab === "departments" ? " is-active" : ""}`, "Departments");
  const content = createElement("div", "org-settings__content");
  
  sitesTab.type = "button";
  deptsTab.type = "button";
  
  sitesTab.addEventListener("click", () => {
    state.orgSettingsActiveTab = "sites";
    if (callbacks.onTabChange) callbacks.onTabChange("sites");
  });
  
  deptsTab.addEventListener("click", () => {
    state.orgSettingsActiveTab = "departments";
    if (callbacks.onTabChange) callbacks.onTabChange("departments");
  });
  
  tabs.append(sitesTab, deptsTab);
  headerTop.append(title);
  header.append(headerTop, tabs);
  
  wrapper.append(header, content);
  
  return wrapper;
}

// ===== Site Management =====

export function createSiteDrawer(state, closeDrawer, isOpen = false) {
  const overlay = createElement(
    "div",
    `site-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "site-drawer-overlay__backdrop");
  const drawer = createElement("div", "site-drawer");
  const header = createElement("div", "site-drawer__header");
  const headerLeft = createElement("div", "site-drawer__header-left");
  const title = createElement("h3", "site-drawer__title", "New Site");
  const closeBtn = createElement("button", "site-drawer__close");
  const body = createElement("div", "site-drawer__body");
  const footer = createElement("div", "site-drawer__footer");
  
  closeBtn.append(createIcon("close"));
  closeBtn.type = "button";
  closeBtn.addEventListener("click", closeDrawer);
  backdrop.type = "button";
  backdrop.addEventListener("click", closeDrawer);
  
  const draft = state.siteDraft || getInitialSiteDraft();
  
  // Name field
  const nameGroup = createElement("div", "site-drawer__field");
  const nameLabel = createElement("label", "site-drawer__label", "Site Name");
  const nameInput = createElement("input", "site-drawer__input");
  nameInput.type = "text";
  nameInput.value = draft.name || "";
  nameGroup.append(nameLabel, nameInput);
  
  // Code field
  const codeGroup = createElement("div", "site-drawer__field");
  const codeLabel = createElement("label", "site-drawer__label", "Site Code");
  const codeInput = createElement("input", "site-drawer__input");
  codeInput.type = "text";
  codeInput.value = draft.code || "";
  codeGroup.append(codeLabel, codeInput);
  
  // Address field
  const addrGroup = createElement("div", "site-drawer__field");
  const addrLabel = createElement("label", "site-drawer__label", "Address");
  const addrTextarea = createElement("textarea", "site-drawer__input");
  addrTextarea.value = draft.address || "";
  addrGroup.append(addrLabel, addrTextarea);
  
  body.append(nameGroup, codeGroup, addrGroup);
  
  // Footer buttons
  const cancelBtn = createElement("button", "site-drawer__button site-drawer__button--ghost", "Cancel");
  const saveBtn = createElement("button", "site-drawer__button site-drawer__button--primary", "Save Site");
  
  cancelBtn.type = "button";
  saveBtn.type = "button";
  
  cancelBtn.addEventListener("click", closeDrawer);
  
  footer.append(cancelBtn, saveBtn);
  
  headerLeft.append(title);
  header.append(headerLeft, closeBtn);
  drawer.append(header, body, footer);
  overlay.append(backdrop, drawer);
  
  return overlay;
}

export function createSiteDetailDrawer(state, closeDrawer, onSave, mode = "view", isOpen = false) {
  const overlay = createElement(
    "div",
    `site-detail-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "site-detail-drawer-overlay__backdrop");
  const drawer = createElement("div", "site-detail-drawer");
  
  backdrop.type = "button";
  backdrop.addEventListener("click", closeDrawer);
  
  overlay.append(backdrop, drawer);
  
  return overlay;
}

export function createSiteInput(state, field, value, placeholder) {
  const input = createElement("input", "site-drawer__input");
  input.type = "text";
  input.value = value || "";
  input.placeholder = placeholder || "";
  return input;
}

// ===== Department Management =====

export function createDeptDrawer(state, closeDrawer, isOpen = false) {
  const overlay = createElement(
    "div",
    `dept-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "dept-drawer-overlay__backdrop");
  const drawer = createElement("div", "dept-drawer");
  const header = createElement("div", "dept-drawer__header");
  const headerLeft = createElement("div", "dept-drawer__header-left");
  const title = createElement("h3", "dept-drawer__title", "New Department");
  const closeBtn = createElement("button", "dept-drawer__close");
  const body = createElement("div", "dept-drawer__body");
  const footer = createElement("div", "dept-drawer__footer");
  
  closeBtn.append(createIcon("close"));
  closeBtn.type = "button";
  closeBtn.addEventListener("click", closeDrawer);
  backdrop.type = "button";
  backdrop.addEventListener("click", closeDrawer);
  
  const draft = state.deptDraft || getInitialDeptDraft();
  
  // Name field
  const nameGroup = createElement("div", "dept-drawer__field");
  const nameLabel = createElement("label", "dept-drawer__label", "Department Name");
  const nameInput = createElement("input", "dept-drawer__input");
  nameInput.type = "text";
  nameInput.value = draft.name || "";
  nameGroup.append(nameLabel, nameInput);
  
  // Code field
  const codeGroup = createElement("div", "dept-drawer__field");
  const codeLabel = createElement("label", "dept-drawer__label", "Department Code");
  const codeInput = createElement("input", "dept-drawer__input");
  codeInput.type = "text";
  codeInput.value = draft.code || "";
  codeGroup.append(codeLabel, codeInput);
  
  body.append(nameGroup, codeGroup);
  
  // Footer buttons
  const cancelBtn = createElement("button", "dept-drawer__button dept-drawer__button--ghost", "Cancel");
  const saveBtn = createElement("button", "dept-drawer__button dept-drawer__button--primary", "Save Department");
  
  cancelBtn.type = "button";
  saveBtn.type = "button";
  
  cancelBtn.addEventListener("click", closeDrawer);
  
  footer.append(cancelBtn, saveBtn);
  
  headerLeft.append(title);
  header.append(headerLeft, closeBtn);
  drawer.append(header, body, footer);
  overlay.append(backdrop, drawer);
  
  return overlay;
}

export function createDeptDetailDrawer(state, closeDrawer, onSave, mode = "view", isOpen = false) {
  const overlay = createElement(
    "div",
    `dept-detail-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "dept-detail-drawer-overlay__backdrop");
  const drawer = createElement("div", "dept-detail-drawer");
  
  backdrop.type = "button";
  backdrop.addEventListener("click", closeDrawer);
  
  overlay.append(backdrop, drawer);
  
  return overlay;
}

export function createDeptInput(state, field, value, placeholder) {
  const input = createElement("input", "dept-drawer__input");
  input.type = "text";
  input.value = value || "";
  input.placeholder = placeholder || "";
  return input;
}

// ===== User Management View =====

export function createUserManagementView(activeApp) {
  const wrapper = createElement("section", "user-management-view");
  
  const header = createElement("div", "user-management-view__header");
  const eyebrow = createElement("p", "user-management-view__eyebrow", "Team management");
  const title = createElement("h1", "user-management-view__title", "USERS");
  const meta = createElement("p", "user-management-view__meta", "Manage user accounts, roles, and permissions across the organization.");
  
  header.append(eyebrow, title, meta);
  
  const list = createElement("div", "user-management-view__list");
  
  wrapper.append(header, list);
  
  return wrapper;
}
