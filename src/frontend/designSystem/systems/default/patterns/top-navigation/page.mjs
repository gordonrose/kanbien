import {
  attachTopNavigationPatternController,
  renderTopNavigationPattern,
  topNavigationPattern,
} from "../../../../layers/04-pattern-contract/top-navigation/index.mjs";

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
  { id: "imports", label: "Imports", href: "#imports", value: "imports" },
  { id: "admin", label: "Administration", href: "#administration", value: "admin" },
];
const profileLinks = [
  { id: "account", label: "Account", href: "#account" },
  { id: "prefs", label: "Preferences", href: "#preferences" },
  { id: "sign-out", label: "Sign out", href: "#sign-out" },
];

const root = document.querySelector("[data-pattern-proof-page]");
if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

const firstSpec = topNavigationPattern({ id: "top-navigation-proof", destinations, profileLinks });

function render({ mode = "auto", openSurface = "none", theme = "original", direction = "ltr", proofWidth = "wide" } = {}) {
  root.innerHTML = `
    <section class="token-spec-page top-navigation-pattern-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern</p>
          <h1>Top Navigation Pattern</h1>
          <p>Review governed top-navigation composition across desktop, overflow, and mobile states.</p>
        </section>

        <section class="token-spec-section" aria-label="Pattern controls">
          <div class="pattern-proof-controls">
            <label>Mode
              <select data-top-navigation-mode-control>
                <option value="auto" ${mode === "auto" ? "selected" : ""}>Auto resize</option>
                <option value="desktop" ${mode === "desktop" ? "selected" : ""}>Desktop</option>
                <option value="overflow" ${mode === "overflow" ? "selected" : ""}>Overflow</option>
                <option value="mobile" ${mode === "mobile" ? "selected" : ""}>Mobile</option>
              </select>
            </label>
            <label>Open surface
              <select data-top-navigation-open-control>
                <option value="none" ${openSurface === "none" ? "selected" : ""}>None</option>
                <option value="overflow" ${openSurface === "overflow" ? "selected" : ""}>Overflow</option>
                <option value="profile" ${openSurface === "profile" ? "selected" : ""}>Profile</option>
                <option value="mobile" ${openSurface === "mobile" ? "selected" : ""}>Mobile</option>
              </select>
            </label>
            <label>Theme
              <select data-top-navigation-theme-control>
                <option value="original" ${theme === "original" ? "selected" : ""}>Original</option>
                <option value="dark" ${theme === "dark" ? "selected" : ""}>Dark</option>
                <option value="desert" ${theme === "desert" ? "selected" : ""}>Desert</option>
              </select>
            </label>
            <label>Direction
              <select data-top-navigation-direction-control>
                <option value="ltr" ${direction === "ltr" ? "selected" : ""}>LTR</option>
                <option value="rtl" ${direction === "rtl" ? "selected" : ""}>RTL</option>
              </select>
            </label>
            <label>Proof width
              <select data-top-navigation-width-control>
                <option value="wide" ${proofWidth === "wide" ? "selected" : ""}>Wide</option>
                <option value="roomy" ${proofWidth === "roomy" ? "selected" : ""}>Roomy</option>
                <option value="medium" ${proofWidth === "medium" ? "selected" : ""}>Medium</option>
                <option value="compact" ${proofWidth === "compact" ? "selected" : ""}>Compact</option>
                <option value="tight" ${proofWidth === "tight" ? "selected" : ""}>Tight</option>
                <option value="narrow" ${proofWidth === "narrow" ? "selected" : ""}>Narrow</option>
              </select>
            </label>
          </div>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="top-navigation-pattern-proof-shell">
            <div class="top-navigation-pattern-proof-stage" data-top-navigation-proof-width="${escapeHtml(proofWidth)}">
              ${renderTopNavigationPattern({
                id: "top-navigation-proof",
                mode,
                openSurface,
                theme,
                direction,
                brand: { label: "Kanbien", mark: "K", href: "#brand", profileLabel: "Profile" },
                destinations,
                profileLinks,
              })}
            </div>
            <p class="primitive-event-log" data-top-navigation-pattern-log>Open surface: ${escapeHtml(openSurface)}</p>
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
              <li>The pattern composes brand, link, and trigger primitives.</li>
              <li>Overflow mode keeps two destinations plus More before mobile mode.</li>
              <li>Component props, app routing, and profile data loading remain later layers.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;
  attachTopNavigationPatternController(root);
  root.querySelector("[data-top-navigation-mode-control]")?.addEventListener("change", (event) => {
    render({ mode: event.target.value, openSurface: "none", theme, direction, proofWidth });
  });
  root.querySelector("[data-top-navigation-open-control]")?.addEventListener("change", (event) => {
    render({ mode, openSurface: event.target.value, theme, direction, proofWidth });
  });
  root.querySelector("[data-top-navigation-theme-control]")?.addEventListener("change", (event) => {
    render({ mode, openSurface, theme: event.target.value, direction, proofWidth });
  });
  root.querySelector("[data-top-navigation-direction-control]")?.addEventListener("change", (event) => {
    render({ mode, openSurface, theme, direction: event.target.value, proofWidth });
  });
  root.querySelector("[data-top-navigation-width-control]")?.addEventListener("change", (event) => {
    render({ mode, openSurface: "none", theme, direction, proofWidth: event.target.value });
  });
}

render();
