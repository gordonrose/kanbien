import { displayNameForRootUser } from "./state.mjs";

class RootUsersSearchValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "RootUsersSearchValidationError";
  }
}

const pageSize = 25;
const untitledRecordFallback = "Root User";
const mobileDetailBreakpoint = "(max-width: 62rem)";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatTimestamp(value) {
  if (!value) {
    return "Not recorded";
  }

  return new Date(value).toLocaleString();
}

function statusLabelForUser(rootUser) {
  if (rootUser.deletedAt) {
    return "Deleted";
  }

  return rootUser.status === "inactive" ? "Inactive" : "Active";
}

function detailBodyForUser(rootUser) {
  const parts = [
    `Root user ID: ${rootUser.rootUserId}.`,
    `Created: ${formatTimestamp(rootUser.createdAt)}.`,
    `Updated: ${formatTimestamp(rootUser.updatedAt)}.`,
  ];

  if (rootUser.deletedAt) {
    parts.push(`Deleted: ${formatTimestamp(rootUser.deletedAt)}.`);
  } else {
    parts.push("This record remains visible in the root-admin directory.");
  }

  if (rootUser.anonymized) {
    parts.push("This root-user record has been anonymized.");
  }

  return parts.join(" ");
}

function summaryCopyForUser(rootUser) {
  return `${statusLabelForUser(rootUser)} root user. Updated ${formatTimestamp(rootUser.updatedAt)}.`;
}

function tagsForUser(rootUser) {
  const tags = [statusLabelForUser(rootUser)];

  if (rootUser.anonymized) {
    tags.push("Anonymized");
  }

  if (rootUser.firstName || rootUser.lastName) {
    tags.push("Named");
  } else {
    tags.push("Email-only");
  }

  return tags;
}

function searchModelForQuery(query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return { kind: "none", value: "" };
  }

  if (normalizedQuery.includes("@") && !normalizedQuery.includes(" ")) {
    return { kind: "exact-email", value: normalizedQuery.toLowerCase() };
  }

  if (normalizedQuery.length < 3) {
    throw new RootUsersSearchValidationError(
      "Search root users by exact email or by an email prefix with at least 3 characters.",
    );
  }

  return { kind: "email-prefix", value: normalizedQuery.toLowerCase() };
}

function setStateVisibility(element, visible) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.classList.toggle("hidden", !visible);
  element.setAttribute("aria-hidden", String(!visible));
}

function setOptionalText(element, value) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const hasValue = Boolean(value);
  element.textContent = hasValue ? value : "";
  if (hasValue) {
    element.dataset.fullValue = value;
  } else {
    delete element.dataset.fullValue;
    delete element.dataset.tooltip;
  }
  element.classList.toggle("hidden", !hasValue);
  element.setAttribute("aria-hidden", String(!hasValue));
}

function setOptionalTags(container, tags) {
  if (!(container instanceof HTMLElement)) {
    return;
  }

  const hasTags = tags.length > 0;
  container.classList.toggle("hidden", !hasTags);
  container.setAttribute("aria-hidden", String(!hasTags));
  container.replaceChildren();

  if (!hasTags) {
    return;
  }

  for (const tag of tags) {
    const chip = document.createElement("span");
    chip.className = "list-page-tag tooltip-anchor";
    chip.dataset.overflowTooltipSource = "";
    chip.dataset.fullValue = tag;
    chip.textContent = tag;
    container.append(chip);
  }
}

function getFocusableElements(container) {
  if (!(container instanceof HTMLElement)) {
    return [];
  }

  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];

  return Array.from(container.querySelectorAll(selectors.join(","))).filter((element) =>
    element instanceof HTMLElement
    && !element.hasAttribute("hidden")
    && !element.classList.contains("hidden")
    && element.offsetParent !== null,
  );
}

function isDesktopSplitOpen(splitLayout) {
  return splitLayout instanceof HTMLElement
    && splitLayout.classList.contains("detail-open")
    && !isMobileDetailMode();
}

