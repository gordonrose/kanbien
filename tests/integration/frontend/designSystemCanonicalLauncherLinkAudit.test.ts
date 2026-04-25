import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app";

const canonicalLauncherRoot = join(process.cwd(), "src/frontend/designSystem/canonicals");

const generatedLauncherFamilies = [
  "choice-group",
  "date-picker",
  "drawer-select",
  "list-detail-panel",
  "list-detail-split-layout",
  "list-record-card",
  "page-shell-banner",
  "simple-select",
  "time-picker",
  "top-nav",
];

const generatedLauncherFamilyPattern = generatedLauncherFamilies.join("|");

function walkHtmlFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walkHtmlFiles(path) : path.endsWith(".html") ? [path] : [];
  });
}

describe("design-system canonical launcher link audit", () => {
  it("prefers generated canonical-rendering URLs for generated launcher families", () => {
    const legacyGeneratedFamilyLink = new RegExp(
      `/design-system/components/(${generatedLauncherFamilyPattern})\\?[^"<>\\s]*ref=`,
    );
    const legacyDisplaySettingsLink =
      /\/design-system\/components\/context-nav\?[^"<>\s]*ref=DSR-/;

    for (const path of walkHtmlFiles(canonicalLauncherRoot)) {
      const source = readFileSync(path, "utf8");
      const relativePath = relative(process.cwd(), path);

      expect(source, relativePath).not.toMatch(legacyGeneratedFamilyLink);
      expect(source, relativePath).not.toMatch(legacyDisplaySettingsLink);
    }
  });

  it("keeps generated canonical launcher routes visible for migrated launchers", () => {
    const expectedRoutes = [
      "/design-system/canonical-renderings/page-shell-banner/PSBR-001",
      "/design-system/canonical-renderings/top-nav/TRP-001",
      "/design-system/canonical-renderings/simple-select/SSR-002",
      "/design-system/canonical-renderings/choice-group/CGR-003",
      "/design-system/canonical-renderings/date-picker/DTPR-001",
      "/design-system/canonical-renderings/drawer-select/DSR-002",
      "/design-system/canonical-renderings/display-settings/DSR-001",
      "/design-system/canonical-renderings/list-record-card/LRC-001",
      "/design-system/canonical-renderings/list-detail-panel/LDP-001",
      "/design-system/canonical-renderings/list-detail-split-layout/LDSL-002",
      "/design-system/canonical-renderings/time-picker/TPR-004",
    ];
    const combinedSource = walkHtmlFiles(canonicalLauncherRoot)
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");

    for (const route of expectedRoutes) {
      expect(combinedSource).toContain(route);
    }
  });

  it("serves every generated canonical-renderings link from canonical launcher pages", async () => {
    const combinedSource = walkHtmlFiles(canonicalLauncherRoot)
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");
    const routes = Array.from(
      new Set(
        Array.from(combinedSource.matchAll(/href="(\/design-system\/canonical-renderings[^"]*)"/g), ([, route]) => route),
      ),
    ).sort();
    const app = createApp();

    expect(routes.length).toBeGreaterThan(0);

    for (const route of routes) {
      const response = await request(app).get(route).set("host", "admin.example.test");

      expect(response.status, route).toBe(200);
      expect(response.text, route).toContain("class=\"top-nav");
    }
  });
});
