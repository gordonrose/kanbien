const defaultPanelConfig = {
  panelId: "list-page-detail-panel",
  titleId: "list-page-detail-title",
  metaId: "list-page-detail-meta",
  subtitleId: "list-page-detail-subtitle",
  descriptionId: "list-page-detail-description",
  tagsId: "list-page-detail-tags",
  closeId: "list-page-detail-close",
  prevId: "list-page-detail-prev",
  nextId: "list-page-detail-next",
  nextAnchorId: "list-page-detail-next-anchor",
  meta: "Meta Field",
  title: "Title Field",
  subtitle: "Subtitle Field",
  description: "Long Description Field",
  hidden: true,
  mode: "view",
  editBinding: true,
  viewActions: true,
  formActions: true,
  formTemplate: true,
  formHidden: true,
  formListBindings: true,
  formId: "list-page",
  formStatusMessage: "",
  childSeam: true,
  indexedDetail: false,
};

function attr(name, value) {
  if (value === false || value === null || value === undefined || value === "") {
    return "";
  }

  return ` ${name}${value === true ? "" : `="${String(value)}"`}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getBooleanAttribute(element, name, fallback = false) {
  if (!(element instanceof HTMLElement) || !element.hasAttribute(name)) {
    return fallback;
  }

  const value = element.getAttribute(name);
  return value === "" || value === "true";
}

function isIndexedDetailPreviewRequested() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("drawerVariant") === "indexed";
}

function getPanelConfig(element) {
  if (!(element instanceof HTMLElement)) {
    return { ...defaultPanelConfig };
  }

  return {
    ...defaultPanelConfig,
    panelId: element.dataset.listDrawerShellPanelId || defaultPanelConfig.panelId,
    titleId: element.dataset.listDrawerShellTitleId || defaultPanelConfig.titleId,
    metaId: element.dataset.listDrawerShellMetaId || defaultPanelConfig.metaId,
    subtitleId: element.dataset.listDrawerShellSubtitleId || defaultPanelConfig.subtitleId,
    descriptionId: element.dataset.listDrawerShellDescriptionId || defaultPanelConfig.descriptionId,
    tagsId: element.dataset.listDrawerShellTagsId || defaultPanelConfig.tagsId,
    closeId: element.dataset.listDrawerShellCloseId || defaultPanelConfig.closeId,
    prevId: element.dataset.listDrawerShellPrevId || defaultPanelConfig.prevId,
    nextId: element.dataset.listDrawerShellNextId || defaultPanelConfig.nextId,
    nextAnchorId: element.dataset.listDrawerShellNextAnchorId || defaultPanelConfig.nextAnchorId,
    meta: element.dataset.listDrawerShellMeta || defaultPanelConfig.meta,
    title: element.dataset.listDrawerShellTitle || defaultPanelConfig.title,
    subtitle: element.dataset.listDrawerShellSubtitle || defaultPanelConfig.subtitle,
    description: element.dataset.listDrawerShellDescription || defaultPanelConfig.description,
    hidden: getBooleanAttribute(element, "data-list-drawer-shell-hidden", defaultPanelConfig.hidden),
    mode: element.dataset.listDrawerShellMode === "form" ? "form" : "view",
    editBinding: getBooleanAttribute(element, "data-list-drawer-shell-edit-binding", defaultPanelConfig.editBinding),
    viewActions: getBooleanAttribute(element, "data-list-drawer-shell-view-actions", defaultPanelConfig.viewActions),
    formActions: getBooleanAttribute(element, "data-list-drawer-shell-form-actions", defaultPanelConfig.formActions),
    formTemplate: getBooleanAttribute(element, "data-list-drawer-shell-form-template", defaultPanelConfig.formTemplate),
    formHidden: getBooleanAttribute(element, "data-list-drawer-shell-form-hidden", defaultPanelConfig.formHidden),
    formListBindings: getBooleanAttribute(element, "data-list-drawer-shell-form-list-bindings", defaultPanelConfig.formListBindings),
    formId: element.dataset.listDrawerShellFormId || defaultPanelConfig.formId,
    formStatusMessage: element.dataset.listDrawerShellFormStatusMessage || defaultPanelConfig.formStatusMessage,
    childSeam: getBooleanAttribute(element, "data-list-drawer-shell-child-seam", defaultPanelConfig.childSeam),
    indexedDetail: getBooleanAttribute(
      element,
      "data-list-drawer-shell-indexed-detail",
      isIndexedDetailPreviewRequested() || defaultPanelConfig.indexedDetail,
    ),
  };
}

export function renderListDetailSectionIndex({
  panelId = "list-page-detail-panel",
  ariaLabel = "Selected item sections",
  sections = [],
} = {}) {
  const normalizedSections = sections
    .map((section) => ({
      key: String(section?.key ?? "").trim(),
      label: String(section?.label ?? "").trim(),
      content: String(section?.content ?? ""),
      active: section?.active === true,
    }))
    .filter((section) => section.key && section.label);
  const activeKey = normalizedSections.find((section) => section.active)?.key ?? normalizedSections[0]?.key ?? "";

  return `
    <div class="list-page-detail-index-layout" data-selectable-list-detail-index-layout>
      <div
        class="list-page-detail-index"
        role="tablist"
        aria-label="${escapeHtml(ariaLabel)}"
        data-selectable-list-detail-index
      >
        ${normalizedSections.map((section) => {
          const isActive = section.key === activeKey;
          return `
            <button
              id="${escapeHtml(panelId)}-${escapeHtml(section.key)}-tab"
              class="list-page-detail-index-button form-drawer-select-option${isActive ? " active" : ""}"
              type="button"
              role="tab"
              aria-selected="${isActive ? "true" : "false"}"
              aria-controls="${escapeHtml(panelId)}-${escapeHtml(section.key)}-panel"
              tabindex="${isActive ? "0" : "-1"}"
              data-selectable-list-detail-aspect-option="${escapeHtml(section.key)}"
            >
              <span class="list-page-detail-index-label">${escapeHtml(section.label)}</span>
            </button>
          `;
        }).join("")}
      </div>
      ${normalizedSections.map((section) => {
        const isActive = section.key === activeKey;
        return `
          <section
            id="${escapeHtml(panelId)}-${escapeHtml(section.key)}-panel"
            class="list-page-detail-aspect-panel${isActive ? "" : " hidden"}"
            role="tabpanel"
            aria-labelledby="${escapeHtml(panelId)}-${escapeHtml(section.key)}-tab"
            ${isActive ? "" : 'aria-hidden="true"'}
            data-selectable-list-detail-aspect="${escapeHtml(section.key)}"
          >
            ${section.content}
          </section>
        `;
      }).join("")}
    </div>`.trim();
}

function renderIndexedDetailBody(config) {
  return `
    <div
      class="list-page-detail-error hidden"
      aria-live="polite"
      aria-hidden="true"
      data-selectable-list-detail-error
    >
      <p class="list-page-state-eyebrow">Detail unavailable</p>
      <h3 class="list-page-state-title">Detail content could not load</h3>
      <p class="list-page-state-description">
        This governed detail error stays local to the drawer so the parent master-detail layout remains intact.
      </p>
      <div class="list-page-state-actions">
        <button
          class="list-page-state-button"
          type="button"
          data-selectable-list-detail-retry
        >
          Retry detail load
        </button>
      </div>
    </div>
    ${renderListDetailSectionIndex({
      panelId: config.panelId,
      sections: [
        {
          key: "details",
          label: "Details",
          active: true,
          content: `
            <div class="list-page-detail-aspect-card">
              <p class="list-page-detail-aspect-eyebrow">Record summary</p>
              <p class="list-page-detail-aspect-title" data-selectable-list-detail-field="aspect-title">${escapeHtml(config.title)}</p>
              <p class="list-page-detail-aspect-copy" data-selectable-list-detail-field="aspect-subtitle">${escapeHtml(config.subtitle)}</p>
              <div
                id="${escapeHtml(config.tagsId)}"
                class="list-page-detail-tags"
                aria-label="Selected item tags"
                data-selectable-list-detail-field="tags"
              >
                <span class="list-page-tag">Tag Field 1</span>
                <span class="list-page-tag">Tag Field 2</span>
                <span class="list-page-tag">Tag Field 3</span>
              </div>
            </div>
          `,
        },
        {
          key: "picture",
          label: "Picture",
          content: `
            <div class="list-page-detail-picture-card">
              <div class="list-page-detail-picture-preview" aria-hidden="true">
                <span data-selectable-list-detail-field="picture-initials">TF</span>
              </div>
              <div class="list-page-detail-picture-copy">
                <p class="list-page-detail-aspect-eyebrow">Picture</p>
                <p class="list-page-detail-aspect-title" data-selectable-list-detail-field="picture-title">${escapeHtml(config.title)}</p>
                <p class="list-page-detail-aspect-copy" data-selectable-list-detail-field="picture-description">
                  Image preview area for the selected record.
                </p>
              </div>
            </div>
          `,
        },
        {
          key: "description",
          label: "Description",
          content: `
            <p
              id="${escapeHtml(config.descriptionId)}"
              class="list-page-detail-description"
              data-selectable-list-detail-field="description"
            >
              ${escapeHtml(config.description)}
            </p>
          `,
        },
      ],
    })}`.trim();
}

function renderPlainDetailBody(config) {
  return `
    <div
      class="list-page-detail-error hidden"
      aria-live="polite"
      aria-hidden="true"
      data-selectable-list-detail-error
    >
      <p class="list-page-state-eyebrow">Detail unavailable</p>
      <h3 class="list-page-state-title">Detail content could not load</h3>
      <p class="list-page-state-description">
        This governed detail error stays local to the drawer so the parent master-detail layout remains intact.
      </p>
      <div class="list-page-state-actions">
        <button
          class="list-page-state-button"
          type="button"
          data-selectable-list-detail-retry
        >
          Retry detail load
        </button>
      </div>
    </div>
    <p
      id="${escapeHtml(config.descriptionId)}"
      class="list-page-detail-description"
      data-selectable-list-detail-field="description"
    >
      ${escapeHtml(config.description)}
    </p>
    <div
      id="${escapeHtml(config.tagsId)}"
      class="list-page-detail-tags"
      aria-label="Selected item tags"
      data-selectable-list-detail-field="tags"
    >
      <span class="list-page-tag">Tag Field 1</span>
      <span class="list-page-tag">Tag Field 2</span>
      <span class="list-page-tag">Tag Field 3</span>
    </div>`.trim();
}

export function renderListDrawerPanel(options = {}) {
  const config = { ...defaultPanelConfig, ...options };
  const hiddenClass = config.hidden ? " hidden" : "";
  const ariaHidden = config.hidden ? "true" : "false";
  const viewHiddenClass = config.mode === "form" ? " hidden" : "";
  const viewAriaHidden = config.mode === "form" ? "true" : "false";
  const formActionsHiddenClass = config.mode === "form" ? "" : " hidden";
  const formActionsAriaHidden = config.mode === "form" ? "false" : "true";

  return `
<aside
  id="${escapeHtml(config.panelId)}"
  class="list-page-detail-panel${hiddenClass}"
  aria-labelledby="${escapeHtml(config.titleId)}"
  aria-hidden="${ariaHidden}"
  data-selectable-list-detail-panel
  data-list-drawer-shell-source="list-drawer-shell"
  data-list-detail-split-layout-slot="detail"${attr("data-list-page-child-seam", config.childSeam ? "list-detail-panel" : "")}
>
  <div class="list-page-detail-header">
    <div class="list-page-detail-copy">
      <p
        id="${escapeHtml(config.metaId)}"
        class="list-page-detail-meta tooltip-anchor"
        data-selectable-list-detail-field="meta"
        data-overflow-tooltip-source
      >
        ${escapeHtml(config.meta)}
      </p>
      <h2
        id="${escapeHtml(config.titleId)}"
        class="list-page-detail-title"
        data-selectable-list-detail-field="title"
        tabindex="-1"
      >
        ${escapeHtml(config.title)}
      </h2>
      <p id="${escapeHtml(config.subtitleId)}" class="list-page-detail-subtitle" data-selectable-list-detail-field="subtitle">${escapeHtml(config.subtitle)}</p>
    </div>
    <div class="list-page-detail-controls">
      <div class="list-page-detail-action-row">
        <button class="list-page-detail-action-button" type="button"${attr("data-selectable-list-edit", config.editBinding)}>Edit</button>
        <button class="list-page-detail-action-button" type="button">Share</button>
        <button id="${escapeHtml(config.closeId)}" class="drawer-close-button" type="button" aria-label="Close item details">
          ×
        </button>
      </div>
    </div>
  </div>

  <div class="list-page-detail-body${viewHiddenClass}" data-selectable-list-view-body aria-hidden="${viewAriaHidden}">
    ${config.indexedDetail ? renderIndexedDetailBody(config) : renderPlainDetailBody(config)}
  </div>

  ${config.formTemplate ? `<div
    data-drawer-form-template
    data-drawer-form-id="${escapeHtml(config.formId)}"
    data-drawer-form-hidden="${String(Boolean(config.formHidden))}"
    data-drawer-form-list-bindings="${String(Boolean(config.formListBindings))}"${attr("data-drawer-form-status-message", config.formStatusMessage)}
  ></div>` : ""}

  <div class="list-page-detail-footer">
    ${config.viewActions ? `<div class="list-page-detail-nav-row${viewHiddenClass}" data-selectable-list-view-actions aria-hidden="${viewAriaHidden}">
      <button
        id="${escapeHtml(config.prevId)}"
        class="list-page-detail-nav-button"
        type="button"
        aria-label="Show previous list item"
      >
        Previous
      </button>
      <span id="${escapeHtml(config.nextAnchorId)}" class="tooltip-anchor list-page-detail-nav-anchor">
        <button
          id="${escapeHtml(config.nextId)}"
          class="list-page-detail-nav-button"
          type="button"
          aria-label="Show next list item"
        >
          Next
        </button>
      </span>
    </div>` : ""}
    ${config.formActions ? `<div class="list-page-detail-nav-row list-page-form-actions${formActionsHiddenClass}" data-selectable-list-form-actions aria-hidden="${formActionsAriaHidden}">
      <button
        class="list-page-detail-nav-button"
        type="button"
        data-selectable-list-form-cancel
      >
        Cancel
      </button>
      <button
        class="list-page-detail-action-button"
        type="button"
        data-selectable-list-form-save
      >
        Save placeholder
      </button>
    </div>` : ""}
  </div>
</aside>`.trim();
}

export function renderListDrawerShell(options = {}) {
  const layoutId = options.layoutId || "list-drawer-shell-preview-layout";
  const listLabel = options.listLabel || "List items";
  const listTitle = options.listTitle || "Selected placeholder record";
  const listSubtitle = options.listSubtitle || "List host context stays visible beside the drawer form.";
  const panel = renderListDrawerPanel({
    panelId: "drawer-form-preview-panel",
    titleId: "drawer-form-preview-title",
    metaId: "drawer-form-preview-meta",
    subtitleId: "drawer-form-preview-subtitle",
    closeId: "drawer-form-preview-close",
    prevId: "drawer-form-preview-prev",
    nextId: "drawer-form-preview-next",
    nextAnchorId: "drawer-form-preview-next-anchor",
    meta: "Edit form",
    title: "Edit placeholder record",
    subtitle: "Shared drawer-form body hosted inside the signed-off list drawer shell.",
    hidden: false,
    mode: "form",
    editBinding: false,
    viewActions: false,
    formActions: true,
    formTemplate: true,
    formHidden: false,
    formListBindings: false,
    formId: "drawer-form-preview",
    formStatusMessage: "Editing the selected placeholder record.",
    childSeam: false,
    ...options.panel,
  });

  return `
<section class="list-page-shell">
  <section
    id="${escapeHtml(layoutId)}"
    class="list-page-shell-split detail-open"
    data-drawer-form-preview-layout
    data-selectable-list-layout
    data-list-drawer-shell-source="list-drawer-shell"
  >
    <div class="list-page-list-column" data-selectable-list-column aria-label="${escapeHtml(listLabel)}">
      <article class="list-page-card">
        <span class="list-page-card-title">${escapeHtml(listTitle)}</span>
        <span class="list-page-card-subtitle">${escapeHtml(listSubtitle)}</span>
      </article>
    </div>
    ${panel}
  </section>
</section>`.trim();
}

export function hydrateListDrawerShellTemplates(root = document) {
  const templates = Array.from(root.querySelectorAll("[data-list-drawer-shell-template]"));

  for (const template of templates) {
    if (!(template instanceof HTMLElement)) {
      continue;
    }

    const type = template.dataset.listDrawerShellTemplate || "panel";
    if (type === "split-layout") {
      template.innerHTML = renderListDrawerShell();
      template.dataset.listDrawerShellHydrated = "true";
      continue;
    }

    template.outerHTML = renderListDrawerPanel(getPanelConfig(template));
  }
}

if (typeof document !== "undefined") {
  hydrateListDrawerShellTemplates();
}
