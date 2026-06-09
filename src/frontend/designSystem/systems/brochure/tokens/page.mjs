import { renderListDrawerPanel } from "../../../assets/listDrawerShell.mjs";

export const brochureProofSlugs = new Set([
  "background-color",
  "button-frame",
  "content-width",
  "focus-ring",
  "label-text-style",
  "link-decoration",
  "link-text-style",
  "list-marker-style",
  "minimum-target-size",
  "panel-corner-radius",
  "pipeline-showcase-frame",
  "primary-color-source",
  "primary-tinted-background",
  "primary-tinted-foreground",
  "spacing-scale",
  "supporting-text-style",
  "surface-frame",
  "tooltip-surface",
  "tooltip-text-style",
  "typography-scale",
  "visual-proof-ornament",
]);

export const tokenEntries = [
  ["accordion-frame", "Accordion frame", "Controls the open and closed frame for expandable disclosure groups."],
  ["background-color", "Background color", "Sets the page environment so a design-system variant feels deliberate before any component renders."],
  ["body-region-frame", "Body region frame", "Defines the body area that holds main reading or working content inside a larger surface."],
  ["button-frame", "Button frame", "Keeps button size, shape, border, and pressable area consistent across actions."],
  ["choice-card-state-affordance", "Choice card state affordance", "Shows when a choice card is available, selected, focused, or unavailable."],
  ["choice-group-layout", "Choice group layout", "Arranges related choices so people can compare them without guessing the grouping."],
  ["choice-option-frame", "Choice option frame", "Governs the frame around a single option inside a selectable group."],
  ["content-width", "Content width", "Keeps public reading surfaces from becoming too narrow or too wide."],
  ["count-card-frame", "Count card frame", "Frames compact summary numbers so they scan as status evidence rather than body copy."],
  ["detail-slot-frame", "Detail slot frame", "Defines the small repeated areas that carry detail fields inside list and detail patterns."],
  ["drag-drop-affordance-frame", "Drag-drop affordance frame", "Makes draggable and droppable areas visible without changing the item data itself."],
  ["drawer-overlay-placement", "Drawer overlay placement", "Positions drawer overlays so they attach to the owning shell without hiding critical controls."],
  ["dropdown-listbox-frame", "Dropdown listbox frame", "Styles the opened option list for custom select controls."],
  ["dropdown-trigger-frame", "Dropdown trigger frame", "Styles the closed trigger that opens a custom select control."],
  ["error-text-style", "Error text style", "Makes validation and failure text readable without relying only on colour."],
  ["feedback-text-style", "Feedback text style", "Sets readable feedback text for neutral, warning, and error messages."],
  ["field-container-frame", "Field container frame", "Defines the outer frame for form fields and their supporting text."],
  ["field-row-frame", "Field row frame", "Places related field parts in a stable row under label and value pressure."],
  ["field-value-text-style", "Field value text style", "Sets the readable style for user-entered or system-filled field values."],
  ["focus-ring", "Focus ring", "Makes keyboard focus visible and consistent across controls."],
  ["icon-size", "Icon size", "Keeps icons proportionate to nearby text and hit targets."],
  ["index-nav-item-current-indicator", "Index nav item current indicator", "Marks the current item in an index-style navigation list."],
  ["index-nav-item-gap", "Index nav item gap", "Sets the spacing between repeated index navigation items."],
  ["index-nav-item-padding", "Index nav item padding", "Controls the internal space that makes index navigation items easy to scan and select."],
  ["index-nav-item-radius", "Index nav item radius", "Keeps index navigation corners consistent across states."],
  ["index-nav-item-surface", "Index nav item surface", "Defines the background and border treatment for index navigation items."],
  ["index-nav-list-gap", "Index nav list gap", "Sets the vertical rhythm for an index navigation stack."],
  ["index-nav-panel-frame", "Index nav panel frame", "Frames the navigation panel that holds an index list."],
  ["label-text-style", "Label text style", "Makes labels recognizable as labels rather than body copy or action text."],
  ["link-decoration", "Link decoration", "Keeps text links visibly link-like without inventing local underline rules."],
  ["link-text-style", "Link text style", "Sets the colour and weight that make links feel native to the current design system."],
  ["list-marker-style", "List marker style", "Styles bullets and markers so list evidence fits the surrounding page identity."],
  ["menu-simple-select-frame", "Menu simple select frame", "Frames compact menu-style select controls used in navigation and settings."],
  ["minimum-target-size", "Minimum target size", "Protects touch and pointer targets from becoming too small to use comfortably."],
  ["page-header-structure", "Page header structure", "Defines the reusable zones of a page header before individual pages fill them."],
  ["panel-corner-radius", "Panel corner radius", "Keeps panel corners consistent across proof cards, sections, and surfaces."],
  ["panel-frame", "Panel frame", "Defines the common border, background, and spacing for panels."],
  ["panel-header-frame", "Panel header frame", "Controls the top area of a panel where title, context, and actions sit."],
  ["panel-stack-placement", "Panel stack placement", "Sets the spacing rhythm when panels appear one after another."],
  ["pipeline-showcase-frame", "Pipeline showcase frame", "Frames the public pipeline step selector, dropdown, and content panel."],
  ["primary-color-source", "Primary color source", "Declares the core accent colour a system variant builds from."],
  ["primary-tinted-background", "Primary tinted background", "Creates subtle accent-backed surfaces without overwhelming the page."],
  ["primary-tinted-foreground", "Primary tinted foreground", "Keeps text and marks legible on primary-tinted surfaces."],
  ["record-list-item-frame", "Record list item frame", "Frames a repeated list item so selected and unselected rows behave predictably."],
  ["resize-handle", "Resize handle", "Makes adjustable regions discoverable without turning the whole surface into a control."],
  ["scrollbar-skin", "Scrollbar skin", "Styles scrollbars where the design system owns the scroll lane."],
  ["spacing-scale", "Spacing scale", "Sets the spacing rhythm shared by sections, controls, and repeated groups."],
  ["status-color", "Status color", "Maps status meaning to colours that can be reused consistently."],
  ["supporting-text-style", "Supporting text style", "Styles helper copy, notes, and descriptions beneath primary text."],
  ["surface-frame", "Surface frame", "Defines the main surface treatment for cards, panels, and proof areas."],
  ["text-control-frame", "Text control frame", "Frames text inputs and text-like controls consistently."],
  ["textarea-growth", "Textarea growth", "Controls how multi-line text fields resize under longer input."],
  ["toggle-frame", "Toggle frame", "Defines the size and state treatment for binary switch controls."],
  ["tooltip-surface", "Tooltip surface", "Frames tooltip content so overflow and help text remain readable."],
  ["tooltip-text-style", "Tooltip text style", "Sets the type treatment for tooltip copy."],
  ["typography-scale", "Typography scale", "Sets the text sizes and weights that give the brochure variant its reading hierarchy."],
  ["visual-proof-ornament", "Visual proof ornament", "Defines reusable diagram materials such as grid lines, chips, connectors, accents, and markers."],
];

