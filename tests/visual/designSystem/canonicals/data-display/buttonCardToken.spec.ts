import { expect, test } from "@playwright/test";

test.describe("design-system button card token", () => {
  test("renders the compact button card with centered icon circle and label", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 720 });
    await page.goto("/design-system/tokens/button-card");

    await expect(page.locator("[data-token-button-card]").first()).toBeVisible();
    await expect(page.locator("[data-token-button-card]").first()).toHaveClass(/token-container-sample/);
    await expect(page.locator("[data-token-button-card]").first()).toHaveClass(/token-container-section-sample/);
    await expect(page.locator("[data-token-button-card]").first()).toHaveClass(/token-paragraph-layout/);
    await expect(page.locator("[data-token-button-card]").first()).toHaveClass(/token-header-layout/);
    await expect(page.locator(".token-button-card-copy span.token-paragraph-label").first()).toHaveClass(/token-paragraph-label/);

    const geometry = await page.locator("[data-token-button-card]").first().evaluate((card) => {
      if (!(card instanceof HTMLElement)) {
        return null;
      }

      const copy = card.querySelector(".token-button-card-copy");
      const label = card.querySelector(".token-button-card-copy span.token-paragraph-label");
      const iconCircle = card.querySelector(".token-button-card-icon-circle");
      const icon = card.querySelector(".token-button-card-icon");

      if (
        !(copy instanceof HTMLElement)
        || !(label instanceof HTMLElement)
        || !(iconCircle instanceof HTMLElement)
        || !(icon instanceof SVGElement)
      ) {
        return null;
      }

      const cardBox = card.getBoundingClientRect();
      const copyBox = copy.getBoundingClientRect();
      const labelBox = label.getBoundingClientRect();
      const iconCircleBox = iconCircle.getBoundingClientRect();
      const cardStyle = getComputedStyle(card);
      const labelStyle = getComputedStyle(label);
      const iconCircleStyle = getComputedStyle(iconCircle);

      return {
        squareCorners: cardStyle.borderRadius === "0px",
        bordered: cardStyle.borderStyle === "solid" && Number.parseFloat(cardStyle.borderWidth) > 0,
        compactWidth: cardBox.width >= 240 && cardBox.width <= 246,
        compactHeight: cardBox.height >= 74 && cardBox.height <= 80,
        copyIsCentered: Math.abs((copyBox.left + copyBox.width / 2) - (cardBox.left + cardBox.width / 2)) < 1,
        iconIsCircular: iconCircleStyle.borderRadius === "50%" && Math.abs(iconCircleBox.width - iconCircleBox.height) < 1,
        iconAboveLabel: iconCircleBox.bottom <= labelBox.top + 2,
        labelInsideCard: labelBox.right <= cardBox.right && labelBox.bottom <= cardBox.bottom,
        iconInsideCard: iconCircleBox.left >= cardBox.left && iconCircleBox.right <= cardBox.right,
        usesTypographySeamSizes: labelStyle.fontSize === "12px",
        usesTypographySeamWeights: labelStyle.fontWeight === "800",
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry?.squareCorners).toBe(true);
    expect(geometry?.bordered).toBe(true);
    expect(geometry?.compactWidth).toBe(true);
    expect(geometry?.compactHeight).toBe(true);
    expect(geometry?.copyIsCentered).toBe(true);
    expect(geometry?.iconIsCircular).toBe(true);
    expect(geometry?.iconAboveLabel).toBe(true);
    expect(geometry?.labelInsideCard).toBe(true);
    expect(geometry?.iconInsideCard).toBe(true);
    expect(geometry?.usesTypographySeamSizes).toBe(true);
    expect(geometry?.usesTypographySeamWeights).toBe(true);
  });

  test("renders hover, active, selected, disabled, warning, and error states without changing the card contract", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 900 });
    await page.goto("/design-system/tokens/button-card");

    await expect(page.locator("#button-card-states-title")).toBeVisible();

    const states = await page.evaluate(() => {
      const baseCard = document.querySelector(".token-button-card-preview-grid [data-token-button-card]");
      const hover = document.querySelector('[data-token-button-card-state="hover"]');
      const active = document.querySelector('[data-token-button-card-state="active"]');
      const selected = document.querySelector('[data-token-button-card-state="selected"]');
      const disabled = document.querySelector('[data-token-button-card-state="disabled"]');
      const warning = document.querySelector('[data-token-button-card-state="warning"]');
      const error = document.querySelector('[data-token-button-card-state="error"]');

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
          active: card.getAttribute("data-token-button-card-active"),
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
    await page.goto("/design-system/tokens/button-card");

    await expect(page.locator("#button-card-overflow-title")).toBeVisible();
    await expect(page.locator("#button-card-rtl-title")).toBeVisible();
    await expect(page.locator("#button-card-zoom-title")).toBeVisible();
    await expect(page.locator("#button-card-mobile-title")).toBeVisible();

    const rowGeometry = await page.evaluate(() => {
      const overflowCard = document.querySelector(".token-button-card-control-constrained");
      const overflowLabel = overflowCard?.querySelector(".token-button-card-copy span.token-paragraph-label");
      const rtlCard = document.querySelector("[data-token-button-card-rtl]");
      const rtlLabel = rtlCard?.querySelector(".token-button-card-copy span.token-paragraph-label");
      const rtlIconCircle = rtlCard?.querySelector(".token-button-card-icon-circle");
      const zoomSmall = document.querySelector('[data-token-button-card-zoom="-50"] [data-token-button-card]');
      const zoomBase = document.querySelector('[data-token-button-card-zoom="0"] [data-token-button-card]');
      const zoomLarge = document.querySelector('[data-token-button-card-zoom="100"] [data-token-button-card]');
      const mobileFrame = document.querySelector(".token-button-card-mobile-frame");
      const mobileCard = document.querySelector("[data-token-button-card-mobile]");

      if (
        !(overflowCard instanceof HTMLElement)
        || !(overflowLabel instanceof HTMLElement)
        || !(rtlCard instanceof HTMLElement)
        || !(rtlLabel instanceof HTMLElement)
        || !(rtlIconCircle instanceof HTMLElement)
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
      const rtlCardBox = rtlCard.getBoundingClientRect();
      const rtlLabelBox = rtlLabel.getBoundingClientRect();
      const rtlIconCircleBox = rtlIconCircle.getBoundingClientRect();
      const zoomSmallBox = zoomSmall.getBoundingClientRect();
      const zoomBaseBox = zoomBase.getBoundingClientRect();
      const zoomLargeBox = zoomLarge.getBoundingClientRect();
      const mobileFrameBox = mobileFrame.getBoundingClientRect();
      const mobileCardBox = mobileCard.getBoundingClientRect();

      return {
        overflowCardConstrained: overflowCardBox.width <= 242,
        overflowLabelClipped: overflowLabel.scrollWidth > overflowLabel.clientWidth,
        overflowUsesEllipsis: overflowLabelStyle.textOverflow === "ellipsis",
        overflowTooltipReady: Boolean(overflowCard.dataset.tooltip && overflowLabel.dataset.tooltip),
        rtlCenteredStack: Math.abs((rtlLabelBox.left + rtlLabelBox.width / 2) - (rtlCardBox.left + rtlCardBox.width / 2)) < 2
          && Math.abs((rtlIconCircleBox.left + rtlIconCircleBox.width / 2) - (rtlCardBox.left + rtlCardBox.width / 2)) < 2,
        zoomOrder: zoomSmallBox.width < zoomBaseBox.width && zoomBaseBox.width < zoomLargeBox.width,
        mobileFrameWidth: mobileFrameBox.width <= 322,
        mobileCardFillsFrame: Math.abs(mobileCardBox.width - (mobileFrameBox.width - 24)) < 4,
      };
    });

    expect(rowGeometry).not.toBeNull();
    expect(rowGeometry?.overflowCardConstrained).toBe(true);
    expect(rowGeometry?.overflowLabelClipped).toBe(true);
    expect(rowGeometry?.overflowUsesEllipsis).toBe(true);
    expect(rowGeometry?.overflowTooltipReady).toBe(true);
    expect(rowGeometry?.rtlCenteredStack).toBe(true);
    expect(rowGeometry?.zoomOrder).toBe(true);
    expect(rowGeometry?.mobileFrameWidth).toBe(true);
    expect(rowGeometry?.mobileCardFillsFrame).toBe(true);

    const overflowLabel = page.locator(".token-button-card-control-constrained .token-button-card-copy span.token-paragraph-label");
    await overflowLabel.hover();

    const tooltip = page.locator("#shared-floating-tooltip");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText("Historical details and supporting records");
  });
});
