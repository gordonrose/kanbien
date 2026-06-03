import express, { Router } from "express";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { env } from "../../config/env";
import { getDesignSystem } from "./registry/designSystems.mjs";

type GeneratedCanonicalRenderRouteDefinition = {
  htmlPath: readonly string[];
  surfaceSignature: string;
};

export const generatedCanonicalRenderRouteRegistry = {
  "choice-group": {
    htmlPath: ["components", "choice-group.html"],
    surfaceSignature: 'id="choice-group-preview-shell"',
  },
  "entity-management-page-outer-page": {
    htmlPath: ["components", "entity-management-page-child.html"],
    surfaceSignature: 'id="entity-management-page-preview-shell"',
  },
  "entity-management-page-navigation": {
    htmlPath: ["components", "entity-management-page-child.html"],
    surfaceSignature: 'id="entity-management-page-preview-shell"',
  },
  "entity-management-page-detail-panel": {
    htmlPath: ["components", "entity-management-page-child.html"],
    surfaceSignature: 'id="entity-management-page-preview-shell"',
  },
  "entity-management-page-collection-item": {
    htmlPath: ["components", "entity-management-page-child.html"],
    surfaceSignature: 'id="entity-management-page-preview-shell"',
  },
  "entity-management-page-evidence-ai": {
    htmlPath: ["components", "entity-management-page-child.html"],
    surfaceSignature: 'id="entity-management-page-preview-shell"',
  },
  "entity-management-page-performance": {
    htmlPath: ["components", "entity-management-page-child.html"],
    surfaceSignature: 'id="entity-management-page-preview-shell"',
  },
  "date-picker": {
    htmlPath: ["components", "date-picker.html"],
    surfaceSignature: 'id="date-picker-preview-shell"',
  },
  "display-settings": {
    htmlPath: ["components", "context-nav.html"],
    surfaceSignature: 'id="context-nav-preview-shell"',
  },
  "async-activity-drawer": {
    htmlPath: ["components", "async-activity-drawer.html"],
    surfaceSignature: 'id="async-activity-drawer-preview-shell"',
  },
  "build-work-panel": {
    htmlPath: ["components", "build-work-panel.html"],
    surfaceSignature: 'id="build-work-panel-preview-shell"',
  },
  "chat-workspace-shell": {
    htmlPath: ["components", "chat-workspace-shell.html"],
    surfaceSignature: 'id="chat-workspace-preview-frame"',
  },
  "drawer-select": {
    htmlPath: ["components", "drawer-select.html"],
    surfaceSignature: 'id="drawer-select-preview-shell"',
  },
  "drawer-form": {
    htmlPath: ["components", "drawer-form.html"],
    surfaceSignature: 'data-drawer-form-preview-frame',
  },
  "form-template": {
    htmlPath: ["templates", "form", "index.html"],
    surfaceSignature: 'class="form-page-shell',
  },
  "form-image-card": {
    htmlPath: ["components", "form-image-card.html"],
    surfaceSignature: 'id="form-image-card-preview-shell"',
  },
  "floating-tab-header": {
    htmlPath: ["components", "floating-tab-header.html"],
    surfaceSignature: 'id="floating-tab-preview-frame"',
  },
  "icon-grid": {
    htmlPath: ["components", "icon-grid.html"],
    surfaceSignature: 'id="icon-grid-preview-shell"',
  },
  "hierarchy-tree": {
    htmlPath: ["patterns", "hierarchy-tree", "render", "index.html"],
    surfaceSignature: 'id="hierarchy-tree-canonical-current"',
  },
  "kanban-column": {
    htmlPath: ["components", "kanban-column.html"],
    surfaceSignature: 'id="kanban-column-preview-shell"',
  },
  "list-detail-panel": {
    htmlPath: ["components", "list-detail-panel.html"],
    surfaceSignature: 'id="list-detail-panel-preview-shell"',
  },
  "list-detail-split-layout": {
    htmlPath: ["components", "list-detail-split-layout.html"],
    surfaceSignature: 'id="list-detail-split-layout-preview-shell"',
  },
  "list-record-card": {
    htmlPath: ["components", "list-record-card.html"],
    surfaceSignature: 'id="list-record-card-preview-shell"',
  },
  "page-shell-banner": {
    htmlPath: ["components", "page-shell-banner.html"],
    surfaceSignature: 'id="page-shell-banner-preview-shell"',
  },
  "simple-select": {
    htmlPath: ["components", "simple-select.html"],
    surfaceSignature: 'id="simple-select-preview-shell"',
  },
  "time-picker": {
    htmlPath: ["components", "time-picker.html"],
    surfaceSignature: 'id="time-picker-preview-shell"',
  },
  "top-nav": {
    htmlPath: ["components", "top-nav.html"],
    surfaceSignature: 'id="top-nav-preview-frame"',
  },
  "upload-file": {
    htmlPath: ["components", "upload-file.html"],
    surfaceSignature: 'id="upload-file-preview-shell"',
  },
} as const satisfies Record<string, GeneratedCanonicalRenderRouteDefinition>;

