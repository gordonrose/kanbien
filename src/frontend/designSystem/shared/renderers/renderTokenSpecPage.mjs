function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function findVariant(pageModel, variantId) {
  return pageModel.variants.find((variant) => variant.id === variantId) ?? null;
}

function renderSummaryPanels(pageModel) {
  const panels = pageModel.summaryPanels ?? [];
  if (!panels.length) {
    return "";
  }

  return `
    <section class="token-spec-stage" aria-label="${escapeHtml(pageModel.title)} preview">
      ${panels
        .map((panel) => {
          const variant = findVariant(pageModel, panel.variantId);
          if (!variant) {
            return "";
          }
          if (variant.preview.kind === "standard-page-shell-frame-sample") {
            return renderStandardPageShellFramePreview(variant, "stage");
          }
          if (variant.preview.kind === "context-navigation-frame-sample") {
            return renderContextNavigationFramePreview(variant, "stage");
          }
          if (variant.preview.kind === "context-navigation-item-affordance-sample") {
            return renderContextNavigationItemAffordancePreview(variant, "stage");
          }
          if (variant.preview.kind === "tools-navigation-frame-sample") {
            return renderToolsNavigationFramePreview(variant, "stage");
          }
          if (variant.preview.kind === "top-navigation-base-tokens-sample") {
            return renderTopNavigationBaseTokensPreview(variant, "stage");
          }
          if (variant.preview.kind === "top-navigation-frame-sample") {
            return renderTopNavigationFramePreview(variant, "stage");
          }
          return `
            <div
              class="token-spec-page-preview"
              data-token-preview-background="${escapeHtml(variant.preview.background)}"
              data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
            >
              <span>${escapeHtml(panel.label)}</span>
              <strong>${escapeHtml(panel.title)}</strong>
              ${
                panel.supportingText
                  ? `<div class="token-spec-preview-surface"><span>Surface</span><p>${escapeHtml(panel.supportingText)}</p></div>`
                  : ""
              }
            </div>
          `;
        })
        .join("")}
    </section>
  `;
}

function renderStandardPageShellFramePreview(variant, placement = "card") {
  return `
    <div class="token-spec-shell-frame-preview token-spec-shell-frame-preview--${escapeHtml(placement)}" aria-hidden="true">
      <div class="token-spec-shell-frame-diagram token-spec-shell-frame-diagram--desktop">
        <div class="token-spec-shell-frame-top">Top nav</div>
        <div class="token-spec-shell-frame-sub">Sub nav</div>
        <div class="token-spec-shell-frame-rail">Context rail</div>
        <div class="token-spec-shell-frame-drawer">Drawer</div>
        <div class="token-spec-shell-frame-main">Page body</div>
        <div class="token-spec-shell-frame-tools">Tools zone</div>
        <div class="token-spec-shell-frame-tooltip">Tooltip</div>
      </div>
      <div class="token-spec-shell-frame-diagram token-spec-shell-frame-diagram--mobile">
        <div class="token-spec-shell-frame-mobile-top">Top + sub chrome</div>
        <div class="token-spec-shell-frame-mobile-main">Page body</div>
        <div class="token-spec-shell-frame-mobile-bar">Bottom context bar</div>
        <div class="token-spec-shell-frame-mobile-safe">Safe area</div>
      </div>
    </div>
  `;
}

function renderContextNavigationFramePreview(variant, placement = "card") {
  return `
    <div class="token-spec-context-nav-frame-preview token-spec-context-nav-frame-preview--${escapeHtml(placement)}" aria-hidden="true">
      <div class="token-spec-context-nav-frame-diagram token-spec-context-nav-frame-diagram--desktop">
        <div class="token-spec-context-nav-frame-rail">Desktop rail</div>
        <div class="token-spec-context-nav-frame-primary">Primary scroll</div>
        <div class="token-spec-context-nav-frame-utility">Utility anchor</div>
        <div class="token-spec-context-nav-frame-content">Page content</div>
      </div>
      <div class="token-spec-context-nav-frame-diagram token-spec-context-nav-frame-diagram--mobile">
        <div class="token-spec-context-nav-frame-mobile-content">Page content</div>
        <div class="token-spec-context-nav-frame-mobile-drawer">Drawer stops above bar</div>
        <div class="token-spec-context-nav-frame-mobile-bar">Mobile bottom bar</div>
        <div class="token-spec-context-nav-frame-mobile-pin">Viewport pinned</div>
      </div>
    </div>
  `;
}

