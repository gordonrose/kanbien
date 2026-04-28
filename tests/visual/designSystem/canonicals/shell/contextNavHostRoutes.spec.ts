import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { expect, test } from "@playwright/test";
import { expectHostContextNavShellAttachment } from "../../support/helpers/contextNavShellAttachment";

const designSystemRoot = join(process.cwd(), "src/frontend/designSystem");

function listHtmlFiles(directory: string): string[] {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? listHtmlFiles(path) : [path];
    })
    .filter((path) => path.endsWith(".html"));
}

function htmlPathToRoute(path: string): string {
  const relativePath = relative(designSystemRoot, path).split(sep).join("/");
  if (relativePath === "index.html") {
    return "/design-system";
  }

  const withoutIndex = relativePath.endsWith("/index.html")
    ? relativePath.slice(0, -"/index.html".length)
    : relativePath.slice(0, -".html".length);

  return withoutIndex === "" ? "/design-system" : `/design-system/${withoutIndex}`;
}

function hasHostContextNavMarkup(path: string): boolean {
  const html = readFileSync(path, "utf8");
  return html.includes("context-nav")
    && !html.includes('id="context-nav-preview-shell"');
}

const contextNavHostRoutes = existsSync(designSystemRoot)
  ? listHtmlFiles(designSystemRoot)
    .filter(hasHostContextNavMarkup)
    .map(htmlPathToRoute)
    .sort()
  : [];

test.describe("design-system host context-nav shell attachment", () => {
  test("static route scan found host context-nav pages", async () => {
    expect(contextNavHostRoutes.length).toBeGreaterThan(0);
    expect(contextNavHostRoutes).toContain("/design-system");
    expect(contextNavHostRoutes).toContain("/design-system/templates/form");
  });

  for (const route of contextNavHostRoutes) {
    test(`${route} keeps host context-nav inside the measured shell`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(route);
      await expectHostContextNavShellAttachment(page, { route });
    });
  }
});