function createTokenRow([slug, label, description]) {
  const hasBrochureProof = brochureProofSlugs.has(slug);
  const article = document.createElement("article");
  article.className = "public-site-token-row";
  article.dataset.brochureTokenSlug = slug;

  const header = document.createElement("div");
  header.className = "public-site-token-row-header";

  const copy = document.createElement("div");
  copy.className = "public-site-token-row-copy";

  const title = document.createElement("h2");
  title.textContent = label;

  const text = document.createElement("p");
  text.textContent = description;

  copy.append(title, text);

  const meta = document.createElement("dl");
  meta.className = "public-site-token-meta";
  meta.innerHTML = `<div><dt>Token</dt><dd>${slug}</dd></div><div><dt>Scope</dt><dd>${hasBrochureProof ? "Shared + brochure" : "Shared"}</dd></div>`;

  header.append(copy, meta);
  article.append(header);

  const action = document.createElement(hasBrochureProof ? "button" : "span");
  action.className = hasBrochureProof ? "public-site-text-link public-site-token-link" : "public-site-token-pending";
  action.textContent = hasBrochureProof ? "Preview render" : "Render page not available yet";
  if (hasBrochureProof) {
    action.type = "button";
    action.dataset.brochureTokenDrawerTrigger = slug;
    action.setAttribute("aria-haspopup", "dialog");
  }
  article.append(action);

  return article;
}

