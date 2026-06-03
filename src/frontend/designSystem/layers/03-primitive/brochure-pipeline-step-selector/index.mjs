import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/brochure.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/brochure.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/brochure.mjs";
import { pipelineShowcaseFrameTokenSpec } from "../../02-token/pipeline-showcase-frame/systems/brochure.mjs";

const primitiveName = "brochure-pipeline-step-selector";
const eventName = "brochure-pipeline-step-selector:change";
const supportedSystems = new Map([
  [
    "brochure",
    {
      focusRingTokenSpec,
      labelTextStyleTokenSpec,
      minimumTargetSizeTokenSpec,
      pipelineShowcaseFrameTokenSpec,
    },
  ],
]);

function assertString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${fieldName} must be a non-empty string.`);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toAttributeString(attributes) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== null && value !== undefined && value !== false)
    .map(([key, value]) => (value === true ? key : `${key}="${escapeHtml(value)}"`))
    .join(" ");
}

function cssVarStyle(styleValues) {
  return Object.entries(styleValues)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
}

function getSystemProof(systemKey) {
  assertString(systemKey, "systemKey");
  const proof = supportedSystems.get(systemKey);
  if (!proof) {
    throw new RangeError(`brochure-pipeline-step-selector has no system proof for "${systemKey}".`);
  }
  return proof;
}

function findVariant(tokenSpec, predicate, missingMessage) {
  const variant = tokenSpec.variants.find(predicate);
  if (!variant) {
    throw new RangeError(missingMessage);
  }
  return variant;
}

function normalizeSteps(steps) {
  if (!Array.isArray(steps) || steps.length === 0) {
    throw new TypeError("steps must be a non-empty array.");
  }

  return steps.map((step, index) => {
    const id = step.id ?? `step-${String(index + 1).padStart(2, "0")}`;
    const label = step.label ?? "";
    const number = step.number ?? String(index + 1).padStart(2, "0");
    const panelId = step.panelId ?? `${id}-panel`;

    assertString(id, `steps[${index}].id`);
    assertString(label, `steps[${index}].label`);
    assertString(number, `steps[${index}].number`);
    assertString(panelId, `steps[${index}].panelId`);

    return { id, label, number, panelId };
  });
}

function tokenDependenciesFor({ systemKey }) {
  const proof = getSystemProof(systemKey);
  const inactiveFrame = findVariant(
    proof.pipelineShowcaseFrameTokenSpec,
    (variant) => variant.id === "pipeline-showcase-step-selector-inactive",
    "brochure-pipeline-step-selector requires a signed inactive pipeline frame token.",
  );
  const activeFrame = findVariant(
    proof.pipelineShowcaseFrameTokenSpec,
    (variant) => variant.id === "pipeline-showcase-step-selector-active",
    "brochure-pipeline-step-selector requires a signed active pipeline frame token.",
  );
  const dropdownFrame = findVariant(
    proof.pipelineShowcaseFrameTokenSpec,
    (variant) => variant.id === "pipeline-showcase-mobile-dropdown-selector",
    "brochure-pipeline-step-selector requires a signed mobile dropdown pipeline frame token.",
  );
  const focusRing = findVariant(
    proof.focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === "original",
    "brochure-pipeline-step-selector requires a signed original focus-ring token.",
  );
  const labelTextStyle = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "brochure-pipeline-step-selector requires a signed label-text-style token.",
  );
  const minimumTargetSize = findVariant(
    proof.minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "brochure-pipeline-step-selector requires a signed minimum-target-size token.",
  );

  return { activeFrame, dropdownFrame, focusRing, inactiveFrame, labelTextStyle, minimumTargetSize };
}

export const brochurePipelineStepSelectorPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/brochure-pipeline-step-selector/BrochurePipelineStepSelector-Contract.md",
  supportedSystems: ["brochure"],
  requiredTokens: ["pipeline-showcase-frame", "focus-ring", "label-text-style", "minimum-target-size"],
  eventName,
  consumerRules: [
    "Consumers must use this primitive for governed brochure pipeline step selectors.",
    "Consumers must not recreate tablist markup, select fallback markup, active-state synchronization, keyboard behavior, or token values locally.",
    "Consumers must listen for the primitive change event when they need to synchronize external panels.",
    "Consumers must not treat this primitive as the full pipeline showcase pattern, route state, analytics, or app adoption.",
  ],
};

export function brochurePipelineStepSelectorPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "brochure";
  const id = options.id ?? `brochure-pipeline-step-selector-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Pipeline";
  const steps = normalizeSteps(options.steps);
  const activeStepId = options.activeStepId ?? steps[0].id;

  assertString(id, "id");
  assertString(label, "label");

  if (!steps.some((step) => step.id === activeStepId)) {
    throw new RangeError(`activeStepId "${activeStepId}" does not match a provided step.`);
  }

  const tokens = tokenDependenciesFor({ systemKey });

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    id,
    label,
    activeStepId,
    steps,
    eventName,
    tokenDependencies: {
      inactiveFrame: {
        tokenName: tokens.inactiveFrame.tokenName,
        variantId: tokens.inactiveFrame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/systems/brochure.mjs#pipelineShowcaseFrameTokenSpec",
      },
      activeFrame: {
        tokenName: tokens.activeFrame.tokenName,
        variantId: tokens.activeFrame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/systems/brochure.mjs#pipelineShowcaseFrameTokenSpec",
      },
      dropdownFrame: {
        tokenName: tokens.dropdownFrame.tokenName,
        variantId: tokens.dropdownFrame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/systems/brochure.mjs#pipelineShowcaseFrameTokenSpec",
      },
      focusRing: {
        tokenName: tokens.focusRing.tokenName,
        variantId: tokens.focusRing.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/focus-ring/systems/brochure.mjs#focusRingTokenSpec",
      },
      labelTextStyle: {
        tokenName: tokens.labelTextStyle.tokenName,
        variantId: tokens.labelTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/brochure.mjs#labelTextStyleTokenSpec",
      },
      minimumTargetSize: {
        tokenName: tokens.minimumTargetSize.tokenName,
        variantId: tokens.minimumTargetSize.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/minimum-target-size/systems/brochure.mjs#minimumTargetSizeTokenSpec",
      },
    },
    semantics: {
      desktop: "tablist with roving focus and aria-selected state",
      mobile: "custom button-triggered listbox replacement selector",
      event: eventName,
      panelSync: "external consumers synchronize panels from the emitted change event",
    },
    styleVars: {
      "--primitive-brochure-pipeline-step-count": String(steps.length),
      "--primitive-brochure-pipeline-inactive-background": tokens.inactiveFrame.backgroundValue,
      "--primitive-brochure-pipeline-inactive-foreground": tokens.inactiveFrame.foregroundValue,
      "--primitive-brochure-pipeline-inactive-border": tokens.inactiveFrame.borderValue,
      "--primitive-brochure-pipeline-inactive-border-width": tokens.inactiveFrame.borderWidthValue,
      "--primitive-brochure-pipeline-inactive-radius": tokens.inactiveFrame.radiusValue,
      "--primitive-brochure-pipeline-inactive-shadow": tokens.inactiveFrame.shadowValue,
      "--primitive-brochure-pipeline-inactive-padding-block": tokens.inactiveFrame.paddingBlockValue,
      "--primitive-brochure-pipeline-inactive-padding-inline": tokens.inactiveFrame.paddingInlineValue,
      "--primitive-brochure-pipeline-inactive-min-block-size": tokens.inactiveFrame.minBlockSizeValue,
      "--primitive-brochure-pipeline-inactive-gap": tokens.inactiveFrame.gapValue,
      "--primitive-brochure-pipeline-active-background": tokens.activeFrame.backgroundValue,
      "--primitive-brochure-pipeline-active-foreground": tokens.activeFrame.foregroundValue,
      "--primitive-brochure-pipeline-active-border": tokens.activeFrame.borderValue,
      "--primitive-brochure-pipeline-active-border-width": tokens.activeFrame.borderWidthValue,
      "--primitive-brochure-pipeline-active-shadow": tokens.activeFrame.shadowValue,
      "--primitive-brochure-pipeline-dropdown-background": tokens.dropdownFrame.backgroundValue,
      "--primitive-brochure-pipeline-dropdown-foreground": tokens.dropdownFrame.foregroundValue,
      "--primitive-brochure-pipeline-dropdown-border": tokens.dropdownFrame.borderValue,
      "--primitive-brochure-pipeline-dropdown-border-width": tokens.dropdownFrame.borderWidthValue,
      "--primitive-brochure-pipeline-dropdown-radius": tokens.dropdownFrame.radiusValue,
      "--primitive-brochure-pipeline-dropdown-shadow": tokens.dropdownFrame.shadowValue,
      "--primitive-brochure-pipeline-dropdown-padding-block": tokens.dropdownFrame.paddingBlockValue,
      "--primitive-brochure-pipeline-dropdown-padding-inline": tokens.dropdownFrame.paddingInlineValue,
      "--primitive-brochure-pipeline-dropdown-min-block-size": tokens.dropdownFrame.minBlockSizeValue,
      "--primitive-brochure-pipeline-focus-ring": tokens.focusRing.ringValue,
      "--primitive-brochure-pipeline-focus-ring-offset": tokens.focusRing.offsetValue,
      "--primitive-brochure-pipeline-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-brochure-pipeline-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-brochure-pipeline-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-brochure-pipeline-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-brochure-pipeline-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-brochure-pipeline-text-transform": tokens.labelTextStyle.textTransform,
      "--primitive-brochure-pipeline-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-brochure-pipeline-min-height": tokens.minimumTargetSize.minimumHeight,
    },
    consumerRestrictions: brochurePipelineStepSelectorPrimitiveContract.consumerRules,
  };
}

