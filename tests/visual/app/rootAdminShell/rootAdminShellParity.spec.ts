import { expect, test, type Page, type Route } from "@playwright/test";

const mockSession = {
  rootUserId: "root_user_001",
  authPrincipalId: "auth_principal_001",
  email: "root.admin@example.test",
  displayName: "Root Admin",
  expiresAt: "9999-04-16T18:00:00.000Z",
};

function requestBodyOrNull(route: Route) {
  try {
    return route.request().postDataJSON();
  } catch {
    return null;
  }
}

async function bootstrapAuthenticatedOverview(page: Page) {
  const conversationId = "00000000-0000-4000-8000-000000000101";
  const packetRevisionId = "00000000-0000-4000-8000-000000000102";
  const harnessChatRequests: Array<{ method: string; url: string; body: unknown }> = [];
  const messages = [
    {
      messageId: "00000000-0000-4000-8000-000000000103",
      role: "user",
      body: "I want the root admin to start discovery from here and keep the packet history visible.",
      createdAt: "2026-05-08T00:00:00.000Z",
    },
    {
      messageId: "00000000-0000-4000-8000-000000000104",
      role: "assistant",
      body: "Captured by protected harness API. Page context remains helpful context only.",
      createdAt: "2026-05-08T00:00:01.000Z",
    },
  ];
  const conversationPayload = (overrides: Record<string, unknown> = {}) => ({
    conversationId,
    productRequestId: null,
    state: "active",
    sourceChannel: "app",
    rootScope: true,
    createdByRootUserId: mockSession.rootUserId,
    createdAt: "2026-05-08T00:00:00.000Z",
    updatedAt: "2026-05-08T00:00:01.000Z",
    latestPacketRevisionId: null,
    latestPacketState: null,
    title: "Root-admin discovery request",
    messages,
    surfaceContext: {
      moduleKey: "root-admin",
      pageKey: "overview",
      roleContext: "root-builder",
    },
    structuredDiscoveryState: {},
    ...overrides,
  });

  await page.route("**/v1/root-auth/browser/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockSession),
    });
  });

  await page.route("**/v1/root-admin/harness-chat/conversations", async (route) => {
    const body = requestBodyOrNull(route) as { initialMessage?: string } | null;
    harnessChatRequests.push({
      method: route.request().method(),
      url: route.request().url(),
      body,
    });
    if (route.request().method() === "POST") {
      const shouldReturnPacket = body?.initialMessage?.includes("Use the visible page context") === true;
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(
          conversationPayload(
            shouldReturnPacket
              ? {
                  latestPacketRevisionId: packetRevisionId,
                  latestPacketState: "generated",
                }
              : {},
          ),
        ),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [conversationPayload()],
        page: 1,
        pageSize: 25,
        totalCount: 1,
      }),
    });
  });

  await page.route(`**/v1/root-admin/harness-chat/conversations/${conversationId}/messages`, async (route) => {
    const body = requestBodyOrNull(route) as { message?: string } | null;
    harnessChatRequests.push({
      method: route.request().method(),
      url: route.request().url(),
      body,
    });
    const shouldReturnPacket = body?.message?.includes("Use the visible page context") === true;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        conversation: conversationPayload(
          shouldReturnPacket
            ? {
                latestPacketRevisionId: packetRevisionId,
                latestPacketState: "generated",
              }
            : {},
        ),
      }),
    });
  });

  await page.route(`**/v1/root-admin/harness-chat/conversations/${conversationId}/packet-generations`, async (route) => {
    harnessChatRequests.push({
      method: route.request().method(),
      url: route.request().url(),
      body: requestBodyOrNull(route),
    });
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        packet: {
          packetRevisionId,
          conversationId,
          state: "generated",
          version: 1,
          pdf: { downloadAvailable: true },
        },
        conversation: conversationPayload({
          state: "packet-ready",
          latestPacketRevisionId: packetRevisionId,
          latestPacketState: "generated",
        }),
      }),
    });
  });

  await page.route(`**/v1/root-admin/harness-chat/packet-revisions/${packetRevisionId}/pdf`, async (route) => {
    harnessChatRequests.push({
      method: route.request().method(),
      url: route.request().url(),
      body: null,
    });
    await route.fulfill({
      status: 200,
      contentType: "application/pdf",
      body: "%PDF-1.4\n% mocked packet\n%%EOF\n",
    });
  });

  await page.route("**/v1/root-users**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [],
        page: 1,
        pageSize: 25,
        totalPages: 0,
        totalMatchingRecords: 0,
        totalSearchableRecords: 0,
      }),
    });
  });

  await page.route("**/v1/web-app-hierarchy/tree", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        rootFamilies: [
          {
            rootFamilyId: "root-admin",
            modules: [],
          },
        ],
      }),
    });
  });

  await page.route(/.*\/v1\/web-app-page-settings\/root-families\/[^/]+\/pages\/[^/]+\/context-nav$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        rootFamilyId: "root-admin",
        shellPageKey: "overview",
        items: [],
      }),
    });
  });

  await page.goto("/root-admin");
  await page.locator("#shell-view").waitFor({ state: "visible" });
  await page.locator(".sub-nav").waitFor({ state: "visible" });
  await page.locator(".context-nav").waitFor({ state: "visible" });

  return { harnessChatRequests };
}

