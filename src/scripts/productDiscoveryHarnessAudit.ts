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
      "Do not call tools, create a packet, draft\nfiles, or inspect the repo before that first response.",
      "Do not use a \"first-pass draft, then questions\" pattern",
    ],
  },
  {
    name: "Product Discovery skill has first-response hard gate",
    path: ".codex/skills/20-planning-artifacts/product-discovery-maintainer/SKILL.md",
    mustInclude: [
      "The first assistant response in Discovery Conversation Mode must be a user-facing\nmessage, not a tool call.",
      "Never use a \"first-pass draft, then questions\" pattern",
      "skip repo guardrails and broad sweeps, not discovery judgment",
    ],
  },
  {
    name: "Packet template is not treated as first response",
    path: "docs/templates/product-discovery-packet-template.md",
    mustInclude: [
      "Do not use this template as the first response to a Product Discovery request.",
      "## Known Questions Gate",
      "Do not use a first-pass-draft-then-questions pattern.",
    ],
  },
  {
    name: "Standards point auth rigor to specialized template",
    path: "docs/standards/change-artifact-requirements.md",
    mustInclude: [
      "docs/product-discovery/templates/authentication-access-template.md",
      "skips repo guardrails and broad sweeps, not discovery judgment",
      "This gate does not override the Product Discovery conversation gate above.",
    ],
    mustNotInclude: [
      "authentication/login coverage checklist in the Product Discovery packet\ntemplate",
    ],
  },
  {
    name: "Orchestrator yields to Product Discovery first-response gate",
    path: ".codex/skills/00-orchestration/change-loop-orchestrator/SKILL.md",
    mustInclude: [
      "the Product\nDiscovery first-response hard gate outranks this orchestrator",
      "stop loop classification and route to\n`product-discovery-maintainer`",
    ],
  },
  {
    name: "Design-system loop yields to Product Discovery",
    path: ".codex/skills/40-frontend/frontend-design-system-loop-maintainer/SKILL.md",
    mustInclude: [
      "yield to `product-discovery-maintainer` before using this skill",
      "plain-language summary and first focused question set",
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
