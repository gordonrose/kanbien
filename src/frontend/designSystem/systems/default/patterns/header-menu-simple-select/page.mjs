import {
  attachHeaderMenuSimpleSelectPatternController,
  headerMenuSimpleSelectPattern,
  renderHeaderMenuSimpleSelectPattern,
} from "../../../../layers/04-pattern-contract/header-menu-simple-select/index.mjs";

const root = document.querySelector("[data-pattern-proof-root]");

if (!(root instanceof HTMLElement)) {
  throw new Error("header-menu-simple-select proof root is missing.");
}

const spec = headerMenuSimpleSelectPattern({
  id: "header-menu-simple-select-proof-summary",
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">04-pattern-contract</p>
        <h1>Header Menu Simple Select Pattern</h1>
        <p>Review the governed layer selector composition before entity page header component or app adoption work.</p>
      </section>
      <section class="token-spec-section" aria-label="Pattern proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Open the trigger to inspect anchored menu behavior, current option state, disabled handling, and internal panel scrolling.</p>
        </div>
        <div class="entity-page-header-proof-host">
          <div class="ds-entity-page-header-container">
            ${renderHeaderMenuSimpleSelectPattern({
              id: "header-menu-simple-select-proof",
            })}
          </div>
        </div>
        <dl class="token-spec-definition-grid">
          <div><dt>Pattern seam</dt><dd><code>headerMenuSimpleSelectPattern</code></dd></div>
          <div><dt>Primitive seam</dt><dd><code>${spec.primitive.primitiveName}</code></dd></div>
          <div><dt>Current value</dt><dd><code>${spec.value}</code></dd></div>
          <div><dt>Direct tokens</dt><dd><code>none; consumed through primitive</code></dd></div>
        </dl>
      </section>
    </div>
  </section>
`;

attachHeaderMenuSimpleSelectPatternController(root);
