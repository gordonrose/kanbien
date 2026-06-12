const root = document.querySelector("[data-default-proof-index-root]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Default proof index root is missing.");
}

const tokenFallbackSlugs = [
  "accordion-frame",
  "background-color",
  "body-region-frame",
  "button-frame",
  "choice-card-state-affordance",
  "choice-group-layout",
  "choice-option-frame",
  "count-card-frame",
  "detail-slot-frame",
  "drag-drop-affordance-frame",
  "drawer-overlay-placement",
  "dropdown-listbox-frame",
  "dropdown-trigger-frame",
  "error-text-style",
  "feedback-text-style",
  "field-container-frame",
  "field-row-frame",
  "field-value-text-style",
  "focus-ring",
  "icon-size",
  "index-nav-item-current-indicator",
  "index-nav-item-gap",
  "index-nav-item-padding",
  "index-nav-item-radius",
  "index-nav-item-surface",
  "index-nav-list-gap",
  "index-nav-panel-frame",
  "label-text-style",
  "menu-simple-select-frame",
  "minimum-target-size",
  "page-header-structure",
  "panel-corner-radius",
  "panel-frame",
  "panel-header-frame",
  "panel-stack-placement",
  "primary-color-source",
  "primary-tinted-background",
  "primary-tinted-foreground",
  "record-list-item-frame",
  "resize-handle",
  "scrollbar-skin",
  "status-color",
  "supporting-text-style",
  "text-control-frame",
  "textarea-growth",
  "toggle-frame",
  "tooltip-surface",
  "tooltip-text-style",
];

const primitiveSlugs = [
  "accordion-section-control",
  "body-region-control",
  "card-list-select",
  "count-card-control",
  "detail-slot-control",
  "field-container-control",
  "field-row-control",
  "focus-instruction-disclosure",
  "icon-button-control",
  "index-nav-item-control",
  "index-nav-panel-header-control",
  "menu-simple-select-control",
  "panel-header-control",
  "panel-surface-control",
  "radio-simple-select",
  "readiness-status-control",
  "record-list-item-control",
  "resize-handle-control",
  "scroll-region-control",
  "search-field-control",
  "simple-dropdown-control",
  "text-action-button-control",
  "text-field-control",
  "textarea-control",
  "toggle-control",
  "truncating-label",
];

const patternSlugs = [
  "accordion-form-section",
  "accordion-group",
  "card-list-select-field",
  "drawer-select",
  "drawer-select-field",
  "entity-body-panel",
  "entity-page-header",
  "entity-panel",
  "form-field-section",
  "header-menu-simple-select",
  "index-nav",
  "index-nav-item",
  "index-nav-label",
  "index-nav-list",
  "index-nav-panel",
  "panel-stack",
  "radio-simple-select-field",
  "record-list",
  "record-list-form",
  "searchable-selection-panel",
  "simple-dropdown-field",
  "toggle-field",
];

const groupRules = {
  tokens: [
    ["Foundation", ["background", "primary", "status", "focus", "minimum", "icon", "scrollbar"]],
    ["Text", ["label", "supporting", "feedback", "error", "field-value", "tooltip-text"]],
    ["Controls", ["button", "choice", "dropdown", "toggle", "text-control", "textarea", "field-container", "field-row", "menu-simple"]],
    ["Navigation", ["index-nav", "record-list"]],
    ["Panels", ["body-region", "detail-slot", "drawer", "panel", "accordion", "resize", "drag-drop", "count-card"]],
  ],
  primitives: [
    ["Fields", ["field", "text", "textarea", "search", "radio", "toggle", "simple-dropdown", "menu-simple"]],
    ["Selection", ["card-list", "count-card", "record-list", "readiness"]],
    ["Navigation", ["index-nav", "focus-instruction"]],
    ["Panel Controls", ["panel", "body-region", "detail-slot", "scroll-region", "resize", "accordion"]],
    ["Actions", ["icon-button", "text-action", "truncating"]],
  ],
  patterns: [
    ["Forms", ["form", "field", "accordion-group", "toggle-field", "radio", "simple-dropdown", "card-list"]],
    ["Navigation", ["index-nav", "header-menu"]],
    ["Entity Panels", ["entity"]],
    ["Records", ["record-list", "searchable-selection"]],
    ["Overlays", ["drawer", "panel-stack"]],
  ],
};

