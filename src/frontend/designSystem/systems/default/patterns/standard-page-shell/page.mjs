import {
  attachStandardPageShellPatternController,
  renderStandardPageShellPattern,
  standardPageShellPattern,
} from "../../../../layers/04-pattern-contract/standard-page-shell/index.mjs";

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

const destinations = [
  { id: "home", label: "Home", href: "#home", value: "home" },
  { id: "data", label: "Data", href: "#data", value: "data" },
  { id: "build", label: "Build", href: "#build", value: "build", current: true },
  { id: "reports", label: "Reports", href: "#reports", value: "reports" },
  { id: "settings", label: "Settings", href: "#settings", value: "settings" },
];
const breadcrumbs = [
  { id: "home", label: "Home", href: "#home" },
  { id: "workspace", label: "Workspace", href: "#workspace" },
  { id: "briefs", label: "Design briefs", href: "#briefs" },
  { id: "current", label: "Standard shell proof", current: true },
];
const contextItems = [
  { id: "overview", value: "overview", label: "Overview", icon: "home", kind: "destination", state: "current" },
  { id: "components", value: "components", label: "Components", icon: "grid", kind: "destination" },
  { id: "patterns", value: "patterns", label: "Patterns", icon: "context-list", kind: "destination" },
  { id: "tokens", value: "tokens", label: "Tokens", icon: "token", kind: "destination" },
];
const toolItems = [
  { id: "notes", label: "Notes", iconLabel: "N", value: "notes", state: "active" },
  { id: "audit", label: "Audit", iconLabel: "A", value: "audit" },
];

const root = document.querySelector("[data-pattern-proof-page]");
if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

const firstSpec = standardPageShellPattern({ id: "standard-page-shell-proof" });

function render({ mode = "desktop", theme = "original", direction = "ltr", proofWidth = "wide" } = {}) {
  root.innerHTML = `
    <section class="token-spec-page standard-page-shell-pattern-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern</p>
          <h1>Standard Page Shell Pattern</h1>
          <p>Review shell composition now that top, sub, context, and tools navigation are governed child patterns.</p>
        </section>

        <section class="token-spec-section" aria-label="Pattern controls">
          <div class="pattern-proof-controls">
            <label>Mode
              <select data-standard-page-shell-mode-control>
                <option value="desktop" ${mode === "desktop" ? "selected" : ""}>Desktop</option>
                <option value="compressed" ${mode === "compressed" ? "selected" : ""}>Compressed</option>
                <option value="mobile" ${mode === "mobile" ? "selected" : ""}>Mobile</option>
              </select>
            </label>
            <label>Theme
              <select data-standard-page-shell-theme-control>
                <option value="original" ${theme === "original" ? "selected" : ""}>Original</option>
                <option value="dark" ${theme === "dark" ? "selected" : ""}>Dark</option>
                <option value="desert" ${theme === "desert" ? "selected" : ""}>Desert</option>
              </select>
            </label>
            <label>Direction
              <select data-standard-page-shell-direction-control>
                <option value="ltr" ${direction === "ltr" ? "selected" : ""}>LTR</option>
                <option value="rtl" ${direction === "rtl" ? "selected" : ""}>RTL</option>
              </select>
            </label>
            <label>Proof width
              <select data-standard-page-shell-width-control>
                <option value="wide" ${proofWidth === "wide" ? "selected" : ""}>Wide</option>
                <option value="medium" ${proofWidth === "medium" ? "selected" : ""}>Medium</option>
                <option value="mobile" ${proofWidth === "mobile" ? "selected" : ""}>Mobile</option>
              </select>
            </label>
          </div>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="standard-page-shell-pattern-proof-shell">
            <div class="standard-page-shell-pattern-proof-stage" data-standard-page-shell-proof-width="${escapeHtml(proofWidth)}">
              ${renderStandardPageShellPattern({
                id: "standard-page-shell-proof",
                mode,
                theme,
                direction,
                topNavigation: { destinations, profileLinks: [{ id: "account", label: "Account", href: "#account" }] },
                subNavigation: { breadcrumbs, searchLabel: "Search shell", searchPlaceholder: "Search shell" },
                contextNavigation: { primaryItems: contextItems, mobileItems: contextItems },
                toolsNavigation: { items: toolItems },
              })}
            </div>
            <p class="primitive-event-log">Child seams: top-navigation / sub-navigation / context-navigation / tools-navigation.</p>
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
              <li>The shell composes child patterns and reserves the page-body boundary.</li>
              <li>Layer 5 component receptors and app adoption remain later work.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;
  attachStandardPageShellPatternController(root);
  root.querySelector("[data-standard-page-shell-mode-control]")?.addEventListener("change", (event) => {
    render({ mode: event.target.value, theme, direction, proofWidth });
  });
  root.querySelector("[data-standard-page-shell-theme-control]")?.addEventListener("change", (event) => {
    render({ mode, theme: event.target.value, direction, proofWidth });
  });
  root.querySelector("[data-standard-page-shell-direction-control]")?.addEventListener("change", (event) => {
    render({ mode, theme, direction: event.target.value, proofWidth });
  });
  root.querySelector("[data-standard-page-shell-width-control]")?.addEventListener("change", (event) => {
    render({ mode, theme, direction, proofWidth: event.target.value });
  });
}

render();
