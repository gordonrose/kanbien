import {
  buildWorkPanelCanonicalRefs,
  createBuildWorkPanelController,
  getBuildWorkPanelCanonicalRef,
} from "./buildWorkPanel.mjs";

const pathRefMatch = window.location.pathname.match(
  /^\/design-system\/(?:canonical-renderings|components)\/build-work-panel\/([^/]+)$/,
);
const activeRef = getBuildWorkPanelCanonicalRef(pathRefMatch?.[1] ?? "BWP-R-002");
const activeIndex = buildWorkPanelCanonicalRefs.findIndex((entry) => entry.ref === activeRef.ref);
const prevRef = activeIndex > 0 ? buildWorkPanelCanonicalRefs[activeIndex - 1] : null;
const nextRef = activeIndex >= 0 && activeIndex < buildWorkPanelCanonicalRefs.length - 1
  ? buildWorkPanelCanonicalRefs[activeIndex + 1]
  : null;

const page = document.querySelector("[data-build-work-panel-canonical-page]");
const stage = document.querySelector("[data-canonical-build-work-panel-host]");
const root = document.getElementById("build-work-panel-preview-shell");
const matchList = document.getElementById("build-work-panel-canonical-match-list");
const circumstances = document.getElementById("build-work-panel-canonical-circumstances");
const metaState = document.getElementById("build-work-panel-meta-state");
const metaNotes = document.getElementById("build-work-panel-meta-notes");
const current = document.getElementById("build-work-panel-canonical-current");
const prev = document.getElementById("build-work-panel-canonical-prev");
const next = document.getElementById("build-work-panel-canonical-next");
const summary = document.getElementById("build-work-panel-preview-summary");

function routeFor(ref) {
  return `/design-system/canonical-renderings/build-work-panel/${encodeURIComponent(ref)}`;
}

if (page instanceof HTMLElement) {
  page.dataset.demoTheme = activeRef.theme ?? "normal";
}

if (stage instanceof HTMLElement) {
  stage.dataset.buildWorkPanelMobileCanonical = activeRef.mobile ? "true" : "false";
}

if (root instanceof HTMLElement) {
  createBuildWorkPanelController(root, { ref: activeRef });
  root.dataset.buildWorkPanelViewport = activeRef.mobile ? "mobile" : "desktop";
  root.dataset.renderStatus = "ready";
}

if (matchList instanceof HTMLElement) {
  matchList.textContent = activeRef.ref;
}

if (circumstances instanceof HTMLElement) {
  circumstances.textContent = "Dedicated build-work-panel render surface inside the governed shell action chassis.";
}

if (metaState instanceof HTMLElement) {
  metaState.textContent = activeRef.title;
}

if (metaNotes instanceof HTMLElement) {
  metaNotes.textContent = activeRef.note;
}

if (summary instanceof HTMLElement) {
  summary.textContent = `${activeRef.ref} loaded on the dedicated build-work-panel surface.`;
}

if (current instanceof HTMLElement) {
  current.textContent = `${activeRef.ref} ${activeRef.title}`;
}

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