async function bootstrapUnauthenticatedRootAdmin(page: Page) {
  await page.route("**/v1/root-auth/browser/session", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      }),
    });
  });

  await page.goto("/root-admin");
  await page.locator("[data-login-template]").waitFor({ state: "visible" });
}

async function collectStyles(page: Page, selector: string, properties: string[]) {
  return page.locator(selector).evaluate((node, props) => {
    const styles = window.getComputedStyle(node);
    return Object.fromEntries(props.map((prop) => [prop, styles.getPropertyValue(prop)]));
  }, properties);
}

test("root-admin authenticated shell uses the same shell stylesheet entrypoints and core computed styles as the signed-off page shell", async ({ page, context }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedOverview(page);

  const designSystemPage = await context.newPage();
  await designSystemPage.setViewportSize({ width: 1560, height: 1400 });
  await designSystemPage.goto("/design-system/templates/page-shell");
  await designSystemPage.locator(".design-system-shell > .top-nav").waitFor({ state: "visible" });

  const appStylesheetHrefs = await page.locator('link[rel="stylesheet"]').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("href")).filter(Boolean),
  );

  expect(appStylesheetHrefs).toContain("/design-system/assets/styles.css");
  expect(appStylesheetHrefs).toContain("/design-system/assets/list-page-shared.css");
  expect(appStylesheetHrefs).toContain("/design-system/assets/hierarchy-tree-shared.css");
  expect(appStylesheetHrefs).toContain("/design-system/assets/form-template-shared.css");
  expect(appStylesheetHrefs).toContain("/design-system/assets/hierarchyTree.css");
  expect(appStylesheetHrefs.some((href) => href?.startsWith("/design-system/assets/conversationPanel.css"))).toBe(true);
  expect(appStylesheetHrefs).not.toContain("/root-admin/assets/login.css");
  expect(appStylesheetHrefs).not.toContain("/root-admin/assets/styles.css");

  await expect(page.locator("#shell-view.design-system-shell")).toHaveCount(1);
  await expect(page.locator(".sub-nav")).toHaveCount(1);
  await expect(page.locator(".sub-nav-row")).toHaveCount(0);
  await expect(page.locator(".context-nav .context-nav-main")).toHaveCount(1);
  await expect(page.locator(".context-nav .context-nav-main-items")).toHaveCount(0);
  await expect(page.locator("#root-admin-main.design-system-page-main")).toHaveCount(1);

  const shellComparisons = [
    {
      appSelector: "#shell-view > .top-nav",
      designSelector: ".design-system-shell > .top-nav",
      properties: ["padding-top", "padding-right", "padding-bottom", "padding-left", "gap", "border-bottom-width"],
    },
    {
      appSelector: "#shell-view > .sub-nav",
      designSelector: ".design-system-shell > .sub-nav",
      properties: ["padding-top", "padding-right", "padding-bottom", "padding-left", "gap", "border-bottom-width"],
    },
    {
      appSelector: "#shell-search-form.search-shell .search-shell-field",
      designSelector: ".design-system-shell > .sub-nav .search-shell .search-shell-field",
      properties: ["max-width", "border-radius", "padding-top", "padding-right", "padding-bottom", "padding-left"],
    },
    {
      appSelector: "#shell-search-input.search-input",
      designSelector: "#design-system-search.search-input",
      properties: ["min-height", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width"],
    },
    {
      appSelector: "#root-admin-context-nav-mount > .context-nav",
      designSelector: ".design-system-shell > .context-nav",
      properties: ["width", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-right-width"],
    },
    {
      appSelector: "#root-admin-main.design-system-page-main",
      designSelector: ".design-system-page-main",
      properties: ["margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left"],
    },
    {
      appSelector: ".context-nav-bottom-group .context-nav-mobile-overflow-target",
      designSelector: ".context-nav-bottom-group .context-nav-mobile-overflow-target",
      properties: ["min-height", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-radius"],
    },
  ] as const;

  for (const comparison of shellComparisons) {
    const appStyles = await collectStyles(page, comparison.appSelector, [...comparison.properties]);
    const designStyles = await collectStyles(designSystemPage, comparison.designSelector, [...comparison.properties]);
    expect(appStyles).toEqual(designStyles);
  }

  await designSystemPage.close();
});

test("root-admin Build panel consumes the shared conversation panel seam with protected API handlers", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await bootstrapAuthenticatedOverview(page);

  const mount = page.locator("#root-admin-conversation-panel-mount.conversation-panel-shell-mount");
  await expect(mount).toBeVisible();
  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-panel")).toBeHidden();
  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-action-nav")).toBeVisible();
  await expect(page.locator(".conversation-panel-shell-mount [data-build-work-panel-build-action]")).toHaveAttribute("aria-pressed", "true");
  await page.locator(".conversation-panel-shell-mount [data-build-work-panel-build-action]").click();
  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-panel")).toBeVisible();
  const shellPanelGeometry = await page.locator(".conversation-panel-shell-mount").evaluate((mount) => {
    const panel = mount.querySelector(".build-work-panel-demo-panel");
    const thread = mount.querySelector(".build-work-panel-demo-thread");
    const message = mount.querySelector(".build-work-panel-demo-message");
    if (!(mount instanceof HTMLElement) || !(panel instanceof HTMLElement) || !(thread instanceof HTMLElement) || !(message instanceof HTMLElement)) {
      return { issues: ["missing panel elements"] };
    }

    const mountRect = mount.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const threadRect = thread.getBoundingClientRect();
    const messageRect = message.getBoundingClientRect();
    const panelStyle = window.getComputedStyle(panel);
    const issues = [];
    if (panelRect.left < mountRect.left - 1 || panelRect.right > mountRect.right + 1) {
      issues.push("panel escapes shell mount");
    }
    if (messageRect.left < threadRect.left - 1 || messageRect.right > threadRect.right + 1) {
      issues.push("message escapes thread column");
    }
    if (panelStyle.backgroundColor === "rgba(0, 0, 0, 0)" || panelStyle.backgroundColor === "transparent") {
      issues.push("panel surface is transparent");
    }

    return {
      issues,
      mountWidth: mountRect.width,
      panelWidth: panelRect.width,
      panelBackground: panelStyle.backgroundColor,
    };
  });
  expect(shellPanelGeometry.issues).toEqual([]);
  expect(shellPanelGeometry.mountWidth).toBeGreaterThan(600);
  expect(shellPanelGeometry.panelWidth).toBeGreaterThan(500);

  const mainBefore = await page.locator("#root-admin-main").boundingBox();
  await page.locator(".conversation-panel-shell-mount [data-build-work-panel-build-action]").click();
  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-panel")).toBeHidden();
  const closedPanelGeometry = await page.locator(".conversation-panel-shell-mount").evaluate((mount) => {
    const actionNav = mount.querySelector(".build-work-panel-demo-action-nav");
    const mountRect = mount.getBoundingClientRect();
    const mountStyle = window.getComputedStyle(mount);
    return {
      mountWidth: mountRect.width,
      background: mountStyle.backgroundColor,
      actionNavVisible: actionNav instanceof HTMLElement && window.getComputedStyle(actionNav).display !== "none",
    };
  });
  expect(closedPanelGeometry.mountWidth).toBeLessThanOrEqual(80);
  expect(closedPanelGeometry.background).toBe("rgba(0, 0, 0, 0)");
  expect(closedPanelGeometry.actionNavVisible).toBe(true);
  const closedRailClearance = await page.evaluate(() => {
    const actionNav = document.querySelector(".conversation-panel-shell-mount .build-work-panel-demo-action-nav");
    const cards = [...document.querySelectorAll("#root-admin-main .component-catalog-card")];

    if (!(actionNav instanceof HTMLElement) || cards.length === 0) {
      return { gap: -1 };
    }

    const actionNavLeft = actionNav.getBoundingClientRect().left;
    const maxCardRight = Math.max(...cards.map((card) => card.getBoundingClientRect().right));
    return {
      actionNavLeft,
      maxCardRight,
      gap: actionNavLeft - maxCardRight,
    };
  });
  expect(closedRailClearance.gap).toBeGreaterThanOrEqual(8);
  await page.locator(".conversation-panel-shell-mount [data-build-work-panel-build-action]").click();
  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-panel")).toBeVisible();
  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-message").first()).toContainText(
    "hello Root, what would you like us to work on today?",
  );
  await expect(page.locator(".conversation-panel-shell-mount [data-build-work-panel-tools-toggle]")).toHaveCount(0);
  await expect(page.locator(".conversation-panel-shell-mount [data-build-work-panel-packet]")).toHaveCount(0);
  const composerGeometry = await page.locator(".conversation-panel-shell-mount").evaluate((mount) => {
    const composer = mount.querySelector(".build-work-panel-demo-composer");
    const textarea = mount.querySelector("[data-build-work-panel-message]");
    const send = mount.querySelector(".build-work-panel-demo-send");
    if (!(composer instanceof HTMLElement) || !(textarea instanceof HTMLElement) || !(send instanceof HTMLElement)) {
      return { inputShare: 0, gap: -1 };
    }

    const composerRect = composer.getBoundingClientRect();
    const textareaRect = textarea.getBoundingClientRect();
    const sendRect = send.getBoundingClientRect();
    return {
      inputShare: textareaRect.width / composerRect.width,
      gap: sendRect.left - textareaRect.right,
    };
  });
  expect(composerGeometry.inputShare).toBeGreaterThan(0.82);
  expect(composerGeometry.gap).toBeGreaterThanOrEqual(6);
  const mainAfter = await page.locator("#root-admin-main").boundingBox();
  expect(mainAfter?.x).toBe(mainBefore?.x);
  expect(mainAfter?.y).toBe(mainBefore?.y);
  await expect(page.locator("#shell-message")).toBeHidden();

  await page.locator(".conversation-panel-shell-mount [data-build-work-panel-message]").fill("Please capture this protected API request.");
  await page.locator(".conversation-panel-shell-mount .build-work-panel-demo-send").click();
  await expect(page.locator("#shell-message")).toBeHidden();
  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-message").last()).toContainText("Captured by protected harness API");
  await expect(page.locator(".conversation-panel-shell-mount [data-build-work-panel-packet]")).toHaveCount(0);
  await expect(page.locator(".conversation-panel-shell-mount [data-build-work-panel-download]")).toHaveCount(0);

  await page.locator(".conversation-panel-shell-mount [data-build-work-panel-edit-message]").first().click();
  await expect(page.locator("#shell-message")).toBeHidden();
  await expect(page.locator(".conversation-panel-shell-mount [data-build-work-panel-edit-box]")).toBeVisible();

  await page.locator("#display-settings-button").click();
  await page.locator('[data-theme-option="dark"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const darkPanelColors = await page.locator(".conversation-panel-shell-mount").evaluate((mount) => {
    const panel = mount.querySelector(".build-work-panel-demo-panel");
    const history = mount.querySelector(".build-work-panel-demo-history");
    const message = mount.querySelector(".build-work-panel-demo-message");
    if (!(panel instanceof HTMLElement) || !(history instanceof HTMLElement) || !(message instanceof HTMLElement)) {
      return { issues: ["missing panel elements"] };
    }

    return {
      issues: [],
      panelBackground: window.getComputedStyle(panel).backgroundColor,
      historyBackground: window.getComputedStyle(history).backgroundColor,
      messageBackground: window.getComputedStyle(message).backgroundColor,
      panelColor: window.getComputedStyle(panel).color,
    };
  });
  expect(darkPanelColors.issues).toEqual([]);
  expect(darkPanelColors.panelBackground).not.toBe("rgb(255, 255, 255)");
  expect(darkPanelColors.historyBackground).not.toBe("rgb(248, 251, 255)");
  expect(darkPanelColors.messageBackground).not.toBe("rgb(255, 255, 255)");
});

