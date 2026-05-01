import { readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  path: string;
  mustInclude?: string[];
  mustNotInclude?: string[];
};

const checks: Check[] = [
  {
    name: "AGENTS protects Product Discovery first response",
    path: "AGENTS.md",
    mustInclude: [
      "Do not call\ntools, create a packet, draft files, or inspect the repo before that first\nresponse.",
      "Do not present a grouped list of follow-up questions in the first response.",
      "The first question must be a gentle orientation question about the normal thing",
      "For UX questions, ask about the value the person needs from the experience",
      "When a choice list could grow large, such as choosing tenants for a tenant\nadmin",
      "Baseline non-functional and compliance requirements are not optional business\nchoices in Layer 1.",
      "Do not ask the business owner whether baseline audit,\nhistory, security, privacy",
      "Do not use a \"first-pass draft, then questions\" pattern",
    ],
    mustNotInclude: [
      "smallest useful question set",
      "smallest useful\nset of product questions",
    ],
  },
  {
    name: "Product Discovery skill has first-response hard gate",
    path: ".codex/skills/20-planning-artifacts/product-discovery-maintainer/SKILL.md",
    mustInclude: [
      "The first assistant response in Discovery Conversation Mode must be a user-facing\nmessage, not a tool call.",
      "reassure the requester that you will walk through the requirement one step\n   at a time",
      "ask exactly one next question in the requester's everyday language",
      "Do not start with edge cases, failure handling, session\nrevocation",
      "First-question ladder:",
      "UX questions should ask about the value a person needs from the experience",
      "assume a searchable selection drawer or equivalent design-system\npicker is the likely recommendation",
      "Baseline non-functional and compliance requirements are not optional business\nchoices in Layer 1.",
      "Should this create an audit/history entry, or is that not needed for the\n> first version?",
      "ask several unrelated questions in one turn during the interview",
      "Never use a \"first-pass draft, then questions\" pattern",
      "skip repo guardrails and broad sweeps, not discovery judgment",
    ],
  },
  {
    name: "Packet template is not treated as first response",
    path: "docs/templates/product-discovery-packet-template.md",
    mustInclude: [
      "Do not use this template as the first response to a Product Discovery request.",
      "The first response must be a plain-language summary and one focused question",
      "## Known Questions Gate",
      "Do not use a first-pass-draft-then-questions pattern.",
    ],
    mustNotInclude: [
      "focused question set",
    ],
  },
  {
    name: "Standards point auth rigor to specialized template",
    path: "docs/standards/change-artifact-requirements.md",
    mustInclude: [
      "docs/product-discovery/templates/authentication-access-template.md",
      "skips repo guardrails and broad sweeps, not discovery judgment",
      "This gate does not override the Product Discovery conversation gate above.",
      "ask the first single\nfocused question before creating or filling the packet",
    ],
    mustNotInclude: [
      "authentication/login coverage checklist in the Product Discovery packet\ntemplate",
      "first question set",
      "next product questions",
    ],
  },
  {
    name: "Orchestrator yields to Product Discovery first-response gate",
    path: ".codex/skills/00-orchestration/change-loop-orchestrator/SKILL.md",
    mustInclude: [
      "the Product\nDiscovery first-response hard gate outranks this orchestrator",
      "stop loop classification and route to\n`product-discovery-maintainer`",
      "one focused first question",
    ],
    mustNotInclude: [
      "focused first question set",
    ],
  },
  {
    name: "Design-system loop yields to Product Discovery",
    path: ".codex/skills/40-frontend/frontend-design-system-loop-maintainer/SKILL.md",
    mustInclude: [
      "yield to `product-discovery-maintainer` before using this skill",
      "plain-language summary and one focused first question",
    ],
    mustNotInclude: [
      "focused question set",
    ],
  },
  {
    name: "Build-from-spec harness uses one-question Product Discovery start",
    path: "docs/architecture/build-from-spec-change-harness.md",
    mustInclude: [
      "Start with a plain-language summary and one focused product question.",
      "ask the next single most useful question instead of a grouped\n  list",
    ],
    mustNotInclude: [
      "focused product questions",
      "first question set",
    ],
  },
  {
    name: "Product Discovery README protects gentle first question",
    path: "docs/product-discovery/README.md",
    mustInclude: [
      "Start with the user's normal everyday goal before asking about awkward cases.",
      "Prepare the requester for the interview with a brief bridge",
      "For UX discovery, ask about the value the experience must provide",
      "the likely recommendation is a searchable selection drawer or equivalent\ngoverned picker",
      "Baseline non-functional and compliance requirements are not optional business\nchoices in Product Discovery.",
      "Assume those are required when a feature touches access, roles,\npermissions",
    ],
  },
];

let failures = 0;

for (const check of checks) {
  const filePath = path.resolve(process.cwd(), check.path);
  const content = readFileSync(filePath, "utf8");

  for (const expected of check.mustInclude ?? []) {
    if (!content.includes(expected)) {
      console.error(`FAIL ${check.name}`);
      console.error(`- ${check.path} missing expected text: ${JSON.stringify(expected)}`);
      failures += 1;
    }
  }

  for (const forbidden of check.mustNotInclude ?? []) {
    if (content.includes(forbidden)) {
      console.error(`FAIL ${check.name}`);
      console.error(`- ${check.path} contains forbidden text: ${JSON.stringify(forbidden)}`);
      failures += 1;
    }
  }
}

if (failures > 0) {
  console.error(`Product Discovery harness audit failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log("Product Discovery harness audit OK.");
