import express, { Router } from "express";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { env } from "../../config/env";

function escapeHtml(value: string): string {
  return value
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#39;");
}

function resolvePublicSiteRoot(): string {
  const candidates =
    env.nodeEnv === "production"
      ? [
          resolve(process.cwd(), "dist/frontend/publicSite"),
          resolve(process.cwd(), "src/frontend/publicSite"),
        ]
      : [
          resolve(process.cwd(), "src/frontend/publicSite"),
          resolve(process.cwd(), "dist/frontend/publicSite"),
        ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
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
    <link rel="stylesheet" href="/assets/public-site.css" />
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
            <p><strong>If properly structured, LLMs can make enterprise grade product development happen at the speed of understanding.</strong></p>
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
          <ol class="public-site-process-flow" aria-label="Feature Compiler pipeline">
            <li>Feature request</li>
            <li>Capabilities</li>
            <li>Blueprint</li>
            <li>Tasks</li>
            <li>Implementation</li>
            <li>Proof</li>
          </ol>
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
          <ol class="public-site-process-flow" aria-label="Front-End Builder pipeline">
            <li>UI need</li>
            <li>Design-system proof</li>
            <li>Seam</li>
            <li>Canonical</li>
            <li>App adoption</li>
            <li>Browser proof</li>
          </ol>
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
          <ol class="public-site-process-flow" aria-label="Product Discovery Assistance pipeline">
            <li>Stakeholder interview</li>
            <li>Understanding</li>
            <li>Questions</li>
            <li>Stories</li>
            <li>Tasks</li>
            <li>Approval</li>
          </ol>
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
  const publicSiteRoot = resolvePublicSiteRoot();

  router.use(
    "/assets",
    express.static(join(publicSiteRoot, "assets"), {
      fallthrough: false,
      immutable: env.nodeEnv === "production",
      maxAge: env.nodeEnv === "production" ? "1y" : 0,
    }),
  );

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
