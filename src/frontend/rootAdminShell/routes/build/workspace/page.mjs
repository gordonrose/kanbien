import {
  createChatWorkspaceMockConsumerController,
  createChatWorkspaceMockConsumerState,
} from "/design-system/assets/chatWorkspaceMockConsumer.mjs";

export function mountBuildWorkspacePage({
  panelRoot,
  root,
  getCurrentPage = () => "overview",
} = {}) {
  let controller = null;
  let themeObserver = null;

  function destroyController() {
    controller?.destroy?.();
    controller = null;
    themeObserver?.disconnect?.();
    themeObserver = null;
    if (panelRoot instanceof HTMLElement) {
      delete panelRoot.dataset.buildWorkspaceMounted;
      delete panelRoot.dataset.panelOpen;
      panelRoot.removeAttribute("data-theme-scope");
    }
    if (root instanceof HTMLElement) {
      delete root.dataset.buildWorkspaceMounted;
    }
  }

  function syncThemeScope() {
    if (!(panelRoot instanceof HTMLElement)) {
      return;
    }
    const theme = document.documentElement.dataset.theme;
    const shell = panelRoot.querySelector("[data-chat-workspace-shell]");
    if (theme === "dark" || theme === "desert") {
      panelRoot.dataset.themeScope = theme;
      if (shell instanceof HTMLElement) {
        shell.dataset.themeScope = theme;
      }
      return;
    }

    panelRoot.removeAttribute("data-theme-scope");
    if (shell instanceof HTMLElement) {
      delete shell.dataset.themeScope;
    }
  }

  function renderShell() {
    const mount = panelRoot instanceof HTMLElement ? panelRoot : root;
    if (!(mount instanceof HTMLElement) || mount.dataset.buildWorkspaceMounted === "true") {
      return;
    }

    const state = createChatWorkspaceMockConsumerState();
    state.chat.panel.panelOpen = true;
    state.chat.panel.historyOpen = false;
    state.chat.panel.packetState = "none";
    state.workspace.expanded = true;
    state.chat.messages = [
      {
        author: "Harness",
        text: "New chat started. Tell me what you want to shape next.",
      },
    ];

    controller = createChatWorkspaceMockConsumerController(mount, {
      state,
      title: "Build workspace",
    });
    mount.dataset.buildWorkspaceMounted = "true";
    if (root instanceof HTMLElement) {
      root.dataset.buildWorkspaceMounted = "true";
    }
    syncThemeScope();
    themeObserver = new MutationObserver(syncThemeScope);
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
      attributes: true,
    });
  }

  return {
    syncPageState() {
      if (getCurrentPage() === "build-workspace") {
        renderShell();
        return;
      }
      destroyController();
    },
    reset() {
      destroyController();
    },
    destroy() {
      destroyController();
    },
  };
}
