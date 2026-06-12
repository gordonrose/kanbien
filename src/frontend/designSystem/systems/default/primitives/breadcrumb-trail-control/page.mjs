import {
  attachBreadcrumbTrailControlPrimitiveController,
  breadcrumbTrailControlPrimitive,
  renderBreadcrumbTrailControlPrimitive,
} from "../../../../layers/03-primitive/breadcrumb-trail-control/index.mjs";

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

const items = [
  { id: "home", label: "Home", href: "/design-system" },
  { id: "library", label: "Library", href: "/design-system/library" },
  { id: "navigation", label: "Navigation", href: "/design-system/library/navigation" },
  { id: "sub-nav", label: "Secondary Navigation", href: "/design-system/components/navigation" },
  { id: "search", label: "Search", current: true },
];

const longItems = [
  { id: "home", label: "Home", href: "/design-system" },
  { id: "library", label: "Operational Navigation Reference Library", href: "/design-system/library" },
  { id: "current", label: "Localized Secondary Navigation Canonical Review Surface", current: true },
];

const firstSpec = breadcrumbTrailControlPrimitive({ id: "breadcrumb-trail-proof-spec", items });

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Breadcrumb Trail Control Primitive</h1>
        <p>Review governed breadcrumb hierarchy, reduction, compact recovery, mobile absence, and RTL behavior.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Hidden breadcrumb context is recoverable through governed reveal controls; mobile absence renders no trail.</p>
        </div>
        <div class="primitive-proof-stage">
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Full trail</p>
            <div class="primitive-proof-host primitive-proof-host-wide">
              ${renderBreadcrumbTrailControlPrimitive({ id: "breadcrumb-trail-proof-full", items, mode: "full" })}
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Reduced states</p>
            <div class="primitive-proof-host primitive-proof-host-wide breadcrumb-trail-control-proof-stack">
              ${renderBreadcrumbTrailControlPrimitive({ id: "breadcrumb-trail-proof-reduced-page", items, mode: "reduced-page-minus-one" })}
              ${renderBreadcrumbTrailControlPrimitive({ id: "breadcrumb-trail-proof-reduced-middle", items, mode: "reduced-middle" })}
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Compact recovery</p>
            <div class="primitive-proof-host primitive-proof-host-narrow">
              ${renderBreadcrumbTrailControlPrimitive({ id: "breadcrumb-trail-proof-compact", items, mode: "compact" })}
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Long labels and RTL</p>
            <div class="primitive-proof-host primitive-proof-host-wide breadcrumb-trail-control-proof-stack">
              ${renderBreadcrumbTrailControlPrimitive({ id: "breadcrumb-trail-proof-long", items: longItems, mode: "full" })}
              ${renderBreadcrumbTrailControlPrimitive({ id: "breadcrumb-trail-proof-rtl", items, mode: "reduced-page-minus-one", direction: "rtl" })}
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Mobile absence</p>
            <div class="primitive-proof-host primitive-proof-host-narrow">
              ${renderBreadcrumbTrailControlPrimitive({ id: "breadcrumb-trail-proof-mobile", items, mode: "mobile-hidden" })}
              <p class="primitive-event-log">No breadcrumb is rendered in the approved mobile fallback.</p>
            </div>
          </article>
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
            <li>Only real hierarchy items are rendered.</li>
            <li>Collapsed and compact reveal controls are primitive-owned.</li>
            <li>Sub-navigation row placement and route generation remain later-layer work.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachBreadcrumbTrailControlPrimitiveController(root);
