import { expect, test } from "@playwright/test";

test.describe("design-system index card token", () => {
  test("renders the compact index card with stacked title and count copy", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 720 });
    await page.goto("/design-system/tokens/index-card");

    await expect(page.locator("[data-token-index-card]").first()).toBeVisible();
    await expect(page.locator("[data-token-index-card]").first()).toHaveClass(/token-container-sample/);
    await expect(page.locator("[data-token-index-card]").first()).toHaveClass(/token-container-section-sample/);
    await expect(page.locator("[data-token-index-card]").first()).toHaveClass(/token-paragraph-layout/);
    await expect(page.locator("[data-token-index-card]").first()).toHaveClass(/token-header-layout/);
    await expect(page.locator(".token-index-card-copy strong").first()).toHaveClass(/token-header-six/);
    await expect(page.locator(".token-index-card-copy span").first()).toHaveClass(/token-paragraph-main-minor/);

    const geometry = await page.locator("[data-token-index-card]").first().evaluate((card) => {
      if (!(card instanceof HTMLElement)) {
        return null;
      }

      const copy = card.querySelector(".token-index-card-copy");
      const label = card.querySelector(".token-index-card-copy strong");
      const count = card.querySelector(".token-index-card-copy span");

      if (!(copy instanceof HTMLElement) || !(label instanceof HTMLElement) || !(count instanceof HTMLElement)) {
        return null;
      }

      const cardBox = card.getBoundingClientRect();
      const copyBox = copy.getBoundingClientRect();
      const labelBox = label.getBoundingClientRect();
      const countBox = count.getBoundingClientRect();
      const cardStyle = getComputedStyle(card);
      const labelStyle = getComputedStyle(label);
      const countStyle = getComputedStyle(count);

      return {
        squareCorners: cardStyle.borderRadius === "0px",
        bordered: cardStyle.borderStyle === "solid" && Number.parseFloat(cardStyle.borderWidth) > 0,
        compactWidth: cardBox.width >= 240 && cardBox.width <= 246,
        compactHeight: cardBox.height >= 74 && cardBox.height <= 80,
        copyIsLeftAligned: Math.abs(copyBox.left - labelBox.left) < 1 && Math.abs(copyBox.left - countBox.left) < 1,
        labelAboveCount: labelBox.bottom <= countBox.top + 2,
        countInsideCard: countBox.right <= cardBox.right && countBox.bottom <= cardBox.bottom,
        usesTypographySeamSizes: labelStyle.fontSize === "14px" && countStyle.fontSize === "14px",
        usesTypographySeamWeights: labelStyle.fontWeight === "700" && countStyle.fontWeight === "600",
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.squareCorners).toBe(true);
    expect(geometry?.bordered).toBe(true);
    expect(geometry?.compactWidth).toBe(true);
    expect(geometry?.compactHeight).toBe(true);
    expect(geometry?.copyIsLeftAligned).toBe(true);
    expect(geometry?.labelAboveCount).toBe(true);
    expect(geometry?.countInsideCard).toBe(true);
    expect(geometry?.usesTypographySeamSizes).toBe(true);
    expect(geometry?.usesTypographySeamWeights).toBe(true);
  });

  test("renders hover, active, selected, disabled, warning, and error states without changing the card contract", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 900 });
    await page.goto("/design-system/tokens/index-card");

    await expect(page.locator("#index-card-states-title")).toBeVisible();

    const states = await page.evaluate(() => {
      const baseCard = document.querySelector(".token-index-card-preview-grid [data-token-index-card]");
      const hover = document.querySelector('[data-token-index-card-state="hover"]');
      const active = document.querySelector('[data-token-index-card-state="active"]');
      const selected = document.querySelector('[data-token-index-card-state="selected"]');
      const disabled = document.querySelector('[data-token-index-card-state="disabled"]');
      const warning = document.querySelector('[data-token-index-card-state="warning"]');
      const error = document.querySelector('[data-token-index-card-state="error"]');

      const allCards = [baseCard, hover, active, selected, disabled, warning, error];
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
          cursor: style.cursor,
          opacity: style.opacity,
          disabled: card.disabled,
          ariaDisabled: card.getAttribute("aria-disabled"),
          ariaPressed: card.getAttribute("aria-pressed"),
          active: card.getAttribute("data-token-index-card-active"),
          containerVariant: card.getAttribute("data-container-variant"),
        };
      };

      const [baseState, hoverState, activeState, selectedState, disabledState, warningState, errorState] = allCards.map(readCard);
      const sameCompactShape = [hoverState, activeState, selectedState, disabledState, warningState, errorState].every((state) => {
        return Math.abs(state.width - baseState.width) < 1 && Math.abs(state.height - baseState.height) < 1;
      });
      const distinctStateStyling = new Set([
        activeState.borderColor,
        selectedState.borderColor,
        warningState.borderColor,
        errorState.borderColor,
      ]).size >= 3;

      return {
        sameCompactShape,
        hoverDiffersFromBase: hoverState.borderColor !== baseState.borderColor,
        activeMarked: activeState.active === "true",
        selectedPressed: selectedState.ariaPressed === "true",
        selectedHasSubtleShade: selectedState.backgroundColor !== baseState.backgroundColor,
        disabledNative: disabledState.disabled && disabledState.ariaDisabled === "true" && disabledState.cursor === "not-allowed",
        disabledMuted: Number.parseFloat(disabledState.opacity) < 1,
        warningDiffersFromBase: warningState.backgroundColor !== baseState.backgroundColor,
        errorDiffersFromBase: errorState.backgroundColor !== baseState.backgroundColor,
        warningUsesContainerVariant: warningState.containerVariant === "warning",
        errorUsesContainerVariant: errorState.containerVariant === "error",
        distinctStateStyling,
      };
    });

    expect(states).not.toBeNull();
    expect(states?.sameCompactShape).toBe(true);
    expect(states?.hoverDiffersFromBase).toBe(true);
    expect(states?.activeMarked).toBe(true);
    expect(states?.selectedPressed).toBe(true);
    expect(states?.selectedHasSubtleShade).toBe(true);
    expect(states?.disabledNative).toBe(true);
    expect(states?.disabledMuted).toBe(true);
    expect(states?.warningDiffersFromBase).toBe(true);
    expect(states?.errorDiffersFromBase).toBe(true);
    expect(states?.warningUsesContainerVariant).toBe(true);
    expect(states?.errorUsesContainerVariant).toBe(true);
    expect(states?.distinctStateStyling).toBe(true);
  });

  test("keeps theme, overflow, RTL, zoom, mobile, and tooltip states honest", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 900 });
    await page.goto("/design-system/tokens/index-card");

    await expect(page.locator("#index-card-overflow-title")).toBeVisible();
    await expect(page.locator("#index-card-rtl-title")).toBeVisible();
    await expect(page.locator("#index-card-zoom-title")).toBeVisible();
    await expect(page.locator("#index-card-mobile-title")).toBeVisible();

    const rowGeometry = await page.evaluate(() => {
      const overflowCard = document.querySelector(".token-index-card-control-constrained");
      const overflowLabel = overflowCard?.querySelector(".token-index-card-copy strong");
      const overflowCount = overflowCard?.querySelector(".token-index-card-copy span");
      const rtlCard = document.querySelector("[data-token-index-card-rtl]");
      const rtlLabel = rtlCard?.querySelector(".token-index-card-copy strong");
      const zoomSmall = document.querySelector('[data-token-index-card-zoom="-50"] [data-token-index-card]');
      const zoomBase = document.querySelector('[data-token-index-card-zoom="0"] [data-token-index-card]');
      const zoomLarge = document.querySelector('[data-token-index-card-zoom="100"] [data-token-index-card]');
      const mobileFrame = document.querySelector(".token-index-card-mobile-frame");
      const mobileCard = document.querySelector("[data-token-index-card-mobile]");

      if (
        !(overflowCard instanceof HTMLElement)
        || !(overflowLabel instanceof HTMLElement)
        || !(overflowCount instanceof HTMLElement)
        || !(rtlCard instanceof HTMLElement)
        || !(rtlLabel instanceof HTMLElement)
        || !(zoomSmall instanceof HTMLElement)
        || !(zoomBase instanceof HTMLElement)
        || !(zoomLarge instanceof HTMLElement)
        || !(mobileFrame instanceof HTMLElement)
        || !(mobileCard instanceof HTMLElement)
      ) {
        return null;
      }

      const overflowCardBox = overflowCard.getBoundingClientRect();
      const overflowLabelStyle = getComputedStyle(overflowLabel);
      const overflowCountStyle = getComputedStyle(overflowCount);
      const rtlCardBox = rtlCard.getBoundingClientRect();
      const rtlLabelBox = rtlLabel.getBoundingClientRect();
      const rtlCardStyle = getComputedStyle(rtlCard);
      const rtlLabelStyle = getComputedStyle(rtlLabel);
      const zoomSmallBox = zoomSmall.getBoundingClientRect();
      const zoomBaseBox = zoomBase.getBoundingClientRect();
      const zoomLargeBox = zoomLarge.getBoundingClientRect();
      const mobileFrameBox = mobileFrame.getBoundingClientRect();
      const mobileCardBox = mobileCard.getBoundingClientRect();

      return {
        overflowCardConstrained: overflowCardBox.width <= 242,
        overflowLabelClipped: overflowLabel.scrollWidth > overflowLabel.clientWidth,
        overflowCountClipped: overflowCount.scrollWidth > overflowCount.clientWidth,
        overflowUsesEllipsis: overflowLabelStyle.textOverflow === "ellipsis" && overflowCountStyle.textOverflow === "ellipsis",
        overflowTooltipReady: Boolean(overflowCard.dataset.tooltip && overflowLabel.dataset.tooltip && overflowCount.dataset.tooltip),
        rtlStartAlignment: rtlCardStyle.direction === "rtl"
          && rtlLabelStyle.textAlign === "start"
          && rtlLabelBox.left >= rtlCardBox.left
          && rtlLabelBox.right <= rtlCardBox.right,
        zoomOrder: zoomSmallBox.width < zoomBaseBox.width && zoomBaseBox.width < zoomLargeBox.width,
        mobileFrameWidth: mobileFrameBox.width <= 322,
        mobileCardFillsFrame: Math.abs(mobileCardBox.width - (mobileFrameBox.width - 24)) < 4,
      };
    });

    expect(rowGeometry).not.toBeNull();
    expect(rowGeometry?.overflowCardConstrained).toBe(true);
    expect(rowGeometry?.overflowLabelClipped).toBe(true);
    expect(rowGeometry?.overflowCountClipped).toBe(true);
    expect(rowGeometry?.overflowUsesEllipsis).toBe(true);
    expect(rowGeometry?.overflowTooltipReady).toBe(true);
    expect(rowGeometry?.rtlStartAlignment).toBe(true);
    expect(rowGeometry?.zoomOrder).toBe(true);
    expect(rowGeometry?.mobileFrameWidth).toBe(true);
    expect(rowGeometry?.mobileCardFillsFrame).toBe(true);

    const overflowLabel = page.locator(".token-index-card-control-constrained .token-index-card-copy strong");
    await overflowLabel.hover();

    const tooltip = page.locator("#shared-floating-tooltip");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText("Historical details and supporting records");
  });
});
