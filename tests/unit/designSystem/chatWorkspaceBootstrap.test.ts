import { describe, expect, it } from "vitest";

import { createChatWorkspaceBootstrap } from "../../../src/frontend/designSystem/assets/chatWorkspaceBootstrap.mjs";

function createTarget(selector: string) {
  return {
    closest(requested: string) {
      return requested === selector ? { dataset: {} } : null;
    },
  };
}

describe("chatWorkspaceBootstrap", () => {
  it("assembles shell, list interaction, listeners, and initial render order", () => {
    const previousHTMLElement = globalThis.HTMLElement;
    const previousDocument = globalThis.document;
    globalThis.HTMLElement = Object as unknown as typeof HTMLElement;
    globalThis.document = {
      querySelectorAll() {
        return [];
      },
    } as unknown as Document;
    const calls: string[] = [];
    const listeners: Record<string, (event: { target?: unknown; key?: string }) => void> = {};
    const documentListeners: Record<string, (event: { target?: unknown; key?: string }) => void> = {};
    const shell = {
      dataset: {} as Record<string, string>,
      addEventListener(type: string, handler: (event: { target?: unknown; key?: string }) => void) {
        calls.push(`shell-listen:${type}`);
        listeners[type] = handler;
      },
      querySelectorAll() {
        return [];
      },
    };
    const workspaceMain = {
      inert: false,
      setAttribute(name: string, value: string) {
        calls.push(`workspace-main:${name}:${value}`);
      },
    };
    const chatMount = {
      addEventListener() {},
      querySelector(selector: string) {
        if (selector !== ".build-work-panel-demo-header-actions") {
          return null;
        }
        return {
          querySelector() {
            return {};
          },
        };
      },
      querySelectorAll() {
        return [];
      },
    };
    const chatState = {
      panel: {
        historyOpen: true,
      },
    };
    const workspaceState = {
      expansionEnabled: true,
      expanded: false,
      layerDrawerOpen: true,
    };
    try {
      const bootstrap = createChatWorkspaceBootstrap({
      activeState: {
        layer: {
          entities: [],
        },
      },
      applyRequestDisplayState() {
        calls.push("apply-display");
      },
      chatMount,
      chatState,
      documentRef: {
        addEventListener(type: string, handler: (event: { target?: unknown; key?: string }) => void) {
          calls.push(`document-listen:${type}`);
          documentListeners[type] = handler;
        },
        querySelectorAll() {
          return [];
        },
      },
      getEntityWorkspace() {
        return null;
      },
      iconButtonMarkup: "<span></span>",
      isEventTargetElement(value: unknown) {
        return Boolean(value && typeof (value as { closest?: unknown }).closest === "function");
      },
      isShellElement(value: unknown) {
        return value === shell || value === chatMount || value === workspaceMain;
      },
      mountChatPanel() {
        calls.push("mount-chat");
      },
      renderEntityWorkspace() {
        calls.push("render-workspace");
      },
      runActionEffects(target: unknown) {
        calls.push(target ? "run-actions" : "run-actions:null");
        return true;
      },
      selectWorkspaceEntity() {},
      shell,
      startNewConversation() {},
      syncHeaderLayerSelector() {
        calls.push("sync-header");
      },
      syncHistoryDock() {
        calls.push("sync-history-dock");
      },
      syncLayerMode() {},
      syncLayerToolbar() {
        calls.push("sync-layer-toolbar");
      },
      syncWorkspaceListRows() {},
      workspaceMain,
      workspaceState,
      });

      const initialized = bootstrap.initialize({
      onSyncHeader() {
        calls.push("shell-sync-header");
      },
      onSyncHistoryDock() {
        calls.push("shell-sync-history-dock");
      },
      onSyncHistoryIcon() {
        calls.push("shell-sync-history-icon");
      },
      onSyncSecondaryHeader() {
        calls.push("shell-sync-secondary-header");
      },
      });

      expect(chatState.panel.historyOpen).toBe(false);
      expect(initialized.shellController).toBe(bootstrap.getShellController());
      expect(initialized.listInteractions).toBe(bootstrap.getListInteractionController());
      expect(calls).toEqual([
      "apply-display",
      "document-listen:click",
      "document-listen:keydown",
      "shell-listen:click",
      "shell-listen:keydown",
      "mount-chat",
      "render-workspace",
      "workspace-main:aria-hidden:true",
      "shell-sync-history-icon",
      "shell-sync-history-dock",
      "shell-sync-header",
      "shell-sync-secondary-header",
      ]);

      listeners.click({ target: createTarget("[data-chat-workspace-toggle]") });
      expect(calls[calls.length - 1]).toBe("run-actions");

      listeners.keydown({ key: "Escape" });
      expect(workspaceState.layerDrawerOpen).toBe(false);
      expect(calls[calls.length - 1]).toBe("sync-header");

      expect(Object.keys(documentListeners).sort()).toEqual(["click", "keydown"]);
    } finally {
      globalThis.HTMLElement = previousHTMLElement;
      globalThis.document = previousDocument;
    }
  });
});
