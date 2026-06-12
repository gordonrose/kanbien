import {
  attachSubNavigationPatternController,
  renderSubNavigationPattern,
  subNavigationPattern,
} from "../../../../layers/04-pattern-contract/sub-navigation/index.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTokenList(spec) {
  return Object.entries(spec.tokenDependencies)
    .map(
      ([label, dependency]) => `
        <div>
          <dt>${escapeHtml(label)}</dt>
          <dd><code>${escapeHtml(dependency.tokenName)}</code></dd>
        </div>
      `,
    )
    .join("");
}

const breadcrumbs = [
  { id: "home", label: "Home", href: "#home" },
  { id: "workspace", label: "Workspace", href: "#workspace" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "briefs", label: "Design briefs", href: "#briefs" },
  { id: "current", label: "Secondary navigation proof", current: true },
];

const root = document.querySelector("[data-pattern-proof-page]");
if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

const firstSpec = subNavigationPattern({ id: "sub-navigation-proof", breadcrumbs });

function render({
  mode = "auto",
  searchState = "empty",
  theme = "original",
  direction = "ltr",
  proofWidth = "wide",
} = {}) {
  root.innerHTML = `
    <section class="token-spec-page sub-navigation-pattern-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern</p>
          <h1>Sub Navigation Pattern</h1>
          <p>Review governed secondary breadcrumb and search composition across canonical row states.</p>
        </section>

        <section class="token-spec-section" aria-label="Pattern controls">
          <div class="pattern-proof-controls">
            <label>Mode
              <select data-sub-navigation-mode-control>
                <option value="auto" ${mode === "auto" ? "selected" : ""}>Auto resize</option>
                <option value="desktop" ${mode === "desktop" ? "selected" : ""}>Desktop</option>
                <option value="compressed" ${mode === "compressed" ? "selected" : ""}>Compressed</option>
                <option value="compact" ${mode === "compact" ? "selected" : ""}>Compact</option>
                <option value="mobile" ${mode === "mobile" ? "selected" : ""}>Mobile</option>
              </select>
            </label>
            <label>Search state
              <select data-sub-navigation-search-state-control>
                <option value="empty" ${searchState === "empty" ? "selected" : ""}>Empty</option>
                <option value="active" ${searchState === "active" ? "selected" : ""}>Active</option>
                <option value="filled" ${searchState === "filled" ? "selected" : ""}>Filled</option>
                <option value="disabled" ${searchState === "disabled" ? "selected" : ""}>Disabled</option>
                <option value="error" ${searchState === "error" ? "selected" : ""}>Error</option>
              </select>
            </label>
            <label>Theme
              <select data-sub-navigation-theme-control>
                <option value="original" ${theme === "original" ? "selected" : ""}>Original</option>
                <option value="dark" ${theme === "dark" ? "selected" : ""}>Dark</option>
                <option value="desert" ${theme === "desert" ? "selected" : ""}>Desert</option>
              </select>
            </label>
            <label>Direction
              <select data-sub-navigation-direction-control>
                <option value="ltr" ${direction === "ltr" ? "selected" : ""}>LTR</option>
                <option value="rtl" ${direction === "rtl" ? "selected" : ""}>RTL</option>
              </select>
            </label>
            <label>Proof width
              <select data-sub-navigation-width-control>
                <option value="wide" ${proofWidth === "wide" ? "selected" : ""}>Wide</option>
                <option value="roomy" ${proofWidth === "roomy" ? "selected" : ""}>Roomy</option>
                <option value="medium" ${proofWidth === "medium" ? "selected" : ""}>Medium</option>
                <option value="compact" ${proofWidth === "compact" ? "selected" : ""}>Compact</option>
                <option value="mobile" ${proofWidth === "mobile" ? "selected" : ""}>Mobile</option>
              </select>
            </label>
          </div>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="sub-navigation-pattern-proof-shell">
            <div class="sub-navigation-pattern-proof-stage" data-sub-navigation-proof-width="${escapeHtml(proofWidth)}">
              ${renderSubNavigationPattern({
                id: "sub-navigation-proof",
                mode,
                searchState,
                searchValue: searchState === "filled" ? "brief" : "",
                theme,
                direction,
                breadcrumbs,
                searchLabel: "Search this page",
                searchPlaceholder: "Search this page",
              })}
            </div>
            <p class="primitive-event-log" data-sub-navigation-pattern-log>
              Canonical checks: SNR-001 desktop / SNR-002 compressed / SNR-004 mobile / BCR hidden path / SSR mobile width.
            </p>
          </div>
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Token Dependencies</h2>
            <dl class="token-spec-definition-grid">${renderTokenList(firstSpec)}</dl>
          </article>
          <article class="token-spec-note">
            <h2>Boundary</h2>
            <ul>
              <li>The pattern composes breadcrumb and search-shell primitives.</li>
              <li>Auto mode switches row slots from rendered inline size.</li>
              <li>Search results, route hierarchy generation, and app adoption remain later layers.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;
  attachSubNavigationPatternController(root);
  root.querySelector("[data-sub-navigation-mode-control]")?.addEventListener("change", (event) => {
    render({ mode: event.target.value, searchState, theme, direction, proofWidth });
  });
  root.querySelector("[data-sub-navigation-search-state-control]")?.addEventListener("change", (event) => {
    render({ mode, searchState: event.target.value, theme, direction, proofWidth });
  });
  root.querySelector("[data-sub-navigation-theme-control]")?.addEventListener("change", (event) => {
    render({ mode, searchState, theme: event.target.value, direction, proofWidth });
  });
  root.querySelector("[data-sub-navigation-direction-control]")?.addEventListener("change", (event) => {
    render({ mode, searchState, theme, direction: event.target.value, proofWidth });
  });
  root.querySelector("[data-sub-navigation-width-control]")?.addEventListener("change", (event) => {
    render({ mode, searchState, theme, direction, proofWidth: event.target.value });
  });
}

render();
