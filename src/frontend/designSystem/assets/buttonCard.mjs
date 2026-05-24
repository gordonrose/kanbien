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

const iconPaths = new Map([
  ["details", "M5 6h14v12H5zm4 4h6M9 13h4"],
  ["files", "M6 4h7l5 5v11H6zm7 0v5h5M9 13h6M9 16h6"],
  ["notes", "M6 5h12v14H6zm3 4h6M9 12h6M9 15h4"],
  ["add", "M12 5v14M5 12h14"],
  ["missing", "M12 5v8M12 17h.01"],
  ["failed", "m7 7 10 10M17 7 7 17"],
]);

function renderIcon(icon) {
  const normalizedIcon = String(icon ?? "").trim().toLowerCase();
  const path = iconPaths.get(normalizedIcon) ?? iconPaths.get("details");

  return `
    <span class="token-button-card-icon-circle" aria-hidden="true">
      <svg class="token-button-card-icon" viewBox="0 0 24 24" focusable="false">
        <path d="${escapeHtml(path)}" />
      </svg>
    </span>
  `.trim();
}

export function renderButtonCard({
  label = "",
  icon = "details",
  state = "",
  ariaLabel = "",
  tooltip = "",
  labelTooltip = "",
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
    "token-button-card-control",
    "token-paragraph-layout",
    "token-header-layout",
    normalizedState ? `token-button-card-control-${normalizedState}` : "",
    className,
  ].filter(Boolean).join(" ");
  const safeLabel = String(label ?? "").trim();
  const accessibleName = ariaLabel || `${safeLabel} button card${normalizedState ? `, ${normalizedState}` : ""}`;

  return `
    <button
      class="${escapeHtml(classes)}"
      type="button"
      aria-label="${escapeHtml(accessibleName)}"
      data-token-button-card
      ${buildAttribute("data-token-button-card-state", normalizedState)}
      ${buildAttribute("data-container-variant", containerVariant)}
      ${normalizedState === "active" ? "data-token-button-card-active=\"true\"" : ""}
      ${selected ? "aria-pressed=\"true\"" : ""}
      ${disabled ? "disabled aria-disabled=\"true\"" : ""}
      ${rtl ? "data-token-button-card-rtl" : ""}
      ${mobile ? "data-token-button-card-mobile" : ""}
      ${buildAttribute("data-token-button-card-icon", icon)}
      ${buildAttribute("data-tooltip", tooltip)}
    >
      <span class="token-button-card-copy">
        ${renderIcon(icon)}
        <span class="token-paragraph-preview token-paragraph-label"${buildAttribute("data-tooltip", labelTooltip)}>${escapeHtml(safeLabel)}</span>
      </span>
    </button>
  `.trim();
}

export function hydrateButtonCards(root = document) {
  for (const mount of root.querySelectorAll("[data-token-button-card-mount]")) {
    if (!(mount instanceof HTMLElement)) {
      continue;
    }

    mount.outerHTML = renderButtonCard({
      label: mount.dataset.tokenButtonCardLabel,
      icon: mount.dataset.tokenButtonCardIcon,
      state: mount.dataset.tokenButtonCardState,
      ariaLabel: mount.dataset.tokenButtonCardAriaLabel,
      tooltip: mount.dataset.tooltip,
      labelTooltip: mount.dataset.tokenButtonCardLabelTooltip,
      className: mount.dataset.tokenButtonCardClass,
      rtl: mount.dataset.tokenButtonCardRtl === "true",
      mobile: mount.dataset.tokenButtonCardMobile === "true",
    });
  }
}
