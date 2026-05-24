const allowedCardStructureCounts = new Set(["0", "5", "20"]);

function renderStructureSections(count = 5, label = "Filter card structure section") {
  return Array.from({ length: count }, () => `
                <section class="token-filter-panel-structure-filter-section" aria-label="${label}" data-filter-panel-structure-filter-section>
                  <div class="token-filter-panel-structure-card-slot" data-filter-panel-structure-card-slot></div>
                </section>`).join("");
}

function normalizeCardStructureCount(value) {
  const normalized = String(value);
  return allowedCardStructureCounts.has(normalized) ? normalized : "5";
}

function renderFilterSection(documentRef, label = "Filter card structure section") {
  const section = documentRef.createElement("section");
  section.className = "token-filter-panel-structure-filter-section";
  section.setAttribute("aria-label", label);
  section.dataset.filterPanelStructureFilterSection = "";

  const slot = documentRef.createElement("div");
  slot.className = "token-filter-panel-structure-card-slot";
  slot.dataset.filterPanelStructureCardSlot = "";
  section.append(slot);

  return section;
}

export function renderFilterPanelStructure({
  cardCount = "5",
  panelLabel = "Filter panel maps to columns 1 through 2",
  titleLabel = "Filter bar title section",
  sectionLabel = "Filter card structure section",
} = {}) {
  const normalizedCount = normalizeCardStructureCount(cardCount);

  return `
            <aside
              class="token-filter-panel-structure-panel"
              aria-label="${panelLabel}"
              data-filter-panel-structure-panel
              data-filter-panel-structure-card-count="${normalizedCount}"
            >
              <section
                class="token-filter-panel-structure-title-section"
                aria-label="${titleLabel}"
                data-filter-panel-structure-title-section
              >
                <div class="token-filter-panel-structure-title-main" data-filter-panel-structure-title-main></div>
                <div class="token-filter-panel-structure-title-action" data-filter-panel-structure-title-action></div>
              </section>
              <div class="token-filter-panel-structure-scroll-stack" data-filter-panel-structure-scroll-stack>${renderStructureSections(Number(normalizedCount), sectionLabel)}
              </div>
            </aside>`;
}

export function renderSearchPanelStructure({ cardCount = "5" } = {}) {
  const normalizedCount = normalizeCardStructureCount(cardCount);

  return `
            <aside
              class="token-filter-panel-structure-panel token-search-panel"
              aria-label="Search panel maps over the page and header structure"
              data-filter-panel-structure-panel
              data-filter-panel-structure-card-count="${normalizedCount}"
              data-search-panel
            >
              <section
                class="token-filter-panel-structure-title-section"
                aria-label="Search panel title section"
                data-filter-panel-structure-title-section
              >
                <div class="token-filter-panel-structure-title-main" data-filter-panel-structure-title-main></div>
                <div class="token-filter-panel-structure-title-action" data-filter-panel-structure-title-action></div>
              </section>
              <section
                class="token-search-panel-query-section"
                aria-label="Search input structure section"
                data-search-panel-query-section
              >
                <div class="token-search-panel-query-slot" data-search-panel-query-slot></div>
              </section>
              <div class="token-filter-panel-structure-scroll-stack" data-filter-panel-structure-scroll-stack>${renderStructureSections(Number(normalizedCount), "Search result structure section")}
              </div>
            </aside>`;
}

export function hydratePanelStructures(root = document) {
  for (const mount of root.querySelectorAll("[data-filter-panel-structure-mount]")) {
    if (mount instanceof HTMLElement && mount.childElementCount === 0) {
      mount.outerHTML = renderFilterPanelStructure({
        cardCount: mount.dataset.filterPanelStructureCardCount ?? "5",
      });
    }
  }

  for (const mount of root.querySelectorAll("[data-search-panel-structure-mount]")) {
    if (mount instanceof HTMLElement && mount.childElementCount === 0) {
      mount.outerHTML = renderSearchPanelStructure({
        cardCount: mount.dataset.filterPanelStructureCardCount ?? "5",
      });
    }
  }
}

export function createFilterPanelStructureController(root = document) {
  const panel = root.querySelector("[data-filter-panel-structure-panel]");

  if (!(panel instanceof HTMLElement)) {
    return null;
  }

  const scrollStack = panel.querySelector("[data-filter-panel-structure-scroll-stack]");
  if (!(scrollStack instanceof HTMLElement)) {
    return null;
  }

  const ownerDocument = panel.ownerDocument;
  const countButtons = Array.from(root.querySelectorAll("[data-filter-panel-structure-card-count-option]"))
    .filter((button) => button instanceof HTMLElement);

  function applyCardStructureCount(count) {
    const normalizedCount = normalizeCardStructureCount(count);
    const nextCount = Number(normalizedCount);
    const sectionLabel = panel.dataset.searchPanel === "" ? "Search result structure section" : "Filter card structure section";

    panel.dataset.filterPanelStructureCardCount = normalizedCount;
    scrollStack.querySelectorAll("[data-filter-panel-structure-filter-section]").forEach((section) => section.remove());

    for (let index = 0; index < nextCount; index += 1) {
      const section = renderFilterSection(ownerDocument, sectionLabel);
      scrollStack.append(section);
    }

    for (const button of countButtons) {
      const isActive = button.dataset.filterPanelStructureCardCountOption === normalizedCount;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }

    scrollStack.scrollTop = 0;
  }

  function mount() {
    for (const button of countButtons) {
      button.addEventListener("click", () => {
        applyCardStructureCount(button.dataset.filterPanelStructureCardCountOption);
      });
    }

    applyCardStructureCount(panel.dataset.filterPanelStructureCardCount ?? "5");
  }

  return {
    applyCardStructureCount,
    mount,
  };
}