function slugToLabel(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function routeFor(layer, slug) {
  return `/design-system/default/${layer}/${slug}`;
}

function groupSlugs(layerKey, slugs) {
  const rules = groupRules[layerKey];
  const buckets = rules.map(([label]) => ({ label, slugs: [] }));
  const ungrouped = { label: "Other", slugs: [] };

  for (const slug of slugs) {
    const bucketIndex = rules.findIndex(([, markers]) => markers.some((marker) => slug.includes(marker)));
    (bucketIndex === -1 ? ungrouped : buckets[bucketIndex]).slugs.push(slug);
  }

  return [...buckets, ungrouped].filter((bucket) => bucket.slugs.length > 0);
}

function renderProofLink(layer, slug) {
  return `
    <div>
      <dt><a href="${escapeHtml(routeFor(layer, slug))}" data-default-proof-index-link>${escapeHtml(slugToLabel(slug))}</a></dt>
      <dd><code>${escapeHtml(slug)}</code></dd>
    </div>
  `;
}

function renderGroup(layer, group) {
  return `
    <article class="token-spec-note" data-default-proof-index-group aria-labelledby="default-proof-index-${layer}-${escapeHtml(group.label.toLowerCase().replace(/\s+/g, "-"))}">
      <h3 id="default-proof-index-${escapeHtml(`${layer}-${group.label.toLowerCase().replace(/\s+/g, "-")}`)}">${escapeHtml(group.label)}</h3>
      <p>${group.slugs.length} render proofs</p>
      <dl class="token-spec-definition-grid">
        ${group.slugs.map((slug) => renderProofLink(layer, slug)).join("")}
      </dl>
    </article>
  `;
}

function renderLayer({ layer, title, description, slugs }) {
  const groups = groupSlugs(layer, slugs);
  return `
    <section class="token-spec-section" data-default-proof-index-layer aria-labelledby="default-proof-index-${escapeHtml(layer)}">
      <div class="token-spec-section-header">
        <div>
          <p class="token-spec-kicker">${escapeHtml(layer)}</p>
          <h2 id="default-proof-index-${escapeHtml(layer)}">${escapeHtml(title)}</h2>
        </div>
        <p>${escapeHtml(description)}</p>
      </div>
      <div class="token-spec-two-column">
        ${groups.map((group) => renderGroup(layer, group)).join("")}
      </div>
    </section>
  `;
}

async function tokenSlugsFromManifest() {
  try {
    const response = await fetch("/design-system/systems/default/system.manifest.json");
    if (!response.ok) {
      return tokenFallbackSlugs;
    }
    const manifest = await response.json();
    const contracts = manifest?.contracts && typeof manifest.contracts === "object" ? manifest.contracts : {};
    const manifestSlugs = Object.keys(contracts)
      .filter((key) => key.startsWith("tokens."))
      .map((key) => key.slice("tokens.".length))
      .sort();
    return Array.from(new Set([...manifestSlugs, ...tokenFallbackSlugs])).sort();
  } catch {
    return tokenFallbackSlugs;
  }
}

async function render() {
  const tokenSlugs = await tokenSlugsFromManifest();
  const layers = [
    {
      layer: "tokens",
      title: "Token Proofs",
      description: "Primitive visual and structural decisions.",
      slugs: tokenSlugs,
    },
    {
      layer: "primitives",
      title: "Primitive Proofs",
      description: "Single-control render contracts built from signed tokens.",
      slugs: primitiveSlugs,
    },
    {
      layer: "patterns",
      title: "Pattern Proofs",
      description: "Compositions that stitch primitives and child patterns together.",
      slugs: patternSlugs,
    },
  ];

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">default system</p>
          <h1>Default Render Proofs</h1>
          <p>Token, primitive, and pattern render proofs grouped by layer and proof family.</p>
          <dl class="token-spec-definition-grid" data-default-proof-index-summary>
            ${layers
              .map(
                (layer) => `
                  <div>
                    <dt>${escapeHtml(layer.title.replace(" Proofs", ""))}</dt>
                    <dd>${layer.slugs.length}</dd>
                  </div>
                `,
              )
              .join("")}
          </dl>
        </section>
        ${layers.map(renderLayer).join("")}
      </div>
    </section>
  `;
}

render();
