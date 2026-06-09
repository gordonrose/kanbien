import { Router } from "express";

const brochureDesignSystemAssetVersion = "20260530-brochure-system-1";

function escapeHtml(value: string): string {
  return value
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#39;");
}

type PublicSiteNavItem = {
  href: string;
  label: string;
  current?: boolean;
};

type PublicSiteBreadcrumb = {
  href?: string;
  label: string;
  current?: boolean;
};

type PublicSitePageOptions = {
  navItems?: PublicSiteNavItem[];
  breadcrumbs?: PublicSiteBreadcrumb[];
};

type PublicSiteShowcaseStep = {
  label: string;
  title: string;
  summary: string;
  examples: string[];
  visual?: {
    kind: "request" | "capabilities" | "blueprint" | "tasks" | "implementation" | "proof";
    caption: string;
  };
};

function renderShowcaseVisual(visual: PublicSiteShowcaseStep["visual"]): string {
  if (!visual) {
    return "";
  }

  const visualContentByKind: Record<NonNullable<PublicSiteShowcaseStep["visual"]>["kind"], string> = {
    request: `<div class="public-site-artifact public-site-artifact-request">
      <section>
        <p class="public-site-artifact-label">Stakeholder says</p>
        <p class="public-site-artifact-quote">"Let customers invite team members."</p>
      </section>
      <section>
        <p class="public-site-artifact-label">Kanbien captures</p>
        <ul>
          <li>Who is inviting whom?</li>
          <li>What happens if the email is already used?</li>
          <li>Who can invite admins?</li>
          <li>What must be approved before sending?</li>
        </ul>
      </section>
    </div>`,
    capabilities: `<div class="public-site-artifact public-site-artifact-matrix">
      <div class="public-site-artifact-row public-site-artifact-row-head">
        <span>Capability</span>
        <span>Rules captured</span>
      </div>
      <div class="public-site-artifact-row">
        <span>Create invitation</span>
        <span>Auth, validation, email state</span>
      </div>
      <div class="public-site-artifact-row">
        <span>Accept invitation</span>
        <span>Expiry, conflicts, audit</span>
      </div>
      <div class="public-site-artifact-row">
        <span>List invitations</span>
        <span>Permissions, filters, UI contract</span>
      </div>
    </div>`,
    blueprint: `<div class="public-site-artifact public-site-artifact-checks">
      <p class="public-site-artifact-label">Blueprint must answer</p>
      <ul>
        <li>API shape and route behavior</li>
        <li>Persistence and lifecycle states</li>
        <li>Authorization and tenant boundaries</li>
        <li>Required tests, docs, and proof</li>
      </ul>
    </div>`,
    tasks: `<div class="public-site-artifact public-site-artifact-lanes">
      <section><span>Domain</span><strong>Business rules</strong></section>
      <section><span>API</span><strong>Request and response</strong></section>
      <section><span>Data</span><strong>Storage and indexes</strong></section>
      <section><span>Proof</span><strong>Tests and docs</strong></section>
    </div>`,
    implementation: `<div class="public-site-artifact public-site-artifact-repo">
      <p class="public-site-artifact-label">Mounted slice</p>
      <ul>
        <li>feature/invitations/domain</li>
        <li>feature/invitations/transport</li>
        <li>tests/invitations</li>
        <li>docs/api-contracts</li>
      </ul>
    </div>`,
    proof: `<div class="public-site-artifact public-site-artifact-proof">
      <p class="public-site-artifact-label">Ready only when</p>
      <ul>
        <li><span>Pass</span> API behavior exercised</li>
        <li><span>Pass</span> Validation errors proven</li>
        <li><span>Pass</span> Docs and Postman ready</li>
        <li><span>Pass</span> Artifact sweep clean</li>
      </ul>
    </div>`,
  };

  return `<figure class="public-site-showcase-visual public-site-showcase-visual-${escapeHtml(visual.kind)}" aria-label="${escapeHtml(visual.caption)}">
    <div class="public-site-visual-stage">
      ${visualContentByKind[visual.kind]}
    </div>
    <figcaption>${escapeHtml(visual.caption)}</figcaption>
  </figure>`;
}

