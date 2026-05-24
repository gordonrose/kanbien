import { expect, test } from "@playwright/test";

test.describe("design-system count card token", () => {
  test("renders the compact count card with a fixed count slot", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 720 });
    await page.goto("/design-system/tokens/count-card");

    await expect(page.locator("[data-token-filter-card]").first()).toBeVisible();
    await expect(page.locator("[data-token-filter-card]").first()).toHaveClass(/token-paragraph-layout/);
    await expect(page.locator("[data-token-filter-card]").first()).toHaveClass(/token-header-layout/);
    await expect(page.locator(".token-filter-card-copy strong").first()).toHaveClass(/token-header-six/);
    await expect(page.locator(".token-filter-card-copy span").first()).toHaveClass(/token-paragraph-main-minor/);
    await expect(page.locator(".token-filter-card-count").first()).toHaveClass(/token-paragraph-main/);

    const geometry = await page.locator("[data-token-filter-card]").first().evaluate((card) => {
      if (!(card instanceof HTMLElement)) {
        return null;
      }

      const copy = card.querySelector(".token-filter-card-copy");
      const label = card.querySelector(".token-filter-card-copy strong");
      const helper = card.querySelector(".token-filter-card-copy span");
      const count = card.querySelector(".token-filter-card-count");

      if (
        !(copy instanceof HTMLElement)
        || !(label instanceof HTMLElement)
        || !(helper instanceof HTMLElement)
        || !(count instanceof HTMLElement)
      ) {
        return null;
      }

      const cardBox = card.getBoundingClientRect();
      const copyBox = copy.getBoundingClientRect();
      const labelBox = label.getBoundingClientRect();
      const helperBox = helper.getBoundingClientRect();
      const countBox = count.getBoundingClientRect();
      const cardStyle = getComputedStyle(card);
      const countStyle = getComputedStyle(count);
      const labelStyle = getComputedStyle(label);
      const helperStyle = getComputedStyle(helper);

      return {
        squareCorners: cardStyle.borderRadius === "0px" && countStyle.borderRadius === "0px",
        bordered: cardStyle.borderStyle === "solid" && Number.parseFloat(cardStyle.borderWidth) > 0,
        countContainerBordered: countStyle.borderStyle === "solid" && Number.parseFloat(countStyle.borderWidth) > 0,
        countContainerUsesGridCentering: countStyle.display === "grid" && countStyle.placeItems === "center",
        cardIsWideEnough: cardBox.width >= 250,
        countIsSquare: Math.abs(countBox.width - countBox.height) < 1,
        countSizeIsFixed: Math.abs(countBox.width - 36) < 2,
        countIsInlineEnd: countBox.right <= cardBox.right - 10 && countBox.left > copyBox.right,
        copyIsLeftAligned: Math.abs(copyBox.left - labelBox.left) < 1 && Math.abs(copyBox.left - helperBox.left) < 1,
        labelAboveHelper: labelBox.bottom <= helperBox.top + 2,
        verticalCentersMatch: Math.abs((copyBox.top + copyBox.height / 2) - (countBox.top + countBox.height / 2)) < 3,
        usesTypographySeamSizes: labelStyle.fontSize === "14px" && helperStyle.fontSize === "14px" && countStyle.fontSize === "16px",
        usesTypographySeamWeights: labelStyle.fontWeight === "700" && helperStyle.fontWeight === "600" && countStyle.fontWeight === "600",
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.squareCorners).toBe(true);
    expect(geometry?.bordered).toBe(true);
    expect(geometry?.countContainerBordered).toBe(true);
    expect(geometry?.countContainerUsesGridCentering).toBe(true);
    expect(geometry?.cardIsWideEnough).toBe(true);
    expect(geometry?.countIsSquare).toBe(true);
    expect(geometry?.countSizeIsFixed).toBe(true);
    expect(geometry?.countIsInlineEnd).toBe(true);
    expect(geometry?.copyIsLeftAligned).toBe(true);
    expect(geometry?.labelAboveHelper).toBe(true);
    expect(geometry?.verticalCentersMatch).toBe(true);
    expect(geometry?.usesTypographySeamSizes).toBe(true);
    expect(geometry?.usesTypographySeamWeights).toBe(true);
  });

  test("keeps theme variants visible and readable at high magnification", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/design-system/tokens/count-card?theme=dark&dir=rtl&zoom=100");

    const cards = page.locator(".token-filter-card-preview-grid [data-token-filter-card]");
    await expect(cards).toHaveCount(3);

    const readable = await cards.evaluateAll((cardNodes) => {
      return cardNodes.every((card) => {
        if (!(card instanceof HTMLElement)) {
          return false;
        }
        const box = card.getBoundingClientRect();
        const label = card.querySelector(".token-filter-card-copy strong");
        const helper = card.querySelector(".token-filter-card-copy span");
        const count = card.querySelector(".token-filter-card-count");
        if (!(label instanceof HTMLElement) || !(helper instanceof HTMLElement) || !(count instanceof HTMLElement)) {
          return false;
        }
        const labelBox = label.getBoundingClientRect();
        const helperBox = helper.getBoundingClientRect();
        const countBox = count.getBoundingClientRect();
        const copyRight = Math.max(labelBox.right, helperBox.right);
        const copyLeft = Math.min(labelBox.left, helperBox.left);
        return box.width > 0
          && box.right <= window.innerWidth + 1
          && labelBox.left >= box.left
          && helperBox.left >= box.left
          && labelBox.right <= box.right
          && helperBox.right <= box.right
          && countBox.left >= box.left
          && countBox.right <= box.right
          && (countBox.right <= copyLeft || countBox.left >= copyRight);
      });
    });

    expect(readable).toBe(true);
  });

  test("renders hover, selected, disabled, warning, and error states without changing geometry", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 900 });
    await page.goto("/design-system/tokens/count-card");

    await expect(page.locator("#count-card-states-title")).toBeVisible();

    const states = await page.evaluate(() => {
      const hover = document.querySelector('[data-token-filter-card-state="hover"]');
      const selected = document.querySelector('[data-token-filter-card-state="selected"]');
      const disabled = document.querySelector('[data-token-filter-card-state="disabled"]');
      const warning = document.querySelector('[data-token-filter-card-state="warning"]');
      const error = document.querySelector('[data-token-filter-card-state="error"]');
      const allCards = [hover, selected, disabled, warning, error];

      if (!allCards.every((card) => card instanceof HTMLButtonElement)) {
        return null;
      }

      const readCard = (card: HTMLButtonElement) => {
        const box = card.getBoundingClientRect();
        const style = getComputedStyle(card);
        return {
          width: box.width,
          height: box.height,
          borderColor: style.borderColor,
          backgroundColor: style.backgroundColor,
          boxShadow: style.boxShadow,
          cursor: style.cursor,
          opacity: style.opacity,
          disabled: card.disabled,
          ariaDisabled: card.getAttribute("aria-disabled"),
          ariaPressed: card.getAttribute("aria-pressed"),
          hoverMarked: card.getAttribute("data-token-filter-card-hover"),
        };
      };

      const [hoverState, selectedState, disabledState, warningState, errorState] = allCards.map(readCard);
      const sameGeometry = [selectedState, disabledState, warningState, errorState].every((state) => {
        return Math.abs(state.width - hoverState.width) < 1 && Math.abs(state.height - hoverState.height) < 1;
      });

      return {
        sameGeometry,
        hoverMarked: hoverState.hoverMarked === "true" && hoverState.boxShadow !== "none",
        selectedPressed: selectedState.ariaPressed === "true",
        disabledNative: disabledState.disabled && disabledState.ariaDisabled === "true" && disabledState.cursor === "not-allowed",
        disabledMuted: Number.parseFloat(disabledState.opacity) < 1,
        warningDiffersFromSelected: warningState.backgroundColor !== selectedState.backgroundColor,
        errorDiffersFromWarning: errorState.backgroundColor !== warningState.backgroundColor,
        warningErrorHaveDistinctBorders: warningState.borderColor !== errorState.borderColor,
      };
    });

    expect(states).not.toBeNull();
    expect(states?.sameGeometry).toBe(true);
    expect(states?.hoverMarked).toBe(true);
    expect(states?.selectedPressed).toBe(true);
    expect(states?.disabledNative).toBe(true);
    expect(states?.disabledMuted).toBe(true);
    expect(states?.warningDiffersFromSelected).toBe(true);
    expect(states?.errorDiffersFromWarning).toBe(true);
    expect(states?.warningErrorHaveDistinctBorders).toBe(true);
  });

  test("renders overflow, RTL, zoom, and mobile review rows", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 900 });
    await page.goto("/design-system/tokens/count-card");

    await expect(page.locator("#filter-card-overflow-title")).toBeVisible();
    await expect(page.locator("#filter-card-rtl-title")).toBeVisible();
    await expect(page.locator("#filter-card-zoom-title")).toBeVisible();
    await expect(page.locator("#filter-card-mobile-title")).toBeVisible();

    const rowGeometry = await page.evaluate(() => {
      const overflowCard = document.querySelector(".token-filter-card-control-constrained");
      const overflowLabel = overflowCard?.querySelector(".token-filter-card-copy strong");
      const overflowHelper = overflowCard?.querySelector(".token-filter-card-copy span");
      const rtlCard = document.querySelector("[data-token-filter-card-rtl]");
      const rtlCount = rtlCard?.querySelector(".token-filter-card-count");
      const zoomSmall = document.querySelector('[data-token-filter-card-zoom="-50"] [data-token-filter-card]');
      const zoomBase = document.querySelector('[data-token-filter-card-zoom="0"] [data-token-filter-card]');
      const zoomLarge = document.querySelector('[data-token-filter-card-zoom="100"] [data-token-filter-card]');
      const mobileFrame = document.querySelector(".token-filter-card-mobile-frame");
      const mobileCard = document.querySelector("[data-token-filter-card-mobile]");

      if (
        !(overflowCard instanceof HTMLElement)
        || !(overflowLabel instanceof HTMLElement)
        || !(overflowHelper instanceof HTMLElement)
        || !(rtlCard instanceof HTMLElement)
        || !(rtlCount instanceof HTMLElement)
        || !(zoomSmall instanceof HTMLElement)
        || !(zoomBase instanceof HTMLElement)
        || !(zoomLarge instanceof HTMLElement)
        || !(mobileFrame instanceof HTMLElement)
        || !(mobileCard instanceof HTMLElement)
      ) {
        return null;
      }

      const overflowCardBox = overflowCard.getBoundingClientRect();
      const overflowLabelBox = overflowLabel.getBoundingClientRect();
      const overflowHelperBox = overflowHelper.getBoundingClientRect();
      const overflowLabelStyle = getComputedStyle(overflowLabel);
      const overflowHelperStyle = getComputedStyle(overflowHelper);
      const rtlCardBox = rtlCard.getBoundingClientRect();
      const rtlCountBox = rtlCount.getBoundingClientRect();
      const zoomSmallBox = zoomSmall.getBoundingClientRect();
      const zoomBaseBox = zoomBase.getBoundingClientRect();
      const zoomLargeBox = zoomLarge.getBoundingClientRect();
      const mobileFrameBox = mobileFrame.getBoundingClientRect();
      const mobileCardBox = mobileCard.getBoundingClientRect();

      return {
        overflowCardConstrained: overflowCardBox.width <= 242,
        overflowLabelClipped: overflowLabel.scrollWidth > overflowLabel.clientWidth,
        overflowHelperClipped: overflowHelper.scrollWidth > overflowHelper.clientWidth,
        overflowUsesEllipsis: overflowLabelStyle.textOverflow === "ellipsis" && overflowHelperStyle.textOverflow === "ellipsis",
        overflowTooltipReady: Boolean(overflowCard.dataset.tooltip && overflowLabel.dataset.tooltip && overflowHelper.dataset.tooltip),
        overflowTextInsideCard: overflowLabelBox.right <= overflowCardBox.right && overflowHelperBox.right <= overflowCardBox.right,
        rtlCountAtInlineStart: rtlCountBox.left >= rtlCardBox.left && rtlCountBox.right < rtlCardBox.left + rtlCardBox.width / 2,
        zoomOrder: zoomSmallBox.width < zoomBaseBox.width && zoomBaseBox.width < zoomLargeBox.width,
        mobileFrameWidth: mobileFrameBox.width <= 322,
        mobileCardFillsFrame: Math.abs(mobileCardBox.width - (mobileFrameBox.width - 24)) < 4,
      };
    });

    expect(rowGeometry).not.toBeNull();
    expect(rowGeometry?.overflowCardConstrained).toBe(true);
    expect(rowGeometry?.overflowLabelClipped).toBe(true);
    expect(rowGeometry?.overflowHelperClipped).toBe(true);
    expect(rowGeometry?.overflowUsesEllipsis).toBe(true);
    expect(rowGeometry?.overflowTooltipReady).toBe(true);
    expect(rowGeometry?.overflowTextInsideCard).toBe(true);
    expect(rowGeometry?.rtlCountAtInlineStart).toBe(true);
    expect(rowGeometry?.zoomOrder).toBe(true);
    expect(rowGeometry?.mobileFrameWidth).toBe(true);
    expect(rowGeometry?.mobileCardFillsFrame).toBe(true);
  });

  test("shows the shared tooltip layer for overflowing count-card text", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 720 });
    await page.goto("/design-system/tokens/count-card");

    const overflowLabel = page.locator(".token-filter-card-control-constrained .token-filter-card-copy strong");
    await expect(overflowLabel).toHaveAttribute("data-tooltip", "Very long organization ownership group");

    await overflowLabel.hover();

    const tooltip = page.locator("#shared-floating-tooltip");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveAttribute("aria-hidden", "false");
    await expect(tooltip).toContainText("Very long organization ownership group");

    const tooltipBox = await tooltip.boundingBox();
    expect(tooltipBox).not.toBeNull();
    expect(tooltipBox!.x).toBeGreaterThanOrEqual(0);
    expect(tooltipBox!.y).toBeGreaterThanOrEqual(0);
    expect(tooltipBox!.x + tooltipBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(tooltipBox!.y + tooltipBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  });
});