type GeneratedCanonicalRenderFamilyKey = keyof typeof generatedCanonicalRenderRouteRegistry;

function isGeneratedCanonicalRenderFamilyKey(familyKey: string): familyKey is GeneratedCanonicalRenderFamilyKey {
  return Object.prototype.hasOwnProperty.call(generatedCanonicalRenderRouteRegistry, familyKey);
}

function resolveFrontendRoot(): string {
  const candidates =
    env.nodeEnv === "production"
      ? [
          resolve(process.cwd(), "dist/frontend/designSystem"),
          resolve(process.cwd(), "src/frontend/designSystem"),
        ]
      : [
          resolve(process.cwd(), "src/frontend/designSystem"),
          resolve(process.cwd(), "dist/frontend/designSystem"),
        ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[1];
}

function resolveGeneratedCanonicalRenderHtmlPage(frontendRoot: string, familyKey: string): string | null {
  if (!isGeneratedCanonicalRenderFamilyKey(familyKey)) {
    return null;
  }

  const routeDefinition = generatedCanonicalRenderRouteRegistry[familyKey];
  const htmlPage = join(frontendRoot, ...routeDefinition.htmlPath);
  return existsSync(htmlPage) ? htmlPage : null;
}

const designSystemTopNavItems = [
  { href: "/design-system", label: "Overview" },
  { href: "/design-system/canonical-renderings", label: "Canonical Renderings" },
  { href: "/design-system/canonicals", label: "Canonicals" },
] as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeDesignSystemPath(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/design-system";
  }
  const normalized = `/design-system/${pathname.replace(/^\/+|\/+$/g, "")}`.replace(/\/+/g, "/");
  return normalized.replace(/\/+$/g, "") || "/design-system";
}

function resolveActiveTopNavHref(requestPath: string): string {
  const normalizedPath = normalizeDesignSystemPath(requestPath);
  const exact = designSystemTopNavItems.find((item) => item.href === normalizedPath);
  if (exact) {
    return exact.href;
  }

  const prefixMatch = [...designSystemTopNavItems]
    .filter((item) => normalizedPath.startsWith(`${item.href}/`))
    .sort((left, right) => right.href.length - left.href.length)[0];

  return prefixMatch?.href ?? "/design-system";
}

function buildTopNavLinks(activeHref: string): string {
  return designSystemTopNavItems
    .map((item) => {
      const active = item.href === activeHref;
      return `<a class="nav-link${active ? " active" : ""}" href="${escapeHtml(item.href)}"${active ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`;
    })
    .join("");
}

function buildTopNavMenu(activeHref: string): string {
  return designSystemTopNavItems
    .map((item) => {
      if (item.href === activeHref) {
        return `<span class="menu-item breadcrumb-structure-current" aria-current="page">${escapeHtml(item.label)}</span>`;
      }
      return `<a class="menu-item" href="${escapeHtml(item.href)}" role="menuitem">${escapeHtml(item.label)}</a>`;
    })
    .join("");
}

