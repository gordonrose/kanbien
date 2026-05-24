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

const supportedStates = new Set(["hover", "active", "selected", "disabled", "warning", "error"]);

export function renderIndexCard({
  label = "",
  count = "0 items",
  state = "",
  ariaLabel = "",
  tooltip = "",
  labelTooltip = "",
  countTooltip = "",
  className = "",
  rtl = false,
  mobile = false,
} = {}) {
  const normalizedState = supportedStates.has(String(state ?? "").trim())
    ? String(state).trim()
    : "";
  const disabled = normalizedState === "disabled";
  const selected = normalizedState === "selected";
  const containerVariant = normalizedState === "warning" || normalizedState === "error"
    ? normalizedState
    : "";
  const classes = [
    "token-container-sample",
    "token-container-section-sample",
    "token-index-card-control",
    "token-paragraph-layout",
    "token-header-layout",
    normalizedState ? `token-index-card-control-${normalizedState}` : "",
    className,
  ].filter(Boolean).join(" ");
  const safeLabel = String(label ?? "").trim();
  const safeCount = String(count ?? "").trim() || "0 items";
  const accessibleName = ariaLabel || `${safeLabel} index card, ${safeCount}${normalizedState ? `, ${normalizedState}` : ""}`;

  return `
    <button
      class="${escapeHtml(classes)}"
      type="button"
      aria-label="${escapeHtml(accessibleName)}"
      data-token-index-card
      ${buildAttribute("data-token-index-card-state", normalizedState)}
      ${buildAttribute("data-container-variant", containerVariant)}
      ${normalizedState === "active" ? "data-token-index-card-active=\"true\"" : ""}
      ${selected ? "aria-pressed=\"true\"" : ""}
      ${disabled ? "disabled aria-disabled=\"true\"" : ""}
      ${rtl ? "data-token-index-card-rtl" : ""}
      ${mobile ? "data-token-index-card-mobile" : ""}
      ${buildAttribute("data-tooltip", tooltip)}
    >
      <span class="token-index-card-copy">
        <strong class="token-header-preview token-header-six"${buildAttribute("data-tooltip", labelTooltip)}>${escapeHtml(safeLabel)}</strong>
        <span class="token-paragraph-preview token-paragraph-main-minor"${buildAttribute("data-tooltip", countTooltip)}>${escapeHtml(safeCount)}</span>
      </span>
    </button>
  `.trim();
}

export function hydrateIndexCards(root = document) {
  for (const mount of root.querySelectorAll("[data-token-index-card-mount], [data-token-secondary-list-card-mount]")) {
    if (!(mount instanceof HTMLElement)) {
      continue;
    }

    mount.outerHTML = renderIndexCard({
      label: mount.dataset.tokenIndexCardLabel ?? mount.dataset.tokenSecondaryListCardLabel,
      count: mount.dataset.tokenIndexCardCount ?? mount.dataset.tokenSecondaryListCardCount,
      state: mount.dataset.tokenIndexCardState ?? mount.dataset.tokenSecondaryListCardState,
      ariaLabel: mount.dataset.tokenIndexCardAriaLabel ?? mount.dataset.tokenSecondaryListCardAriaLabel,
      tooltip: mount.dataset.tooltip,
      labelTooltip: mount.dataset.tokenIndexCardLabelTooltip ?? mount.dataset.tokenSecondaryListCardLabelTooltip,
      countTooltip: mount.dataset.tokenIndexCardCountTooltip ?? mount.dataset.tokenSecondaryListCardCountTooltip,
      className: mount.dataset.tokenIndexCardClass ?? mount.dataset.tokenSecondaryListCardClass,
      rtl: mount.dataset.tokenIndexCardRtl === "true" || mount.dataset.tokenSecondaryListCardRtl === "true",
      mobile: mount.dataset.tokenIndexCardMobile === "true" || mount.dataset.tokenSecondaryListCardMobile === "true",
    });
  }
}

export const renderSecondaryListCard = renderIndexCard;
export const hydrateSecondaryListCards = hydrateIndexCards;
