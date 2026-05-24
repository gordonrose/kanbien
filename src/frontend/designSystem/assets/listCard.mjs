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

export function renderListCard({
  title = "",
  subtitle = "",
  status = "",
  state = "",
  ariaLabel = "",
  titleTooltip = "",
  subtitleTooltip = "",
  statusTooltip = "",
  className = "",
  rtl = false,
  mobile = false,
} = {}) {
  const normalizedState = supportedStates.has(String(state ?? "").trim())
    ? String(state).trim()
    : "";
  const disabled = normalizedState === "disabled";
  const selected = normalizedState === "selected";
  const classes = [
    "token-container-sample",
    "token-list-card-control",
    "token-paragraph-layout",
    "token-header-layout",
    normalizedState ? `token-list-card-control-${normalizedState}` : "",
    className,
  ].filter(Boolean).join(" ");
  const safeTitle = String(title ?? "").trim();
  const safeSubtitle = String(subtitle ?? "").trim();
  const safeStatus = String(status ?? "").trim();
  const accessibleName = ariaLabel || [safeTitle, safeSubtitle, safeStatus, normalizedState].filter(Boolean).join(", ");

  return `
    <button
      class="${escapeHtml(classes)}"
      type="button"
      aria-label="${escapeHtml(accessibleName)}"
      data-token-list-card
      ${buildAttribute("data-token-list-card-state", normalizedState)}
      ${selected ? "aria-pressed=\"true\"" : ""}
      ${disabled ? "disabled aria-disabled=\"true\"" : ""}
      ${rtl ? "data-token-list-card-rtl" : ""}
      ${mobile ? "data-token-list-card-mobile" : ""}
    >
      <span class="token-list-card-copy">
        <strong class="token-header-preview token-header-six"${buildAttribute("data-tooltip", titleTooltip)}>${escapeHtml(safeTitle)}</strong>
        <span class="token-paragraph-preview token-paragraph-main-minor"${buildAttribute("data-tooltip", subtitleTooltip)}>${escapeHtml(safeSubtitle)}</span>
      </span>
      <span class="token-list-card-status token-paragraph-preview token-paragraph-main-minor"${buildAttribute("data-tooltip", statusTooltip)}>${escapeHtml(safeStatus)}</span>
    </button>
  `.trim();
}

export function hydrateListCards(root = document) {
  for (const mount of root.querySelectorAll("[data-token-list-card-mount]")) {
    if (!(mount instanceof HTMLElement)) {
      continue;
    }

    mount.outerHTML = renderListCard({
      title: mount.dataset.tokenListCardTitle,
      subtitle: mount.dataset.tokenListCardSubtitle,
      status: mount.dataset.tokenListCardStatus,
      state: mount.dataset.tokenListCardState,
      ariaLabel: mount.dataset.tokenListCardAriaLabel,
      titleTooltip: mount.dataset.tokenListCardTitleTooltip,
      subtitleTooltip: mount.dataset.tokenListCardSubtitleTooltip,
      statusTooltip: mount.dataset.tokenListCardStatusTooltip,
      className: mount.dataset.tokenListCardClass,
      rtl: mount.dataset.tokenListCardRtl === "true",
      mobile: mount.dataset.tokenListCardMobile === "true",
    });
  }
}
