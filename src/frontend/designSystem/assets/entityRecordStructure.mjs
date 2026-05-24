function renderSpans(count) {
  return Array.from({ length: count }, () => "<span></span>").join("");
}

export function renderEntityRecordBody({
  pageResizeLabel = "Resize entity page index and panel regions",
  panelResizeLabel = "Resize panel index and content regions",
} = {}) {
  return `
    <div
      class="token-entity-page-structure-canvas"
      data-entity-page-structure-canvas
    >
      <aside class="token-entity-page-structure-index" aria-label="Navigation index columns">
        ${renderSpans(2)}
      </aside>
      <button
        class="token-entity-page-structure-resize-handle"
        type="button"
        aria-label="${pageResizeLabel}"
        aria-orientation="vertical"
        aria-valuemin="2"
        aria-valuemax="4"
        aria-valuenow="2"
        data-entity-page-structure-resize-handle
      ></button>
      <section class="token-entity-page-structure-panel" aria-label="Record panel columns">
        <div class="token-entity-page-structure-panel-header" aria-label="Record panel header columns">
          ${renderSpans(20)}
        </div>
        <div class="token-entity-page-structure-panel-body" aria-label="Record panel body columns">
          <aside class="token-entity-page-structure-panel-index" aria-label="Panel index columns">
            ${renderSpans(2)}
          </aside>
          <button
            class="token-entity-page-structure-panel-resize-handle"
            type="button"
            aria-label="${panelResizeLabel}"
            aria-orientation="vertical"
            aria-valuemin="2"
            aria-valuemax="4"
            aria-valuenow="2"
            data-entity-page-structure-panel-resize-handle
          ></button>
          <section class="token-entity-page-structure-panel-content" aria-label="Panel content columns">
            ${renderSpans(8)}
          </section>
        </div>
      </section>
    </div>
  `;
}

export function renderNestedEntityRecordStructure() {
  return `
    <div
      class="token-nested-entity-record-frame-shell"
      data-nested-entity-record-frame-shell
    >
      <div class="token-nested-entity-record-frame" data-nested-entity-record-frame>
        ${renderEntityRecordBody({
          pageResizeLabel: "Resize nested entity index and panel regions",
          panelResizeLabel: "Resize nested panel index and content regions",
        })}
      </div>
      <button
        class="token-nested-entity-record-resize-handle"
        type="button"
        aria-label="Resize nested entity record container"
        aria-orientation="vertical"
        data-nested-entity-record-resize-handle
      ></button>
      <button
        class="token-nested-entity-record-bottom-resize-handle"
        type="button"
        aria-label="Resize nested entity record container height"
        aria-orientation="horizontal"
        data-nested-entity-record-bottom-resize-handle
      ></button>
    </div>
  `;
}

export function hydrateEntityRecordStructures(root = document) {
  for (const mount of root.querySelectorAll("[data-entity-record-body-mount]")) {
    if (mount instanceof HTMLElement && mount.childElementCount === 0) {
      mount.outerHTML = renderEntityRecordBody();
    }
  }

  for (const mount of root.querySelectorAll("[data-nested-entity-record-structure-mount]")) {
    if (mount instanceof HTMLElement && mount.childElementCount === 0) {
      mount.outerHTML = renderNestedEntityRecordStructure();
    }
  }
}