function normalizeServedTopNav(html: string, requestPath: string): string {
  const shellIndex = html.indexOf('class="design-system-shell"');
  if (shellIndex === -1) {
    return html;
  }

  const topNavHeaderStart = html.indexOf('<header class="top-nav"', shellIndex);
  const start = topNavHeaderStart === -1 ? html.indexOf("<header", shellIndex) : topNavHeaderStart;
  if (start === -1) {
    return html;
  }

  const headerEnd = html.indexOf("</header>", start);
  if (headerEnd === -1) {
    return html;
  }

  const activeHref = resolveActiveTopNavHref(requestPath);
  const links = buildTopNavLinks(activeHref);
  const menu = buildTopNavMenu(activeHref);
  const header = html
    .slice(start, headerEnd + "</header>".length)
    .replace(
      /<div([^>]*class="[^"]*\bprimary-nav-links\b[^"]*"[^>]*)>[\s\S]*?<\/div>/,
      `<div$1>${links}</div>`,
    )
    .replace(
      /<div([^>]*class="[^"]*\bprimary-nav-overflow-menu\b[^"]*"[^>]*)>[\s\S]*?<\/div>/,
      `<div$1>${menu}</div>`,
    );

  let nextHtml = `${html.slice(0, start)}${header}${html.slice(headerEnd + "</header>".length)}`;
  const mobileNavStart = nextHtml.indexOf('<nav id="mobile-nav-menu"', start + header.length);
  if (mobileNavStart === -1) {
    return nextHtml;
  }

  const mobileProfileStart = nextHtml.indexOf('<div class="mobile-profile-group"', mobileNavStart);
  const mobileNavEnd = nextHtml.indexOf("</nav>", mobileNavStart);
  if (mobileProfileStart === -1 || mobileNavEnd === -1 || mobileProfileStart > mobileNavEnd) {
    return nextHtml;
  }

  nextHtml = `${nextHtml.slice(0, mobileNavStart)}${nextHtml
    .slice(mobileNavStart, mobileProfileStart)
    .replace(/(<nav[^>]*>)[\s\S]*$/, `$1${links}`)}${nextHtml.slice(mobileProfileStart)}`;

  return nextHtml;
}

const baselineDisplaySettingsButton = String.raw`
          <button
            id="accessibility-button"
            class="context-nav-item context-nav-item-button"
            type="button"
            data-tooltip="Display Settings"
            aria-expanded="false"
            aria-controls="accessibility-drawer"
          >
            <span class="context-nav-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d="M4 5h16v14H4zm2 2v10h9V7zm11 0h1v10h-1z" /></svg>
            </span>
            <span class="context-nav-label">Display</span>
          </button>`;

const baselineDisplaySettingsDrawer = String.raw`
      <aside id="accessibility-drawer" class="side-panel accessibility-drawer hidden" aria-labelledby="accessibility-title" aria-hidden="true">
        <div class="side-panel-header accessibility-drawer-header">
          <div>
            <p class="drawer-eyebrow" data-display-settings-copy="eyebrow">Display</p>
            <h2 id="accessibility-title" data-display-settings-copy="title">Display Settings</h2>
          </div>
          <button id="accessibility-close" class="drawer-close-button" type="button" aria-label="Close display settings" data-display-settings-aria-label="close">&times;</button>
        </div>

        <div class="accessibility-group">
          <p class="accessibility-label" data-display-settings-copy="theme-group">Theme</p>
          <div class="chip-row" role="group" aria-label="Theme">
            <button class="accessibility-chip active" type="button" data-theme-option="normal" data-display-settings-copy="theme-normal">Normal</button>
            <button class="accessibility-chip" type="button" data-theme-option="dark" data-display-settings-copy="theme-dark">Dark</button>
            <button class="accessibility-chip" type="button" data-theme-option="desert" data-display-settings-copy="theme-desert">Desert</button>
          </div>
        </div>

        <div class="accessibility-group">
          <p class="accessibility-label" data-display-settings-copy="magnification-group">Magnification</p>
          <div class="chip-row chip-row-single-line" role="group" aria-label="Magnification">
            <button class="accessibility-chip" type="button" data-magnification-option="-100">-100%</button>
            <button class="accessibility-chip" type="button" data-magnification-option="-50">-50%</button>
            <button class="accessibility-chip active" type="button" data-magnification-option="0">0%</button>
            <button class="accessibility-chip" type="button" data-magnification-option="50">+50%</button>
            <button class="accessibility-chip" type="button" data-magnification-option="100">+100%</button>
          </div>
        </div>

        <div class="accessibility-group">
          <p class="accessibility-label" data-display-settings-copy="accent-group">Primary Colour</p>
          <div class="color-grid" role="group" aria-label="Primary colour">
            <button class="color-swatch active" type="button" data-accent="#635bff" aria-label="Indigo"><svg class="color-swatch-fill-svg" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="#635bff" /></svg></button>
            <button class="color-swatch" type="button" data-accent="#2563eb" aria-label="Blue"><svg class="color-swatch-fill-svg" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="#2563eb" /></svg></button>
            <button class="color-swatch" type="button" data-accent="#0891b2" aria-label="Cyan"><svg class="color-swatch-fill-svg" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="#0891b2" /></svg></button>
            <button class="color-swatch" type="button" data-accent="#0f766e" aria-label="Teal"><svg class="color-swatch-fill-svg" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="#0f766e" /></svg></button>
          </div>
        </div>

        <div class="accessibility-group">
          <p class="accessibility-label" data-display-settings-copy="direction-group">Direction</p>
          <div class="chip-row" role="group" aria-label="Direction">
            <button class="accessibility-chip active" type="button" data-direction-option="ltr" data-display-settings-copy="direction-ltr">Left to right</button>
            <button class="accessibility-chip" type="button" data-direction-option="rtl" data-display-settings-copy="direction-rtl">Right to left</button>
          </div>
        </div>
      </aside>`;

