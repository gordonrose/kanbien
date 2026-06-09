const layers = [
  {
    number: "00",
    name: "Orchestrator",
    intro: "The traffic controller for design work.",
    description:
      "It keeps each idea moving through the right checks, so decisions are made in order instead of scattered across chats, screenshots, and one-off fixes.",
  },
  {
    number: "01",
    name: "Behavior Rule",
    intro: "The promise a piece of interface has to keep.",
    description:
      "Before anything is styled, this layer explains what the experience must do for people: what can be clicked, what changes, what stays predictable, and what must never surprise them.",
  },
  {
    number: "02",
    name: "Token",
    intro: "The shared ingredients behind the look and feel.",
    description:
      "Tokens name decisions like colour, spacing, shape, type, and focus treatment so the design can change personality without rebuilding the whole experience.",
  },
  {
    number: "03",
    name: "Primitive",
    intro: "The smallest reusable pieces people interact with.",
    description:
      "A primitive turns the ingredients into dependable controls such as links, selectors, labels, and panels, with accessibility and responsive behavior baked in.",
  },
  {
    number: "04",
    name: "Pattern Contract",
    intro: "Reusable page sections with a clear job.",
    description:
      "Patterns combine smaller pieces into familiar structures, like evidence cards or process sections, so similar pages feel consistent without becoming copy-paste designs.",
  },
  {
    number: "05",
    name: "Component Seam",
    intro: "The handoff point from design system to product.",
    description:
      "This layer packages the approved experience so real product screens can use it without reinterpreting the design, behavior, or accessibility rules.",
  },
];

const root = document.querySelector("[data-design-system-home]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Design-system home root not found.");
}

root.innerHTML = `
  <section class="public-site-project-detail">
      <section class="public-site-project-hero" aria-labelledby="design-system-overview-title">
        <p class="public-site-eyebrow">Kanbien design system</p>
        <h1 id="design-system-overview-title">Design-system workspace</h1>
        <p class="public-site-project-hook">
          A behind-the-scenes look at how I turn interface ideas into reusable, testable design decisions.
          It is part sketchbook, part quality system, and part map for building product screens that do not drift.
        </p>
      </section>

      <section class="public-site-detail-section" aria-label="Design-system selector">
        <div class="public-site-evidence-stack">
          ${layers
            .map(
              (layer) => `
                <article class="public-site-detail-section public-site-layer-card" id="design-system-layer-${layer.number}">
                  <p class="public-site-eyebrow">Layer ${layer.number}</p>
                  <h2>${layer.name}</h2>
                  <p class="public-site-project-hook">${layer.intro}</p>
                  <p><strong>Why it matters:</strong> ${layer.description}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
  </section>
`;
