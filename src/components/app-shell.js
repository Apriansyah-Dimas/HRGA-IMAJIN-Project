import {
  defaultAppId,
  defaultItemByApp,
  workspaceApps,
} from "../data/navigation.js";

function getSites() {
  const app = workspaceApps.find((a) => a.id === "user-management");
  return app?.sites || [];
}

function getDepartments() {
  const app = workspaceApps.find((a) => a.id === "user-management");
  return app?.departments || [];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const EVENT_TAG_STYLES = {
  Event: { color: "#5c73d8", textColor: "#ffffff" },
  Meeting: { color: "#78ab8d", textColor: "#ffffff" },
  Training: { color: "#6e67c8", textColor: "#ffffff" },
  Townhall: { color: "#d29b46", textColor: "#ffffff" },
  Workshop: { color: "#cf6f58", textColor: "#ffffff" },
  Holiday: { color: "#d45454", textColor: "#ffffff" },
};

const EVENT_TAG_OPTIONS = Object.keys(EVENT_TAG_STYLES).filter(
  (tag) => tag !== "Event",
);
const PDFJS_VERSION = "5.5.207";
const PDFJS_MODULE_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.mjs`;
const PDFJS_WORKER_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.mjs`;

let pdfJsLibPromise = null;

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

function createIcon(name, label = "") {
  const icon = createElement("span", `ui-icon ui-icon--${name}`);
  icon.setAttribute("aria-hidden", "true");

  const icons = {
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    "chevron-left":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    "chevron-right":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
    "chevron-down":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    minus:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    reset:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 108-8"/><path d="M4 4v5h5"/></svg>',
    "arrow-right":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    "arrow-left-right":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4"/><path d="M7 4L3 8"/><path d="M7 4l4 4"/><path d="M17 8v12"/><path d="M17 20l4-4"/><path d="M17 20l-4-4"/></svg>',
    "log-out":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
    search:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>',
    filter:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16l-6.3 7.1v5.1l-3.4 1.8v-6.9z"/></svg>',
    import:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11"/><path d="M8.5 10.5L12 14l3.5-3.5"/><path d="M5 16.5V19a2 2 0 002 2h10a2 2 0 002-2v-2.5"/></svg>',
    export:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V10"/><path d="M8.5 13.5L12 10l3.5 3.5"/><path d="M5 7.5V5a2 2 0 012-2h10a2 2 0 012 2v2.5"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>',
    "more-vertical":
      '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12s3.4-5.5 9.5-5.5S21.5 12 21.5 12 18.1 17.5 12 17.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.7"/></svg>',
    "eye-off": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12s3.4-5.5 9.5-5.5S21.5 12 21.5 12 18.1 17.5 12 17.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.7"/><path d="M4 4l16 16"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 10-3-3L5 17v3z"/><path d="M13.5 6.5l4 4"/></svg>',
    circle:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="7"/></svg>',
    calendar:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M7 3.5v3"/><path d="M17 3.5v3"/><path d="M3.5 9.5h17"/></svg>',
    users:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-1.2a3.8 3.8 0 00-3.8-3.8H7.8A3.8 3.8 0 004 19.8V21"/><circle cx="10" cy="8" r="3.2"/><path d="M20 21v-1.2a3.8 3.8 0 00-2.4-3.5"/><path d="M14.8 4.7a3.2 3.2 0 010 6.1"/></svg>',
    location:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s6-5.4 6-11a6 6 0 10-12 0c0 5.6 6 11 6 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    description:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4.5h9l3 3V19a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 015 19V6A1.5 1.5 0 016.5 4.5z"/><path d="M14 4.5V8h3.5"/><path d="M8 12h8"/><path d="M8 15.5h8"/></svg>',
    reminder:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v6l3 2"/><circle cx="12" cy="13" r="7"/><path d="M8 3L5 6"/><path d="M16 3l3 3"/></svg>',
    attachment:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3.5h-5a3.5 3.5 0 00-3.5 3.5v10A3.5 3.5 0 009 20.5h6a3.5 3.5 0 003.5-3.5V9z"/><path d="M14 3.5V9h5.5"/><path d="M9 12.5l3 3 4-4"/></svg>',
    trash:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M7.5 7l1 12.5h7L16.5 7"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>',
    bold: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5h6a4 4 0 010 8H7z"/><path d="M7 13h7a4 4 0 010 8H7z"/></svg>',
    italic:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14 4h6"/><path d="M4 20h6"/><path d="M14 4L10 20"/></svg>',
    underline:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v7a5 5 0 0010 0V4"/><path d="M5 20h14"/></svg>',
    strikethrough:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="M8 6a4 4 0 018 0"/><path d="M16 18a4 4 0 01-8 0"/></svg>',
    "list-bullets":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="6" cy="7" r="1"/><circle cx="6" cy="12" r="1"/><circle cx="6" cy="17" r="1"/><path d="M10 7h8"/><path d="M10 12h8"/><path d="M10 17h8"/></svg>',
    "list-numbers":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h2V5"/><path d="M6 5v4"/><path d="M4 12c0-1 2-1 2 0 0 2-2 2-2 4h2"/><path d="M4 17h2a1 1 0 000-2H4"/><path d="M6 15v4"/><path d="M10 7h10"/><path d="M10 12h10"/><path d="M10 17h10"/></svg>',
    eraser:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20H9"/><path d="M13.5 4.5l6 6"/><path d="M6.8 20a2 2 0 01-1.4-.6l-1.8-1.8a2 2 0 010-2.8l8.5-8.5a2 2 0 012.8 0l3.4 3.4a2 2 0 010 2.8L11 20z"/></svg>',
    sparkle:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
    clock:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 2"/></svg>',
    user:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/></svg>',
    briefcase:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="7.5" width="17" height="12" rx="1.5"/><path d="M9 7.5V5a2.5 2.5 0 015 0v2.5"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3.4 8.8-7 10-3.6-1.2-7-5-7-10V6z"/></svg>',
    tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6a4 4 0 005.5 5.5L12 19l-3 1 1-3z"/><path d="M5 5l4 4"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h13"/><path d="M13 4l4 3-4 3"/><path d="M20 17H7"/><path d="M11 14l-4 3 4 3"/></svg>',
    alert:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l8 14H4z"/><path d="M12 9v4"/><circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none"/></svg>',
    "home-app":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5L12 4l8 6.5"/><path d="M6.5 9.5V20h11V9.5"/><path d="M10 20v-5h4v5"/></svg>',
    "calendar-app":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M7 3.5v3"/><path d="M17 3.5v3"/><path d="M3.5 9.5h17"/><path d="M8 13h3"/><path d="M13 13h3"/><path d="M8 16.5h3"/></svg>',
    "journey-app":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="6" r="1.5"/><path d="M7.5 16.8l3-3.6"/><path d="M13.5 10.8l3-3.6"/><path d="M5 6h4"/><path d="M5 6c0 6.5 2.5 9.5 7 9.5h1.5"/></svg>',
    "assets-app":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3.8v10.4L12 21 5 17.2V6.8z"/><path d="M12 3v18"/><path d="M5 6.8l7 4 7-4"/></svg>',
    "users-app":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20v-1.2a3.8 3.8 0 00-3.8-3.8H7.8A3.8 3.8 0 004 18.8V20"/><circle cx="10" cy="8" r="3.2"/><path d="M20 20v-1.2a3.8 3.8 0 00-2.4-3.5"/><path d="M14.8 4.7a3.2 3.2 0 010 6.1"/></svg>',
    "profile-app":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/><circle cx="12" cy="12" r="9"/></svg>',
    image:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M21 15l-5-5-5 5"/></svg>',
    package:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 3v18"/><path d="M4 7.5l8 4.5"/><path d="M20 7.5l-8 4.5"/></svg>',
    "map-pin":
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s6-5.4 6-11a6 6 0 10-12 0c0 5.6 6 11 6 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    settings:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.5"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.9 4.9l2.8 2.8"/><path d="M16.3 16.3l2.8 2.8"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.9 19.1l2.8-2.8"/><path d="M16.3 7.7l2.8-2.8"/></svg>',
  };

  icon.innerHTML = icons[name] ?? "";

  if (label) {
    icon.setAttribute("data-label", label);
  }

  return icon;
}

function getCalendarApp() {
  return workspaceApps.find((app) => app.id === "calendar");
}

function getTodayDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function isSameCalendarDate(leftDate, rightDate) {
  return (
    leftDate instanceof Date &&
    rightDate instanceof Date &&
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  );
}

function getUserManagementApp() {
  return workspaceApps.find((app) => app.id === "user-management");
}

function getAssetsApp() {
  return workspaceApps.find((app) => app.id === "assets");
}

const ASSET_PAGE_META = {
  Dashboard: {
    eyebrow: "Asset intelligence",
    title: "Operational asset control across branches",
    description:
      "Pantau utilisasi, pergerakan, dan request operasional dalam satu workspace yang lebih tajam dan siap dipakai harian.",
  },
  Assets: {
    eyebrow: "Asset registry",
    title: "LIST OF ASSETS",
    description:
      "Cari, filter, dan kelola status asset sambil melihat detail penempatan, kondisi, dan agenda tindak lanjut pada saat yang sama.",
  },
  "Maintenance Asset Request": {
    eyebrow: "Service queue",
    title: "Maintenance requests that can be triaged fast",
    description:
      "Kelompokkan issue berdasarkan urgensi dan teruskan ke owner yang tepat tanpa meninggalkan context lokasi, requestor, dan SLA.",
  },
  "Asset Request": {
    eyebrow: "Demand intake",
    title: "Request approvals with clearer business context",
    description:
      "Lihat kebutuhan asset per tim, durasi pemakaian, dan alasan pengajuan sebelum menyetujui atau meminta revisi.",
  },
  "Asset Check Out": {
    eyebrow: "Handover",
    title: "Check out workflow that updates the inventory state",
    description:
      "Siapkan serah terima, konfirmasi pickup, lalu sinkronkan penempatan asset tanpa langkah manual tambahan.",
  },
  "Asset Check In": {
    eyebrow: "Return desk",
    title: "Check in and inspection without lost context",
    description:
      "Pantau asset yang kembali, jalankan inspeksi, lalu kembalikan ke pool dengan status yang akurat.",
  },
  "Asset Mutation": {
    eyebrow: "Movement log",
    title: "Branch transfer tracking in one view",
    description:
      "Monitor perpindahan asset antar lokasi mulai dari antrean kirim sampai konfirmasi penerimaan di cabang tujuan.",
  },
  "Stock Opname": {
    eyebrow: "Audit rhythm",
    title: "Stock opname progress that surfaces risk early",
    description:
      "Lacak coverage scan, discrepancy, dan batch yang tertahan sebelum gap inventaris membesar.",
  },
  "Access Control": {
    eyebrow: "Physical access",
    title: "Access policies tied back to operational asset zones",
    description:
      "Kelola akses ruang dan perangkat sensitif dengan status yang jelas serta riwayat penggunaan terakhir.",
  },
  "New asset": {
    eyebrow: "Asset registry",
    title: "Create or update an asset entry",
    description:
      "Isi data minimum yang diperlukan lalu simpan asset baru ke inventory. Form sengaja dibuat ringkas agar cepat dipakai tim operasional.",
  },
};

const ASSET_INVENTORY_FILTERS = [
  ["all", "All"],
  ["in-use", "In use"],
  ["available", "Available"],
  ["stored", "Stored"],
  ["maintenance", "Maintenance"],
  ["reserved", "Reserved"],
];

const USER_PAGE_META = {
  "All Users": {
    eyebrow: "Team management",
    title: "USERS",
    description: "Manage user accounts, roles, and permissions across the organization.",
  },
  Roles: {
    eyebrow: "Access control",
    title: "USER ROLES",
    description: "Define and customize user roles with specific permission sets.",
  },
  Permissions: {
    eyebrow: "Access rights",
    title: "PERMISSIONS",
    description: "Configure granular permissions for different system features.",
  },
  Invitations: {
    eyebrow: "Onboarding",
    title: "PENDING INVITATIONS",
    description: "View and manage pending user invitations and their status.",
  },
};

const USERS_FILTERS = [
  ["all", "All"],
  ["active", "Active"],
  ["pending", "Pending"],
  ["suspended", "Suspended"],
];

const ASSET_REQUEST_FILTERS = {
  maintenance: [
    ["all", "All"],
    ["pending", "Pending"],
    ["in-progress", "In progress"],
    ["scheduled", "Scheduled"],
  ],
  request: [
    ["all", "All"],
    ["pending", "Pending"],
    ["approved", "Approved"],
    ["warning", "Needs revision"],
    ["rejected", "Rejected"],
  ],
  checkout: [
    ["all", "All"],
    ["scheduled", "Ready"],
    ["approved", "Checked out"],
    ["pending", "Pending"],
  ],
  checkin: [
    ["all", "All"],
    ["inspection", "Inspection"],
    ["completed", "Closed"],
  ],
  mutation: [
    ["all", "All"],
    ["pending", "Queued"],
    ["in-progress", "In transit"],
    ["completed", "Completed"],
  ],
  stock: [
    ["all", "All"],
    ["in-progress", "Active"],
    ["pending", "Pending"],
    ["completed", "Closed"],
  ],
  access: [
    ["all", "All"],
    ["approved", "Active"],
    ["rejected", "Revoked"],
  ],
};

// Asset Category to Roman Numeral Mapping
const ASSET_CATEGORY_TO_ROMAWI = {
  "Elektronik": "I",
  "Furniture": "II",
  "Laptop and Komp": "III",
  "Kendaraan": "IV",
  "Machine and Tooling": "V",
};

// Reverse mapping for display
const ASSET_ROMAWI_TO_CATEGORY = Object.fromEntries(
  Object.entries(ASSET_CATEGORY_TO_ROMAWI).map(([k, v]) => [v, k])
);

// Asset Status Options
const ASSET_STATUS_OPTIONS = [
  "Active",
  "Broken",
  "In Repair",
  "Lost/Missing",
  "Sell",
];

function formatAssetDateLabel(date) {
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/,/g, "");
}

function formatAssetDateTimeLabel(date) {
  return `${formatAssetDateLabel(date)} | ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function getAssetStatusTone(status) {
  const tones = {
    "In Use": "in-use",
    Available: "available",
    Stored: "stored",
    Maintenance: "maintenance",
    Reserved: "reserved",
    Active: "active",
    Broken: "broken",
    "In Repair": "in-repair",
    "Lost/Missing": "lost-missing",
    Sell: "sell",
  };

  return tones[status] ?? "stored";
}

// Get site code from location name (sequential: BSD=01, Deltamas 1=02, Deltamas 2=03)
function getSiteCodeFromLocation(location) {
  const sites = getSites();
  const siteIndex = sites.findIndex((s) =>
    location.toLowerCase().includes(s.name.toLowerCase()) ||
    location.toLowerCase().includes(s.code.toLowerCase())
  );
  // Return sequential code (01, 02, 03) based on site order
  if (siteIndex >= 0) {
    return String(siteIndex + 1).padStart(2, "0");
  }
  return "01"; // Default to first site
}

// Generate Asset Number with format FA001/I/01
function generateAssetNumber(manualCode, category, location) {
  const romawi = ASSET_CATEGORY_TO_ROMAWI[category] || "I";
  const siteCode = getSiteCodeFromLocation(location);
  return `${manualCode}/${romawi}/${siteCode}`;
}

// Parse Asset Number to get components
function parseAssetNumber(assetNumber) {
  const match = assetNumber.match(/^(.+?)\/(.+?)\/(.+?)$/);
  if (match) {
    return {
      manualCode: match[1],
      romawi: match[2],
      siteCode: match[3],
    };
  }
  return null;
}

function getInitialAssetDraft() {
  return {
    assetImage: null,
    name: "",
    manualCode: "",
    category: "Elektronik",
    site: "BSD",
    status: "Active",
    cost: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    department: "",
    personInCharge: "",
    brand: "",
    model: "",
    serialNumber: "",
    notes: "",
  };
}

function getInitialAssetsState() {
  const assetsApp = getAssetsApp();

  return {
    notice: null,
    selectedRecordId: assetsApp?.records?.[0]?.id ?? null,
    selectedMaintenanceId: assetsApp?.maintenanceRequests?.[0]?.id ?? null,
    selectedRequestId: assetsApp?.assetRequests?.[0]?.id ?? null,
    selectedCheckOutId: assetsApp?.checkOuts?.[0]?.id ?? null,
    selectedCheckInId: assetsApp?.checkIns?.[0]?.id ?? null,
    selectedMutationId: assetsApp?.mutations?.[0]?.id ?? null,
    selectedStockId: assetsApp?.stockOpnames?.[0]?.id ?? null,
    selectedAccessId: assetsApp?.accessControls?.[0]?.id ?? null,
    searches: {
      inventory: "",
      maintenance: "",
      request: "",
      checkout: "",
      checkin: "",
      mutation: "",
      stock: "",
      access: "",
    },
    filters: {
      inventory: "all",
      maintenance: "all",
      request: "all",
      checkout: "all",
      checkin: "all",
      mutation: "all",
      stock: "all",
      access: "all",
    },
    draft: getInitialAssetDraft(),
    draftErrors: {},
    editingAssetId: null,
  };
}

function ensureSelectedId(items, selectedId) {
  if (items.some((item) => item.id === selectedId)) {
    return selectedId;
  }

  return items[0]?.id ?? null;
}

function getInitialCalendarState() {
  const calendarApp = getCalendarApp();
  const today = getTodayDate();
  const todayEvent = calendarApp?.events?.find((event) => {
    return (
      event.year === today.getFullYear() &&
      event.monthIndex === today.getMonth() &&
      Number(event.day) === today.getDate()
    );
  });

  return {
    viewMode: "month",
    displayYear: today.getFullYear(),
    displayMonth: today.getMonth(),
    selectedDay: today.getDate(),
    selectedEventId: todayEvent?.id ?? null,
    showAllEvents: false,
    isMonthOpen: true,
  };
}

function getInitialUsersState() {
  const userApp = getUserManagementApp();

  return {
    selectedUserId: userApp?.users?.[0]?.id ?? null,
    search: "",
    filter: "all",
  };
}

function getInitialState() {
  const activeApp =
    workspaceApps.find((app) => app.id === defaultAppId) ?? workspaceApps[0];
  const activeItem = defaultItemByApp[activeApp.id] ?? activeApp.items?.[0];

  return {
    activeAppId: activeApp.id,
    activeItem,
    calendar: getInitialCalendarState(),
    assets: getInitialAssetsState(),
    users: getInitialUsersState(),
    lastAction: "",
    assetSearchQuery: "",
    assetMenuId: null,
    isEventDrawerOpen: false,
    attachmentViewer: {
      isOpen: false,
      attachment: null,
    },
    eventDrawerMode: "create",
    activeDrawerEventId: null,
    eventDraft: getInitialEventDraft(),
    isUserDrawerOpen: false,
    userDraft: getInitialUserDraft(),
    isSiteDrawerOpen: false,
    siteDraft: getInitialSiteDraft(),
    isDeptDrawerOpen: false,
    deptDraft: getInitialDeptDraft(),
    isAssetDrawerOpen: false,
    assetDraft: getInitialAssetDraft(),
    isSiteDetailDrawerOpen: false,
    siteDetailMode: "view",
    currentSiteId: null,
    isDeptDetailDrawerOpen: false,
    deptDetailMode: "view",
    currentDeptId: null,
    orgSettingsActiveTab: "sites",
    isUserDetailDrawerOpen: false,
    userDetailMode: "view",
    currentUserId: null,
  };
}

function formatDateTimeLocalValue(date) {
  return (
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-") +
    `T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  );
}

function getInitialEventDraft() {
  const initialDate = new Date();
  initialDate.setSeconds(0, 0);
  initialDate.setMinutes(Math.ceil(initialDate.getMinutes() / 15) * 15);

  if (initialDate.getMinutes() === 60) {
    initialDate.setHours(initialDate.getHours() + 1, 0, 0, 0);
  }

  const endDate = new Date(initialDate);
  endDate.setHours(endDate.getHours() + 1);

  return {
    title: "",
    start: formatDateTimeLocalValue(initialDate),
    end: formatDateTimeLocalValue(endDate),
    isAllDay: false,
    participantQuery: "",
    participants: [],
    isParticipantPopupOpen: false,
    isDatePickerOpen: false,
    openTimeField: null,
    pickerMonth: initialDate.getMonth(),
    pickerYear: initialDate.getFullYear(),
    location: "",
    attachments: [],
    description: "",
    reminders: [],
    tag: "Event",
  };
}

function getInitialUserDraft() {
  const today = new Date();
  return {
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    joinDate: formatDateTimeLocalValue(today),
    role: "custom",
    permissions: [],
    sendInvitation: true,
    password: "",
    confirmPassword: "",
  };
}

function getInitialSiteDraft() {
  return {
    name: "",
    code: "",
    address: "",
  };
}

