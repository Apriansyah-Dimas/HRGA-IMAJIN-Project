// Calendar Feature Module
// This file contains all calendar-related functions
// Fully standalone - no dependency on app-shell.js

import { workspaceApps } from "../../data/navigation.js";
import { 
  createElement, 
  createIcon, 
  createNativeSelect,
  formatDateTimeLocalValue,
  formatDateInput,
  getDraftDatePart,
  getDraftTimePart,
  isDraftDateRangeValid,
  formatTime,
  buildTimeOptions,
  formatMinutesAsTime,
  MONTH_NAMES,
  EVENT_TAG_STYLES,
  EVENT_TAG_OPTIONS
} from "../../core/core.js";

// Calendar constants
const PDFJS_VERSION = "5.5.207";
const PDFJS_MODULE_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.mjs`;
const PDFJS_WORKER_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.mjs`;

let pdfJsLibPromise = null;

// ===== Calendar Helpers =====

export function getCalendarApp() {
  return workspaceApps.find((app) => app.id === "calendar");
}

export function getTodayDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isSameCalendarDate(leftDate, rightDate) {
  return (
    leftDate instanceof Date &&
    rightDate instanceof Date &&
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  );
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function buildCalendarDays(year, month, selectedDate) {
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

export function syncCalendarToEvent(state, event) {
  state.calendar.displayYear = event.year;
  state.calendar.displayMonth = event.monthIndex;
  state.calendar.selectedDay = Number(event.day);
  state.calendar.selectedEventId = event.id;
}

export function getEventDate(event) {
  return new Date(event.year, event.monthIndex, Number(event.day));
}

export function isUpcomingEvent(event) {
  return getEventDate(event) >= getTodayDate();
}

export function getEventsForDisplayedMonth(activeApp, state) {
  return activeApp.events.filter((event) => {
    return (
      event.year === state.calendar.displayYear &&
      event.monthIndex === state.calendar.displayMonth
    );
  });
}

export function syncCalendarSelectionForDisplayedMonth(state, activeApp) {
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

export function getVisibleCalendarPanelEvents(activeApp, state) {
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

export function getCalendarEventById(activeApp, eventId) {
  return activeApp.events.find((event) => event.id === eventId) ?? null;
}

export function getSelectedCalendarDate(state) {
  return new Date(
    state.calendar.displayYear,
    state.calendar.displayMonth,
    state.calendar.selectedDay,
  );
}

export function getWeekDates(selectedDate) {
  const start = new Date(selectedDate);
  start.setDate(selectedDate.getDate() - selectedDate.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function getEventsForDate(activeApp, date) {
  return activeApp.events.filter((event) => {
    return (
      event.year === date.getFullYear() &&
      event.monthIndex === date.getMonth() &&
      Number(event.day) === date.getDate()
    );
  });
}

export function syncCalendarToDate(state, activeApp, date) {
  state.calendar.displayYear = date.getFullYear();
  state.calendar.displayMonth = date.getMonth();
  state.calendar.selectedDay = date.getDate();
  state.calendar.selectedEventId =
    getEventsForDate(activeApp, date)[0]?.id ?? null;
}

export function getEventSurfaceColor(event) {
  const primaryTag = getEventPrimaryTag(event);
  return getEventTagStyle(primaryTag).color;
}

export function getEventTagStyle(tag) {
  return EVENT_TAG_STYLES[tag] ?? EVENT_TAG_STYLES.Event;
}

export function getNormalizedEventTag(event) {
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

export function getEventPrimaryTag(event) {
  return getNormalizedEventTag(event);
}

// ===== Calendar State =====

export function getInitialCalendarState() {
  const today = getTodayDate();
  
  return {
    displayYear: today.getFullYear(),
    displayMonth: today.getMonth(),
    selectedDay: today.getDate(),
    selectedEventId: null,
    isMonthOpen: false,
    showAllEvents: false,
    viewMode: "month",
  };
}

export function getInitialEventDraft() {
  return {
    title: "",
    description: "",
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "10:00",
    isAllDay: false,
    isDatePickerOpen: false,
    openTimeField: null,
    isParticipantPopupOpen: false,
    participants: [],
    tags: ["Event"],
    attachments: [],
  };
}

export function isDraftValid(draft) {
  return (
    draft.title?.trim() &&
    draft.startDate &&
    (draft.isAllDay || (draft.startTime && draft.endTime)) &&
    isDraftDateRangeValid(draft.startDate, draft.endDate)
  );
}

export function buildEventFromDraft(state) {
  const draft = state.eventDraft;
  const year = new Date(draft.startDate + "T00:00:00").getFullYear();
  const monthIndex = new Date(draft.startDate + "T00:00:00").getMonth();
  
  return {
    id: `event-${Date.now()}`,
    day: String(new Date(draft.startDate + "T00:00:00").getDate()).padStart(2, "0"),
    monthIndex,
    year,
    monthLabel: MONTH_NAMES[monthIndex].slice(0, 3).toUpperCase(),
    title: draft.title,
    meta: draft.isAllDay 
      ? "All day" 
      : `${draft.startTime} - ${draft.endTime}`,
    color: getEventTagStyle(draft.tags[0] || "Event").color,
    tag: draft.tags[0] || "Event",
    description: draft.description,
    attachments: draft.attachments,
  };
}

// ===== Calendar UI Components =====

export function createCalendarPanel(activeApp, state, callbacks = {}) {
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
    if (callbacks.onNewEvent) callbacks.onNewEvent();
  });

  viewAll.addEventListener("click", () => {
    if (callbacks.onViewAll) callbacks.onViewAll();
  });

  monthCollapse.addEventListener("click", () => {
    if (callbacks.onToggleMonth) callbacks.onToggleMonth();
  });

  monthPrev.addEventListener("click", () => {
    if (callbacks.onMonthPrev) callbacks.onMonthPrev();
  });

  monthNext.addEventListener("click", () => {
    if (callbacks.onMonthNext) callbacks.onMonthNext();
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
        if (callbacks.onEventClick) callbacks.onEventClick(event);
      });

      date.append(day, month);
      titleRow.append(title);
      body.append(titleRow, tagRow, meta);
      card.append(date, body);
      events.append(card);
    });
  }

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  weekdays.forEach((day) => {
    weekRow.append(createElement("span", "calendar-grid__weekday", day));
  });

  const calendarDays = buildCalendarDays(
    state.calendar.displayYear,
    state.calendar.displayMonth,
    getSelectedCalendarDate(state),
  );

  calendarDays.forEach((dayInfo) => {
    const dayButton = createElement(
      "button",
      `calendar-grid__day${dayInfo.active ? " is-active" : ""}${dayInfo.isToday && !dayInfo.active ? " is-today" : ""}${dayInfo.muted ? " is-muted" : ""}`,
      String(dayInfo.value),
    );
    dayButton.type = "button";

    if (!dayInfo.isCurrentMonth) {
      dayButton.disabled = true;
    }

    dayButton.addEventListener("click", () => {
      if (callbacks.onDayClick) callbacks.onDayClick(dayInfo);
    });

    dayGrid.append(dayButton);
  });

  sectionHeader.append(sectionTitle, viewAll);
  monthActions.append(monthPrev, monthCollapse, monthNext);
  monthBar.append(monthLabel, monthActions);
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

export function createCalendarWorkspace(activeApp, state = {}, callbacks = {}) {
  const wrapper = createElement("section", "calendar-workspace");
  const toolbar = createElement("div", "calendar-workspace__toolbar");
  const tabs = createElement("div", "calendar-workspace__tabs");
  const tab1 = createElement("button", "calendar-workspace__tab is-active", "Upcoming Events");
  const tab2 = createElement("button", "calendar-workspace__tab", "Monthly View");
  const surface = createElement("div", "calendar-surface");
  
  // Surface header
  const surfaceHeader = createElement("div", "calendar-surface__header");
  const surfaceTitle = createElement("h2", "calendar-surface__title");
  const surfaceNav = createElement("div", "calendar-surface__nav");
  
  const today = getTodayDate();
  const monthNames = MONTH_NAMES;
  const displayYear = state.calendar?.displayYear || today.getFullYear();
  const displayMonth = state.calendar?.displayMonth || today.getMonth();
  surfaceTitle.textContent = `${monthNames[displayMonth]} ${displayYear}`;
  
  // Navigation buttons
  const prevBtn = createElement("button", "calendar-surface__nav-button");
  const nextBtn = createElement("button", "calendar-surface__nav-button");
  prevBtn.append(createIcon("chevron-left"));
  nextBtn.append(createIcon("chevron-right"));
  prevBtn.type = "button";
  nextBtn.type = "button";
  
  // Wire up navigation callbacks
  prevBtn.addEventListener("click", () => {
    if (callbacks.onMonthPrev) callbacks.onMonthPrev();
  });
  nextBtn.addEventListener("click", () => {
    if (callbacks.onMonthNext) callbacks.onMonthNext();
  });
  
  // Wire up tab switching
  tab1.type = "button";
  tab2.type = "button";
  tab1.addEventListener("click", () => {
    tab1.classList.add("is-active");
    tab2.classList.remove("is-active");
    if (callbacks.onTabChange) callbacks.onTabChange("upcoming");
  });
  tab2.addEventListener("click", () => {
    tab2.classList.add("is-active");
    tab1.classList.remove("is-active");
    if (callbacks.onTabChange) callbacks.onTabChange("monthly");
  });
  
  surfaceNav.append(prevBtn, nextBtn);
  surfaceHeader.append(surfaceTitle, surfaceNav);
  
  // Weekdays header
  const weekdays = createElement("div", "calendar-surface__weekdays");
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach(day => {
    weekdays.append(createElement("div", "calendar-surface__weekday", day));
  });
  
  // Calendar board (grid)
  const board = createElement("div", "calendar-surface__board");
  const calendarDays = buildCalendarDays(
    displayYear,
    displayMonth,
    getSelectedCalendarDate(state)
  );
  
  calendarDays.forEach(dayInfo => {
    const cell = createElement("div", "calendar-surface__cell");
    if (dayInfo.muted) cell.classList.add("is-muted");
    if (dayInfo.active) cell.classList.add("is-selected");
    if (dayInfo.isToday) cell.classList.add("is-today");
    
    const dateEl = createElement("button", "calendar-surface__date");
    dateEl.type = "button";
    dateEl.textContent = dayInfo.value;
    if (dayInfo.isToday) dateEl.classList.add("is-today");
    
    // Wire up day click
    dateEl.addEventListener("click", () => {
      if (callbacks.onDayClick) callbacks.onDayClick(dayInfo);
    });
    
    cell.append(dateEl);
    board.append(cell);
  });
  
  surface.append(surfaceHeader, weekdays, board);
  tabs.append(tab1, tab2);
  toolbar.append(tabs);
  wrapper.append(toolbar, surface);
  
  return wrapper;
}

export function createCalendarEventsPopup(activeApp, state, isOpen = false, onClose = () => {}) {
  const overlay = createElement(
    "div",
    `calendar-events-modal-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "calendar-events-modal-overlay__backdrop");
  const modal = createElement("div", "calendar-events-modal");
  const header = createElement("div", "calendar-events-modal__header");
  const headerCopy = createElement("div", "calendar-events-modal__header-copy");
  const eyebrow = createElement("p", "calendar-events-modal__eyebrow", "Events");
  const title = createElement("h2", "calendar-events-modal__title");
  const closeBtn = createElement("button", "calendar-events-modal__close");
  const list = createElement("div", "calendar-events-modal__list");

  const selectedDate = getSelectedCalendarDate(state);
  title.textContent = `${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  closeBtn.append(createIcon("close"));
  closeBtn.type = "button";
  closeBtn.addEventListener("click", onClose);
  backdrop.type = "button";
  backdrop.addEventListener("click", onClose);

  header.append(headerCopy, closeBtn);
  headerCopy.append(eyebrow, title);

  const dayEvents = getEventsForDate(activeApp, selectedDate);
  
  if (dayEvents.length === 0) {
    list.append(
      createElement("p", "calendar-events-modal__empty", "No events on this day")
    );
  } else {
    dayEvents.forEach((event) => {
      const card = createElement("article", "calendar-events-modal__card");
      const accent = createElement("div", "calendar-events-modal__accent");
      const dateEl = createElement("div", "calendar-events-modal__date");
      const day = createElement("strong", "calendar-events-modal__day", event.day);
      const month = createElement("span", "calendar-events-modal__month", event.monthLabel);
      const cardBody = createElement("div", "calendar-events-modal__card-body");
      const cardTitle = createElement("h4", "calendar-events-modal__card-title", event.title);
      const cardMeta = createElement("p", "calendar-events-modal__card-meta", event.meta);
      const tagStyle = getEventTagStyle(getNormalizedEventTag(event));
      
      accent.style.setProperty("--event-accent", tagStyle.color);
      dateEl.append(day, month);
      cardBody.append(cardTitle, cardMeta);
      card.append(accent, dateEl, cardBody);
      
      card.addEventListener("click", () => {
        if (onClose) onClose();
      });
      
      list.append(card);
    });
  }

  modal.append(header, list);
  overlay.append(backdrop, modal);
  
  return overlay;
}

// ===== Event Drawer =====

export function createEventDrawer(state, closeDrawer, onSave, isOpen = false) {
  const overlay = createElement(
    "div",
    `event-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "event-drawer-overlay__backdrop");
  const drawer = createElement("div", "event-drawer");
  const header = createElement("div", "event-drawer__header");
  const headerLeft = createElement("div", "event-drawer__header-left");
  const title = createElement("h3", "event-drawer__title", "New Event");
  const closeBtn = createElement("button", "event-drawer__close");
  const body = createElement("div", "event-drawer__body");
  
  const draft = state.eventDraft;
  
  closeBtn.append(createIcon("close"));
  closeBtn.type = "button";
  closeBtn.addEventListener("click", closeDrawer);
  backdrop.type = "button";
  backdrop.addEventListener("click", closeDrawer);
  
  headerLeft.append(title);
  header.append(headerLeft, closeBtn);
  
  // Title field
  const titleGroup = createElement("div", "drawer-form__group drawer-form__group--compact");
  const titleLabel = createElement("label", "drawer-form__label", "Event Title");
  const titleInput = createElement("input", "drawer-form__title-input");
  titleInput.type = "text";
  titleInput.placeholder = "Enter event title";
  titleInput.value = draft.title || "";
  titleInput.addEventListener("input", (e) => {
    state.eventDraft.title = e.target.value;
  });
  titleGroup.append(titleLabel, titleInput);
  
  // Description field
  const descGroup = createElement("div", "drawer-form__group");
  const descLabel = createElement("label", "drawer-form__label", "Description");
  const descTextarea = createElement("textarea", "drawer-form__textarea");
  descTextarea.placeholder = "Add description";
  descTextarea.value = draft.description || "";
  descTextarea.addEventListener("input", (e) => {
    state.eventDraft.description = e.target.value;
  });
  descGroup.append(descLabel, descTextarea);
  
  // All day toggle
  const allDayRow = createElement("div", "drawer-form__all-day-row");
  const allDayLabel = createElement("label", "drawer-form__all-day-label");
  const allDayCheckbox = document.createElement("input");
  allDayCheckbox.type = "checkbox";
  allDayCheckbox.checked = draft.isAllDay || false;
  allDayCheckbox.addEventListener("change", (e) => {
    state.eventDraft.isAllDay = e.target.checked;
  });
  allDayLabel.append(allDayCheckbox, document.createTextNode("All day"));
  allDayRow.append(allDayLabel);
  
  body.append(titleGroup, descGroup, allDayRow);
  drawer.append(header, body);
  overlay.append(backdrop, drawer);
  
  return overlay;
}

export function createEventDetailDrawer(event, state, closeDrawer, onSave, isOpen = false) {
  const overlay = createElement(
    "div",
    `event-drawer-overlay${isOpen ? " is-open" : ""}`,
  );
  // Similar structure to createEventDrawer but for viewing/editing existing event
  const backdrop = createElement("button", "event-drawer-overlay__backdrop");
  const drawer = createElement("div", "event-drawer");
  
  backdrop.type = "button";
  backdrop.addEventListener("click", closeDrawer);
  
  overlay.append(backdrop, drawer);
  
  return overlay;
}

// ===== Attachment functions =====

export function getEventAttachments(event) {
  if (Array.isArray(event.attachments) && event.attachments.length > 0) {
    return event.attachments;
  }

  if (event.attachmentName || event.attachmentFile?.name) {
    return [
      {
        name: event.attachmentName || event.attachmentFile?.name || "Attachment",
        type: event.attachmentFile?.type || "",
        dataUrl: event.attachmentFile?.dataUrl || "",
      },
    ];
  }

  return [];
}

export function createAttachmentPreview(fileData, options = {}) {
  const imageClassName = options.imageClassName ?? "drawer-detail__attachment-image";
  const frameClassName = options.frameClassName ?? "drawer-detail__attachment-frame";

  if (!fileData?.dataUrl) {
    return null;
  }

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

export async function loadPdfJs() {
  if (!pdfJsLibPromise) {
    pdfJsLibPromise = import(PDFJS_MODULE_URL)
      .then((module) => {
        return module;
      });
  }
  return pdfJsLibPromise;
}

export function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function createDrawerAttachmentPreview(fileData) {
  return createAttachmentPreview(fileData, {
    imageClassName: "drawer-detail__attachment-image",
    frameClassName: "drawer-detail__attachment-frame",
  });
}

export function createAttachmentViewerOverlayLegacy(state, isOpen = false, onClose = () => {}) {
  const overlay = createElement(
    "div",
    `attachment-viewer-overlay${isOpen ? " is-open" : ""}`,
  );
  const backdrop = createElement("button", "attachment-viewer-overlay__backdrop");
  const viewer = createElement("div", "attachment-viewer");
  
  backdrop.type = "button";
  backdrop.addEventListener("click", onClose);
  
  viewer.append(backdrop, viewer);
  overlay.append(backdrop, viewer);
  
  return overlay;
}

export function createAttachmentViewerOverlay(state, isOpen = false, onClose = () => {}) {
  return createAttachmentViewerOverlayLegacy(state, isOpen, onClose);
}

export function downloadAttachmentFile(fileData) {
  const link = document.createElement("a");
  link.href = fileData.dataUrl;
  link.download = fileData.name || "attachment";
  link.click();
}
