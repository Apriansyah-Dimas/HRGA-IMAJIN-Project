// Core Utilities
// Shared utilities used across all features
// This file contains createElement, createIcon, and other foundational functions

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export const EVENT_TAG_STYLES = {
  Event: { color: "#5c73d8", textColor: "#ffffff" },
  Meeting: { color: "#78ab8d", textColor: "#ffffff" },
  Training: { color: "#6e67c8", textColor: "#ffffff" },
  Townhall: { color: "#d29b46", textColor: "#ffffff" },
  Workshop: { color: "#cf6f58", textColor: "#ffffff" },
  Holiday: { color: "#d45454", textColor: "#ffffff" },
};

export const EVENT_TAG_OPTIONS = Object.keys(EVENT_TAG_STYLES).filter(tag => tag !== "Event");

export function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

export function createIcon(name, label = "") {
  const icon = createElement("span", `ui-icon ui-icon--${name}`);
  icon.setAttribute("aria-hidden", "true");

  const icons = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    "chevron-left": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    "chevron-right": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
    "chevron-down": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 108-8"/><path d="M4 4v5h5"/></svg>',
    "arrow-right": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    "arrow-left-right": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4"/><path d="M7 4L3 8"/><path d="M7 4l4 4"/><path d="M17 8v12"/><path d="M17 20l4-4"/><path d="M17 20l-4-4"/></svg>',
    "log-out": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16l-6.3 7.1v5.1l-3.4 1.8v-6.9z"/></svg>',
    import: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11"/><path d="M8.5 10.5L12 14l3.5-3.5"/><path d="M5 16.5V19a2 2 0 002 2h10a2 2 0 002-2v-2.5"/></svg>',
    export: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V10"/><path d="M8.5 13.5L12 10l3.5 3.5"/><path d="M5 7.5V5a2 2 0 012-2h10a2 2 0 012 2v2.5"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>',
    "more-vertical": '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12s3.4-5.5 9.5-5.5S21.5 12 21.5 12 18.1 17.5 12 17.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.7"/></svg>',
    "eye-off": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12s3.4-5.5 9.5-5.5S21.5 12 21.5 12 18.1 17.5 12 17.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.7"/><path d="M4 4l16 16"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 10-3-3L5 17v3z"/><path d="M13.5 6.5l4 4"/></svg>',
    circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M7 3.5v3"/><path d="M17 3.5v3"/><path d="M3.5 9.5h17"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-1.2a3.8 3.8 0 00-3.8-3.8H7.8A3.8 3.8 0 004 19.8V21"/><circle cx="10" cy="8" r="3.2"/><path d="M20 21v-1.2a3.8 3.8 0 00-2.4-3.5"/><path d="M14.8 4.7a3.2 3.2 0 010 6.1"/></svg>',
    location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s6-5.4 6-11a6 6 0 10-12 0c0 5.6 6 11 6 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    description: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4.5h9l3 3V19a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 015 19V6A1.5 1.5 0 016.5 4.5z"/><path d="M14 4.5V8h3.5"/><path d="M8 12h8"/><path d="M8 15.5h8"/></svg>',
    reminder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v6l3 2"/><circle cx="12" cy="13" r="7"/><path d="M8 3L5 6"/><path d="M16 3l3 3"/></svg>',
    attachment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3.5h-5a3.5 3.5 0 00-3.5 3.5v10A3.5 3.5 0 009 20.5h6a3.5 3.5 0 003.5-3.5V9z"/><path d="M14 3.5V9h5.5"/><path d="M9 12.5l3 3 4-4"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M7.5 7l1 12.5h7L16.5 7"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>',
    bold: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5h6a4 4 0 010 8H7z"/><path d="M7 13h7a4 4 0 010 8H7z"/></svg>',
    italic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14 4h6"/><path d="M4 20h6"/><path d="M14 4L10 20"/></svg>',
    underline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v7a5 5 0 0010 0V4"/><path d="M5 20h14"/></svg>',
    strikethrough: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="M8 6a4 4 0 018 0"/><path d="M16 18a4 4 0 01-8 0"/></svg>',
    "list-bullets": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="6" cy="7" r="1"/><circle cx="6" cy="12" r="1"/><circle cx="6" cy="17" r="1"/><path d="M10 7h8"/><path d="M10 12h8"/><path d="M10 17h8"/></svg>',
    "list-numbers": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h2V5"/><path d="M6 5v4"/><path d="M4 12c0-1 2-1 2 0 0 2-2 2-2 4h2"/><path d="M4 17h2a1 1 0 000-2H4"/><path d="M6 15v4"/><path d="M10 7h10"/><path d="M10 12h10"/><path d="M10 17h10"/></svg>',
    eraser: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20H9"/><path d="M13.5 4.5l6 6"/><path d="M6.8 20a2 2 0 01-1.4-.6l-1.8-1.8a2 2 0 010-2.8l8.5-8.5a2 2 0 012.8 0l3.4 3.4a2 2 0 010 2.8L11 20z"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 2"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="7.5" width="17" height="12" rx="1.5"/><path d="M9 7.5V5a2.5 2.5 0 015 0v2.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3.4 8.8-7 10-3.6-1.2-7-5-7-10V6z"/></svg>',
    tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6a4 4 0 005.5 5.5L12 19l-3 1 1-3z"/><path d="M5 5l4 4"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h13"/><path d="M13 4l4 3-4 3"/><path d="M20 17H7"/><path d="M11 14l-4 3 4 3"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l8 14H4z"/><path d="M12 9v4"/><circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none"/></svg>',
    "calendar-app": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M7 3.5v3"/><path d="M17 3.5v3"/><path d="M3.5 9.5h17"/><path d="M8 13h3"/><path d="M13 13h3"/><path d="M8 16.5h3"/></svg>',
    "users-app": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20v-1.2a3.8 3.8 0 00-3.8-3.8H7.8A3.8 3.8 0 004 18.8V20"/><circle cx="10" cy="8" r="3.2"/><path d="M20 20v-1.2a3.8 3.8 0 00-2.4-3.5"/><path d="M14.8 4.7a3.2 3.2 0 010 6.1"/></svg>',
    "profile-app": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/><circle cx="12" cy="12" r="9"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M21 15l-5-5-5 5"/></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 3v18"/><path d="M4 7.5l8 4.5"/><path d="M20 7.5l-8 4.5"/></svg>',
    "map-pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s6-5.4 6-11a6 6 0 10-12 0c0 5.6 6 11 6 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.5"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.9 4.9l2.8 2.8"/><path d="M16.3 16.3l2.8 2.8"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.9 19.1l2.8-2.8"/><path d="M16.3 7.7l2.8-2.8"/></svg>',
  };

  icon.innerHTML = icons[name] ?? "";

  if (label) {
    icon.setAttribute("data-label", label);
  }

  return icon;
}