test("root-admin Build panel keeps the mobile floating action path reachable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 820 });
  await bootstrapAuthenticatedOverview(page);

  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-panel")).toBeVisible();
  await page.locator(".conversation-panel-shell-mount [data-build-work-panel-close]").click();
  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-panel")).toBeHidden();
  await expect(page.locator(".conversation-panel-shell-mount [data-build-work-panel-open]")).toBeVisible();
  await page.locator(".conversation-panel-shell-mount [data-build-work-panel-open]").click();
  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-panel")).toBeVisible();
  await expect(page.locator(".conversation-panel-shell-mount [data-build-work-panel-message]")).toBeVisible();
});

test("root-admin Build panel treats page context as prompt data rather than URL or download authority", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const { harnessChatRequests } = await bootstrapAuthenticatedOverview(page);
  await page.evaluate(() => {
    window.history.replaceState(null, "", "/root-admin?tenantId=tenant_evil&role=superuser#tenant-admins");
  });

  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-message").first()).toContainText(
    "hello Root, what would you like us to work on today?",
  );
  await expect(page.locator(".conversation-panel-shell-mount [data-build-work-panel-packet]")).toHaveCount(0);
  await page.locator(".conversation-panel-shell-mount [data-build-work-panel-message]").fill("Use the visible page context only as context.");
  await page.locator(".conversation-panel-shell-mount .build-work-panel-demo-send").click();
  await expect(page.locator(".conversation-panel-shell-mount .build-work-panel-demo-message").last()).toContainText("Captured by protected harness API");
  await expect(page.locator(".conversation-panel-shell-mount [data-build-work-panel-packet]")).toBeVisible();
  await page.locator(".conversation-panel-shell-mount [data-build-work-panel-download]").first().click();

  const createRequest = harnessChatRequests.find((request) =>
    request.method === "POST" && request.url.endsWith("/v1/root-admin/harness-chat/conversations")
  );
  expect(createRequest?.body).toMatchObject({
    sourceChannel: "app",
    surfaceContext: {
      moduleKey: "root-admin",
      pageKey: "overview",
      pageLabel: "Overview",
      pathname: "/root-admin",
      roleContext: "root-builder",
    },
  });
  expect(JSON.stringify(createRequest?.body)).not.toContain("tenant_evil");
  expect(JSON.stringify(createRequest?.body)).not.toContain("superuser");

  await expect.poll(() =>
    harnessChatRequests.find((request) =>
      request.method === "GET" && request.url.includes("/packet-revisions/")
    )
  ).not.toBeUndefined();
  const pdfRequest = harnessChatRequests.find((request) =>
    request.method === "GET" && request.url.includes("/packet-revisions/")
  );
  expect(pdfRequest?.url).toContain("/v1/root-admin/harness-chat/packet-revisions/");
  expect(pdfRequest?.url).not.toContain("tenantId=");
  expect(pdfRequest?.url).not.toContain("role=");
});