function normalizeServedDisplaySettings(html: string): string {
  if (!html.includes('class="design-system-shell"')) {
    return html;
  }

  let nextHtml = html;

  if (!nextHtml.includes('id="accessibility-button"')) {
    const bottomGroupMatch = nextHtml.match(/<div([^>]*class="[^"]*\bcontext-nav-bottom-group\b[^"]*"[^>]*)>([\s\S]*?)<\/div>/);
    if (bottomGroupMatch?.index !== undefined) {
      const start = bottomGroupMatch.index;
      const existingTag = bottomGroupMatch[0];
      const openingTag = `<div${bottomGroupMatch[1].replace(/\saria-hidden="true"/, "")}>`;
      const replacement = `${openingTag}${bottomGroupMatch[2]}${baselineDisplaySettingsButton}
        </div>`;
      nextHtml = `${nextHtml.slice(0, start)}${replacement}${nextHtml.slice(start + existingTag.length)}`;
    } else {
      const contextNavStart = nextHtml.indexOf('<nav class="context-nav"');
      const contextNavEnd = contextNavStart === -1 ? -1 : nextHtml.indexOf("</nav>", contextNavStart);
      if (contextNavEnd !== -1) {
        nextHtml = `${nextHtml.slice(0, contextNavEnd)}
        <div class="context-nav-bottom-group">${baselineDisplaySettingsButton}
        </div>
      ${nextHtml.slice(contextNavEnd)}`;
      }
    }
  }

  if (!nextHtml.includes('id="accessibility-drawer"')) {
    const contextNavStart = nextHtml.indexOf('<nav class="context-nav"');
    const contextNavEnd = contextNavStart === -1 ? -1 : nextHtml.indexOf("</nav>", contextNavStart);
    if (contextNavEnd !== -1) {
      const insertAt = contextNavEnd + "</nav>".length;
      nextHtml = `${nextHtml.slice(0, insertAt)}

${baselineDisplaySettingsDrawer}${nextHtml.slice(insertAt)}`;
    }
  }

  return nextHtml;
}