export function createNativeSelect(options, selectedValue, onChange) {
  const select = createElement("select");
  
  options.forEach(([value, label]) => {
    const option = createElement("option", null, label);
    option.value = value;
    if (value === selectedValue) {
      option.selected = true;
    }
    select.append(option);
  });

  if (onChange) {
    select.addEventListener("change", (e) => {
      onChange(e.target.value);
    });
  }

  return select;
}

export function createSectionLabel(iconName, text) {
  const label = createElement("label", "drawer-form__section-label");
  if (iconName) {
    label.append(createIcon(iconName), document.createTextNode(` ${text}`));
  } else {
    label.textContent = text;
  }
  return label;
}

export function formatDrawerDateLabel(value) {
  if (!value) return "";
  const date = new Date(value + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(/,/g, "");
}

export function formatDateTimeLocalValue(date) {
  return (
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-") +
    `T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  );
}

export function formatDateInput(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).replace(/,/g, "");
}

export function getDraftDatePart(value) {
  if (!value) return "";
  return value.split("T")[0];
}

export function getDraftTimePart(value) {
  if (!value || !value.includes("T")) return "";
  return value.split("T")[1] || "";
}

export function isDraftDateRangeValid(startValue, endValue) {
  if (!startValue || !endValue) return true;
  return new Date(startValue) <= new Date(endValue);
}

export function formatTime(date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildTimeOptions() {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const label = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      options.push([value, label]);
    }
  }
  return options;
}

export function formatMinutesAsTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