function ensureDrawer(root = document) {
  const host = root.querySelector("[data-brochure-token-drawer-host]");
  if (!(host instanceof HTMLElement)) {
    return null;
  }

  if (!host.querySelector("#brochure-token-render-drawer")) {
    host.innerHTML = renderListDrawerPanel({
      panelId: "brochure-token-render-drawer",
      titleId: "brochure-token-render-title",
      metaId: "brochure-token-render-meta",
      subtitleId: "brochure-token-render-subtitle",
      descriptionId: "brochure-token-render-description",
      tagsId: "brochure-token-render-tags",
      closeId: "brochure-token-render-close",
      meta: "Token render",
      title: "Token render",
      subtitle: "Rendered proof opens inside this list drawer.",
      description: "",
      hidden: true,
      editBinding: false,
      viewActions: false,
      formActions: false,
      formTemplate: false,
      childSeam: false,
    });
  }

  const panel = host.querySelector("#brochure-token-render-drawer");
  const title = host.querySelector("#brochure-token-render-title");
  const meta = host.querySelector("#brochure-token-render-meta");
  const subtitle = host.querySelector("#brochure-token-render-subtitle");
  const body = host.querySelector("[data-selectable-list-view-body]");
  const close = host.querySelector("#brochure-token-render-close");
  const backdrop = root.querySelector("[data-brochure-token-drawer-backdrop]");

  if (
    !(panel instanceof HTMLElement)
    || !(title instanceof HTMLElement)
    || !(meta instanceof HTMLElement)
    || !(subtitle instanceof HTMLElement)
    || !(body instanceof HTMLElement)
    || !(close instanceof HTMLButtonElement)
  ) {
    return null;
  }

  return {
    panel,
    title,
    meta,
    subtitle,
    body,
    close,
    backdrop: backdrop instanceof HTMLElement ? backdrop : null,
  };
}

function setDrawerOpen(drawer, open) {
  drawer.panel.classList.toggle("hidden", !open);
  drawer.panel.setAttribute("aria-hidden", open ? "false" : "true");
  drawer.backdrop?.toggleAttribute("hidden", !open);
  document.body.classList.toggle("public-site-token-drawer-open", open);
}

function hydrateDrawer(root = document) {
  const drawer = ensureDrawer(root);
  if (!drawer) {
    return;
  }

  let focusReturn = null;

  function closeDrawer({ restoreFocus = true } = {}) {
    setDrawerOpen(drawer, false);
    if (restoreFocus && focusReturn instanceof HTMLElement) {
      focusReturn.focus();
    }
    focusReturn = null;
  }

  function openDrawer(slug, trigger) {
    const entry = tokenEntries.find(([entrySlug]) => entrySlug === slug);
    if (!entry) {
      return;
    }

    const [, label, description] = entry;
    focusReturn = trigger instanceof HTMLElement ? trigger : null;
    drawer.meta.textContent = "Token render";
    drawer.title.textContent = label;
    drawer.subtitle.textContent = description;
    drawer.body.replaceChildren();

    const frame = document.createElement("iframe");
    frame.className = "public-site-token-render-frame";
    frame.title = `${label} rendered proof`;
    frame.src = `/design-system/brochure/tokens/${slug}`;
    frame.loading = "lazy";
    drawer.body.append(frame);

    setDrawerOpen(drawer, true);
    drawer.title.focus();
  }

  root.addEventListener("click", (event) => {
    const trigger = event.target instanceof Element
      ? event.target.closest("[data-brochure-token-drawer-trigger]")
      : null;

    if (trigger instanceof HTMLElement) {
      openDrawer(trigger.dataset.brochureTokenDrawerTrigger || "", trigger);
      return;
    }

    if (event.target === drawer.backdrop) {
      closeDrawer();
    }
  });

  drawer.close.addEventListener("click", () => closeDrawer());

  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !drawer.panel.classList.contains("hidden")) {
      event.preventDefault();
      closeDrawer();
    }
  });
}

function renderTokenList(root = document) {
  const mount = root.querySelector("[data-brochure-token-list]");
  if (!mount) {
    return;
  }

  mount.replaceChildren(...tokenEntries.map(createTokenRow));
  hydrateDrawer(root);
}

if (typeof document !== "undefined") {
  renderTokenList();
}
