import express, { Router } from "express";
import { existsSync } from "node:fs";
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

  router.get("*", (request, response) => {
    const resolvedPage = resolveHtmlPage(frontendRoot, request.path);
    if (!resolvedPage) {
      response.status(404).send("Design-system route not found");
      return;
    }

    response.sendFile(resolvedPage);
  });

  return router;
}
