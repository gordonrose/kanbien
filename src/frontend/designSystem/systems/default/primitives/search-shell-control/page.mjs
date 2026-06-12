import {
  attachSearchShellControlPrimitiveController,
  renderSearchShellControlPrimitive,
  searchShellControlPrimitive,
} from "../../../../layers/03-primitive/search-shell-control/index.mjs";

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
          <dd><code>${escapeHtml(dependency.tokenName ?? dependency.primitiveName)}</code></dd>
        </div>
      `,
    )
    .join("");
}

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const firstSpec = searchShellControlPrimitive({
  id: "search-shell-proof-spec",
  placeholder: "Search components, patterns, or docs",
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Search Shell Control Primitive</h1>
        <p>Review governed secondary search shell posture while native input behavior stays owned by search-field-control.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Desktop search is bounded; mobile search fills the available sub-navigation width and hides the custom hint.</p>
        </div>
        <div class="primitive-proof-stage">
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Desktop empty and active</p>
            <div class="primitive-proof-host primitive-proof-host-wide search-shell-control-proof-stack">
              ${renderSearchShellControlPrimitive({ id: "search-shell-proof-empty", placeholder: "Search components, patterns, or docs" })}
              ${renderSearchShellControlPrimitive({ id: "search-shell-proof-active", state: "active", value: "pipeline", placeholder: "Search components, patterns, or docs" })}
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Compressed and mobile</p>
            <div class="primitive-proof-host primitive-proof-host-narrow search-shell-control-proof-stack">
              ${renderSearchShellControlPrimitive({ id: "search-shell-proof-compressed", mode: "compressed", placeholder: "Search components, patterns, documentation, and operational references" })}
              ${renderSearchShellControlPrimitive({ id: "search-shell-proof-mobile", mode: "mobile", placeholder: "Search components, patterns, or docs" })}
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Theme and RTL</p>
            <div class="primitive-proof-host primitive-proof-host-wide search-shell-control-proof-stack" dir="rtl">
              ${renderSearchShellControlPrimitive({ id: "search-shell-proof-rtl", placeholder: "ابحث في المكونات والأنماط والوثائق" })}
              ${renderSearchShellControlPrimitive({ id: "search-shell-proof-dark", theme: "dark", placeholder: "Search components / patterns / docs & tokens" })}
            </div>
          </article>
        </div>
        <p class="primitive-event-log" data-search-shell-proof-log>Submit log: none</p>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Token Dependencies</h2>
          <dl class="token-spec-definition-grid">${renderTokenList(firstSpec)}</dl>
        </article>
        <article class="token-spec-note">
          <h2>Boundary</h2>
          <ul>
            <li>The primitive composes search-field-control for native input behavior.</li>
            <li>It owns bounded shell posture and the custom hint.</li>
            <li>Search results, backend search, and route query state remain later-layer work.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

const log = root.querySelector("[data-search-shell-proof-log]");
root.addEventListener("search-shell-control:submit", (event) => {
  if (log instanceof HTMLElement) {
    log.textContent = `Submit log: ${event.detail.name}=${event.detail.value}`;
  }
});

attachSearchShellControlPrimitiveController(root);
