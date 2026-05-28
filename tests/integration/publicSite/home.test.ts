import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app";

describe("public site home", () => {
  it("serves a brochure home page with design-system shell chrome and no nav items yet", async () => {
    const response = await request(createApp()).get("/").set("host", "kanbien.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain('data-public-site-header');
    expect(response.text).toContain('class="top-nav top-nav-no-utilities public-site-top-nav"');
    expect(response.text).toContain('class="brand-lockup" href="/" aria-label="Kanbien home"');
    expect(response.text).toContain('class="primary-nav-links" aria-label="No public navigation items yet"></div>');
    expect(response.text).not.toContain('class="search-shell"');
    expect(response.text).not.toContain('class="context-nav"');
  });

  it("renders the requested stripped above-the-fold copy", async () => {
    const response = await request(createApp()).get("/").set("host", "kanbien.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Welcome to Kanbien");
    expect(response.text).toContain("Software projects take entire teams months to scope and deliver properly.");
    expect(response.text).toContain("And much longer still for an implementation that is good to go.");
    expect(response.text).not.toContain("And several months for an implementation that is good to go.");
    expect(response.text).toContain("<p>The experiment I&rsquo;m working on:</p>");
    expect(response.text).toContain(
      "<p><strong>If properly structured, LLMs can make enterprise grade product development happen at the speed of understanding.</strong></p>",
    );
    expect(response.text).toContain(
      "they will be able to build prototypes in real time under stakeholder guidance and turn it into production ready software overnight.",
    );
    expect(response.text).toContain(
      "A working slice of software -that would have taken months to deliver- can be ready for production, signed off, and in use in less than a week of onsite work.",
    );
    expect(response.text).not.toContain("so it is validated with feedback on day two");
    expect(response.text).not.toContain("Cutting costs exponentially");
    expect(response.text).not.toContain("Building Kanbien in public");
    expect(response.text).toContain('<a class="public-site-button public-site-button-primary" href="/projects">Explore the work</a>');
    expect(response.text).not.toContain("Read the Journal");
    expect(response.text).not.toContain("Start with the Timeline");
    expect(response.text).not.toContain("public-site-focus-card");
    expect(response.text).not.toContain("Timeline placeholder");
  });

  it("serves the public site stylesheet and journal placeholder linked by the home CTA", async () => {
    const app = createApp();

    const stylesheet = await request(app).get("/assets/public-site.css").set("host", "kanbien.example.test");
    const journal = await request(app).get("/blog").set("host", "kanbien.example.test");

    expect(stylesheet.status).toBe(200);
    expect(stylesheet.text).toContain("width: min(100% - clamp(2rem, 8vw, 8rem), 62rem);");
    expect(stylesheet.text).toContain("margin: 0 auto;");
    expect(stylesheet.text).toContain("text-align: left;");
    expect(stylesheet.text).toContain("font-weight: 650;");
    expect(stylesheet.text).toContain("font-weight: 600;");
    expect(stylesheet.text).toContain("background: transparent;");
    expect(journal.status).toBe(200);
    expect(journal.text).toContain("Journal placeholder");
  });

  it("serves a projects page with a top navigation button back home", async () => {
    const response = await request(createApp()).get("/projects").set("host", "kanbien.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("<title>Kanbien Projects</title>");
    expect(response.text).toContain('<a class="nav-link" href="/">Home</a>');
    expect(response.text).toContain("Workstream 1");
    expect(response.text).toContain('<h1 id="feature-compiler-title">Feature Compiler</h1>');
    expect(response.text).toContain(
      "One of the earliest realizations I made is that LLMs cannot be trusted to get architecture right",
    );
    expect(response.text).toContain("reliably broken down into thin slices called capabilities");
    expect(response.text).toContain("over 100 structured inputs");
    expect(response.text).not.toContain("reliably brokend down into capabilities");
    expect(response.text).toContain('<a class="public-site-text-link" href="/projects/feature-compiler">learn more</a>');
    expect(response.text).toContain("Workstream 2");
    expect(response.text).toContain('<h1 id="front-end-builder-title">Front-End Builder</h1>');
    expect(response.text).toContain(
      "Many tech organizations can struggle with building reliable front-ends.",
    );
    expect(response.text).toContain(
      "governed, reviewable, and structured in such a way",
    );
    expect(response.text).toContain(
      "must reuse the same seam (style, behaviour, etc.) that has been signed off under the design system.",
    );
    expect(response.text).not.toContain("reviewable, and structure in such a way");
    expect(response.text).toContain('<a class="public-site-text-link" href="/projects/front-end-builder">learn more</a>');
    expect(response.text).toContain("Workstream 3");
    expect(response.text).toContain('<h1 id="product-discovery-assistance-title">Product Discovery Assistance</h1>');
    expect(response.text).toContain(
      "How do we make the work that&rsquo;s being done by the Agentic harness more visible and human approvable through the use of stories and tasks?",
    );
    expect(response.text).toContain(
      "Starting with the stakeholder interview and appropriate routing of follow on questions and decision points based on subject matter.",
    );
    expect(response.text).toContain('<a class="public-site-text-link" href="/projects/product-discovery-assistance">learn more</a>');
    expect(response.text).not.toContain("This page will host the workstream links");
    expect(response.text).not.toContain('aria-label="No public navigation items yet"');
    expect(response.text).toContain('class="sub-nav public-site-sub-nav"');
    expect(response.text).toContain('<a class="breadcrumb-button" href="/">Home</a>');
    expect(response.text).toContain('<span class="breadcrumb-button breadcrumb-current" aria-current="page">Projects</span>');
    expect(response.text).not.toContain('class="search-shell"');
  });

  it("serves a feature compiler project page with secondary breadcrumb navigation and search disabled", async () => {
    const response = await request(createApp()).get("/projects/feature-compiler").set("host", "kanbien.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("<title>Feature Compiler - Kanbien Projects</title>");
    expect(response.text).toContain('<a class="nav-link" href="/projects">Projects</a>');
    expect(response.text).toContain('class="sub-nav public-site-sub-nav"');
    expect(response.text).toContain('<a class="breadcrumb-button" href="/">Home</a>');
    expect(response.text).toContain('<a class="breadcrumb-button" href="/projects">Projects</a>');
    expect(response.text).toContain('<span class="breadcrumb-button breadcrumb-current" aria-current="page">Feature Compiler</span>');
    expect(response.text).toContain('<h1 id="feature-compiler-page-title">Feature Compiler</h1>');
    expect(response.text).toContain("LLMs are fast, but they are not naturally trustworthy architects.");
    expect(response.text).toContain("The problem with going straight from prompt to code");
    expect(response.text).toContain("The harness matters more than the prompt");
    expect(response.text).toContain("What Feature Compiler does");
    expect(response.text).toContain("What this makes possible");
    expect(response.text).toContain("A public version of the pipeline");
    expect(response.text).toContain("Feature request");
    expect(response.text).toContain("Capabilities");
    expect(response.text).toContain("Evidence in the repo");
    expect(response.text).toContain("What I am not publishing");
    expect(response.text).toContain("The detailed prompts, internal routing logic, scoring rules, schemas, and execution workflow are intentionally private.");
    expect(response.text).toContain('<a class="public-site-text-link" href="/projects">Back to projects</a>');
    expect(response.text).toContain('<a class="public-site-text-link" href="/projects/front-end-builder">Next: Front-End Builder</a>');
    expect(response.text).not.toContain('class="search-shell"');
  });

  it("serves a front-end builder project page with secondary breadcrumb navigation and search disabled", async () => {
    const response = await request(createApp()).get("/projects/front-end-builder").set("host", "kanbien.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("<title>Front-End Builder - Kanbien Projects</title>");
    expect(response.text).toContain('<a class="nav-link" href="/projects">Projects</a>');
    expect(response.text).toContain('class="sub-nav public-site-sub-nav"');
    expect(response.text).toContain('<a class="breadcrumb-button" href="/">Home</a>');
    expect(response.text).toContain('<a class="breadcrumb-button" href="/projects">Projects</a>');
    expect(response.text).toContain('<span class="breadcrumb-button breadcrumb-current" aria-current="page">Front-End Builder</span>');
    expect(response.text).toContain('<h1 id="front-end-builder-page-title">Front-End Builder</h1>');
    expect(response.text).toContain("AI can generate screens quickly, but it does not naturally understand what makes a business interface consistent, reusable, and safe to scale.");
    expect(response.text).toContain("Most organizations do not just need a screen that looks good once.");
    expect(response.text).toContain("They need every customer, admin, and internal workflow to follow the same interaction rules");
    expect(response.text).toContain("The problem with letting every page invent its own UI");
    expect(response.text).toContain("Signed-off seams matter more than one-off screens");
    expect(response.text).toContain("What Front-End Builder does");
    expect(response.text).toContain("What this makes possible");
    expect(response.text).toContain("A public version of the pipeline");
    expect(response.text).toContain("UI need");
    expect(response.text).toContain("Design-system proof");
    expect(response.text).toContain("Browser proof");
    expect(response.text).toContain("Evidence in the repo");
    expect(response.text).toContain("What I am not publishing");
    expect(response.text).toContain("The detailed internal prompts, routing logic, review scoring, generation rules, and private implementation workflow are intentionally private.");
    expect(response.text).toContain('<a class="public-site-text-link" href="/projects">Back to projects</a>');
    expect(response.text).toContain('<a class="public-site-text-link" href="/projects/product-discovery-assistance">Next: Product Discovery Assistance</a>');
    expect(response.text).not.toContain('class="search-shell"');
  });

  it("serves a product discovery assistance project page with secondary breadcrumb navigation and search disabled", async () => {
    const response = await request(createApp()).get("/projects/product-discovery-assistance").set("host", "kanbien.example.test");

    expect(response.status).toBe(200);
    expect(response.text).toContain("<title>Product Discovery Assistance - Kanbien Projects</title>");
    expect(response.text).toContain('<a class="nav-link" href="/projects">Projects</a>');
    expect(response.text).toContain('class="sub-nav public-site-sub-nav"');
    expect(response.text).toContain('<a class="breadcrumb-button" href="/">Home</a>');
    expect(response.text).toContain('<a class="breadcrumb-button" href="/projects">Projects</a>');
    expect(response.text).toContain('<span class="breadcrumb-button breadcrumb-current" aria-current="page">Product Discovery Assistance</span>');
    expect(response.text).toContain('<h1 id="product-discovery-assistance-page-title">Product Discovery Assistance</h1>');
    expect(response.text).toContain("Most software risk begins before anyone writes code.");
    expect(response.text).toContain("turning early stakeholder conversations into visible stories, decisions, follow-up questions, and approvable work before the build begins.");
    expect(response.text).toContain("The problem with vague requirements");
    expect(response.text).toContain("Discovery should become an inspectable product artifact");
    expect(response.text).toContain("What Product Discovery Assistance does");
    expect(response.text).toContain("What this makes possible");
    expect(response.text).toContain("A public version of the pipeline");
    expect(response.text).toContain("Stakeholder interview");
    expect(response.text).toContain("Approval");
    expect(response.text).toContain("Evidence in the repo");
    expect(response.text).toContain("What I am not publishing");
    expect(response.text).toContain("The detailed interview prompts, routing rules, scoring logic, private customer examples, and internal orchestration workflow are intentionally private.");
    expect(response.text).toContain('<a class="public-site-text-link" href="/projects">Back to projects</a>');
    expect(response.text).toContain('<a class="public-site-text-link" href="/projects/feature-compiler">Next: Feature Compiler</a>');
    expect(response.text).not.toContain('class="search-shell"');
  });
});
