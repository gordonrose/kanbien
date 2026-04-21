import { createPageShellBannerController } from "./pageShellBanner.mjs";

const refs = [
  {
    ref: "PSBR-001",
    title: "Full four-state stack",
    banners: ["info", "success", "warning", "danger"],
    note: "Approved first-pass stack with all four tones visible above the page content.",
  },
  {
    ref: "PSBR-002",
    title: "Success state with dismiss affordance",
    banners: ["success"],
    note: "Confirms positive shell feedback still uses the governed dismiss control and spacing contract.",
  },
  {
    ref: "PSBR-003",
    title: "Warning state with dismiss affordance",
    banners: ["warning"],
    note: "Confirms warning posture remains distinct while keeping the same close grammar.",
  },
  {
    ref: "PSBR-004",
    title: "Danger state with dismiss affordance",
    banners: ["danger"],
    note: "Confirms error posture remains dismissible and visually separated from page content.",
  },
  {
    ref: "PSBR-005",
    title: "Partial stack after dismissing one banner",
    banners: ["info", "success", "danger"],
    note: "Represents the approved remaining stack after dismissing the warning banner.",
  },
];

const refMap = new Map(refs.map((entry) => [entry.ref, entry]));

const params = new URLSearchParams(window.location.search);
const requestedRef = params.get("ref") ?? "PSBR-001";
const theme = params.get("theme") ?? "normal";
const direction = params.get("dir") ?? "ltr";
const zoom = Number.parseInt(params.get("zoom") ?? "0", 10);

const activeRef = refMap.get(requestedRef) ?? refs[0];
const activeIndex = refs.findIndex((entry) => entry.ref === activeRef.ref);

const layout = document.querySelector(".canonical-render-layout");
const previewShell = document.getElementById("page-shell-banner-preview-shell");
const previewSummary = document.getElementById("page-shell-banner-preview-summary");
const previewBannerDemo = document.getElementById("page-shell-banner-demo");
const matchList = document.getElementById("page-shell-banner-canonical-match-list");
const circumstances = document.getElementById("page-shell-banner-canonical-circumstances");
const metaState = document.getElementById("page-shell-banner-meta-state");
const metaViewport = document.getElementById("page-shell-banner-meta-viewport");
const metaNotes = document.getElementById("page-shell-banner-meta-notes");
const current = document.getElementById("page-shell-banner-canonical-current");
const prev = document.getElementById("page-shell-banner-canonical-prev");
const next = document.getElementById("page-shell-banner-canonical-next");
const pageShellBannerController = previewBannerDemo instanceof HTMLElement
  ? createPageShellBannerController(previewBannerDemo, {
    visible: true,
    visibleIds: activeRef.banners,
    ariaLabel: previewBannerDemo.getAttribute("aria-label") ?? "Page-shell banner canonical demo",
  })
  : null;

function routeFor(ref) {
  return `/design-system/components/page-shell-banner?ref=${encodeURIComponent(ref)}&theme=${encodeURIComponent(theme)}&dir=${encodeURIComponent(direction)}&zoom=${encodeURIComponent(String(Number.isFinite(zoom) ? zoom : 0))}`;
}

function normalizeZoom(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(-100, Math.min(100, value));
}

const normalizedZoom = normalizeZoom(zoom);
const scale = 1 + (normalizedZoom / 100) * 0.5;

if (layout instanceof HTMLElement) {
  layout.dataset.themeScope = theme;
}

if (previewShell instanceof HTMLElement) {
  previewShell.setAttribute("dir", direction);
  previewShell.style.setProperty("--ui-scale", String(scale));
  previewShell.dataset.magnification = String(normalizedZoom);
  previewShell.dataset.renderStatus = "ready";
}

if (pageShellBannerController) {
  pageShellBannerController.setVisibleIds(activeRef.banners);
}

if (matchList instanceof HTMLElement) {
  matchList.textContent = activeRef.ref;
}

if (circumstances instanceof HTMLElement) {
  circumstances.textContent = `${theme} theme, ${direction.toUpperCase()} direction, ${normalizedZoom}% magnification.`;
}

if (metaState instanceof HTMLElement) {
  metaState.textContent = activeRef.title;
}

if (metaViewport instanceof HTMLElement) {
  metaViewport.textContent = "Template-hosted shell banner reviewed on a dedicated canonical render surface.";
}

if (metaNotes instanceof HTMLElement) {
  metaNotes.textContent = activeRef.note;
}

if (previewSummary instanceof HTMLElement) {
  previewSummary.textContent = `${activeRef.ref} loaded on the dedicated page-shell-banner canonical surface.`;
}

if (current instanceof HTMLElement) {
  current.textContent = `${activeRef.ref} ${activeRef.title}`;
}

const prevRef = activeIndex > 0 ? refs[activeIndex - 1] : null;
const nextRef = activeIndex >= 0 && activeIndex < refs.length - 1 ? refs[activeIndex + 1] : null;

if (prev instanceof HTMLAnchorElement) {
  if (prevRef) {
    prev.href = routeFor(prevRef.ref);
    prev.removeAttribute("aria-disabled");
  } else {
    prev.href = "#";
    prev.setAttribute("aria-disabled", "true");
  }
}

if (next instanceof HTMLAnchorElement) {
  if (nextRef) {
    next.href = routeFor(nextRef.ref);
    next.removeAttribute("aria-disabled");
  } else {
    next.href = "#";
    next.setAttribute("aria-disabled", "true");
  }
}
