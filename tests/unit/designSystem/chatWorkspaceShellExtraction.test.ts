import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("chatWorkspaceShell extraction", () => {
  it("keeps the demo route wired through the shared shell controller seam", () => {
    const patternSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspacePattern.mjs"),
      "utf8",
    );
    const shellSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspaceShell.mjs"),
      "utf8",
    );
    const bootstrapSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspaceBootstrap.mjs"),
      "utf8",
    );

    expect(patternSource).toContain("createChatWorkspaceBootstrap");
    expect(patternSource).toContain("bootstrapController?.syncWorkspaceToggle");
    expect(patternSource).not.toContain("workspaceState.expanded = !workspaceState.expanded");
    expect(bootstrapSource).toContain("createChatWorkspaceShellController");
    expect(bootstrapSource).toContain("shellController?.sync");
    expect(bootstrapSource).toContain("shellController?.installExpansionToggle");
    expect(shellSource).toContain("export function createChatWorkspaceShellController");
    expect(shellSource).toContain("installExpansionToggle");
    expect(shellSource).toContain("toggleWorkspace");
    expect(shellSource).toContain("toggleHistory");
  });

  it("keeps consumer adoption blocked behind the shared seam and scoped resolver contract", () => {
    const adoptionContract = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/adoption/chat-workspace-shell-consumer-adoption-contract.md"),
      "utf8",
    );
    const extractionContract = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/adoption/chat-workspace-shell-extraction-contract.md"),
      "utf8",
    );
    const componentContract = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/components/chat-workspace-shell-component.md"),
      "utf8",
    );
    const patternContract = readFileSync(
      resolve(process.cwd(), "docs/workspace/design-system/patterns/chat-workspace-pattern-variant.md"),
      "utf8",
    );
    const sourceContract = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspaceShellContract.mjs"),
      "utf8",
    );
    const rootAdminRouteSource = readFileSync(
      resolve(process.cwd(), "src/frontend/rootAdminShell/routes/build/workspace/page.mjs"),
      "utf8",
    );

    expect(adoptionContract).toContain("Expansion is disabled unless the consumer explicitly sets");
    expect(adoptionContract).toContain("Layer + Entity Category + Chat = Scoped Entity List");
    expect(adoptionContract).toContain("The shell must not call the scoped entity resolver unless all are true");
    expect(adoptionContract).toContain("app-local copies of the canonical shell markup, CSS, or controller logic");
    expect(adoptionContract).toContain("scoped tests for resolver calls using `{ layer, entityCategory, chatId }`");
    expect(extractionContract).toContain("chat-workspace-shell-consumer-adoption-contract.md");
    expect(componentContract).toContain("chat-workspace-shell-consumer-adoption-contract.md");
    expect(patternContract).toContain("chat-workspace-shell-consumer-adoption-contract.md");
    expect(sourceContract).toContain("export function createChatWorkspaceShellConfig");
    expect(sourceContract).toContain("export function shouldResolveChatWorkspaceEntities");
    expect(rootAdminRouteSource).toContain("/design-system/assets/chatWorkspaceMockConsumer.mjs");
    expect(rootAdminRouteSource).toContain("createChatWorkspaceMockConsumerController");
    expect(rootAdminRouteSource).not.toContain("class=\"chat-workspace-shell");
    expect(rootAdminRouteSource).not.toContain("class='chat-workspace-shell");
    expect(rootAdminRouteSource).not.toContain("createChatWorkspaceBootstrap");
  });
});
