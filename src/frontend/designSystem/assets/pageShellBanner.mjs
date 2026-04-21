function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

export const pageShellBannerCards = [
  {
    id: "info",
    title: "Page guidance",
    body:
      "Use the shell banner zone for short, page-scoped guidance that should sit above the content without collapsing the page header.",
  },
  {
    id: "success",
    tone: "success",
    title: "Success state",
    body:
      "Saved shell preferences. Success messages can clear quickly, but they should always leave enough breathing room above the page content.",
  },
  {
    id: "warning",
    tone: "warning",
    title: "Warning state",
    body:
      "Browser-auth rotation is due soon. Warning banners can stay visible until dismissed, but the shell should still own the same close affordance.",
  },
  {
    id: "danger",
    tone: "danger",
    title: "Error state",
    body:
      "No root-admin destination matched the requested route. Error banners remain dismissible and should not stay welded to the page content underneath.",
  },
];

const pageShellBannerCardIds = pageShellBannerCards.map((card) => card.id);

function buildPageShellBannerCardMarkup(card) {
  const toneAttribute = typeof card.tone === "string" && card.tone.length > 0
    ? ` data-tone="${escapeHtml(card.tone)}"`
    : "";

  return `
    <article class="status-message status-message-dismissible" data-page-shell-banner-card="${escapeHtml(card.id)}"${toneAttribute}>
      <div class="status-message-copy">
        <strong class="status-message-title">${escapeHtml(card.title)}</strong>
        <p class="status-message-body">${escapeHtml(card.body)}</p>
      </div>
      <button
        class="status-message-close"
        type="button"
        data-page-shell-banner-dismiss="${escapeHtml(card.id)}"
        aria-label="Dismiss banner"
      >
        ×
      </button>
    </article>
  `.trim();
}

export function renderPageShellBannerStack(root, { ariaLabel } = {}) {
  if (!(root instanceof HTMLElement)) {
    return null;
  }

  if (typeof ariaLabel === "string" && ariaLabel.length > 0) {
    root.setAttribute("aria-label", ariaLabel);
  }

  root.innerHTML = pageShellBannerCards.map((card) => buildPageShellBannerCardMarkup(card)).join("");
  root.dataset.pageShellBannerMounted = "true";
  return root;
}

export function createPageShellBannerController(
  root,
  {
    visible = false,
    visibleIds = pageShellBannerCardIds,
    ariaLabel,
    onVisibilityChange,
  } = {},
) {
  if (!(root instanceof HTMLElement)) {
    return null;
  }

  renderPageShellBannerStack(root, { ariaLabel });

  const cardNodes = new Map(
    Array.from(root.querySelectorAll("[data-page-shell-banner-card]")).map((cardNode) => [
      cardNode.getAttribute("data-page-shell-banner-card") ?? "",
      cardNode,
    ]),
  );
  let activeIds = new Set(pageShellBannerCardIds.filter((id) => visibleIds.includes(id)));
  let dismissedIds = new Set();
  let isVisible = Boolean(visible) && activeIds.size > 0;
  let lastReportedVisibility = isVisible;

  function reportVisibility() {
    if (typeof onVisibilityChange === "function" && lastReportedVisibility !== isVisible) {
      lastReportedVisibility = isVisible;
      onVisibilityChange(isVisible);
    }
  }

  function sync() {
    root.classList.toggle("hidden", !isVisible || activeIds.size === 0);

    for (const [cardId, cardNode] of cardNodes.entries()) {
      cardNode.classList.toggle("hidden", !isVisible || !activeIds.has(cardId) || dismissedIds.has(cardId));
    }

    root.dataset.renderStatus = "ready";
    reportVisibility();
  }

  function showAll() {
    activeIds = new Set(pageShellBannerCardIds);
    dismissedIds.clear();
    isVisible = true;
    sync();
  }

  function hide() {
    dismissedIds.clear();
    isVisible = false;
    sync();
  }

  function setVisibleIds(nextVisibleIds) {
    activeIds = new Set(pageShellBannerCardIds.filter((id) => nextVisibleIds.includes(id)));
    dismissedIds.clear();
    isVisible = activeIds.size > 0;
    sync();
  }

  function dismiss(cardId) {
    if (!activeIds.has(cardId)) {
      return;
    }

    dismissedIds.add(cardId);
    const remainingVisibleIds = Array.from(activeIds).filter((id) => !dismissedIds.has(id));
    if (remainingVisibleIds.length === 0) {
      dismissedIds.clear();
      isVisible = false;
    }
    sync();
  }

  root.addEventListener("click", (event) => {
    const button = event.target instanceof Element
      ? event.target.closest("[data-page-shell-banner-dismiss]")
      : null;

    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    dismiss(button.dataset.pageShellBannerDismiss ?? "");
  });

  sync();

  return {
    dismiss,
    hide,
    setVisibleIds,
    showAll,
    getCardIds() {
      return [...pageShellBannerCardIds];
    },
    isVisible() {
      return isVisible;
    },
  };
}