export function renderBrochurePipelineStepSelectorPrimitive(options = {}) {
  const spec = brochurePipelineStepSelectorPrimitive(options);
  const containerAttributes = {
    id: spec.id,
    class: "ds-brochure-pipeline-step-selector",
    "data-brochure-pipeline-step-selector": "",
    "data-brochure-pipeline-step-selector-active-step-id": spec.activeStepId,
    "data-brochure-pipeline-step-selector-style": cssVarStyle(spec.styleVars),
  };
  const tablistId = `${spec.id}-tabs`;
  const selectTriggerId = `${spec.id}-select-trigger`;
  const selectListboxId = `${spec.id}-select-listbox`;
  const activeStep = spec.steps.find((step) => step.id === spec.activeStepId) ?? spec.steps[0];

  return `
    <div ${toAttributeString(containerAttributes)}>
      <div
        class="ds-brochure-pipeline-step-selector-select"
        data-brochure-pipeline-step-selector-select
      >
        <input
          type="hidden"
          value="${escapeHtml(spec.activeStepId)}"
          data-brochure-pipeline-step-selector-select-value
        />
        <button
          id="${escapeHtml(selectTriggerId)}"
          class="ds-brochure-pipeline-step-selector-select-trigger"
          type="button"
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-controls="${escapeHtml(selectListboxId)}"
          aria-label="${escapeHtml(`${spec.label} step: ${activeStep.number} ${activeStep.label}`)}"
          data-brochure-pipeline-step-selector-select-trigger
        >
          <span class="ds-brochure-pipeline-step-selector-select-trigger-label" data-brochure-pipeline-step-selector-select-label>
            ${escapeHtml(`${activeStep.number} ${activeStep.label}`)}
          </span>
          <span class="ds-brochure-pipeline-step-selector-select-trigger-icon" aria-hidden="true"></span>
        </button>
        <div
          id="${escapeHtml(selectListboxId)}"
          class="ds-brochure-pipeline-step-selector-select-menu"
          hidden
          data-brochure-pipeline-step-selector-select-menu
        >
          <div
            class="ds-brochure-pipeline-step-selector-select-listbox"
            role="listbox"
            tabindex="-1"
            aria-label="${escapeHtml(spec.label)} step"
            data-brochure-pipeline-step-selector-select-listbox
          >
            ${spec.steps
              .map((step) => {
                const active = step.id === spec.activeStepId;
                return `
                  <button
                    class="ds-brochure-pipeline-step-selector-select-option${active ? " is-active" : ""}"
                    type="button"
                    role="option"
                    aria-selected="${active ? "true" : "false"}"
                    tabindex="-1"
                    data-brochure-pipeline-step-selector-select-option
                    data-brochure-pipeline-step-id="${escapeHtml(step.id)}"
                  >
                    <span class="ds-brochure-pipeline-step-selector-select-option-number">${escapeHtml(step.number)}</span>
                    <span class="ds-brochure-pipeline-step-selector-select-option-label">${escapeHtml(step.label)}</span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>
      </div>
      <div
        id="${escapeHtml(tablistId)}"
        class="ds-brochure-pipeline-step-selector-tabs"
        role="tablist"
        aria-label="${escapeHtml(spec.label)}"
        data-brochure-pipeline-step-selector-tabs
      >
        ${spec.steps
          .map((step) => {
            const active = step.id === spec.activeStepId;
            return `
              <button
                id="${escapeHtml(`${spec.id}-tab-${step.id}`)}"
                class="ds-brochure-pipeline-step-selector-tab${active ? " is-active" : ""}"
                type="button"
                role="tab"
                aria-selected="${active ? "true" : "false"}"
                aria-controls="${escapeHtml(step.panelId)}"
                tabindex="${active ? "0" : "-1"}"
                data-brochure-pipeline-step-selector-tab
                data-brochure-pipeline-step-id="${escapeHtml(step.id)}"
              >
                <span class="ds-brochure-pipeline-step-selector-number">${escapeHtml(step.number)}</span>
                <span class="ds-brochure-pipeline-step-selector-label">${escapeHtml(step.label)}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

export function attachBrochurePipelineStepSelectorPrimitive(root = document) {
  function applyDeclaredStyles(container) {
    const styleDeclaration = container.getAttribute("data-brochure-pipeline-step-selector-style");
    if (!styleDeclaration) {
      return;
    }

    for (const declaration of styleDeclaration.split(";")) {
      const separatorIndex = declaration.indexOf(":");
      if (separatorIndex === -1) {
        continue;
      }

      const property = declaration.slice(0, separatorIndex).trim();
      const value = declaration.slice(separatorIndex + 1).trim();
      if (property && value) {
        container.style.setProperty(property, value);
      }
    }
  }

  function tabsFor(container) {
    return Array.from(container.querySelectorAll("[data-brochure-pipeline-step-selector-tab]")).filter(
      (tab) => tab instanceof HTMLButtonElement,
    );
  }

  function selectOptionsFor(container) {
    return Array.from(container.querySelectorAll("[data-brochure-pipeline-step-selector-select-option]")).filter(
      (option) => option instanceof HTMLButtonElement,
    );
  }

  function stepLabelFor(container, stepId) {
    const option = selectOptionsFor(container).find((candidate) => candidate.dataset.brochurePipelineStepId === stepId);
    if (option instanceof HTMLElement) {
      return option.textContent?.replace(/\s+/g, " ").trim() ?? stepId;
    }
    const tab = tabsFor(container).find((candidate) => candidate.dataset.brochurePipelineStepId === stepId);
    return tab?.textContent?.replace(/\s+/g, " ").trim() ?? stepId;
  }

  function setOpen(container, open, { focusSelected = false } = {}) {
    const trigger = container.querySelector("[data-brochure-pipeline-step-selector-select-trigger]");
    const menu = container.querySelector("[data-brochure-pipeline-step-selector-select-menu]");
    if (!(trigger instanceof HTMLButtonElement) || !(menu instanceof HTMLElement)) {
      return;
    }

    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    menu.hidden = !open;
    container.dataset.brochurePipelineStepSelectorSelectOpen = open ? "true" : "false";

    if (open && focusSelected) {
      const selected = selectOptionsFor(container).find((option) => option.getAttribute("aria-selected") === "true");
      (selected ?? selectOptionsFor(container)[0])?.focus();
    }
  }

  function setActive(container, nextStepId, { focus = false, emit = true } = {}) {
    const tabs = tabsFor(container);
    const nextTab = tabs.find((tab) => tab.dataset.brochurePipelineStepId === nextStepId);
    if (!(nextTab instanceof HTMLButtonElement)) {
      return;
    }

    for (const tab of tabs) {
      const active = tab === nextTab;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
    }

    for (const option of selectOptionsFor(container)) {
      const active = option.dataset.brochurePipelineStepId === nextStepId;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-selected", active ? "true" : "false");
    }

    const label = stepLabelFor(container, nextStepId);
    const trigger = container.querySelector("[data-brochure-pipeline-step-selector-select-trigger]");
    const triggerLabel = container.querySelector("[data-brochure-pipeline-step-selector-select-label]");
    const selectValue = container.querySelector("[data-brochure-pipeline-step-selector-select-value]");
    if (trigger instanceof HTMLButtonElement) {
      const controlLabel = container.querySelector("[data-brochure-pipeline-step-selector-tabs]")?.getAttribute("aria-label") ?? "Pipeline";
      trigger.setAttribute("aria-label", `${controlLabel} step: ${label}`);
    }
    if (triggerLabel instanceof HTMLElement) {
      triggerLabel.textContent = label;
    }
    if (selectValue instanceof HTMLInputElement) {
      selectValue.value = nextStepId;
    }

    container.dataset.brochurePipelineStepSelectorActiveStepId = nextStepId;
    if (focus) {
      nextTab.focus();
    }
    if (emit) {
      container.dispatchEvent(
        new CustomEvent(eventName, {
          bubbles: true,
          detail: { activeStepId: nextStepId },
        }),
      );
    }
  }

  function moveSelectOption(container, currentOption, offset) {
    const options = selectOptionsFor(container);
    const currentIndex = options.indexOf(currentOption);
    if (currentIndex === -1) {
      return;
    }
    const nextIndex = (currentIndex + offset + options.length) % options.length;
    options[nextIndex]?.focus();
  }

  function move(container, currentTab, offset) {
    const tabs = tabsFor(container);
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex === -1) {
      return;
    }
    const nextIndex = (currentIndex + offset + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    if (nextTab instanceof HTMLButtonElement) {
      setActive(container, nextTab.dataset.brochurePipelineStepId, { focus: true });
    }
  }

  for (const container of root.querySelectorAll("[data-brochure-pipeline-step-selector]")) {
    if (!(container instanceof HTMLElement) || container.dataset.brochurePipelineStepSelectorController === "attached") {
      continue;
    }

    container.dataset.brochurePipelineStepSelectorController = "attached";
    applyDeclaredStyles(container);

    const selectTrigger = container.querySelector("[data-brochure-pipeline-step-selector-select-trigger]");
    if (selectTrigger instanceof HTMLButtonElement) {
      selectTrigger.addEventListener("click", () => {
        setOpen(container, container.dataset.brochurePipelineStepSelectorSelectOpen !== "true", { focusSelected: true });
      });
      selectTrigger.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen(container, true, { focusSelected: true });
        }
        if (event.key === "Escape") {
          event.preventDefault();
          setOpen(container, false);
        }
      });
    }

    for (const option of selectOptionsFor(container)) {
      option.addEventListener("click", () => {
        setActive(container, option.dataset.brochurePipelineStepId);
        setOpen(container, false);
        selectTrigger instanceof HTMLButtonElement && selectTrigger.focus();
      });
      option.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          moveSelectOption(container, option, 1);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          moveSelectOption(container, option, -1);
        }
        if (event.key === "Home") {
          event.preventDefault();
          selectOptionsFor(container)[0]?.focus();
        }
        if (event.key === "End") {
          event.preventDefault();
          const options = selectOptionsFor(container);
          options[options.length - 1]?.focus();
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActive(container, option.dataset.brochurePipelineStepId);
          setOpen(container, false);
          selectTrigger instanceof HTMLButtonElement && selectTrigger.focus();
        }
        if (event.key === "Escape") {
          event.preventDefault();
          setOpen(container, false);
          selectTrigger instanceof HTMLButtonElement && selectTrigger.focus();
        }
      });
    }

    for (const tab of tabsFor(container)) {
      tab.addEventListener("click", () => setActive(container, tab.dataset.brochurePipelineStepId));
      tab.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          move(container, tab, 1);
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          move(container, tab, -1);
        }
        if (event.key === "Home") {
          event.preventDefault();
          const first = tabsFor(container)[0];
          if (first instanceof HTMLButtonElement) {
            setActive(container, first.dataset.brochurePipelineStepId, { focus: true });
          }
        }
        if (event.key === "End") {
          event.preventDefault();
          const tabs = tabsFor(container);
          const last = tabs[tabs.length - 1];
          if (last instanceof HTMLButtonElement) {
            setActive(container, last.dataset.brochurePipelineStepId, { focus: true });
          }
        }
      });
    }

    document.addEventListener("pointerdown", (event) => {
      if (event.target instanceof Node && !container.contains(event.target)) {
        setOpen(container, false);
      }
    });
  }
}