function getInitialDeptDraft() {
  return {
    name: "",
    code: "",
    site: "",
    head: "",
  };
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function buildCalendarDays(year, month, selectedDate) {
  const today = getTodayDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(
    year,
    month - 1 < 0 ? year - 1 : year,
    month - 1 < 0 ? 11 : month - 1,
  );
  const cells = [];
  const selectedYear = selectedDate?.getFullYear?.();
  const selectedMonth = selectedDate?.getMonth?.();
  const selectedDay = selectedDate?.getDate?.();
  const isSelectedMonth = selectedYear === year && selectedMonth === month;

  for (let index = 0; index < firstDay; index += 1) {
    const dayValue = daysInPrevMonth - firstDay + index + 1;
    const itemYear = month === 0 ? year - 1 : year;
    const itemMonth = month === 0 ? 11 : month - 1;
    cells.push({
      value: dayValue,
      muted: true,
      isCurrentMonth: false,
      year: itemYear,
      monthIndex: itemMonth,
      isToday: isSameCalendarDate(
        today,
        new Date(itemYear, itemMonth, dayValue),
      ),
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      value: day,
      active: isSelectedMonth && day === selectedDay,
      isCurrentMonth: true,
      year,
      monthIndex: month,
      isToday: isSameCalendarDate(today, new Date(year, month, day)),
    });
  }

  while (cells.length < 42) {
    const dayValue = cells.length - (firstDay + daysInMonth) + 1;
    const itemYear = month === 11 ? year + 1 : year;
    const itemMonth = month === 11 ? 0 : month + 1;
    cells.push({
      value: dayValue,
      muted: true,
      isCurrentMonth: false,
      year: itemYear,
      monthIndex: itemMonth,
      isToday: isSameCalendarDate(
        today,
        new Date(itemYear, itemMonth, dayValue),
      ),
    });
  }

  return cells;
}

function syncCalendarToEvent(state, event) {
  state.calendar.displayYear = event.year;
  state.calendar.displayMonth = event.monthIndex;
  state.calendar.selectedDay = Number(event.day);
  state.calendar.selectedEventId = event.id;
}

function getEventDate(event) {
  return new Date(event.year, event.monthIndex, Number(event.day));
}

function isUpcomingEvent(event) {
  return getEventDate(event) >= getTodayDate();
}

function getEventsForDisplayedMonth(activeApp, state) {
  return activeApp.events.filter((event) => {
    return (
      event.year === state.calendar.displayYear &&
      event.monthIndex === state.calendar.displayMonth
    );
  });
}

function syncCalendarSelectionForDisplayedMonth(state, activeApp) {
  const monthEvents = getEventsForDisplayedMonth(activeApp, state);

  if (monthEvents.length === 0) {
    state.calendar.selectedEventId = null;
    state.calendar.selectedDay = 1;
    return;
  }

  const selectedEvent = monthEvents.find(
    (event) => event.id === state.calendar.selectedEventId,
  );

  if (selectedEvent) {
    state.calendar.selectedDay = Number(selectedEvent.day);
    return;
  }

  state.calendar.selectedEventId = monthEvents[0].id;
  state.calendar.selectedDay = Number(monthEvents[0].day);
}

function getVisibleCalendarPanelEvents(activeApp, state) {
  const monthEvents = getEventsForDisplayedMonth(activeApp, state).filter(
    isUpcomingEvent,
  );

  if (monthEvents.length <= 2) {
    return monthEvents;
  }

  const visible = monthEvents.slice(0, 2);
  const selectedEvent = monthEvents.find(
    (event) => event.id === state.calendar.selectedEventId,
  );

  if (
    selectedEvent &&
    !visible.some((event) => event.id === selectedEvent.id)
  ) {
    return [visible[0], selectedEvent].filter(Boolean);
  }

  return visible;
}

function getCalendarEventById(activeApp, eventId) {
  return activeApp.events.find((event) => event.id === eventId) ?? null;
}

function createAttachmentPreview(
  fileData,
  options = {
    imageClassName: "drawer-detail__attachment-image",
    frameClassName: "drawer-detail__attachment-frame",
  },
) {
  if (!fileData?.dataUrl) {
    return null;
  }

  const imageClassName =
    options.imageClassName ?? "drawer-detail__attachment-image";
  const frameClassName =
    options.frameClassName ?? "drawer-detail__attachment-frame";

  if (fileData.type?.startsWith("image/")) {
    const image = createElement("img", imageClassName);
    image.src = fileData.dataUrl;
    image.alt = fileData.name || "Attachment preview";
    return image;
  }

  if (fileData.type === "application/pdf") {
    const frame = createElement("iframe", frameClassName);
    frame.src = fileData.dataUrl;
    frame.title = fileData.name || "Attachment preview";
    return frame;
  }

  return null;
}

function getEventAttachments(event) {
  if (Array.isArray(event.attachments) && event.attachments.length > 0) {
    return event.attachments;
  }

  if (event.attachmentName || event.attachmentFile?.name) {
    return [
      {
        name:
          event.attachmentName || event.attachmentFile?.name || "Attachment",
        type: event.attachmentFile?.type || "",
        dataUrl: event.attachmentFile?.dataUrl || "",
      },
    ];
  }

  return [];
}

async function loadPdfJs() {
  if (!pdfJsLibPromise) {
    pdfJsLibPromise = import(PDFJS_MODULE_URL)
      .then((module) => {
        module.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        return module;
      })
      .catch((error) => {
        pdfJsLibPromise = null;
        throw error;
      });
  }

  return pdfJsLibPromise;
}

function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function downloadAttachmentFile(attachment) {
  if (!attachment?.dataUrl) {
    return;
  }

  const link = document.createElement("a");
  link.href = attachment.dataUrl;
  link.download = attachment.name || "attachment";
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
}

function createDrawerAttachmentPreview(fileData) {
  if (!fileData?.dataUrl) {
    return null;
  }

  if (fileData.type?.startsWith("image/")) {
    return createAttachmentPreview(fileData, {
      imageClassName: "drawer-detail__attachment-image",
      frameClassName: "drawer-detail__attachment-frame",
    });
  }

  if (fileData.type === "application/pdf") {
    const paper = createElement("div", "drawer-detail__attachment-paper");
    const loading = createElement(
      "div",
      "drawer-detail__attachment-paper-loading",
    );

    paper.append(loading);

    loadPdfJs()
      .then(async (pdfjsLib) => {
        const loadingTask = pdfjsLib.getDocument({
          data: dataUrlToUint8Array(fileData.dataUrl),
        });
        const pdfDocument = await loadingTask.promise;
        const page = await pdfDocument.getPage(1);
        const viewport = page.getViewport({ scale: 1.15 });
        const canvas = createElement(
          "canvas",
          "drawer-detail__attachment-paper-canvas",
        );
        const context = canvas.getContext("2d");
        const outputScale = window.devicePixelRatio || 1;

        if (!context) {
          throw new Error("Canvas context unavailable");
        }

        paper.style.setProperty(
          "--paper-ratio",
          `${viewport.width} / ${viewport.height}`,
        );
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        await page.render({
          canvasContext: context,
          viewport,
          transform:
            outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
        }).promise;

        paper.innerHTML = "";
        paper.append(canvas);
      })
      .catch(() => {
        paper.innerHTML = "";
        paper.append(
          createElement("div", "drawer-detail__attachment-paper-fallback"),
        );
      });

    return paper;
  }

  return createElement("div", "drawer-detail__attachment-paper-fallback");
}

function createAttachmentViewerOverlayLegacy(
  attachment,
  closeViewer,
  isOpen = false,
) {
  const overlay = createElement(
    "div",
    `attachment-viewer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement(
    "button",
    "attachment-viewer-overlay__backdrop",
  );
  const viewer = createElement("section", "attachment-viewer");
  const header = createElement("div", "attachment-viewer__header");
  const titleBlock = createElement("div", "attachment-viewer__title-block");
  const eyebrow = createElement(
    "p",
    "attachment-viewer__eyebrow",
    "Attachment Preview",
  );
  const title = createElement(
    "h3",
    "attachment-viewer__title",
    attachment?.name || "Attachment",
  );
  const hint = createElement(
    "p",
    "attachment-viewer__hint",
    "Scroll to zoom, drag to move, or reset the frame.",
  );
  const actions = createElement("div", "attachment-viewer__actions");
  const zoomOutButton = createElement(
    "button",
    "attachment-viewer__control",
    "−",
  );
  const zoomValue = createElement(
    "span",
    "attachment-viewer__zoom-value",
    "100%",
  );
  const zoomInButton = createElement(
    "button",
    "attachment-viewer__control",
    "+",
  );
  const resetButton = createElement(
    "button",
    "attachment-viewer__control attachment-viewer__control--label",
    "Reset",
  );
  const closeButton = createElement(
    "button",
    "attachment-viewer__control attachment-viewer__control--label",
    "Close",
  );
  const viewport = createElement("div", "attachment-viewer__viewport");
  const stage = createElement("div", "attachment-viewer__stage");
  const asset = createElement("div", "attachment-viewer__asset");
  const preview = createAttachmentPreview(attachment, {
    imageClassName: "attachment-viewer__media attachment-viewer__media--image",
    frameClassName: "attachment-viewer__media attachment-viewer__media--frame",
  });

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let pointerId = null;
  let dragStartX = 0;
  let dragStartY = 0;

  overlay.setAttribute("aria-hidden", "false");
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-label", attachment?.name || "Attachment preview");
  backdrop.type = "button";
  zoomOutButton.type = "button";
  zoomInButton.type = "button";
  resetButton.type = "button";
  closeButton.type = "button";

  function applyTransform() {
    stage.style.setProperty("--viewer-scale", String(scale));
    stage.style.setProperty("--viewer-offset-x", `${offsetX}px`);
    stage.style.setProperty("--viewer-offset-y", `${offsetY}px`);
    zoomValue.textContent = `${Math.round(scale * 100)}%`;
    viewport.classList.toggle("is-dragging", isDragging);
  }

  function clampScale(value) {
    return Math.min(4, Math.max(1, value));
  }

  function setScale(value) {
    scale = clampScale(value);

    if (scale === 1) {
      offsetX = 0;
      offsetY = 0;
    }

    applyTransform();
  }

  function stopDragging() {
    isDragging = false;
    pointerId = null;
    viewport.classList.remove("is-dragging");
  }

  backdrop.addEventListener("click", closeViewer);
  closeButton.addEventListener("click", closeViewer);
  zoomOutButton.addEventListener("click", () => {
    setScale(scale - 0.2);
  });
  zoomInButton.addEventListener("click", () => {
    setScale(scale + 0.2);
  });
  resetButton.addEventListener("click", () => {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    applyTransform();
  });
  viewport.addEventListener(
    "wheel",
    (event) => {
      if (!preview) {
        return;
      }

      event.preventDefault();
      setScale(scale + (event.deltaY < 0 ? 0.18 : -0.18));
    },
    { passive: false },
  );
  viewport.addEventListener("dblclick", () => {
    setScale(scale === 1 ? 2 : 1);
  });
  viewport.addEventListener("pointerdown", (event) => {
    if (!preview) {
      return;
    }

    isDragging = true;
    pointerId = event.pointerId;
    dragStartX = event.clientX - offsetX;
    dragStartY = event.clientY - offsetY;
    viewport.setPointerCapture(event.pointerId);
    applyTransform();
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!isDragging || event.pointerId !== pointerId || scale === 1) {
      return;
    }

    offsetX = event.clientX - dragStartX;
    offsetY = event.clientY - dragStartY;
    applyTransform();
  });
  viewport.addEventListener("pointerup", (event) => {
    if (pointerId === event.pointerId) {
      stopDragging();
    }
  });
  viewport.addEventListener("pointercancel", stopDragging);
  viewport.addEventListener("lostpointercapture", stopDragging);

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      closeViewer();
      return;
    }

    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      setScale(scale + 0.2);
      return;
    }

    if (event.key === "-") {
      event.preventDefault();
      setScale(scale - 0.2);
      return;
    }

    if (event.key === "0") {
      event.preventDefault();
      scale = 1;
      offsetX = 0;
      offsetY = 0;
      applyTransform();
    }
  };

  document.addEventListener("keydown", handleKeydown);
  overlay.__cleanupViewerHandlers = () => {
    document.removeEventListener("keydown", handleKeydown);
  };

  titleBlock.append(eyebrow, title, hint);
  actions.append(
    zoomOutButton,
    zoomValue,
    zoomInButton,
    resetButton,
    closeButton,
  );
  header.append(titleBlock, actions);

  if (preview) {
    asset.append(preview);
  } else {
    asset.append(
      createElement(
        "div",
        "attachment-viewer__fallback",
        "Inline preview is available for image and PDF attachments.",
      ),
    );
  }

  stage.append(asset);
  viewport.append(stage);
  viewer.append(header, viewport);
  overlay.append(backdrop, viewer);
  applyTransform();

  return overlay;
}

function createAttachmentViewerOverlay(
  attachment,
  closeViewer,
  isOpen = false,
) {
  const overlay = createElement(
    "div",
    `attachment-viewer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement(
    "button",
    "attachment-viewer-overlay__backdrop",
  );
  const viewer = createElement("section", "attachment-viewer");
  const topActions = createElement("div", "attachment-viewer__top-actions");
  const closeButton = createElement(
    "button",
    "attachment-viewer__icon-button attachment-viewer__icon-button--close",
  );
  const downloadButton = createElement(
    "button",
    "attachment-viewer__icon-button attachment-viewer__icon-button--download",
  );
  const dock = createElement("div", "attachment-viewer__dock");
  const zoomOutButton = createElement(
    "button",
    "attachment-viewer__icon-button",
  );
  const resetButton = createElement("button", "attachment-viewer__icon-button");
  const zoomInButton = createElement(
    "button",
    "attachment-viewer__icon-button",
  );
  const viewport = createElement("div", "attachment-viewer__viewport");
  const stage = createElement("div", "attachment-viewer__stage");
  const asset = createElement("div", "attachment-viewer__asset");
  const isDocument = attachment?.type === "application/pdf";
  const preview = attachment?.type?.startsWith("image/")
    ? createAttachmentPreview(attachment, {
        imageClassName:
          "attachment-viewer__media attachment-viewer__media--image",
        frameClassName:
          "attachment-viewer__media attachment-viewer__media--frame",
      })
    : null;
  const loadingIndicator = createElement("div", "attachment-viewer__loading");
  const fallback = createElement("div", "attachment-viewer__fallback");

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let pointerId = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let isPreviewReady = Boolean(preview);
  let isDestroyed = false;
  let loadingTask = null;

  overlay.setAttribute("aria-hidden", "false");
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-label", "Attachment preview");
  backdrop.type = "button";
  closeButton.type = "button";
  downloadButton.type = "button";
  zoomOutButton.type = "button";
  resetButton.type = "button";
  zoomInButton.type = "button";
  closeButton.setAttribute("aria-label", "Close preview");
  downloadButton.setAttribute("aria-label", "Download attachment");
  zoomOutButton.setAttribute("aria-label", "Zoom out");
  resetButton.setAttribute("aria-label", "Reset zoom");
  zoomInButton.setAttribute("aria-label", "Zoom in");
  closeButton.append(createIcon("close"));
  downloadButton.append(createIcon("import"));
  zoomOutButton.append(createIcon("minus"));
  resetButton.append(createIcon("reset"));
  zoomInButton.append(createIcon("plus"));
  fallback.setAttribute("aria-hidden", "true");
  fallback.append(createIcon("attachment"));

  if (isDocument) {
    viewport.classList.add("attachment-viewer__viewport--document");
    stage.classList.add("attachment-viewer__stage--document");
    asset.classList.add("attachment-viewer__asset--document");
  }

  function applyTransform() {
    stage.style.setProperty("--viewer-scale", String(scale));
    stage.style.setProperty("--viewer-offset-x", `${offsetX}px`);
    stage.style.setProperty("--viewer-offset-y", `${offsetY}px`);
    viewport.classList.toggle("is-dragging", isDragging);
  }

  function clampScale(value) {
    return Math.min(4, Math.max(1, value));
  }

  function resetTransform() {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    applyTransform();
  }

  function setScale(value) {
    scale = clampScale(value);

    if (scale === 1) {
      offsetX = 0;
      offsetY = 0;
    }

    applyTransform();
  }

  function stopDragging() {
    isDragging = false;
    pointerId = null;
    viewport.classList.remove("is-dragging");
  }

  backdrop.addEventListener("click", closeViewer);
  closeButton.addEventListener("click", closeViewer);
  downloadButton.addEventListener("click", () => {
    downloadAttachmentFile(attachment);
  });
  zoomOutButton.addEventListener("click", () => {
    setScale(scale - 0.2);
  });
  zoomInButton.addEventListener("click", () => {
    setScale(scale + 0.2);
  });
  resetButton.addEventListener("click", resetTransform);
  viewport.addEventListener(
    "wheel",
    (event) => {
      if (!isPreviewReady) {
        return;
      }

      if (isDocument && !event.ctrlKey) {
        return;
      }

      event.preventDefault();
      setScale(scale + (event.deltaY < 0 ? 0.18 : -0.18));
    },
    { passive: false },
  );
  viewport.addEventListener("dblclick", () => {
    if (!isPreviewReady) {
      return;
    }

    setScale(scale === 1 ? 2 : 1);
  });
  viewport.addEventListener("pointerdown", (event) => {
    if (!isPreviewReady) {
      return;
    }

    isDragging = true;
    pointerId = event.pointerId;
    dragStartX = event.clientX - offsetX;
    dragStartY = event.clientY - offsetY;
    viewport.setPointerCapture(event.pointerId);
    applyTransform();
  });
  viewport.addEventListener("pointermove", (event) => {
    if (
      !isDragging ||
      event.pointerId !== pointerId ||
      (scale === 1 && !isDocument)
    ) {
      return;
    }

    offsetX = event.clientX - dragStartX;
    offsetY = event.clientY - dragStartY;
    applyTransform();
  });
  viewport.addEventListener("pointerup", (event) => {
    if (pointerId === event.pointerId) {
      stopDragging();
    }
  });
  viewport.addEventListener("pointercancel", stopDragging);
  viewport.addEventListener("lostpointercapture", stopDragging);

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      closeViewer();
      return;
    }

    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      setScale(scale + 0.2);
      return;
    }

    if (event.key === "-") {
      event.preventDefault();
      setScale(scale - 0.2);
      return;
    }

    if (event.key === "0") {
      event.preventDefault();
      resetTransform();
    }
  };

  document.addEventListener("keydown", handleKeydown);
  overlay.__cleanupViewerHandlers = () => {
    isDestroyed = true;
    loadingTask?.destroy?.();
    document.removeEventListener("keydown", handleKeydown);
  };

  if (preview) {
    asset.append(preview);
  } else if (isDocument && attachment?.dataUrl) {
    const pdfStack = createElement("div", "attachment-viewer__pdf-stack");
    asset.append(pdfStack, loadingIndicator);

    loadPdfJs()
      .then(async (pdfjsLib) => {
        if (isDestroyed) {
          return;
        }

        loadingTask = pdfjsLib.getDocument({
          data: dataUrlToUint8Array(attachment.dataUrl),
        });
        const pdfDocument = await loadingTask.promise;
        const outputScale = window.devicePixelRatio || 1;

        for (
          let pageNumber = 1;
          pageNumber <= pdfDocument.numPages;
          pageNumber += 1
        ) {
          const page = await pdfDocument.getPage(pageNumber);

          if (isDestroyed) {
            return;
          }

          const pdfViewport = page.getViewport({ scale: 1.2 });
          const canvas = createElement("canvas", "attachment-viewer__pdf-page");
          const context = canvas.getContext("2d");

          if (!context) {
            throw new Error("Canvas context unavailable");
          }

          canvas.width = Math.floor(pdfViewport.width * outputScale);
          canvas.height = Math.floor(pdfViewport.height * outputScale);
          canvas.style.width = `${pdfViewport.width}px`;
          canvas.style.height = `${pdfViewport.height}px`;

          await page.render({
            canvasContext: context,
            viewport: pdfViewport,
            transform:
              outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
          }).promise;

          pdfStack.append(canvas);
        }

        loadingIndicator.remove();
        isPreviewReady = true;
        applyTransform();
      })
      .catch(() => {
        if (isDestroyed) {
          return;
        }

        asset.innerHTML = "";
        asset.append(fallback);
        isPreviewReady = true;
        applyTransform();
      });
  } else {
    asset.append(fallback);
    isPreviewReady = true;
  }

  topActions.append(downloadButton, closeButton);
  dock.append(zoomOutButton, resetButton, zoomInButton);
  stage.append(asset);
  viewport.append(stage);
  viewer.append(topActions, viewport, dock);
  overlay.append(backdrop, viewer);
  applyTransform();

  return overlay;
}

function createDrawerSelect(
  labelText,
  valueText,
  options,
  onChange,
  modifier = "",
) {
  const group = createElement(
    "div",
    `drawer-form__group${modifier ? ` ${modifier}` : ""}`,
  );
  const label = createElement("label", "drawer-form__label", labelText);
  const selectWrap = createElement("div", "drawer-form__select-wrap");
  const select = document.createElement("select");
  select.className = "drawer-form__native-select";

  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    optionElement.selected = option === valueText;
    select.append(optionElement);
  });

  select.addEventListener("change", (event) => {
    onChange(event.target.value);
  });

  selectWrap.append(select, createIcon("chevron-down"));
  group.append(label, selectWrap);

  return group;
}

function createTagSelector(state, onUpdate) {
  const group = createElement(
    "div",
    "drawer-form__group drawer-form__group--compact",
  );
  const label = createElement("label", "drawer-form__label", "Tag");
  const picker = createElement("div", "drawer-form__tag-picker");

  EVENT_TAG_OPTIONS.forEach((tag) => {
    const isActive = state.eventDraft.tag === tag;
    const tagButton = createElement(
      "button",
      `drawer-form__tag${isActive ? " is-active" : ""}`,
      tag,
    );
    const tagStyle = getEventTagStyle(tag);

    tagButton.type = "button";
    tagButton.style.setProperty("--tag-color", tagStyle.color);
    tagButton.style.setProperty("--tag-text-color", tagStyle.textColor);
    tagButton.setAttribute("aria-pressed", String(isActive));
    tagButton.addEventListener("click", () => {
      state.eventDraft.tag = tag;
      onUpdate();
    });

    picker.append(tagButton);
  });

  group.append(label, picker);

  return group;
}

function formatDateInput(dateString) {
  const date = new Date(dateString);
  const monthLabel = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;

  return `${monthLabel} ${day}, ${year} - ${normalizedHours}:${minutes} ${period}`;
}

function getDraftDatePart(value) {
  return value.split("T")[0];
}

function getDraftTimePart(value) {
  return value.split("T")[1] ?? "00:00";
}

function isDraftDateRangeValid(startValue, endValue) {
  return new Date(endValue) > new Date(startValue);
}

function addMinutesToDateTimeValue(dateTimeValue, minutesToAdd) {
  const nextDate = new Date(dateTimeValue);
  nextDate.setMinutes(nextDate.getMinutes() + minutesToAdd);
  return formatDateTimeLocalValue(nextDate);
}

function formatTime(date) {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function updateDraftDateTime(state, field, dateValue, timeValue) {
  state.eventDraft[field] = `${dateValue}T${timeValue}`;
}

function buildTimeOptions() {
  const options = [];

  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 15) {
      options.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      );
    }
  }

  return options;
}

function parseTimeToken(value) {
  const normalized = value.trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/);

  if (!match) {
    return null;
  }

  let [, hours, minutes, period] = match;
  let hourValue = Number(hours);

  if (period) {
    if (period === "PM" && hourValue !== 12) {
      hourValue += 12;
    }

    if (period === "AM" && hourValue === 12) {
      hourValue = 0;
    }
  }

  return {
    hours: hourValue,
    minutes: Number(minutes),
  };
}

function formatMinutesAsTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;

  return `${normalizedHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

function parseEventSchedule(meta = "") {
  const [timeRange = "", location = ""] = meta
    .split("|")
    .map((value) => value.trim());

  if (timeRange.toLowerCase() === "all day") {
    return {
      startMinutes: 0,
      endMinutes: 1440,
      label: "All day",
      location,
      isAllDay: true,
    };
  }

  const [rawStart = "", rawEnd = ""] = timeRange
    .split("-")
    .map((value) => value.trim());
  const start = parseTimeToken(rawStart);
  const end = parseTimeToken(rawEnd);
  const startMinutes = start ? start.hours * 60 + start.minutes : 9 * 60;
  const endMinutes = end ? end.hours * 60 + end.minutes : startMinutes + 60;

  return {
    startMinutes,
    endMinutes,
    label: `${formatMinutesAsTime(startMinutes)} – ${formatMinutesAsTime(endMinutes)}`,
    location,
    isAllDay: false,
  };
}

function getSelectedCalendarDate(state) {
  return new Date(
    state.calendar.displayYear,
    state.calendar.displayMonth,
    state.calendar.selectedDay,
  );
}

function getWeekDates(selectedDate) {
  const start = new Date(selectedDate);
  start.setDate(selectedDate.getDate() - selectedDate.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function getEventsForDate(activeApp, date) {
  return activeApp.events.filter((event) => {
    return (
      event.year === date.getFullYear() &&
      event.monthIndex === date.getMonth() &&
      Number(event.day) === date.getDate()
    );
  });
}

function syncCalendarToDate(state, activeApp, date) {
  state.calendar.displayYear = date.getFullYear();
  state.calendar.displayMonth = date.getMonth();
  state.calendar.selectedDay = date.getDate();
  state.calendar.selectedEventId =
    getEventsForDate(activeApp, date)[0]?.id ?? null;
}

function getEventSurfaceColor(event) {
  const primaryTag = getEventPrimaryTag(event);
  return getEventTagStyle(primaryTag).color;
}

function getEventTagStyle(tag) {
  return EVENT_TAG_STYLES[tag] ?? EVENT_TAG_STYLES.Event;
}

function getNormalizedEventTag(event) {
  if (typeof event.tag === "string" && event.tag.trim()) {
    return event.tag.trim();
  }

  if (Array.isArray(event.tags) && event.tags.length > 0) {
    return event.tags.find(Boolean) ?? "Event";
  }

  if (/training/i.test(event.title)) {
    return "Training";
  }

  if (/townhall/i.test(event.title)) {
    return "Townhall";
  }

  if (/meeting|kickoff/i.test(event.title)) {
    return "Meeting";
  }

  return "Event";
}

function getEventPrimaryTag(event) {
  return getNormalizedEventTag(event);
}

function createNativeSelect(
  options,
  value,
  onChange,
  className = "drawer-form__native-select",
) {
  const select = document.createElement("select");
  select.className = className;

  options.forEach((option) => {
    const optionElement = document.createElement("option");
    const normalizedOption =
      typeof option === "string" ? { value: option, label: option } : option;

    optionElement.value = normalizedOption.value;
    optionElement.textContent = normalizedOption.label;
    optionElement.selected = normalizedOption.value === value;
    select.append(optionElement);
  });

  select.addEventListener("change", (event) => {
    onChange(event.target.value);
  });

  return select;
}

function createSectionLabel(iconName, text) {
  const label = createElement("div", "drawer-form__section-label");
  const icon = createElement("span", "drawer-form__section-icon");
  const copy = createElement("span", "drawer-form__section-text", text);

  icon.append(createIcon(iconName));
  label.append(icon, copy);

  return label;
}

function formatDrawerDateLabel(value) {
  const date = new Date(value);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = MONTH_NAMES[date.getMonth()];

  return `${weekday}, ${month} ${date.getDate()}`;
}

function buildEventFromDraft(state) {
  const startDate = new Date(state.eventDraft.start);
  const endDate = new Date(state.eventDraft.end);
  const startTime = formatTime(state.eventDraft.start);
  const endTime = formatTime(state.eventDraft.end);
  const locationLabel = state.eventDraft.location.trim() || "No location set";
  const primaryTag = state.eventDraft.tag || "Event";
  const isAllDay = state.eventDraft.isAllDay;

  // Create events for each day in the range
  const events = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  const endDateTime = new Date(endDate);
  endDateTime.setHours(23, 59, 59, 999);

  const baseId = Date.now();

  while (currentDate <= endDateTime) {
    const isStartDay = currentDate.toDateString() === startDate.toDateString();
    const isEndDay = currentDate.toDateString() === endDate.toDateString();

    let displayStartTime = startTime;
    let displayEndTime = endTime;

    if (isAllDay) {
      displayStartTime = "All day";
      displayEndTime = "";
    } else if (!isStartDay && !isEndDay) {
      displayStartTime = "00:00";
      displayEndTime = "23:59";
    } else if (isStartDay && !isEndDay) {
      displayEndTime = "23:59";
    } else if (!isStartDay && isEndDay) {
      displayStartTime = "00:00";
    }

    const metaLabel = isAllDay
      ? `All day | ${locationLabel}`
      : `${displayStartTime} - ${displayEndTime} | ${locationLabel}`;

    events.push({
      id: `calendar-event-${baseId}-${events.length}`,
      day: String(currentDate.getDate()).padStart(2, "0"),
      monthIndex: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      monthLabel: MONTH_NAMES[currentDate.getMonth()].slice(0, 3).toUpperCase(),
      title: state.eventDraft.title.trim(),
      color: getEventTagStyle(primaryTag).color,
      meta: metaLabel,
      start: state.eventDraft.start,
      end: state.eventDraft.end,
      isAllDay: isAllDay,
      location: state.eventDraft.location.trim(),
      description: state.eventDraft.description,
      participants: [...state.eventDraft.participants],
      reminders: state.eventDraft.reminders.map((reminder) => ({
        ...reminder,
      })),
      attachments: state.eventDraft.attachments.map((attachment) => ({
        ...attachment,
      })),
      tag: primaryTag,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return events;
}

function isDraftValid(draft) {
  if (!draft.title.trim() || !draft.start || !draft.end) {
    return false;
  }

  return isDraftDateRangeValid(draft.start, draft.end);
}

function isUserDraftValid(draft) {
  if (!draft.name?.trim()) {
    return false;
  }
  if (!draft.email?.trim() || !draft.email.includes('@')) {
    return false;
  }
  if (!draft.department) {
    return false;
  }
  if (!draft.position?.trim()) {
    return false;
  }
  // Password validation
  if (!draft.password || draft.password.length < 6) {
    return false;
  }
  if (draft.password !== draft.confirmPassword) {
    return false;
  }
  return true;
}

function sortCalendarEvents(events) {
  events.sort((left, right) => {
    const leftDate = new Date(left.year, left.monthIndex, Number(left.day));
    const rightDate = new Date(right.year, right.monthIndex, Number(right.day));

    return leftDate - rightDate;
  });
}

function normalizeDescriptionHtml(html) {
  const trimmed = html.trim();

  if (!trimmed || trimmed === "<br>" || trimmed === "<div><br></div>") {
    return "";
  }

  return html;
}

function linkifyElement(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  const urlPattern = /(https?:\/\/[^\s<]+)/gi;

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (node.parentElement?.closest("a")) {
      continue;
    }

    if (urlPattern.test(node.textContent ?? "")) {
      textNodes.push(node);
    }

    urlPattern.lastIndex = 0;
  }

  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    const text = node.textContent ?? "";
    let lastIndex = 0;

    text.replace(urlPattern, (match, _value, offset) => {
      if (offset > lastIndex) {
        fragment.append(document.createTextNode(text.slice(lastIndex, offset)));
      }

      const link = document.createElement("a");
      link.href = match;
      link.textContent = match;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      link.className = "drawer-detail__link";
      fragment.append(link);
      lastIndex = offset + match.length;
      return match;
    });

    if (lastIndex < text.length) {
      fragment.append(document.createTextNode(text.slice(lastIndex)));
    }

    node.parentNode?.replaceChild(fragment, node);
  });
}

function syncRichTextValue(editor, onChange) {
  onChange(normalizeDescriptionHtml(editor.innerHTML));
}

function applyRichTextCommand(editor, command, value, onChange) {
  editor.focus();
  document.execCommand(command, false, value);
  syncRichTextValue(editor, onChange);
}

function insertPlainTextAtCursor(text) {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);

  range.deleteContents();
  range.insertNode(document.createTextNode(text));
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function createEventDrawer(state, closeDrawer, onSave, isOpen = false) {
  const overlay = createElement(
    "div",
    `event-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "event-drawer-overlay__backdrop");
  const drawer = createElement("aside", "event-drawer");
  const header = createElement("div", "event-drawer__header");
  const headerLeft = createElement("div", "event-drawer__header-left");
  const backButton = createElement("button", "event-drawer__back");
  const title = createElement("h2", "event-drawer__title", "New Event");
  const closeButton = createElement("button", "event-drawer__close");
  const body = createElement("div", "event-drawer__body");
  const participantOptions = getUserManagementApp()?.users ?? [];
  const visibleParticipantLimit = 2;

  overlay.setAttribute("aria-hidden", String(!state.isEventDrawerOpen));
  drawer.setAttribute("aria-label", "New event drawer");
  backdrop.type = "button";
  backButton.type = "button";
  closeButton.type = "button";
  backButton.append(createIcon("chevron-left"));
  closeButton.append(createIcon("close"));
  backdrop.addEventListener("click", closeDrawer);
  backButton.addEventListener("click", closeDrawer);
  closeButton.addEventListener("click", closeDrawer);

  const titleGroup = createElement("div", "drawer-form__group");
  const titleLabel = createElement("div", "drawer-form__title-label");
  const titleStatus = createElement("span", "drawer-form__title-status");
  const titleInput = createElement("input", "drawer-form__title-input");
  titleStatus.style.setProperty(
    "--title-color",
    getEventTagStyle(state.eventDraft.tag ?? "Event").color,
  );
  titleInput.type = "text";
  titleInput.value = state.eventDraft.title;
  titleInput.placeholder = "Enter event title";
  titleInput.addEventListener("input", (event) => {
    state.eventDraft.title = event.target.value;
  });
  titleLabel.append(titleStatus, titleInput);

  titleGroup.append(titleLabel);

  const scheduleGroup = createElement("div", "drawer-form__group");
  const scheduleLabel = createSectionLabel("calendar", "Date & Time");

  const allDayRow = createElement("div", "drawer-form__all-day-row");

  // Format date as DD/MM/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format time as HH:MM
  const formatTime = (date) => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const allDayLabel = createElement(
    "span",
    "drawer-form__all-day-label",
    "All day",
  );
  const allDayToggleLabel = createElement("label", "switch");
  const allDayToggleInput = document.createElement("input");
  allDayToggleInput.type = "checkbox";
  allDayToggleInput.checked = state.eventDraft.isAllDay;
  allDayToggleInput.addEventListener("change", () => {
    state.eventDraft.isAllDay = allDayToggleInput.checked;
    renderDrawer();
  });
  const allDayToggleSpan = createElement("span", "slider");
  allDayToggleLabel.append(allDayToggleInput, allDayToggleSpan);
  allDayRow.append(allDayToggleLabel, allDayLabel);

  // Date input row
  const dateRow = createElement("div", "drawer-form__datetime-inputs");
  const dateWrap = createElement("div", "drawer-form__input-wrap");
  const dateIcon = createIcon("calendar");

  const startDateDisplay = createElement(
    "span",
    "drawer-form__datetime-display",
    formatDate(state.eventDraft.start),
  );
  const endDateDisplay = createElement(
    "span",
    "drawer-form__datetime-display",
    formatDate(state.eventDraft.end),
  );
  const dateSeparator = createElement(
    "span",
    "drawer-form__datetime-separator",
    " - ",
  );

  const startDateInput = document.createElement("input");
  startDateInput.type = "date";
  startDateInput.className = "drawer-form__date-input";
  startDateInput.value = getDraftDatePart(state.eventDraft.start);
  const endDateInput = document.createElement("input");
  endDateInput.type = "date";
  endDateInput.className = "drawer-form__date-input";
  endDateInput.value = getDraftDatePart(state.eventDraft.end);

  const handleDateChange = () => {
    updateDraftDateTime(
      state,
      "start",
      startDateInput.value,
      getDraftTimePart(state.eventDraft.start),
    );
    updateDraftDateTime(
      state,
      "end",
      endDateInput.value,
      getDraftTimePart(state.eventDraft.end),
    );

    if (!isDraftDateRangeValid(state.eventDraft.start, state.eventDraft.end)) {
      state.eventDraft.end = addMinutesToDateTimeValue(
        state.eventDraft.start,
        60,
      );
    }
    renderDrawer();
  };

  startDateInput.addEventListener("change", handleDateChange);
  endDateInput.addEventListener("change", handleDateChange);

  startDateDisplay.addEventListener("click", () => startDateInput.showPicker());
  endDateDisplay.addEventListener("click", () => endDateInput.showPicker());

  dateWrap.append(
    dateIcon,
    startDateDisplay,
    dateSeparator,
    endDateDisplay,
    startDateInput,
    endDateInput,
  );
  dateRow.append(dateWrap);

  // Time input row
  const timeRow = createElement(
    "div",
    `drawer-form__datetime-inputs${state.eventDraft.isAllDay ? " is-hidden" : ""}`,
  );
  const timeWrap = createElement("div", "drawer-form__input-wrap");
  const timeIcon = createIcon("clock");

  const startTimeDisplay = createElement(
    "span",
    "drawer-form__datetime-display",
    formatTime(state.eventDraft.start),
  );
  const endTimeDisplay = createElement(
    "span",
    "drawer-form__datetime-display",
    formatTime(state.eventDraft.end),
  );
  const timeSeparator = createElement(
    "span",
    "drawer-form__datetime-separator",
    " - ",
  );

  const startTimeInput = document.createElement("input");
  startTimeInput.type = "time";
  startTimeInput.className = "drawer-form__time-input";
  startTimeInput.step = "900";
  startTimeInput.value = getDraftTimePart(state.eventDraft.start);
  startTimeInput.max = getDraftTimePart(
    addMinutesToDateTimeValue(state.eventDraft.end, -15),
  );
  const endTimeInput = document.createElement("input");
  endTimeInput.type = "time";
  endTimeInput.className = "drawer-form__time-input";
  endTimeInput.step = "900";
  endTimeInput.value = getDraftTimePart(state.eventDraft.end);
  endTimeInput.min = getDraftTimePart(
    addMinutesToDateTimeValue(state.eventDraft.start, 15),
  );

  const handleTimeChange = () => {
    updateDraftDateTime(
      state,
      "start",
      getDraftDatePart(state.eventDraft.start),
      startTimeInput.value,
    );
    updateDraftDateTime(
      state,
      "end",
      getDraftDatePart(state.eventDraft.end),
      endTimeInput.value,
    );
    renderDrawer();
  };

  startTimeInput.addEventListener("input", handleTimeChange);
  endTimeInput.addEventListener("input", handleTimeChange);

  startTimeDisplay.addEventListener("click", () => startTimeInput.showPicker());
  endTimeDisplay.addEventListener("click", () => endTimeInput.showPicker());

  timeWrap.append(
    timeIcon,
    startTimeDisplay,
    timeSeparator,
    endTimeDisplay,
    startTimeInput,
    endTimeInput,
  );
  timeRow.append(timeWrap);

  scheduleGroup.append(scheduleLabel, allDayRow, dateRow, timeRow);

  const participantsGroup = createElement("div", "drawer-form__group");
  const participantsLabel = createSectionLabel("users", "Participants");
  const participantsField = createElement(
    "div",
    "drawer-form__participant-field",
  );
  const participantsInput = createElement("input", "drawer-form__input");
  const selectedParticipants = createElement(
    "div",
    "drawer-form__participants",
  );
  const participantSuggestions = createElement(
    "div",
    "drawer-form__participant-suggestions",
  );
  const normalizedQuery = state.eventDraft.participantQuery
    .trim()
    .toLowerCase();
  const selectedParticipantUsers = state.eventDraft.participants
    .map((participantId) =>
      participantOptions.find((user) => user.id === participantId),
    )
    .filter(Boolean);
  const visibleParticipants = selectedParticipantUsers.slice(
    0,
    visibleParticipantLimit,
  );
  const hiddenParticipantCount = Math.max(
    selectedParticipantUsers.length - visibleParticipantLimit,
    0,
  );
  const allParticipantsSelected =
    participantOptions.length > 0 &&
    state.eventDraft.participants.length === participantOptions.length;
  const filteredParticipants = participantOptions.filter((user) => {
    const alreadySelected = state.eventDraft.participants.includes(user.id);

    if (alreadySelected || !normalizedQuery) {
      return false;
    }

    return (
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery)
    );
  });

  participantsInput.type = "text";
  participantsInput.value = state.eventDraft.participantQuery;
  participantsInput.placeholder = "Type name or email...";
  participantsInput.addEventListener("input", (event) => {
    state.eventDraft.participantQuery = event.target.value;
    state.eventDraft.isParticipantPopupOpen = false;
    renderDrawer({ focusParticipantInput: true });
  });
  participantsInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && filteredParticipants.length > 0) {
      event.preventDefault();
      state.eventDraft.participants = [
        ...state.eventDraft.participants,
        filteredParticipants[0].id,
      ];
      state.eventDraft.participantQuery = "";
      state.eventDraft.isParticipantPopupOpen = false;
      renderDrawer({ focusParticipantInput: true });
    }
  });

  const allParticipantsButton = createElement(
    "button",
    `drawer-form__participant-all${allParticipantsSelected ? " is-active" : ""}`,
    allParticipantsSelected
      ? "All Participants Selected"
      : "Select All Participants",
  );
  allParticipantsButton.type = "button";
  allParticipantsButton.addEventListener("click", () => {
    state.eventDraft.participants = allParticipantsSelected
      ? []
      : participantOptions.map((user) => user.id);
    state.eventDraft.participantQuery = "";
    state.eventDraft.isParticipantPopupOpen = false;
    renderDrawer({ focusParticipantInput: true });
  });

  visibleParticipants.forEach((participant) => {
    const chip = createElement("button", "drawer-form__participant-chip");
    const avatar = createElement(
      "span",
      "drawer-form__participant-avatar",
      participant.name.slice(0, 1),
    );
    const name = createElement(
      "span",
      "drawer-form__participant-name",
      participant.name,
    );
    const remove = createElement("span", "drawer-form__participant-remove");

    chip.type = "button";
    remove.append(createIcon("close"));
    chip.addEventListener("click", () => {
      state.eventDraft.participants = state.eventDraft.participants.filter(
        (id) => id !== participant.id,
      );
      state.eventDraft.isParticipantPopupOpen = false;
      renderDrawer({ focusParticipantInput: true });
    });
    chip.append(avatar, name, remove);
    selectedParticipants.append(chip);
  });

  if (hiddenParticipantCount > 0) {
    const moreButton = createElement(
      "button",
      "drawer-form__participant-more",
      `+${hiddenParticipantCount} more`,
    );

    moreButton.type = "button";
    moreButton.addEventListener("click", () => {
      state.eventDraft.isParticipantPopupOpen = true;
      renderDrawer();
    });
    selectedParticipants.append(moreButton);
  }

  filteredParticipants.slice(0, 5).forEach((participant) => {
    const optionButton = createElement(
      "button",
      "drawer-form__participant-option",
    );
    const info = createElement("div", "drawer-form__participant-option-copy");
    const name = createElement(
      "strong",
      "drawer-form__participant-option-name",
      participant.name,
    );
    const meta = createElement(
      "span",
      "drawer-form__participant-option-meta",
      `${participant.role} | ${participant.email}`,
    );

    optionButton.type = "button";
    optionButton.addEventListener("click", () => {
      state.eventDraft.participants = [
        ...state.eventDraft.participants,
        participant.id,
      ];
      state.eventDraft.participantQuery = "";
      state.eventDraft.isParticipantPopupOpen = false;
      renderDrawer({ focusParticipantInput: true });
    });
    info.append(name, meta);
    optionButton.append(
      createElement(
        "span",
        "drawer-form__participant-avatar drawer-form__participant-avatar--option",
        participant.name.slice(0, 1),
      ),
      info,
    );
    participantSuggestions.append(optionButton);
  });

  participantsField.append(participantsInput);

  if (filteredParticipants.length > 0) {
    participantsField.append(participantSuggestions);
  } else if (normalizedQuery) {
    const emptyState = createElement(
      "p",
      "drawer-form__participant-empty",
      "No matching users found.",
    );
    participantsField.append(emptyState);
  }

  participantsGroup.append(
    participantsLabel,
    participantsField,
    allParticipantsButton,
  );

  if (selectedParticipantUsers.length > 0) {
    participantsGroup.append(selectedParticipants);
  }

  const locationGroup = createElement("div", "drawer-form__group");
  const locationLabel = createSectionLabel("location", "Location");
  const locationInput = createElement("input", "drawer-form__input");
  locationInput.type = "text";
  locationInput.value = state.eventDraft.location;
  locationInput.placeholder = "Office, room, venue, or on-site location";
  locationInput.addEventListener("input", (event) => {
    state.eventDraft.location = event.target.value;
  });
  locationGroup.append(locationLabel, locationInput);

  const descriptionGroup = createElement("div", "drawer-form__group");
  const descriptionLabel = createSectionLabel("description", "Description");
  const descriptionEditor = createElement("div", "drawer-form__editor");
  const descriptionToolbar = createElement("div", "drawer-form__toolbar");
  const descriptionInput = createElement("div", "drawer-form__editable");

  descriptionInput.contentEditable = "true";
  descriptionInput.dataset.placeholder =
    "Add a short description or paste the meeting link here...";
  descriptionInput.innerHTML = state.eventDraft.description;
  descriptionInput.addEventListener("input", () => {
    syncRichTextValue(descriptionInput, (value) => {
      state.eventDraft.description = value;
    });
  });
  descriptionInput.addEventListener("paste", (event) => {
    event.preventDefault();

    const clipboard = event.clipboardData || window.clipboardData;
    const pastedText = clipboard?.getData("text/plain") ?? "";

    insertPlainTextAtCursor(pastedText);
    syncRichTextValue(descriptionInput, (value) => {
      state.eventDraft.description = value;
    });
  });

  [
    {
      icon: "bold",
      label: "Bold",
      command: "bold",
    },
    {
      icon: "italic",
      label: "Italic",
      command: "italic",
    },
    {
      icon: "underline",
      label: "Underline",
      command: "underline",
    },
    {
      icon: "strikethrough",
      label: "Strikethrough",
      command: "strikeThrough",
    },
    {
      icon: "list-numbers",
      label: "Numbered list",
      command: "insertOrderedList",
    },
    {
      icon: "list-bullets",
      label: "Bulleted list",
      command: "insertUnorderedList",
    },
    {
      icon: "eraser",
      label: "Clear formatting",
      command: "removeFormat",
    },
  ].forEach((tool) => {
    const toolButton = createElement("button", "drawer-form__tool");

    toolButton.type = "button";
    toolButton.setAttribute("aria-label", tool.label);
    toolButton.title = tool.label;
    toolButton.append(createIcon(tool.icon));
    toolButton.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });
    toolButton.addEventListener("click", () => {
      applyRichTextCommand(descriptionInput, tool.command, null, (value) => {
        state.eventDraft.description = value;
      });
    });
    descriptionToolbar.append(toolButton);
  });

  descriptionEditor.append(descriptionToolbar, descriptionInput);
  descriptionGroup.append(descriptionLabel, descriptionEditor);

  const reminderGroup = createElement(
    "div",
    "drawer-form__group drawer-form__group--compact",
  );
  const reminderLabel = createSectionLabel("reminder", "Reminder");
  const reminderList = createElement("div", "drawer-form__reminders");
  const addReminderButton = createElement(
    "button",
    "drawer-form__reminder-add",
  );
  addReminderButton.type = "button";
  addReminderButton.append(
    createIcon("reminder"),
    createElement("span", "", "Add reminders"),
  );
  addReminderButton.addEventListener("click", () => {
    state.eventDraft.reminders = [
      ...state.eventDraft.reminders,
      {
        id: `reminder-${Date.now()}`,
        method: "Email",
        relation: "before",
        amount: "5 mins",
      },
    ];
    renderDrawer();
  });

  if (state.eventDraft.reminders.length === 0) {
    reminderList.append(addReminderButton);
  } else {
    state.eventDraft.reminders.forEach((reminder) => {
      const row = createElement("div", "drawer-form__reminder-row");
      const methodWrap = createElement(
        "div",
        "drawer-form__select-wrap drawer-form__select-wrap--compact",
      );
      const relationWrap = createElement(
        "div",
        "drawer-form__select-wrap drawer-form__select-wrap--compact",
      );
      const amountWrap = createElement(
        "div",
        "drawer-form__select-wrap drawer-form__select-wrap--compact",
      );
      const deleteButton = createElement(
        "button",
        "drawer-form__reminder-delete",
      );

      deleteButton.type = "button";
      deleteButton.setAttribute("aria-label", "Remove reminder");
      deleteButton.append(createIcon("trash"));
      deleteButton.addEventListener("click", () => {
        state.eventDraft.reminders = state.eventDraft.reminders.filter(
          (item) => item.id !== reminder.id,
        );
        renderDrawer();
      });

      methodWrap.append(
        createNativeSelect(
          ["Email", "Popup", "Notification"],
          reminder.method,
          (value) => {
            reminder.method = value;
          },
          "drawer-form__native-select drawer-form__native-select--compact",
        ),
        createIcon("chevron-down"),
      );
      relationWrap.append(
        createNativeSelect(
          [{ value: "before", label: "before" }],
          reminder.relation,
          (value) => {
            reminder.relation = value;
          },
          "drawer-form__native-select drawer-form__native-select--compact",
        ),
        createIcon("chevron-down"),
      );
      amountWrap.append(
        createNativeSelect(
          ["5 mins", "10 mins", "30 mins", "1 hour", "1 day"],
          reminder.amount,
          (value) => {
            reminder.amount = value;
          },
          "drawer-form__native-select drawer-form__native-select--compact",
        ),
        createIcon("chevron-down"),
      );

      row.append(methodWrap, relationWrap, amountWrap, deleteButton);
      reminderList.append(row);
    });

    const addAnotherReminder = createElement(
      "button",
      "drawer-form__reminder-link",
      "Add another reminder",
    );
    addAnotherReminder.type = "button";
    addAnotherReminder.addEventListener("click", () => {
      state.eventDraft.reminders = [
        ...state.eventDraft.reminders,
        {
          id: `reminder-${Date.now()}`,
          method: "Email",
          relation: "before",
          amount: "5 mins",
        },
      ];
      renderDrawer();
    });
    reminderList.append(addAnotherReminder);
  }
  reminderGroup.append(reminderLabel, reminderList);

  const attachmentGroup = createElement(
    "div",
    "drawer-form__group drawer-form__group--compact",
  );
  const attachmentLabel = createSectionLabel("attachment", "Attachment");
  const attachmentField = createElement("label", "drawer-form__attachment");
  const attachmentInput = document.createElement("input");
  const attachmentIcon = createIcon("attachment");
  const attachmentCopy = createElement(
    "span",
    "drawer-form__attachment-copy",
    state.eventDraft.attachments.length > 0
      ? `${state.eventDraft.attachments.length} file selected`
      : "Upload file(s)",
  );
  const attachmentList = createElement("div", "drawer-form__attachment-list");

  attachmentInput.type = "file";
  attachmentInput.multiple = true;
  attachmentInput.className = "drawer-form__attachment-input";
  attachmentInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      attachmentInput.value = "";
      renderDrawer();
      return;
    }

    let pendingFiles = files.length;
    const existingAttachments = [...state.eventDraft.attachments];
    const nextAttachments = [];

    files.forEach((file) => {
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
          nextAttachments.push({
            name: file.name,
            type: file.type,
            dataUrl: typeof reader.result === "string" ? reader.result : "",
          });
          pendingFiles -= 1;

          if (pendingFiles === 0) {
            state.eventDraft.attachments = [
              ...existingAttachments,
              ...nextAttachments,
            ];
            attachmentInput.value = "";
            renderDrawer();
          }
        });
        reader.readAsDataURL(file);
        return;
      }

      nextAttachments.push({
        name: file.name,
        type: file.type,
        dataUrl: "",
      });
      pendingFiles -= 1;

      if (pendingFiles === 0) {
        state.eventDraft.attachments = [
          ...existingAttachments,
          ...nextAttachments,
        ];
        attachmentInput.value = "";
        renderDrawer();
      }
    });
  });

  if (state.eventDraft.attachments.length > 0) {
    state.eventDraft.attachments.forEach((attachment, index) => {
      const attachmentCard = createElement(
        "div",
        "drawer-form__attachment-preview",
      );
      const attachmentHeader = createElement(
        "div",
        "drawer-form__attachment-preview-head",
      );
      const attachmentName = createElement(
        "span",
        "drawer-form__attachment-chip-name",
        attachment.name,
      );
      const removeButton = createElement(
        "button",
        "drawer-form__attachment-chip-remove",
      );
      const preview = createAttachmentPreview(attachment);

      removeButton.type = "button";
      removeButton.setAttribute("aria-label", `Remove ${attachment.name}`);
      removeButton.append(createIcon("close"));
      removeButton.addEventListener("click", () => {
        state.eventDraft.attachments = state.eventDraft.attachments.filter(
          (_, attachmentIndex) => attachmentIndex !== index,
        );
        renderDrawer();
      });
      attachmentHeader.append(attachmentName, removeButton);
      attachmentCard.append(attachmentHeader);

      if (preview) {
        preview.classList.add("drawer-form__attachment-preview-media");
        attachmentCard.append(preview);
      } else {
        attachmentCard.append(
          createElement(
            "div",
            "drawer-form__attachment-preview-fallback",
            "Preview available for image and PDF files.",
          ),
        );
      }

      attachmentList.append(attachmentCard);
    });
  }

  attachmentField.append(attachmentInput, attachmentIcon, attachmentCopy);
  attachmentGroup.append(attachmentLabel, attachmentField, attachmentList);

  const tagsGroup = createTagSelector(state, renderDrawer);
  const footer = createElement("div", "event-drawer__footer");
  const footerLeft = createElement("div", "event-drawer__footer-actions");
  const cancelButton = createElement(
    "button",
    "event-drawer__button event-drawer__button--ghost",
    "Cancel",
  );
  const saveButton = createElement(
    "button",
    "event-drawer__button event-drawer__button--primary",
    "Save",
  );
  const saveEnabled = isDraftValid(state.eventDraft);
  cancelButton.type = "button";
  saveButton.type = "button";
  saveButton.disabled = !saveEnabled;
  cancelButton.addEventListener("click", closeDrawer);
  saveButton.addEventListener("click", () => {
    if (!isDraftValid(state.eventDraft)) {
      return;
    }

    onSave();
  });
  footerLeft.append(saveButton, cancelButton);
  footer.append(footerLeft);

  headerLeft.append(backButton, title);
  header.append(headerLeft, closeButton);
  body.append(
    titleGroup,
    tagsGroup,
    scheduleGroup,
    participantsGroup,
    locationGroup,
    descriptionGroup,
    attachmentGroup,
    reminderGroup,
  );
  drawer.append(header, body, footer);
  overlay.append(backdrop, drawer);

  if (
    state.eventDraft.isParticipantPopupOpen &&
    selectedParticipantUsers.length > 0
  ) {
    const popupBackdrop = createElement("button", "drawer-popup__backdrop");
    const popup = createElement("div", "drawer-popup");
    const popupHeader = createElement("div", "drawer-popup__header");
    const popupTitle = createElement(
      "h3",
      "drawer-popup__title",
      "All Participants",
    );
    const popupClose = createElement("button", "drawer-popup__close");
    const popupList = createElement("div", "drawer-popup__list");

    popupBackdrop.type = "button";
    popupClose.type = "button";
    popupClose.append(createIcon("close"));
    popupBackdrop.addEventListener("click", () => {
      state.eventDraft.isParticipantPopupOpen = false;
      renderDrawer({ focusParticipantInput: true });
    });
    popupClose.addEventListener("click", () => {
      state.eventDraft.isParticipantPopupOpen = false;
      renderDrawer({ focusParticipantInput: true });
    });

    selectedParticipantUsers.forEach((participant) => {
      const item = createElement("div", "drawer-popup__item");
      const identity = createElement("div", "drawer-popup__identity");
      const avatar = createElement(
        "span",
        "drawer-form__participant-avatar",
        participant.name.slice(0, 1),
      );
      const copy = createElement("div", "drawer-popup__copy");
      const name = createElement(
        "strong",
        "drawer-popup__name",
        participant.name,
      );
      const email = createElement(
        "span",
        "drawer-popup__email",
        participant.email,
      );
      const remove = createElement("button", "drawer-popup__remove", "Remove");

      remove.type = "button";
      remove.addEventListener("click", () => {
        state.eventDraft.participants = state.eventDraft.participants.filter(
          (id) => id !== participant.id,
        );
        state.eventDraft.isParticipantPopupOpen =
          state.eventDraft.participants.length > visibleParticipantLimit;
        renderDrawer({ focusParticipantInput: true });
      });

      copy.append(name, email);
      identity.append(avatar, copy);
      item.append(identity, remove);
      popupList.append(item);
    });

    popupHeader.append(popupTitle, popupClose);
    popup.append(popupHeader, popupList);
    drawer.append(popupBackdrop, popup);
  }

  function renderDrawer(options = {}) {
    overlay.__cleanupOutsideHandler?.();
    const nextOverlay = createEventDrawer(state, closeDrawer, onSave, true);
    overlay.replaceWith(nextOverlay);

    if (options.focusParticipantInput) {
      requestAnimationFrame(() => {
        const nextInput = nextOverlay.querySelector(
          ".drawer-form__participant-field .drawer-form__input",
        );

        if (!nextInput) {
          return;
        }

        nextInput.focus();
        const cursorPosition = nextInput.value.length;
        nextInput.setSelectionRange(cursorPosition, cursorPosition);
      });
    }
  }

  const handleOutsidePointerDown = (event) => {
    if (!overlay.isConnected) {
      return;
    }

    if (!(event.target instanceof Node) || !drawer.contains(event.target)) {
      return;
    }

    let shouldRender = false;

    if (
      state.eventDraft.isDatePickerOpen &&
      !dateField.contains(event.target)
    ) {
      state.eventDraft.isDatePickerOpen = false;
      shouldRender = true;
    }

    if (
      state.eventDraft.openTimeField &&
      !startInputWrap.contains(event.target) &&
      !endInputWrap.contains(event.target)
    ) {
      state.eventDraft.openTimeField = null;
      shouldRender = true;
    }

    if (shouldRender) {
      renderDrawer();
    }
  };

  const cleanupOutsideHandler = () => {
    document.removeEventListener("pointerdown", handleOutsidePointerDown);
  };

  overlay.__cleanupOutsideHandler = cleanupOutsideHandler;
  requestAnimationFrame(() => {
    document.addEventListener("pointerdown", handleOutsidePointerDown);
  });

  return overlay;
}

