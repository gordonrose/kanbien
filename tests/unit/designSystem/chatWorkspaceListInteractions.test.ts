import { describe, expect, it } from "vitest";

import { createChatWorkspaceListInteractionController } from "../../../src/frontend/designSystem/assets/chatWorkspaceListInteractions.mjs";

function createWorkspace() {
  const listeners: Record<string, (event: { target?: unknown; key?: string; preventDefault?: () => void }) => void> = {};
  const list = { list: true };
  return {
    dataset: {} as Record<string, string>,
    listeners,
    addEventListener(type: string, handler: (event: { target?: unknown; key?: string; preventDefault?: () => void }) => void) {
      listeners[type] = handler;
    },
    contains(target: unknown) {
      return target === this || target === list;
    },
    querySelector(selector: string) {
      return selector === ".floating-tab-list" ? list : null;
    },
  };
}

function createTarget({ selector, rowKey }: { selector?: string; rowKey?: string } = {}) {
  if (rowKey) {
    return {
      closest(requested: string) {
        return requested === "[data-chat-workspace-list-row], .floating-tab-row" ? this : null;
      },
      querySelector(requested: string) {
        const values = {
          strong: { textContent: `${rowKey} - Questions queued item` },
          "span:not(.floating-tab-row-marker)": { textContent: "Queued" },
          small: { textContent: "Workspace preview" },
        };
        return values[requested as keyof typeof values] ?? null;
      },
    };
  }

  return {
    closest(requested: string) {
      return selector && requested === selector ? this : null;
    },
  };
}

function setup() {
  const calls: string[] = [];
  const workspace = createWorkspace();
  const workspaceState = {
    drawer: { open: false, row: null as null | { key: string } },
    entityDrawerOpen: false,
  };
  const activeState = {
    layer: {
      key: "discovery",
      entities: [
        {
          key: "questions",
          rows: [["QU-001", "Question", "Queued", "Workspace preview"]],
        },
      ],
    },
    entity: {
      key: "questions",
      rows: [["QU-001", "Question", "Queued", "Workspace preview"]],
    },
  };
  const observer = {
    disconnect() {
      calls.push("disconnect-observer");
    },
    observe(target: unknown, options: { childList: boolean }) {
      calls.push(`observe:${String(target === workspace.querySelector(".floating-tab-list"))}:${String(options.childList)}`);
    },
  };
  const controller = createChatWorkspaceListInteractionController({
    activeState,
    getEntityWorkspace() {
      return workspace;
    },
    isEventTargetElement(value: unknown) {
      return Boolean(value && typeof (value as { closest?: unknown }).closest === "function");
    },
    isWorkspaceElement(value: unknown) {
      return value === workspace || value === workspace.querySelector(".floating-tab-list");
    },
    mutationObserverFactory(callback: () => void) {
      calls.push("create-observer");
      callback();
      return observer;
    },
    requestAnimationFrame(callback: () => void) {
      calls.push("request-frame");
      callback();
      return 1;
    },
    syncWorkspaceListRows(value: unknown) {
      calls.push(`sync:${String(value === workspace)}`);
    },
    workspaceState,
  });

  return { calls, controller, workspace, workspaceState };
}

describe("chatWorkspaceListInteractions", () => {
  it("installs workspace drawer interaction wiring and mutation sync", () => {
    const { calls, controller, workspace } = setup();

    controller.installWorkspaceListDrawer(workspace);
    controller.installWorkspaceListDrawer(workspace);

    expect(workspace.dataset.chatWorkspaceDrawerInstalled).toBe("true");
    expect(Object.keys(workspace.listeners).sort()).toEqual(["click", "keydown"]);
    expect(calls).toEqual([
      "create-observer",
      "request-frame",
      "sync:true",
      "observe:true:true",
      "sync:true",
      "disconnect-observer",
      "create-observer",
      "request-frame",
      "sync:true",
      "observe:true:true",
      "sync:true",
    ]);
  });

  it("opens, closes, and keyboard-toggles list drawer state through governed targets", () => {
    const { calls, controller, workspace, workspaceState } = setup();
    controller.installWorkspaceListDrawer(workspace);
    calls.length = 0;

    workspace.listeners.click({ target: createTarget({ rowKey: "QU-001" }) });
    expect(workspaceState.drawer.open).toBe(true);
    expect(workspaceState.drawer.row?.key).toBe("discovery:questions:QU-001 - Questions queued item");
    expect(calls).toEqual(["sync:true"]);

    workspace.listeners.click({ target: createTarget({ selector: "[data-chat-workspace-list-drawer-close]" }) });
    expect(workspaceState.drawer).toEqual({ open: false, row: null });

    let prevented = false;
    workspace.listeners.keydown({
      key: " ",
      target: createTarget({ selector: "[data-chat-workspace-entity-selector-trigger]" }),
      preventDefault() {
        prevented = true;
      },
    });
    expect(prevented).toBe(true);
    expect(workspaceState.entityDrawerOpen).toBe(true);

    workspace.listeners.keydown({
      key: "Escape",
      target: createTarget(),
      preventDefault() {},
    });
    expect(workspaceState.entityDrawerOpen).toBe(false);
  });

  it("closes the entity selector from document outside-click and escape handlers", () => {
    const { calls, controller, workspaceState } = setup();

    workspaceState.entityDrawerOpen = true;
    controller.handleDocumentClick({ target: createTarget() });
    expect(workspaceState.entityDrawerOpen).toBe(false);
    expect(calls).toEqual(["sync:true"]);

    workspaceState.entityDrawerOpen = true;
    controller.handleDocumentKeydown({ key: "Escape" });
    expect(workspaceState.entityDrawerOpen).toBe(false);
    expect(calls).toEqual(["sync:true", "sync:true"]);
  });
});
