import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  getChatWorkspaceDrawerStateFromTarget,
  getChatWorkspaceDrawerRowFromElement,
  getClosedChatWorkspaceDrawerState,
  isChatWorkspaceDrawerCloseTarget,
} from "../../../src/frontend/designSystem/assets/chatWorkspaceRowDrawer.mjs";

describe("chatWorkspaceRowDrawer", () => {
  it("keeps row drawer rendering and row selection in the row drawer seam", () => {
    const patternSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspacePattern.mjs"),
      "utf8",
    );
    const drawerSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspaceRowDrawer.mjs"),
      "utf8",
    );
    const bootstrapSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/assets/chatWorkspaceBootstrap.mjs"),
      "utf8",
    );

    expect(patternSource).toContain("renderChatWorkspaceListDrawer");
    expect(patternSource).toContain("syncChatWorkspaceRowSelection");
    expect(patternSource).toContain("getClosedChatWorkspaceDrawerState");
    expect(patternSource).toContain("createChatWorkspaceBootstrap");
    expect(bootstrapSource).toContain("createChatWorkspaceListInteractionController");
    expect(patternSource).not.toContain("chat-workspace-list-drawer-header");
    expect(patternSource).not.toContain("data-chat-workspace-list-drawer-close]");
    expect(patternSource).not.toContain("[data-chat-workspace-list-row], .floating-tab-row");
    expect(patternSource).not.toContain("dataset.chatWorkspaceDrawerOpen");
    expect(drawerSource).toContain("chat-workspace-list-drawer-header");
    expect(drawerSource).toContain("dataset.chatWorkspaceDrawerOpen");
    expect(drawerSource).toContain("getChatWorkspaceDrawerStateFromTarget");
    expect(drawerSource).toContain("getClosedChatWorkspaceDrawerState");
    expect(drawerSource).toContain("isChatWorkspaceDrawerCloseTarget");
    expect(drawerSource).toContain("aria-pressed");
  });

  it("derives selected drawer row data from a floating-tab row and active scope", () => {
    const row = {
      querySelector(selector: string) {
        const values = {
          strong: { textContent: "QU-001 - Questions queued item" },
          "span:not(.floating-tab-row-marker)": { textContent: "Queued" },
          small: { textContent: "Workspace preview" },
        };
        return values[selector as keyof typeof values] ?? null;
      },
    };

    expect(getChatWorkspaceDrawerRowFromElement(row, {
      layer: { key: "discovery", label: "Discovery" },
      entity: { key: "questions", label: "Questions" },
    })).toEqual({
      key: "discovery:questions:QU-001 - Questions queued item",
      title: "QU-001 - Questions queued item",
      status: "Queued",
      note: "Workspace preview",
      entity: "Questions",
      layer: "Discovery",
    });
  });

  it("maps interaction targets to drawer state inside the row drawer seam", () => {
    const row = {
      querySelector(selector: string) {
        const values = {
          strong: { textContent: "PR-001 - Product request" },
          "span:not(.floating-tab-row-marker)": { textContent: "Draft" },
          small: { textContent: "Owner needed" },
        };
        return values[selector as keyof typeof values] ?? null;
      },
    };
    const target = {
      closest(selector: string) {
        return selector === "[data-chat-workspace-list-row], .floating-tab-row" ? row : null;
      },
    };
    const closeTarget = {
      closest(selector: string) {
        return selector === "[data-chat-workspace-list-drawer-close]" ? {} : null;
      },
    };

    expect(getClosedChatWorkspaceDrawerState()).toEqual({ open: false, row: null });
    expect(isChatWorkspaceDrawerCloseTarget(closeTarget)).toBe(true);
    expect(getChatWorkspaceDrawerStateFromTarget(target, {
      layer: { key: "delivery", label: "Delivery" },
      entity: { key: "product-requests", label: "Product Requests" },
    })).toEqual({
      open: true,
      row: {
        key: "delivery:product-requests:PR-001 - Product request",
        title: "PR-001 - Product request",
        status: "Draft",
        note: "Owner needed",
        entity: "Product Requests",
        layer: "Delivery",
      },
    });
  });
});