function renderPipelineShowcase(
  idPrefix: string,
  label: string,
  steps: PublicSiteShowcaseStep[],
): string {
  return `<div class="public-site-showcase" data-public-site-showcase>
    <select class="public-site-showcase-select" aria-label="${escapeHtml(label)} step" data-showcase-select>
      ${steps
        .map((step, index) => {
          const stepNumber = String(index + 1).padStart(2, "0");

          return `<option value="${escapeHtml(idPrefix)}-tab-${stepNumber}">${stepNumber} ${escapeHtml(step.label)}</option>`;
        })
        .join("")}
    </select>
    <div class="public-site-showcase-tabs" role="tablist" aria-label="${escapeHtml(label)}">
      ${steps
        .map((step, index) => {
          const stepNumber = String(index + 1).padStart(2, "0");
          const selected = index === 0;

          return `<button class="public-site-showcase-tab${selected ? " is-active" : ""}" type="button" role="tab" id="${escapeHtml(idPrefix)}-tab-${stepNumber}" aria-selected="${selected ? "true" : "false"}" aria-controls="${escapeHtml(idPrefix)}-panel-${stepNumber}" data-showcase-tab>
            <span class="public-site-showcase-tab-number">${stepNumber}</span>
            <span class="public-site-showcase-tab-label">${escapeHtml(step.label)}</span>
          </button>`;
        })
        .join("")}
    </div>
    <div class="public-site-showcase-panels">
      ${steps
        .map((step, index) => {
          const stepNumber = String(index + 1).padStart(2, "0");
          const selected = index === 0;

          return `<section class="public-site-showcase-panel" role="tabpanel" id="${escapeHtml(idPrefix)}-panel-${stepNumber}" aria-labelledby="${escapeHtml(idPrefix)}-tab-${stepNumber}"${selected ? "" : " hidden"}>
            <div class="public-site-showcase-copy">
              <p class="public-site-eyebrow">Step ${stepNumber}</p>
              <h3>${escapeHtml(step.title)}</h3>
              <p>${escapeHtml(step.summary)}</p>
            </div>
            ${renderShowcaseVisual(step.visual)}
            ${
              step.visual
                ? ""
                : `<ul class="public-site-showcase-example-list" aria-label="Example outputs">
                    ${step.examples.map((example) => `<li>${escapeHtml(example)}</li>`).join("")}
                  </ul>`
            }
          </section>`;
        })
        .join("")}
    </div>
  </div>`;
}

