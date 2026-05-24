import { expect, test } from "@playwright/test";

test.describe("design-system list card token", () => {
  test("renders the record-management list row anatomy", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 720 });
    await page.goto("/design-system/tokens/list-card");

    const first = page.locator("[data-token-list-card]").first();
    await expect(first).toBeVisible();
    await expect(first.locator(".token-list-card-copy strong")).toHaveText("Northstar Operations");
    await expect(first.locator(".token-list-card-copy span")).toHaveText("Operations");
    await expect(first.locator(".token-list-card-status")).toHaveText("Ready");

    const geometry = await first.evaluate((card) => {
      if (!(card instanceof HTMLElement)) {
        return null;
      }

      const copy = card.querySelector(".token-list-card-copy");
      const title = card.querySelector(".token-list-card-copy strong");
      const subtitle = card.querySelector(".token-list-card-copy span");
      const status = card.querySelector(".token-list-card-status");
      if (!(copy instanceof HTMLElement) || !(title instanceof HTMLElement) || !(subtitle instanceof HTMLElement) || !(status instanceof HTMLElement)) {
        return null;
      }

      const cardBox = card.getBoundingClientRect();
      const copyBox = copy.getBoundingClientRect();
      const titleBox = title.getBoundingClientRect();
      const subtitleBox = subtitle.getBoundingClientRect();
      const statusBox = status.getBoundingClientRect();
      const cardStyle = getComputedStyle(card);
      const titleStyle = getComputedStyle(title);
      const subtitleStyle = getComputedStyle(subtitle);
      const statusStyle = getComputedStyle(status);

      return {
        fullWidthRow: cardBox.width > 480,
        hasTemplateRadius: Number.parseFloat(cardStyle.borderRadius) > 0 && Number.parseFloat(cardStyle.borderRadius) <= 8,
        bordered: cardStyle.borderStyle === "solid" && Number.parseFloat(cardStyle.borderWidth) > 0,
        selectedTint: card.getAttribute("data-token-list-card-state") === "selected" && cardStyle.backgroundColor !== "rgb(255, 255, 255)",
        copyIsLeftAligned: Math.abs(copyBox.left - titleBox.left) < 1 && Math.abs(copyBox.left - subtitleBox.left) < 1,
        titleAboveSubtitle: titleBox.bottom <= subtitleBox.top + 4,
        statusAtInlineEnd: statusBox.left > copyBox.right && statusBox.right <= cardBox.right - 10,
        verticalCentersMatch: Math.abs((copyBox.top + copyBox.height / 2) - (statusBox.top + statusBox.height / 2)) < 6,
        usesTypographySeamClasses: title.classList.contains("token-header-preview")
          && title.classList.contains("token-header-six")
          && subtitle.classList.contains("token-paragraph-preview")
          && subtitle.classList.contains("token-paragraph-main-minor")
          && status.classList.contains("token-paragraph-preview")
          && status.classList.contains("token-paragraph-main-minor"),
        usesTypographySeamWeights: titleStyle.fontWeight === "700" && subtitleStyle.fontWeight === "600" && statusStyle.fontWeight === "600",
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.fullWidthRow).toBe(true);
    expect(geometry?.hasTemplateRadius).toBe(true);
    expect(geometry?.bordered).toBe(true);
    expect(geometry?.selectedTint).toBe(true);
    expect(geometry?.copyIsLeftAligned).toBe(true);
    expect(geometry?.titleAboveSubtitle).toBe(true);
    expect(geometry?.statusAtInlineEnd).toBe(true);
    expect(geometry?.verticalCentersMatch).toBe(true);
    expect(geometry?.usesTypographySeamClasses).toBe(true);
    expect(geometry?.usesTypographySeamWeights).toBe(true);
  });

  test("keeps states, overflow, RTL, mobile, and tooltip states honest", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 900 });
    await page.goto("/design-system/tokens/list-card");

    await expect(page.locator("#list-card-states-title")).toBeVisible();
    await expect(page.locator("#list-card-overflow-title")).toBeVisible();
    await expect(page.locator("#list-card-rtl-title")).toBeVisible();
    await expect(page.locator("#list-card-mobile-title")).toBeVisible();

    const stateGeometry = await page.evaluate(() => {
      const base = document.querySelector(".token-list-card-list [data-token-list-card]:not([data-token-list-card-state])");
      const hover = document.querySelector('.token-list-card-state-grid [data-token-list-card-state="hover"]');
      const selected = document.querySelector('.token-list-card-state-grid [data-token-list-card-state="selected"]');
      const disabled = document.querySelector('.token-list-card-state-grid [data-token-list-card-state="disabled"]');
      const warning = document.querySelector('.token-list-card-state-grid [data-token-list-card-state="warning"]');
      const error = document.querySelector('.token-list-card-state-grid [data-token-list-card-state="error"]');
      const overflow = document.querySelector(".token-list-card-control-constrained");
      const overflowTitle = overflow?.querySelector(".token-list-card-copy strong");
      const overflowSubtitle = overflow?.querySelector(".token-list-card-copy span");
      const overflowStatus = overflow?.querySelector(".token-list-card-status");
      const rtlCard = document.querySelector("[data-token-list-card-rtl]");
      const rtlStatus = rtlCard?.querySelector(".token-list-card-status");
      const mobileFrame = document.querySelector(".token-list-card-mobile-frame");
      const mobileCard = document.querySelector("[data-token-list-card-mobile]");

      const cards = [base, hover, selected, disabled, warning, error];
      const stateCards = [hover, selected, disabled, warning, error];
      if (
        !cards.every((card) => card instanceof HTMLButtonElement)
        || !(overflow instanceof HTMLElement)
        || !(overflowTitle instanceof HTMLElement)
        || !(overflowSubtitle instanceof HTMLElement)
        || !(overflowStatus instanceof HTMLElement)
        || !(rtlCard instanceof HTMLElement)
        || !(rtlStatus instanceof HTMLElement)
        || !(mobileFrame instanceof HTMLElement)
        || !(mobileCard instanceof HTMLElement)
      ) {
        return null;
      }

      const buttonCards = cards as HTMLButtonElement[];
      const stateButtonCards = stateCards as HTMLButtonElement[];
      const read = (node: HTMLButtonElement) => {
        const box = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          width: box.width,
          height: box.height,
          borderColor: style.borderColor,
          backgroundColor: style.backgroundColor,
          disabled: node.disabled,
          ariaDisabled: node.getAttribute("aria-disabled"),
          ariaPressed: node.getAttribute("aria-pressed"),
          cursor: style.cursor,
          opacity: style.opacity,
        };
      };

      const [baseState, hoverState, selectedState, disabledState, warningState, errorState] = buttonCards.map(read);
      const [stateShapeBase, ...stateShapeComparisons] = stateButtonCards.map(read);
      const sameShape = stateShapeComparisons.every((state) => {
        return Math.abs(state.width - stateShapeBase.width) < 1 && Math.abs(state.height - stateShapeBase.height) < 1;
      });
      const rtlCardBox = rtlCard.getBoundingClientRect();
      const rtlStatusBox = rtlStatus.getBoundingClientRect();
      const rtlCardStyle = getComputedStyle(rtlCard);
      const mobileFrameBox = mobileFrame.getBoundingClientRect();
      const mobileCardBox = mobileCard.getBoundingClientRect();
      const resolveTokenColour = (property: "backgroundColor" | "borderColor", value: string) => {
        const probe = document.createElement("span");
        probe.style[property] = value;
        document.body.append(probe);
        const colour = getComputedStyle(probe)[property];
        probe.remove();
        return colour;
      };
      const successBackground = resolveTokenColour("backgroundColor", "var(--colour-success-10)");
      const successBorder = resolveTokenColour("borderColor", "var(--colour-success-100)");

      return {
        sameShape,
        hoverDiffersFromBase: hoverState.borderColor !== baseState.borderColor,
        hoverAvoidsSuccessBorder: hoverState.borderColor !== successBorder,
        selectedPressed: selectedState.ariaPressed === "true",
        selectedTint: selectedState.backgroundColor !== baseState.backgroundColor,
        selectedAvoidsSuccessFill: selectedState.backgroundColor !== successBackground,
        disabledNative: disabledState.disabled && disabledState.ariaDisabled === "true" && disabledState.cursor === "not-allowed",
        disabledMuted: Number.parseFloat(disabledState.opacity) < 1,
        warningDiffersFromBase: warningState.backgroundColor !== baseState.backgroundColor,
        errorDiffersFromBase: errorState.backgroundColor !== baseState.backgroundColor,
        overflowTitleClipped: overflowTitle.scrollWidth > overflowTitle.clientWidth,
        overflowSubtitleClipped: overflowSubtitle.scrollWidth > overflowSubtitle.clientWidth,
        overflowStatusClipped: overflowStatus.scrollWidth > overflowStatus.clientWidth,
        tooltipReady: Boolean(overflowTitle.dataset.tooltip && overflowSubtitle.dataset.tooltip && overflowStatus.dataset.tooltip),
        rtlStatusAtInlineEnd: rtlCardStyle.direction === "rtl"
          && rtlStatusBox.left >= rtlCardBox.left + 10
          && rtlStatusBox.right < rtlCardBox.right,
        mobileCardFillsFrame: Math.abs(mobileCardBox.width - (mobileFrameBox.width - 24)) < 4,
      };
    });

    expect(stateGeometry).not.toBeNull();
    expect(stateGeometry?.sameShape).toBe(true);
    expect(stateGeometry?.hoverDiffersFromBase).toBe(true);
    expect(stateGeometry?.hoverAvoidsSuccessBorder).toBe(true);
    expect(stateGeometry?.selectedPressed).toBe(true);
    expect(stateGeometry?.selectedTint).toBe(true);
    expect(stateGeometry?.selectedAvoidsSuccessFill).toBe(true);
    expect(stateGeometry?.disabledNative).toBe(true);
    expect(stateGeometry?.disabledMuted).toBe(true);
    expect(stateGeometry?.warningDiffersFromBase).toBe(true);
    expect(stateGeometry?.errorDiffersFromBase).toBe(true);
    expect(stateGeometry?.overflowTitleClipped).toBe(true);
    expect(stateGeometry?.overflowSubtitleClipped).toBe(true);
    expect(stateGeometry?.overflowStatusClipped).toBe(true);
    expect(stateGeometry?.tooltipReady).toBe(true);
    expect(stateGeometry?.rtlStatusAtInlineEnd).toBe(true);
    expect(stateGeometry?.mobileCardFillsFrame).toBe(true);

    const overflowTitle = page.locator(".token-list-card-control-constrained .token-list-card-copy strong");
    await overflowTitle.hover();
    const tooltip = page.locator("#shared-floating-tooltip");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText("Northstar Operations and Regional Support");
  });

  test("locks normal, dark, and desert theme previews", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 1000 });
    await page.goto("/design-system/tokens/list-card");

    const themes = await page.evaluate(() => {
      const normal = document.querySelector('[data-token-list-card-theme="normal"]');
      const dark = document.querySelector('[data-token-list-card-theme="dark"]');
      const desert = document.querySelector('[data-token-list-card-theme="desert"]');
      const samples = [normal, dark, desert];

      if (!samples.every((sample) => sample instanceof HTMLElement)) {
        return null;
      }

      const readTheme = (sample: HTMLElement) => {
        const selected = sample.querySelector('[data-token-list-card-state="selected"]');
        const neutral = sample.querySelector('[data-token-list-card]:not([data-token-list-card-state])');
        const title = sample.querySelector(".token-list-card-copy strong");
        const status = sample.querySelector(".token-list-card-status");

        if (
          !(selected instanceof HTMLElement)
          || !(neutral instanceof HTMLElement)
          || !(title instanceof HTMLElement)
          || !(status instanceof HTMLElement)
        ) {
          return null;
        }

        const sampleStyle = getComputedStyle(sample);
        const selectedStyle = getComputedStyle(selected);
        const neutralStyle = getComputedStyle(neutral);
        const titleStyle = getComputedStyle(title);
        const statusStyle = getComputedStyle(status);

        return {
          scope: sample.getAttribute("data-theme-scope") || "normal",
          sampleBackground: sampleStyle.backgroundColor,
          selectedBackground: selectedStyle.backgroundColor,
          neutralBackground: neutralStyle.backgroundColor,
          titleColor: titleStyle.color,
          statusColor: statusStyle.color,
          selectedTintDiffers: selectedStyle.backgroundColor !== neutralStyle.backgroundColor,
        };
      };

      const [normalTheme, darkTheme, desertTheme] = samples.map(readTheme);
      if (!normalTheme || !darkTheme || !desertTheme) {
        return null;
      }

      return {
        scopes: [normalTheme.scope, darkTheme.scope, desertTheme.scope],
        themeBackgroundsDiffer: new Set([
          normalTheme.sampleBackground,
          darkTheme.sampleBackground,
          desertTheme.sampleBackground,
        ]).size === 3,
        selectedTintInEveryTheme: [normalTheme, darkTheme, desertTheme].every((theme) => theme.selectedTintDiffers),
        darkInkDiffersFromNormal: darkTheme.titleColor !== normalTheme.titleColor
          && darkTheme.statusColor !== normalTheme.statusColor,
        desertDiffersFromNormal: desertTheme.sampleBackground !== normalTheme.sampleBackground
          && desertTheme.neutralBackground !== normalTheme.neutralBackground,
      };
    });

    expect(themes).not.toBeNull();
    expect(themes?.scopes).toEqual(["normal", "dark", "desert"]);
    expect(themes?.themeBackgroundsDiffer).toBe(true);
    expect(themes?.selectedTintInEveryTheme).toBe(true);
    expect(themes?.darkInkDiffersFromNormal).toBe(true);
    expect(themes?.desertDiffersFromNormal).toBe(true);
  });
});