function renderContextNavigationItemAffordancePreview(variant, placement = "card") {
  const states = [
    ["resting", "Rest"],
    ["hover", "Hover"],
    ["current", "Current"],
    ["disabled", "Disabled"],
  ];

  return `
    <div
      class="token-spec-context-nav-item-affordance-preview token-spec-context-nav-item-affordance-preview--${escapeHtml(placement)}"
      data-token-preview-radius="${escapeHtml(variant.radiusValue)}"
      data-token-preview-desktop-inline-size="${escapeHtml(variant.desktopInlineSize)}"
      data-token-preview-desktop-block-size="${escapeHtml(variant.desktopBlockSize)}"
      data-token-preview-resting-border="${escapeHtml(variant.restingBorderValue)}"
      data-token-preview-resting-background="${escapeHtml(variant.restingBackgroundValue)}"
      data-token-preview-resting-foreground="${escapeHtml(variant.restingForegroundValue)}"
      data-token-preview-hover-border="${escapeHtml(variant.hoverBorderValue)}"
      data-token-preview-hover-background="${escapeHtml(variant.hoverBackgroundValue)}"
      data-token-preview-hover-foreground="${escapeHtml(variant.hoverForegroundValue)}"
      data-token-preview-current-border="${escapeHtml(variant.currentBorderValue)}"
      data-token-preview-current-background="${escapeHtml(variant.currentBackgroundValue)}"
      data-token-preview-current-foreground="${escapeHtml(variant.currentForegroundValue)}"
      data-token-preview-disabled-opacity="${escapeHtml(variant.disabledOpacityValue)}"
      aria-hidden="true"
    >
      ${states
        .map(
          ([state, label]) => `
            <span class="token-spec-context-nav-item-affordance-state" data-token-context-nav-item-state="${escapeHtml(state)}">
              <strong>${escapeHtml(label.slice(0, 1))}</strong>
              <small>${escapeHtml(label)}</small>
            </span>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderToolsNavigationFramePreview(variant, placement = "card") {
  return `
    <div class="token-spec-tools-nav-frame-preview token-spec-tools-nav-frame-preview--${escapeHtml(placement)}" aria-hidden="true">
      <div class="token-spec-tools-nav-frame-diagram token-spec-tools-nav-frame-diagram--desktop">
        <div class="token-spec-tools-nav-frame-content">Page body</div>
        <div class="token-spec-tools-nav-frame-rail">
          <span>Build</span>
          <span>Reports</span>
          <span>Support</span>
          <span>Unavailable</span>
        </div>
      </div>
      <div class="token-spec-tools-nav-frame-diagram token-spec-tools-nav-frame-diagram--mobile">
        <div class="token-spec-tools-nav-frame-mobile-content">Page body</div>
        <div class="token-spec-tools-nav-frame-mobile-hidden">Tools hidden on mobile</div>
      </div>
    </div>
  `;
}

function renderTopNavigationBaseTokensPreview(variant, placement = "card") {
  return `
    <div class="token-spec-top-nav-base-preview token-spec-top-nav-base-preview--${escapeHtml(placement)}" aria-hidden="true">
      <div class="token-spec-top-nav-base-shell">
        <div class="token-spec-top-nav-base-brand">
          <span>K</span>
          <strong>Brand</strong>
        </div>
        <div class="token-spec-top-nav-base-links">
          <span>Current</span>
          <span>Destination</span>
          <span>More</span>
        </div>
        <div class="token-spec-top-nav-base-profile">Profile</div>
      </div>
      <div class="token-spec-top-nav-base-groups">
        <span><strong>mapped 41</strong><code>background-color / primary-color-source / primary-tinted-* / focus-ring</code></span>
        <span><strong>partially mapped</strong><code>button-frame / panel-frame / panel-corner-radius</code></span>
        <span><strong>resolved 41</strong><code>top-navigation-frame owns text / border / current state / menu elevation / non-flush radius</code></span>
        <span><strong>retired 40</strong><code>--surface-* / --ink* / --line* / --accent* / --shadow* / --radius*</code></span>
        <span><strong>blocked</strong><code>not consumable by primitives or patterns</code></span>
        <span><strong>next</strong><code>create or explicitly map missing token seams</code></span>
      </div>
      <div class="token-spec-top-nav-base-boundary">
        <strong>Blocked 41-token inventory</strong>
        <span>Old design-system variables are reference evidence only; top navigation still needs missing 41 token seams.</span>
      </div>
    </div>
  `;
}

function renderTopNavigationFramePreview(variant, placement = "card") {
  const role = variant.preview.role ?? "chrome";
  return `
    <div
      class="token-spec-top-nav-frame-preview token-spec-top-nav-frame-preview--${escapeHtml(placement)}"
      data-token-top-nav-frame-role="${escapeHtml(role)}"
      data-token-preview-background="${escapeHtml(variant.preview.background)}"
      data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
      data-token-preview-supporting-foreground="${escapeHtml(variant.preview.supportingForeground)}"
      data-token-preview-border="${escapeHtml(variant.preview.border)}"
      data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
      data-token-preview-shadow="${escapeHtml(variant.preview.shadow)}"
      aria-hidden="true"
    >
      <div class="token-spec-top-nav-frame-shell">
        <span class="token-spec-top-nav-frame-brand">K</span>
        <span class="token-spec-top-nav-frame-destination">Home</span>
        <span class="token-spec-top-nav-frame-destination token-spec-top-nav-frame-destination--current">Current</span>
        <span class="token-spec-top-nav-frame-destination">More</span>
        <span class="token-spec-top-nav-frame-profile">Profile</span>
      </div>
      <div class="token-spec-top-nav-frame-menu">
        <span>Menu panel</span>
        <strong>${escapeHtml(variant.preview.label)}</strong>
      </div>
      <div class="token-spec-top-nav-frame-boundary">
        <strong>${escapeHtml(variant.frameRole)}</strong>
        <span>${escapeHtml(variant.stateMapping)} / ${escapeHtml(variant.themeMapping)}</span>
      </div>
    </div>
  `;
}

function renderDefinitionList(entries) {
  return entries
    .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join("");
}

function renderDependencyOverrideDiagnostic(pageModel) {
  const diagnostic = pageModel.diagnostic;
  if (
    !diagnostic ||
    !["primary-color-source-override", "dependency-hex-override"].includes(diagnostic.kind)
  ) {
    return "";
  }

  const previews = diagnostic.previews ?? [
    {
      role: "source",
      label: diagnostic.sourceLabel,
      sample: diagnostic.defaultHex,
    },
    {
      role: "subtle",
      label: diagnostic.subtleLabel,
      sample: diagnostic.subtleSample,
    },
    {
      role: "label",
      label: diagnostic.labelColorLabel,
      sample: diagnostic.labelSample,
    },
    {
      role: "ring",
      label: diagnostic.ringLabel,
      sample: diagnostic.ringSample,
    },
  ];
  const surfaceOptions = Array.isArray(diagnostic.surfaceOptions) ? diagnostic.surfaceOptions : [];
  const surfaceControl =
    surfaceOptions.length > 0
      ? `
        <label>
          <span>${escapeHtml(diagnostic.surfaceInputLabel ?? "Host surface")}</span>
          <select data-token-diagnostic-surface-select>
            ${surfaceOptions
              .map(
                (option) =>
                  `<option value="${escapeHtml(option.value)}" data-token-name="${escapeHtml(option.tokenName)}">${escapeHtml(option.label)}</option>`,
              )
              .join("")}
          </select>
        </label>
      `
      : "";

  return `
    <section class="token-spec-diagnostic" aria-label="${escapeHtml(diagnostic.label)}">
      <div class="token-spec-diagnostic-control">
        <div>
          <p class="token-spec-kicker">${escapeHtml(diagnostic.kicker)}</p>
          <h2>${escapeHtml(diagnostic.label)}</h2>
          <p>${escapeHtml(diagnostic.description)}</p>
        </div>
        <label>
          <span>${escapeHtml(diagnostic.inputLabel)}</span>
          <input
            type="text"
            inputmode="text"
            autocomplete="off"
            spellcheck="false"
            value="${escapeHtml(diagnostic.defaultHex)}"
            pattern="^#[0-9a-fA-F]{6}$"
            data-token-diagnostic-hex-input
          />
        </label>
        ${surfaceControl}
        <button type="button" data-token-diagnostic-reset>${escapeHtml(diagnostic.resetLabel)}</button>
      </div>
      <div class="token-spec-diagnostic-previews" aria-label="${escapeHtml(diagnostic.previewLabel)}">
        ${previews
          .map(
            (preview) => `
              <div
                class="${preview.role === "source" ? "token-spec-diagnostic-swatch" : "token-spec-diagnostic-derived"}"
                data-token-diagnostic-role="${escapeHtml(preview.role)}"
              >
                <span>${escapeHtml(preview.label)}</span>
                <strong ${preview.role === "source" ? "data-token-diagnostic-source-value" : ""}>${escapeHtml(preview.sample)}</strong>
              </div>
            `,
          )
          .join("")}
      </div>
      <p class="token-spec-diagnostic-status" data-token-diagnostic-status>${escapeHtml(diagnostic.validStatus)}</p>
    </section>
  `;
}

function renderInlineSizeRangeDiagnostic(pageModel) {
  const diagnostic = pageModel.diagnostic;
  if (!diagnostic || diagnostic.kind !== "inline-size-range") {
    return "";
  }

  const variant = findVariant(pageModel, diagnostic.sourceVariantId);
  if (!variant) {
    return "";
  }

  return `
    <section class="token-spec-diagnostic" aria-label="${escapeHtml(diagnostic.label)}">
      <div class="token-spec-diagnostic-control">
        <div>
          <p class="token-spec-kicker">${escapeHtml(diagnostic.kicker)}</p>
          <h2>${escapeHtml(diagnostic.label)}</h2>
          <p>${escapeHtml(diagnostic.description)}</p>
        </div>
        <label>
          <span>${escapeHtml(diagnostic.inputLabel)}</span>
          <input
            type="range"
            data-token-diagnostic-inline-size-input
            data-token-diagnostic-min-value="${escapeHtml(variant[diagnostic.minField])}"
            data-token-diagnostic-max-value="${escapeHtml(variant[diagnostic.maxField])}"
            data-token-diagnostic-default-value="${escapeHtml(variant[diagnostic.defaultField])}"
          />
        </label>
      </div>
      <div class="token-spec-diagnostic-previews token-spec-diagnostic-previews-inline-size" aria-label="${escapeHtml(diagnostic.previewLabel)}">
        <div
          class="token-spec-inline-size-preview"
          data-token-diagnostic-inline-size-preview
          data-token-preview-background="${escapeHtml(variant.preview.background)}"
          data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
          data-token-preview-border="${escapeHtml(variant.preview.border)}"
        >
          <span>Panel frame</span>
        </div>
      </div>
      <p class="token-spec-diagnostic-status" data-token-diagnostic-inline-size-status></p>
    </section>
  `;
}

function renderVariantFields(pageModel, variant) {
  return renderDefinitionList(pageModel.variantFields.map(([key, label]) => [label, variant[key]]));
}

function renderUsage(variant) {
  return variant.usage
    .map((item) => `<li><strong>${escapeHtml(item.label)}</strong>: ${escapeHtml(item.text)}</li>`)
    .join("");
}

function renderVariantPreview(variant) {
  if (variant.preview.kind === "focus-ring-sample") {
    return `
      <div
        class="token-spec-focus-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-ring="${escapeHtml(variant.preview.ringValue)}"
        data-token-preview-offset="${escapeHtml(variant.preview.offsetValue)}"
        aria-hidden="true"
      >
        <span class="token-spec-focus-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "target-size-box") {
    return `
      <div
        class="token-spec-target-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-min-width="${escapeHtml(variant.preview.minimumWidth)}"
        data-token-preview-min-height="${escapeHtml(variant.preview.minimumHeight)}"
        aria-hidden="true"
      >
        <span class="token-spec-target-box">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "text-sample") {
    return `
      <div
        class="token-spec-text-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        aria-hidden="true"
      >
        <span class="token-spec-text-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "text-style-sample") {
    return `
      <div
        class="token-spec-text-style-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-font-family="${escapeHtml(variant.preview.fontFamily)}"
        data-token-preview-font-size="${escapeHtml(variant.preview.fontSize)}"
        data-token-preview-font-weight="${escapeHtml(variant.preview.fontWeight)}"
        data-token-preview-line-height="${escapeHtml(variant.preview.lineHeight)}"
        data-token-preview-letter-spacing="${escapeHtml(variant.preview.letterSpacing)}"
        data-token-preview-text-transform="${escapeHtml(variant.preview.textTransform)}"
        aria-hidden="true"
      >
        <span class="token-spec-text-style-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "tooltip-surface-sample") {
    return `
      <div class="token-spec-tooltip-preview" aria-hidden="true">
        <span
          class="token-spec-tooltip-sample"
          data-token-preview-background="${escapeHtml(variant.preview.background)}"
          data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
          data-token-preview-border="${escapeHtml(variant.preview.border)}"
          data-token-preview-shadow="${escapeHtml(variant.preview.shadow)}"
          data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
          data-token-preview-padding-block="${escapeHtml(variant.preview.paddingBlock)}"
          data-token-preview-padding-inline="${escapeHtml(variant.preview.paddingInline)}"
          data-token-preview-max-inline-size="${escapeHtml(variant.preview.maxInlineSize)}"
        >${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "surface-card") {
    return `
      <div
        class="token-spec-surface-card-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius ?? "")}"
        aria-hidden="true"
      >
        <span class="token-spec-surface-card-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "standard-page-shell-frame-sample") {
    return renderStandardPageShellFramePreview(variant);
  }
  if (variant.preview.kind === "tools-navigation-frame-sample") {
    return renderToolsNavigationFramePreview(variant);
  }

  if (variant.preview.kind === "top-navigation-base-tokens-sample") {
    return renderTopNavigationBaseTokensPreview(variant);
  }

  if (variant.preview.kind === "top-navigation-frame-sample") {
    return renderTopNavigationFramePreview(variant);
  }

  if (variant.preview.kind === "context-navigation-frame-sample") {
    return renderContextNavigationFramePreview(variant);
  }

  if (variant.preview.kind === "context-navigation-item-affordance-sample") {
    return renderContextNavigationItemAffordancePreview(variant);
  }

  if (variant.preview.kind === "detail-slot-frame-sample") {
    return `
      <div
        class="token-spec-detail-slot-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-detail-surface="${escapeHtml(variant.preview.detailSurface)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
        data-token-preview-padding-block="${escapeHtml(variant.preview.paddingBlock)}"
        data-token-preview-padding-inline="${escapeHtml(variant.preview.paddingInline)}"
        data-token-preview-gap="${escapeHtml(variant.preview.gap)}"
        data-token-preview-min-inline-size="${escapeHtml(variant.preview.minInlineSize)}"
        data-token-preview-max-block-size="${escapeHtml(variant.preview.maxBlockSize)}"
        aria-hidden="true"
      >
        <div class="token-spec-detail-slot-frame-header">
          <span>${escapeHtml(variant.preview.supportingText)}</span>
          <strong>${escapeHtml(variant.preview.sample)}</strong>
        </div>
        <div class="token-spec-detail-slot-frame-card">
          <span>Northstar Operations</span>
          <strong>Ready</strong>
        </div>
      </div>
    `;
  }

  if (variant.preview.kind === "panel-stack-placement-sample") {
    return `
      <div
        class="token-spec-panel-stack-placement-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius ?? "")}"
        data-token-preview-desktop-gap="${escapeHtml(variant.desktopAdjacencyGapValue)}"
        data-token-preview-overlay-inset="${escapeHtml(variant.overlayInsetValue)}"
        aria-hidden="true"
      >
        <div class="token-spec-panel-stack-placement-desktop">
          <span>Primary panel</span>
          <span>Child panel</span>
          <span>Grandchild panel</span>
        </div>
        <div class="token-spec-panel-stack-placement-mobile">
          <span>Covered</span>
          <span>Active overlay</span>
        </div>
      </div>
    `;
  }

  if (variant.preview.kind === "menu-simple-select-trigger-sample") {
    const textTrigger = variant.preview.frameRole !== "icon trigger frame";
    return `
      <div
        class="token-spec-menu-select-trigger-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-supporting-foreground="${escapeHtml(variant.preview.supportingForeground)}"
        data-token-preview-icon-foreground="${escapeHtml(variant.preview.iconForeground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
        data-token-preview-padding-block="${escapeHtml(variant.preview.paddingBlock)}"
        data-token-preview-padding-inline="${escapeHtml(variant.preview.paddingInline)}"
        data-token-preview-gap="${escapeHtml(variant.preview.gap)}"
        data-token-preview-min-block-size="${escapeHtml(variant.preview.minBlockSize)}"
        data-token-preview-min-inline-size="${escapeHtml(variant.preview.minInlineSize)}"
        data-token-preview-max-inline-size="${escapeHtml(variant.preview.maxInlineSize)}"
        data-token-preview-frame-role="${escapeHtml(variant.preview.frameRole)}"
        aria-hidden="true"
      >
        ${
          textTrigger
            ? `
              <span class="token-spec-menu-select-trigger-copy">
                <span class="token-spec-menu-select-trigger-label">${escapeHtml(variant.preview.labelText)}</span>
                <strong>${escapeHtml(variant.preview.valueText)}</strong>
              </span>
            `
            : ""
        }
        <span class="token-spec-menu-select-trigger-icon">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
    `;
  }

  if (variant.preview.kind === "field-row-frame-sample") {
    return `
      <div
        class="token-spec-field-row-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
        data-token-preview-field-row-gap="${escapeHtml(variant.preview.rowGap)}"
        data-token-preview-field-row-label-gap="${escapeHtml(variant.preview.labelToControlGap)}"
        data-token-preview-field-row-message-gap="${escapeHtml(variant.preview.controlToMessageGap)}"
        data-token-preview-field-row-control-min-block-size="${escapeHtml(variant.preview.controlSlotMinBlockSize)}"
        aria-hidden="true"
      >
        <span class="token-spec-field-row-frame-label">${escapeHtml(variant.preview.label)}</span>
        <span class="token-spec-field-row-frame-control">${escapeHtml(variant.preview.control)}</span>
        <span class="token-spec-field-row-frame-message">${escapeHtml(variant.preview.message)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "drag-drop-affordance-sample") {
    return `
      <div
        class="token-spec-drag-drop-affordance-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-accent="${escapeHtml(variant.preview.accent)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
        data-token-preview-padding-block="${escapeHtml(variant.preview.paddingBlock)}"
        data-token-preview-padding-inline="${escapeHtml(variant.preview.paddingInline)}"
        data-token-preview-min-block-size="${escapeHtml(variant.preview.minBlockSize)}"
        data-token-preview-marker-min-block-size="${escapeHtml(variant.preview.markerMinBlockSize)}"
        data-token-preview-shadow="${escapeHtml(variant.preview.shadow)}"
        data-token-preview-state="${escapeHtml(variant.preview.state)}"
        aria-hidden="true"
      >
        <span class="token-spec-drag-drop-grip"></span>
        <span class="token-spec-drag-drop-content">
          <strong>${escapeHtml(variant.preview.sample)}</strong>
          <small>${escapeHtml(variant.preview.supportingText)}</small>
        </span>
        <span class="token-spec-drag-drop-marker-label">${escapeHtml(variant.preview.markerLabel)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "field-container-frame-sample") {
    return `
      <div
        class="token-spec-field-container-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
        data-token-preview-padding-block="${escapeHtml(variant.preview.paddingBlock)}"
        data-token-preview-padding-inline="${escapeHtml(variant.preview.paddingInline)}"
        data-token-preview-min-block-size="${escapeHtml(variant.preview.minBlockSize)}"
        aria-hidden="true"
      >
        <span class="token-spec-field-container-frame-label">${escapeHtml(variant.preview.label)}</span>
        <span class="token-spec-field-container-frame-control">${escapeHtml(variant.preview.control)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "page-header-structure-map") {
    const columnLabels = Array.from({ length: Number(variant.preview.visibleColumnCount ?? 24) }, (_, index) =>
      String(index + 1).padStart(2, "0"),
    );

    return `
      <div
        class="token-spec-page-header-map-host"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-page-header-gap="${escapeHtml(variant.preview.gap)}"
        aria-hidden="true"
      >
        <div class="token-list-page-structure-header-grid token-page-header-grid token-spec-page-header-map-preview">
          ${columnLabels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}
          <div class="token-page-header-map">
          ${variant.preview.regions
            .map(
              (region) => `
                <div
                  class="token-page-header-group"
                  data-page-header-span="${escapeHtml(region.label)}"
                ></div>
              `,
            )
            .join("")}
          </div>
        </div>
      </div>
    `;
  }

  if (variant.preview.kind === "sub-navigation-row-structure-map") {
    const columnLabels = Array.from({ length: Number(variant.preview.columnCount ?? 24) }, (_, index) =>
      String(index + 1).padStart(2, "0"),
    );

    return `
      <div
        class="token-spec-sub-navigation-row-map-host"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-sub-navigation-gap="${escapeHtml(variant.preview.gap)}"
        aria-hidden="true"
      >
        <div class="token-spec-sub-navigation-row-grid">
          ${columnLabels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}
          <div class="token-spec-sub-navigation-row-lanes">
          ${variant.preview.lanes
            .map(
              (lane) => `
                <div
                  class="token-spec-sub-navigation-row-lane"
                  data-token-sub-navigation-row-lane="${escapeHtml(lane.id)}"
                  data-token-sub-navigation-row-span="${escapeHtml(lane.label)}"
                >
                  <strong>${escapeHtml(lane.id)}</strong>
                  <small>${escapeHtml(lane.label)}</small>
                </div>
              `,
            )
            .join("")}
          </div>
        </div>
      </div>
    `;
  }

  if (variant.preview.kind === "button-frame-sample") {
    return `
      <div
        class="token-spec-button-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
        data-token-preview-padding-block="${escapeHtml(variant.preview.paddingBlock)}"
        data-token-preview-padding-inline="${escapeHtml(variant.preview.paddingInline)}"
        data-token-preview-gap="${escapeHtml(variant.preview.gap)}"
        data-token-preview-font-family="${escapeHtml(variant.preview.fontFamily)}"
        data-token-preview-font-size="${escapeHtml(variant.preview.fontSize)}"
        data-token-preview-font-weight="${escapeHtml(variant.preview.fontWeight)}"
        data-token-preview-line-height="${escapeHtml(variant.preview.lineHeight)}"
        data-token-preview-letter-spacing="${escapeHtml(variant.preview.letterSpacing)}"
        data-token-preview-text-transform="${escapeHtml(variant.preview.textTransform)}"
        aria-hidden="true"
      >
        <span class="token-spec-button-frame-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "toggle-frame-sample") {
    return `
      <div
        class="token-spec-toggle-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-toggle-track-inline-size="${escapeHtml(variant.preview.trackInlineSize)}"
        data-token-preview-toggle-track-block-size="${escapeHtml(variant.preview.trackBlockSize)}"
        data-token-preview-toggle-track-border-width="${escapeHtml(variant.preview.trackBorderWidth)}"
        data-token-preview-toggle-thumb-background="${escapeHtml(variant.preview.thumbBackground)}"
        data-token-preview-toggle-thumb-inline-size="${escapeHtml(variant.preview.thumbInlineSize)}"
        data-token-preview-toggle-thumb-block-size="${escapeHtml(variant.preview.thumbBlockSize)}"
        data-token-preview-toggle-thumb-offset="${escapeHtml(variant.preview.thumbOffset)}"
        data-token-preview-toggle-track-padding="${escapeHtml(variant.preview.trackPadding)}"
        data-token-preview-toggle-track-radius="${escapeHtml(variant.preview.trackRadius)}"
        data-token-preview-toggle-thumb-radius="${escapeHtml(variant.preview.thumbRadius)}"
        data-token-preview-toggle-thumb-shadow="${escapeHtml(variant.preview.thumbShadow)}"
        data-token-preview-toggle-motion-duration="${escapeHtml(variant.preview.motionDuration)}"
        data-token-preview-toggle-motion-easing="${escapeHtml(variant.preview.motionEasing)}"
        aria-hidden="true"
      >
        <span class="token-spec-toggle-frame-track">
          <span class="token-spec-toggle-frame-thumb"></span>
        </span>
      </div>
    `;
  }

  if (variant.preview.kind === "scrollbar-sample") {
    return `
      <div
        class="token-spec-scrollbar-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-scrollbar-width="${escapeHtml(variant.preview.width)}"
        data-token-preview-scrollbar-thumb="${escapeHtml(variant.preview.thumb)}"
        data-token-preview-scrollbar-track="${escapeHtml(variant.preview.track)}"
        data-token-preview-scrollbar-radius="${escapeHtml(variant.preview.radius)}"
        aria-hidden="true"
      >
        <span>${escapeHtml(variant.preview.sample)}</span>
        <span>Identity</span>
        <span>Workflows</span>
        <span>Relationships</span>
        <span>Attributes</span>
        <span>Compliance</span>
      </div>
    `;
  }

  if (variant.preview.kind === "resize-handle-sample") {
    return `
      <div
        class="token-spec-resize-handle-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-resize-hit-area-inline-size="${escapeHtml(variant.preview.hitAreaInlineSize)}"
        data-token-preview-resize-visual-inline-size="${escapeHtml(variant.preview.visualInlineSize)}"
        data-token-preview-resize-visual-radius="${escapeHtml(variant.preview.visualRadius)}"
        data-token-preview-resize-min-block-size="${escapeHtml(variant.preview.minBlockSize)}"
        data-token-preview-resize-cursor="${escapeHtml(variant.preview.cursor)}"
        data-token-preview-resize-visual-color="${escapeHtml(variant.preview.visualColor)}"
        aria-hidden="true"
      >
        <span class="token-spec-resize-panel">Panel edge</span>
        <span class="token-spec-resize-hit-area">
          <span class="token-spec-resize-rail"></span>
        </span>
      </div>
    `;
  }

  if (variant.preview.kind === "radius-box") {
    return `
      <div
        class="token-spec-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
        aria-hidden="true"
      >
        <span class="token-spec-radius-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "padding-box") {
    return `
      <div
        class="token-spec-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-padding-block="${escapeHtml(variant.preview.paddingBlock)}"
        data-token-preview-padding-inline="${escapeHtml(variant.preview.paddingInline)}"
        aria-hidden="true"
      >
        <span class="token-spec-padding-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "gap-sample") {
    return `
      <div
        class="token-spec-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-gap="${escapeHtml(variant.preview.gap)}"
        aria-hidden="true"
      >
        <span class="token-spec-gap-sample">
          <span>${escapeHtml(variant.preview.sample)}</span>
          <small>Supporting row</small>
        </span>
      </div>
    `;
  }

  if (variant.preview.kind === "indicator-sample") {
    return `
      <div
        class="token-spec-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-indicator-inline-size="${escapeHtml(variant.preview.indicatorInlineSize)}"
        data-token-preview-indicator-min-block-size="${escapeHtml(variant.preview.indicatorMinBlockSize)}"
        data-token-preview-indicator-block-size-behavior="${escapeHtml(variant.preview.indicatorBlockSizeBehavior)}"
        data-token-preview-indicator-radius="${escapeHtml(variant.preview.indicatorRadius)}"
        aria-hidden="true"
      >
        <span class="token-spec-indicator-sample">
          <span class="token-spec-indicator-marker"></span>
          <span>${escapeHtml(variant.preview.sample)}</span>
        </span>
      </div>
    `;
  }

  if (variant.preview.kind === "choice-grid-sample") {
    return `
      <div
        class="token-spec-choice-grid-preview"
        data-token-preview-choice-columns="${escapeHtml(variant.preview.columnCount)}"
        data-token-preview-choice-row-gap="${escapeHtml(variant.preview.rowGap)}"
        data-token-preview-choice-column-gap="${escapeHtml(variant.preview.columnGap)}"
        data-token-preview-choice-collapse-threshold="${escapeHtml(variant.preview.optionCollapseThresholdInlineSize)}"
        aria-hidden="true"
      >
        <span>Item 1</span>
        <span>Item 2</span>
        <span>Item 3</span>
        <span>Item 4</span>
      </div>
    `;
  }

  if (variant.preview.kind === "choice-card-state-affordance-sample") {
    return `
      <div
        class="token-spec-choice-affordance-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
        data-token-preview-choice-affordance-glyph-inline-size="${escapeHtml(variant.preview.glyphInlineSize)}"
        data-token-preview-choice-affordance-glyph-block-size="${escapeHtml(variant.preview.glyphBlockSize)}"
        data-token-preview-choice-affordance-leading-inline-size="${escapeHtml(variant.preview.leadingInlineSize)}"
        data-token-preview-choice-affordance-trailing-min-inline-size="${escapeHtml(variant.preview.trailingMinInlineSize)}"
        data-token-preview-choice-affordance-gap="${escapeHtml(variant.preview.contentGapValue)}"
        data-token-preview-font-family="${escapeHtml(variant.preview.fontFamily)}"
        data-token-preview-font-size="${escapeHtml(variant.preview.fontSize)}"
        data-token-preview-font-weight="${escapeHtml(variant.preview.fontWeight)}"
        data-token-preview-line-height="${escapeHtml(variant.preview.lineHeight)}"
        aria-hidden="true"
      >
        ${renderChoiceAffordanceGlyph(variant.preview.glyphSemantic)}
        <strong data-token-choice-affordance-disclosure-source>${escapeHtml(variant.preview.sample)}</strong>
        <span class="token-spec-choice-affordance-state" data-token-choice-affordance-disclosure-source>${escapeHtml(variant.preview.stateText)}</span>
        <span class="token-spec-choice-affordance-tooltip" role="tooltip" data-token-choice-affordance-tooltip>${escapeHtml(
          `${variant.preview.sample} ${variant.preview.stateText}`,
        )}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "count-card-frame-sample") {
    return `
      <div
        class="token-spec-count-card-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
        data-token-preview-padding-block="${escapeHtml(variant.preview.paddingBlock)}"
        data-token-preview-padding-inline="${escapeHtml(variant.preview.paddingInline)}"
        data-token-preview-count-card-gap="${escapeHtml(variant.preview.contentGap)}"
        data-token-preview-count-card-count-background="${escapeHtml(variant.preview.countBackground)}"
        data-token-preview-count-card-count-foreground="${escapeHtml(variant.preview.countForeground)}"
        data-token-preview-count-card-count-border="${escapeHtml(variant.preview.countBorder)}"
        data-token-preview-count-card-count-min-inline-size="${escapeHtml(variant.preview.countSlotMinInlineSize)}"
        aria-hidden="true"
      >
        <strong>${escapeHtml(variant.preview.sample)}</strong>
        <span>${escapeHtml(variant.preview.count)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "visual-proof-ornament-sample") {
    return `
      <div
        class="token-spec-visual-ornament-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-grid-color="${escapeHtml(variant.preview.gridColor)}"
        data-token-preview-grid-size="${escapeHtml(variant.preview.gridSize)}"
        data-token-preview-chip-background="${escapeHtml(variant.preview.chipBackground)}"
        data-token-preview-chip-border="${escapeHtml(variant.preview.chipBorder)}"
        data-token-preview-chip-radius="${escapeHtml(variant.preview.chipRadius)}"
        data-token-preview-chip-opacity="${escapeHtml(variant.preview.chipOpacity)}"
        data-token-preview-line-color="${escapeHtml(variant.preview.lineColor)}"
        data-token-preview-line-size="${escapeHtml(variant.preview.lineSize)}"
        data-token-preview-accent-bar="${escapeHtml(variant.preview.accentBar)}"
        data-token-preview-overlay="${escapeHtml(variant.preview.overlay)}"
        data-token-preview-marker-size="${escapeHtml(variant.preview.markerSize)}"
        data-token-preview-marker-background="${escapeHtml(variant.preview.markerBackground)}"
        data-token-preview-marker-radius="${escapeHtml(variant.preview.markerRadius)}"
        data-token-preview-ornament-id="${escapeHtml(variant.preview.ornamentId)}"
        aria-hidden="true"
      >
        <span class="token-spec-visual-ornament-accent"></span>
        <span class="token-spec-visual-ornament-chip token-spec-visual-ornament-chip-a"></span>
        <span class="token-spec-visual-ornament-chip token-spec-visual-ornament-chip-b"></span>
        <span class="token-spec-visual-ornament-chip token-spec-visual-ornament-chip-c"></span>
        <span class="token-spec-visual-ornament-line"></span>
        <span class="token-spec-visual-ornament-marker"></span>
        <strong>${escapeHtml(variant.preview.sample)}</strong>
      </div>
    `;
  }

  if (variant.preview.kind === "icon-size-sample") {
    return `
      <div class="token-spec-frame-preview" aria-hidden="true">
        <svg
          class="token-spec-icon-size-sample"
          viewBox="0 0 24 24"
          focusable="false"
          data-token-preview-icon-inline-size="${escapeHtml(variant.preview.inlineSize)}"
          data-token-preview-icon-block-size="${escapeHtml(variant.preview.blockSize)}"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
    `;
  }

  return `<div class="token-spec-swatch" data-token-preview-background="${escapeHtml(variant.preview.background)}" aria-hidden="true"></div>`;
}

function renderVariantCard(pageModel, variant) {
  return `
    <article
      class="token-spec-card ${["page-header-structure-map", "sub-navigation-row-structure-map"].includes(variant.preview.kind) ? "token-spec-card-stacked-preview" : ""}"
      data-token-variant-id="${escapeHtml(variant.id)}"
    >
      <div class="token-spec-card-preview">
        ${renderVariantPreview(variant)}
        <p class="token-spec-preview-label">${escapeHtml(variant.preview.label)}</p>
      </div>
      <div class="token-spec-card-main">
        <div>
          <p class="token-spec-kicker">${escapeHtml(variant.theme)}</p>
          <h3>${escapeHtml(variant.preview.label)}</h3>
          <code>${escapeHtml(variant.tokenName)}</code>
        </div>
        <dl class="token-spec-definition-grid">
          <div><dt>Value</dt><dd>${escapeHtml(variant.tokenValue)}</dd></div>
          ${renderVariantFields(pageModel, variant)}
        </dl>
      </div>
      <div class="token-spec-card-side">
        <h4>Accessibility</h4>
        <p>${escapeHtml(variant.accessibility)}</p>
      </div>
      <div class="token-spec-card-side token-spec-usage">
        <h4>Use</h4>
        <ul>${renderUsage(variant)}</ul>
      </div>
    </article>
  `;
}

function renderList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderChoiceAffordanceGlyph(glyphSemantic) {
  const pathsBySemantic = {
    "visibility-on": `
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    `,
    "visibility-off": `
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="m4.5 4.5 15 15" />
    `,
    "selected-check": '<path d="m5 12 4 4 10-10" />',
    "not-selected-x": '<path d="m7 7 10 10" /><path d="m17 7-10 10" />',
  };
  const paths = pathsBySemantic[glyphSemantic] ?? pathsBySemantic["not-selected-x"];
  return `
    <span class="token-spec-choice-affordance-glyph" data-token-choice-affordance-glyph-semantic="${escapeHtml(glyphSemantic)}">
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">${paths}</svg>
    </span>
  `;
}

function applyPreviewStyles(root) {
  for (const element of root.querySelectorAll("[data-token-preview-background]")) {
    if (element instanceof HTMLElement) {
      element.style.background = element.dataset.tokenPreviewBackground ?? "";
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-foreground]")) {
    if (element instanceof HTMLElement) {
      element.style.color = element.dataset.tokenPreviewForeground ?? "";
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-ring]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-ring", element.dataset.tokenPreviewRing ?? "");
      element.style.setProperty("--token-preview-ring-offset", element.dataset.tokenPreviewOffset ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-min-width]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-min-width", element.dataset.tokenPreviewMinWidth ?? "");
      element.style.setProperty("--token-preview-min-height", element.dataset.tokenPreviewMinHeight ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-font-size]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-font-family", element.dataset.tokenPreviewFontFamily ?? "");
      element.style.setProperty("--token-preview-font-size", element.dataset.tokenPreviewFontSize ?? "");
      element.style.setProperty("--token-preview-font-weight", element.dataset.tokenPreviewFontWeight ?? "");
      element.style.setProperty("--token-preview-line-height", element.dataset.tokenPreviewLineHeight ?? "");
      element.style.setProperty("--token-preview-letter-spacing", element.dataset.tokenPreviewLetterSpacing ?? "");
      element.style.setProperty("--token-preview-text-transform", element.dataset.tokenPreviewTextTransform ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-border]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-border", element.dataset.tokenPreviewBorder ?? "");
      element.style.setProperty("--token-preview-shadow", element.dataset.tokenPreviewShadow ?? "");
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
      element.style.setProperty("--token-preview-supporting-foreground", element.dataset.tokenPreviewSupportingForeground ?? "");
      element.style.setProperty("--token-preview-padding-block", element.dataset.tokenPreviewPaddingBlock ?? "");
      element.style.setProperty("--token-preview-padding-inline", element.dataset.tokenPreviewPaddingInline ?? "");
      element.style.setProperty("--token-preview-max-inline-size", element.dataset.tokenPreviewMaxInlineSize ?? "");
    }
  }

  for (const element of root.querySelectorAll(".token-spec-surface-card-preview[data-token-preview-border]")) {
    if (element instanceof HTMLElement) {
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-detail-surface]")) {
    if (element instanceof HTMLElement) {
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
      element.style.setProperty("--token-preview-detail-surface", element.dataset.tokenPreviewDetailSurface ?? "");
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
      element.style.setProperty("--token-preview-padding-block", element.dataset.tokenPreviewPaddingBlock ?? "");
      element.style.setProperty("--token-preview-padding-inline", element.dataset.tokenPreviewPaddingInline ?? "");
      element.style.setProperty("--token-preview-gap", element.dataset.tokenPreviewGap ?? "");
      element.style.setProperty("--token-preview-min-inline-size", element.dataset.tokenPreviewMinInlineSize ?? "");
      element.style.setProperty("--token-preview-max-block-size", element.dataset.tokenPreviewMaxBlockSize ?? "");
    }
  }

  for (const element of root.querySelectorAll(".token-spec-panel-stack-placement-preview[data-token-preview-border]")) {
    if (element instanceof HTMLElement) {
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
      element.style.setProperty("--token-preview-desktop-gap", element.dataset.tokenPreviewDesktopGap ?? "");
      element.style.setProperty("--token-preview-overlay-inset", element.dataset.tokenPreviewOverlayInset ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-field-row-gap]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-field-row-gap", element.dataset.tokenPreviewFieldRowGap ?? "");
      element.style.setProperty("--token-preview-field-row-label-gap", element.dataset.tokenPreviewFieldRowLabelGap ?? "");
      element.style.setProperty("--token-preview-field-row-message-gap", element.dataset.tokenPreviewFieldRowMessageGap ?? "");
      element.style.setProperty(
        "--token-preview-field-row-control-min-block-size",
        element.dataset.tokenPreviewFieldRowControlMinBlockSize ?? "",
      );
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
    }
  }

  for (const element of root.querySelectorAll(".token-spec-frame-preview[data-token-preview-border]")) {
    if (element instanceof HTMLElement) {
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
      element.style.setProperty("--token-preview-padding-block", element.dataset.tokenPreviewPaddingBlock ?? "");
      element.style.setProperty("--token-preview-padding-inline", element.dataset.tokenPreviewPaddingInline ?? "");
      element.style.setProperty("--token-preview-gap", element.dataset.tokenPreviewGap ?? "");
      element.style.setProperty("--token-preview-indicator-inline-size", element.dataset.tokenPreviewIndicatorInlineSize ?? "");
      element.style.setProperty("--token-preview-indicator-min-block-size", element.dataset.tokenPreviewIndicatorMinBlockSize ?? "");
      element.style.setProperty("--token-preview-indicator-block-size-behavior", element.dataset.tokenPreviewIndicatorBlockSizeBehavior ?? "");
      element.style.setProperty("--token-preview-indicator-radius", element.dataset.tokenPreviewIndicatorRadius ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-page-header-gap]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-header-one-stream-gap", element.dataset.tokenPreviewPageHeaderGap ?? "");
    }
  }

  for (const element of root.querySelectorAll(".token-spec-visual-ornament-preview[data-token-preview-grid-color]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-grid-color", element.dataset.tokenPreviewGridColor ?? "");
      element.style.setProperty("--token-preview-grid-size", element.dataset.tokenPreviewGridSize ?? "");
      element.style.setProperty("--token-preview-chip-background", element.dataset.tokenPreviewChipBackground ?? "");
      element.style.setProperty("--token-preview-chip-border", element.dataset.tokenPreviewChipBorder ?? "");
      element.style.setProperty("--token-preview-chip-radius", element.dataset.tokenPreviewChipRadius ?? "");
      element.style.setProperty("--token-preview-chip-opacity", element.dataset.tokenPreviewChipOpacity ?? "");
      element.style.setProperty("--token-preview-line-color", element.dataset.tokenPreviewLineColor ?? "");
      element.style.setProperty("--token-preview-line-size", element.dataset.tokenPreviewLineSize ?? "");
      element.style.setProperty("--token-preview-accent-bar", element.dataset.tokenPreviewAccentBar ?? "");
      element.style.setProperty("--token-preview-overlay", element.dataset.tokenPreviewOverlay ?? "");
      element.style.setProperty("--token-preview-marker-size", element.dataset.tokenPreviewMarkerSize ?? "");
      element.style.setProperty("--token-preview-marker-background", element.dataset.tokenPreviewMarkerBackground ?? "");
      element.style.setProperty("--token-preview-marker-radius", element.dataset.tokenPreviewMarkerRadius ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-icon-inline-size]")) {
    if (element instanceof SVGElement) {
      element.style.inlineSize = element.dataset.tokenPreviewIconInlineSize ?? "";
      element.style.blockSize = element.dataset.tokenPreviewIconBlockSize ?? "";
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-scrollbar-width]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-scrollbar-width", element.dataset.tokenPreviewScrollbarWidth ?? "");
      element.style.setProperty("--token-preview-scrollbar-thumb", element.dataset.tokenPreviewScrollbarThumb ?? "");
      element.style.setProperty("--token-preview-scrollbar-track", element.dataset.tokenPreviewScrollbarTrack ?? "");
      element.style.setProperty("--token-preview-scrollbar-radius", element.dataset.tokenPreviewScrollbarRadius ?? "");
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-resize-hit-area-inline-size]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-resize-hit-area-inline-size", element.dataset.tokenPreviewResizeHitAreaInlineSize ?? "");
      element.style.setProperty("--token-preview-resize-visual-inline-size", element.dataset.tokenPreviewResizeVisualInlineSize ?? "");
      element.style.setProperty("--token-preview-resize-visual-radius", element.dataset.tokenPreviewResizeVisualRadius ?? "");
      element.style.setProperty("--token-preview-resize-min-block-size", element.dataset.tokenPreviewResizeMinBlockSize ?? "");
      element.style.setProperty("--token-preview-resize-cursor", element.dataset.tokenPreviewResizeCursor ?? "");
      element.style.setProperty("--token-preview-resize-visual-color", element.dataset.tokenPreviewResizeVisualColor ?? "");
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-state]")) {
    if (element instanceof HTMLElement) {
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
      element.style.boxShadow = element.dataset.tokenPreviewShadow ?? "";
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
      element.style.setProperty("--token-preview-padding-block", element.dataset.tokenPreviewPaddingBlock ?? "");
      element.style.setProperty("--token-preview-padding-inline", element.dataset.tokenPreviewPaddingInline ?? "");
      element.style.setProperty("--token-preview-min-block-size", element.dataset.tokenPreviewMinBlockSize ?? "");
      element.style.setProperty("--token-preview-marker-min-block-size", element.dataset.tokenPreviewMarkerMinBlockSize ?? "");
      element.style.setProperty("--token-preview-accent", element.dataset.tokenPreviewAccent ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-frame-role]")) {
    if (element instanceof HTMLElement) {
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
      element.style.setProperty("--token-preview-supporting-foreground", element.dataset.tokenPreviewSupportingForeground ?? "");
      element.style.setProperty("--token-preview-icon-foreground", element.dataset.tokenPreviewIconForeground ?? "");
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
      element.style.setProperty("--token-preview-padding-block", element.dataset.tokenPreviewPaddingBlock ?? "");
      element.style.setProperty("--token-preview-padding-inline", element.dataset.tokenPreviewPaddingInline ?? "");
      element.style.setProperty("--token-preview-gap", element.dataset.tokenPreviewGap ?? "");
      element.style.setProperty("--token-preview-min-block-size", element.dataset.tokenPreviewMinBlockSize ?? "");
      element.style.setProperty("--token-preview-min-inline-size", element.dataset.tokenPreviewMinInlineSize ?? "");
      element.style.setProperty("--token-preview-max-inline-size", element.dataset.tokenPreviewMaxInlineSize ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-choice-columns]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-choice-columns", element.dataset.tokenPreviewChoiceColumns ?? "1");
      element.style.setProperty("--token-preview-choice-row-gap", element.dataset.tokenPreviewChoiceRowGap ?? "");
      element.style.setProperty("--token-preview-choice-column-gap", element.dataset.tokenPreviewChoiceColumnGap ?? "");
      element.style.setProperty(
        "--token-preview-choice-collapse-threshold",
        element.dataset.tokenPreviewChoiceCollapseThreshold ?? "",
      );
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-choice-affordance-glyph-inline-size]")) {
    if (element instanceof HTMLElement) {
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
      element.style.setProperty(
        "--token-preview-choice-affordance-glyph-inline-size",
        element.dataset.tokenPreviewChoiceAffordanceGlyphInlineSize ?? "",
      );
      element.style.setProperty(
        "--token-preview-choice-affordance-glyph-block-size",
        element.dataset.tokenPreviewChoiceAffordanceGlyphBlockSize ?? "",
      );
      element.style.setProperty(
        "--token-preview-choice-affordance-leading-inline-size",
        element.dataset.tokenPreviewChoiceAffordanceLeadingInlineSize ?? "",
      );
      element.style.setProperty(
        "--token-preview-choice-affordance-trailing-min-inline-size",
        element.dataset.tokenPreviewChoiceAffordanceTrailingMinInlineSize ?? "",
      );
      element.style.setProperty(
        "--token-preview-choice-affordance-gap",
        element.dataset.tokenPreviewChoiceAffordanceGap ?? "",
      );
      element.style.setProperty("--token-preview-font-family", element.dataset.tokenPreviewFontFamily ?? "");
      element.style.setProperty("--token-preview-font-size", element.dataset.tokenPreviewFontSize ?? "");
      element.style.setProperty("--token-preview-font-weight", element.dataset.tokenPreviewFontWeight ?? "");
      element.style.setProperty("--token-preview-line-height", element.dataset.tokenPreviewLineHeight ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-count-card-gap]")) {
    if (element instanceof HTMLElement) {
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
      element.style.setProperty("--token-preview-padding-block", element.dataset.tokenPreviewPaddingBlock ?? "");
      element.style.setProperty("--token-preview-padding-inline", element.dataset.tokenPreviewPaddingInline ?? "");
      element.style.setProperty("--token-preview-count-card-gap", element.dataset.tokenPreviewCountCardGap ?? "");
      element.style.setProperty(
        "--token-preview-count-card-count-background",
        element.dataset.tokenPreviewCountCardCountBackground ?? "",
      );
      element.style.setProperty(
        "--token-preview-count-card-count-foreground",
        element.dataset.tokenPreviewCountCardCountForeground ?? "",
      );
      element.style.setProperty(
        "--token-preview-count-card-count-border",
        element.dataset.tokenPreviewCountCardCountBorder ?? "",
      );
      element.style.setProperty(
        "--token-preview-count-card-count-min-inline-size",
        element.dataset.tokenPreviewCountCardCountMinInlineSize ?? "",
      );
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-toggle-track-inline-size]")) {
    if (element instanceof HTMLElement) {
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
      element.style.setProperty("--token-preview-toggle-track-inline-size", element.dataset.tokenPreviewToggleTrackInlineSize ?? "");
      element.style.setProperty("--token-preview-toggle-track-block-size", element.dataset.tokenPreviewToggleTrackBlockSize ?? "");
      element.style.setProperty("--token-preview-toggle-track-border-width", element.dataset.tokenPreviewToggleTrackBorderWidth ?? "");
      element.style.setProperty("--token-preview-toggle-thumb-background", element.dataset.tokenPreviewToggleThumbBackground ?? "");
      element.style.setProperty("--token-preview-toggle-thumb-inline-size", element.dataset.tokenPreviewToggleThumbInlineSize ?? "");
      element.style.setProperty("--token-preview-toggle-thumb-block-size", element.dataset.tokenPreviewToggleThumbBlockSize ?? "");
      element.style.setProperty("--token-preview-toggle-thumb-offset", element.dataset.tokenPreviewToggleThumbOffset ?? "");
      element.style.setProperty("--token-preview-toggle-track-padding", element.dataset.tokenPreviewToggleTrackPadding ?? "");
      element.style.setProperty("--token-preview-toggle-track-radius", element.dataset.tokenPreviewToggleTrackRadius ?? "");
      element.style.setProperty("--token-preview-toggle-thumb-radius", element.dataset.tokenPreviewToggleThumbRadius ?? "");
      element.style.setProperty("--token-preview-toggle-thumb-shadow", element.dataset.tokenPreviewToggleThumbShadow ?? "");
      element.style.setProperty("--token-preview-toggle-motion-duration", element.dataset.tokenPreviewToggleMotionDuration ?? "");
      element.style.setProperty("--token-preview-toggle-motion-easing", element.dataset.tokenPreviewToggleMotionEasing ?? "");
    }
  }
}

function isValidHex(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function applyDependencyOverrideDiagnostic(root, pageModel) {
  const diagnostic = pageModel.diagnostic;
  if (
    !diagnostic ||
    !["primary-color-source-override", "dependency-hex-override"].includes(diagnostic.kind)
  ) {
    return;
  }

  const input = root.querySelector("[data-token-diagnostic-hex-input]");
  const surfaceSelect = root.querySelector("[data-token-diagnostic-surface-select]");
  const reset = root.querySelector("[data-token-diagnostic-reset]");
  const sourceValue = root.querySelector("[data-token-diagnostic-source-value]");
  const status = root.querySelector("[data-token-diagnostic-status]");
  const source = root.querySelector("[data-token-diagnostic-role='source']");
  const subtle = root.querySelector("[data-token-diagnostic-role='subtle']");
  const label = root.querySelector("[data-token-diagnostic-role='label']");
  const ring = root.querySelector("[data-token-diagnostic-role='ring']");
  const tint = root.querySelector("[data-token-diagnostic-role='primary-tinted-background']");
  const foreground = root.querySelector("[data-token-diagnostic-role='primary-tinted-foreground']");
  const scrollbarThumb = root.querySelector("[data-token-diagnostic-role='scrollbar-thumb']");
  const scrollbarTrack = root.querySelector("[data-token-diagnostic-role='scrollbar-track']");
  const buttonBackground = root.querySelector("[data-token-diagnostic-role='button-background']");
  const buttonForeground = root.querySelector("[data-token-diagnostic-role='button-foreground']");
  const buttonBorder = root.querySelector("[data-token-diagnostic-role='button-border']");
  const choiceOptionBackground = root.querySelector("[data-token-diagnostic-role='choice-option-background']");
  const choiceOptionForeground = root.querySelector("[data-token-diagnostic-role='choice-option-foreground']");
  const choiceOptionBorder = root.querySelector("[data-token-diagnostic-role='choice-option-border']");
  const toggleTrackOn = root.querySelector("[data-token-diagnostic-role='toggle-track-on']");
  const toggleThumbOn = root.querySelector("[data-token-diagnostic-role='toggle-thumb-on']");
  const toggleBorderOn = root.querySelector("[data-token-diagnostic-role='toggle-border-on']");
  const statusBackground = root.querySelector("[data-token-diagnostic-role='status-background']");
  const statusForeground = root.querySelector("[data-token-diagnostic-role='status-foreground']");
  const statusBorder = root.querySelector("[data-token-diagnostic-role='status-border']");
  const statusSubtle = root.querySelector("[data-token-diagnostic-role='status-subtle']");
  const statusStrong = root.querySelector("[data-token-diagnostic-role='status-strong']");

  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const tintMixTarget = diagnostic.tintMixTarget ?? "white";
  const tintSourceRatio = diagnostic.tintSourceRatio ?? "12%";
  const foregroundMixTarget = diagnostic.foregroundMixTarget ?? "var(--ink)";
  const foregroundSourceRatio = diagnostic.foregroundSourceRatio ?? null;

  function selectedSurfaceValue() {
    if (surfaceSelect instanceof HTMLSelectElement && surfaceSelect.value) {
      return surfaceSelect.value;
    }

    return diagnostic.surfaceOptions?.[0]?.value ?? "white";
  }

  function render(hex) {
    const value = hex.trim();
    const surfaceValue = selectedSurfaceValue();
    const valid = isValidHex(value);
    input.setAttribute("aria-invalid", valid ? "false" : "true");

    if (status instanceof HTMLElement) {
      status.textContent = valid ? diagnostic.validStatus : diagnostic.invalidStatus;
    }

    if (!valid) {
      return;
    }

    if (source instanceof HTMLElement) {
      source.style.background = value;
    }
    if (subtle instanceof HTMLElement) {
      subtle.style.background = `color-mix(in srgb, ${value} 12%, white)`;
      subtle.style.color = value;
    }
    if (tint instanceof HTMLElement) {
      tint.style.background = `color-mix(in srgb, ${value} ${tintSourceRatio}, ${tintMixTarget})`;
      tint.style.color = diagnostic.tintForeground ?? "var(--ink)";
    }
    if (foreground instanceof HTMLElement) {
      foreground.style.background = `color-mix(in srgb, ${value} ${tintSourceRatio}, ${tintMixTarget})`;
      foreground.style.color = foregroundSourceRatio
        ? `color-mix(in srgb, ${value} ${foregroundSourceRatio}, ${foregroundMixTarget})`
        : value;
    }
    if (label instanceof HTMLElement) {
      label.style.background = "color-mix(in srgb, currentColor 5%, transparent)";
      label.style.color = foregroundSourceRatio
        ? `color-mix(in srgb, ${value} ${foregroundSourceRatio}, ${foregroundMixTarget})`
        : value;
    }
    if (ring instanceof HTMLElement) {
      ring.style.background = "var(--paper)";
      ring.style.color = "var(--ink)";
      ring.style.outline = `0.125rem solid color-mix(in srgb, ${value} 58%, white)`;
      ring.style.outlineOffset = "0.125rem";
    }
    if (scrollbarThumb instanceof HTMLElement) {
      scrollbarThumb.style.background = `color-mix(in srgb, ${value} 46%, white)`;
      scrollbarThumb.style.color = value;
    }
    if (scrollbarTrack instanceof HTMLElement) {
      scrollbarTrack.style.background = `color-mix(in srgb, ${value} 10%, white)`;
      scrollbarTrack.style.color = value;
    }
    if (buttonBackground instanceof HTMLElement) {
      buttonBackground.style.background = `color-mix(in srgb, ${value} 10%, ${surfaceValue})`;
      buttonBackground.style.color = value;
    }
    if (buttonForeground instanceof HTMLElement) {
      buttonForeground.style.background = `color-mix(in srgb, ${value} 10%, ${surfaceValue})`;
      buttonForeground.style.color = value;
    }
    if (buttonBorder instanceof HTMLElement) {
      buttonBorder.style.background = surfaceValue;
      buttonBorder.style.color = value;
      buttonBorder.style.outline = `0.125rem solid color-mix(in srgb, ${value} 30%, ${surfaceValue})`;
      buttonBorder.style.outlineOffset = "0.125rem";
    }
    if (choiceOptionBackground instanceof HTMLElement) {
      choiceOptionBackground.style.background = `color-mix(in srgb, ${value} ${tintSourceRatio}, ${surfaceValue})`;
      choiceOptionBackground.style.color = value;
    }
    if (choiceOptionForeground instanceof HTMLElement) {
      choiceOptionForeground.style.background = `color-mix(in srgb, ${value} ${tintSourceRatio}, ${surfaceValue})`;
      choiceOptionForeground.style.color = foregroundSourceRatio
        ? `color-mix(in srgb, ${value} ${foregroundSourceRatio}, ${foregroundMixTarget})`
        : value;
    }
    if (choiceOptionBorder instanceof HTMLElement) {
      choiceOptionBorder.style.background = surfaceValue;
      choiceOptionBorder.style.color = value;
      choiceOptionBorder.style.outline = `0.125rem solid color-mix(in srgb, ${value} 68%, ${surfaceValue})`;
      choiceOptionBorder.style.outlineOffset = "0.125rem";
    }
    if (toggleTrackOn instanceof HTMLElement) {
      toggleTrackOn.style.background = `color-mix(in srgb, ${value} ${tintSourceRatio}, ${surfaceValue})`;
      toggleTrackOn.style.color = value;
    }
    if (toggleThumbOn instanceof HTMLElement) {
      toggleThumbOn.style.background = surfaceValue;
      toggleThumbOn.style.color = foregroundSourceRatio
        ? `color-mix(in srgb, ${value} ${foregroundSourceRatio}, ${foregroundMixTarget})`
        : value;
    }
    if (toggleBorderOn instanceof HTMLElement) {
      toggleBorderOn.style.background = surfaceValue;
      toggleBorderOn.style.color = value;
      toggleBorderOn.style.outline = `0.125rem solid color-mix(in srgb, ${
        foregroundSourceRatio
          ? `color-mix(in srgb, ${value} ${foregroundSourceRatio}, ${foregroundMixTarget})`
          : value
      } 68%, ${surfaceValue})`;
      toggleBorderOn.style.outlineOffset = "0.125rem";
    }
    if (statusBackground instanceof HTMLElement) {
      statusBackground.style.background = `color-mix(in srgb, ${value} 8%, ${surfaceValue})`;
      statusBackground.style.color = value;
    }
    if (statusForeground instanceof HTMLElement) {
      statusForeground.style.background = surfaceValue;
      statusForeground.style.color = value;
    }
    if (statusBorder instanceof HTMLElement) {
      statusBorder.style.background = surfaceValue;
      statusBorder.style.color = value;
      statusBorder.style.outline = `0.125rem solid color-mix(in srgb, ${value} 54%, ${surfaceValue})`;
      statusBorder.style.outlineOffset = "0.125rem";
    }
    if (statusSubtle instanceof HTMLElement) {
      statusSubtle.style.background = `color-mix(in srgb, ${value} 6%, ${surfaceValue})`;
      statusSubtle.style.color = value;
    }
    if (statusStrong instanceof HTMLElement) {
      statusStrong.style.background = `color-mix(in srgb, ${value} 16%, ${surfaceValue})`;
      statusStrong.style.color = value;
    }
    if (sourceValue instanceof HTMLElement) {
      sourceValue.textContent = value.toLowerCase();
    }
  }

  input.addEventListener("input", () => render(input.value));

  if (surfaceSelect instanceof HTMLSelectElement) {
    surfaceSelect.addEventListener("change", () => render(input.value));
  }

  if (reset instanceof HTMLButtonElement) {
    reset.addEventListener("click", () => {
      input.value = diagnostic.defaultHex;
      if (surfaceSelect instanceof HTMLSelectElement) {
        surfaceSelect.selectedIndex = 0;
      }
      render(input.value);
      input.focus();
    });
  }

  render(input.value);
}

function remToNumber(value) {
  const text = String(value ?? "").trim();
  return text.endsWith("rem") ? Number.parseFloat(text) : Number.NaN;
}

function percentToNumber(value) {
  const text = String(value ?? "").trim();
  return text.endsWith("%") ? Number.parseFloat(text) : Number.NaN;
}

function remToPixels(value, ownerDocument = document) {
  const remValue = remToNumber(value);
  if (!Number.isFinite(remValue)) {
    return Number.NaN;
  }
  const root = ownerDocument?.documentElement;
  const fontSize = root ? Number.parseFloat(ownerDocument.defaultView?.getComputedStyle(root).fontSize) : 16;
  return remValue * (Number.isFinite(fontSize) ? fontSize : 16);
}

function applyInlineSizeRangeDiagnostic(root, pageModel) {
  const diagnostic = pageModel.diagnostic;
  if (!diagnostic || diagnostic.kind !== "inline-size-range") {
    return;
  }

  const input = root.querySelector("[data-token-diagnostic-inline-size-input]");
  const preview = root.querySelector("[data-token-diagnostic-inline-size-preview]");
  const status = root.querySelector("[data-token-diagnostic-inline-size-status]");
  if (!(input instanceof HTMLInputElement) || !(preview instanceof HTMLElement)) {
    return;
  }

  const minRem = remToNumber(input.dataset.tokenDiagnosticMinValue);
  const maxRem = remToNumber(input.dataset.tokenDiagnosticMaxValue);
  const maxPercent = percentToNumber(input.dataset.tokenDiagnosticMaxValue);
  const initialRem = remToNumber(input.dataset.tokenDiagnosticDefaultValue);
  if (!Number.isFinite(minRem) || !Number.isFinite(initialRem)) {
    return;
  }

  const usesAvailableWidthMax = Number.isFinite(maxPercent);
  const ownerDocument = preview.ownerDocument;
  const minPx = remToPixels(input.dataset.tokenDiagnosticMinValue, ownerDocument);
  const initialPx = remToPixels(input.dataset.tokenDiagnosticDefaultValue, ownerDocument);
  const maxPx = usesAvailableWidthMax
    ? Math.max(minPx, preview.parentElement?.clientWidth ?? minPx)
    : remToPixels(input.dataset.tokenDiagnosticMaxValue, ownerDocument);
  if (!Number.isFinite(minPx) || !Number.isFinite(maxPx) || !Number.isFinite(initialPx)) {
    return;
  }

  input.min = String(Math.round(minPx));
  input.max = String(Math.round(maxPx));
  input.step = "4";
  input.value = String(Math.min(Math.max(Math.round(initialPx), Math.round(minPx)), Math.round(maxPx)));

  function render() {
    const widthPx = Number(input.value);
    const width = `${Math.round(widthPx)}px`;
    preview.style.inlineSize = width;
    if (status instanceof HTMLElement) {
      const remWidth = widthPx / 16;
      const widthText = usesAvailableWidthMax && Math.abs(widthPx - maxPx) < 4
        ? `${input.dataset.tokenDiagnosticMaxValue} available width`
        : `${remWidth.toFixed(2).replace(/\.00$/, "")}rem`;
      status.textContent = `${diagnostic.statusPrefix}: ${widthText}`;
    }
  }

  input.addEventListener("input", render);
  render();
}

export function renderTokenSpecPage({ pageModel, target = document }) {
  const root = target.querySelector("[data-token-spec-page]");
  if (!(root instanceof HTMLElement)) {
    throw new Error("Token spec page root not found.");
  }

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">${escapeHtml(pageModel.tokenType)}</p>
          <h1>${escapeHtml(pageModel.title)}</h1>
          <p>${escapeHtml(pageModel.description)}</p>
        </section>

        ${renderSummaryPanels(pageModel)}

        ${renderDependencyOverrideDiagnostic(pageModel)}
        ${renderInlineSizeRangeDiagnostic(pageModel)}

        <section class="token-spec-section" aria-label="Token variants">
          <div class="token-spec-section-header">
            <h2>Token Variants</h2>
            <p>${escapeHtml(pageModel.variantSectionDescription)}</p>
          </div>
          <div class="token-spec-card-list">
            ${pageModel.variants.map((variant) => renderVariantCard(pageModel, variant)).join("")}
          </div>
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Consumer Restrictions</h2>
            <ul>${renderList(pageModel.consumerRestrictions)}</ul>
          </article>

          <article class="token-spec-note">
            <h2>Evidence Summary</h2>
            <ul>${renderList(pageModel.requiredEvidence)}</ul>
          </article>
        </section>
      </div>
    </section>
  `;

  applyPreviewStyles(root);
  applyChoiceAffordanceDisclosure(root);
  applyDependencyOverrideDiagnostic(root, pageModel);
  applyInlineSizeRangeDiagnostic(root, pageModel);
}

function applyChoiceAffordanceDisclosure(root) {
  const previews = Array.from(root.querySelectorAll(".token-spec-choice-affordance-preview"));

  function hasOverflow(element) {
    return element.scrollWidth > element.clientWidth + 1;
  }

  function positionTooltip(preview) {
    const tooltip = preview.querySelector("[data-token-choice-affordance-tooltip]");
    if (!(tooltip instanceof HTMLElement)) {
      return;
    }
    const previewBox = preview.getBoundingClientRect();
    const tooltipBox = tooltip.getBoundingClientRect();
    const viewport = preview.ownerDocument.defaultView;
    const gutter = 8;
    const width = tooltipBox.width || Math.min(320, Math.max(160, previewBox.width));
    const height = tooltipBox.height || 48;
    const viewportWidth = viewport?.innerWidth ?? 0;
    const viewportHeight = viewport?.innerHeight ?? 0;
    const top = previewBox.top - height - gutter >= gutter
      ? previewBox.top - height - gutter
      : Math.min(previewBox.bottom + gutter, Math.max(gutter, viewportHeight - height - gutter));
    const left = Math.min(Math.max(previewBox.left, gutter), Math.max(gutter, viewportWidth - width - gutter));
    tooltip.style.setProperty("--token-choice-affordance-tooltip-top", `${Math.round(top)}px`);
    tooltip.style.setProperty("--token-choice-affordance-tooltip-left", `${Math.round(left)}px`);
  }

  function updateOverflow(preview) {
    const sources = Array.from(preview.querySelectorAll("[data-token-choice-affordance-disclosure-source]"));
    const overflows = sources.some((source) => source instanceof HTMLElement && hasOverflow(source));
    preview.dataset.tokenChoiceAffordanceOverflow = overflows ? "true" : "false";
    if (!overflows) {
      preview.dataset.tokenChoiceAffordanceOpen = "false";
    }
  }

  function setOpen(preview, open) {
    const canOpen = preview.dataset.tokenChoiceAffordanceOverflow === "true";
    preview.dataset.tokenChoiceAffordanceOpen = open && canOpen ? "true" : "false";
    if (open && canOpen) {
      positionTooltip(preview);
      requestAnimationFrame(() => positionTooltip(preview));
    }
  }

  for (const preview of previews) {
    if (!(preview instanceof HTMLElement)) {
      continue;
    }
    updateOverflow(preview);
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => updateOverflow(preview));
      observer.observe(preview);
    }
    preview.addEventListener("pointerenter", () => setOpen(preview, true));
    preview.addEventListener("pointerleave", () => setOpen(preview, false));
  }
}
