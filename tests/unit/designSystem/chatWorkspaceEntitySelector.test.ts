import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  shouldCloseChatWorkspaceEntitySelectorOnDocumentClick,
} from "../../../src/frontend/designSystem/assets/chatWorkspaceEntitySelector.mjs";

describe("chatWorkspaceEntitySelector", () => {
  it("keeps selector rendering and outside-click rules in the entity selector seam", () => {
    const patternSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspacePattern.mjs"),
      "utf8",
    );
    const selectorSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspaceEntitySelector.mjs"),
      "utf8",
    );
    const bootstrapSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspaceBootstrap.mjs"),
      "utf8",
    );

    expect(patternSource).toContain("renderChatWorkspaceEntitySelector");
    expect(patternSource).toContain("createChatWorkspaceBootstrap");
    expect(bootstrapSource).toContain("createChatWorkspaceListInteractionController");
    expect(patternSource).not.toContain("shouldCloseChatWorkspaceEntitySelectorOnDocumentClick");
    expect(patternSource).not.toContain("isChatWorkspaceEntitySelectorEvent");
    expect(patternSource).not.toContain("dataset.chatWorkspaceEntitySelectorOpen");
    expect(patternSource).not.toContain("chat-workspace-entity-option${");
    expect(selectorSource).toContain("shouldCloseChatWorkspaceEntitySelectorOnDocumentClick");
    expect(selectorSource).toContain("isChatWorkspaceEntitySelectorEvent");
    expect(selectorSource).toContain("dataset.chatWorkspaceEntitySelectorOpen");
    expect(selectorSource).toContain("chat-workspace-entity-option");
    expect(selectorSource).toContain("data-chat-workspace-entity-selector-trigger");
  });

  it("classifies outside clicks separately from selector clicks", () => {
    const entityWorkspace = {
      contains(target: unknown) {
        return target === "inside";
      },
    };
    const triggerTarget = {
      closest(selector: string) {
        return selector === "[data-chat-workspace-entity-selector-trigger]" ? {} : null;
      },
    };
    const outsideTarget = {
      closest() {
        return null;
      },
    };

    expect(shouldCloseChatWorkspaceEntitySelectorOnDocumentClick({
      target: "inside",
      entityWorkspace,
    })).toBe(false);
    expect(shouldCloseChatWorkspaceEntitySelectorOnDocumentClick({
      target: triggerTarget,
      entityWorkspace,
    })).toBe(false);
    expect(shouldCloseChatWorkspaceEntitySelectorOnDocumentClick({
      target: outsideTarget,
      entityWorkspace,
    })).toBe(true);
  });
});
