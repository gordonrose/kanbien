import {
  floatingSubTabs,
  floatingTabCategories,
  floatingTabRows,
  mountFloatingTabHeader,
  renderFloatingTabHeader,
} from "/design-system/assets/floatingTabHeader.mjs?v=2026-05-08-overflow-tooltip-contract";

const buildBacklogInitialParams = new URLSearchParams({
  expandable: "true",
  categorySwitch: "true",
  subTabs: "true",
  attention: "true",
  tabs: "10",
  rowPacking: "single",
});

export function createRootAdminBuildBacklogPageController({
  root,
  getCurrentPage = () => "overview",
} = {}) {
  function renderShell() {
    if (!(root instanceof HTMLElement) || root.dataset.buildBacklogMounted === "true") {
      return;
    }

    root.innerHTML = `
      <section class="floating-tab-workspace" data-floating-tab-canvas="full" aria-labelledby="root-admin-build-backlog-title">
        <div class="floating-tab-project-shell">
          <div class="floating-tab-project-header">
            <div>
              <p class="floating-tab-project-kicker">Build</p>
              <h1 id="root-admin-build-backlog-title">Backlog</h1>
              <p class="component-catalog-meta">
                Root-admin proof surface for the signed-off floating tab header contract.
              </p>
            </div>
          </div>
          <div id="floating-tab-workspace" data-floating-tab-seam-mount="true">
            ${renderFloatingTabHeader({
              categories: floatingTabCategories,
              rowsByLabel: floatingTabRows,
              ariaLabel: "Build backlog views",
              tablistLabel: "Build backlog filters",
              subTabLabel: "Build backlog nested filters",
              panelKicker: "Backlog view",
            })}
            <p id="floating-tab-readout" class="visually-hidden" aria-live="polite">Viewing Active, 12 records</p>
          </div>
        </div>
      </section>
    `;
    root.dataset.buildBacklogMounted = "true";

    mountFloatingTabHeader({
      root,
      categories: floatingTabCategories,
      rowsByLabel: floatingTabRows,
      subTabsByLabel: floatingSubTabs,
      initialParams: buildBacklogInitialParams,
    });
  }

  return {
    syncPageState() {
      if (getCurrentPage() === "build-backlog") {
        renderShell();
      }
    },
    reset() {},
  };
}
