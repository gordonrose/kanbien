function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function buildAttribute(name, value) {
  const normalized = String(value ?? "").trim();
  return normalized ? ` ${name}="${escapeHtml(normalized)}"` : "";
}

const supportedStates = new Set(["hover", "selected", "disabled", "warning", "error"]);

export function renderCountCard({
  label = "",
  helper = "",
  count = "0",
  state = "",
  ariaLabel = "",
  tooltip = "",
  labelTooltip = "",
  helperTooltip = "",
  className = "",
  rtl = false,
  mobile = false,
} = {}) {
  const normalizedState = supportedStates.has(String(state ?? "").trim())
    ? String(state).trim()
    : "";
  const selected = normalizedState === "selected";
  const disabled = normalizedState === "disabled";
  const classes = [
    "token-filter-card-control",
    "token-paragraph-layout",
    "token-header-layout",
    normalizedState ? `token-filter-card-control-${normalizedState}` : "",
    className,
  ].filter(Boolean).join(" ");
  const safeCount = String(count ?? "0").trim() || "0";
  const safeLabel = String(label ?? "").trim();
  const safeHelper = String(helper ?? "").trim();
  const accessibleName = ariaLabel || `${safeLabel} count card with count ${safeCount}`;

  return `
    <button
      class="${escapeHtml(classes)}"
      type="button"
      aria-label="${escapeHtml(accessibleName)}"
      data-token-filter-card
      ${buildAttribute("data-token-filter-card-state", normalizedState)}
      ${normalizedState === "hover" ? "data-token-filter-card-hover=\"true\"" : ""}
      ${selected ? "aria-pressed=\"true\"" : ""}
      ${disabled ? "disabled aria-disabled=\"true\"" : ""}
      ${rtl ? "data-token-filter-card-rtl" : ""}
      ${mobile ? "data-token-filter-card-mobile" : ""}
      ${buildAttribute("data-tooltip", tooltip)}
    >
      <span class="token-filter-card-copy">
        <strong class="token-header-preview token-header-six"${buildAttribute("data-tooltip", labelTooltip)}>${escapeHtml(safeLabel)}</strong>
        <span class="token-paragraph-preview token-paragraph-main-minor"${buildAttribute("data-tooltip", helperTooltip)}>${escapeHtml(safeHelper)}</span>
      </span>
      <span class="token-filter-card-count token-paragraph-preview token-paragraph-main" aria-label="${escapeHtml(safeCount)} selected">${escapeHtml(safeCount)}</span>
    </button>
  `.trim();
}

export const renderFilterCard = renderCountCard;

export function hydrateCountCards(root = document) {
  for (const mount of root.querySelectorAll("[data-token-filter-card-mount]")) {
    if (!(mount instanceof HTMLElement)) {
      continue;
    }

    mount.outerHTML = renderCountCard({
      label: mount.dataset.tokenFilterCardLabel,
      helper: mount.dataset.tokenFilterCardHelper,
      count: mount.dataset.tokenFilterCardCount,
      state: mount.dataset.tokenFilterCardState,
      ariaLabel: mount.dataset.tokenFilterCardAriaLabel,
      tooltip: mount.dataset.tooltip,
      labelTooltip: mount.dataset.tokenFilterCardLabelTooltip,
      helperTooltip: mount.dataset.tokenFilterCardHelperTooltip,
      className: mount.dataset.tokenFilterCardClass,
      rtl: mount.dataset.tokenFilterCardRtl === "true",
      mobile: mount.dataset.tokenFilterCardMobile === "true",
    });
  }
}

export const hydrateFilterCards = hydrateCountCards;
