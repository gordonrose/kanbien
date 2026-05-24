import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const designSystemRoot = join(process.cwd(), "src/frontend/designSystem");
const expectedPrimaryNavLabels = ["Overview", "Tokens", "Canonical Renderings", "Canonicals"];

function walkHtmlFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walkHtmlFiles(path) : path.endsWith(".html") ? [path] : [];
  });
}

function readOuterTopNavLabels(source: string) {
  const headerMatch = source.match(/<header class="top-nav">[\s\S]*?<\/header>/);
  const primaryLinksMatch = headerMatch?.[0].match(/<div(?: id="[^"]+")? class="primary-nav-links">([\s\S]*?)<\/div>/);
  return Array.from(primaryLinksMatch?.[1].matchAll(/<a\b[^>]*>([^<]+)<\/a>/g) ?? []).map((match) => match[1].trim());
}

function readMobileTopNavLabels(source: string) {
  const mobileMenuMatch = source.match(/<nav id="mobile-nav-menu" class="mobile-nav-menu hidden" aria-label="Mobile primary">([\s\S]*?)<div class="mobile-profile-group">/);
  return Array.from(mobileMenuMatch?.[1].matchAll(/<a\b[^>]*>([^<]+)<\/a>/g) ?? []).map((match) => match[1].trim());
}

describe("design-system static shell fallback audit", () => {
  it("keeps first-paint outer top-nav labels aligned with the governed design-system navigation", () => {
    for (const path of walkHtmlFiles(designSystemRoot)) {
      const source = readFileSync(path, "utf8");
      if (!source.includes('<header class="top-nav"')) {
        continue;
      }

      const labels = readOuterTopNavLabels(source);
      expect(labels, relative(process.cwd(), path)).toEqual(expectedPrimaryNavLabels);
    }
  });

  it("keeps first-paint mobile primary links aligned when a static mobile menu is present", () => {
    for (const path of walkHtmlFiles(designSystemRoot)) {
      const source = readFileSync(path, "utf8");
      if (!source.includes('id="mobile-nav-menu"')) {
        continue;
      }

      const labels = readMobileTopNavLabels(source);
      expect(labels, relative(process.cwd(), path)).toEqual(expectedPrimaryNavLabels);
    }
  });
});