function createEventDetailDrawer(
  activeApp,
  state,
  closeDrawer,
  openAttachmentViewer,
  isOpen = false,
) {
  const event = getCalendarEventById(activeApp, state.activeDrawerEventId);
  const overlay = createElement(
    "div",
    `event-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "event-drawer-overlay__backdrop");
  const drawer = createElement("aside", "event-drawer");
  const header = createElement("div", "event-drawer__header");
  const headerLeft = createElement("div", "event-drawer__header-left");
  const backButton = createElement("button", "event-drawer__back");
  const title = createElement(
    "h2",
    "event-drawer__title",
    event?.title ?? "Event Details",
  );
  const closeButton = createElement("button", "event-drawer__close");
  const body = createElement("div", "event-drawer__body");

  overlay.setAttribute("aria-hidden", String(!state.isEventDrawerOpen));
  drawer.setAttribute("aria-label", "Event detail drawer");
  backdrop.type = "button";
  backButton.type = "button";
  closeButton.type = "button";
  backButton.append(createIcon("chevron-left"));
  closeButton.append(createIcon("close"));
  backdrop.addEventListener("click", closeDrawer);
  backButton.addEventListener("click", closeDrawer);
  closeButton.addEventListener("click", closeDrawer);

  if (!event) {
    body.append(
      createElement("p", "calendar-surface__empty", "Event not found."),
    );
  } else {
    const participantOptions = getUserManagementApp()?.users ?? [];
    const schedule = parseEventSchedule(event.meta);
    const surface = createElement("section", "drawer-detail");
    const titleRow = createElement("div", "drawer-detail__title");
    const titleDot = createElement("span", "drawer-detail__dot");
    const titleCopy = createElement("div", "drawer-detail__title-copy");
    const titleText = createElement(
      "strong",
      "drawer-detail__title-text",
      event.title,
    );
    const metaGrid = createElement("div", "drawer-detail__meta-grid");
    const dateMeta = createElement("div", "drawer-detail__meta-item");
    const dateLabel = createSectionLabel("calendar", "Date");
    const dateValue = createElement(
      "span",
      "drawer-detail__meta-value",
      new Date(
        event.year,
        event.monthIndex,
        Number(event.day),
      ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
    const tagMeta = createElement("div", "drawer-detail__meta-item");
    const tagLabel = createSectionLabel("description", "Tag");
    const tagList = createElement("div", "drawer-detail__chips");
    const eventTag = getNormalizedEventTag(event);
    const tagStyle = getEventTagStyle(eventTag);
    const metaTagChip = createElement(
      "span",
      "drawer-detail__chip drawer-detail__chip--accent",
      eventTag,
    );

    titleDot.style.setProperty("--title-color", getEventSurfaceColor(event));
    metaTagChip.style.setProperty("--tag-color", tagStyle.color);
    metaTagChip.style.setProperty("--tag-text-color", tagStyle.textColor);
    tagList.append(metaTagChip);
    dateMeta.append(dateLabel, dateValue);
    tagMeta.append(tagLabel, tagList);
    metaGrid.append(dateMeta, tagMeta);
    titleCopy.append(titleText, metaGrid);
    titleRow.append(titleDot, titleCopy);

    const content = createElement("div", "drawer-detail__content");
    const detailsList = createElement("ol", "drawer-detail__ordered");
    const scheduleItem = createElement("li", "drawer-detail__ordered-item");
    scheduleItem.innerHTML = `<strong>Schedule:</strong> ${schedule.label}`;
    detailsList.append(scheduleItem);

    if (event.location) {
      const locationItem = createElement("li", "drawer-detail__ordered-item");
      locationItem.innerHTML = `<strong>Location:</strong> ${event.location}`;
      detailsList.append(locationItem);
    }

    const participantNames = (event.participants ?? [])
      .map((participantId) =>
        participantOptions.find((user) => user.id === participantId),
      )
      .filter(Boolean);
    if (participantNames.length > 0) {
      const participantItem = createElement(
        "li",
        "drawer-detail__ordered-item",
      );
      const allParticipantsSelected =
        participantOptions.length > 0 &&
        participantNames.length === participantOptions.length;
      const participantSummary = allParticipantsSelected
        ? "All participants"
        : participantNames.length <= 4
          ? participantNames.map((participant) => participant.name).join(", ")
          : `${participantNames
              .slice(0, 4)
              .map((participant) => participant.name)
              .join(", ")} +${participantNames.length - 4} more`;

      participantItem.innerHTML = `<strong>Participants:</strong> ${participantSummary}`;
      detailsList.append(participantItem);
    }

    if (event.description) {
      const descriptionValue = createElement("div", "drawer-detail__rich");
      descriptionValue.innerHTML = event.description;
      linkifyElement(descriptionValue);
      content.append(detailsList, descriptionValue);
    } else {
      content.append(detailsList);
    }

    const attachments = getEventAttachments(event);

    if (attachments.length > 0) {
      const attachmentList = createElement(
        "div",
        "drawer-detail__attachment-list",
      );

      attachments.forEach((attachment) => {
        const attachmentCard = createElement(
          "article",
          `drawer-detail__attachment drawer-detail__attachment--interactive${
            attachment.type === "application/pdf"
              ? " drawer-detail__attachment--document"
              : ""
          }`,
        );
        const attachmentMedia = createElement(
          "div",
          `drawer-detail__attachment-media${
            attachment.type === "application/pdf"
              ? " drawer-detail__attachment-media--document"
              : ""
          }`,
        );
        const attachmentOverlayLabel = createElement(
          "span",
          "drawer-detail__attachment-overlay-label",
          "Preview",
        );
        const preview = createDrawerAttachmentPreview(attachment);
        const previewShell = createElement(
          "div",
          `drawer-detail__attachment-preview-shell${
            attachment.type === "application/pdf"
              ? " drawer-detail__attachment-preview-shell--document"
              : ""
          }`,
        );
        const attachmentOverlay = createElement(
          "div",
          `drawer-detail__attachment-overlay${
            attachment.type === "application/pdf"
              ? " drawer-detail__attachment-overlay--document"
              : ""
          }`,
        );

        attachmentCard.setAttribute(
          "aria-label",
          `Preview ${attachment.name || "attachment"}`,
        );
        attachmentCard.tabIndex = 0;
        attachmentCard.role = "button";
        attachmentCard.addEventListener("click", () => {
          openAttachmentViewer(attachment);
        });
        attachmentCard.addEventListener("keydown", (nativeEvent) => {
          if (nativeEvent.key === "Enter" || nativeEvent.key === " ") {
            nativeEvent.preventDefault();
            openAttachmentViewer(attachment);
          }
        });
        attachmentOverlay.append(attachmentOverlayLabel);

        if (preview) {
          previewShell.append(preview);
        } else {
          previewShell.append(
            createElement("div", "drawer-detail__attachment-paper-fallback"),
          );
        }

        previewShell.append(attachmentOverlay);
        attachmentMedia.append(previewShell);
        attachmentCard.append(attachmentMedia);

        attachmentList.append(attachmentCard);
      });

      content.append(attachmentList);
    }

    surface.append(titleRow, content);
    body.append(surface);
  }

  headerLeft.append(backButton, title);
  header.append(headerLeft, closeButton);
  drawer.append(header, body);
  overlay.append(backdrop, drawer);

  return overlay;
}

function createUserManagementView(activeApp) {
  const wrapper = createElement("section", "user-management-view");
  const header = createElement("div", "user-management-view__header");
  const titleBlock = createElement("div", "user-management-view__titles");
  const eyebrow = createElement(
    "p",
    "user-management-view__eyebrow",
    "Team Directory",
  );
  const title = createElement(
    "h2",
    "user-management-view__title",
    "User Accounts",
  );
  const meta = createElement(
    "p",
    "user-management-view__meta",
    `${activeApp.users.length} accounts available for role and access setup.`,
  );
  const list = createElement("div", "user-management-view__list");

  titleBlock.append(eyebrow, title, meta);
  header.append(titleBlock);

  activeApp.users.forEach((user) => {
    const card = createElement("article", "user-card");
    const identity = createElement("div", "user-card__identity");
    const avatar = createElement(
      "div",
      "user-card__avatar",
      user.name.slice(0, 1),
    );
    const copy = createElement("div", "user-card__copy");
    const name = createElement("h3", "user-card__name", user.name);
    const email = createElement("p", "user-card__email", user.email);
    const role = createElement("span", "user-card__role", user.role);
    const status = createElement(
      "span",
      `user-card__status user-card__status--${user.status.toLowerCase()}`,
      user.status,
    );

    copy.append(name, email);
    identity.append(avatar, copy);
    card.append(identity, role, status);
    list.append(card);
  });

  wrapper.append(header, list);

  return wrapper;
}

function createOrganizationSettingsView(state, activeApp, callbacks) {
  const { onAddSite, onAddDept, onViewSite, onEditSite, onRemoveSite, onViewDept, onEditDept, onRemoveDept } = callbacks;
  
  const wrapper = createElement("section", "org-settings");
  const header = createElement("div", "org-settings__header");
  const title = createElement("h2", "org-settings__title", "Organization Settings");
  
  const headerTop = createElement("div", "org-settings__header-top");
  const segmentedControl = createElement("div", "org-settings__segmented");
  const sitesBtn = createElement("button", "org-settings__segment-btn is-active", "Sites");
  const deptBtn = createElement("button", "org-settings__segment-btn", "Departments");
  
  const addBtn = createElement("button", "org-settings__add-btn");
  addBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 5v14M5 12h14"/>
    </svg>
    <span>Add Site</span>
  `;
  
  addBtn.addEventListener("click", () => {
    if (currentTab === "sites") {
      onAddSite();
    } else {
      onAddDept();
    }
  });
  
  segmentedControl.append(sitesBtn, deptBtn);
  headerTop.append(segmentedControl, addBtn);
  header.append(title, headerTop);
  
  const contentArea = createElement("div", "org-settings__content");
  
  const sitesData = getSites();
  
  const deptData = getDepartments().map(dept => ({
    ...dept,
    site: "All Sites",
    head: "-",
    employees: 0,
  }));
  
  let currentTab = state.orgSettingsActiveTab;
  const allKebabMenus = [];
  
  function closeAllKebabMenus(except = null) {
    allKebabMenus.forEach(({ btn, dropdown }) => {
      if (dropdown !== except) {
        dropdown.style.display = "none";
      }
    });
  }
  
  function createKebabMenu(item, itemData, callbacks) {
    const kebabBtn = createElement("button", "org-settings__kebab-btn");
    kebabBtn.innerHTML = '<span style="font-size:16px;color:#666;">⋮</span>';
    
    const kebabDropdown = createElement("div", "org-settings__kebab-dropdown");
    
    const menuItems = [
      { label: "View", icon: "eye", action: "view" },
      { label: "Edit", icon: "edit", action: "edit" },
      { label: "Remove", icon: "trash", action: "remove", danger: true },
    ];
    
    menuItems.forEach(menu => {
      const menuBtn = createElement("button", `org-settings__kebab-option${menu.danger ? " is-danger" : ""}`);
      menuBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${menu.icon === "eye" ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' : ""}
          ${menu.icon === "edit" ? '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>' : ""}
          ${menu.icon === "trash" ? '<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>' : ""}
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
    
    allKebabMenus.push({ btn: kebabBtn, dropdown: kebabDropdown });
    
    kebabBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = kebabDropdown.style.display === "block";
      closeAllKebabMenus(kebabDropdown);
      kebabDropdown.style.display = isCurrentlyOpen ? "none" : "block";
    });
    
    document.addEventListener("click", () => {
      kebabDropdown.style.display = "none";
    });
    
    return { kebabBtn, kebabDropdown };
  }
  
  function renderSites() {
    currentTab = "sites";
    state.orgSettingsActiveTab = "sites";
    allKebabMenus.length = 0;
    addBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      <span>Add Site</span>
    `;
    contentArea.innerHTML = "";
    
    const sitesList = createElement("div", "org-settings__list");
    
    sitesData.forEach(site => {
      const item = createElement("div", "org-settings__item");
      const siteCallbacks = {
        view: () => onViewSite(site),
        edit: () => onEditSite(site),
        remove: () => onRemoveSite(site),
      };
      const { kebabBtn, kebabDropdown } = createKebabMenu(item, site, siteCallbacks);
      
      item.innerHTML = `
        <div class="org-settings__item-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M3 21h18M3 7v14M21 7v14M6 21V10M9 21V10M12 21V10M18 21V7M5 7l7-4 7 4"/>
          </svg>
        </div>
        <div class="org-settings__item-info">
          <div class="org-settings__item-name">${site.name}</div>
          <div class="org-settings__item-meta">${site.code} · ${site.address}</div>
        </div>
      `;
      item.appendChild(kebabDropdown);
      item.appendChild(kebabBtn);
      sitesList.appendChild(item);
    });
    
    contentArea.appendChild(sitesList);
  }
  
  function renderDepts() {
    currentTab = "depts";
    state.orgSettingsActiveTab = "depts";
    allKebabMenus.length = 0;
    addBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      <span>Add Department</span>
    `;
    contentArea.innerHTML = "";
    
    const deptList = createElement("div", "org-settings__list");
    
    deptData.forEach(dept => {
      const item = createElement("div", "org-settings__item");
      const deptCallbacks = {
        view: () => onViewDept(dept),
        edit: () => onEditDept(dept),
        remove: () => onRemoveDept(dept),
      };
      const { kebabBtn, kebabDropdown } = createKebabMenu(item, dept, deptCallbacks);
      
      item.innerHTML = `
        <div class="org-settings__item-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
        </div>
        <div class="org-settings__item-info">
          <div class="org-settings__item-name">${dept.name}</div>
          <div class="org-settings__item-meta">${dept.code} · ${dept.site} · Head: ${dept.head}</div>
        </div>
        <span class="org-settings__item-badge">${dept.employees} employees</span>
      `;
      item.appendChild(kebabDropdown);
      item.appendChild(kebabBtn);
      deptList.appendChild(item);
    });
    
    contentArea.appendChild(deptList);
  }
  
  sitesBtn.addEventListener("click", () => {
    sitesBtn.classList.add("is-active");
    deptBtn.classList.remove("is-active");
    renderSites();
  });
  
  deptBtn.addEventListener("click", () => {
    deptBtn.classList.add("is-active");
    sitesBtn.classList.remove("is-active");
    renderDepts();
  });
  
  wrapper.appendChild(header);
  wrapper.appendChild(contentArea);
  
  if (state.orgSettingsActiveTab === "depts") {
    deptBtn.classList.add("is-active");
    sitesBtn.classList.remove("is-active");
    renderDepts();
  } else {
    renderSites();
  }
  
  return wrapper;
}

function createSiteDrawer(state, closeDrawer, isOpen = false) {
  const overlay = createElement(
    "div",
    `site-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "site-drawer-overlay__backdrop");
  const drawer = createElement("aside", "site-drawer");
  const header = createElement("div", "site-drawer__header");
  const headerLeft = createElement("div", "site-drawer__header-left");
  const backButton = createElement("button", "site-drawer__back");
  const title = createElement("h2", "site-drawer__title", "Add Site");
  const closeButton = createElement("button", "site-drawer__close");
  const body = createElement("div", "site-drawer__body");
  const footer = createElement("div", "site-drawer__footer");

  overlay.setAttribute("aria-hidden", String(!state.isSiteDrawerOpen));
  drawer.setAttribute("aria-label", "Add site drawer");
  backdrop.type = "button";
  backButton.type = "button";
  closeButton.type = "button";
  backButton.append(createIcon("chevron-left"));
  closeButton.append(createIcon("close"));
  backdrop.addEventListener("click", closeDrawer);
  backButton.addEventListener("click", closeDrawer);
  closeButton.addEventListener("click", closeDrawer);

  // Site Name field (required)
  const nameGroup = createElement("div", "drawer-form__group");
  const nameLabel = createElement("label", "drawer-form__label");
  nameLabel.append(createElement("span", "", "Site Name"), createElement("span", "drawer-form__required", " *"));
  const nameInput = createElement("input", "drawer-form__title-input");
  nameInput.type = "text";
  nameInput.value = state.siteDraft.name;
  nameInput.placeholder = "e.g., Headquarters Jakarta";
  nameInput.required = true;
  nameInput.addEventListener("input", (event) => {
    state.siteDraft.name = event.target.value;
  });
  nameGroup.append(nameLabel, nameInput);
  body.appendChild(nameGroup);

  // Site Code field (required)
  const codeGroup = createElement("div", "drawer-form__group");
  const codeLabel = createElement("label", "drawer-form__label");
  codeLabel.append(createElement("span", "", "Site Code"), createElement("span", "drawer-form__required", " *"));
  const codeInput = createElement("input", "drawer-form__title-input");
  codeInput.type = "text";
  codeInput.value = state.siteDraft.code;
  codeInput.placeholder = "e.g., HQ-JKT";
  codeInput.required = true;
  codeInput.addEventListener("input", (event) => {
    state.siteDraft.code = event.target.value;
  });
  codeGroup.append(codeLabel, codeInput);
  body.appendChild(codeGroup);

  // Address field (required)
  const addressGroup = createElement("div", "drawer-form__group");
  const addressLabel = createElement("label", "drawer-form__label");
  addressLabel.append(createElement("span", "", "Address"), createElement("span", "drawer-form__required", " *"));
  const addressInput = createElement("input", "drawer-form__title-input");
  addressInput.type = "text";
  addressInput.value = state.siteDraft.address;
  addressInput.placeholder = "e.g., Jl. Sudirman No. 123, Jakarta Pusat";
  addressInput.required = true;
  addressInput.addEventListener("input", (event) => {
    state.siteDraft.address = event.target.value;
  });
  addressGroup.append(addressLabel, addressInput);
  body.appendChild(addressGroup);

  // Footer
  const footerActions = createElement("div", "site-drawer__footer-actions");
  const cancelButton = createElement("button", "site-drawer__button site-drawer__button--ghost", "Cancel");
  const saveButton = createElement("button", "site-drawer__button site-drawer__button--primary", "Save");
  cancelButton.type = "button";
  saveButton.type = "button";
  cancelButton.addEventListener("click", closeDrawer);
  saveButton.addEventListener("click", () => {
    if (state.siteDraft.name && state.siteDraft.code && state.siteDraft.address) {
      const userManagementApp = workspaceApps.find(app => app.id === "user-management");
      if (userManagementApp) {
        userManagementApp.sites = userManagementApp.sites || [];
        userManagementApp.sites.push({
          id: `site-${Date.now()}`,
          name: state.siteDraft.name,
          code: state.siteDraft.code,
          address: state.siteDraft.address,
        });
      }
      closeDrawer();
    }
  });
  footerActions.append(saveButton, cancelButton);
  footer.appendChild(footerActions);

  headerLeft.append(backButton, title);
  header.append(headerLeft, closeButton);
  drawer.append(header, body, footer);
  overlay.append(backdrop, drawer);

  return overlay;
}

function createDeptDrawer(state, closeDrawer, isOpen = false) {
  const overlay = createElement(
    "div",
    `dept-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "dept-drawer-overlay__backdrop");
  const drawer = createElement("aside", "dept-drawer");
  const header = createElement("div", "dept-drawer__header");
  const headerLeft = createElement("div", "dept-drawer__header-left");
  const backButton = createElement("button", "dept-drawer__back");
  const title = createElement("h2", "dept-drawer__title", "Add Department");
  const closeButton = createElement("button", "dept-drawer__close");
  const body = createElement("div", "dept-drawer__body");
  const footer = createElement("div", "dept-drawer__footer");

  overlay.setAttribute("aria-hidden", String(!state.isDeptDrawerOpen));
  drawer.setAttribute("aria-label", "Add department drawer");
  backdrop.type = "button";
  backButton.type = "button";
  closeButton.type = "button";
  backButton.append(createIcon("chevron-left"));
  closeButton.append(createIcon("close"));
  backdrop.addEventListener("click", closeDrawer);
  backButton.addEventListener("click", closeDrawer);
  closeButton.addEventListener("click", closeDrawer);

  // Department Name field (required)
  const nameGroup = createElement("div", "drawer-form__group");
  const nameLabel = createElement("label", "drawer-form__label");
  nameLabel.append(createElement("span", "", "Department Name"), createElement("span", "drawer-form__required", " *"));
  const nameInput = createElement("input", "drawer-form__title-input");
  nameInput.type = "text";
  nameInput.value = state.deptDraft.name;
  nameInput.placeholder = "e.g., Human Resources";
  nameInput.required = true;
  nameInput.addEventListener("input", (event) => {
    state.deptDraft.name = event.target.value;
  });
  nameGroup.append(nameLabel, nameInput);
  body.appendChild(nameGroup);

  // Department Code field (required)
  const codeGroup = createElement("div", "drawer-form__group");
  const codeLabel = createElement("label", "drawer-form__label");
  codeLabel.append(createElement("span", "", "Department Code"), createElement("span", "drawer-form__required", " *"));
  const codeInput = createElement("input", "drawer-form__title-input");
  codeInput.type = "text";
  codeInput.value = state.deptDraft.code;
  codeInput.placeholder = "e.g., HRGA";
  codeInput.required = true;
  codeInput.addEventListener("input", (event) => {
    state.deptDraft.code = event.target.value;
  });
  codeGroup.append(codeLabel, codeInput);
  body.appendChild(codeGroup);

  // Site dropdown (required)
  const siteGroup = createElement("div", "drawer-form__group");
  const siteLabel = createElement("label", "drawer-form__label");
  siteLabel.append(createElement("span", "", "Site"), createElement("span", "drawer-form__required", " *"));
  const siteSelect = createElement("select", "drawer-form__native-select");
  siteSelect.required = true;
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select site";
  defaultOption.disabled = true;
  defaultOption.selected = !state.deptDraft.site;
  siteSelect.append(defaultOption);
  const allSites = getSites();
  allSites.forEach((site) => {
    const option = document.createElement("option");
    option.value = site.name;
    option.textContent = site.name;
    siteSelect.append(option);
  });
  siteSelect.addEventListener("change", (event) => {
    state.deptDraft.site = event.target.value;
  });
  siteGroup.append(siteLabel, siteSelect);
  body.appendChild(siteGroup);

  // Department Head field (optional)
  const headGroup = createElement("div", "drawer-form__group");
  const headLabel = createElement("label", "drawer-form__label", "Department Head");
  const headInput = createElement("input", "drawer-form__title-input");
  headInput.type = "text";
  headInput.value = state.deptDraft.head;
  headInput.placeholder = "e.g., Nadia Putri";
  headInput.addEventListener("input", (event) => {
    state.deptDraft.head = event.target.value;
  });
  headGroup.append(headLabel, headInput);
  body.appendChild(headGroup);

  // Footer
  const footerActions = createElement("div", "dept-drawer__footer-actions");
  const cancelButton = createElement("button", "dept-drawer__button dept-drawer__button--ghost", "Cancel");
  const saveButton = createElement("button", "dept-drawer__button dept-drawer__button--primary", "Save");
  cancelButton.type = "button";
  saveButton.type = "button";
  cancelButton.addEventListener("click", closeDrawer);
  saveButton.addEventListener("click", () => {
    if (state.deptDraft.name && state.deptDraft.code && state.deptDraft.site) {
      const userManagementApp = workspaceApps.find(app => app.id === "user-management");
      if (userManagementApp) {
        userManagementApp.departments = userManagementApp.departments || [];
        userManagementApp.departments.push({
          id: `dept-${Date.now()}`,
          name: state.deptDraft.name,
          code: state.deptDraft.code,
          site: state.deptDraft.site,
          head: state.deptDraft.head || "-",
          employees: 0,
        });
      }
      closeDrawer();
    }
  });
  footerActions.append(saveButton, cancelButton);
  footer.appendChild(footerActions);

  headerLeft.append(backButton, title);
  header.append(headerLeft, closeButton);
  drawer.append(header, body, footer);
  overlay.append(backdrop, drawer);

  return overlay;
}

function createSiteDetailDrawer(state, closeDrawer, onSave, mode = "view", isOpen = false) {
  const site = state.siteDraft;
  const isViewMode = mode === "view";

  const overlay = createElement(
    "div",
    `site-detail-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "site-detail-drawer-overlay__backdrop");
  const drawer = createElement("aside", "site-detail-drawer");
  const header = createElement("div", "site-detail-drawer__header");
  const headerLeft = createElement("div", "site-detail-drawer__header-left");
  const backButton = createElement("button", "site-detail-drawer__back");
  const title = createElement("h2", "site-detail-drawer__title", isViewMode ? "Site Details" : "Edit Site");
  const closeButton = createElement("button", "site-detail-drawer__close");
  const body = createElement("div", "site-detail-drawer__body");
  const footer = createElement("div", "site-detail-drawer__footer");

  overlay.setAttribute("aria-hidden", String(!state.isSiteDetailDrawerOpen));
  drawer.setAttribute("aria-label", isViewMode ? "Site details drawer" : "Edit site drawer");
  backdrop.type = "button";
  backButton.type = "button";
  closeButton.type = "button";
  backButton.append(createIcon("chevron-left"));
  closeButton.append(createIcon("close"));
  backdrop.addEventListener("click", closeDrawer);
  backButton.addEventListener("click", closeDrawer);
  closeButton.addEventListener("click", closeDrawer);

  // Site Name field
  const nameGroup = createElement("div", "drawer-form__group");
  const nameLabel = createElement("label", "drawer-form__label");
  nameLabel.append(createElement("span", "", "Site Name"));
  const nameValue = createElement("div", "site-detail-drawer__value");
  nameValue.textContent = site.name || "-";
  nameGroup.append(nameLabel, isViewMode ? nameValue : createSiteInput(state, "name", site.name, "e.g., Headquarters Jakarta"));
  body.appendChild(nameGroup);

  // Site Code field
  const codeGroup = createElement("div", "drawer-form__group");
  const codeLabel = createElement("label", "drawer-form__label");
  codeLabel.append(createElement("span", "", "Site Code"));
  const codeValue = createElement("div", "site-detail-drawer__value");
  codeValue.textContent = site.code || "-";
  codeGroup.append(codeLabel, isViewMode ? codeValue : createSiteInput(state, "code", site.code, "e.g., HQ-JKT"));
  body.appendChild(codeGroup);

  // Address field
  const addressGroup = createElement("div", "drawer-form__group");
  const addressLabel = createElement("label", "drawer-form__label");
  addressLabel.append(createElement("span", "", "Address"));
  const addressValue = createElement("div", "site-detail-drawer__value");
  addressValue.textContent = site.address || "-";
  addressGroup.append(addressLabel, isViewMode ? addressValue : createSiteInput(state, "address", site.address, "e.g., Jl. Sudirman No. 123"));
  body.appendChild(addressGroup);

  // Footer
  const footerActions = createElement("div", "site-detail-drawer__footer-actions");

  if (isViewMode) {
    const closeFooterBtn = createElement("button", "site-detail-drawer__button site-detail-drawer__button--primary", "Close");
    closeFooterBtn.type = "button";
    closeFooterBtn.addEventListener("click", closeDrawer);
    footerActions.append(closeFooterBtn);
  } else {
    const cancelButton = createElement("button", "site-detail-drawer__button site-detail-drawer__button--ghost", "Cancel");
    const saveButton = createElement("button", "site-detail-drawer__button site-detail-drawer__button--primary", "Save");
    cancelButton.type = "button";
    saveButton.type = "button";
    cancelButton.addEventListener("click", closeDrawer);
    saveButton.addEventListener("click", onSave);
    footerActions.append(saveButton, cancelButton);
  }

  footer.appendChild(footerActions);

  headerLeft.append(backButton, title);
  header.append(headerLeft, closeButton);
  drawer.append(header, body, footer);
  overlay.append(backdrop, drawer);

  return overlay;
}

function createSiteInput(state, field, value, placeholder) {
  const input = createElement("input", "drawer-form__title-input");
  input.type = "text";
  input.value = value || "";
  input.placeholder = placeholder;
  input.dataset.field = field;
  input.addEventListener("input", (e) => {
    state.siteDraft[field] = e.target.value;
  });
  return input;
}

function createDeptDetailDrawer(state, closeDrawer, onSave, mode = "view", isOpen = false) {
  const dept = state.deptDraft;
  const isViewMode = mode === "view";

  const overlay = createElement(
    "div",
    `dept-detail-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "dept-detail-drawer-overlay__backdrop");
  const drawer = createElement("aside", "dept-detail-drawer");
  const header = createElement("div", "dept-detail-drawer__header");
  const headerLeft = createElement("div", "dept-detail-drawer__header-left");
  const backButton = createElement("button", "dept-detail-drawer__back");
  const title = createElement("h2", "dept-detail-drawer__title", isViewMode ? "Department Details" : "Edit Department");
  const closeButton = createElement("button", "dept-detail-drawer__close");
  const body = createElement("div", "dept-detail-drawer__body");
  const footer = createElement("div", "dept-detail-drawer__footer");

  overlay.setAttribute("aria-hidden", String(!state.isDeptDetailDrawerOpen));
  drawer.setAttribute("aria-label", isViewMode ? "Department details drawer" : "Edit department drawer");
  backdrop.type = "button";
  backButton.type = "button";
  closeButton.type = "button";
  backButton.append(createIcon("chevron-left"));
  closeButton.append(createIcon("close"));
  backdrop.addEventListener("click", closeDrawer);
  backButton.addEventListener("click", closeDrawer);
  closeButton.addEventListener("click", closeDrawer);

  // Department Name field
  const nameGroup = createElement("div", "drawer-form__group");
  const nameLabel = createElement("label", "drawer-form__label");
  nameLabel.append(createElement("span", "", "Department Name"));
  const nameValue = createElement("div", "dept-detail-drawer__value");
  nameValue.textContent = dept.name || "-";
  nameGroup.append(nameLabel, isViewMode ? nameValue : createDeptInput(state, "name", dept.name, "e.g., Human Resources"));
  body.appendChild(nameGroup);

  // Department Code field
  const codeGroup = createElement("div", "drawer-form__group");
  const codeLabel = createElement("label", "drawer-form__label");
  codeLabel.append(createElement("span", "", "Department Code"));
  const codeValue = createElement("div", "dept-detail-drawer__value");
  codeValue.textContent = dept.code || "-";
  codeGroup.append(codeLabel, isViewMode ? codeValue : createDeptInput(state, "code", dept.code, "e.g., HRGA"));
  body.appendChild(codeGroup);

  // Site field
  const siteGroup = createElement("div", "drawer-form__group");
  const siteLabel = createElement("label", "drawer-form__label");
  siteLabel.append(createElement("span", "", "Site"));
  const siteValue = createElement("div", "dept-detail-drawer__value");
  siteValue.textContent = dept.site || "-";
  siteGroup.append(siteLabel, isViewMode ? siteValue : createDeptInput(state, "site", dept.site, "e.g., All Sites"));
  body.appendChild(siteGroup);

  // Department Head field
  const headGroup = createElement("div", "drawer-form__group");
  const headLabel = createElement("label", "drawer-form__label");
  headLabel.append(createElement("span", "", "Department Head"));
  const headValue = createElement("div", "dept-detail-drawer__value");
  headValue.textContent = dept.head || "-";
  headGroup.append(headLabel, isViewMode ? headValue : createDeptInput(state, "head", dept.head, "e.g., Nadia Putri"));
  body.appendChild(headGroup);

  // Footer
  const footerActions = createElement("div", "dept-detail-drawer__footer-actions");

  if (isViewMode) {
    const closeFooterBtn = createElement("button", "dept-detail-drawer__button dept-detail-drawer__button--primary", "Close");
    closeFooterBtn.type = "button";
    closeFooterBtn.addEventListener("click", closeDrawer);
    footerActions.append(closeFooterBtn);
  } else {
    const cancelButton = createElement("button", "dept-detail-drawer__button dept-detail-drawer__button--ghost", "Cancel");
    const saveButton = createElement("button", "dept-detail-drawer__button dept-detail-drawer__button--primary", "Save");
    cancelButton.type = "button";
    saveButton.type = "button";
    cancelButton.addEventListener("click", closeDrawer);
    saveButton.addEventListener("click", onSave);
    footerActions.append(saveButton, cancelButton);
  }

  footer.appendChild(footerActions);

  headerLeft.append(backButton, title);
  header.append(headerLeft, closeButton);
  drawer.append(header, body, footer);
  overlay.append(backdrop, drawer);

  return overlay;
}

function createDeptInput(state, field, value, placeholder) {
  const input = createElement("input", "drawer-form__title-input");
  input.type = "text";
  input.value = value || "";
  input.placeholder = placeholder;
  input.dataset.field = field;
  input.addEventListener("input", (e) => {
    state.deptDraft[field] = e.target.value;
  });
  return input;
}

function createUserDetailDrawer(state, closeDrawer, onSave, mode = "view", isOpen = false) {
  const user = state.userDraft;
  const isViewMode = mode === "view";

  const overlay = createElement(
    "div",
    `user-detail-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "user-detail-drawer-overlay__backdrop");
  const drawer = createElement("aside", "user-detail-drawer");
  const header = createElement("div", "user-detail-drawer__header");
  const headerLeft = createElement("div", "user-detail-drawer__header-left");
  const backButton = createElement("button", "user-detail-drawer__back");
  const title = createElement("h2", "user-detail-drawer__title", isViewMode ? "User Details" : "Edit User");
  const closeButton = createElement("button", "user-detail-drawer__close");
  const body = createElement("div", "user-detail-drawer__body");
  const footer = createElement("div", "user-detail-drawer__footer");

  overlay.setAttribute("aria-hidden", String(!state.isUserDetailDrawerOpen));
  drawer.setAttribute("aria-label", isViewMode ? "User details drawer" : "Edit user drawer");
  backdrop.type = "button";
  backButton.type = "button";
  closeButton.type = "button";
  backButton.append(createIcon("chevron-left"));
  closeButton.append(createIcon("close"));
  backdrop.addEventListener("click", closeDrawer);
  backButton.addEventListener("click", closeDrawer);
  closeButton.addEventListener("click", closeDrawer);

  // Name field
  const nameGroup = createElement("div", "drawer-form__group");
  const nameLabel = createElement("label", "drawer-form__label");
  nameLabel.append(createElement("span", "", "Name"));
  const nameValue = createElement("div", "user-detail-drawer__value");
  nameValue.textContent = user.name || "-";
  nameGroup.append(nameLabel, isViewMode ? nameValue : createUserInput(state, "name", user.name, "e.g., Nadia Putri"));
  body.appendChild(nameGroup);

  // Email field
  const emailGroup = createElement("div", "drawer-form__group");
  const emailLabel = createElement("label", "drawer-form__label");
  emailLabel.append(createElement("span", "", "Email"));
  const emailValue = createElement("div", "user-detail-drawer__value");
  emailValue.textContent = user.email || "-";
  emailGroup.append(emailLabel, isViewMode ? emailValue : createUserInput(state, "email", user.email, "e.g., nadia@company.com"));
  body.appendChild(emailGroup);

  // Phone field
  const phoneGroup = createElement("div", "drawer-form__group");
  const phoneLabel = createElement("label", "drawer-form__label");
  phoneLabel.append(createElement("span", "", "Phone"));
  const phoneValue = createElement("div", "user-detail-drawer__value");
  phoneValue.textContent = user.phone || "-";
  phoneGroup.append(phoneLabel, isViewMode ? phoneValue : createUserInput(state, "phone", user.phone, "e.g., +62 812 3456 7890"));
  body.appendChild(phoneGroup);

  // Department field
  const deptGroup = createElement("div", "drawer-form__group");
  const deptLabel = createElement("label", "drawer-form__label");
  deptLabel.append(createElement("span", "", "Department"));
  const deptValue = createElement("div", "user-detail-drawer__value");
  deptValue.textContent = user.department || "-";
  if (isViewMode) {
    deptGroup.append(deptLabel, deptValue);
  } else {
    const deptSelect = createElement("select", "drawer-form__title-input");
    deptSelect.required = true;
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select department";
    defaultOption.disabled = true;
    defaultOption.selected = !user.department;
    deptSelect.append(defaultOption);
    const allDepartments = getDepartments();
    allDepartments.forEach((dept) => {
      const option = document.createElement("option");
      option.value = dept.name;
      option.textContent = dept.name;
      if (dept.name === user.department) option.selected = true;
      deptSelect.append(option);
    });
    deptSelect.addEventListener("change", (event) => {
      state.userDraft.department = event.target.value;
    });
    deptGroup.append(deptLabel, deptSelect);
  }
  body.appendChild(deptGroup);

  // Position field
  const positionGroup = createElement("div", "drawer-form__group");
  const positionLabel = createElement("label", "drawer-form__label");
  positionLabel.append(createElement("span", "", "Position"));
  const positionValue = createElement("div", "user-detail-drawer__value");
  positionValue.textContent = user.position || "-";
  positionGroup.append(positionLabel, isViewMode ? positionValue : createUserInput(state, "position", user.position, "e.g., HR Manager"));
  body.appendChild(positionGroup);

  // Join Date field
  const joinDateGroup = createElement("div", "drawer-form__group");
  const joinDateLabel = createElement("label", "drawer-form__label");
  joinDateLabel.append(createElement("span", "", "Join Date"));
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const joinDateValue = createElement("div", "user-detail-drawer__value");
  joinDateValue.textContent = formatDisplayDate(user.joinDate);
  joinDateGroup.append(joinDateLabel, isViewMode ? joinDateValue : createUserInput(state, "joinDate", user.joinDate, ""));
  body.appendChild(joinDateGroup);

  // Password field (only in edit mode)
  if (!isViewMode) {
    const passwordGroup = createElement("div", "drawer-form__group");
    const passwordLabel = createElement("label", "drawer-form__label");
    passwordLabel.append(createElement("span", "", "Password"));
    const passwordInput = createUserPasswordInput(state, "password", user.password || "", "Leave blank to keep current");
    passwordGroup.append(passwordLabel, passwordInput);
    body.appendChild(passwordGroup);
  }

  // Footer
  const footerActions = createElement("div", "user-detail-drawer__footer-actions");

  if (isViewMode) {
    const closeFooterBtn = createElement("button", "user-detail-drawer__button user-detail-drawer__button--primary", "Close");
    closeFooterBtn.type = "button";
    closeFooterBtn.addEventListener("click", closeDrawer);
    footerActions.append(closeFooterBtn);
  } else {
    const cancelButton = createElement("button", "user-detail-drawer__button user-detail-drawer__button--ghost", "Cancel");
    const saveButton = createElement("button", "user-detail-drawer__button user-detail-drawer__button--primary", "Save");
    cancelButton.type = "button";
    saveButton.type = "button";
    cancelButton.addEventListener("click", closeDrawer);
    saveButton.addEventListener("click", onSave);
    footerActions.append(saveButton, cancelButton);
  }

  footer.appendChild(footerActions);

  headerLeft.append(backButton, title);
  header.append(headerLeft, closeButton);
  drawer.append(header, body, footer);
  overlay.append(backdrop, drawer);

  return overlay;
}

function createUserInput(state, field, value, placeholder) {
  const input = createElement("input", "drawer-form__title-input");
  input.type = "text";
  input.value = value || "";
  input.placeholder = placeholder;
  input.dataset.field = field;
  input.addEventListener("input", (e) => {
    state.userDraft[field] = e.target.value;
  });
  return input;
}

function createUserPasswordInput(state, field, value, placeholder) {
  const wrapper = createElement("div", "drawer-form__password-wrapper");
  const input = createElement("input", "drawer-form__title-input drawer-form__password-input");
  input.type = "password";
  input.value = value || "";
  input.placeholder = placeholder;
  input.dataset.field = field;
  input.addEventListener("input", (e) => {
    state.userDraft[field] = e.target.value;
  });
  const toggleBtn = createElement("button", "drawer-form__password-toggle");
  toggleBtn.type = "button";
  toggleBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  toggleBtn.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    toggleBtn.innerHTML = isPassword
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  });
  wrapper.append(input, toggleBtn);
  return wrapper;
}

export function createAppShell() {
  const state = getInitialState();
  const shell = createElement("main", "workspace-shell");
  const sidebar = createElement("aside", "sidebar");
  const rail = createElement("section", "sidebar__rail");
  const panel = createElement("section", "sidebar__panel");
  const content = createElement("section", "content-stage");

  const marker = createElement("span", "sidebar__active-marker");
  rail.append(marker);

  const logo = createElement("div", "brand");
  const logoImage = createElement("img", "brand__image");
  logoImage.src = new URL("../img/imajin.png", import.meta.url).href;
  logoImage.alt = "Imajin";
  logo.append(logoImage);

  const railNav = createElement("nav", "rail-nav");
  railNav.setAttribute("aria-label", "Applications");

  const panelHeading = createElement("h1", "panel__title");
  const panelBody = createElement("div", "panel__body");

  const contentPlaceholder = createElement("div", "content-stage__content");
  const contentLabel = createElement(
    "p",
    "content-stage__label",
    "Selected module",
  );
  const contentHeading = createElement("h2", "content-stage__title");
  const contentMeta = createElement("p", "content-stage__meta");

  contentPlaceholder.append(contentLabel, contentHeading, contentMeta);
  content.append(contentPlaceholder);
  panel.append(panelHeading, panelBody);
  sidebar.append(logo, rail, panel);
  shell.append(sidebar, content);

  function openEventDrawer() {
    state.lastAction = "new-event";
    state.activeItem = "New Event";
    state.eventDrawerMode = "create";
    state.activeDrawerEventId = null;
    state.eventDraft.isDatePickerOpen = false;
    state.eventDraft.openTimeField = null;
    state.eventDraft.isParticipantPopupOpen = false;
    state.isEventDrawerOpen = true;
  }

  function createAssetsWorkspace(activeApp) {
    const wrapper = createElement("section", "assets-workspace");
    const meta = ASSET_PAGE_META.Assets;

    const header = createElement("div", "assets-workspace__header");
    const titleBlock = createElement("div", "assets-workspace__title-block");
    const eyebrow = createElement(
      "p",
      "assets-workspace__eyebrow",
      meta.eyebrow,
    );
    const title = createElement("h2", "assets-workspace__title", meta.title);
    const actions = createElement("div", "assets-workspace__actions");
    const importBtn = createElement("button", "assets-workspace__btn");
    const exportBtn = createElement("button", "assets-workspace__btn");

    importBtn.type = "button";
    importBtn.setAttribute("aria-label", "Import assets");
    importBtn.append(
      createIcon("import"),
      createElement("span", null, "Import"),
    );

    exportBtn.type = "button";
    exportBtn.setAttribute("aria-label", "Export assets");
    exportBtn.append(
      createIcon("export"),
      createElement("span", null, "Export"),
    );

    exportBtn.addEventListener("click", () => {
      const filteredRecords = getFilteredAssetRecords(
        activeApp,
        state.assets.searches.inventory,
        state.assets.filters.inventory,
      );
      exportAssetsToCSV(filteredRecords);
    });

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        importAssetsFromCSV(file, activeApp);
      }
      fileInput.value = "";
    });
    importBtn.addEventListener("click", () => fileInput.click());

    titleBlock.append(eyebrow, title);
    actions.append(importBtn, exportBtn, fileInput);
    header.append(titleBlock, actions);

    const toolbar = createElement("div", "assets-workspace__toolbar");
    const searchWrap = createElement("div", "assets-workspace__search");
    const searchInput = createElement(
      "input",
      "assets-workspace__search-input",
    );
    const searchIcon = createElement("span", "assets-workspace__search-icon");
    const filterWrap = createElement("div", "assets-workspace__filter");
    const filterBtn = createElement("button", "assets-workspace__filter-btn");
    const filterIcon = createElement("span", "assets-workspace__filter-icon");
    const filterDropdown = createElement(
      "div",
      "assets-workspace__filter-dropdown",
    );

    searchInput.type = "text";
    searchInput.placeholder = "Search assets...";
    searchInput.setAttribute(
      "aria-label",
      "Search assets by name, code, or category",
    );
    searchInput.value = state.assets.searches.inventory;
    searchInput.addEventListener("input", (e) => {
      state.assets.searches.inventory = e.target.value;
      render();
    });

    searchIcon.append(createIcon("search"));

    filterDropdown.setAttribute("role", "listbox");
    filterDropdown.setAttribute("aria-label", "Filter options");

    filterBtn.type = "button";
    filterBtn.setAttribute("aria-label", "Filter assets");
    filterBtn.setAttribute("aria-haspopup", "listbox");
    filterBtn.setAttribute("aria-expanded", "false");
    filterIcon.append(createIcon("filter"));
    filterBtn.append(
      filterIcon,
      createElement(
        "span",
        null,
        getFilterLabel(state.assets.filters.inventory),
      ),
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

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isFilterOpen) {
        isFilterOpen = false;
        filterDropdown.classList.remove("is-open");
        filterBtn.setAttribute("aria-expanded", "false");
        filterBtn.focus();
      }
    });

    filterDropdown.addEventListener("click", (e) => e.stopPropagation());

    ASSET_INVENTORY_FILTERS.forEach(([value, label]) => {
      const isActive = state.assets.filters.inventory === value;
      const option = createElement(
        "button",
        `assets-workspace__filter-option${isActive ? " is-active" : ""}`,
        label,
      );
      option.type = "button";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(isActive));
      option.addEventListener("click", () => {
        state.assets.filters.inventory = value;
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

    const filteredRecords = getFilteredAssetRecords(
      activeApp,
      state.assets.searches.inventory,
      state.assets.filters.inventory,
    );
    const totalCount = activeApp.records?.length || 0;
    const countLabel = createElement("span", "assets-workspace__count", `Showing ${filteredRecords.length} of ${totalCount} assets`);

    toolbar.append(searchWrap, filterWrap, countLabel);

    const tableWrapper = createElement(
      "div",
      "assets-workspace__table-wrapper",
    );
    const table = createElement("table", "assets-workspace__table");
    const thead = createElement("thead");
    const tbody = createElement("tbody");

    tbody.addEventListener("scroll", () => {
      if (tbody.scrollTop > 0) {
        table.classList.add("assets-workspace__table-body--scrolled");
      } else {
        table.classList.remove("assets-workspace__table-body--scrolled");
      }
    });
    const headerRow = createElement("tr");

    const columns = [
      { label: "ASSET NAME", width: "38%" },
      { label: "ASSET NUMBER", width: "14%" },
      { label: "CATEGORY", width: "14%" },
      { label: "SITE", width: "10%" },
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
      const emptyRow = createElement("tr", "assets-workspace__empty-row");
      const emptyCell = createElement("td", null, "No assets found");
      emptyCell.colSpan = 6;
      emptyRow.append(emptyCell);
      tbody.append(emptyRow);
    } else {
      filteredRecords.forEach((record) => {
        const row = createElement("tr");
        row.dataset.assetId = record.id;

        const nameCell = createElement("td", null, record.name);

        const codeCell = createElement("td", null, record.assetNumber);

        const categoryCell = createElement("td", null, record.category);

        const siteCell = createElement("td", null, record.location);

        const statusCell = createElement("td");
        const statusBadge = createElement(
          "span",
          `assets-workspace__status assets-workspace__status--${record.statusTone}`,
          record.status,
        );
        statusCell.append(statusBadge);

        const actionCell = createElement("td");
        const kebabBtn = createElement("button", "assets-workspace__kebab-btn");
        kebabBtn.type = "button";
        kebabBtn.setAttribute("aria-label", "Asset actions");
        kebabBtn.append(createIcon("more-vertical"));

        const kebabDropdown = createElement(
          "div",
          "assets-workspace__kebab-dropdown",
        );
        kebabDropdown.setAttribute("role", "menu");

        const menuItems = [
          {
            label: "View",
            icon: "eye",
            action: () => openAssetDetailDrawer(record, activeApp),
          },
          {
            label: "Edit",
            icon: "edit",
            action: () => openAssetEditDrawer(record, activeApp),
          },
          {
            label: "Mutation",
            icon: "arrow-left-right",
            action: () => console.log("Mutation", record.id),
          },
          {
            label: "Check Out",
            icon: "log-out",
            action: () => console.log("Check Out", record.id),
          },
          {
            label: "Remove",
            icon: "trash",
            action: () => confirmDeleteAsset(record, activeApp),
            danger: true,
          },
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

        document.addEventListener("click", () => {
          isKebabOpen = false;
          kebabDropdown.classList.remove("is-open");
        });

        menuItems.forEach((item) => {
          const menuBtn = createElement(
            "button",
            `assets-workspace__kebab-option${item.danger ? " assets-workspace__kebab-option--danger" : ""}`,
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

        row.append(
          nameCell,
          codeCell,
          categoryCell,
          siteCell,
          statusCell,
          actionCell,
        );
        tbody.append(row);
      });
    }

    table.append(thead, tbody);
    tableWrapper.append(table);

    const headerToolbar = createElement(
      "div",
      "assets-workspace__header-toolbar",
    );
    headerToolbar.append(header, toolbar);
    wrapper.append(headerToolbar, tableWrapper);

    return wrapper;
  }

  function getFilterLabel(value) {
    const found = ASSET_INVENTORY_FILTERS.find(([v]) => v === value);
    return found ? found[1] : "All";
  }

  function getFilteredAssetRecords(activeApp, search, filter) {
    let records = activeApp.records || [];

    if (search) {
      const searchLower = search.toLowerCase();
      records = records.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.assetNumber.toLowerCase().includes(searchLower) ||
          r.category.toLowerCase().includes(searchLower),
      );
    }

    if (filter && filter !== "all") {
      records = records.filter((r) => r.statusTone === filter);
    }

    return records;
  }

  function exportAssetsToCSV(records) {
    const headers = [
      "Asset Name",
      "Asset Number",
      "Category",
      "Site",
      "Status",
      "Assigned To",
      "Department",
      "Condition",
      "Serial Number",
    ];
    const rows = records.map((r) => [
      `"${r.name}"`,
      `"${r.assetNumber}"`,
      `"${r.category}"`,
      `"${r.location}"`,
      `"${r.status}"`,
      `"${r.assignedTo}"`,
      `"${r.department}"`,
      `"${r.condition}"`,
      `"${r.serialNumber}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `assets_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function importAssetsFromCSV(file, activeApp) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").filter((line) => line.trim());
      if (lines.length < 2) return;

      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/"/g, ""));
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        const cleanValues = values.map((v) => v.replace(/"/g, "").trim());

        if (cleanValues.length >= 4) {
          const manualCode = cleanValues[1] || `FA${String(activeApp.records.length + 1).padStart(3, "0")}`;
          const category = cleanValues[2] || "Elektronik";
          const location = cleanValues[3] || "BSD";
          const assetNumber = generateAssetNumber(manualCode, category, location);

          const newRecord = {
            id: assetNumber,
            assetNumber: assetNumber,
            name: cleanValues[0] || "New Asset",
            category: category,
            location: location,
            status: cleanValues[4] || "Active",
            statusTone: getAssetStatusTone(cleanValues[4] || "Active"),
            assignedTo: cleanValues[5] || "-",
            department: cleanValues[6] || "-",
            condition: cleanValues[7] || "Ready to deploy",
            serialNumber: cleanValues[8] || "-",
            purchaseDate: formatAssetDateLabel(new Date()),
            valueLabel: "Rp 0",
            notes: "",
            dueLabel: "-",
          };
          activeApp.records.push(newRecord);
        }
      }
      render();
    };
    reader.readAsText(file);
  }

  // ===== USER MANAGEMENT FUNCTIONS =====

  function getUserStatusTone(status) {
    const tones = {
      Active: "active",
      Pending: "pending",
      Suspended: "suspended",
    };

    return tones[status] ?? "active";
  }

  function getFilteredUserRecords(activeApp, search, filter) {
    let records = activeApp.users || [];

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      records = records.filter((record) =>
        record.name?.toLowerCase().includes(searchLower) ||
        record.email?.toLowerCase().includes(searchLower) ||
        record.department?.toLowerCase().includes(searchLower) ||
        record.position?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filter && filter !== "all") {
      const filterMap = {
        active: "Active",
        pending: "Pending",
        suspended: "Suspended",
      };
      const targetStatus = filterMap[filter];
      if (targetStatus) {
        records = records.filter((record) => record.status === targetStatus);
      }
    }

    return records;
  }

  function exportUsersToCSV(records) {
    if (records.length === 0) {
      alert("No users to export");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Department", "Position", "Join Date", "Role", "Status"];
    const csvRows = [headers.join(",")];

    records.forEach((record) => {
      const row = [
        `"${record.name}"`,
        `"${record.email}"`,
        `"${record.phone || ""}"`,
        `"${record.department}"`,
        `"${record.position}"`,
        `"${record.joinDate}"`,
        `"${record.role}"`,
        `"${record.status}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `users-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importUsersFromCSV(file, activeApp) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length < 2) {
        alert("CSV file is empty or invalid");
        return;
      }

      // Skip header row
      const dataLines = lines.slice(1);
      let imported = 0;

      dataLines.forEach((line, index) => {
        const values = parseCSVRow(line);

        if (values.length >= 5) {
          const newId = `usr-${Date.now()}-${index}`;
          const status = values[7]?.replace(/"/g, "") || "Active";
          const newUser = {
            id: newId,
            name: values[0]?.replace(/"/g, "") || "New User",
            email: values[1]?.replace(/"/g, "") || "",
            phone: values[2]?.replace(/"/g, "") || "081234567890",
            department: values[3]?.replace(/"/g, "") || "Unassigned",
            position: values[4]?.replace(/"/g, "") || "Staff",
            joinDate: values[5]?.replace(/"/g, "") || new Date().toISOString().split("T")[0],
            role: values[6]?.replace(/"/g, "") || "custom",
            permissions: values[6]?.replace(/"/g, "") === "admin"
              ? ["dashboard", "calendar", "employee-journey", "assets", "settings"]
              : ["dashboard"],
            sendInvitation: true,
            status: status,
            statusTone: getUserStatusTone(status),
          };
          activeApp.users.push(newUser);
          imported++;
        }
      });

      alert(`Successfully imported ${imported} user${imported === 1 ? "" : "s"}`);
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

  function createUsersWorkspace(activeApp) {
    const wrapper = createElement("section", "users-workspace");
    const meta = USER_PAGE_META["All Users"];
    
    const allKebabMenus = [];
    
    function closeAllKebabMenus(except = null) {
      allKebabMenus.forEach(({ dropdown }) => {
        if (dropdown !== except) {
          dropdown.classList.remove("is-open");
        }
      });
    }

    // ===== HEADER TOOLBAR (sticky) =====
    const headerToolbar = createElement("div", "users-workspace__header-toolbar");

    // ===== HEADER =====
    const header = createElement("div", "users-workspace__header");
    const titleBlock = createElement("div", "users-workspace__title-block");
    const eyebrow = createElement("p", "users-workspace__eyebrow", meta.eyebrow);
    const title = createElement("h2", "users-workspace__title", meta.title);
    const actions = createElement("div", "users-workspace__actions");
    const importBtn = createElement("button", "users-workspace__btn");
    const exportBtn = createElement("button", "users-workspace__btn");

    importBtn.type = "button";
    importBtn.setAttribute("aria-label", "Import users");
    importBtn.append(createIcon("import"), createElement("span", null, "Import"));

    exportBtn.type = "button";
    exportBtn.setAttribute("aria-label", "Export users");
    exportBtn.append(createIcon("export"), createElement("span", null, "Export"));

    exportBtn.addEventListener("click", () => {
      const filteredRecords = getFilteredUserRecords(
        activeApp,
        state.users.search,
        state.users.filter,
      );
      exportUsersToCSV(filteredRecords);
    });

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        importUsersFromCSV(file, activeApp);
      }
      fileInput.value = "";
    });
    importBtn.addEventListener("click", () => fileInput.click());

    titleBlock.append(eyebrow, title);
    actions.append(importBtn, exportBtn, fileInput);
    header.append(titleBlock, actions);

    // ===== TOOLBAR =====
    const toolbar = createElement("div", "users-workspace__toolbar");
    const searchWrap = createElement("div", "users-workspace__search");
    const searchInput = createElement("input", "users-workspace__search-input");
    const searchIcon = createElement("span", "users-workspace__search-icon");
    const filterWrap = createElement("div", "users-workspace__filter");
    const filterBtn = createElement("button", "users-workspace__filter-btn");
    const filterIcon = createElement("span", "users-workspace__filter-icon");
    const filterDropdown = createElement("div", "users-workspace__filter-dropdown");

    searchInput.type = "text";
    searchInput.placeholder = "Search users...";
    searchInput.setAttribute("aria-label", "Search users by name, email, department, or position");
    searchInput.value = state.users.search;
    searchInput.addEventListener("input", (e) => {
      state.users.search = e.target.value;
      render();
    });

    searchIcon.append(createIcon("search"));

    filterDropdown.setAttribute("role", "listbox");
    filterDropdown.setAttribute("aria-label", "Filter options");

    filterBtn.type = "button";
    filterBtn.setAttribute("aria-label", "Filter users");
    filterBtn.setAttribute("aria-haspopup", "listbox");
    filterBtn.setAttribute("aria-expanded", "false");
    filterIcon.append(createIcon("filter"));
    filterBtn.append(
      filterIcon,
      createElement("span", null, getFilterLabel(state.users.filter)),
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

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isFilterOpen) {
        isFilterOpen = false;
        filterDropdown.classList.remove("is-open");
        filterBtn.setAttribute("aria-expanded", "false");
        filterBtn.focus();
      }
    });

    filterDropdown.addEventListener("click", (e) => e.stopPropagation());

    USERS_FILTERS.forEach(([value, label]) => {
      const isActive = state.users.filter === value;
      const option = createElement(
        "button",
        `users-workspace__filter-option${isActive ? " is-active" : ""}`,
        label,
      );
      option.type = "button";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(isActive));
      option.addEventListener("click", () => {
        state.users.filter = value;
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

    const filteredRecords = getFilteredUserRecords(
      activeApp,
      state.users.search,
      state.users.filter,
    );
    const totalCount = activeApp.users?.length || 0;
    const countLabel = createElement("span", "users-workspace__count", `Showing ${filteredRecords.length} of ${totalCount} users`);

    toolbar.append(searchWrap, filterWrap, countLabel);

    headerToolbar.append(header, toolbar);

    // ===== TABLE =====
    const tableWrapper = createElement("div", "users-workspace__table-wrapper");
    const table = createElement("table", "users-workspace__table");
    const thead = createElement("thead");
    const tbody = createElement("tbody");

    tbody.addEventListener("scroll", () => {
      if (tbody.scrollTop > 0) {
        table.classList.add("users-workspace__table-body--scrolled");
      } else {
        table.classList.remove("users-workspace__table-body--scrolled");
      }
    });

    const headerRow = createElement("tr");

    const columns = [
      { label: "NAME", width: "20%" },
      { label: "EMAIL", width: "24%" },
      { label: "DEPARTMENT", width: "16%" },
      { label: "POSITION", width: "16%" },
      { label: "JOIN DATE", width: "18%" },
      { label: "ACTION", width: "6%" },
    ];

    columns.forEach((col, index) => {
      const th = createElement("th", `col-${index}`, col.label);
      headerRow.append(th);
    });

    thead.append(headerRow);

    if (filteredRecords.length === 0) {
      const emptyRow = createElement("tr", "users-workspace__empty-row");
      const emptyCell = createElement("td", null, "No users found");
      emptyCell.colSpan = 6;
      emptyRow.append(emptyCell);
      tbody.append(emptyRow);
    } else {
      allKebabMenus.length = 0;
      filteredRecords.forEach((record) => {
        const row = createElement("tr");
        row.dataset.userId = record.id;

        // Name cell
        const nameCell = createElement("td", "col-0", record.name);

        // Email cell
        const emailCell = createElement("td", "col-1", record.email);

        // Department cell
        const departmentCell = createElement("td", "col-2", record.department);

        // Position cell
        const positionCell = createElement("td", "col-3", record.position);

        // Join Date cell - format date as DD/MM/YYYY
        const formatDate = (dateStr) => {
          const date = new Date(dateStr);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };
        const joinDateCell = createElement("td", "col-4", formatDate(record.joinDate));

        // Action cell with kebab
        const actionCell = createElement("td", "col-5 users-workspace__action-cell");
        const kebabBtn = createElement("button", "users-workspace__kebab-btn");
        kebabBtn.type = "button";
        kebabBtn.setAttribute("aria-label", "User actions");
        kebabBtn.innerHTML = '<span style="font-size:16px;color:#666;">⋮</span>';

        const kebabDropdown = createElement("div", "users-workspace__kebab-dropdown");
        kebabDropdown.setAttribute("role", "menu");

        const menuItems = [
          {
            label: "View",
            icon: "eye",
            action: () => viewUser(record),
          },
          {
            label: "Edit",
            icon: "edit",
            action: () => editUser(record),
          },
          {
            label: "Delete",
            icon: "trash",
            action: () => removeUser(record, activeApp),
            danger: true,
          },
        ];

        const iconSvgs = {
          eye: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
          edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
          trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
        };

        menuItems.forEach((item) => {
          const menuBtn = createElement(
            "button",
            `users-workspace__kebab-option${item.danger ? " is-danger" : ""}`,
          );
          menuBtn.type = "button";
          menuBtn.setAttribute("role", "menuitem");
          menuBtn.innerHTML = `${iconSvgs[item.icon]}<span>${item.label}</span>`;
          menuBtn.addEventListener("click", () => {
            item.action();
            isKebabOpen = false;
            kebabDropdown.classList.remove("is-open");
          });
          kebabDropdown.appendChild(menuBtn);
        });

        allKebabMenus.push({ btn: kebabBtn, dropdown: kebabDropdown });

        let isKebabOpen = false;

        kebabBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const rect = kebabBtn.getBoundingClientRect();
          const dropdownHeight = 120;
          const spaceBelow = window.innerHeight - rect.bottom;
          
          kebabDropdown.style.right = "auto";
          kebabDropdown.style.left = rect.right - 150 + "px";
          
          if (spaceBelow < dropdownHeight) {
            kebabDropdown.style.top = rect.top - dropdownHeight - 4 + "px";
          } else {
            kebabDropdown.style.top = rect.bottom + 4 + "px";
          }
          
          closeAllKebabMenus(kebabDropdown);
          isKebabOpen = !isKebabOpen;
          kebabDropdown.classList.toggle("is-open", isKebabOpen);
        });

        document.addEventListener("click", () => {
          isKebabOpen = false;
          kebabDropdown.classList.remove("is-open");
        });

        actionCell.append(kebabBtn, kebabDropdown);

        row.append(nameCell, emailCell, departmentCell, positionCell, joinDateCell, actionCell);
        tbody.append(row);
      });
    }

    table.append(thead, tbody);
    tableWrapper.append(table);

    // ===== ASSEMBLE =====
    wrapper.append(headerToolbar, tableWrapper);

    return wrapper;
  }

  function viewUser(user) {
    state.lastAction = "view-user";
    state.currentUserId = user.id;
    state.userDetailMode = "view";
    state.userDraft = {
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      department: user.department,
      position: user.position,
      joinDate: user.joinDate,
      id: user.id,
    };
    state.isUserDetailDrawerOpen = true;
    render();
  }

  function editUser(user) {
    state.lastAction = "edit-user";
    state.currentUserId = user.id;
    state.userDetailMode = "edit";
    state.userDraft = {
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      department: user.department,
      position: user.position,
      joinDate: user.joinDate,
      id: user.id,
    };
    state.isUserDetailDrawerOpen = true;
    render();
  }

  function removeUser(user, activeApp) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?`,
    );
    if (confirmed) {
      activeApp.users = activeApp.users.filter((u) => u.id !== user.id);
      render();
    }
  }

  function closeUserDetailDrawer() {
    const overlay = shell.querySelector(".user-detail-drawer-overlay");

    if (overlay) {
      overlay.classList.remove("is-open");

      setTimeout(() => {
        state.isUserDetailDrawerOpen = false;
        state.userDetailMode = "view";
        state.currentUserId = null;
        state.userDraft = getInitialUserDraft();

        if (overlay.isConnected) {
          overlay.remove();
        }

        render();
      }, 360);
    } else {
      state.isUserDetailDrawerOpen = false;
      state.userDetailMode = "view";
      state.currentUserId = null;
      state.userDraft = getInitialUserDraft();
      render();
    }
  }

  function saveUserDetailDrawer() {
    const userManagementApp = workspaceApps.find(app => app.id === "user-management");
    if (userManagementApp) {
      userManagementApp.users = userManagementApp.users || [];
      const existingIndex = userManagementApp.users.findIndex(u => u.id === state.userDraft.id);
      if (existingIndex >= 0) {
        userManagementApp.users[existingIndex] = { ...state.userDraft };
      } else {
        userManagementApp.users.push({ ...state.userDraft });
      }
    }
    closeUserDetailDrawer();
  }

  function openAssetDetailDrawer(record, activeApp) {
    state.selectedRecordId = record.id;
    state.activeItem = "Assets";
    state.lastAction = "asset-detail";
    render();
  }

  function openAssetEditDrawer(record, activeApp) {
    state.editingAssetId = record.id;
    state.draft = { ...record };
    state.activeItem = "Assets";
    state.lastAction = "asset-edit";
    render();
  }

  function confirmDeleteAsset(record, activeApp) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${record.name}"?`,
    );
    if (confirmed) {
      activeApp.records = activeApp.records.filter((r) => r.id !== record.id);
      render();
    }
  }

  function animateCloseEventDrawer(onClosed) {
    const overlay = shell.querySelector(".event-drawer-overlay");

    if (!overlay) {
      onClosed();
      return;
    }

    if (overlay.dataset.closing === "true") {
      return;
    }

    overlay.dataset.closing = "true";
    overlay.__cleanupOutsideHandler?.();
    overlay.classList.remove("is-open");

    window.setTimeout(() => {
      if (overlay.isConnected) {
        overlay.remove();
      }

      onClosed();
    }, 360);
  }

  function closeEventDrawer() {
    animateCloseEventDrawer(() => {
      state.eventDraft.isDatePickerOpen = false;
      state.eventDraft.openTimeField = null;
      state.eventDraft.isParticipantPopupOpen = false;
      state.attachmentViewer.isOpen = false;
      state.attachmentViewer.attachment = null;
      state.eventDrawerMode = "create";
      state.activeDrawerEventId = null;
      state.isEventDrawerOpen = false;
      render();
    });
  }

  function closeUserDrawer() {
    state.isUserDrawerOpen = false;
    state.userDraft = getInitialUserDraft();
    render();
  }

  function closeSiteDrawer() {
    state.isSiteDrawerOpen = false;
    state.siteDraft = getInitialSiteDraft();
    render();
  }

  function closeSiteDrawer() {
    const overlay = shell.querySelector(".site-drawer-overlay");

    if (overlay) {
      overlay.classList.remove("is-open");

      setTimeout(() => {
        state.isSiteDrawerOpen = false;
        state.siteDraft = getInitialSiteDraft();

        if (overlay.isConnected) {
          overlay.remove();
        }

        render();
      }, 360);
    } else {
      state.isSiteDrawerOpen = false;
      state.siteDraft = getInitialSiteDraft();
      render();
    }
  }

  function closeDeptDrawer() {
    const overlay = shell.querySelector(".dept-drawer-overlay");

    if (overlay) {
      overlay.classList.remove("is-open");

      setTimeout(() => {
        state.isDeptDrawerOpen = false;
        state.deptDraft = getInitialDeptDraft();

        if (overlay.isConnected) {
          overlay.remove();
        }

        render();
      }, 360);
    } else {
      state.isDeptDrawerOpen = false;
      state.deptDraft = getInitialDeptDraft();
      render();
    }
  }

  function openSiteDrawer() {
    state.lastAction = "new-site";
    state.siteDraft = getInitialSiteDraft();
    state.isSiteDrawerOpen = true;
    render();
  }

  function openDeptDrawer() {
    state.lastAction = "new-dept";
    state.deptDraft = getInitialDeptDraft();
    state.isDeptDrawerOpen = true;
    render();
  }

  function viewSite(site) {
    state.lastAction = "view-site";
    state.currentSiteId = site.id;
    state.siteDetailMode = "view";
    state.siteDraft = {
      name: site.name,
      code: site.code,
      address: site.address,
      id: site.id,
    };
    state.isSiteDetailDrawerOpen = true;
    render();
  }

  function editSite(site) {
    state.lastAction = "edit-site";
    state.currentSiteId = site.id;
    state.siteDetailMode = "edit";
    state.siteDraft = {
      name: site.name,
      code: site.code,
      address: site.address,
      id: site.id,
    };
    state.isSiteDetailDrawerOpen = true;
    render();
  }

  function removeSite(site) {
    const userManagementApp = workspaceApps.find(app => app.id === "user-management");
    if (userManagementApp && userManagementApp.sites) {
      userManagementApp.sites = userManagementApp.sites.filter(s => s.id !== site.id);
    }
    render();
  }

  function viewDept(dept) {
    state.lastAction = "view-dept";
    state.currentDeptId = dept.id;
    state.deptDetailMode = "view";
    state.deptDraft = {
      name: dept.name,
      code: dept.code,
      site: dept.site,
      head: dept.head,
      id: dept.id,
    };
    state.isDeptDetailDrawerOpen = true;
    render();
  }

  function editDept(dept) {
    state.lastAction = "edit-dept";
    state.currentDeptId = dept.id;
    state.deptDetailMode = "edit";
    state.deptDraft = {
      name: dept.name,
      code: dept.code,
      site: dept.site,
      head: dept.head,
      id: dept.id,
    };
    state.isDeptDetailDrawerOpen = true;
    render();
  }

  function removeDept(dept) {
    const userManagementApp = workspaceApps.find(app => app.id === "user-management");
    if (userManagementApp && userManagementApp.departments) {
      userManagementApp.departments = userManagementApp.departments.filter(d => d.id !== dept.id);
    }
    render();
  }

  function closeSiteDetailDrawer() {
    const overlay = shell.querySelector(".site-detail-drawer-overlay");

    if (overlay) {
      overlay.classList.remove("is-open");

      setTimeout(() => {
        state.isSiteDetailDrawerOpen = false;
        state.siteDetailMode = "view";
        state.currentSiteId = null;
        state.siteDraft = getInitialSiteDraft();

        if (overlay.isConnected) {
          overlay.remove();
        }

        render();
      }, 360);
    } else {
      state.isSiteDetailDrawerOpen = false;
      state.siteDetailMode = "view";
      state.currentSiteId = null;
      state.siteDraft = getInitialSiteDraft();
      render();
    }
  }

  function closeDeptDetailDrawer() {
    const overlay = shell.querySelector(".dept-detail-drawer-overlay");

    if (overlay) {
      overlay.classList.remove("is-open");

      setTimeout(() => {
        state.isDeptDetailDrawerOpen = false;
        state.deptDetailMode = "view";
        state.currentDeptId = null;
        state.deptDraft = getInitialDeptDraft();

        if (overlay.isConnected) {
          overlay.remove();
        }

        render();
      }, 360);
    } else {
      state.isDeptDetailDrawerOpen = false;
      state.deptDetailMode = "view";
      state.currentDeptId = null;
      state.deptDraft = getInitialDeptDraft();
      render();
    }
  }

  function saveSiteDetailDrawer() {
    const userManagementApp = workspaceApps.find(app => app.id === "user-management");
    if (userManagementApp) {
      userManagementApp.sites = userManagementApp.sites || [];
      const existingIndex = userManagementApp.sites.findIndex(s => s.id === state.siteDraft.id);
      if (existingIndex >= 0) {
        userManagementApp.sites[existingIndex] = { ...state.siteDraft };
      } else {
        userManagementApp.sites.push({ ...state.siteDraft });
      }
    }
    closeSiteDetailDrawer();
  }

  function saveDeptDetailDrawer() {
    const userManagementApp = workspaceApps.find(app => app.id === "user-management");
    if (userManagementApp) {
      userManagementApp.departments = userManagementApp.departments || [];
      const existingIndex = userManagementApp.departments.findIndex(d => d.id === state.deptDraft.id);
      if (existingIndex >= 0) {
        userManagementApp.departments[existingIndex] = { ...state.deptDraft };
      } else {
        userManagementApp.departments.push({ ...state.deptDraft });
      }
    }
    closeDeptDetailDrawer();
  }

  function openAttachmentViewer(attachment) {
    state.attachmentViewer.isOpen = true;
    state.attachmentViewer.attachment = { ...attachment };
    render();
  }

  function closeAttachmentViewer() {
    state.attachmentViewer.isOpen = false;
    state.attachmentViewer.attachment = null;
    render();
  }

  function closeCalendarEventsPopup() {
    state.calendar.showAllEvents = false;
    render();
  }

  function openEventDetailDrawer(event) {
    syncCalendarToEvent(state, event);
    state.activeAppId = "calendar";
    state.activeItem = "Upcoming Events";
    state.lastAction = "event-detail";
    state.eventDrawerMode = "detail";
    state.activeDrawerEventId = event.id;
    state.calendar.showAllEvents = false;
    state.isEventDrawerOpen = true;
  }

  function createCalendarEventsPopup(activeApp, isOpen = false) {
    const monthEvents = getEventsForDisplayedMonth(activeApp, state).filter(
      isUpcomingEvent,
    );
    const overlay = createElement(
      "div",
      `calendar-events-modal-overlay${isOpen ? " is-open" : ""}`,
    );
    const backdrop = createElement(
      "button",
      "calendar-events-modal-overlay__backdrop",
    );
    const dialog = createElement("section", "calendar-events-modal");
    const header = createElement("div", "calendar-events-modal__header");
    const eyebrow = createElement(
      "span",
      "calendar-events-modal__eyebrow",
      "Upcoming Events",
    );
    const title = createElement(
      "h3",
      "calendar-events-modal__title",
      `${MONTH_NAMES[state.calendar.displayMonth]} ${state.calendar.displayYear}`,
    );
    const headerCopy = createElement(
      "div",
      "calendar-events-modal__header-copy",
    );
    const closeButton = createElement("button", "calendar-events-modal__close");
    const list = createElement("div", "calendar-events-modal__list");

    overlay.setAttribute("aria-hidden", String(!state.calendar.showAllEvents));
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", "All upcoming events");
    backdrop.type = "button";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close all events");
    closeButton.append(createIcon("close"));
    backdrop.addEventListener("click", closeCalendarEventsPopup);
    closeButton.addEventListener("click", (nativeEvent) => {
      nativeEvent.preventDefault();
      nativeEvent.stopPropagation();
      closeCalendarEventsPopup();
    });
    dialog.addEventListener("click", (nativeEvent) => {
      nativeEvent.stopPropagation();
    });

    const handleEscape = (nativeEvent) => {
      if (nativeEvent.key === "Escape") {
        closeCalendarEventsPopup();
      }
    };

    overlay.__cleanupEscapeHandler = () => {
      document.removeEventListener("keydown", handleEscape);
    };
    requestAnimationFrame(() => {
      document.addEventListener("keydown", handleEscape);
    });

    if (monthEvents.length === 0) {
      list.append(
        createElement(
          "p",
          "calendar-events-modal__empty",
          "No upcoming events in this month.",
        ),
      );
    } else {
      monthEvents.forEach((event) => {
        const card = createElement(
          "article",
          `calendar-events-modal__card${event.id === state.calendar.selectedEventId ? " is-active" : ""}`,
        );
        const accent = createElement("span", "calendar-events-modal__accent");
        const dayBlock = createElement("div", "calendar-events-modal__date");
        const day = createElement(
          "strong",
          "calendar-events-modal__day",
          String(event.day).padStart(2, "0"),
        );
        const month = createElement(
          "span",
          "calendar-events-modal__month",
          event.monthLabel,
        );
        const body = createElement("div", "calendar-events-modal__card-body");
        const titleText = createElement(
          "strong",
          "calendar-events-modal__card-title",
          event.title,
        );
        const meta = createElement(
          "span",
          "calendar-events-modal__card-meta",
          event.meta,
        );
        const tag = getNormalizedEventTag(event);
        const tagChip = createElement(
          "span",
          "calendar-events-modal__chip",
          tag,
        );
        const tagStyle = getEventTagStyle(tag);

        card.tabIndex = 0;
        card.role = "button";
        accent.style.setProperty("--event-accent", getEventSurfaceColor(event));
        tagChip.style.setProperty("--tag-color", tagStyle.color);
        tagChip.style.setProperty("--tag-text-color", tagStyle.textColor);
        card.addEventListener("click", () => {
          openEventDetailDrawer(event);
          render();
        });
        card.addEventListener("keydown", (nativeEvent) => {
          if (nativeEvent.key === "Enter" || nativeEvent.key === " ") {
            nativeEvent.preventDefault();
            openEventDetailDrawer(event);
            render();
          }
        });

        dayBlock.append(day, month);
        body.append(titleText, meta, tagChip);
        card.append(accent, dayBlock, body);
        list.append(card);
      });
    }

    headerCopy.append(eyebrow, title);
    header.append(headerCopy, closeButton);
    dialog.append(header, list);
    overlay.append(backdrop, dialog);

    return overlay;
  }

  function saveEventDraft() {
    const calendarApp = getCalendarApp();
    const newEvents = buildEventFromDraft(state);

    newEvents.forEach((event) => {
      calendarApp.events.push(event);
    });
    sortCalendarEvents(calendarApp.events);
    syncCalendarToEvent(state, newEvents[0]);
    state.activeAppId = "calendar";
    state.activeItem = "Upcoming Events";
    state.lastAction = "event-created";
    state.calendar.showAllEvents = false;
    state.eventDrawerMode = "create";
    state.activeDrawerEventId = null;
    state.isEventDrawerOpen = false;
    state.eventDraft = getInitialEventDraft();
    render();
  }

  function createUserDrawer(state, closeDrawer, onSave, isOpen = false) {
    const overlay = createElement(
      "div",
      `user-drawer-overlay${isOpen ? " is-open" : ""}`,
    );
    const backdrop = createElement("button", "user-drawer-overlay__backdrop");
    const drawer = createElement("aside", "user-drawer");
    const header = createElement("div", "user-drawer__header");
    const headerLeft = createElement("div", "user-drawer__header-left");
    const backButton = createElement("button", "user-drawer__back");
    const title = createElement("h2", "user-drawer__title", "New User");
    const closeButton = createElement("button", "user-drawer__close");
    const body = createElement("div", "user-drawer__body");

    overlay.setAttribute("aria-hidden", String(!state.isUserDrawerOpen));
    drawer.setAttribute("aria-label", "New user drawer");
    backdrop.type = "button";
    backButton.type = "button";
    closeButton.type = "button";
    backButton.append(createIcon("chevron-left"));
    closeButton.append(createIcon("close"));
    backdrop.addEventListener("click", closeDrawer);
    backButton.addEventListener("click", closeDrawer);
    closeButton.addEventListener("click", closeDrawer);

    // ===== BASIC INFORMATION SECTION =====
    const basicInfoSection = createElement("div", "drawer-form__section");
    basicInfoSection.append(createSectionLabel("user", "Basic Information"));

    // Name field (required)
    const nameGroup = createElement("div", "drawer-form__group");
    const nameLabel = createElement("label", "drawer-form__label");
    nameLabel.append(createElement("span", "", "Full Name"), createElement("span", "drawer-form__required", " *"));
    const nameInput = createElement("input", "drawer-form__title-input");
    nameInput.type = "text";
    nameInput.value = state.userDraft.name;
    nameInput.placeholder = "Enter full name";
    nameInput.required = true;
    nameInput.addEventListener("input", (event) => {
      state.userDraft.name = event.target.value;
    });
    nameGroup.append(nameLabel, nameInput);
    basicInfoSection.append(nameGroup);

    // Email and Phone in 2 columns
    const emailPhoneRow = createElement("div", "drawer-form__row-2col");

    // Email field (required)
    const emailGroup = createElement("div", "drawer-form__group");
    const emailLabel = createElement("label", "drawer-form__label");
    emailLabel.append(createElement("span", "", "Email"), createElement("span", "drawer-form__required", " *"));
    const emailInput = createElement("input", "drawer-form__title-input");
    emailInput.type = "email";
    emailInput.value = state.userDraft.email;
    emailInput.placeholder = "user@company.com";
    emailInput.required = true;
    emailInput.addEventListener("input", (event) => {
      state.userDraft.email = event.target.value;
    });
    emailGroup.append(emailLabel, emailInput);

    // Phone field
    const phoneGroup = createElement("div", "drawer-form__group");
    const phoneLabel = createElement("label", "drawer-form__label", "Phone");
    const phoneInput = createElement("input", "drawer-form__title-input");
    phoneInput.type = "tel";
    phoneInput.value = state.userDraft.phone;
    phoneInput.placeholder = "081234567890";
    phoneInput.addEventListener("input", (event) => {
      state.userDraft.phone = event.target.value;
    });
    phoneGroup.append(phoneLabel, phoneInput);

    emailPhoneRow.append(emailGroup, phoneGroup);
    basicInfoSection.append(emailPhoneRow);

    // ===== WORK INFORMATION SECTION =====
    const workInfoSection = createElement("div", "drawer-form__section");
    workInfoSection.append(createSectionLabel("briefcase", "Work Information"));

    // Department and Position in 2 columns
    const deptPositionRow = createElement("div", "drawer-form__row-2col");

    // Department dropdown (required)
    const departmentGroup = createElement("div", "drawer-form__group");
    const departmentLabel = createElement("label", "drawer-form__label");
    departmentLabel.append(createElement("span", "", "Department"), createElement("span", "drawer-form__required", " *"));
    const departmentSelect = createElement("select", "drawer-form__title-input");
    departmentSelect.required = true;
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select department";
    defaultOption.disabled = true;
    defaultOption.selected = !state.userDraft.department;
    departmentSelect.append(defaultOption);
    const allDepartments = getDepartments();
    allDepartments.forEach((dept) => {
      const option = document.createElement("option");
      option.value = dept.name;
      option.textContent = dept.name;
      if (dept.name === state.userDraft.department) option.selected = true;
      departmentSelect.append(option);
    });
    departmentSelect.addEventListener("change", (event) => {
      state.userDraft.department = event.target.value;
    });
    departmentGroup.append(departmentLabel, departmentSelect);

    // Position field (required)
    const positionGroup = createElement("div", "drawer-form__group");
    const positionLabel = createElement("label", "drawer-form__label");
    positionLabel.append(createElement("span", "", "Position"), createElement("span", "drawer-form__required", " *"));
    const positionInput = createElement("input", "drawer-form__title-input");
    positionInput.type = "text";
    positionInput.value = state.userDraft.position;
    positionInput.placeholder = "e.g. HR Manager, Developer, etc.";
    positionInput.required = true;
    positionInput.addEventListener("input", (event) => {
      state.userDraft.position = event.target.value;
    });
    positionGroup.append(positionLabel, positionInput);

    deptPositionRow.append(departmentGroup, positionGroup);
    workInfoSection.append(deptPositionRow);

    // Join Date field
    const joinDateGroup = createElement("div", "drawer-form__group");
    const joinDateLabel = createElement("label", "drawer-form__label", "Join Date");
    const joinDateInput = createElement("input", "drawer-form__date-input");
    joinDateInput.type = "date";
    joinDateInput.value = getDraftDatePart(state.userDraft.joinDate);
    joinDateInput.addEventListener("change", (event) => {
      state.userDraft.joinDate = event.target.value;
    });
    joinDateGroup.append(joinDateLabel, joinDateInput);
    workInfoSection.append(joinDateGroup);

    // ===== ACCESS & SECURITY SECTION =====
    const accessSection = createElement("div", "drawer-form__section");
    accessSection.append(createSectionLabel("shield", "Access & Security"));

    // Password and Confirm Password in 2 columns
    const passwordRow = createElement("div", "drawer-form__row-2col");

    // Password field (required)
    const passwordGroup = createElement("div", "drawer-form__group");
    const passwordLabel = createElement("label", "drawer-form__label");
    passwordLabel.append(createElement("span", "", "Password"), createElement("span", "drawer-form__required", " *"));
    const passwordWrap = createElement("div", "drawer-form__password-wrap");
    const passwordInput = createElement("input", "drawer-form__input");
    passwordInput.type = "password";
    passwordInput.value = state.userDraft.password;
    passwordInput.placeholder = "Enter password (min. 6 characters)";
    passwordInput.required = true;
    const passwordToggle = createElement("button", "drawer-form__password-toggle");
    passwordToggle.type = "button";
    passwordToggle.setAttribute("aria-label", "Toggle password visibility");
    passwordToggle.append(createIcon("eye"));
    passwordToggle.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      passwordToggle.innerHTML = "";
      passwordToggle.append(createIcon(isPassword ? "eye-off" : "eye"));
    });
    passwordWrap.append(passwordInput, passwordToggle);
    passwordGroup.append(passwordLabel, passwordWrap);

    // Confirm Password field (required)
    const confirmPasswordGroup = createElement("div", "drawer-form__group");
    const confirmPasswordLabel = createElement("label", "drawer-form__label");
    confirmPasswordLabel.append(createElement("span", "", "Confirm Password"), createElement("span", "drawer-form__required", " *"));
    const confirmPasswordWrap = createElement("div", "drawer-form__password-wrap");
    const confirmPasswordInput = createElement("input", "drawer-form__input");
    confirmPasswordInput.type = "password";
    confirmPasswordInput.value = state.userDraft.confirmPassword;
    confirmPasswordInput.placeholder = "Confirm password";
    confirmPasswordInput.required = true;
    const confirmPasswordToggle = createElement("button", "drawer-form__password-toggle");
    confirmPasswordToggle.type = "button";
    confirmPasswordToggle.setAttribute("aria-label", "Toggle confirm password visibility");
    confirmPasswordToggle.append(createIcon("eye"));
    confirmPasswordToggle.addEventListener("click", () => {
      const isPassword = confirmPasswordInput.type === "password";
      confirmPasswordInput.type = isPassword ? "text" : "password";
      confirmPasswordToggle.innerHTML = "";
      confirmPasswordToggle.append(createIcon(isPassword ? "eye-off" : "eye"));
    });
    confirmPasswordWrap.append(confirmPasswordInput, confirmPasswordToggle);
    confirmPasswordGroup.append(confirmPasswordLabel, confirmPasswordWrap);

    passwordRow.append(passwordGroup, confirmPasswordGroup);
    accessSection.append(passwordRow);

    // Role selection
    const roleGroup = createElement("div", "drawer-form__group");
    const roleLabel = createElement("label", "drawer-form__label", "Role");
    const roleOptionsContainer = createElement("div", "drawer-form__role-options");

    const adminOption = createElement("label", "drawer-form__role-option");
    const adminRadio = document.createElement("input");
    adminRadio.type = "radio";
    adminRadio.name = "user-role";
    adminRadio.value = "admin";
    adminRadio.checked = state.userDraft.role === "admin";
    adminOption.append(adminRadio, createElement("span", "", " Admin"));

    const customOption = createElement("label", "drawer-form__role-option");
    const customRadio = document.createElement("input");
    customRadio.type = "radio";
    customRadio.name = "user-role";
    customRadio.value = "custom";
    customRadio.checked = state.userDraft.role === "custom";
    customOption.append(customRadio, createElement("span", "", " Custom"));

    roleOptionsContainer.append(adminOption, customOption);
    roleGroup.append(roleLabel, roleOptionsContainer);
    accessSection.append(roleGroup);

    // Permissions checkbox group
    const permissionsGroup = createElement("div", "drawer-form__group");
    const permissionsLabel = createElement("label", "drawer-form__label", "Permissions");
    const permissionsList = createElement("div", "drawer-form__permissions-list");

    const availablePermissions = [
      { id: "dashboard", label: "Dashboard" },
      { id: "calendar", label: "Calendar" },
      { id: "employee-journey", label: "Employee Journey" },
      { id: "assets", label: "Assets" },
      { id: "settings", label: "Settings" },
    ];

    // Store permission checkbox and label references for role-based updates
    const permissionCheckboxes = [];
    const permissionLabels = [];

    availablePermissions.forEach((perm) => {
      const permLabel = createElement("label", "drawer-form__permission-item");
      const permCheckbox = document.createElement("input");
      permCheckbox.type = "checkbox";
      permCheckbox.value = perm.id;
      permCheckbox.checked = state.userDraft.permissions.includes(perm.id);
      permCheckbox.addEventListener("change", (event) => {
        if (event.target.checked) {
          state.userDraft.permissions.push(perm.id);
        } else {
          state.userDraft.permissions = state.userDraft.permissions.filter((p) => p !== perm.id);
        }
      });
      permLabel.append(permCheckbox, createElement("span", "", perm.label));
      permissionsList.append(permLabel);
      permissionCheckboxes.push(permCheckbox);
      permissionLabels.push(permLabel);
    });

    permissionsGroup.append(permissionsLabel, permissionsList);
    accessSection.append(permissionsGroup);

    // Helper function to update permissions based on role
    const updatePermissionsForRole = (role) => {
      if (role === "admin") {
        // Admin: all permissions checked and disabled
        state.userDraft.permissions = availablePermissions.map(p => p.id);
        permissionCheckboxes.forEach(cb => {
          cb.checked = true;
          cb.disabled = true;
        });
        permissionLabels.forEach(label => label.style.opacity = "0.5");
      } else {
        // Custom: all permissions unchecked, enabled, user can manually select
        state.userDraft.permissions = [];
        permissionCheckboxes.forEach(cb => {
          cb.checked = false;
          cb.disabled = false;
        });
        permissionLabels.forEach(label => label.style.opacity = "1");
      }
    };

    // Set initial state based on current role
    if (state.userDraft.role === "admin") {
      updatePermissionsForRole("admin");
    }

    // Role change handlers - must be added after permission checkboxes are created
    adminRadio.addEventListener("change", () => {
      state.userDraft.role = "admin";
      updatePermissionsForRole("admin");
    });

    customRadio.addEventListener("change", () => {
      state.userDraft.role = "custom";
      updatePermissionsForRole("custom");
    });

    // Send invitation toggle
    const invitationGroup = createElement("div", "drawer-form__group");
    const invitationLabel = createElement("label", "drawer-form__invitation-label");
    const invitationToggle = document.createElement("input");
    invitationToggle.type = "checkbox";
    invitationToggle.checked = state.userDraft.sendInvitation;
    invitationToggle.addEventListener("change", (event) => {
      state.userDraft.sendInvitation = event.target.checked;
    });
    invitationLabel.append(
      invitationToggle,
      createElement("span", "", " Send invitation email with login credentials")
    );
    invitationGroup.append(invitationLabel);
    accessSection.append(invitationGroup);

    // ===== FOOTER WITH SAVE AND CANCEL BUTTONS =====
    const footer = createElement("div", "user-drawer__footer");
    const footerLeft = createElement("div", "user-drawer__footer-actions");
    const cancelButton = createElement(
      "button",
      "user-drawer__button user-drawer__button--ghost",
      "Cancel",
    );
    const saveButton = createElement(
      "button",
      "user-drawer__button user-drawer__button--primary",
      "Save",
    );

    const saveEnabled = isUserDraftValid(state.userDraft);
    cancelButton.type = "button";
    saveButton.type = "button";
    saveButton.disabled = !saveEnabled;
    cancelButton.addEventListener("click", closeDrawer);
    saveButton.addEventListener("click", () => {
      if (!isUserDraftValid(state.userDraft)) {
        return;
      }
      onSave();
    });
    footerLeft.append(saveButton, cancelButton);
    footer.append(footerLeft);

    // Update password field listeners to also update save button state
    passwordInput.addEventListener("input", (event) => {
      state.userDraft.password = event.target.value;
      saveButton.disabled = !isUserDraftValid(state.userDraft);
    });
    confirmPasswordInput.addEventListener("input", (event) => {
      state.userDraft.confirmPassword = event.target.value;
      saveButton.disabled = !isUserDraftValid(state.userDraft);
    });

    headerLeft.append(backButton, title);
    header.append(headerLeft, closeButton);
    body.append(basicInfoSection, workInfoSection, accessSection);
    drawer.append(header, body, footer);
    overlay.append(backdrop, drawer);

    return overlay;
  }

  function saveUserDraft() {
    const userApp = getUserManagementApp();
    const newUser = {
      id: `usr-${Date.now()}`,
      name: state.userDraft.name,
      email: state.userDraft.email,
      phone: state.userDraft.phone,
      department: state.userDraft.department,
      position: state.userDraft.position,
      joinDate: state.userDraft.joinDate,
      role: state.userDraft.role,
      permissions: state.userDraft.role === "admin" ? [] : state.userDraft.permissions,
      status: state.userDraft.status,
    };

    userApp.users.push(newUser);
    state.activeItem = "All Users";
    state.lastAction = "user-created";
    state.isUserDrawerOpen = false;
    state.userDraft = getInitialUserDraft();
    render();
  }

  // ===== ASSET DRAWER FUNCTIONS =====

  function isAssetDraftValid(draft) {
    return draft.name?.trim() &&
           draft.manualCode?.trim() &&
           draft.category &&
           draft.site &&
           draft.status;
  }

  function createAssetDrawer(state, closeDrawer, onSave, isOpen = false) {
    const overlay = createElement(
      "div",
      `asset-drawer-overlay${isOpen ? " is-open" : ""}`,
    );
    const backdrop = createElement("button", "asset-drawer-overlay__backdrop");
    const drawer = createElement("aside", "asset-drawer");
    const header = createElement("div", "asset-drawer__header");
    const headerLeft = createElement("div", "asset-drawer__header-left");
    const backButton = createElement("button", "asset-drawer__back");
    const title = createElement("h2", "asset-drawer__title", "New Asset");
    const closeButton = createElement("button", "asset-drawer__close");
    const body = createElement("div", "asset-drawer__body");

    overlay.setAttribute("aria-hidden", String(!state.isAssetDrawerOpen));
    drawer.setAttribute("aria-label", "New asset drawer");
    backdrop.type = "button";
    backButton.type = "button";
    closeButton.type = "button";
    backButton.append(createIcon("chevron-left"));
    closeButton.append(createIcon("close"));
    backdrop.addEventListener("click", closeDrawer);
    backButton.addEventListener("click", closeDrawer);
    closeButton.addEventListener("click", closeDrawer);

    // ===== ASSET IMAGE SECTION =====
    const imageSection = createElement("div", "drawer-form__section");
    imageSection.append(createSectionLabel("image", "Asset Image"));

    const imageGroup = createElement("div", "drawer-form__group");
    const imagePreview = createElement("div", "asset-drawer__image-preview");

    if (state.assetDraft.assetImage) {
      const img = document.createElement("img");
      img.src = state.assetDraft.assetImage;
      img.alt = "Asset preview";
      imagePreview.append(img);
    } else {
      imagePreview.append(createElement("div", "asset-drawer__image-placeholder", "+ Add Image"));
    }

    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.accept = "image/*";
    imageInput.style.display = "none";

    // Function to update image preview without re-rendering
    const updateImagePreview = (imageData) => {
      imagePreview.innerHTML = "";
      if (imageData) {
        const img = document.createElement("img");
        img.src = imageData;
        img.alt = "Asset preview";
        imagePreview.append(img);
      } else {
        imagePreview.append(createElement("div", "asset-drawer__image-placeholder", "+ Add Image"));
      }
    };

    imageInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          state.assetDraft.assetImage = e.target.result;
          updateImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });

    imagePreview.style.cursor = "pointer";
    imagePreview.addEventListener("click", () => imageInput.click());

    imageGroup.append(imageInput, imagePreview);
    imageSection.append(imageGroup);

    // ===== BASIC INFORMATION SECTION =====
    const basicSection = createElement("div", "drawer-form__section");
    basicSection.append(createSectionLabel("package", "Basic Information"));

    // Asset Name (required)
    const nameGroup = createElement("div", "drawer-form__group");
    const nameLabel = createElement("label", "drawer-form__label");
    nameLabel.append(createElement("span", "", "Asset Name"), createElement("span", "drawer-form__required", " *"));
    const nameInput = createElement("input", "drawer-form__title-input");
    nameInput.type = "text";
    nameInput.value = state.assetDraft.name;
    nameInput.placeholder = "e.g. MacBook Pro 16";
    nameInput.addEventListener("input", (event) => {
      state.assetDraft.name = event.target.value;
    });
    nameGroup.append(nameLabel, nameInput);
    basicSection.append(nameGroup);

    // No Asset and Status in 2 columns
    const assetStatusRow = createElement("div", "drawer-form__row-2col");

    // No Asset (required)
    const noAssetGroup = createElement("div", "drawer-form__group");
    const noAssetLabel = createElement("label", "drawer-form__label");
    noAssetLabel.append(createElement("span", "", "No Asset"), createElement("span", "drawer-form__required", " *"));
    const noAssetInput = createElement("input", "drawer-form__title-input");
    noAssetInput.type = "text";
    noAssetInput.value = state.assetDraft.manualCode;
    noAssetInput.placeholder = "FA001 atau FA010.1, FA010.20";
    noAssetInput.addEventListener("input", (event) => {
      state.assetDraft.manualCode = event.target.value;
    });
    noAssetGroup.append(noAssetLabel, noAssetInput);

    // Status (required)
    const statusGroup = createElement("div", "drawer-form__group");
    const statusLabel = createElement("label", "drawer-form__label");
    statusLabel.append(createElement("span", "", "Status"), createElement("span", "drawer-form__required", " *"));
    const statusSelect = createElement("select", "drawer-form__title-input");
    ASSET_STATUS_OPTIONS.forEach((statusOption) => {
      const option = document.createElement("option");
      option.value = statusOption;
      option.textContent = statusOption;
      if (statusOption === state.assetDraft.status) option.selected = true;
      statusSelect.append(option);
    });
    statusSelect.addEventListener("change", (event) => {
      state.assetDraft.status = event.target.value;
    });
    statusGroup.append(statusLabel, statusSelect);

    assetStatusRow.append(noAssetGroup, statusGroup);
    basicSection.append(assetStatusRow);

    // Cost and Purchase Date in 2 columns
    const costDateRow = createElement("div", "drawer-form__row-2col");

    // Cost (Rp)
    const costGroup = createElement("div", "drawer-form__group");
    const costLabel = createElement("label", "drawer-form__label", "Cost (Rp)");
    const costInput = createElement("input", "drawer-form__title-input");
    costInput.type = "text";
    costInput.value = state.assetDraft.cost;
    costInput.placeholder = "0";
    costInput.style.fontFamily = "inherit";

    // Format currency with thousand separator
    const formatCurrency = (value) => {
      // Remove non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      if (!digitsOnly) return '';
      // Add thousand separator (dot)
      return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    costInput.addEventListener("input", (event) => {
      const formatted = formatCurrency(event.target.value);
      costInput.value = formatted;
      state.assetDraft.cost = formatted;
    });
    costGroup.append(costLabel, costInput);

    // Purchase Date
    const purchaseGroup = createElement("div", "drawer-form__group");
    const purchaseLabel = createElement("label", "drawer-form__label", "Purchase Date");
    const purchaseInput = createElement("input", "drawer-form__date-input");
    purchaseInput.type = "date";
    purchaseInput.value = state.assetDraft.purchaseDate;
    purchaseInput.addEventListener("change", (event) => {
      state.assetDraft.purchaseDate = event.target.value;
    });
    purchaseGroup.append(purchaseLabel, purchaseInput);

    costDateRow.append(costGroup, purchaseGroup);
    basicSection.append(costDateRow);

    // ===== LOCATION & ASSIGNMENT SECTION =====
    const locationSection = createElement("div", "drawer-form__section");
    locationSection.append(createSectionLabel("map-pin", "Location & Assignment"));

    // Category and Site in 2 columns
    const categorySiteRow = createElement("div", "drawer-form__row-2col");

    // Category (required)
    const categoryGroup = createElement("div", "drawer-form__group");
    const categoryLabel = createElement("label", "drawer-form__label");
    categoryLabel.append(createElement("span", "", "Category"), createElement("span", "drawer-form__required", " *"));
    const categorySelect = createElement("select", "drawer-form__title-input");
    Object.keys(ASSET_CATEGORY_TO_ROMAWI).forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      if (cat === state.assetDraft.category) option.selected = true;
      categorySelect.append(option);
    });
    categorySelect.addEventListener("change", (event) => {
      state.assetDraft.category = event.target.value;
    });
    categoryGroup.append(categoryLabel, categorySelect);

    // Site (required)
    const siteGroup = createElement("div", "drawer-form__group");
    const siteLabel = createElement("label", "drawer-form__label");
    siteLabel.append(createElement("span", "", "Site"), createElement("span", "drawer-form__required", " *"));
    const siteSelect = createElement("select", "drawer-form__title-input");
    const allSites = getSites();
    allSites.forEach((site) => {
      const option = document.createElement("option");
      option.value = site.name;
      option.textContent = site.name;
      if (site.name === state.assetDraft.site) option.selected = true;
      siteSelect.append(option);
    });
    siteSelect.addEventListener("change", (event) => {
      state.assetDraft.site = event.target.value;
    });
    siteGroup.append(siteLabel, siteSelect);

    categorySiteRow.append(categoryGroup, siteGroup);
    locationSection.append(categorySiteRow);

    // Department and Person in Charge in 2 columns
    const deptPicRow = createElement("div", "drawer-form__row-2col");

    // Department
    const deptGroup = createElement("div", "drawer-form__group");
    const deptLabel = createElement("label", "drawer-form__label", "Department");
    const deptSelect = createElement("select", "drawer-form__title-input");
    const emptyDeptOption = document.createElement("option");
    emptyDeptOption.value = "";
    emptyDeptOption.textContent = "Select department";
    emptyDeptOption.selected = !state.assetDraft.department;
    deptSelect.append(emptyDeptOption);
    const allDepartments = getDepartments();
    allDepartments.forEach((dept) => {
      const option = document.createElement("option");
      option.value = dept.name;
      option.textContent = dept.name;
      if (dept.name === state.assetDraft.department) option.selected = true;
      deptSelect.append(option);
    });
    deptSelect.addEventListener("change", (event) => {
      state.assetDraft.department = event.target.value;
    });
    deptGroup.append(deptLabel, deptSelect);

    // Person in Charge
    const picGroup = createElement("div", "drawer-form__group");
    const picLabel = createElement("label", "drawer-form__label", "Person in Charge");
    const picSelect = createElement("select", "drawer-form__title-input");
    const emptyPicOption = document.createElement("option");
    emptyPicOption.value = "";
    emptyPicOption.textContent = "Select person";
    emptyPicOption.selected = !state.assetDraft.personInCharge;
    picSelect.append(emptyPicOption);
    const userApp = getUserManagementApp();
    const allUsers = userApp?.users || [];
    allUsers.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.name;
      option.textContent = user.name;
      if (user.name === state.assetDraft.personInCharge) option.selected = true;
      picSelect.append(option);
    });
    picSelect.addEventListener("change", (event) => {
      state.assetDraft.personInCharge = event.target.value;
    });
    picGroup.append(picLabel, picSelect);

    deptPicRow.append(deptGroup, picGroup);
    locationSection.append(deptPicRow);

    // ===== TECHNICAL DETAILS SECTION =====
    const techSection = createElement("div", "drawer-form__section");
    techSection.append(createSectionLabel("settings", "Technical Details"));

    // Brand and Model in 2 columns
    const brandModelRow = createElement("div", "drawer-form__row-2col");

    // Brand
    const brandGroup = createElement("div", "drawer-form__group");
    const brandLabel = createElement("label", "drawer-form__label", "Brand");
    const brandInput = createElement("input", "drawer-form__title-input");
    brandInput.type = "text";
    brandInput.value = state.assetDraft.brand;
    brandInput.placeholder = "e.g. Apple, Dell, HP";
    brandInput.addEventListener("input", (event) => {
      state.assetDraft.brand = event.target.value;
    });
    brandGroup.append(brandLabel, brandInput);

    // Model
    const modelGroup = createElement("div", "drawer-form__group");
    const modelLabel = createElement("label", "drawer-form__label", "Model");
    const modelInput = createElement("input", "drawer-form__title-input");
    modelInput.type = "text";
    modelInput.value = state.assetDraft.model;
    modelInput.placeholder = "e.g. MacBook Pro 16, M4";
    modelInput.addEventListener("input", (event) => {
      state.assetDraft.model = event.target.value;
    });
    modelGroup.append(modelLabel, modelInput);

    brandModelRow.append(brandGroup, modelGroup);
    techSection.append(brandModelRow);

    // Serial Number
    const serialGroup = createElement("div", "drawer-form__group");
    const serialLabel = createElement("label", "drawer-form__label", "Serial Number");
    const serialInput = createElement("input", "drawer-form__title-input");
    serialInput.type = "text";
    serialInput.value = state.assetDraft.serialNumber;
    serialInput.placeholder = "e.g. MBP-16-M4-0321";
    serialInput.addEventListener("input", (event) => {
      state.assetDraft.serialNumber = event.target.value;
    });
    serialGroup.append(serialLabel, serialInput);
    techSection.append(serialGroup);

    // ===== FOOTER =====
    const footer = createElement("div", "asset-drawer__footer");
    const footerLeft = createElement("div", "asset-drawer__footer-actions");
    const cancelButton = createElement(
      "button",
      "asset-drawer__button asset-drawer__button--ghost",
      "Cancel",
    );
    const saveButton = createElement(
      "button",
      "asset-drawer__button asset-drawer__button--primary",
      "Save",
    );

    const saveEnabled = isAssetDraftValid(state.assetDraft);
    cancelButton.type = "button";
    saveButton.type = "button";
    saveButton.disabled = !saveEnabled;
    cancelButton.addEventListener("click", closeDrawer);
    saveButton.addEventListener("click", () => {
      if (!isAssetDraftValid(state.assetDraft)) {
        return;
      }
      onSave();
    });
    footerLeft.append(saveButton, cancelButton);
    footer.append(footerLeft);

    // Update save button on input changes WITHOUT re-rendering
    const updateSaveButton = () => {
      saveButton.disabled = !isAssetDraftValid(state.assetDraft);
    };
    nameInput.addEventListener("input", (e) => {
      state.assetDraft.name = e.target.value;
      updateSaveButton();
    });
    noAssetInput.addEventListener("input", (e) => {
      state.assetDraft.manualCode = e.target.value;
      updateSaveButton();
    });
    categorySelect.addEventListener("change", (e) => {
      state.assetDraft.category = e.target.value;
      updateSaveButton();
    });
    siteSelect.addEventListener("change", (e) => {
      state.assetDraft.site = e.target.value;
      updateSaveButton();
    });
    statusSelect.addEventListener("change", (e) => {
      state.assetDraft.status = e.target.value;
      updateSaveButton();
    });

    headerLeft.append(backButton, title);
    header.append(headerLeft, closeButton);
    body.append(imageSection, basicSection, locationSection, techSection);
    drawer.append(header, body, footer);
    overlay.append(backdrop, drawer);

    return overlay;
  }

  function saveAssetDraft() {
    const assetsApp = getAssetsApp();
    const assetNumber = generateAssetNumber(
      state.assetDraft.manualCode,
      state.assetDraft.category,
      state.assetDraft.site
    );

    const newAsset = {
      id: assetNumber,
      assetNumber: assetNumber,
      name: state.assetDraft.name,
      category: state.assetDraft.category,
      location: state.assetDraft.site,
      status: state.assetDraft.status,
      statusTone: getAssetStatusTone(state.assetDraft.status),
      assignedTo: state.assetDraft.personInCharge || "-",
      department: state.assetDraft.department || "-",
      condition: "Ready",
      serialNumber: state.assetDraft.serialNumber || "-",
      purchaseDate: formatAssetDateLabel(new Date(state.assetDraft.purchaseDate)),
      valueLabel: state.assetDraft.cost ? `Rp ${state.assetDraft.cost}` : "Rp 0",
      notes: state.assetDraft.notes || "",
      dueLabel: "-",
    };

    assetsApp.records.push(newAsset);
    state.activeItem = "Assets";
    state.lastAction = "asset-created";
    state.isAssetDrawerOpen = false;
    state.assetDraft = getInitialAssetDraft();
    render();
  }

  function openAssetDrawer() {
    state.assetDraft = getInitialAssetDraft();
    state.isAssetDrawerOpen = true;
    render();
  }

  function animateCloseAssetDrawer(onClosed) {
    const overlay = shell.querySelector(".asset-drawer-overlay");

    if (!overlay) {
      onClosed();
      return;
    }

    if (overlay.dataset.closing === "true") {
      return;
    }

    overlay.dataset.closing = "true";
    overlay.classList.remove("is-open");

    window.setTimeout(() => {
      if (overlay.isConnected) {
        overlay.remove();
      }

      onClosed();
    }, 360);
  }

  function closeAssetDrawer() {
    animateCloseAssetDrawer(() => {
      state.isAssetDrawerOpen = false;
      state.assetDraft = getInitialAssetDraft();
      render();
    });
  }

  function updateActiveMarker() {
    const activeButton = railNav.querySelector(".rail-nav__item.is-active");

    if (!activeButton) {
      return;
    }

    const markerHeight = 64;
    const offset =
      activeButton.offsetTop +
      Math.max((activeButton.offsetHeight - markerHeight) / 2, 0);
    marker.style.transform = `translateY(${offset}px)`;
  }

  function renderRail() {
    railNav.innerHTML = "";

    workspaceApps.forEach((app) => {
      const button = createElement("button", "rail-nav__item");
      const icon = createElement("span", "rail-nav__icon");
      const label = createElement("span", "rail-nav__label", app.label);

      icon.append(createIcon(app.icon ?? "circle", app.label));

      button.type = "button";
      button.dataset.appId = app.id;
      button.setAttribute("aria-pressed", String(app.id === state.activeAppId));

      if (app.id === state.activeAppId) {
        button.classList.add("is-active");
      }

      button.addEventListener("click", () => {
        state.activeAppId = app.id;
        state.activeItem = defaultItemByApp[app.id] ?? app.items?.[0];
        render();
      });

      button.append(icon, label);
      railNav.append(button);
    });

    requestAnimationFrame(updateActiveMarker);
  }

  function createCalendarPanel(activeApp) {
    const wrapper = createElement("section", "calendar-panel");
    const newEventButton = createElement(
      "button",
      `calendar-panel__primary-action${state.lastAction === "new-event" ? " is-active" : ""}`,
      "New Event",
    );
    const sectionHeader = createElement("div", "calendar-panel__head");
    const sectionTitle = createElement(
      "h3",
      "calendar-panel__title",
      "Upcoming Events",
    );
    const viewAll = createElement("button", "calendar-panel__link", "View all");
    const events = createElement("div", "calendar-events");
    const monthBar = createElement("div", "calendar-month");
    const monthLabel = createElement(
      "h3",
      "calendar-month__label",
      `${MONTH_NAMES[state.calendar.displayMonth]} ${state.calendar.displayYear}`,
    );
    const monthPrev = createElement("button", "calendar-month__button");
    const monthNext = createElement("button", "calendar-month__button");
    const monthCollapse = createElement(
      "button",
      `calendar-month__button${state.calendar.isMonthOpen ? "" : " is-collapsed"}`,
    );
    const monthActions = createElement("div", "calendar-month__actions");
    const weekRow = createElement(
      "div",
      `calendar-grid calendar-grid--weekdays${state.calendar.isMonthOpen ? "" : " is-hidden"}`,
    );
    const dayGrid = createElement(
      "div",
      `calendar-grid calendar-grid--days${state.calendar.isMonthOpen ? "" : " is-hidden"}`,
    );

    const monthEvents = getEventsForDisplayedMonth(activeApp, state).filter(
      isUpcomingEvent,
    );
    const visibleEvents = getVisibleCalendarPanelEvents(activeApp, state);

    viewAll.type = "button";
    viewAll.append(createIcon("chevron-right"));
    newEventButton.type = "button";
    monthPrev.type = "button";
    monthNext.type = "button";
    monthCollapse.type = "button";
    monthPrev.setAttribute("aria-label", "Previous month");
    monthNext.setAttribute("aria-label", "Next month");
    monthCollapse.setAttribute("aria-label", "Toggle month view");
    monthPrev.append(createIcon("chevron-left"));
    monthNext.append(createIcon("chevron-right"));
    monthCollapse.append(createIcon("chevron-down"));

    newEventButton.addEventListener("click", () => {
      openEventDrawer();
      render();
    });

    viewAll.addEventListener("click", () => {
      state.lastAction = "view-all";
      state.calendar.showAllEvents = true;
      render();
    });

    monthCollapse.addEventListener("click", () => {
      state.lastAction = "toggle-month";
      state.calendar.isMonthOpen = !state.calendar.isMonthOpen;
      render();
    });

    monthPrev.addEventListener("click", () => {
      state.lastAction = "month-prev";
      if (state.calendar.displayMonth === 0) {
        state.calendar.displayMonth = 11;
        state.calendar.displayYear -= 1;
      } else {
        state.calendar.displayMonth -= 1;
      }

      syncCalendarSelectionForDisplayedMonth(state, activeApp);
      render();
    });

    monthNext.addEventListener("click", () => {
      state.lastAction = "month-next";
      if (state.calendar.displayMonth === 11) {
        state.calendar.displayMonth = 0;
        state.calendar.displayYear += 1;
      } else {
        state.calendar.displayMonth += 1;
      }

      syncCalendarSelectionForDisplayedMonth(state, activeApp);
      render();
    });

    if (visibleEvents.length === 0) {
      events.append(
        createElement(
          "p",
          "calendar-panel__empty",
          "No upcoming events in this month.",
        ),
      );
    } else {
      visibleEvents.forEach((event) => {
        const card = createElement(
          "article",
          `event-card${event.id === state.calendar.selectedEventId ? " is-active" : ""}`,
        );
        const date = createElement("div", "event-card__date");
        const day = createElement(
          "strong",
          "event-card__day",
          String(event.day).padStart(2, "0"),
        );
        const month = createElement(
          "span",
          "event-card__month",
          event.monthLabel,
        );
        const body = createElement("div", "event-card__body");
        const title = createElement("h4", "event-card__title", event.title);
        const titleRow = createElement("div", "event-card__title-row");
        const tagRow = createElement("div", "event-card__tags");
        const meta = createElement("p", "event-card__meta", event.meta);
        const eventTag = getNormalizedEventTag(event);
        const tagChip = createElement("span", "event-card__tag", eventTag);
        const tagStyle = getEventTagStyle(eventTag);

        tagChip.style.setProperty("--tag-color", tagStyle.color);
        tagChip.style.setProperty("--tag-text-color", tagStyle.textColor);
        tagRow.append(tagChip);

        card.tabIndex = 0;
        card.role = "button";

        card.addEventListener("click", () => {
          state.lastAction = "event-card";
          openEventDetailDrawer(event);
          render();
        });

        card.addEventListener("keydown", (nativeEvent) => {
          if (nativeEvent.key === "Enter" || nativeEvent.key === " ") {
            nativeEvent.preventDefault();
            state.lastAction = "event-card";
            openEventDetailDrawer(event);
            render();
          }
        });

        date.append(day, month);
        titleRow.append(title, tagRow);
        body.append(titleRow, meta);
        card.append(date, body);
        events.append(card);
      });
    }

    activeApp.calendar.weekdays.forEach((dayName) => {
      weekRow.append(createElement("span", "calendar-grid__weekday", dayName));
    });

    buildCalendarDays(
      state.calendar.displayYear,
      state.calendar.displayMonth,
      new Date(
        state.calendar.displayYear,
        state.calendar.displayMonth,
        state.calendar.selectedDay,
      ),
    ).forEach((dayItem) => {
      const dayButton = createElement(
        "button",
        `calendar-grid__day${dayItem.active ? " is-active" : ""}${dayItem.muted ? " is-muted" : ""}${dayItem.isToday ? " is-today" : ""}`,
        String(dayItem.value),
      );

      dayButton.type = "button";
      dayButton.disabled = !dayItem.isCurrentMonth;
      if (dayItem.isToday) {
        dayButton.setAttribute("aria-current", "date");
        dayButton.title = "Today";
      }

      if (dayItem.isCurrentMonth) {
        dayButton.addEventListener("click", () => {
          state.lastAction = "calendar-day";
          state.calendar.displayYear = dayItem.year;
          state.calendar.displayMonth = dayItem.monthIndex;
          state.calendar.selectedDay = dayItem.value;
          state.calendar.selectedEventId =
            monthEvents.find((event) => Number(event.day) === dayItem.value)
              ?.id ?? null;
          render();
        });
      }

      dayGrid.append(dayButton);
    });

    monthActions.append(monthPrev, monthNext);
    monthBar.append(monthCollapse, monthLabel, monthActions);
    sectionHeader.append(sectionTitle, viewAll);
    wrapper.append(
      newEventButton,
      sectionHeader,
      events,
      monthBar,
      weekRow,
      dayGrid,
    );

    return wrapper;
  }

  function createCalendarWorkspace(activeApp) {
    const wrapper = createElement("section", "calendar-workspace");
    const toolbar = createElement("div", "calendar-workspace__toolbar");
    const viewTabs = createElement("div", "calendar-workspace__tabs");
    const surface = createElement("div", "calendar-surface");
    const header = createElement("div", "calendar-surface__header");
    const selectedDate = getSelectedCalendarDate(state);
    const todayDate = getTodayDate();
    const title = createElement(
      "h2",
      "calendar-surface__title",
      state.calendar.viewMode === "day"
        ? selectedDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : `${MONTH_NAMES[state.calendar.displayMonth]} ${state.calendar.displayYear}`,
    );
    const nav = createElement("div", "calendar-surface__nav");
    const prev = createElement("button", "calendar-surface__nav-button");
    const today = createElement("button", "calendar-surface__nav-button");
    const next = createElement("button", "calendar-surface__nav-button");
    ["Day", "Week", "Month"].forEach((label, index) => {
      const tab = createElement(
        "button",
        `calendar-workspace__tab${state.calendar.viewMode === label.toLowerCase() ? " is-active" : ""}`,
        label,
      );
      tab.type = "button";
      tab.addEventListener("click", () => {
        state.calendar.viewMode = label.toLowerCase();
        render();
      });
      viewTabs.append(tab);
    });

    toolbar.append(viewTabs);

    prev.type = "button";
    today.type = "button";
    next.type = "button";
    prev.setAttribute("aria-label", "Previous month");
    today.setAttribute("aria-label", "Go to today");
    next.setAttribute("aria-label", "Next month");
    prev.append(createIcon("chevron-left"));
    today.append(createIcon("circle"));
    today.classList.toggle(
      "is-active",
      isSameCalendarDate(selectedDate, todayDate),
    );
    next.append(createIcon("chevron-right"));

    prev.addEventListener("click", () => {
      if (state.calendar.viewMode === "day") {
        const previousDate = new Date(selectedDate);
        previousDate.setDate(selectedDate.getDate() - 1);
        state.calendar.displayYear = previousDate.getFullYear();
        state.calendar.displayMonth = previousDate.getMonth();
        state.calendar.selectedDay = previousDate.getDate();
        state.calendar.selectedEventId =
          getEventsForDate(activeApp, previousDate)[0]?.id ?? null;
      } else if (state.calendar.viewMode === "week") {
        const previousWeek = new Date(selectedDate);
        previousWeek.setDate(selectedDate.getDate() - 7);
        state.calendar.displayYear = previousWeek.getFullYear();
        state.calendar.displayMonth = previousWeek.getMonth();
        state.calendar.selectedDay = previousWeek.getDate();
        state.calendar.selectedEventId =
          getEventsForDate(activeApp, previousWeek)[0]?.id ?? null;
      } else {
        if (state.calendar.displayMonth === 0) {
          state.calendar.displayMonth = 11;
          state.calendar.displayYear -= 1;
        } else {
          state.calendar.displayMonth -= 1;
        }

        syncCalendarSelectionForDisplayedMonth(state, activeApp);
      }
      render();
    });

    next.addEventListener("click", () => {
      if (state.calendar.viewMode === "day") {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + 1);
        state.calendar.displayYear = nextDate.getFullYear();
        state.calendar.displayMonth = nextDate.getMonth();
        state.calendar.selectedDay = nextDate.getDate();
        state.calendar.selectedEventId =
          getEventsForDate(activeApp, nextDate)[0]?.id ?? null;
      } else if (state.calendar.viewMode === "week") {
        const nextWeek = new Date(selectedDate);
        nextWeek.setDate(selectedDate.getDate() + 7);
        state.calendar.displayYear = nextWeek.getFullYear();
        state.calendar.displayMonth = nextWeek.getMonth();
        state.calendar.selectedDay = nextWeek.getDate();
        state.calendar.selectedEventId =
          getEventsForDate(activeApp, nextWeek)[0]?.id ?? null;
      } else {
        if (state.calendar.displayMonth === 11) {
          state.calendar.displayMonth = 0;
          state.calendar.displayYear += 1;
        } else {
          state.calendar.displayMonth += 1;
        }

        syncCalendarSelectionForDisplayedMonth(state, activeApp);
      }
      render();
    });

    today.addEventListener("click", () => {
      syncCalendarToDate(state, activeApp, getTodayDate());
      state.calendar.viewMode = state.calendar.viewMode || "month";

      render();
    });

    function createMonthBoard() {
      const weekHeader = createElement("div", "calendar-surface__weekdays");
      const board = createElement("div", "calendar-surface__board");
      const year = state.calendar.displayYear;
      const month = state.calendar.displayMonth;
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const daysInMonth = getDaysInMonth(year, month);
      const totalRows = Math.ceil((firstDayOfMonth + daysInMonth) / 7);

      board.style.gridTemplateRows = `repeat(${totalRows}, minmax(0, 1fr))`;

      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((dayName) => {
        const weekday = createElement(
          "div",
          "calendar-surface__weekday",
          dayName,
        );
        weekHeader.append(weekday);
      });

      const today = getTodayDate();

      for (let index = 0; index < totalRows * 7; index++) {
        const row = Math.floor(index / 7);
        const col = index % 7;
        const dayIndex = index - firstDayOfMonth + 1;
        const isCurrentMonth = dayIndex >= 1 && dayIndex <= daysInMonth;

        const cell = createElement(
          "article",
          `calendar-surface__cell${isCurrentMonth ? "" : " is-muted"}`,
        );
        cell.style.gridColumn = String(col + 1);
        cell.style.gridRow = String(row + 1);

        if (isCurrentMonth) {
          const isToday = isSameCalendarDate(
            today,
            new Date(year, month, dayIndex),
          );
          const isSelected = dayIndex === state.calendar.selectedDay;

          if (isToday) cell.classList.add("is-today");
          if (isSelected) cell.classList.add("is-selected");

          const dateNumber = createElement(
            "button",
            `calendar-surface__date${isToday ? " is-today" : ""}`,
            String(dayIndex),
          );
          const dayEvents = activeApp.events.filter((event) => {
            return (
              event.year === year &&
              event.monthIndex === month &&
              Number(event.day) === dayIndex
            );
          });

          dateNumber.type = "button";
          if (isToday) {
            dateNumber.setAttribute("aria-current", "date");
            dateNumber.title = "Today";
          }
          dateNumber.addEventListener("click", () => {
            state.calendar.displayYear = year;
            state.calendar.displayMonth = month;
            state.calendar.selectedDay = dayIndex;
            state.calendar.selectedEventId = dayEvents[0]?.id ?? null;
            state.activeItem = "Monthly View";
            render();
          });

          cell.append(dateNumber);

          const useCompactMonthEvents = dayEvents.length > 1;
          const maxVisibleEvents = 2;
          const visibleEvents = dayEvents.slice(0, maxVisibleEvents);
          const overflowCount = dayEvents.length - maxVisibleEvents;

          visibleEvents.forEach((event) => {
            const eventCard = createElement(
              "button",
              `calendar-surface__event${useCompactMonthEvents ? " calendar-surface__event--month" : ""}${
                event.id === state.calendar.selectedEventId ? " is-active" : ""
              }`,
            );
            const schedule = parseEventSchedule(event.meta);
            const eventTitle = createElement(
              "strong",
              "calendar-surface__event-title",
              event.title,
            );
            const eventMeta = createElement(
              "span",
              "calendar-surface__event-meta",
              schedule.label,
            );

            eventCard.type = "button";
            eventCard.style.setProperty(
              "--event-bg",
              getEventSurfaceColor(event),
            );
            eventCard.title = `${event.title} • ${schedule.label}`;
            eventCard.addEventListener("click", (eventClick) => {
              eventClick.stopPropagation();
              openEventDetailDrawer(event);
              render();
            });

            if (useCompactMonthEvents) {
              eventTitle.classList.add("calendar-surface__event-title--month");
              eventCard.append(eventTitle);
            } else {
              eventCard.append(eventTitle, eventMeta);
            }

            cell.append(eventCard);
          });

          if (overflowCount > 0) {
            const overflowIndicator = createElement(
              "button",
              "calendar-surface__event-overflow",
              `+${overflowCount} more`,
            );
            overflowIndicator.type = "button";
            overflowIndicator.title = `${overflowCount} more events on this day`;
            overflowIndicator.addEventListener("click", (eventClick) => {
              eventClick.stopPropagation();
              state.calendar.displayYear = year;
              state.calendar.displayMonth = month;
              state.calendar.selectedDay = dayIndex;
              state.activeItem = "Monthly View";
              render();
            });
            cell.append(overflowIndicator);
          }
        }

        board.append(cell);
      }

      return [weekHeader, board];
    }

    function createWeekBoard() {
      const selectedWeekDates = getWeekDates(selectedDate);
      const weekHeader = createElement(
        "div",
        "calendar-surface__weekdays calendar-surface__weekdays--week",
      );
      const board = createElement(
        "div",
        "calendar-surface__board calendar-surface__board--week",
      );

      selectedWeekDates.forEach((date) => {
        const weekday = createElement(
          "div",
          "calendar-surface__weekday",
          date.toLocaleDateString("en-US", { weekday: "short" }),
        );
        weekHeader.append(weekday);
        const isToday = isSameCalendarDate(date, todayDate);

        const cell = createElement(
          "article",
          `calendar-surface__cell calendar-surface__cell--week${isToday ? " is-today" : ""}${
            date.getDate() === state.calendar.selectedDay &&
            date.getMonth() === state.calendar.displayMonth &&
            date.getFullYear() === state.calendar.displayYear
              ? " is-selected"
              : ""
          }`,
        );
        const dateNumber = createElement(
          "button",
          `calendar-surface__date calendar-surface__date--week${isToday ? " is-today" : ""}`,
          String(date.getDate()),
        );
        const events = getEventsForDate(activeApp, date);

        dateNumber.type = "button";
        if (isToday) {
          dateNumber.setAttribute("aria-current", "date");
          dateNumber.title = "Today";
        }
        dateNumber.addEventListener("click", () => {
          state.calendar.displayYear = date.getFullYear();
          state.calendar.displayMonth = date.getMonth();
          state.calendar.selectedDay = date.getDate();
          state.calendar.selectedEventId = events[0]?.id ?? null;
          render();
        });

        cell.append(dateNumber);

        events.forEach((event) => {
          const eventCard = createElement(
            "button",
            `calendar-surface__event calendar-surface__event--stack${event.id === state.calendar.selectedEventId ? " is-active" : ""}`,
          );
          eventCard.type = "button";
          eventCard.style.setProperty(
            "--event-bg",
            getEventSurfaceColor(event),
          );
          eventCard.append(
            createElement(
              "strong",
              "calendar-surface__event-title",
              event.title,
            ),
            createElement(
              "span",
              "calendar-surface__event-meta",
              parseEventSchedule(event.meta).label,
            ),
          );
          eventCard.addEventListener("click", () => {
            openEventDetailDrawer(event);
            render();
          });
          cell.append(eventCard);
        });

        board.append(cell);
      });

      return [weekHeader, board];
    }

    function createDayBoard() {
      const daySurface = createElement("div", "calendar-surface__day");
      const dayHeader = createElement(
        "div",
        "calendar-surface__day-header",
        selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      );
      const events = getEventsForDate(activeApp, selectedDate);
      const list = createElement("div", "calendar-surface__day-list");

      if (events.length === 0) {
        list.append(
          createElement(
            "p",
            "calendar-surface__empty",
            "No events scheduled for this day.",
          ),
        );
      } else {
        events
          .slice()
          .sort(
            (left, right) =>
              parseEventSchedule(left.meta).startMinutes -
              parseEventSchedule(right.meta).startMinutes,
          )
          .forEach((event) => {
            const item = createElement(
              "button",
              `calendar-surface__day-event${event.id === state.calendar.selectedEventId ? " is-active" : ""}`,
            );
            const schedule = parseEventSchedule(event.meta);
            const copy = createElement(
              "div",
              "calendar-surface__day-event-copy",
            );
            const time = createElement(
              "span",
              "calendar-surface__day-event-time",
              schedule.label,
            );
            const titleText = createElement(
              "strong",
              "calendar-surface__day-event-title",
              event.title,
            );
            const meta = createElement(
              "span",
              "calendar-surface__day-event-meta",
              schedule.location || event.meta,
            );

            item.type = "button";
            item.style.setProperty("--event-bg", getEventSurfaceColor(event));
            item.addEventListener("click", () => {
              openEventDetailDrawer(event);
              render();
            });
            copy.append(time, titleText, meta);
            item.append(copy);
            list.append(item);
          });
      }

      daySurface.append(dayHeader, list);
      return [daySurface];
    }

    nav.append(prev, today, next);
    header.append(title, nav);
    if (state.calendar.viewMode === "day") {
      surface.append(header, ...createDayBoard());
    } else if (state.calendar.viewMode === "week") {
      surface.append(header, ...createWeekBoard());
    } else {
      surface.append(header, ...createMonthBoard());
    }
    wrapper.append(toolbar, surface);

    return wrapper;
  }

  function createDefaultSubnav(activeApp) {
    const subNav = createElement("nav", "subnav");
    subNav.setAttribute("aria-label", "Sub navigation");

    activeApp.items.forEach((item) => {
      const button = createElement("button", "subnav__item", item);
      button.type = "button";

      if (item === state.activeItem) {
        button.classList.add("is-active");
      }

      button.addEventListener("click", () => {
        state.lastAction = "";
        state.activeItem = item;
        render();
      });

      subNav.append(button);
    });

    return subNav;
  }

  function createAssetsPanel(activeApp) {
    const wrapper = createElement("section", "calendar-panel");
    const newAssetButton = createElement(
      "button",
      `calendar-panel__primary-action${state.activeItem === "New asset" ? " is-active" : ""}`,
      "New asset",
    );

    newAssetButton.type = "button";
    newAssetButton.addEventListener("click", () => {
      openAssetDrawer();
    });

    wrapper.append(newAssetButton, createDefaultSubnav(activeApp));

    return wrapper;
  }

  function createUserManagementPanel(activeApp) {
    const wrapper = createElement("section", "calendar-panel");
    const newUserButton = createElement(
      "button",
      `calendar-panel__primary-action${state.activeItem === "New User" ? " is-active" : ""}`,
      "New User",
    );

    newUserButton.type = "button";
    newUserButton.addEventListener("click", () => {
      openUserDrawer();
      render();
    });

    wrapper.append(newUserButton, createDefaultSubnav(activeApp));

    return wrapper;
  }

  function openUserDrawer() {
    state.lastAction = "new-user";
    state.activeItem = "New User";
    state.userDraft = getInitialUserDraft();
    state.isUserDrawerOpen = true;
    render();
  }

  function renderPanel(activeApp) {
    panelHeading.textContent = activeApp.title;
    panelBody.innerHTML = "";

    if (activeApp.panelType === "calendar") {
      panelBody.append(createCalendarPanel(activeApp));
      return;
    }

    if (activeApp.id === "assets") {
      panelBody.append(createAssetsPanel(activeApp));
      return;
    }

    if (activeApp.id === "user-management") {
      panelBody.append(createUserManagementPanel(activeApp));
      return;
    }

    panelBody.append(createDefaultSubnav(activeApp));
  }

  function renderContent(activeApp) {
    content.innerHTML = "";

    if (activeApp.id === "calendar") {
      content.append(createCalendarWorkspace(activeApp));
      return;
    }

    if (activeApp.id === "user-management") {
      contentPlaceholder.innerHTML = "";
      contentPlaceholder.classList.remove("content-stage__empty");
      contentPlaceholder.classList.add("content-stage__content");
      if (state.activeItem === "All Users" || state.activeItem === "New User") {
        contentPlaceholder.append(createUsersWorkspace(activeApp));
      } else if (state.activeItem === "Organization Settings") {
        contentPlaceholder.append(createOrganizationSettingsView(state, activeApp, {
          onAddSite: openSiteDrawer,
          onAddDept: openDeptDrawer,
          onViewSite: viewSite,
          onEditSite: editSite,
          onRemoveSite: removeSite,
          onViewDept: viewDept,
          onEditDept: editDept,
          onRemoveDept: removeDept,
        }));
      }
      content.append(contentPlaceholder);
      return;
    }

    if (activeApp.id === "assets" && state.activeItem === "Assets") {
      content.append(createAssetsWorkspace(activeApp));
      return;
    }

    contentPlaceholder.innerHTML = "";
    contentPlaceholder.classList.remove("content-stage__content");
    contentPlaceholder.classList.add("content-stage__empty");
    contentLabel.textContent = "Selected module";
    contentHeading.textContent = `${activeApp.title} / ${state.activeItem}`;
    contentMeta.textContent =
      "Konten halaman belum diisi. Struktur navigasi sudah siap untuk ditambahkan per page.";
    contentPlaceholder.append(contentLabel, contentHeading, contentMeta);
    content.append(contentPlaceholder);
  }

  function render() {
    const activeApp =
      workspaceApps.find((app) => app.id === state.activeAppId) ??
      workspaceApps[0];
    const currentOverlay = shell.querySelector(".event-drawer-overlay");
    const currentUserDrawerOverlay = shell.querySelector(".user-drawer-overlay");
    const currentSiteDrawerOverlay = shell.querySelector(".site-drawer-overlay");
    const currentDeptDrawerOverlay = shell.querySelector(".dept-drawer-overlay");
    const currentSiteDetailDrawerOverlay = shell.querySelector(".site-detail-drawer-overlay");
    const currentDeptDetailDrawerOverlay = shell.querySelector(".dept-detail-drawer-overlay");
    const currentUserDetailDrawerOverlay = shell.querySelector(".user-detail-drawer-overlay");
    const currentAttachmentViewer = shell.querySelector(
      ".attachment-viewer-overlay",
    );
    const currentEventsPopup = shell.querySelector(
      ".calendar-events-modal-overlay",
    );
    const currentAssetDrawerOverlay = shell.querySelector(
      ".asset-drawer-overlay",
    );

    currentOverlay?.__cleanupOutsideHandler?.();
    currentUserDrawerOverlay?.__cleanupOutsideHandler?.();
    currentSiteDrawerOverlay?.__cleanupOutsideHandler?.();
    currentDeptDrawerOverlay?.__cleanupOutsideHandler?.();
    currentSiteDetailDrawerOverlay?.__cleanupOutsideHandler?.();
    currentDeptDetailDrawerOverlay?.__cleanupOutsideHandler?.();
    currentUserDetailDrawerOverlay?.__cleanupOutsideHandler?.();
    currentAttachmentViewer?.__cleanupViewerHandlers?.();
    currentEventsPopup?.__cleanupEscapeHandler?.();
    currentOverlay?.remove();
    currentUserDrawerOverlay?.remove();
    currentSiteDrawerOverlay?.remove();
    currentDeptDrawerOverlay?.remove();
    currentSiteDetailDrawerOverlay?.remove();
    currentDeptDetailDrawerOverlay?.remove();
    currentUserDetailDrawerOverlay?.remove();
    currentAttachmentViewer?.remove();
    currentEventsPopup?.remove();
    currentAssetDrawerOverlay?.remove();
    renderRail();
    renderPanel(activeApp);
    renderContent(activeApp);

    if (state.isEventDrawerOpen) {
      const drawerOverlay =
        state.eventDrawerMode === "detail"
          ? createEventDetailDrawer(
              activeApp,
              state,
              closeEventDrawer,
              openAttachmentViewer,
              false,
            )
          : createEventDrawer(state, closeEventDrawer, saveEventDraft, false);
      shell.append(drawerOverlay);

      requestAnimationFrame(() => {
        void drawerOverlay.offsetWidth;
        requestAnimationFrame(() => {
          if (drawerOverlay.isConnected) {
            drawerOverlay.classList.add("is-open");
          }
        });
      });
    }

    if (state.isUserDrawerOpen) {
      const userDrawerOverlay = createUserDrawer(state, closeUserDrawer, saveUserDraft, false);
      shell.append(userDrawerOverlay);

      requestAnimationFrame(() => {
        void userDrawerOverlay.offsetWidth;
        requestAnimationFrame(() => {
          if (userDrawerOverlay.isConnected) {
            userDrawerOverlay.classList.add("is-open");
          }
        });
      });
    }

    if (state.isSiteDrawerOpen) {
      const siteDrawerOverlay = createSiteDrawer(state, closeSiteDrawer, false);
      shell.append(siteDrawerOverlay);

      requestAnimationFrame(() => {
        void siteDrawerOverlay.offsetWidth;
        requestAnimationFrame(() => {
          if (siteDrawerOverlay.isConnected) {
            siteDrawerOverlay.classList.add("is-open");
          }
        });
      });
    }

    if (state.isDeptDrawerOpen) {
      const deptDrawerOverlay = createDeptDrawer(state, closeDeptDrawer, false);
      shell.append(deptDrawerOverlay);

      requestAnimationFrame(() => {
        void deptDrawerOverlay.offsetWidth;
        requestAnimationFrame(() => {
          if (deptDrawerOverlay.isConnected) {
            deptDrawerOverlay.classList.add("is-open");
          }
        });
      });
    }

    if (state.isAssetDrawerOpen) {
      const assetDrawerOverlay = createAssetDrawer(state, closeAssetDrawer, saveAssetDraft, false);
      shell.append(assetDrawerOverlay);

      requestAnimationFrame(() => {
        void assetDrawerOverlay.offsetWidth;
        requestAnimationFrame(() => {
          if (assetDrawerOverlay.isConnected) {
            assetDrawerOverlay.classList.add("is-open");
          }
        });
      });
    }

    if (state.isSiteDetailDrawerOpen) {
      const siteDetailDrawerOverlay = createSiteDetailDrawer(
        state,
        closeSiteDetailDrawer,
        saveSiteDetailDrawer,
        state.siteDetailMode,
        false,
      );
      shell.append(siteDetailDrawerOverlay);

      requestAnimationFrame(() => {
        void siteDetailDrawerOverlay.offsetWidth;
        requestAnimationFrame(() => {
          if (siteDetailDrawerOverlay.isConnected) {
            siteDetailDrawerOverlay.classList.add("is-open");
          }
        });
      });
    }

    if (state.isDeptDetailDrawerOpen) {
      const deptDetailDrawerOverlay = createDeptDetailDrawer(
        state,
        closeDeptDetailDrawer,
        saveDeptDetailDrawer,
        state.deptDetailMode,
        false,
      );
      shell.append(deptDetailDrawerOverlay);

      requestAnimationFrame(() => {
        void deptDetailDrawerOverlay.offsetWidth;
        requestAnimationFrame(() => {
          if (deptDetailDrawerOverlay.isConnected) {
            deptDetailDrawerOverlay.classList.add("is-open");
          }
        });
      });
    }

    if (state.isUserDetailDrawerOpen) {
      const userDetailDrawerOverlay = createUserDetailDrawer(
        state,
        closeUserDetailDrawer,
        saveUserDetailDrawer,
        state.userDetailMode,
        false,
      );
      shell.append(userDetailDrawerOverlay);

      requestAnimationFrame(() => {
        void userDetailDrawerOverlay.offsetWidth;
        requestAnimationFrame(() => {
          if (userDetailDrawerOverlay.isConnected) {
            userDetailDrawerOverlay.classList.add("is-open");
          }
        });
      });
    }

    if (state.attachmentViewer.isOpen && state.attachmentViewer.attachment) {
      const attachmentViewerOverlay = createAttachmentViewerOverlay(
        state.attachmentViewer.attachment,
        closeAttachmentViewer,
        false,
      );
      shell.append(attachmentViewerOverlay);

      requestAnimationFrame(() => {
        void attachmentViewerOverlay.offsetWidth;
        requestAnimationFrame(() => {
          if (attachmentViewerOverlay.isConnected) {
            attachmentViewerOverlay.classList.add("is-open");
          }
        });
      });
    }

    if (state.calendar.showAllEvents) {
      const eventsPopup = createCalendarEventsPopup(activeApp, false);
      shell.append(eventsPopup);

      requestAnimationFrame(() => {
        void eventsPopup.offsetWidth;
        requestAnimationFrame(() => {
          if (eventsPopup.isConnected) {
            eventsPopup.classList.add("is-open");
          }
        });
      });
    }
  }

  rail.append(railNav);
  render();

  return shell;
}