export function createRootUsersListController({
  root,
  searchInput,
  fetchJson,
  setShellMessage,
  getCurrentPage,
}) {
  if (!(root instanceof HTMLElement) || !(searchInput instanceof HTMLInputElement)) {
    return {
      async handleShellSearchSubmit() {
        return false;
      },
      syncPageState() {},
      reset() {},
    };
  }

  const recordCardTemplate = document.getElementById("root-users-record-card-template");
  const splitLayout = root;
  const listColumn = root.querySelector("[data-selectable-list-column]");
  const detailPanel = root.querySelector("[data-selectable-list-detail-panel]");
  const detailTitle = root.querySelector('[data-selectable-list-detail-field="title"]');
  const detailSubtitle = root.querySelector('[data-selectable-list-detail-field="subtitle"]');
  const detailDescription = root.querySelector('[data-selectable-list-detail-field="description"]');
  const detailMeta = root.querySelector('[data-selectable-list-detail-field="meta"]');
  const detailTags = root.querySelector('[data-selectable-list-detail-field="tags"]');
  const detailClose = root.querySelector("#root-users-detail-close");
  const detailPrev = root.querySelector("#root-users-detail-prev");
  const detailNext = root.querySelector("#root-users-detail-next");
  const detailNextAnchor = root.querySelector("#root-users-detail-next-anchor");
  const loadingGroup = root.querySelector("[data-selectable-list-loading]");
  const loadingLabel = root.querySelector("[data-selectable-list-loading-label]");
  const emptyState = root.querySelector("[data-selectable-list-empty-state]");
  const noResultsState = root.querySelector("[data-selectable-list-no-results-state]");
  const initialErrorState = root.querySelector("[data-selectable-list-initial-error-state]");
  const queryCopy = root.querySelector("[data-selectable-list-query-copy]");
  const emptyReset = root.querySelector("[data-selectable-list-empty-reset]");
  const clearSearch = root.querySelector("[data-selectable-list-clear-search]");
  const initialRetry = root.querySelector("[data-selectable-list-initial-retry]");
  const appendError = root.querySelector("[data-selectable-list-append-error]");
  const appendRetry = root.querySelector("[data-selectable-list-append-retry]");
  const itemsContainer = root.querySelector("[data-selectable-list-items]");
  const announcementRegion = root.querySelector("[data-selectable-list-announcement]");
  const detailError = root.querySelector("[data-selectable-list-detail-error]");
  const detailRetry = root.querySelector("[data-selectable-list-detail-retry]");
  const lazyLoadStatusAction = root.querySelector("[data-selectable-list-status-action]");

  const initialSearchParams = new URLSearchParams(window.location.search);
  let currentQuery = initialSearchParams.get("rootUsersQ")?.trim() ?? "";
  let items = [];
  let currentPage = 0;
  let totalPages = 1;
  let totalMatchingRecords = 0;
  let totalSearchableRecords = 0;
  let selectedRootUserId = null;
  let lastDetailTrigger = null;
  let loadedOnce = false;
  let isLoading = false;
  let currentListState = "items";
  let announcementResetTimer = 0;

  function updateUrlSearchParam(value) {
    const nextUrl = new URL(window.location.href);
    if (value) {
      nextUrl.searchParams.set("rootUsersQ", value);
    } else {
      nextUrl.searchParams.delete("rootUsersQ");
    }
    window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
  }

  function announce(message) {
    if (!(announcementRegion instanceof HTMLElement)) {
      return;
    }

    if (announcementResetTimer) {
      window.clearTimeout(announcementResetTimer);
    }

    announcementRegion.textContent = "";
    window.requestAnimationFrame(() => {
      announcementRegion.textContent = message;
      announcementResetTimer = window.setTimeout(() => {
        announcementRegion.textContent = "";
        announcementResetTimer = 0;
      }, 900);
    });
  }

  function isActivePage() {
    return getCurrentPage() === "users";
  }

  function isMobileDetailMode() {
    return window.matchMedia(mobileDetailBreakpoint).matches;
  }

  function getSelectedUser() {
    return items.find((item) => item.rootUserId === selectedRootUserId) ?? null;
  }

  function getVisibleItemButtons() {
    return Array.from(root.querySelectorAll("[data-selectable-list-card]"));
  }

  function getActiveItemIndex() {
    return items.findIndex((item) => item.rootUserId === selectedRootUserId);
  }

  function syncDetailPanelAccessibility() {
    if (!(detailPanel instanceof HTMLElement)) {
      return;
    }

    const isOpen = !detailPanel.classList.contains("hidden");
    const useModalSemantics = isOpen && isMobileDetailMode();
    detailPanel.setAttribute("role", useModalSemantics ? "dialog" : "region");
    detailPanel.setAttribute("aria-modal", String(useModalSemantics));
  }

  function setLoadingState(visible, mode = "append") {
    setStateVisibility(loadingGroup, visible);
    if (loadingLabel instanceof HTMLElement) {
      loadingLabel.textContent = mode === "initial" ? "Loading root users..." : "Loading more root users...";
    }
    if (listColumn instanceof HTMLElement) {
      listColumn.setAttribute("aria-busy", String(visible));
    }
    syncLazyLoadStatusAction();
  }

  function setAppendErrorVisible(visible) {
    setStateVisibility(appendError, visible);
    syncLazyLoadStatusAction();
  }

  function setDetailErrorVisible(visible) {
    setStateVisibility(detailError, visible);
  }

  function setNoResultsQueryCopy(query) {
    if (queryCopy instanceof HTMLElement) {
      queryCopy.textContent = `"${query}"`;
    }
  }

  function setItemsVisibility(visible) {
    if (itemsContainer instanceof HTMLElement) {
      itemsContainer.classList.toggle("hidden", !visible);
    }
    syncLazyLoadStatusAction();
  }

  function setListState(nextState) {
    currentListState = nextState;

    setItemsVisibility(nextState === "items");
    setStateVisibility(emptyState, nextState === "empty");
    setStateVisibility(noResultsState, nextState === "no-results");
    setStateVisibility(initialErrorState, nextState === "initial-error");

    if (nextState !== "items") {
      setLoadingState(false, "append");
      setAppendErrorVisible(false);
      closeDetailPanel({ restoreFocus: false });
    }

    if (nextState === "no-results") {
      setNoResultsQueryCopy(currentQuery);
      announce(
        currentQuery
          ? `No visible root users matched ${currentQuery}.`
          : "No visible root users matched the current search.",
      );
    }

    if (nextState === "initial-error") {
      announce("Visible root users could not load.");
    }

  }

  function setOverflowTooltip(element, value) {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    const fullValue = normalizeText(value);
    if (!fullValue) {
      delete element.dataset.tooltip;
      return;
    }

    const isTruncated = element.scrollWidth > element.clientWidth + 1;
    if (isTruncated) {
      element.dataset.tooltip = fullValue;
    } else {
      delete element.dataset.tooltip;
    }
  }

  function updateOverflowTooltips() {
    const candidates = Array.from(root.querySelectorAll("[data-overflow-tooltip-source]"));
    for (const candidate of candidates) {
      if (!(candidate instanceof HTMLElement)) {
        continue;
      }

      setOverflowTooltip(candidate, candidate.dataset.fullValue ?? candidate.textContent ?? "");
    }
  }

  function scheduleOverflowTooltipUpdate() {
    window.requestAnimationFrame(updateOverflowTooltips);
  }

  function syncLazyLoadStatusAction() {
    if (!(lazyLoadStatusAction instanceof HTMLButtonElement)) {
      return;
    }

    if (currentListState !== "items") {
      lazyLoadStatusAction.disabled = true;
      lazyLoadStatusAction.textContent = "Load more visible root users";
      return;
    }

    const appendErrorHidden = !(appendError instanceof HTMLElement) || appendError.classList.contains("hidden");
    const canLoadMore = totalPages > currentPage && !isLoading && appendErrorHidden;

    lazyLoadStatusAction.disabled = !canLoadMore;
    if (canLoadMore) {
      lazyLoadStatusAction.textContent = currentPage === 0
        ? "Load visible root users"
        : "Load more visible root users";
      return;
    }

    lazyLoadStatusAction.textContent = totalPages > 0 && currentPage >= totalPages
      ? "All visible root users loaded."
      : "Load more visible root users";
  }

  function closeDetailPanel({ restoreFocus = false, focusTarget = null } = {}) {
    if (!(detailPanel instanceof HTMLElement)) {
      return;
    }

    selectedRootUserId = null;
    splitLayout.classList.remove("detail-open");
    detailPanel.classList.add("hidden");
    detailPanel.setAttribute("aria-hidden", "true");
    setDetailErrorVisible(false);
    syncDetailPanelAccessibility();

    for (const button of getVisibleItemButtons()) {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    }

    updateDetailNavigation();

    const resolvedFocusTarget = focusTarget instanceof HTMLElement
      ? focusTarget
      : lastDetailTrigger instanceof HTMLElement && document.contains(lastDetailTrigger)
        ? lastDetailTrigger
        : null;

    if (restoreFocus && resolvedFocusTarget instanceof HTMLElement) {
      resolvedFocusTarget.focus({ preventScroll: true });
    }
  }

  function focusDetailEntryPoint() {
    if (detailTitle instanceof HTMLElement) {
      detailTitle.focus({ preventScroll: true });
      return;
    }

    if (detailClose instanceof HTMLElement) {
      detailClose.focus({ preventScroll: true });
    }
  }

  function updateDetailNavigation() {
    const activeIndex = getActiveItemIndex();
    const isAtLastVisibleItem = activeIndex >= 0 && activeIndex >= items.length - 1;
    const isAtTrueLastItem = isAtLastVisibleItem && currentPage >= totalPages;

    if (detailPrev instanceof HTMLButtonElement) {
      detailPrev.disabled = activeIndex <= 0;
    }

    if (detailNext instanceof HTMLButtonElement) {
      detailNext.disabled = activeIndex === -1 || isAtTrueLastItem;
    }

    if (detailNextAnchor instanceof HTMLElement) {
      if (isAtTrueLastItem) {
        detailNextAnchor.dataset.tooltip = "Last item";
      } else {
        delete detailNextAnchor.dataset.tooltip;
      }
    }
  }

  function renderCardButton(rootUser) {
    const button = document.createElement("button");
    const title = displayNameForRootUser(rootUser) || untitledRecordFallback;
    const subtitle = normalizeText(rootUser.email);
    const description = summaryCopyForUser(rootUser);
    const tags = tagsForUser(rootUser);

    button.className = "list-page-card list-page-card-button";
    button.type = "button";
    button.dataset.selectableListCard = "";
    button.dataset.rootUserId = rootUser.rootUserId;
    button.setAttribute("aria-controls", "root-users-detail-panel");
    button.setAttribute("aria-pressed", String(rootUser.rootUserId === selectedRootUserId));

    if (recordCardTemplate instanceof HTMLTemplateElement) {
      button.replaceChildren(recordCardTemplate.content.cloneNode(true));
    }

    const titleNode = button.querySelector(".list-page-card-title");
    const subtitleNode = button.querySelector(".list-page-card-subtitle");
    const descriptionNode = button.querySelector(".list-page-card-description");
    const tagsNode = button.querySelector(".list-page-card-tags");

    if (titleNode instanceof HTMLElement) {
      titleNode.textContent = title;
      titleNode.dataset.fullValue = title;
    }

    setOptionalText(subtitleNode, subtitle);
    setOptionalText(descriptionNode, description);
    setOptionalTags(tagsNode, tags);

    if (rootUser.rootUserId === selectedRootUserId) {
      button.classList.add("active");
    }

    return button;
  }

  function renderList() {
    if (!(itemsContainer instanceof HTMLElement)) {
      return;
    }

    itemsContainer.replaceChildren();
    for (const item of items) {
      itemsContainer.append(renderCardButton(item));
    }
    scheduleOverflowTooltipUpdate();
  }

  function setDetailContent(rootUser, trigger) {
    if (!(detailPanel instanceof HTMLElement) || !rootUser) {
      return;
    }

    selectedRootUserId = rootUser.rootUserId;
    lastDetailTrigger = trigger ?? null;

    for (const button of getVisibleItemButtons()) {
      const isActive = button.dataset.rootUserId === rootUser.rootUserId;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    }

    setDetailErrorVisible(false);
    setOptionalText(detailMeta, `${statusLabelForUser(rootUser)} root user`);
    if (detailTitle instanceof HTMLElement) {
      detailTitle.textContent = displayNameForRootUser(rootUser) || untitledRecordFallback;
    }
    setOptionalText(detailSubtitle, normalizeText(rootUser.email));
    setOptionalText(detailDescription, detailBodyForUser(rootUser));
    setOptionalTags(detailTags, [
      rootUser.rootUserId,
      `Created ${formatTimestamp(rootUser.createdAt)}`,
      `Updated ${formatTimestamp(rootUser.updatedAt)}`,
      ...(rootUser.deletedAt ? [`Deleted ${formatTimestamp(rootUser.deletedAt)}`] : []),
    ]);

    splitLayout.classList.add("detail-open");
    detailPanel.classList.remove("hidden");
    detailPanel.setAttribute("aria-hidden", "false");
    syncDetailPanelAccessibility();
    updateDetailNavigation();
    scheduleOverflowTooltipUpdate();
    announce(`Opened details for ${displayNameForRootUser(rootUser) || untitledRecordFallback}.`);
    focusDetailEntryPoint();
  }

  async function fetchPage(page, query) {
    const searchModel = searchModelForQuery(query);

    if (searchModel.kind === "exact-email") {
      try {
        const rootUser = await fetchJson(`/v1/root-users?email=${encodeURIComponent(searchModel.value)}`);
        return {
          items: [rootUser],
          page: 1,
          totalPages: 1,
          totalMatchingRecords: 1,
          totalSearchableRecords: 1,
        };
      } catch (error) {
        if (error?.code === "ROOT_USER_NOT_FOUND") {
          return {
            items: [],
            page: 1,
            totalPages: 1,
            totalMatchingRecords: 0,
            totalSearchableRecords: 0,
          };
        }
        throw error;
      }
    }

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      orderBy: "updatedAt",
      orderDirection: "desc",
    });

    if (searchModel.kind === "email-prefix") {
      params.set("emailPrefix", searchModel.value);
    }

    return fetchJson(`/v1/root-users?${params.toString()}`);
  }

  async function loadDirectory({ append = false } = {}) {
    const nextPage = append ? currentPage + 1 : 1;

    isLoading = true;
    setAppendErrorVisible(false);
    setLoadingState(true, append ? "append" : "initial");

    try {
      const response = await fetchPage(nextPage, currentQuery);

      if (append) {
        items = [...items, ...response.items];
      } else {
        items = [...response.items];
      }

      currentPage = response.page;
      totalPages = response.totalPages;
      totalMatchingRecords = response.totalMatchingRecords ?? 0;
      totalSearchableRecords = response.totalSearchableRecords ?? totalMatchingRecords;
      loadedOnce = true;

      renderList();

      if (items.length === 0) {
        setListState(currentQuery ? "no-results" : "empty");
      } else {
        setListState("items");
        if (selectedRootUserId) {
          const stillVisible = getSelectedUser();
          if (!stillVisible) {
            closeDetailPanel({ restoreFocus: true, focusTarget: searchInput });
            announce(
              currentQuery
                ? `Closed details because the active record is not in results for ${currentQuery}.`
                : "Closed details because the active record is not in the current results.",
            );
          } else {
            const selectedButton = itemsContainer?.querySelector(`[data-root-user-id="${selectedRootUserId}"]`);
            setDetailContent(stillVisible, selectedButton);
          }
        }
      }

      if (append && response.items.length > 0) {
        announce(`Loaded ${response.items.length} more root users.`);
      }

      syncLazyLoadStatusAction();
    } catch (error) {
      if (append) {
        setAppendErrorVisible(true);
        announce("Could not load more root users.");
      } else {
        setListState("initial-error");
      }
      throw error;
    } finally {
      isLoading = false;
      setLoadingState(false, append ? "append" : "initial");
      syncLazyLoadStatusAction();
      scheduleOverflowTooltipUpdate();
    }
  }

  async function ensureLoaded() {
    if (loadedOnce || isLoading || !isActivePage()) {
      return;
    }

    try {
      await loadDirectory();
    } catch (_error) {
      setShellMessage("Could not load the root-user directory.", "error");
    }
  }

  async function handleShellSearchSubmit(query) {
    if (!isActivePage()) {
      return false;
    }

    const normalizedQuery = normalizeText(query);

    try {
      searchModelForQuery(normalizedQuery);
    } catch (error) {
      if (error instanceof RootUsersSearchValidationError) {
        setShellMessage(error.message, "error");
        return true;
      }
      throw error;
    }

    currentQuery = normalizedQuery;
    updateUrlSearchParam(currentQuery);

    try {
      await loadDirectory();
      if (currentListState === "no-results") {
        setShellMessage(`No visible root users matched "${currentQuery}".`, "error");
      }
    } catch (_error) {
      setShellMessage("Could not update the root-user directory.", "error");
    }

    return true;
  }

  async function loadMore() {
    if (isLoading || currentPage >= totalPages) {
      return;
    }

    try {
      await loadDirectory({ append: true });
    } catch (_error) {
      setShellMessage("Could not load more root users.", "error");
    }
  }

  function distanceFromPageBottom() {
    const sentinel = root.querySelector("[data-selectable-list-sentinel]");
    if (sentinel instanceof HTMLElement) {
      return sentinel.getBoundingClientRect().bottom - window.innerHeight;
    }

    const scrollingElement = document.scrollingElement;
    if (!(scrollingElement instanceof HTMLElement)) {
      return Number.POSITIVE_INFINITY;
    }

    return scrollingElement.scrollHeight - window.innerHeight - window.scrollY;
  }

  function maybeLoadMoreFromScroll() {
    if (!(listColumn instanceof HTMLElement) || isLoading || currentListState !== "items" || currentPage >= totalPages) {
      return;
    }

    const distanceFromBottom = isDesktopSplitOpen(splitLayout)
      ? listColumn.scrollHeight - listColumn.clientHeight - listColumn.scrollTop
      : distanceFromPageBottom();

    if (distanceFromBottom <= 120) {
      void loadMore();
    }
  }

  function syncSearchInputValue() {
    if (!isActivePage()) {
      searchInput.value = "";
      return;
    }

    searchInput.value = currentQuery;
  }

  function syncPageState() {
    syncSearchInputValue();
    syncDetailPanelAccessibility();
    scheduleOverflowTooltipUpdate();

    if (!isActivePage()) {
      return;
    }

    void ensureLoaded();
  }

  function reset() {
    currentQuery = "";
    items = [];
    currentPage = 0;
    totalPages = 1;
    totalMatchingRecords = 0;
    totalSearchableRecords = 0;
    selectedRootUserId = null;
    lastDetailTrigger = null;
    loadedOnce = false;
    isLoading = false;
    currentListState = "items";
    updateUrlSearchParam("");
    setItemsVisibility(false);
    setAppendErrorVisible(false);
    setDetailErrorVisible(false);
    setStateVisibility(emptyState, false);
    setStateVisibility(noResultsState, false);
    setStateVisibility(initialErrorState, false);
    if (itemsContainer instanceof HTMLElement) {
      itemsContainer.replaceChildren();
    }
    closeDetailPanel({ restoreFocus: false });
  }

  listColumn?.addEventListener("click", (event) => {
    const button = event.target instanceof Element
      ? event.target.closest("[data-selectable-list-card]")
      : null;

    if (!(button instanceof HTMLElement)) {
      return;
    }

    const rootUser = items.find((item) => item.rootUserId === button.dataset.rootUserId);
    if (rootUser) {
      setDetailContent(rootUser, button);
    }
  });

  listColumn?.addEventListener("scroll", () => {
    maybeLoadMoreFromScroll();
  });
  window.addEventListener("scroll", () => {
    if (isDesktopSplitOpen(splitLayout)) {
      return;
    }

    maybeLoadMoreFromScroll();
  }, { passive: true });

  lazyLoadStatusAction?.addEventListener("click", () => {
    void loadMore();
  });

  appendRetry?.addEventListener("click", () => {
    void loadMore();
  });

  initialRetry?.addEventListener("click", () => {
    void loadDirectory().catch(() => {
      setShellMessage("Could not load the root-user directory.", "error");
    });
  });

  emptyReset?.addEventListener("click", () => {
    void loadDirectory().catch(() => {
      setShellMessage("Could not refresh the root-user directory.", "error");
    });
  });

  clearSearch?.addEventListener("click", () => {
    currentQuery = "";
    searchInput.value = "";
    updateUrlSearchParam("");
    void loadDirectory().then(() => {
      searchInput.focus();
    }).catch(() => {
      setShellMessage("Could not reset the root-user directory search.", "error");
    });
  });

  detailRetry?.addEventListener("click", () => {
    const selected = getSelectedUser();
    if (!selected) {
      return;
    }
    setDetailContent(selected, lastDetailTrigger);
  });

  detailClose?.addEventListener("click", () => {
    closeDetailPanel({ restoreFocus: true });
  });

  detailPrev?.addEventListener("click", () => {
    const activeIndex = getActiveItemIndex();
    if (activeIndex > 0) {
      const previousUser = items[activeIndex - 1];
      const previousButton = itemsContainer?.querySelector(`[data-root-user-id="${previousUser.rootUserId}"]`);
      setDetailContent(previousUser, previousButton);
    }
  });

  detailNext?.addEventListener("click", async () => {
    const activeIndex = getActiveItemIndex();

    if (activeIndex >= 0 && activeIndex < items.length - 1) {
      const nextUser = items[activeIndex + 1];
      const nextButton = itemsContainer?.querySelector(`[data-root-user-id="${nextUser.rootUserId}"]`);
      setDetailContent(nextUser, nextButton);
      return;
    }

    if (activeIndex >= 0 && activeIndex === items.length - 1 && currentPage < totalPages) {
      const previousCount = items.length;
      await loadMore();
      if (items.length > previousCount) {
        const nextUser = items[activeIndex + 1];
        const nextButton = itemsContainer?.querySelector(`[data-root-user-id="${nextUser.rootUserId}"]`);
        setDetailContent(nextUser, nextButton);
      } else {
        updateDetailNavigation();
      }
    }
  });

  detailPanel?.addEventListener("keydown", (event) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (event.key === "Escape" && !detailPanel.classList.contains("hidden")) {
      event.preventDefault();
      event.stopPropagation();
      closeDetailPanel({ restoreFocus: true });
      return;
    }

    if (event.key !== "Tab" || !isMobileDetailMode() || detailPanel.classList.contains("hidden")) {
      return;
    }

    const focusable = getFocusableElements(detailPanel);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    syncDetailPanelAccessibility();
    scheduleOverflowTooltipUpdate();
    if (!isDesktopSplitOpen(splitLayout)) {
      maybeLoadMoreFromScroll();
    }
  });

  syncLazyLoadStatusAction();
  syncPageState();

  return {
    handleShellSearchSubmit,
    syncPageState,
    reset,
  };
}
