import { describe, expect, it } from "vitest";

import { hydrateButtonCards, renderButtonCard } from "../../../src/frontend/designSystem/assets/buttonCard.mjs";

describe("ButtonCard design-system seam", () => {
  it("renders the reusable button-card structure with owned semantics", () => {
    const html = renderButtonCard({
      label: "Details",
      icon: "details",
      state: "selected",
      ariaLabel: "Open details",
      labelTooltip: "Details",
    });

    expect(html).toContain('class="token-container-sample token-container-section-sample token-button-card-control');
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Open details"');
    expect(html).toContain('data-token-button-card-state="selected"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('data-token-button-card-icon="details"');
    expect(html).toContain('class="token-button-card-icon-circle"');
    expect(html).toContain('class="token-paragraph-preview token-paragraph-label"');
    expect(html).toContain("Details");
    expect(html).not.toContain("token-header-preview token-header-six");
    expect(html).not.toContain("data-token-index-card");
  });

  it("hydrates declared mounts through the public data-attribute API", () => {
    const previousHTMLElement = globalThis.HTMLElement;
    class FakeElement {}
    Object.defineProperty(globalThis, "HTMLElement", {
      configurable: true,
      value: FakeElement,
    });

    try {
      const mount = new FakeElement() as HTMLElement & {
        dataset: Record<string, string>;
        outerHTML: string;
      };
      mount.dataset = {
        tokenButtonCardLabel: "Files",
        tokenButtonCardIcon: "files",
        tokenButtonCardState: "disabled",
        tokenButtonCardAriaLabel: "Open files",
        tokenButtonCardLabelTooltip: "Files",
      };
      mount.outerHTML = "";

      hydrateButtonCards({
        querySelectorAll: () => [mount],
      } as unknown as Document);

      expect(mount.outerHTML).toContain('aria-label="Open files"');
      expect(mount.outerHTML).toContain('data-token-button-card-state="disabled"');
      expect(mount.outerHTML).toContain("disabled aria-disabled");
      expect(mount.outerHTML).toContain('data-token-button-card-icon="files"');
      expect(mount.outerHTML).toContain('data-tooltip="Files"');
      expect(mount.outerHTML).toContain("token-paragraph-preview token-paragraph-label");
    } finally {
      Object.defineProperty(globalThis, "HTMLElement", {
        configurable: true,
        value: previousHTMLElement,
      });
    }
  });
});
