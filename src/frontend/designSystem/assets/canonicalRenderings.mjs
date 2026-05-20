import { floatingTabHeaderCanonicalStates } from "./floatingTabHeaderCanonical.mjs";
import { entityManagementCanonicalFamilies } from "./entityManagementPageCanonical.mjs";

async function fetchJson(url) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

function buildFloatingTabHeaderLauncherPayload() {
  return {
    family: {
      familyKey: "floating-tab-header",
      displayLabel: "Floating Tab Header",
      launcherTitle: "Floating Tab Header Canonical Renderings",
      launcherDescription:
        "Generated canonical launcher fallback for the floating-tab-header reference set while local persistence catches up.",
      generatedLauncherRoutePath: "/design-system/canonical-renderings/floating-tab-header",
      legacyLauncherRoutePath: "/design-system/components/floating-tab-header",
    },
    references: floatingTabHeaderCanonicalStates.map((state, index) => ({
      referenceId: state.refId,
      displayLabel: state.label,
      renderRoutePath: state.route,
      featured: index < 9 || state.refId === "FTH-R-020" || state.refId === "FTH-R-024",
    })),
  };
}

const fallbackCanonicalFamilyPayloads = new Map([
  ...entityManagementCanonicalFamilies.map((payload) => [payload.family.familyKey, payload]),
  ["floating-tab-header", buildFloatingTabHeaderLauncherPayload()],
]);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function getCanonicalRenderingsPathInfo() {
  const segments = window.location.pathname
    .replace(/^\/design-system\/?/, "")
    .split("/")
    .filter(Boolean);

  if (segments[0] !== "canonical-renderings") {
    return null;
  }

  return {
    familyKey: segments[1] ?? null,
    referenceId: segments[2] ?? null,
  };
}

function renderFamilyIndex(items) {
  const grid = document.getElementById("canonical-renderings-family-grid");
  const copy = document.getElementById("canonical-renderings-index-copy");
  if (!(grid instanceof HTMLElement)) {
    return;
  }

  if (copy instanceof HTMLElement) {
    copy.textContent =
      items.length > 0
        ? "Use this index to open generated canonical launchers sourced from persisted governance records."
        : "No live generated canonical families are available yet.";
  }

  grid.innerHTML = items
    .map(
      (family) => `
        <a class="canonical-launcher-button${family.featured ? " canonical-launcher-button-priority" : ""}" href="${escapeHtml(family.generatedLauncherRoutePath)}">
          ${family.featured ? '<span class="canonical-launcher-priority">Featured</span>' : ""}
          <span class="canonical-launcher-ref">${escapeHtml(family.familyKey)}</span>
          <span class="canonical-launcher-label">${escapeHtml(family.displayLabel)}</span>
        </a>
      `,
    )
    .join("");
}

function mergeFallbackFamilies(items) {
  const existingKeys = new Set(items.map((family) => family.familyKey));
  const fallbackFamilies = Array.from(fallbackCanonicalFamilyPayloads.values())
    .map((payload) => payload.family)
    .filter((family) => !existingKeys.has(family.familyKey));
  return [...items, ...fallbackFamilies];
}

function renderFamilyLauncher(payload) {
  const { family, references } = payload;
  const title = document.getElementById("canonical-renderings-family-title");
  const copy = document.getElementById("canonical-renderings-family-copy");
  const profile = document.getElementById("canonical-renderings-family-profile");
  const breadcrumb = document.getElementById("canonical-renderings-family-breadcrumb");
  const navLink = document.getElementById("canonical-renderings-family-nav-link");
  const navLabel = document.getElementById("canonical-renderings-family-nav-label");
  const note = document.getElementById("canonical-renderings-family-note");
  const grid = document.getElementById("canonical-renderings-reference-grid");

  if (title instanceof HTMLElement) {
    title.textContent = family.launcherTitle;
  }
  if (copy instanceof HTMLElement) {
    copy.textContent = family.launcherDescription;
  }
  if (profile instanceof HTMLElement) {
    profile.textContent = family.displayLabel;
  }
  if (breadcrumb instanceof HTMLElement) {
    breadcrumb.textContent = family.displayLabel;
  }
  if (navLabel instanceof HTMLElement) {
    navLabel.textContent = family.displayLabel;
  }
  if (navLink instanceof HTMLAnchorElement) {
    navLink.href = family.generatedLauncherRoutePath;
  }
  if (note instanceof HTMLElement) {
    note.textContent = family.legacyLauncherRoutePath
      ? `Legacy launcher remains available at ${family.legacyLauncherRoutePath} while parity is reviewed.`
      : "Generated from persistence-backed governance truth.";
  }
  if (grid instanceof HTMLElement) {
    grid.innerHTML = references
      .map(
        (reference) => `
          <a class="canonical-launcher-button${reference.featured ? " canonical-launcher-button-priority" : ""}" href="${escapeHtml(reference.renderRoutePath)}">
            ${reference.featured ? '<span class="canonical-launcher-priority">Priority</span>' : ""}
            <span class="canonical-launcher-ref">${escapeHtml(reference.referenceId)}</span>
            <span class="canonical-launcher-label">${escapeHtml(reference.displayLabel)}</span>
          </a>
        `,
      )
      .join("");
  }
}

async function main() {
  const pathInfo = getCanonicalRenderingsPathInfo();
  if (!pathInfo || pathInfo.referenceId) {
    return;
  }

  if (!pathInfo.familyKey) {
    const payload = await fetchJson("/v1/design-system-canonicals/public/families");
    renderFamilyIndex(mergeFallbackFamilies(payload.items ?? []));
    return;
  }

  let payload;
  try {
    payload = await fetchJson(
      `/v1/design-system-canonicals/public/families/${encodeURIComponent(pathInfo.familyKey)}/launcher`,
    );
  } catch (error) {
    if (!fallbackCanonicalFamilyPayloads.has(pathInfo.familyKey)) {
      throw error;
    }
    payload = fallbackCanonicalFamilyPayloads.get(pathInfo.familyKey);
  }
  if (fallbackCanonicalFamilyPayloads.has(pathInfo.familyKey) && (!Array.isArray(payload.references) || payload.references.length === 0)) {
    payload = fallbackCanonicalFamilyPayloads.get(pathInfo.familyKey);
  }
  renderFamilyLauncher(payload);
}

void main().catch((error) => {
  console.error("Failed to hydrate canonical renderings launcher", error);
});
