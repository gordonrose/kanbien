import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { env } from "../../config/env";

export interface DesignSystemDiscoveredRoute {
  routePath: string;
  displayLabel: string;
  implementationSourcePath: string;
}

function toTitleCase(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function resolveDesignSystemFrontendRoot(): string {
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

async function walkHtmlFiles(root: string, current: string): Promise<string[]> {
  const entries = await readdir(current, { withFileTypes: true });
  const discovered: string[] = [];

  for (const entry of entries) {
    if (entry.name === "assets") {
      continue;
    }

    const absolutePath = resolve(current, entry.name);
    if (entry.isDirectory()) {
      discovered.push(...(await walkHtmlFiles(root, absolutePath)));
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".html")) {
      continue;
    }

    discovered.push(relative(root, absolutePath));
  }

  return discovered;
}

function toRoutePath(relativeFilepath: string): string {
  const normalized = relativeFilepath.split(sep).join("/");
  if (normalized === "index.html") {
    return "/design-system";
  }
  if (normalized.endsWith("/index.html")) {
    return `/design-system/${normalized.slice(0, -"\/index.html".length)}`.replace(/\/+/g, "/");
  }
  return `/design-system/${normalized.slice(0, -".html".length)}`.replace(/\/+/g, "/");
}

function toDisplayLabel(routePath: string): string {
  const segments = routePath.split("/").filter(Boolean);
  const last = segments[segments.length - 1];

  if (!last || last === "design-system") {
    return "Design System";
  }

  return toTitleCase(last);
}

export async function listDesignSystemDiscoveredRoutes(): Promise<DesignSystemDiscoveredRoute[]> {
  const frontendRoot = resolveDesignSystemFrontendRoot();
  const htmlFiles = await walkHtmlFiles(frontendRoot, frontendRoot);

  return htmlFiles
    .map((filepath) => {
      const routePath = toRoutePath(filepath);
      return {
        routePath,
        displayLabel: toDisplayLabel(routePath),
        implementationSourcePath: `src/frontend/designSystem/${filepath.split(sep).join("/")}`,
      };
    })
    .sort((left, right) => left.routePath.localeCompare(right.routePath));
}