function buildRuntimeBannerMarkup({
  title = "",
  message = "",
  tone = "info",
  dismissLabel = "Dismiss banner",
  liveRole = "status",
  liveMode = "polite",
} = {}) {
  const safeTitle = typeof title === "string" ? title.trim() : "";
  const safeMessage = typeof message === "string" ? message.trim() : "";

  return `
    <article
      class="status-message status-message-dismissible"
      data-page-shell-banner-runtime
      data-tone="${escapeHtml(tone)}"
      role="${escapeHtml(liveRole)}"
      aria-live="${escapeHtml(liveMode)}"
      aria-atomic="true"
    >
      <div class="status-message-copy">
        ${safeTitle ? `<strong class="status-message-title">${escapeHtml(safeTitle)}</strong>` : ""}
        <p class="status-message-body">${escapeHtml(safeMessage)}</p>
      </div>
      <button
        class="status-message-close"
        type="button"
        data-page-shell-banner-runtime-dismiss
        aria-label="${escapeHtml(dismissLabel)}"
      >
        ×
      </button>
    </article>
  `.trim();
}

export const pageShellBannerRuntimePolicyMatrix = Object.freeze({
  informational: Object.freeze({
    tone: "info",
    autoDismissMs: 6000,
    liveRole: "status",
    liveMode: "polite",
  }),
  "mutation-success": Object.freeze({
    tone: "success",
    autoDismissMs: 6000,
    liveRole: "status",
    liveMode: "polite",
  }),
  "blocked-action": Object.freeze({
    tone: "warning",
    autoDismissMs: null,
    liveRole: "status",
    liveMode: "polite",
  }),
  error: Object.freeze({
    tone: "danger",
    autoDismissMs: null,
    liveRole: "alert",
    liveMode: "assertive",
  }),
});

export function resolvePageShellBannerRuntimePolicy(policyName) {
  if (typeof policyName !== "string") {
    return pageShellBannerRuntimePolicyMatrix.informational;
  }

  return pageShellBannerRuntimePolicyMatrix[policyName] ?? pageShellBannerRuntimePolicyMatrix.informational;
}

export function createPageShellBannerRuntimeController(
  root,
  {
    ariaLabel,
    autoDismissMsByTone = {
      info: 6000,
      success: 6000,
      warning: null,
      danger: null,
    },
  } = {},
) {
  if (!(root instanceof HTMLElement)) {
    return null;
  }

  if (typeof ariaLabel === "string" && ariaLabel.length > 0) {
    root.setAttribute("aria-label", ariaLabel);
  }

  let activeBanner = null;
  let clearTimer = 0;

  function cancelClearTimer() {
    if (clearTimer) {
      window.clearTimeout(clearTimer);
      clearTimer = 0;
    }
  }

  function clear() {
    cancelClearTimer();
    activeBanner = null;
    root.innerHTML = "";
    root.classList.add("hidden");
    root.dataset.renderStatus = "ready";
    delete root.dataset.bannerTone;
  }

  function show({
    title = "",
    message = "",
    tone = "info",
    dismissLabel = "Dismiss banner",
    autoDismissMs,
    liveRole,
    liveMode,
  } = {}) {
    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    if (!trimmedMessage) {
      clear();
      return;
    }

    cancelClearTimer();

    const resolvedLiveRole = typeof liveRole === "string" && liveRole.length > 0
      ? liveRole
      : tone === "danger" ? "alert" : "status";
    const resolvedLiveMode = typeof liveMode === "string" && liveMode.length > 0
      ? liveMode
      : tone === "danger" ? "assertive" : "polite";
    root.innerHTML = buildRuntimeBannerMarkup({
      title,
      message: trimmedMessage,
      tone,
      dismissLabel,
      liveRole: resolvedLiveRole,
      liveMode: resolvedLiveMode,
    });
    root.classList.remove("hidden");
    root.dataset.renderStatus = "ready";
    root.dataset.bannerTone = tone;
    activeBanner = {
      title,
      message: trimmedMessage,
      tone,
    };

    const resolvedAutoDismissMs = Number.isFinite(autoDismissMs)
      ? autoDismissMs
      : autoDismissMsByTone[tone];

    if (Number.isFinite(resolvedAutoDismissMs) && resolvedAutoDismissMs > 0) {
      clearTimer = window.setTimeout(() => {
        clear();
      }, resolvedAutoDismissMs);
    }
  }

  function showForPolicy(
    policyName,
    {
      title = "",
      message = "",
      dismissLabel = "Dismiss banner",
      autoDismissMs,
    } = {},
  ) {
    const policy = resolvePageShellBannerRuntimePolicy(policyName);
    show({
      title,
      message,
      tone: policy.tone,
      dismissLabel,
      autoDismissMs: Number.isFinite(autoDismissMs) ? autoDismissMs : policy.autoDismissMs,
      liveRole: policy.liveRole,
      liveMode: policy.liveMode,
    });
  }

  root.addEventListener("click", (event) => {
    const dismissButton = event.target instanceof Element
      ? event.target.closest("[data-page-shell-banner-runtime-dismiss]")
      : null;

    if (dismissButton instanceof HTMLButtonElement) {
      clear();
    }
  });

  clear();

  return {
    clear,
    getActiveBanner() {
      return activeBanner;
    },
    show,
    showForPolicy,
  };
}
