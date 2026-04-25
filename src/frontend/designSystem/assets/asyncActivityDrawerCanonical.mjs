import {
  asyncActivityDrawerCanonicalRefs,
  getAsyncActivityDrawerCanonicalRef,
  renderAsyncActivityDrawer,
} from "./asyncActivityDrawer.mjs";

const pathRefMatch = window.location.pathname.match(
  /^\/design-system\/(?:canonical-renderings|components)\/async-activity-drawer\/([^/]+)$/,
);
const activeRef = getAsyncActivityDrawerCanonicalRef(pathRefMatch?.[1] ?? "AADR-001");
const activeIndex = asyncActivityDrawerCanonicalRefs.findIndex((entry) => entry.ref === activeRef.ref);
const prevRef = activeIndex > 0 ? asyncActivityDrawerCanonicalRefs[activeIndex - 1] : null;
const nextRef = activeIndex >= 0 && activeIndex < asyncActivityDrawerCanonicalRefs.length - 1
  ? asyncActivityDrawerCanonicalRefs[activeIndex + 1]
  : null;

const root = document.getElementById("async-activity-drawer");
const previewShell = document.getElementById("async-activity-drawer-preview-shell");
const matchList = document.getElementById("async-activity-drawer-canonical-match-list");
const circumstances = document.getElementById("async-activity-drawer-canonical-circumstances");
const metaState = document.getElementById("async-activity-drawer-meta-state");
const metaNotes = document.getElementById("async-activity-drawer-meta-notes");
const current = document.getElementById("async-activity-drawer-canonical-current");
const prev = document.getElementById("async-activity-drawer-canonical-prev");
const next = document.getElementById("async-activity-drawer-canonical-next");
const summary = document.getElementById("async-activity-drawer-preview-summary");

function routeFor(ref) {
  return `/design-system/canonical-renderings/async-activity-drawer/${encodeURIComponent(ref)}`;
}

if (root instanceof HTMLElement) {
  renderAsyncActivityDrawer(root, { jobs: activeRef.jobs });
  root.classList.remove("hidden");
  root.setAttribute("aria-hidden", "false");
}

if (previewShell instanceof HTMLElement) {
  previewShell.dataset.renderStatus = "ready";
}

if (matchList instanceof HTMLElement) {
  matchList.textContent = activeRef.ref;
}

if (circumstances instanceof HTMLElement) {
  circumstances.textContent = "Dedicated async-activity-drawer render surface inside the governed shell drawer chassis.";
}

if (metaState instanceof HTMLElement) {
  metaState.textContent = activeRef.title;
}

if (metaNotes instanceof HTMLElement) {
  metaNotes.textContent = activeRef.note;
}

if (summary instanceof HTMLElement) {
  summary.textContent = `${activeRef.ref} loaded on the dedicated async-activity-drawer surface.`;
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