test("root-admin login consumes the governed login template and switches into SSH challenge state", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.route("**/v1/root-auth/login/password", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "SSH_CHALLENGE_REQUIRED",
        challengeId: "challenge_001",
        challengeText: "kanbien-root-admin-login-challenge",
        expiresAt: "2027-04-16T18:05:00.000Z",
        availableSshKeys: [
          {
            fingerprint: "SHA256:root-admin-key",
            label: "Root admin workstation",
          },
        ],
      }),
    });
  });

  await bootstrapUnauthenticatedRootAdmin(page);

  await expect(page.locator("#auth-view.login-template-stage")).toBeVisible();
  await expect(page.locator("[data-login-template]")).toHaveAttribute("data-login-variant", "password");
  await expect(page.locator("#login-form.login-template-form")).toBeVisible();
  await expect(page.locator(".auth-panel")).toHaveCount(0);

  await page.locator("#email").fill("root.admin@example.test");
  await page.locator("#password").fill("StrongPass1!");
  await page.locator("#login-form").evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });

  await expect(page.locator("[data-login-template]")).toHaveAttribute("data-login-variant", "ssh-challenge");
  await expect(page.locator("#ssh-stage")).toBeVisible();
  await expect(page.locator("#ssh-key-choice-list")).toBeVisible();
  await expect(page.getByRole("radio", { name: /Root admin workstation/ })).toBeChecked();
  await expect(page.locator('input[name="sshKeyFingerprint"]:checked')).toHaveValue("SHA256:root-admin-key");
  await expect(page.locator(".login-template-key-fingerprint").first()).toHaveCSS("text-overflow", "ellipsis");
  await expect(page.locator(".login-template-key-fingerprint").first()).toHaveCSS("white-space", "nowrap");
  await expect(page.getByRole("link", { name: "Launch Helper" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Download Helper Source" })).toHaveCount(0);
});

test("root-admin login keeps backend auth errors inside the login template", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  await page.route("**/v1/root-auth/login/password", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        code: "INVALID_CREDENTIALS",
        message: "Email or password is incorrect.",
      }),
    });
  });

  await bootstrapUnauthenticatedRootAdmin(page);
  await page.locator("#email").fill("root.admin@example.test");
  await page.locator("#password").fill("wrong-password");
  await page.locator("#login-form").evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });

  await expect(page.locator("[data-login-template]")).toHaveAttribute("data-login-variant", "password");
  await expect(page.locator("#auth-message")).toContainText("Email or password is incorrect.");
  await expect(page.locator("#shell-view")).toBeHidden();

  await page.unroute("**/v1/root-auth/login/password");
  await page.route("**/v1/root-auth/login/password", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "SSH_CHALLENGE_REQUIRED",
        challengeId: "challenge_001",
        challengeText: "kanbien-root-admin-login-challenge",
        expiresAt: "2027-04-16T18:05:00.000Z",
        availableSshKeys: [
          {
            fingerprint: "SHA256:root-admin-key",
            label: "Root admin workstation",
          },
        ],
      }),
    });
  });
  await page.route("http://127.0.0.1:8787/v1/root-auth/sign-login-challenge", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        publicKeyFingerprint: "SHA256:root-admin-key",
        signature: "signed-challenge",
      }),
    });
  });
  await page.route("**/v1/root-auth/browser/login/ssh", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        code: "INVALID_SIGNATURE",
        message: "The SSH signature could not be verified.",
      }),
    });
  });

  await page.locator("#password").fill("StrongPass1!");
  await page.locator("#login-form").evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  await expect(page.locator("[data-login-template]")).toHaveAttribute("data-login-variant", "ssh-challenge");

  await page.locator("#sign-submit").click();
  await expect(page.locator("[data-login-template]")).toHaveAttribute("data-login-variant", "ssh-challenge");
  await expect(page.locator("#auth-message")).toContainText("The SSH signature could not be verified.");
  await expect(page.locator("#shell-view")).toBeHidden();
});