function resolveHtmlPage(frontendRoot: string, requestPath: string): string | null {
  if (requestPath === "/" || requestPath === "") {
    return join(frontendRoot, "index.html");
  }

  const normalizedPath = requestPath.replace(/^\/+|\/+$/g, "");
  const pathSegments = normalizedPath === "" ? [] : normalizedPath.split("/");

  if (pathSegments[0] && getDesignSystem(pathSegments[0])) {
    const systemIndexCandidate = join(frontendRoot, "systems", ...pathSegments, "index.html");
    if (existsSync(systemIndexCandidate)) {
      return systemIndexCandidate;
    }

    const systemHtmlCandidate = join(frontendRoot, "systems", ...pathSegments) + ".html";
    if (existsSync(systemHtmlCandidate)) {
      return systemHtmlCandidate;
    }
  }

  if (
    pathSegments[0] === "tokens" &&
    pathSegments[1] === "count-card" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "filter-card", "index.html");
  }

  if (
    pathSegments[0] === "tokens" &&
    (pathSegments[1] === "index-card" || pathSegments[1] === "secondary-list-card") &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "index-card", "index.html");
  }

  if (
    pathSegments[0] === "tokens" &&
    pathSegments[1] === "button-card" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "button-card", "index.html");
  }

  if (
    pathSegments[0] === "tokens" &&
    (pathSegments[1] === "dropdowns" || pathSegments[1] === "simple-dropdown" || pathSegments[1] === "simple-select") &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "dropdowns", "index.html");
  }

  const htmlCandidate = join(frontendRoot, ...pathSegments) + ".html";
  if (existsSync(htmlCandidate)) {
    return htmlCandidate;
  }

  const indexCandidate = join(frontendRoot, ...pathSegments, "index.html");
  if (existsSync(indexCandidate)) {
    return indexCandidate;
  }

  if (
    pathSegments[0] === "components" &&
    pathSegments[1] === "async-activity-drawer" &&
    pathSegments.length === 3
  ) {
    return join(frontendRoot, "components", "async-activity-drawer.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "background" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "background", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "container" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "container", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "container-section" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "container-section", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "page-header" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "page-header", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "filter-panel-structure" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "filter-panel-structure", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "search-panel" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "search-panel", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    (pathSegments[1] === "filter-card" || pathSegments[1] === "count-card") &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "filter-card", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    (pathSegments[1] === "index-card" || pathSegments[1] === "secondary-list-card") &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "index-card", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "button-card" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "button-card", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    (pathSegments[1] === "dropdowns" || pathSegments[1] === "simple-dropdown" || pathSegments[1] === "simple-select") &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "dropdowns", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "list-card" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "list-card", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "icon-button" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "icon-button", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "colours" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "colours", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "paragraph" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "paragraph", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "header" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "header", "index.html");
  }

  if (
    pathSegments[0] === "token" &&
    pathSegments[1] === "tooltip" &&
    pathSegments.length === 2
  ) {
    return join(frontendRoot, "tokens", "tooltip", "index.html");
  }

  if (pathSegments[0] === "canonical-renderings") {
    if (pathSegments.length === 1) {
      return join(frontendRoot, "canonical-renderings", "index.html");
    }

    if (pathSegments.length === 2) {
      return join(frontendRoot, "canonical-renderings", "family", "index.html");
    }

    if (pathSegments.length === 3) {
      return resolveGeneratedCanonicalRenderHtmlPage(frontendRoot, pathSegments[1]);
    }

    return null;
  }

  if (
    pathSegments[0] === "tokens" &&
    (pathSegments[1] === "primary-list-card" || pathSegments[1] === "primary-index-card") &&
    pathSegments.length === 2
  ) {
    return null;
  }

  return join(frontendRoot, "index.html");
}

export function createDesignSystemRouter(): Router {
  const router = Router();
  const frontendRoot = resolveFrontendRoot();

  router.use(
    "/assets",
    express.static(join(frontendRoot, "assets"), {
      fallthrough: false,
    }),
  );

  router.use(
    "/systems",
    express.static(join(frontendRoot, "systems"), {
      fallthrough: false,
    }),
  );

  router.use(
    "/shared",
    express.static(join(frontendRoot, "shared"), {
      fallthrough: false,
    }),
  );

  router.use(
    "/contracts",
    express.static(join(frontendRoot, "contracts"), {
      fallthrough: false,
    }),
  );

  router.use(
    "/layers",
    express.static(join(frontendRoot, "layers"), {
      fallthrough: false,
    }),
  );

  router.get("/templates/record_management_list_centric/organization-demo-fixture.json", (_request, response) => {
    response.sendFile(join(
      process.cwd(),
      "docs",
      "workspace",
      "design-system",
      "templates",
      "record-management-list-centric-organization-demo-fixture.json",
    ));
  });

  router.get(/.*/, (request, response, next) => {
    void (async () => {
      const resolvedPage = resolveHtmlPage(frontendRoot, request.path);
      if (!resolvedPage) {
        response.status(404).send("Design-system route not found");
        return;
      }

      if (!resolvedPage.endsWith(".html")) {
        response.sendFile(resolvedPage);
        return;
      }

      response.type("html").send(
        normalizeServedDisplaySettings(
          normalizeServedTopNav(await readFile(resolvedPage, "utf8"), request.path),
        ),
      );
    })().catch(next);
  });

  return router;
}