function renderNavItems(items: PublicSiteNavItem[]): string {
  if (items.length === 0) {
    return `<div class="primary-nav-links" aria-label="No public navigation items yet"></div>`;
  }

  return `<div class="primary-nav-links">
    ${items
      .map(
        (item) =>
          `<a class="nav-link${item.current ? " active" : ""}" href="${escapeHtml(item.href)}"${item.current ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`,
      )
      .join("")}
  </div>`;
}

function renderBreadcrumbs(breadcrumbs: PublicSiteBreadcrumb[] = []): string {
  if (breadcrumbs.length === 0) {
    return "";
  }

  return `<section class="sub-nav public-site-sub-nav" aria-label="Page breadcrumb">
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <ol class="breadcrumb-list">
        ${breadcrumbs
          .map((breadcrumb, index) => {
            const separator =
              index === 0 ? "" : `<li><span class="breadcrumb-separator" aria-hidden="true">/</span></li>`;
            const item =
              breadcrumb.current || !breadcrumb.href
                ? `<li><span class="breadcrumb-button breadcrumb-current" aria-current="page">${escapeHtml(breadcrumb.label)}</span></li>`
                : `<li><a class="breadcrumb-button" href="${escapeHtml(breadcrumb.href)}">${escapeHtml(breadcrumb.label)}</a></li>`;
            return `${separator}${item}`;
          })
          .join("")}
      </ol>
    </nav>
  </section>`;
}

function renderPage(title: string, body: string, options: PublicSitePageOptions = {}): string {
  const navItems = options.navItems ?? [];
  const breadcrumbs = options.breadcrumbs ?? [];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="Kanbien build journal and public timeline for product discovery, design-system, feature compiler, and deployment work." />
    <link rel="stylesheet" href="/design-system/assets/styles.css" />
    <link rel="stylesheet" href="/design-system/systems/brochure/assets/public-site.css?v=${brochureDesignSystemAssetVersion}" />
    <script src="/design-system/systems/brochure/assets/public-site.js?v=${brochureDesignSystemAssetVersion}" defer></script>
  </head>
  <body class="public-site-body">
    <div class="design-system-shell public-site-shell">
      <header class="top-nav top-nav-no-utilities public-site-top-nav" data-public-site-header>
        <a class="brand-lockup" href="/" aria-label="Kanbien home">
          <span class="brand-mark" aria-hidden="true">K</span>
          <span class="brand-copy"><strong>Kanbien</strong></span>
        </a>

        <nav class="primary-nav public-site-primary-nav" aria-label="Public site">
          ${renderNavItems(navItems)}
        </nav>
      </header>
      ${renderBreadcrumbs(breadcrumbs)}
      ${body}
    </div>
  </body>
</html>`;
}

function renderHomePage(): string {
  return renderPage(
    "Kanbien",
    `<main class="public-site-home" data-public-site-home>
      <section class="public-site-home-fold" aria-labelledby="home-title">
        <div class="public-site-intro">
          <h1 id="home-title">Welcome to Kanbien</h1>
          <div class="public-site-lede">
            <p>Software projects take entire teams months to scope and deliver properly. Most of the time, customers wait weeks for a first glimpse at a potential solution. And much longer still for an implementation that is good to go.</p>
            <p>The experiment I&rsquo;m working on:</p>
            <p><strong>If properly structured, LLMs can make enterprise grade product development happen at the speed of requirement gathering.</strong></p>
            <p>If someone can skillfully capture requirements - and is given the right toolkit - they will be able to build prototypes in real time under stakeholder guidance and turn it into production ready software overnight.</p>
            <p>A working slice of software -that would have taken months to deliver- can be ready for production, signed off, and in use in less than a week of onsite work.</p>
          </div>
          <div class="public-site-actions" aria-label="Homepage actions">
            <a class="public-site-button public-site-button-primary" href="/projects">Explore the work</a>
          </div>
        </div>
      </section>
    </main>`,
  );
}

function renderProjectsPage(): string {
  return renderPage(
    "Kanbien Projects",
    `<main class="public-site-page">
      <section class="public-site-workstream-list" aria-label="Kanbien workstreams">
        <article class="public-site-simple-panel" aria-labelledby="feature-compiler-title">
          <p class="public-site-eyebrow">Workstream 1</p>
          <h1 id="feature-compiler-title">Feature Compiler</h1>
          <p>One of the earliest realizations I made is that LLMs cannot be trusted to get architecture right, and cannot be trusted to be consistent. In this workstream we&rsquo;re building a pipeline that enables feature requests to be reliably broken down into thin slices called capabilities, each with over 100 structured inputs to ensure the a backend feature is properly built.</p>
          <a class="public-site-text-link" href="/projects/feature-compiler">learn more</a>
        </article>
        <article class="public-site-simple-panel" aria-labelledby="front-end-builder-title">
          <p class="public-site-eyebrow">Workstream 2</p>
          <h1 id="front-end-builder-title">Front-End Builder</h1>
          <p>Many tech organizations can struggle with building reliable front-ends. With this work we&rsquo;re building a design-system that is governed, reviewable, and structured in such a way that any app features must reuse the same seam (style, behaviour, etc.) that has been signed off under the design system.</p>
          <a class="public-site-text-link" href="/projects/front-end-builder">learn more</a>
        </article>
        <article class="public-site-simple-panel" aria-labelledby="product-discovery-assistance-title">
          <p class="public-site-eyebrow">Workstream 3</p>
          <h1 id="product-discovery-assistance-title">Product Discovery Assistance</h1>
          <p>How do we make the work that&rsquo;s being done by the Agentic harness more visible and human approvable through the use of stories and tasks? Starting with the stakeholder interview and appropriate routing of follow on questions and decision points based on subject matter.</p>
          <a class="public-site-text-link" href="/projects/product-discovery-assistance">learn more</a>
        </article>
      </section>
    </main>`,
    {
      navItems: [{ href: "/", label: "Home" }],
      breadcrumbs: [
        { href: "/", label: "Home" },
        { label: "Projects", current: true },
      ],
    },
  );
}

function renderFeatureCompilerPage(): string {
  return renderPage(
    "Feature Compiler - Kanbien Projects",
    `<main class="public-site-page">
      <article class="public-site-project-detail" aria-labelledby="feature-compiler-page-title">
        <header class="public-site-project-hero">
          <p class="public-site-eyebrow">Workstream 1</p>
          <h1 id="feature-compiler-page-title">Feature Compiler</h1>
          <p class="public-site-project-hook">LLMs are fast, but they are not naturally trustworthy architects.</p>
          <p>Feature Compiler is the part of Kanbien that turns a feature request into small backend capabilities with enough structure around each slice to make implementation reviewable, testable, and safe to mount or discard.</p>
        </header>

        <section class="public-site-detail-section" aria-labelledby="feature-compiler-problem">
          <p class="public-site-eyebrow">The Problem</p>
          <h2 id="feature-compiler-problem">The problem with going straight from prompt to code</h2>
          <p>When an LLM is asked to build a backend feature directly, it can produce convincing code while missing the decisions that make software production-ready: authorization, lifecycle rules, persistence boundaries, API contracts, audit behavior, test coverage, documentation, and compatibility.</p>
          <p>The result may look fast at first, but the risk moves downstream into review, debugging, drift, and rework.</p>
        </section>

        <section class="public-site-detail-section" aria-labelledby="feature-compiler-bet">
          <p class="public-site-eyebrow">The Bet</p>
          <h2 id="feature-compiler-bet">The harness matters more than the prompt</h2>
          <p>The bet behind Feature Compiler is that AI-assisted delivery becomes useful when the work is broken into smaller, explicit capabilities before implementation begins.</p>
          <p>A capability is one focused piece of functionality that performs one job well: create a user, update a user, delete a user, list users, export records, or run a specific background process.</p>
        </section>

        <section class="public-site-detail-section" aria-labelledby="feature-compiler-does">
          <p class="public-site-eyebrow">What It Does</p>
          <h2 id="feature-compiler-does">What Feature Compiler does</h2>
          <ul class="public-site-check-list">
            <li>Turns vague feature requests into thin backend capability slices.</li>
            <li>Forces architecture, authorization, lifecycle, persistence, API, testing, and documentation decisions into view.</li>
            <li>Creates a build path that can be reviewed before code is written.</li>
            <li>Keeps each slice isolated enough to mount, verify, revise, or discard.</li>
            <li>Produces evidence that a human can inspect.</li>
          </ul>
        </section>

        <section class="public-site-detail-section" aria-labelledby="feature-compiler-possible">
          <p class="public-site-eyebrow">Why It Matters</p>
          <h2 id="feature-compiler-possible">What this makes possible</h2>
          <p>The goal is not to generate more code. The goal is to reduce the time between understanding a requirement and safely proving a production-grade backend slice.</p>
          <ul class="public-site-check-list">
            <li>A backend capability can be planned, built, tested, and documented quickly.</li>
            <li>Review becomes easier because the slice has a defined boundary.</li>
            <li>Drift is reduced because implementation follows a structured artifact chain.</li>
            <li>Failed or rejected work can be discarded without contaminating the repo.</li>
            <li>Stakeholders get evidence, not just promises.</li>
          </ul>
        </section>

        <section class="public-site-detail-section" aria-labelledby="feature-compiler-flow">
          <p class="public-site-eyebrow">Flow</p>
          <h2 id="feature-compiler-flow">A public version of the pipeline</h2>
          ${renderPipelineShowcase("feature-compiler-flow", "Feature Compiler pipeline", [
            {
              label: "Feature request",
              title: "The request becomes a decision-ready brief",
              summary: "A stakeholder should not need to describe tables, routes, or architecture. They should be able to explain what they want, who it is for, what must never happen, who should have access, and what a safe outcome looks like. Kanbien turns that into a brief the build harness can use without pretending the missing details are already settled.",
              examples: ["What the user wants to accomplish", "Who the feature is for", "Unhappy paths and edge cases", "Access, security, and approval questions"],
              visual: {
                kind: "request",
                caption: "Stakeholder intent translated into build-ready questions",
              },
            },
            {
              label: "Capabilities",
              title: "The feature is broken into single-objective capabilities",
              summary: "A feature is too large and ambiguous to build reliably in one pass. The Kanbien capability matrix breaks it into smaller actions that each do one thing well, then defines the myriad rules around that action that engineers would ordinarily need to build it properly: who may use it, what valid input looks like, how it should be built, what errors should say, how your website or app can consume it, documentation, testing requirements, logging and monitoring rules, and many more.",
              examples: ["Single objective per capability", "Authorisation and permission rules", "Validation and error messages", "Frontend compatibility expectations"],
              visual: {
                kind: "capabilities",
                caption: "One feature decomposed into controlled capability rows",
              },
            },
            {
              label: "Blueprint",
              title: "The hidden architecture questions are forced into view",
              summary: "This is where the system stops letting the model hand-wave. The blueprint makes backend decisions reviewable before code exists: route shape, persistence, lifecycle, authorization, compatibility, tests, and documentation.",
              examples: ["API contract shape", "Persistence and lifecycle decisions", "Authorization posture", "Verification evidence required"],
              visual: {
                kind: "blueprint",
                caption: "Architecture decisions arranged before implementation begins",
              },
            },
            {
              label: "Tasks",
              title: "The build work gets rails",
              summary: "The capability is turned into task packets with allowed write areas, expected proof, and stop conditions. That means the model is not free to sprawl across the repo just because it can.",
              examples: ["Domain task with a narrow boundary", "Transport task with route obligations", "Persistence task with schema expectations", "Docs and proof task captured separately"],
              visual: {
                kind: "tasks",
                caption: "Build tasks routed into separate controlled lanes",
              },
            },
            {
              label: "Implementation",
              title: "The slice can be mounted or removed cleanly",
              summary: "The point is not just speed. The point is reversibility. A capability lands as a bounded slice with feature-local code, tests, contracts, and docs so it can be reviewed without contaminating unrelated work.",
              examples: ["Feature-local source files", "Contract and manifest changes", "Targeted tests", "Docs tied to the slice"],
              visual: {
                kind: "implementation",
                caption: "A bounded repo slice mounted into the wider platform",
              },
            },
            {
              label: "Proof",
              title: "Done means evidenced, not generated",
              summary: "A generated backend feature is not trusted because it exists. It is trusted only after behavior, API shape, tests, documentation, and artifact alignment can be inspected against the original slice.",
              examples: ["API behavior can be exercised", "Tests prove the edge of the slice", "Postman-ready evidence exists", "Artifact sweep catches drift"],
              visual: {
                kind: "proof",
                caption: "Evidence lights up only after behavior and artifacts line up",
              },
            },
          ])}
        </section>

        <section class="public-site-detail-section" aria-labelledby="feature-compiler-evidence">
          <p class="public-site-eyebrow">Evidence</p>
          <h2 id="feature-compiler-evidence">Evidence in the repo</h2>
          <p>The public evidence is the shape of the harness: capability matrices, implementation blueprints, task breakdowns, API contract expectations, Postman proof, feature manifests, and test obligations.</p>
          <ul class="public-site-check-list">
            <li>Capability matrix: records what the capability must decide.</li>
            <li>Implementation blueprint: turns the capability into a build plan.</li>
            <li>Task breakdown: isolates the delivery work.</li>
            <li>API and Postman proof: makes the behavior testable.</li>
            <li>Artifact sweep: checks docs and repo truth do not drift.</li>
          </ul>
        </section>

        <section class="public-site-detail-section" aria-labelledby="feature-compiler-private">
          <p class="public-site-eyebrow">Boundary</p>
          <h2 id="feature-compiler-private">What I am not publishing</h2>
          <p>The public version explains the purpose, shape, and evidence of Feature Compiler. The detailed prompts, internal routing logic, scoring rules, schemas, and execution workflow are intentionally private.</p>
        </section>

        <nav class="public-site-detail-actions" aria-label="Feature Compiler related pages">
          <a class="public-site-text-link" href="/projects">Back to projects</a>
          <a class="public-site-text-link" href="/projects/front-end-builder">Next: Front-End Builder</a>
        </nav>
      </article>
    </main>`,
    {
      navItems: [{ href: "/projects", label: "Projects" }],
      breadcrumbs: [
        { href: "/", label: "Home" },
        { href: "/projects", label: "Projects" },
        { label: "Feature Compiler", current: true },
      ],
    },
  );
}

function renderFrontEndBuilderPage(): string {
  return renderPage(
    "Front-End Builder - Kanbien Projects",
    `<main class="public-site-page">
      <article class="public-site-project-detail" aria-labelledby="front-end-builder-page-title">
        <header class="public-site-project-hero">
          <p class="public-site-eyebrow">Workstream 2</p>
          <h1 id="front-end-builder-page-title">Front-End Builder</h1>
          <p class="public-site-project-hook">AI can generate screens quickly, but it does not naturally understand what makes a business interface consistent, reusable, and safe to scale.</p>
          <p>Most organizations do not just need a screen that looks good once. They need every customer, admin, and internal workflow to follow the same interaction rules, accessibility expectations, brand decisions, and approval standards. Front-End Builder is the part of Kanbien focused on making those interface decisions reusable and reviewable before they become real app surfaces.</p>
        </header>

        <section class="public-site-detail-section" aria-labelledby="front-end-builder-problem">
          <p class="public-site-eyebrow">The Problem</p>
          <h2 id="front-end-builder-problem">The problem with letting every page invent its own UI</h2>
          <p>Many teams struggle to keep front-ends consistent even without AI. Once generated code enters the workflow, the risk grows: duplicated markup, local styling, inconsistent behavior, inaccessible controls, and page-by-page drift from the intended product system.</p>
          <p>The page may look acceptable in isolation, but the system becomes harder to maintain, harder to review, and harder to trust.</p>
        </section>

        <section class="public-site-detail-section" aria-labelledby="front-end-builder-bet">
          <p class="public-site-eyebrow">The Bet</p>
          <h2 id="front-end-builder-bet">Signed-off seams matter more than one-off screens</h2>
          <p>The bet behind Front-End Builder is that generated app UI should consume governed design-system seams rather than recreate local versions of layout, style, behavior, accessibility, and state semantics.</p>
          <p>A seam is the reusable source of truth a page must consume: the same styling, render structure, interaction behavior, and accessibility posture that has already been reviewed under the design system.</p>
        </section>

        <section class="public-site-detail-section" aria-labelledby="front-end-builder-does">
          <p class="public-site-eyebrow">What It Does</p>
          <h2 id="front-end-builder-does">What Front-End Builder does</h2>
          <ul class="public-site-check-list">
            <li>Routes UI ideas through design-system review before app adoption.</li>
            <li>Turns visual decisions into reusable seams instead of page-local CSS.</li>
            <li>Checks responsive, accessibility, theme, and interaction behavior before a surface is trusted.</li>
            <li>Prevents app pages from copying demo markup or reconstructing controller logic.</li>
            <li>Produces browser-visible evidence that humans can inspect.</li>
          </ul>
        </section>

        <section class="public-site-detail-section" aria-labelledby="front-end-builder-possible">
          <p class="public-site-eyebrow">Why It Matters</p>
          <h2 id="front-end-builder-possible">What this makes possible</h2>
          <p>The goal is not to make more screens faster. The goal is to make front-end delivery faster without losing consistency, accessibility, or reviewability.</p>
          <ul class="public-site-check-list">
            <li>New app pages can reuse already-reviewed design decisions.</li>
            <li>Design drift is easier to detect because the approved seam is explicit.</li>
            <li>Visual proof becomes part of delivery rather than a late-stage surprise.</li>
            <li>Teams can review behavior and layout in the browser before adoption.</li>
            <li>Rejected or experimental UI can stay out of production app surfaces.</li>
          </ul>
        </section>

        <section class="public-site-detail-section" aria-labelledby="front-end-builder-flow">
          <p class="public-site-eyebrow">Flow</p>
          <h2 id="front-end-builder-flow">A public version of the pipeline</h2>
          ${renderPipelineShowcase("front-end-builder-flow", "Front-End Builder pipeline", [
            {
              label: "UI need",
              title: "A product surface exposes a reusable interface need",
              summary: "The work starts with a real screen or workflow need, but the first question is whether the UI decision should become reusable.",
              examples: ["Screen goal", "User action", "State requirements", "Reuse candidate"],
            },
            {
              label: "Design-system proof",
              title: "The decision is reviewed before app adoption",
              summary: "Layout, behavior, accessibility, theme, and responsive expectations are proven in the design-system surface first.",
              examples: ["Behavior rule", "Token proof", "Primitive proof", "Responsive states"],
            },
            {
              label: "Seam",
              title: "The reusable source of truth is named",
              summary: "The approved UI decision becomes a seam that app pages can consume instead of rebuilding style or interaction logic locally.",
              examples: ["Render seam", "Controller seam", "CSS variable seam", "Consumption boundary"],
            },
            {
              label: "Canonical",
              title: "The approved browser shape becomes visible",
              summary: "Canonical states show reviewers what the UI is supposed to look like before it becomes part of a real app page.",
              examples: ["Default state", "Empty state", "Error state", "Mobile state"],
            },
            {
              label: "App adoption",
              title: "The app consumes the governed seam",
              summary: "The real product page uses the approved source of truth instead of copying demo markup or inventing page-local CSS.",
              examples: ["Shared renderer", "Shared behavior", "No local fork", "Adoption note"],
            },
            {
              label: "Browser proof",
              title: "The app page is checked where users experience it",
              summary: "The final proof is browser-visible: layout, overflow, interaction, theme, and accessibility behavior are checked on the real surface.",
              examples: ["Desktop proof", "Mobile proof", "Keyboard behavior", "Overflow check"],
            },
          ])}
        </section>

        <section class="public-site-detail-section" aria-labelledby="front-end-builder-evidence">
          <p class="public-site-eyebrow">Evidence</p>
          <h2 id="front-end-builder-evidence">Evidence in the repo</h2>
          <p>The public evidence is the shape of the governed front-end harness: design-system behavior rules, token and primitive work, pattern contracts, canonical renderings, app adoption checks, visual evidence, and issue reconciliation notes.</p>
          <ul class="public-site-check-list">
            <li>Design-system artifacts: record behavior, tokens, primitives, patterns, and adoption boundaries.</li>
            <li>Canonical renderings: make approved UI states visible in the browser.</li>
            <li>App adoption checks: prevent local copies from replacing governed seams.</li>
            <li>Visual proof: verifies responsive, theme, and interaction behavior.</li>
            <li>Issue reconciliations: turn escaped UI defects into stronger future checks.</li>
          </ul>
          <a class="public-site-text-link" href="/design-system">View the design system</a>
        </section>

        <section class="public-site-detail-section" aria-labelledby="front-end-builder-private">
          <p class="public-site-eyebrow">Boundary</p>
          <h2 id="front-end-builder-private">What I am not publishing</h2>
          <p>The public version explains the purpose, shape, and evidence of Front-End Builder. The detailed internal prompts, routing logic, review scoring, generation rules, and private implementation workflow are intentionally private.</p>
        </section>

        <nav class="public-site-detail-actions" aria-label="Front-End Builder related pages">
          <a class="public-site-text-link" href="/projects">Back to projects</a>
          <a class="public-site-text-link" href="/projects/product-discovery-assistance">Next: Product Discovery Assistance</a>
        </nav>
      </article>
    </main>`,
    {
      navItems: [{ href: "/projects", label: "Projects" }],
      breadcrumbs: [
        { href: "/", label: "Home" },
        { href: "/projects", label: "Projects" },
        { label: "Front-End Builder", current: true },
      ],
    },
  );
}

function renderProductDiscoveryAssistancePage(): string {
  return renderPage(
    "Product Discovery Assistance - Kanbien Projects",
    `<main class="public-site-page">
      <article class="public-site-project-detail" aria-labelledby="product-discovery-assistance-page-title">
        <header class="public-site-project-hero">
          <p class="public-site-eyebrow">Workstream 3</p>
          <h1 id="product-discovery-assistance-page-title">Product Discovery Assistance</h1>
          <p class="public-site-project-hook">Most software risk begins before anyone writes code.</p>
          <p>Customers, founders, operators, and technical teams often start with different versions of the same problem. Product Discovery Assistance is the part of Kanbien focused on turning early stakeholder conversations into visible stories, decisions, follow-up questions, and approvable work before the build begins.</p>
        </header>

        <section class="public-site-detail-section" aria-labelledby="product-discovery-assistance-problem">
          <p class="public-site-eyebrow">The Problem</p>
          <h2 id="product-discovery-assistance-problem">The problem with vague requirements</h2>
          <p>Software teams rarely fail because nobody can type code. They fail because the requirement stays fuzzy for too long: the wrong person answers the wrong question, assumptions get buried in chat, and delivery starts before the decision points are visible.</p>
          <p>AI can make that worse if it rushes from conversation to output without showing what it understood, what remains uncertain, and who needs to approve the next step.</p>
        </section>

        <section class="public-site-detail-section" aria-labelledby="product-discovery-assistance-bet">
          <p class="public-site-eyebrow">The Bet</p>
          <h2 id="product-discovery-assistance-bet">Discovery should become an inspectable product artifact</h2>
          <p>The bet behind Product Discovery Assistance is that early requirements work can be made visible enough for humans to steer, correct, and approve while the harness keeps track of context.</p>
          <p>Instead of treating discovery as a loose transcript, the workflow routes stakeholder input into stories, tasks, decision points, and follow-up questions that can be reviewed before the feature compiler or front-end builder take over.</p>
        </section>

        <section class="public-site-detail-section" aria-labelledby="product-discovery-assistance-does">
          <p class="public-site-eyebrow">What It Does</p>
          <h2 id="product-discovery-assistance-does">What Product Discovery Assistance does</h2>
          <ul class="public-site-check-list">
            <li>Turns stakeholder conversations into a visible discovery trail.</li>
            <li>Separates known requirements from open questions and assumptions.</li>
            <li>Routes follow-up questions toward the right subject matter area.</li>
            <li>Creates story and task shaped outputs that humans can review.</li>
            <li>Feeds clearer inputs into the build harness when the work is ready.</li>
          </ul>
        </section>

        <section class="public-site-detail-section" aria-labelledby="product-discovery-assistance-possible">
          <p class="public-site-eyebrow">Why It Matters</p>
          <h2 id="product-discovery-assistance-possible">What this makes possible</h2>
          <p>The goal is not to replace product judgement. The goal is to make product judgement easier to apply while the work is still cheap to change.</p>
          <ul class="public-site-check-list">
            <li>Stakeholders can see what has been understood before build work starts.</li>
            <li>Missing decisions become explicit instead of silently turning into implementation risk.</li>
            <li>Teams can move from interview to story to build input faster.</li>
            <li>Approval cycles can happen around clear slices of work rather than vague promises.</li>
            <li>The build harness receives better inputs, which reduces downstream rework.</li>
          </ul>
        </section>

        <section class="public-site-detail-section" aria-labelledby="product-discovery-assistance-flow">
          <p class="public-site-eyebrow">Flow</p>
          <h2 id="product-discovery-assistance-flow">A public version of the pipeline</h2>
          ${renderPipelineShowcase("product-discovery-assistance-flow", "Product Discovery Assistance pipeline", [
            {
              label: "Stakeholder interview",
              title: "The conversation is captured as working material",
              summary: "The initial interview is treated as structured product input, not just a transcript or a loose chat history.",
              examples: ["Business context", "Stakeholder goals", "Constraints", "Success signals"],
            },
            {
              label: "Understanding",
              title: "The harness shows what it thinks it heard",
              summary: "The system makes its interpretation visible so a human can correct scope, terminology, risk, and implied requirements early.",
              examples: ["Problem summary", "Audience", "Assumptions", "Known unknowns"],
            },
            {
              label: "Questions",
              title: "Follow-up questions are routed by subject matter",
              summary: "Unclear areas are turned into specific questions so the right person can answer before the build path hardens.",
              examples: ["Policy question", "Workflow question", "Data question", "Approval question"],
            },
            {
              label: "Stories",
              title: "The work becomes value-shaped slices",
              summary: "Discovery output is converted into stories that describe what needs to change for a real user or operator.",
              examples: ["Actor", "Outcome", "Acceptance notes", "Open decisions"],
            },
            {
              label: "Tasks",
              title: "Approved stories become build-ready work",
              summary: "Stories are broken down into smaller tasks with boundaries clear enough for implementation planning.",
              examples: ["Frontend task", "Backend task", "Docs task", "Proof task"],
            },
            {
              label: "Approval",
              title: "Humans keep control of the handoff",
              summary: "The output is not treated as final until the right person can approve, redirect, or reject the next build step.",
              examples: ["Approved scope", "Deferred items", "Rejected assumptions", "Next workstream"],
            },
          ])}
        </section>

        <section class="public-site-detail-section" aria-labelledby="product-discovery-assistance-evidence">
          <p class="public-site-eyebrow">Evidence</p>
          <h2 id="product-discovery-assistance-evidence">Evidence in the repo</h2>
          <p>The public evidence is the shape of the planning harness: discovery packets, taxonomy routing, story breakdowns, task breakdowns, decision records, and issue reconciliation notes that turn ambiguous input into reviewable work.</p>
          <ul class="public-site-check-list">
            <li>Discovery packets: record the problem, audience, scope, and open questions.</li>
            <li>Taxonomy routing: keeps different kinds of product input from being treated the same way.</li>
            <li>Story breakdowns: turn discovery into smaller slices of product value.</li>
            <li>Task breakdowns: convert approved stories into implementation-ready work.</li>
            <li>Reconciliation notes: capture what was missed and strengthen the next loop.</li>
          </ul>
        </section>

        <section class="public-site-detail-section" aria-labelledby="product-discovery-assistance-private">
          <p class="public-site-eyebrow">Boundary</p>
          <h2 id="product-discovery-assistance-private">What I am not publishing</h2>
          <p>The public version explains the purpose, shape, and evidence of Product Discovery Assistance. The detailed interview prompts, routing rules, scoring logic, private customer examples, and internal orchestration workflow are intentionally private.</p>
        </section>

        <nav class="public-site-detail-actions" aria-label="Product Discovery Assistance related pages">
          <a class="public-site-text-link" href="/projects">Back to projects</a>
          <a class="public-site-text-link" href="/projects/feature-compiler">Next: Feature Compiler</a>
        </nav>
      </article>
    </main>`,
    {
      navItems: [{ href: "/projects", label: "Projects" }],
      breadcrumbs: [
        { href: "/", label: "Home" },
        { href: "/projects", label: "Projects" },
        { label: "Product Discovery Assistance", current: true },
      ],
    },
  );
}

function renderBlogPlaceholder(): string {
  return renderPage(
    "Kanbien Journal",
    `<main class="public-site-page">
      <section class="public-site-simple-panel" aria-labelledby="journal-title">
        <p class="public-site-eyebrow">Journal</p>
        <h1 id="journal-title">Journal placeholder</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Journal entries will live here.</p>
        <a class="public-site-button public-site-button-primary" href="/">Back Home</a>
      </section>
    </main>`,
  );
}

export function createPublicSiteRouter(): Router {
  const router = Router();

  router.get("/", (_request, response) => {
    response.type("html").send(renderHomePage());
  });

  router.get("/blog", (_request, response) => {
    response.type("html").send(renderBlogPlaceholder());
  });

  router.get("/projects", (_request, response) => {
    response.type("html").send(renderProjectsPage());
  });

  router.get("/projects/feature-compiler", (_request, response) => {
    response.type("html").send(renderFeatureCompilerPage());
  });

  router.get("/projects/front-end-builder", (_request, response) => {
    response.type("html").send(renderFrontEndBuilderPage());
  });

  router.get("/projects/product-discovery-assistance", (_request, response) => {
    response.type("html").send(renderProductDiscoveryAssistancePage());
  });

  return router;
}
