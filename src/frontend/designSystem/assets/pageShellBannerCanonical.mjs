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
const canonicalRenderingsPathMatch = window.location.pathname.match(
  /^\/design-system\/canonical-renderings\/([^/]+)\/([^/]+)$/,
);

async function resolveGeneratedCanonicalState() {
  if (!canonicalRenderingsPathMatch || canonicalRenderingsPathMatch[1] !== "page-shell-banner") {
    return null;
  }

  const response = await fetch(
    `/v1/design-system-canonicals/public/families/${encodeURIComponent(canonicalRenderingsPathMatch[1])}/references/${encodeURIComponent(canonicalRenderingsPathMatch[2])}`,
    {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load generated page-shell-banner canonical with status ${response.status}`);
  }

  const payload = await response.json();
  return {
    family: payload.family,
    references: refs.map((entry) => ({
      ...entry,
      route: `/design-system/canonical-renderings/page-shell-banner/${encodeURIComponent(entry.ref)}`,
    })),
    activeRef: {
      ref: payload.reference.referenceId,
      title: payload.reference.displayLabel,
      banners: Array.isArray(payload.reference.specimenPayload?.banners)
        ? payload.reference.specimenPayload.banners
        : [],
      note: payload.reference.description,
      route: payload.reference.renderRoutePath,
      theme: payload.reference.theme,
      direction: payload.reference.direction,
      zoom: payload.reference.zoom,
      viewport: payload.reference.viewport,
    },
    launchHref: payload.family.generatedLauncherRoutePath,
  };
}

function resolveLegacyCanonicalState() {
  const requestedRef = params.get("ref") ?? "PSBR-001";
  const theme = params.get("theme") ?? "normal";
  const direction = params.get("dir") ?? "ltr";
  const zoom = Number.parseInt(params.get("zoom") ?? "0", 10);
  const activeRef = refMap.get(requestedRef) ?? refs[0];
  return {
    family: null,
    references: refs.map((entry) => ({ ...entry, route: routeFor(entry.ref, theme, direction, zoom) })),
    activeRef: {
      ...activeRef,
      route: routeFor(activeRef.ref, theme, direction, zoom),
      theme,
      direction,
      zoom,
      viewport: "Template-hosted shell banner reviewed on a dedicated canonical render surface.",
    },
    launchHref: "/design-system/canonicals/page-shell-banner",
  };
}

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
const launcherLink = document.querySelector('a[href="/design-system/canonicals/page-shell-banner"]');

function routeFor(ref, theme, direction, zoom) {
  return `/design-system/components/page-shell-banner?ref=${encodeURIComponent(ref)}&theme=${encodeURIComponent(theme)}&dir=${encodeURIComponent(direction)}&zoom=${encodeURIComponent(String(Number.isFinite(zoom) ? zoom : 0))}`;
}

function normalizeZoom(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(-100, Math.min(100, value));
}

async function main() {
  const resolvedState = await resolveGeneratedCanonicalState() ?? resolveLegacyCanonicalState();
  const activeRef = resolvedState.activeRef;
  const theme = activeRef.theme ?? "normal";
  const direction = activeRef.direction ?? "ltr";
  const normalizedZoom = normalizeZoom(activeRef.zoom ?? 0);
  const scale = 1 + (normalizedZoom / 100) * 0.5;
  const activeIndex = resolvedState.references.findIndex((entry) => entry.ref === activeRef.ref);
  const prevRef = activeIndex > 0 ? resolvedState.references[activeIndex - 1] : null;
  const nextRef =
    activeIndex >= 0 && activeIndex < resolvedState.references.length - 1
      ? resolvedState.references[activeIndex + 1]
      : null;
  const pageShellBannerController = previewBannerDemo instanceof HTMLElement
    ? createPageShellBannerController(previewBannerDemo, {
      visible: true,
      visibleIds: activeRef.banners,
      ariaLabel: previewBannerDemo.getAttribute("aria-label") ?? "Page-shell banner canonical demo",
    })
    : null;

  if (previewShell instanceof HTMLElement) {
    previewShell.dataset.themeScope = theme;
    previewShell.setAttribute("dir", direction);
    previewShell.style.setProperty("--ui-scale", String(scale));
    previewShell.dataset.magnification = String(normalizedZoom);
    previewShell.dataset.renderStatus = "ready";
  }

  if (pageShellBannerController) {
    pageShellBannerController.setVisibleIds(activeRef.banners);
  }

  if (launcherLink instanceof HTMLAnchorElement) {
    launcherLink.href = resolvedState.launchHref;
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
    metaViewport.textContent =
      activeRef.viewport ?? "Template-hosted shell banner reviewed on a dedicated canonical render surface.";
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

  if (prev instanceof HTMLAnchorElement) {
    if (prevRef) {
      prev.href = prevRef.route;
      prev.removeAttribute("aria-disabled");
    } else {
      prev.href = "#";
      prev.setAttribute("aria-disabled", "true");
    }
  }

  if (next instanceof HTMLAnchorElement) {
    if (nextRef) {
      next.href = nextRef.route;
      next.removeAttribute("aria-disabled");
    } else {
      next.href = "#";
      next.setAttribute("aria-disabled", "true");
    }
  }
}

void main().catch((error) => {
  console.error("Failed to render page-shell-banner canonical", error);
});
