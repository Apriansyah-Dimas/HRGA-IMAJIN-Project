export function createAssetsWorkspaceView(context) {
  const {
    activeApp,
    state,
    render,
    createElement,
    createIcon,
    getInitialAssetDraft,
    formatAssetDateLabel,
    formatAssetDateTimeLabel,
    getAssetStatusTone,
    ensureSelectedId,
    assetPageMeta,
    inventoryFilters,
    requestFilters,
  } = context;

  function setAssetNotice(text, tone = "info") {
    state.assets.notice = { text, tone };
  }

  function getAssetDraftFromRecord(record) {
    return {
      code: record.code ?? "",
      name: record.name ?? "",
      category: record.category ?? "",
      department: record.department ?? "",
      assignedTo: record.assignedTo === "-" ? "" : record.assignedTo ?? "",
      location: record.location ?? "",
      status: record.status ?? "Available",
      dueLabel: record.dueLabel ?? "-",
      condition: record.condition ?? "Ready to deploy",
      serialNumber: record.serialNumber ?? "",
      purchaseDate: record.purchaseDate ?? formatAssetDateLabel(new Date()),
      valueLabel: record.valueLabel ?? "Rp 0",
      notes: record.notes ?? "",
    };
  }

  function resetAssetDraft(record = null) {
    state.assets.draft = record ? getAssetDraftFromRecord(record) : getInitialAssetDraft();
    state.assets.draftErrors = {};
    state.assets.editingAssetId = record?.id ?? null;
  }

  function openAssetForm(record = null) {
    state.lastAction = record ? "edit-asset" : "new-asset";
    state.activeItem = "New asset";
    state.assetMenuId = null;
    resetAssetDraft(record);
  }

  function syncAssetsSelections() {
    state.assets.selectedRecordId = ensureSelectedId(activeApp.records, state.assets.selectedRecordId);
    state.assets.selectedMaintenanceId = ensureSelectedId(
      activeApp.maintenanceRequests,
      state.assets.selectedMaintenanceId
    );
    state.assets.selectedRequestId = ensureSelectedId(activeApp.assetRequests, state.assets.selectedRequestId);
    state.assets.selectedCheckOutId = ensureSelectedId(activeApp.checkOuts, state.assets.selectedCheckOutId);
    state.assets.selectedCheckInId = ensureSelectedId(activeApp.checkIns, state.assets.selectedCheckInId);
    state.assets.selectedMutationId = ensureSelectedId(activeApp.mutations, state.assets.selectedMutationId);
    state.assets.selectedStockId = ensureSelectedId(activeApp.stockOpnames, state.assets.selectedStockId);
    state.assets.selectedAccessId = ensureSelectedId(activeApp.accessControls, state.assets.selectedAccessId);
  }

  function downloadTextFile(filename, content, mimeType = "application/json") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    document.body.append(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 0);
  }

  function exportAssetSnapshot() {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      inventory: activeApp.records,
      maintenance: activeApp.maintenanceRequests,
      requests: activeApp.assetRequests,
      checkOuts: activeApp.checkOuts,
      checkIns: activeApp.checkIns,
      mutations: activeApp.mutations,
      stockOpnames: activeApp.stockOpnames,
      accessControls: activeApp.accessControls,
    };

    downloadTextFile(
      `imajin-asset-snapshot-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(snapshot, null, 2)
    );
    setAssetNotice("Asset snapshot exported for this workspace.", "success");
  }

  function createActionButton(label, variant = "ghost", iconName = "") {
    const button = createElement("button", `asset-button asset-button--${variant}`, label);

    button.type = "button";

    if (iconName) {
      button.prepend(createIcon(iconName));
    }

    return button;
  }

  function createAssetBadge(label, tone, extraClass = "") {
    return createElement("span", `asset-badge asset-tone--${tone}${extraClass ? ` ${extraClass}` : ""}`, label);
  }

  function createAssetEmptyState(title, copy, actionLabel, onAction) {
    const empty = createElement("div", "asset-empty");
    const titleElement = createElement("strong", "asset-empty__title", title);
    const copyElement = createElement("p", "asset-empty__copy", copy);

    empty.append(titleElement, copyElement);

    if (actionLabel && onAction) {
      const actionButton = createActionButton(actionLabel, "ghost", "arrow-right");
      actionButton.addEventListener("click", onAction);
      empty.append(actionButton);
    }

    return empty;
  }

  function createFactGrid(facts) {
    const grid = createElement("div", "asset-facts");

    facts.filter(Boolean).forEach((fact) => {
      const item = createElement("div", "asset-fact");
      const label = createElement("span", "asset-fact__label", fact.label);
      const value = createElement("strong", "asset-fact__value");

      if (fact.value instanceof Node) {
        value.append(fact.value);
      } else {
        value.textContent = fact.value ?? "-";
      }

      item.append(label, value);
      grid.append(item);
    });

    return grid;
  }

  function createDetailHeader(titleText, subtitleText, badges = []) {
    const header = createElement("div", "asset-detail__header");
    const copy = createElement("div", "asset-detail__headline");
    const title = createElement("h3", "asset-detail__title", titleText);
    const subtitle = createElement("p", "asset-detail__subtitle", subtitleText);
    const badgeRow = createElement("div", "asset-detail__badges");

    copy.append(title, subtitle);
    header.append(copy);

    if (badges.length > 0) {
      badges.forEach((badge) => {
        badgeRow.append(badge);
      });
      header.append(badgeRow);
    }

    return header;
  }

  function createDetailSection(labelText, copyText) {
    const section = createElement("section", "asset-detail__section");
    const label = createElement("p", "asset-detail__section-label", labelText);
    const copy = createElement("p", "asset-detail__section-copy", copyText);

    section.append(label, copy);
    return section;
  }

  function matchesAssetSearch(query, values) {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return values.join(" ").toLowerCase().includes(normalizedQuery);
  }

  function getFilteredAssetItems(items, pageKey, getSearchFields, toneField = "statusTone") {
    const query = state.assets.searches[pageKey] ?? "";
    const filter = state.assets.filters[pageKey] ?? "all";

    return items.filter((item) => {
      return (
        matchesAssetSearch(query, getSearchFields(item)) &&
        (filter === "all" || item[toneField] === filter)
      );
    });
  }

  function createAssetQueryToolbar(pageKey, placeholder, filterOptions) {
    const toolbar = createElement("div", "asset-query-toolbar");
    const search = createElement("label", "asset-query");
    const searchInput = createElement("input", "asset-query__input");

    searchInput.type = "search";
    searchInput.placeholder = placeholder;
    searchInput.value = state.assets.searches[pageKey] ?? "";
    searchInput.setAttribute("aria-label", placeholder);
    searchInput.addEventListener("input", (event) => {
      state.assets.searches[pageKey] = event.target.value;
      render();
    });

    search.append(createIcon("search"), searchInput);
    toolbar.append(search);

    if (Array.isArray(filterOptions) && filterOptions.length > 0) {
      const filters = createElement("div", "asset-filters");

      filterOptions.forEach(([value, label]) => {
        const button = createElement(
          "button",
          `asset-filter-chip${state.assets.filters[pageKey] === value ? " is-active" : ""}`,
          label
        );

        button.type = "button";
        button.addEventListener("click", () => {
          state.assets.filters[pageKey] = value;
          render();
        });
        filters.append(button);
      });

      toolbar.append(filters);
    }

    return toolbar;
  }

  function getNextAssetSequence() {
    return (
      activeApp.records.reduce((maxValue, record) => {
        const numericPart = Number(record.code?.match(/(\d+)/)?.[1] ?? 0);
        return Math.max(maxValue, numericPart);
      }, 0) + 1
    );
  }

  function createImportedAsset() {
    const sequence = getNextAssetSequence();
    const padded = String(sequence).padStart(3, "0");
    const record = {
      id: `asset-${padded}`,
      code: `AST-${padded}`,
      name: `Imported docking station batch ${padded}`,
      category: "Accessory",
      department: "Operations",
      assignedTo: "-",
      location: "Jakarta HQ",
      status: "Available",
      statusTone: "available",
      dueLabel: "-",
      condition: "Fresh import batch",
      serialNumber: `DK-${padded}-IMJ`,
      purchaseDate: formatAssetDateLabel(new Date()),
      valueLabel: "Rp 2.450.000",
      notes: "Added from sample import action for quick UI validation.",
    };

    activeApp.records.unshift(record);
    state.assets.selectedRecordId = record.id;
    state.assets.searches.inventory = "";
    state.assets.filters.inventory = "all";
    setAssetNotice(`1 sample asset imported into inventory as ${record.code}.`, "success");
  }

  function saveAssetDraft() {
    const draft = state.assets.draft;
    const errors = {};
    const normalizedCode = draft.code.trim().toUpperCase();
    const normalizedName = draft.name.trim();
    const normalizedCategory = draft.category.trim();
    const normalizedLocation = draft.location.trim();

    if (!normalizedCode) {
      errors.code = "Asset code is required.";
    }

    if (!normalizedName) {
      errors.name = "Asset name is required.";
    }

    if (!normalizedCategory) {
      errors.category = "Category is required.";
    }

    if (!normalizedLocation) {
      errors.location = "Location is required.";
    }

    const duplicateCode = activeApp.records.some((record) => {
      return record.code?.toLowerCase() === normalizedCode.toLowerCase() && record.id !== state.assets.editingAssetId;
    });

    if (duplicateCode) {
      errors.code = "Asset code must be unique.";
    }

    if (Object.keys(errors).length > 0) {
      state.assets.draftErrors = errors;
      setAssetNotice("Asset could not be saved. Review the highlighted fields.", "danger");
      return false;
    }

    const payload = {
      code: normalizedCode,
      name: normalizedName,
      category: normalizedCategory,
      department: draft.department.trim() || "General",
      assignedTo: draft.assignedTo.trim() || "-",
      location: normalizedLocation,
      status: draft.status,
      statusTone: getAssetStatusTone(draft.status),
      dueLabel: draft.dueLabel.trim() || "-",
      condition: draft.condition.trim() || "Ready to deploy",
      serialNumber: draft.serialNumber.trim() || "-",
      purchaseDate: draft.purchaseDate.trim() || formatAssetDateLabel(new Date()),
      valueLabel: draft.valueLabel.trim() || "Rp 0",
      notes: draft.notes.trim() || "No additional notes.",
    };

    let targetRecord = activeApp.records.find((record) => record.id === state.assets.editingAssetId);

    if (targetRecord) {
      Object.assign(targetRecord, payload);
      setAssetNotice(`${payload.code} updated in the inventory registry.`, "success");
    } else {
      const sequence = getNextAssetSequence();
      const padded = String(sequence).padStart(3, "0");
      targetRecord = {
        id: `asset-${padded}`,
        ...payload,
      };
      activeApp.records.unshift(targetRecord);
      setAssetNotice(`${payload.code} added to the inventory registry.`, "success");
    }

    state.assets.selectedRecordId = targetRecord.id;
    state.assets.draftErrors = {};
    state.activeItem = "Assets";
    state.assetMenuId = null;
    resetAssetDraft();
    return true;
  }

  function createAssetHero() {
    const meta = assetPageMeta[state.activeItem] ?? assetPageMeta.Dashboard;
    const hero = createElement("header", "asset-hub__hero");
    const copy = createElement("div", "asset-hub__copy");
    const eyebrow = createElement("p", "asset-hub__eyebrow", meta.eyebrow);
    const title = createElement("h2", "asset-hub__title", meta.title);
    const description = createElement("p", "asset-hub__description", meta.description);
    const metrics = createElement("div", "asset-hub__metrics");
    const actions = createElement("div", "asset-hub__actions");

    [
      { label: "Inventory", value: String(activeApp.records.length) },
      {
        label: "Open service",
        value: String(activeApp.maintenanceRequests.filter((item) => item.statusTone !== "completed").length),
      },
      {
        label: "Pending approvals",
        value: String(activeApp.assetRequests.filter((item) => item.statusTone === "pending").length),
      },
      {
        label: "Active transfers",
        value: String(activeApp.mutations.filter((item) => item.statusTone !== "completed").length),
      },
    ].forEach((metric) => {
      const item = createElement("div", "asset-hub__metric");
      item.append(
        createElement("strong", "asset-hub__metric-value", metric.value),
        createElement("span", "asset-hub__metric-label", metric.label)
      );
      metrics.append(item);
    });

    if (state.activeItem === "New asset") {
      const backButton = createActionButton("Back to inventory", "ghost", "chevron-left");
      backButton.addEventListener("click", () => {
        state.activeItem = "Assets";
        state.assets.draftErrors = {};
        render();
      });
      actions.append(backButton);
    } else {
      const exportButton = createActionButton("Export snapshot", "ghost", "export");
      const createButton = createActionButton("New asset", "primary", "plus");

      exportButton.addEventListener("click", () => {
        exportAssetSnapshot();
        render();
      });
      createButton.addEventListener("click", () => {
        openAssetForm();
        render();
      });

      actions.append(exportButton, createButton);
    }

    copy.append(eyebrow, title, description, metrics);
    hero.append(copy, actions);

    return hero;
  }

  function createAssetNoticeBanner() {
    if (!state.assets.notice) {
      return null;
    }

    const notice = createElement("div", `asset-notice asset-tone--${state.assets.notice.tone}`);
    const copy = createElement("div", "asset-notice__copy");
    const title = createElement("strong", "asset-notice__title", "Workspace update");
    const text = createElement("p", "asset-notice__text", state.assets.notice.text);
    const closeButton = createActionButton("", "icon", "close");

    notice.setAttribute("role", "status");
    closeButton.setAttribute("aria-label", "Dismiss asset notice");
    closeButton.addEventListener("click", () => {
      state.assets.notice = null;
      render();
    });

    copy.append(title, text);
    notice.append(copy, closeButton);

    return notice;
  }

  function handleInventoryMenuAction(action, record) {
    if (action === "view") {
      state.assets.selectedRecordId = record.id;
      state.assetMenuId = null;
      setAssetNotice(`${record.code} is pinned in the detail panel.`, "info");
      return;
    }

    if (action === "edit") {
      openAssetForm(record);
      return;
    }

    if (action === "remove") {
      const recordIndex = activeApp.records.findIndex((item) => item.id === record.id);

      if (recordIndex >= 0) {
        activeApp.records.splice(recordIndex, 1);
      }

      state.assetMenuId = null;
      state.assets.selectedRecordId = ensureSelectedId(activeApp.records, state.assets.selectedRecordId);
      setAssetNotice(`${record.code} removed from the inventory list.`, "warning");
    }
  }

  function createDashboardPage() {
    const page = createElement("section", "asset-dashboard");
    const summaryGrid = createElement("div", "asset-summary-grid");
    const overviewPanel = createElement("section", "asset-panel asset-panel--soft");
    const overviewHeader = createElement("div", "asset-panel__header");
    const overviewTitle = createElement("h3", "asset-panel__title", "Operational pulse");
    const overviewCopy = createElement(
      "p",
      "asset-panel__copy",
      "High-signal sections to jump directly into the queue that needs attention."
    );
    const laneGrid = createElement("div", "asset-lane-grid");
    const attentionPanel = createElement("section", "asset-panel asset-panel--soft");
    const attentionHeader = createElement("div", "asset-panel__header");
    const attentionTitle = createElement("h3", "asset-panel__title", "Needs attention");
    const attentionCopy = createElement(
      "p",
      "asset-panel__copy",
      "The most urgent blockers surfaced from the maintenance, request, and transfer queues."
    );
    const attentionList = createElement("div", "asset-attention-list");
    const activityPanel = createElement("section", "asset-panel asset-panel--soft");
    const activityHeader = createElement("div", "asset-panel__header");
    const activityTitle = createElement("h3", "asset-panel__title", "Recent activity");
    const activityCopy = createElement(
      "p",
      "asset-panel__copy",
      "A short audit trail of asset actions already completed today."
    );
    const activityList = createElement("div", "asset-activity-list");

    activeApp.overview.summary.forEach((metric) => {
      const card = createElement("article", "asset-summary-card");
      const value = createElement("strong", "asset-summary-card__value", metric.value);
      const label = createElement("p", "asset-summary-card__label", metric.label);
      const note = createElement("p", "asset-summary-card__note", metric.note);

      card.append(value, label, note);
      summaryGrid.append(card);
    });

    [
      {
        item: "Assets",
        icon: "assets-app",
        title: "Inventory registry",
        meta: `${activeApp.records.length} assets with live status and placement.`,
      },
      {
        item: "Maintenance Asset Request",
        icon: "tool",
        title: "Maintenance desk",
        meta: `${activeApp.maintenanceRequests.filter((entry) => entry.statusTone !== "completed").length} open service cases to triage.`,
      },
      {
        item: "Asset Request",
        icon: "users",
        title: "Approval lane",
        meta: `${activeApp.assetRequests.filter((entry) => entry.statusTone === "pending").length} pending requests need review.`,
      },
      {
        item: "Stock Opname",
        icon: "shield",
        title: "Audit batches",
        meta: `${activeApp.stockOpnames.filter((entry) => entry.statusTone !== "completed").length} active or upcoming count windows.`,
      },
    ].forEach((lane) => {
      const card = createElement("article", "asset-lane-card");
      const icon = createElement("div", "asset-lane-card__icon");
      const title = createElement("h4", "asset-lane-card__title", lane.title);
      const meta = createElement("p", "asset-lane-card__meta", lane.meta);
      const button = createActionButton("Open", "ghost", "arrow-right");

      icon.append(createIcon(lane.icon));
      button.addEventListener("click", () => {
        state.activeItem = lane.item;
        render();
      });

      card.append(icon, title, meta, button);
      laneGrid.append(card);
    });

    activeApp.overview.attention.forEach((entry, index) => {
      const card = createElement("article", "asset-attention-card");
      const title = createElement("h4", "asset-attention-card__title", entry.title);
      const meta = createElement("p", "asset-attention-card__meta", entry.meta);
      const description = createElement("p", "asset-attention-card__copy", entry.description);
      const actionButton = createActionButton("Review", "ghost", "arrow-right");
      const targetItem =
        index === 0
          ? "Maintenance Asset Request"
          : index === 1
            ? "Asset Request"
            : "Asset Mutation";

      card.append(
        createAssetBadge(entry.tone === "info" ? "Monitor" : "Priority", entry.tone),
        title,
        meta,
        description
      );
      actionButton.addEventListener("click", () => {
        state.activeItem = targetItem;
        render();
      });
      card.append(actionButton);
      attentionList.append(card);
    });

    activeApp.overview.activity.forEach((entry) => {
      const item = createElement("article", "asset-activity-item");
      const title = createElement("strong", "asset-activity-item__title", entry.title);
      const meta = createElement("p", "asset-activity-item__meta", entry.meta);
      const time = createElement("span", "asset-activity-item__time", entry.time);

      item.append(time, title, meta);
      activityList.append(item);
    });

    overviewHeader.append(overviewTitle, overviewCopy);
    attentionHeader.append(attentionTitle, attentionCopy);
    activityHeader.append(activityTitle, activityCopy);
    overviewPanel.append(overviewHeader, laneGrid);
    attentionPanel.append(attentionHeader, attentionList);
    activityPanel.append(activityHeader, activityList);
    page.append(summaryGrid, overviewPanel, attentionPanel, activityPanel);

    return page;
  }

  function createInventoryPage() {
    const page = createElement("section", "asset-page");
    const stats = createElement("div", "asset-summary-strip");
    const layout = createElement("div", "asset-layout asset-layout--inventory");
    const listPanel = createElement("section", "asset-panel asset-panel--soft");
    const detailPanel = createElement("aside", "asset-panel asset-panel--detail");
    const filteredRecords = getFilteredAssetItems(activeApp.records, "inventory", (record) => {
      return [
        record.code,
        record.name,
        record.category,
        record.department,
        record.assignedTo,
        record.location,
        record.serialNumber,
      ];
    });

    if (filteredRecords.length > 0 && !filteredRecords.some((record) => record.id === state.assets.selectedRecordId)) {
      state.assets.selectedRecordId = filteredRecords[0].id;
    }

    const selectedRecord =
      filteredRecords.find((record) => record.id === state.assets.selectedRecordId) ?? null;
    const toolbar = createAssetQueryToolbar(
      "inventory",
      "Search asset, serial number, owner, or location",
      inventoryFilters
    );
    const toolbarActions = createElement("div", "asset-toolbar-actions");
    const importButton = createActionButton("Import sample", "ghost", "import");
    const resetButton = createActionButton("Reset", "ghost", "reset");
    const table = createElement("div", "asset-table");

    [
      {
        label: "In use",
        value: String(activeApp.records.filter((record) => record.statusTone === "in-use").length),
      },
      {
        label: "Available",
        value: String(activeApp.records.filter((record) => record.statusTone === "available").length),
      },
      {
        label: "Reserved",
        value: String(activeApp.records.filter((record) => record.statusTone === "reserved").length),
      },
      {
        label: "Maintenance",
        value: String(activeApp.records.filter((record) => record.statusTone === "maintenance").length),
      },
    ].forEach((item) => {
      const card = createElement("div", "asset-summary-strip__card");
      card.append(
        createElement("strong", "asset-summary-strip__value", item.value),
        createElement("span", "asset-summary-strip__label", item.label)
      );
      stats.append(card);
    });

    importButton.addEventListener("click", (event) => {
      event.stopPropagation();
      createImportedAsset();
      render();
    });
    resetButton.addEventListener("click", (event) => {
      event.stopPropagation();
      state.assets.searches.inventory = "";
      state.assets.filters.inventory = "all";
      state.assetMenuId = null;
      render();
    });

    toolbarActions.append(importButton, resetButton);
    toolbar.append(toolbarActions);

    [
      "Asset",
      "Category",
      "Assigned to",
      "Location",
      "Due",
      "Status",
      "",
    ].forEach((label, index) => {
      const cell = createElement("div", "asset-table__head", label);
      if (index === 6) {
        cell.setAttribute("aria-hidden", "true");
      }
      table.append(cell);
    });

    if (filteredRecords.length === 0) {
      table.append(
        createAssetEmptyState(
          "No asset matched the current search.",
          "Try a different keyword or reset the filter to see the full registry again.",
          "Clear filters",
          () => {
            state.assets.searches.inventory = "";
            state.assets.filters.inventory = "all";
            render();
          }
        )
      );
    } else {
      filteredRecords.forEach((record) => {
        const row = createElement(
          "article",
          `asset-table__row${selectedRecord?.id === record.id ? " is-selected" : ""}`
        );
        const primary = createElement("div", "asset-table__primary");
        const title = createElement("strong", "asset-table__title", record.name);
        const code = createElement("span", "asset-table__meta", `${record.code} | ${record.serialNumber}`);
        const actions = createElement("div", "asset-table__actions");
        const inlineActions = createElement("div", "asset-table__inline-actions");
        const viewButton = createActionButton("", "icon", "eye");
        const editButton = createActionButton("", "icon", "edit");
        const removeButton = createActionButton("", "icon", "trash");

        row.tabIndex = 0;
        row.addEventListener("click", () => {
          state.assets.selectedRecordId = record.id;
          render();
        });
        row.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            state.assets.selectedRecordId = record.id;
            render();
          }
        });

        primary.append(title, code);
        row.append(
          primary,
          createElement("div", "asset-table__cell", `${record.category} | ${record.department}`),
          createElement("div", "asset-table__cell", record.assignedTo),
          createElement("div", "asset-table__cell", record.location),
          createElement("div", "asset-table__cell", record.dueLabel),
          createAssetBadge(record.status, record.statusTone, "asset-table__badge")
        );

        viewButton.setAttribute("aria-label", `View detail for ${record.name}`);
        editButton.setAttribute("aria-label", `Edit ${record.name}`);
        removeButton.setAttribute("aria-label", `Remove ${record.name}`);
        removeButton.classList.add("asset-button--danger");

        viewButton.addEventListener("click", (event) => {
          event.stopPropagation();
          handleInventoryMenuAction("view", record);
          render();
        });
        editButton.addEventListener("click", (event) => {
          event.stopPropagation();
          handleInventoryMenuAction("edit", record);
          render();
        });
        removeButton.addEventListener("click", (event) => {
          event.stopPropagation();
          handleInventoryMenuAction("remove", record);
          render();
        });

        inlineActions.append(viewButton, editButton, removeButton);
        actions.append(inlineActions);

        row.append(actions);
        table.append(row);
      });
    }

    listPanel.append(toolbar, table);

    if (selectedRecord) {
      const header = createDetailHeader(selectedRecord.name, `${selectedRecord.code} | ${selectedRecord.department}`, [
        createAssetBadge(selectedRecord.status, selectedRecord.statusTone),
      ]);
      const actions = createElement("div", "asset-detail__actions");
      const editButton = createActionButton("Edit asset", "ghost", "edit");
      const toggleButton = createActionButton(
        selectedRecord.statusTone === "maintenance" ? "Return to pool" : "Send to maintenance",
        "primary",
        selectedRecord.statusTone === "maintenance" ? "check" : "tool"
      );
      const exportButton = createActionButton("Export record", "ghost", "export");

      editButton.addEventListener("click", () => {
        openAssetForm(selectedRecord);
        render();
      });
      toggleButton.addEventListener("click", () => {
        if (selectedRecord.statusTone === "maintenance") {
          selectedRecord.status = "Available";
          selectedRecord.statusTone = "available";
          selectedRecord.assignedTo = "-";
          selectedRecord.condition = "Returned from maintenance";
          selectedRecord.dueLabel = "-";
          setAssetNotice(`${selectedRecord.code} is back in the available pool.`, "success");
        } else {
          selectedRecord.status = "Maintenance";
          selectedRecord.statusTone = "maintenance";
          selectedRecord.dueLabel = formatAssetDateLabel(new Date());
          setAssetNotice(`${selectedRecord.code} moved to maintenance status.`, "warning");
        }
        render();
      });
      exportButton.addEventListener("click", () => {
        downloadTextFile(`${selectedRecord.code}.json`, JSON.stringify(selectedRecord, null, 2));
        setAssetNotice(`${selectedRecord.code} exported as a single record.`, "info");
        render();
      });

      actions.append(editButton, toggleButton, exportButton);
      detailPanel.append(
        header,
        actions,
        createFactGrid([
          { label: "Assigned to", value: selectedRecord.assignedTo },
          { label: "Location", value: selectedRecord.location },
          { label: "Category", value: selectedRecord.category },
          { label: "Serial number", value: selectedRecord.serialNumber },
          { label: "Purchase date", value: selectedRecord.purchaseDate },
          { label: "Value", value: selectedRecord.valueLabel },
          { label: "Condition", value: selectedRecord.condition },
          { label: "Next due", value: selectedRecord.dueLabel },
        ]),
        createDetailSection("Operational note", selectedRecord.notes)
      );
    } else {
      detailPanel.append(
        createAssetEmptyState(
          "No asset selected",
          "Select a row from the list to inspect assignment, value, and operational notes.",
          "View all assets",
          () => {
            state.assets.searches.inventory = "";
            state.assets.filters.inventory = "all";
            render();
          }
        )
      );
    }

    layout.append(listPanel, detailPanel);
    page.append(stats, layout);

    return page;
  }

  function createQueuePage({
    items,
    pageKey,
    selectedKey,
    placeholder,
    filterOptions,
    getSearchFields,
    emptyState,
    renderCard,
    renderDetail,
  }) {
    const layout = createElement("section", "asset-layout");
    const listPanel = createElement("section", "asset-panel asset-panel--soft");
    const detailPanel = createElement("aside", "asset-panel asset-panel--detail");
    const toolbar = createAssetQueryToolbar(pageKey, placeholder, filterOptions);
    const list = createElement("div", "asset-queue-list");
    const filteredItems = getFilteredAssetItems(items, pageKey, getSearchFields);

    if (filteredItems.length > 0 && !filteredItems.some((item) => item.id === state.assets[selectedKey])) {
      state.assets[selectedKey] = filteredItems[0].id;
    }

    const selectedItem = filteredItems.find((item) => item.id === state.assets[selectedKey]) ?? null;

    listPanel.append(toolbar);

    if (filteredItems.length === 0) {
      list.append(
        createAssetEmptyState(
          emptyState.title,
          emptyState.copy,
          emptyState.actionLabel,
          emptyState.onAction
        )
      );
    } else {
      filteredItems.forEach((item) => {
        const card = createElement(
          "button",
          `asset-queue-card${selectedItem?.id === item.id ? " is-selected" : ""}`
        );

        card.type = "button";
        card.addEventListener("click", () => {
          state.assets[selectedKey] = item.id;
          render();
        });
        renderCard(card, item);
        list.append(card);
      });
    }

    listPanel.append(list);

    if (selectedItem) {
      detailPanel.append(renderDetail(selectedItem));
    } else {
      detailPanel.append(
        createAssetEmptyState(
          emptyState.title,
          "Nothing matches the current view. Reset filters to continue.",
          emptyState.actionLabel,
          emptyState.onAction
        )
      );
    }

    layout.append(listPanel, detailPanel);

    return layout;
  }

  function createMaintenancePage() {
    return createQueuePage({
      items: activeApp.maintenanceRequests,
      pageKey: "maintenance",
      selectedKey: "selectedMaintenanceId",
      placeholder: "Search request, owner, location, or issue",
      filterOptions: requestFilters.maintenance,
      getSearchFields: (item) => [item.assetName, item.issue, item.requester, item.location, item.owner],
      emptyState: {
        title: "No maintenance request found",
        copy: "Try a different keyword or switch back to all statuses.",
        actionLabel: "Reset queue",
        onAction: () => {
          state.assets.searches.maintenance = "";
          state.assets.filters.maintenance = "all";
          render();
        },
      },
      renderCard: (card, item) => {
        card.append(
          createElement("strong", "asset-queue-card__title", item.assetName),
          createElement("p", "asset-queue-card__copy", item.issue),
          createElement("p", "asset-queue-card__meta", `${item.requester} | ${item.location}`),
          createAssetBadge(item.priority, item.priorityTone),
          createAssetBadge(item.status, item.statusTone)
        );
      },
      renderDetail: (item) => {
        const detail = createElement("div", "asset-detail");
        const actions = createElement("div", "asset-detail__actions");
        const assignButton = createActionButton("Assign owner", "primary", "users");
        const scheduleButton = createActionButton("Schedule vendor", "ghost", "calendar");
        const resolveButton = createActionButton("Resolve request", "ghost", "check");

        assignButton.addEventListener("click", () => {
          item.status = "In Progress";
          item.statusTone = "in-progress";
          item.owner = "Asset Care Desk";
          item.eta = "Today | 18:00";
          const asset = activeApp.records.find((record) => record.id === item.assetId);
          if (asset) {
            asset.status = "Maintenance";
            asset.statusTone = "maintenance";
          }
          setAssetNotice(`${item.assetName} assigned to the internal care desk.`, "success");
          render();
        });
        scheduleButton.addEventListener("click", () => {
          item.status = "Scheduled";
          item.statusTone = "scheduled";
          item.owner = "Vendor visit";
          item.eta = "17 Mar 2026 | 11:30";
          setAssetNotice(`${item.assetName} scheduled for vendor handling.`, "info");
          render();
        });
        resolveButton.addEventListener("click", () => {
          item.status = "Completed";
          item.statusTone = "completed";
          item.owner = "Closed";
          item.eta = "Resolved";
          const asset = activeApp.records.find((record) => record.id === item.assetId);
          if (asset) {
            asset.status = asset.assignedTo === "-" ? "Available" : "In Use";
            asset.statusTone = getAssetStatusTone(asset.status);
            asset.condition = "Post maintenance checked";
            asset.dueLabel = "-";
          }
          setAssetNotice(`${item.assetName} resolved and returned to the operational pool.`, "success");
          render();
        });

        detail.append(
          createDetailHeader(item.assetName, item.location, [
            createAssetBadge(item.priority, item.priorityTone),
            createAssetBadge(item.status, item.statusTone),
          ]),
          createFactGrid([
            { label: "Requester", value: item.requester },
            { label: "Owner", value: item.owner },
            { label: "ETA", value: item.eta },
            { label: "Created", value: item.createdAt },
          ]),
          createDetailSection("Issue summary", item.issue),
          actions
        );

        if (item.statusTone === "pending") {
          actions.append(assignButton, scheduleButton);
        } else if (item.statusTone === "scheduled") {
          actions.append(assignButton, resolveButton);
        } else if (item.statusTone === "in-progress") {
          actions.append(scheduleButton, resolveButton);
        } else {
          const inventoryButton = createActionButton("Open inventory", "ghost", "assets-app");
          inventoryButton.addEventListener("click", () => {
            state.activeItem = "Assets";
            render();
          });
          actions.append(inventoryButton);
        }

        return detail;
      },
    });
  }

  function createAssetRequestPage() {
    return createQueuePage({
      items: activeApp.assetRequests,
      pageKey: "request",
      selectedKey: "selectedRequestId",
      placeholder: "Search employee, team, request, or purpose",
      filterOptions: requestFilters.request,
      getSearchFields: (item) => [item.employee, item.team, item.requestedAsset, item.purpose],
      emptyState: {
        title: "No asset request found",
        copy: "The request queue is empty for the current filter.",
        actionLabel: "Reset approvals",
        onAction: () => {
          state.assets.searches.request = "";
          state.assets.filters.request = "all";
          render();
        },
      },
      renderCard: (card, item) => {
        card.append(
          createElement("strong", "asset-queue-card__title", item.requestedAsset),
          createElement("p", "asset-queue-card__copy", `${item.employee} | ${item.team}`),
          createElement("p", "asset-queue-card__meta", `${item.duration} | ${item.submittedAt}`),
          createAssetBadge(item.status, item.statusTone)
        );
      },
      renderDetail: (item) => {
        const detail = createElement("div", "asset-detail");
        const actions = createElement("div", "asset-detail__actions");
        const approveButton = createActionButton("Approve request", "primary", "check");
        const reviseButton = createActionButton("Need revision", "ghost", "alert");
        const rejectButton = createActionButton("Reject", "ghost", "close");

        approveButton.addEventListener("click", () => {
          item.status = "Approved";
          item.statusTone = "approved";
          item.approver = "Asset Admin";

          const availableRecord = activeApp.records.find((record) => record.statusTone === "available");
          if (availableRecord) {
            availableRecord.status = "Reserved";
            availableRecord.statusTone = "reserved";
            availableRecord.assignedTo = item.employee;
            availableRecord.dueLabel = "Pending handover";
          }

          const checkOutEntry = {
            id: `checkout-${Date.now()}`,
            assetId: availableRecord?.id ?? null,
            assetName: availableRecord?.name ?? item.requestedAsset,
            requester: item.employee,
            location: availableRecord?.location ?? "Jakarta HQ",
            pickupAt: "Next available slot",
            returnPlan: item.duration,
            status: "Ready for Handover",
            statusTone: "scheduled",
            notes: item.purpose,
          };

          activeApp.checkOuts.unshift(checkOutEntry);
          state.assets.selectedCheckOutId = checkOutEntry.id;
          setAssetNotice(`${item.employee}'s request approved and pushed to handover.`, "success");
          render();
        });
        reviseButton.addEventListener("click", () => {
          item.status = "Needs Revision";
          item.statusTone = "warning";
          setAssetNotice(`Revision requested from ${item.employee}.`, "warning");
          render();
        });
        rejectButton.addEventListener("click", () => {
          item.status = "Rejected";
          item.statusTone = "rejected";
          setAssetNotice(`${item.employee}'s request was rejected.`, "danger");
          render();
        });

        detail.append(
          createDetailHeader(item.requestedAsset, `${item.employee} | ${item.team}`, [
            createAssetBadge(item.status, item.statusTone),
          ]),
          createFactGrid([
            { label: "Duration", value: item.duration },
            { label: "Submitted", value: item.submittedAt },
            { label: "Approver", value: item.approver },
          ]),
          createDetailSection("Request purpose", item.purpose),
          actions
        );

        if (item.statusTone === "pending" || item.statusTone === "warning") {
          actions.append(approveButton, reviseButton, rejectButton);
        } else if (item.statusTone === "approved") {
          const handoverButton = createActionButton("Open handover queue", "ghost", "arrow-right");
          handoverButton.addEventListener("click", () => {
            state.activeItem = "Asset Check Out";
            render();
          });
          actions.append(handoverButton);
        } else {
          const resetButton = createActionButton("Reopen request", "ghost", "reset");
          resetButton.addEventListener("click", () => {
            item.status = "Pending Approval";
            item.statusTone = "pending";
            setAssetNotice(`${item.requestedAsset} moved back to pending approval.`, "info");
            render();
          });
          actions.append(resetButton);
        }

        return detail;
      },
    });
  }

  function createCheckOutPage() {
    return createQueuePage({
      items: activeApp.checkOuts,
      pageKey: "checkout",
      selectedKey: "selectedCheckOutId",
      placeholder: "Search requester, asset, location, or notes",
      filterOptions: requestFilters.checkout,
      getSearchFields: (item) => [item.assetName, item.requester, item.location, item.notes],
      emptyState: {
        title: "No handover item found",
        copy: "The handover queue is clear for this filter.",
        actionLabel: "Reset handovers",
        onAction: () => {
          state.assets.searches.checkout = "";
          state.assets.filters.checkout = "all";
          render();
        },
      },
      renderCard: (card, item) => {
        card.append(
          createElement("strong", "asset-queue-card__title", item.assetName),
          createElement("p", "asset-queue-card__copy", `${item.requester} | ${item.location}`),
          createElement("p", "asset-queue-card__meta", `${item.pickupAt} | ${item.returnPlan}`),
          createAssetBadge(item.status, item.statusTone)
        );
      },
      renderDetail: (item) => {
        const detail = createElement("div", "asset-detail");
        const actions = createElement("div", "asset-detail__actions");
        const confirmButton = createActionButton("Confirm handover", "primary", "check");
        const delayButton = createActionButton("Delay pickup", "ghost", "clock");

        confirmButton.addEventListener("click", () => {
          item.status = "Checked Out";
          item.statusTone = "approved";

          const asset = activeApp.records.find((record) => record.id === item.assetId);
          if (asset) {
            asset.assignedTo = item.requester;
            asset.location = item.location;
            asset.status = "In Use";
            asset.statusTone = "in-use";
            asset.dueLabel = item.returnPlan;
          }

          setAssetNotice(`${item.assetName} handed over to ${item.requester}.`, "success");
          render();
        });
        delayButton.addEventListener("click", () => {
          item.status = "Waiting Confirmation";
          item.statusTone = "pending";
          item.pickupAt = "Reschedule required";
          setAssetNotice(`Pickup window for ${item.assetName} was delayed.`, "warning");
          render();
        });

        detail.append(
          createDetailHeader(item.assetName, item.requester, [createAssetBadge(item.status, item.statusTone)]),
          createFactGrid([
            { label: "Pickup", value: item.pickupAt },
            { label: "Return plan", value: item.returnPlan },
            { label: "Location", value: item.location },
          ]),
          createDetailSection("Operational note", item.notes),
          actions
        );

        if (item.statusTone === "scheduled" || item.statusTone === "pending") {
          actions.append(confirmButton, delayButton);
        } else {
          const inventoryButton = createActionButton("Open inventory", "ghost", "assets-app");
          inventoryButton.addEventListener("click", () => {
            state.activeItem = "Assets";
            render();
          });
          actions.append(inventoryButton);
        }

        return detail;
      },
    });
  }

  function createCheckInPage() {
    return createQueuePage({
      items: activeApp.checkIns,
      pageKey: "checkin",
      selectedKey: "selectedCheckInId",
      placeholder: "Search return, condition, owner, or notes",
      filterOptions: requestFilters.checkin,
      getSearchFields: (item) => [item.assetName, item.returnedBy, item.condition, item.notes],
      emptyState: {
        title: "No return ticket found",
        copy: "The return desk is clear for this view.",
        actionLabel: "Reset returns",
        onAction: () => {
          state.assets.searches.checkin = "";
          state.assets.filters.checkin = "all";
          render();
        },
      },
      renderCard: (card, item) => {
        card.append(
          createElement("strong", "asset-queue-card__title", item.assetName),
          createElement("p", "asset-queue-card__copy", `${item.returnedBy} | ${item.receivedAt}`),
          createElement("p", "asset-queue-card__meta", item.condition),
          createAssetBadge(item.status, item.statusTone)
        );
      },
      renderDetail: (item) => {
        const detail = createElement("div", "asset-detail");
        const actions = createElement("div", "asset-detail__actions");
        const completeButton = createActionButton("Complete return", "primary", "check");
        const maintenanceButton = createActionButton("Send to maintenance", "ghost", "tool");

        completeButton.addEventListener("click", () => {
          item.status = "Closed";
          item.statusTone = "completed";

          const asset = activeApp.records.find((record) => record.id === item.assetId);
          if (asset) {
            asset.assignedTo = "-";
            if (item.condition.toLowerCase().includes("needs")) {
              asset.status = "Maintenance";
              asset.statusTone = "maintenance";
              asset.dueLabel = formatAssetDateLabel(new Date());
            } else {
              asset.status = "Available";
              asset.statusTone = "available";
              asset.dueLabel = "-";
            }
          }

          setAssetNotice(`${item.assetName} return completed.`, "success");
          render();
        });
        maintenanceButton.addEventListener("click", () => {
          item.status = "Inspection Needed";
          item.statusTone = "inspection";
          item.condition = "Needs technician review";
          item.conditionTone = "warning";

          const existingRequest = activeApp.maintenanceRequests.find((request) => request.assetId === item.assetId);
          if (!existingRequest) {
            activeApp.maintenanceRequests.unshift({
              id: `maint-${Date.now()}`,
              assetId: item.assetId,
              assetName: item.assetName,
              issue: item.condition,
              requester: item.returnedBy,
              location: "Return desk",
              priority: "Medium",
              priorityTone: "info",
              status: "Pending Review",
              statusTone: "pending",
              owner: "Unassigned",
              eta: "Awaiting triage",
              createdAt: formatAssetDateTimeLabel(new Date()),
            });
          }

          setAssetNotice(`${item.assetName} pushed into the maintenance queue.`, "warning");
          render();
        });

        detail.append(
          createDetailHeader(item.assetName, item.returnedBy, [
            createAssetBadge(item.status, item.statusTone),
            createAssetBadge(item.condition, item.conditionTone),
          ]),
          createFactGrid([
            { label: "Received", value: item.receivedAt },
            { label: "Condition", value: item.condition },
          ]),
          createDetailSection("Return note", item.notes),
          actions
        );

        if (item.statusTone === "inspection") {
          actions.append(completeButton, maintenanceButton);
        } else {
          const reopenButton = createActionButton("Reopen inspection", "ghost", "reset");
          reopenButton.addEventListener("click", () => {
            item.status = "Inspection Needed";
            item.statusTone = "inspection";
            setAssetNotice(`${item.assetName} reopened for inspection.`, "info");
            render();
          });
          actions.append(reopenButton);
        }

        return detail;
      },
    });
  }

  function createMutationPage() {
    return createQueuePage({
      items: activeApp.mutations,
      pageKey: "mutation",
      selectedKey: "selectedMutationId",
      placeholder: "Search route, asset, source, or destination",
      filterOptions: requestFilters.mutation,
      getSearchFields: (item) => [item.assetName, item.fromLocation, item.toLocation, item.note],
      emptyState: {
        title: "No mutation route found",
        copy: "Transfer queue is clear for the current status filter.",
        actionLabel: "Reset mutation view",
        onAction: () => {
          state.assets.searches.mutation = "";
          state.assets.filters.mutation = "all";
          render();
        },
      },
      renderCard: (card, item) => {
        card.append(
          createElement("strong", "asset-queue-card__title", item.assetName),
          createElement("p", "asset-queue-card__copy", `${item.fromLocation} to ${item.toLocation}`),
          createElement("p", "asset-queue-card__meta", `${item.initiatedBy} | ${item.scheduledAt}`),
          createAssetBadge(item.status, item.statusTone)
        );
      },
      renderDetail: (item) => {
        const detail = createElement("div", "asset-detail");
        const actions = createElement("div", "asset-detail__actions");
        const dispatchButton = createActionButton("Dispatch transfer", "primary", "swap");
        const receiveButton = createActionButton("Confirm arrival", "ghost", "check");

        dispatchButton.addEventListener("click", () => {
          item.status = "In Transit";
          item.statusTone = "in-progress";
          setAssetNotice(`${item.assetName} is now in transit to ${item.toLocation}.`, "info");
          render();
        });
        receiveButton.addEventListener("click", () => {
          item.status = "Completed";
          item.statusTone = "completed";
          const asset = activeApp.records.find((record) => record.id === item.assetId);
          if (asset) {
            asset.location = item.toLocation;
            if (asset.assignedTo === "-") {
              asset.status = "Stored";
              asset.statusTone = "stored";
            }
          }
          setAssetNotice(`${item.assetName} received in ${item.toLocation}.`, "success");
          render();
        });

        detail.append(
          createDetailHeader(item.assetName, `${item.fromLocation} to ${item.toLocation}`, [
            createAssetBadge(item.status, item.statusTone),
          ]),
          createFactGrid([
            { label: "Scheduled", value: item.scheduledAt },
            { label: "Initiated by", value: item.initiatedBy },
          ]),
          createDetailSection("Transfer note", item.note),
          actions
        );

        if (item.statusTone === "pending") {
          actions.append(dispatchButton);
        } else if (item.statusTone === "in-progress") {
          actions.append(receiveButton);
        } else {
          const inventoryButton = createActionButton("Open inventory", "ghost", "assets-app");
          inventoryButton.addEventListener("click", () => {
            state.activeItem = "Assets";
            render();
          });
          actions.append(inventoryButton);
        }

        return detail;
      },
    });
  }

  function createStockOpnamePage() {
    return createQueuePage({
      items: activeApp.stockOpnames,
      pageKey: "stock",
      selectedKey: "selectedStockId",
      placeholder: "Search area, owner, discrepancy, or schedule",
      filterOptions: requestFilters.stock,
      getSearchFields: (item) => [item.area, item.owner, item.discrepancy, item.schedule],
      emptyState: {
        title: "No stock opname batch found",
        copy: "Nothing is scheduled or active in the current filter.",
        actionLabel: "Reset audit view",
        onAction: () => {
          state.assets.searches.stock = "";
          state.assets.filters.stock = "all";
          render();
        },
      },
      renderCard: (card, item) => {
        card.append(
          createElement("strong", "asset-queue-card__title", item.area),
          createElement("p", "asset-queue-card__copy", `${item.scanned}/${item.total} assets counted`),
          createElement("p", "asset-queue-card__meta", `${item.schedule} | ${item.owner}`),
          createAssetBadge(item.status, item.statusTone)
        );
      },
      renderDetail: (item) => {
        const detail = createElement("div", "asset-detail");
        const actions = createElement("div", "asset-detail__actions");
        const progress = createElement("div", "asset-progress");
        const progressBar = createElement("span", "asset-progress__bar");
        const continueButton = createActionButton("Continue scan", "primary", "plus");
        const closeButton = createActionButton("Close batch", "ghost", "check");

        progressBar.style.width = `${item.completion}%`;
        progress.append(progressBar);

        continueButton.addEventListener("click", () => {
          const remaining = Math.max(item.total - item.scanned, 0);
          const increment = Math.max(4, Math.ceil(remaining / 2));
          item.scanned = Math.min(item.total, item.scanned + increment);
          item.completion = Math.round((item.scanned / item.total) * 100);
          item.status = item.completion >= 100 ? "Closed" : "Active";
          item.statusTone = item.completion >= 100 ? "completed" : "in-progress";
          item.discrepancy = item.completion >= 100 ? "Batch reconciled" : item.discrepancy;
          setAssetNotice(`${item.area} updated to ${item.completion}% completion.`, "info");
          render();
        });
        closeButton.addEventListener("click", () => {
          if (item.completion < 100) {
            setAssetNotice(`Cannot close ${item.area} before the count reaches 100%.`, "danger");
            render();
            return;
          }

          item.status = "Closed";
          item.statusTone = "completed";
          setAssetNotice(`${item.area} audit batch closed.`, "success");
          render();
        });

        detail.append(
          createDetailHeader(item.area, item.owner, [createAssetBadge(item.status, item.statusTone)]),
          createFactGrid([
            { label: "Schedule", value: item.schedule },
            { label: "Scanned", value: `${item.scanned} / ${item.total}` },
            { label: "Discrepancy", value: item.discrepancy },
          ]),
          progress,
          actions
        );

        if (item.statusTone !== "completed") {
          actions.append(continueButton, closeButton);
        } else {
          const resetButton = createActionButton("Reopen batch", "ghost", "reset");
          resetButton.addEventListener("click", () => {
            item.status = "Active";
            item.statusTone = "in-progress";
            item.completion = Math.min(item.completion, 96);
            item.scanned = Math.round((item.completion / 100) * item.total);
            setAssetNotice(`${item.area} reopened for audit continuation.`, "warning");
            render();
          });
          actions.append(resetButton);
        }

        return detail;
      },
    });
  }

  function createAccessControlPage() {
    return createQueuePage({
      items: activeApp.accessControls,
      pageKey: "access",
      selectedKey: "selectedAccessId",
      placeholder: "Search zone, role, credential, or note",
      filterOptions: requestFilters.access,
      getSearchFields: (item) => [item.name, item.zone, item.role, item.credential, item.notes],
      emptyState: {
        title: "No access policy found",
        copy: "The current access control view is empty.",
        actionLabel: "Reset access view",
        onAction: () => {
          state.assets.searches.access = "";
          state.assets.filters.access = "all";
          render();
        },
      },
      renderCard: (card, item) => {
        card.append(
          createElement("strong", "asset-queue-card__title", item.name),
          createElement("p", "asset-queue-card__copy", `${item.zone} | ${item.role}`),
          createElement("p", "asset-queue-card__meta", `${item.credential} | ${item.lastUsed}`),
          createAssetBadge(item.status, item.statusTone)
        );
      },
      renderDetail: (item) => {
        const detail = createElement("div", "asset-detail");
        const actions = createElement("div", "asset-detail__actions");
        const toggleButton = createActionButton(
          item.statusTone === "approved" ? "Revoke access" : "Restore access",
          "primary",
          item.statusTone === "approved" ? "close" : "check"
        );
        const auditButton = createActionButton("Log review", "ghost", "shield");

        toggleButton.addEventListener("click", () => {
          if (item.statusTone === "approved") {
            item.status = "Revoked";
            item.statusTone = "rejected";
            item.notes = "Access revoked from the workspace.";
            setAssetNotice(`${item.name} access revoked.`, "warning");
          } else {
            item.status = "Active";
            item.statusTone = "approved";
            item.lastUsed = formatAssetDateTimeLabel(new Date());
            item.notes = "Access restored and reviewed by asset admin.";
            setAssetNotice(`${item.name} access restored.`, "success");
          }
          render();
        });
        auditButton.addEventListener("click", () => {
          item.notes = `Audit log reviewed on ${formatAssetDateTimeLabel(new Date())}.`;
          setAssetNotice(`Audit note added for ${item.name}.`, "info");
          render();
        });

        detail.append(
          createDetailHeader(item.name, item.zone, [createAssetBadge(item.status, item.statusTone)]),
          createFactGrid([
            { label: "Role", value: item.role },
            { label: "Credential", value: item.credential },
            { label: "Last used", value: item.lastUsed },
          ]),
          createDetailSection("Access note", item.notes),
          actions
        );
        actions.append(toggleButton, auditButton);

        return detail;
      },
    });
  }

  function createNewAssetPage() {
    const wrapper = createElement("section", "asset-form-surface");
    const intro = createElement("div", "asset-form-surface__intro");
    const eyebrow = createElement(
      "p",
      "asset-form-surface__eyebrow",
      state.assets.editingAssetId ? "Editing existing asset" : "Create new registry entry"
    );
    const title = createElement(
      "h3",
      "asset-form-surface__title",
      state.assets.editingAssetId ? "Update asset details" : "Register a new asset"
    );
    const copy = createElement(
      "p",
      "asset-form-surface__copy",
      "Field validation stays inline so the team can fix incomplete records without losing context."
    );
    const tips = createElement("div", "asset-form-surface__tips");
    const form = createElement("form", "asset-form");
    const grid = createElement("div", "asset-form__grid");
    const actions = createElement("div", "asset-form__actions");
    const saveButton = createActionButton(
      state.assets.editingAssetId ? "Update asset" : "Save asset",
      "primary",
      "check"
    );
    const cancelButton = createActionButton("Cancel", "ghost", "close");
    const resetButton = createActionButton("Reset form", "ghost", "reset");

    saveButton.type = "submit";
    [
      "Use a unique asset code so import and export remains stable.",
      "Assigned to can be left blank for pooled inventory.",
      "Long notes are supported and will wrap correctly in the detail panel.",
    ].forEach((tip) => {
      const item = createElement("div", "asset-form-surface__tip");
      item.append(createIcon("sparkle"), createElement("span", "asset-form-surface__tip-copy", tip));
      tips.append(item);
    });

    form.noValidate = true;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveAssetDraft();
      render();
    });

    [
      { label: "Asset code", name: "code", placeholder: "AST-099" },
      { label: "Asset name", name: "name", placeholder: "MacBook Air 13 inch" },
      { label: "Category", name: "category", placeholder: "Laptop" },
      { label: "Department", name: "department", placeholder: "HRGA" },
      { label: "Assigned to", name: "assignedTo", placeholder: "Employee name" },
      { label: "Location", name: "location", placeholder: "Jakarta HQ" },
      {
        label: "Status",
        name: "status",
        type: "select",
        options: ["Available", "In Use", "Stored", "Maintenance", "Reserved"],
      },
      { label: "Due label", name: "dueLabel", placeholder: "21 Apr 2026" },
      { label: "Condition", name: "condition", placeholder: "Ready to deploy" },
      { label: "Serial number", name: "serialNumber", placeholder: "SN-2026-001" },
      { label: "Purchase date", name: "purchaseDate", placeholder: "16 Mar 2026" },
      { label: "Value label", name: "valueLabel", placeholder: "Rp 12.500.000" },
      {
        label: "Notes",
        name: "notes",
        type: "textarea",
        placeholder: "Operational note, context, or ownership detail",
      },
    ].forEach((fieldConfig) => {
      const field = createElement("label", "asset-field");
      const label = createElement("span", "asset-field__label", fieldConfig.label);
      let control;

      if (fieldConfig.type === "select") {
        control = createElement("select", "asset-field__input");
        fieldConfig.options.forEach((optionValue) => {
          const option = document.createElement("option");
          option.value = optionValue;
          option.textContent = optionValue;
          option.selected = state.assets.draft[fieldConfig.name] === optionValue;
          control.append(option);
        });
        control.addEventListener("change", (event) => {
          state.assets.draft[fieldConfig.name] = event.target.value;
          delete state.assets.draftErrors[fieldConfig.name];
        });
      } else if (fieldConfig.type === "textarea") {
        control = createElement("textarea", "asset-field__input asset-field__input--textarea");
        control.rows = 5;
        control.value = state.assets.draft[fieldConfig.name] ?? "";
        control.placeholder = fieldConfig.placeholder ?? "";
        control.addEventListener("input", (event) => {
          state.assets.draft[fieldConfig.name] = event.target.value;
          delete state.assets.draftErrors[fieldConfig.name];
        });
      } else {
        control = createElement("input", "asset-field__input");
        control.type = "text";
        control.value = state.assets.draft[fieldConfig.name] ?? "";
        control.placeholder = fieldConfig.placeholder ?? "";
        control.addEventListener("input", (event) => {
          state.assets.draft[fieldConfig.name] = event.target.value;
          delete state.assets.draftErrors[fieldConfig.name];
        });
      }

      if (state.assets.draftErrors[fieldConfig.name]) {
        control.classList.add("is-invalid");
      }

      field.append(label, control);

      if (state.assets.draftErrors[fieldConfig.name]) {
        field.append(
          createElement("span", "asset-field__error", state.assets.draftErrors[fieldConfig.name])
        );
      }

      grid.append(field);
    });

    cancelButton.addEventListener("click", () => {
      state.activeItem = "Assets";
      state.assets.draftErrors = {};
      render();
    });
    resetButton.addEventListener("click", () => {
      const record = activeApp.records.find((item) => item.id === state.assets.editingAssetId) ?? null;
      resetAssetDraft(record);
      render();
    });

    actions.append(saveButton, cancelButton, resetButton);
    form.append(grid, actions);
    intro.append(eyebrow, title, copy, tips);
    wrapper.append(intro, form);

    return wrapper;
  }

  syncAssetsSelections();

  const wrapper = createElement("section", "asset-hub");
  const notice = createAssetNoticeBanner();
  let pageBody;

  if (state.activeItem === "Dashboard") {
    pageBody = createDashboardPage();
  } else if (state.activeItem === "Assets") {
    pageBody = createInventoryPage();
  } else if (state.activeItem === "Maintenance Asset Request") {
    pageBody = createMaintenancePage();
  } else if (state.activeItem === "Asset Request") {
    pageBody = createAssetRequestPage();
  } else if (state.activeItem === "Asset Check Out") {
    pageBody = createCheckOutPage();
  } else if (state.activeItem === "Asset Check In") {
    pageBody = createCheckInPage();
  } else if (state.activeItem === "Asset Mutation") {
    pageBody = createMutationPage();
  } else if (state.activeItem === "Stock Opname") {
    pageBody = createStockOpnamePage();
  } else if (state.activeItem === "Access Control") {
    pageBody = createAccessControlPage();
  } else {
    pageBody = createNewAssetPage();
  }

  wrapper.append(createAssetHero());

  if (notice) {
    wrapper.append(notice);
  }

  wrapper.append(pageBody);

  return wrapper;
}