test("root-admin users page keeps the same governed list-page header posture as the signed-off list-page route", async ({ page, context }) => {
  await page.setViewportSize({ width: 1560, height: 1400 });
  await bootstrapAuthenticatedOverview(page);
  await page.goto("/root-admin/users");
  await page.locator("#page-users").waitFor({ state: "visible" });

  const designSystemPage = await context.newPage();
  await designSystemPage.setViewportSize({ width: 1560, height: 1400 });
  await designSystemPage.goto("/design-system/templates/list-page");
  await designSystemPage.locator("#list-page-canvas-title").waitFor({ state: "visible" });

  await expect(page.locator("#page-users .component-catalog-section-header")).toHaveCount(1);
  await expect(page.locator("#root-users-page-title.component-catalog-section-title")).toHaveCount(1);
  await expect(page.locator("#page-users .component-catalog-meta")).toHaveCount(1);

  const comparisons = [
    {
      appSelector: "#page-users .component-catalog-section-header",
      designSelector: ".list-page-list-column .component-catalog-section-header",
      properties: ["display", "gap"],
    },
    {
      appSelector: "#root-users-page-title",
      designSelector: "#list-page-canvas-title",
      properties: ["font-size", "font-weight", "line-height", "letter-spacing", "color"],
    },
    {
      appSelector: "#page-users .component-catalog-meta",
      designSelector: ".list-page-list-column .component-catalog-meta",
      properties: ["font-size", "line-height", "color", "margin-top", "margin-bottom"],
    },
  ] as const;

  for (const comparison of comparisons) {
    const appStyles = await collectStyles(page, comparison.appSelector, [...comparison.properties]);
    const designStyles = await collectStyles(designSystemPage, comparison.designSelector, [...comparison.properties]);
    expect(appStyles).toEqual(designStyles);
  }

  await designSystemPage.close();
});
