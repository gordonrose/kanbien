import express, { Router } from "express";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { env } from "../../config/env";

type GeneratedCanonicalRenderRouteDefinition = {
  htmlPath: readonly string[];
  surfaceSignature: string;
};

export const generatedCanonicalRenderRouteRegistry = {
  "choice-group": {
    htmlPath: ["components", "choice-group.html"],
    surfaceSignature: 'id="choice-group-preview-shell"',
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
  "drawer-select": {
    htmlPath: ["components", "drawer-select.html"],
    surfaceSignature: 'id="drawer-select-preview-shell"',
  },
  "form-template": {
    htmlPath: ["templates", "form", "index.html"],
    surfaceSignature: 'class="form-page-shell',
  },
  "icon-grid": {
    htmlPath: ["components", "icon-grid.html"],
    surfaceSignature: 'id="icon-grid-preview-shell"',
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

function resolveHtmlPage(frontendRoot: string, requestPath: string): string | null {
  if (requestPath === "/" || requestPath === "") {
    return join(frontendRoot, "index.html");
  }

  const normalizedPath = requestPath.replace(/^\/+|\/+$/g, "");
  const pathSegments = normalizedPath === "" ? [] : normalizedPath.split("/");

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

  router.get("*", (request, response, next) => {
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
        normalizeServedTopNav(await readFile(resolvedPage, "utf8"), request.path),
      );
    })().catch(next);
  });

  return router;
}
