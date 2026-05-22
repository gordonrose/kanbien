import { expect, test } from "@playwright/test";

const entityManagementChildFamilies = [
  {
    familyKey: "entity-management-page-outer-page",
    sampleRef: "EMPO-001",
    expectedCount: 24,
  },
  {
    familyKey: "entity-management-page-navigation",
    sampleRef: "EMPN-020",
    expectedCount: 36,
  },
  {
    familyKey: "entity-management-page-detail-panel",
    sampleRef: "EMPD-001",
    expectedCount: 50,
  },
  {
    familyKey: "entity-management-page-collection-item",
    sampleRef: "EMPI-001",
    expectedCount: 38,
  },
  {
    familyKey: "entity-management-page-evidence-ai",
    sampleRef: "EMPE-003",
    expectedCount: 36,
  },
  {
    familyKey: "entity-management-page-performance",
    sampleRef: "EMPP-001",
    expectedCount: 32,
  },
] as const;

test.describe("entity-management-page child canonical renderings", () => {
  test("detail-panel canonical renderer is driven by declared template states instead of EMPD branches", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-001");

    const source = await page.evaluate(async () => {
      const response = await fetch("/design-system/assets/entityManagementPageCanonical.mjs");
      return response.text();
    });

    expect(source).toContain("detailPanelCanonicalStates");
    expect(source).not.toMatch(/referenceId\s*===\s*["']EMPD-/);
    expect(source).not.toMatch(/referenceId\.startsWith\(["']EMPD-/);
  });

  test("navigation canonical renderer is driven by declared template states instead of EMPN branches", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/entity-management-page-navigation/EMPN-001");

    const source = await page.evaluate(async () => {
      const response = await fetch("/design-system/assets/entityManagementPageCanonical.mjs");
      return response.text();
    });

    expect(source).toContain("navigationCanonicalStates");
    expect(source).not.toMatch(/referenceId\.startsWith\(["']EMPN-/);
  });

  test("collection-item canonical renderer is driven by declared template states instead of EMPI branches", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/entity-management-page-collection-item/EMPI-001");

    const source = await page.evaluate(async () => {
      const response = await fetch("/design-system/assets/entityManagementPageCanonical.mjs");
      return response.text();
    });

    expect(source).toContain("collectionItemCanonicalStates");
    expect(source).not.toMatch(/referenceId\.startsWith\(["']EMPI-/);
  });

  test("evidence-ai canonical renderer is driven by declared template states instead of EMPE branches", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/entity-management-page-evidence-ai/EMPE-001");

    const source = await page.evaluate(async () => {
      const response = await fetch("/design-system/assets/entityManagementPageCanonical.mjs");
      return response.text();
    });

    expect(source).toContain("evidenceAiCanonicalStates");
    expect(source).not.toMatch(/referenceId\.startsWith\(["']EMPE-/);
  });

  test("performance canonical renderer is driven by declared template states instead of EMPP branches", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/entity-management-page-performance/EMPP-001");

    const source = await page.evaluate(async () => {
      const response = await fetch("/design-system/assets/entityManagementPageCanonical.mjs");
      return response.text();
    });

    expect(source).toContain("performanceCanonicalStates");
    expect(source).not.toMatch(/referenceId\.startsWith\(["']EMPP-/);
  });

  test("entity page template seam renders multiple entity configs without Organization-specific markup", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-001");

    const seamContract = await page.evaluate(async () => {
      const module = await import("/design-system/assets/entityManagementPage.mjs");
      const renderTemplate = module.renderEntityPageTemplateDrawerContent;
      const hydrateTemplate = module.hydrateEntityPageTemplateDrawer;
      if (typeof renderTemplate !== "function" || typeof hydrateTemplate !== "function") {
        return { hasSeam: false };
      }

      const fixtures = [
        {
          key: "product-catalog",
          entityLabel: "Products",
          title: "Inventory Catalog",
          status: "Catalog",
          note: "Draft",
          regions: [
            {
              key: "identity",
              label: "Identity",
              description: "Product-facing labels and keys.",
              count: 2,
              items: [
                {
                  key: "summary",
                  label: "Summary",
                  summary: "2 fields",
                  description: "Display name and public label.",
                  contentHtml: "<section aria-label=\"Summary\"><h5>Summary</h5><p>Product template details.</p></section>",
                },
                {
                  key: "pricing",
                  label: "Pricing",
                  summary: "3 fields",
                  description: "Price posture and catalog currency.",
                  contentHtml: "<section aria-label=\"Pricing\"><h5>Pricing</h5><p>Pricing fields stay product-owned.</p></section>",
                },
              ],
            },
            {
              key: "availability",
              label: "Availability",
              description: "Stock and fulfilment posture.",
              count: 1,
              items: [
                {
                  key: "stock",
                  label: "Stock",
                  summary: "Live source",
                  description: "Stock source and sync posture.",
                  contentHtml: "<section aria-label=\"Stock\"><h5>Stock</h5><p>Inventory availability state.</p></section>",
                },
              ],
            },
          ],
        },
        {
          key: "support-ticket",
          entityLabel: "Tickets",
          title: "Escalation Queue",
          status: "Support",
          note: "Ready",
          regions: [
            {
              key: "triage",
              label: "Triage",
              description: "Priority, severity, and ownership.",
              count: 2,
              items: [
                {
                  key: "priority",
                  label: "Priority",
                  summary: "Rules",
                  description: "Escalation priority controls.",
                  contentHtml: "<section aria-label=\"Priority\"><h5>Priority</h5><p>Ticket priority template state.</p></section>",
                },
                {
                  key: "owner",
                  label: "Owner",
                  summary: "Assignment",
                  description: "Queue and accountable person.",
                  contentHtml: "<section aria-label=\"Owner\"><h5>Owner</h5><p>Support ownership template state.</p></section>",
                },
              ],
            },
          ],
        },
      ];

      const results = [];
      for (const fixture of fixtures) {
        const host = document.createElement("div");
        host.innerHTML = `
          <aside data-chat-workspace-list-drawer>
            ${renderTemplate(fixture)}
          </aside>
        `;
        document.body.append(host);
        const drawer = host.querySelector<HTMLElement>("[data-chat-workspace-list-drawer]");
        if (!drawer) {
          throw new Error("Expected the entity-management drawer fixture to render.");
        }
        hydrateTemplate(drawer);
        drawer.querySelector<HTMLElement>("[data-record-management-region-trigger]")?.click();
        drawer.querySelectorAll<HTMLElement>("[data-record-management-nested-trigger]")[1]?.click();
        results.push({
          key: fixture.key,
          hasOrganizationCopy: /Organization|Organizations|Northstar|organizationCore/.test(drawer.textContent ?? ""),
          title: drawer.querySelector(".chat-workspace-list-drawer-header h4")?.textContent?.trim(),
          regionLabels: Array.from(drawer.querySelectorAll("[data-record-management-region-trigger] span")).map((node) => node.textContent?.trim()),
          activeNested: drawer.querySelector("[data-record-management-nested-trigger].is-active")?.getAttribute("data-record-management-nested-trigger"),
          activePanelTitle: drawer.querySelector("[data-record-management-nested-panel]:not([hidden]) h5")?.textContent?.trim(),
        });
        host.remove();
      }

      return { hasSeam: true, results };
    });

    expect(seamContract.hasSeam).toBe(true);
    expect(seamContract.results).toEqual([
      {
        key: "product-catalog",
        hasOrganizationCopy: false,
        title: "Inventory Catalog",
        regionLabels: ["Identity", "Availability"],
        activeNested: "pricing",
        activePanelTitle: "Pricing",
      },
      {
        key: "support-ticket",
        hasOrganizationCopy: false,
        title: "Escalation Queue",
        regionLabels: ["Triage"],
        activeNested: "owner",
        activePanelTitle: "Owner",
      },
    ]);
  });

  for (const family of entityManagementChildFamilies) {
    test(`${family.familyKey} launcher targets dedicated child render routes`, async ({ page }) => {
      await page.goto(`/design-system/canonical-renderings/${family.familyKey}`);

      const links = page.locator(".canonical-launcher-button");
      await expect(links).toHaveCount(family.expectedCount);

      for (const href of await links.evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")))) {
        expect(href).toMatch(new RegExp(`^/design-system/canonical-renderings/${family.familyKey}/`));
        expect(href).not.toContain("/design-system/templates/entity_management_page");
      }
    });

    test(`${family.familyKey} sample render hydrates the shared entity page behavior seam`, async ({ page }) => {
      const path = `/design-system/canonical-renderings/${family.familyKey}/${family.sampleRef}`;
      await page.goto(path);

      await expect(page).toHaveURL(new RegExp(`${family.familyKey}/${family.sampleRef}$`));
      await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
      await expect(page.locator("[data-record-management-entity-page-template]")).toHaveCount(1);
      await expect(page.locator("[data-record-management-region-shell]")).toHaveCount(1);
      await expect(page.locator("[data-record-management-region-trigger]")).not.toHaveCount(0);
      await expect(page.locator("#entity-management-page-canonical-match-list")).toContainText(family.sampleRef);
    });
  }

  test("outer-page canonical refs enforce their declared specimen viewport", async ({ page }) => {
    const readSpecimenState = async () =>
      page.evaluate(() => {
        const frame = document.querySelector("#entity-management-page-preview-frame")?.getBoundingClientRect();
        const shell = document.querySelector("#entity-management-page-preview-shell")?.getBoundingClientRect();
        const mobileHeader = document.querySelector(".record-management-region-mobile-header");
        const regionIndex = document.querySelector(".record-management-region-index");
        const nestedCards = document.querySelector(".record-management-nested-list-cards");

        return {
          bodyScrollAvailable: document.scrollingElement
            ? document.scrollingElement.scrollHeight > document.scrollingElement.clientHeight
            : false,
          frameHeight: frame ? Math.round(frame.height) : 0,
          frameWidth: frame ? Math.round(frame.width) : 0,
          mobileHeaderDisplay: mobileHeader ? getComputedStyle(mobileHeader).display : "",
          nestedCardsFlow: nestedCards ? getComputedStyle(nestedCards).gridAutoFlow : "",
          regionIndexDisplay: regionIndex ? getComputedStyle(regionIndex).display : "",
          shellScrollAvailable: document.querySelector<HTMLElement>("#entity-management-page-preview-shell")
            ? document.querySelector<HTMLElement>("#entity-management-page-preview-shell")!.scrollHeight
              > document.querySelector<HTMLElement>("#entity-management-page-preview-shell")!.clientHeight
            : false,
          shellHeight: shell ? Math.round(shell.height) : 0,
          shellWidth: shell ? Math.round(shell.width) : 0,
          viewportClass: document.querySelector<HTMLElement>("#entity-management-page-preview-shell")?.dataset.viewportClass ?? "",
        };
      });

    await page.goto("/design-system/canonical-renderings/entity-management-page-outer-page/EMPO-004");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect.poll(readSpecimenState).toMatchObject({
      frameHeight: 520,
      shellHeight: 520,
      viewportClass: "desktop",
    });

    await page.goto("/design-system/canonical-renderings/entity-management-page-outer-page/EMPO-006");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect.poll(readSpecimenState).toMatchObject({
      frameWidth: 1024,
      mobileHeaderDisplay: "none",
      regionIndexDisplay: "grid",
      shellWidth: 1024,
      viewportClass: "narrow-desktop",
    });

    await page.goto("/design-system/canonical-renderings/entity-management-page-outer-page/EMPO-007");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect.poll(readSpecimenState).toMatchObject({
      bodyScrollAvailable: true,
      frameHeight: 844,
      frameWidth: 390,
      mobileHeaderDisplay: "grid",
      nestedCardsFlow: "column",
      regionIndexDisplay: "none",
      shellHeight: 844,
      shellScrollAvailable: true,
      shellWidth: 390,
      viewportClass: "mobile",
    });

    await page.locator("#entity-management-page-preview-shell").evaluate((shell) => {
      shell.scrollTop = 900;
    });
    await expect
      .poll(() => page.locator("#entity-management-page-preview-shell").evaluate((shell) => shell.scrollTop))
      .toBeGreaterThan(0);
  });

  test("template host and canonical renderer consume the shared entity-management drawer seam", async ({ page }) => {
    const readDrawerContract = async () =>
      page.evaluate(() => {
        const drawer = document.querySelector("[data-chat-workspace-list-drawer]");
        return {
          hasAiToggle: Boolean(drawer?.querySelector("[data-record-management-ai-mode-toggle]")),
          hasCloseAction: Boolean(drawer?.querySelector("[data-chat-workspace-list-drawer-close]")),
          hasEvidenceToggle: Boolean(drawer?.querySelector("[data-record-management-evidence-mode-toggle]")),
          regionCount: drawer?.querySelectorAll("[data-record-management-region-trigger]").length ?? 0,
          title: drawer?.querySelector(".chat-workspace-list-drawer-header h4")?.textContent?.trim() ?? "",
        };
      });

    await page.goto("/design-system/templates/entity_management_page");
    await expect(page.locator("[data-chat-workspace-list-drawer] .record-management-region-shell")).toBeVisible();
    await expect.poll(readDrawerContract).toEqual({
      hasAiToggle: true,
      hasCloseAction: false,
      hasEvidenceToggle: true,
      regionCount: 13,
      title: "Northstar Operations",
    });

    await page.goto("/design-system/canonical-renderings/entity-management-page-outer-page/EMPO-007");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect.poll(readDrawerContract).toEqual({
      hasAiToggle: true,
      hasCloseAction: false,
      hasEvidenceToggle: true,
      regionCount: 13,
      title: "Northstar Operations",
    });
  });

  test("child canonical refs activate the intended entity-management region", async ({ page }) => {
    const expectedRegions = [
      ["/design-system/canonical-renderings/entity-management-page-navigation/EMPN-023", "Catalogs"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-029", "Display"],
      ["/design-system/canonical-renderings/entity-management-page-collection-item/EMPI-031", "Workflows"],
      ["/design-system/canonical-renderings/entity-management-page-evidence-ai/EMPE-008", "Action Models - Record"],
      ["/design-system/canonical-renderings/entity-management-page-performance/EMPP-030", "Workflows"],
    ] as const;

    for (const [path, regionTitle] of expectedRegions) {
      await page.goto(path);
      await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
      await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText(regionTitle);
    }
  });

  test("detail-panel identity refs activate distinct nested panels", async ({ page }) => {
    const expectedNestedPanels = [
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-001", "primary-details", "Primary Details"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-002", "owning-feature", "Owning Feature"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-003", "source-authority-posture", "Source Authority Posture"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-004", "primary-details", "Primary Details"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-005", "owning-feature", "Owning Feature"],
    ] as const;

    for (const [path, nestedKey, nestedTitle] of expectedNestedPanels) {
      await page.goto(path);
      await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
      await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Identity");
      await expect(page.locator(`[data-record-management-nested-trigger="${nestedKey}"]`)).toHaveClass(/is-active/);
      await expect(page.locator(`[data-record-management-nested-panel="${nestedKey}"]`)).toBeVisible();
      await expect(page.locator(`[data-record-management-nested-panel="${nestedKey}"] h5`).first()).toHaveText(nestedTitle);
    }

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-004");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("[name='entityName']")).toHaveValue(/intentionally long governance name/);

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-005");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("[data-entity-management-owning-feature-derived-fields]")).toBeVisible();
    await expect(page.locator("[data-entity-management-owning-feature-key] [data-form-drawer-select-summary]")).toHaveText("organizationCore");
  });

  test("detail-panel view refs activate distinct sections", async ({ page }) => {
    const expectedViewStates = [
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-006", ""],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-007", "View details"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-008", "Location"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-009", "Access"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-010", "Workflow"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-011", "Primary actions"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-012", "Global search"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-013", "Display"],
    ] as const;

    for (const [path, expandedSection] of expectedViewStates) {
      await page.goto(path);
      await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
      await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Views");
      await expect(page.locator("[data-record-management-nested-trigger='list-views']")).toHaveClass(/is-active/);

      if (expandedSection) {
        await expect(page.locator(`[data-entity-management-view-section][aria-label="${expandedSection}"] [data-entity-management-section-toggle]`)).toHaveAttribute("aria-expanded", "true");
      } else {
        await expect(page.locator("[data-entity-management-view-section] [data-entity-management-section-toggle][aria-expanded='true']")).toHaveCount(0);
      }
    }
  });

  test("detail-panel model refs activate their promised nested state", async ({ page }) => {
    const expectedStates = [
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-014", "Workflows", "intake-workflow", "Workflow details"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-015", "Workflows", "intake-workflow", "Workflow builder"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-021", "Relationships", "relationship-tenant", "Relationship metadata"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-022", "Attributes", "attribute-email", "Attribute details"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-024", "Attributes", "attribute-email", "Validation"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-026", "Attributes", "attribute-email", "Search"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-027", "Catalogs", "catalog-status", "Catalog details"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-028", "Catalogs", "catalog-status", "Catalog options"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-029", "Display", "placement-primary-details", "Placement details"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-031", "Permissions", "permission-role-llm", "Role"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-037", "Action Models - Record", "record-action-list", "Action model"],
      ["/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-039", "Action Models - Entity Structure", "structure-action-create-entity", "Action model"],
    ] as const;

    for (const [path, regionTitle, nestedKey, expandedSection] of expectedStates) {
      await page.goto(path);
      await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
      await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText(regionTitle);
      await expect(page.locator(`[data-record-management-nested-trigger="${nestedKey}"]`)).toHaveClass(/is-active/);
      await expect(page.locator(`[data-entity-management-view-section][aria-label="${expandedSection}"] [data-entity-management-section-toggle]`)).toHaveAttribute("aria-expanded", "true");
    }
  });

  test("detail-panel builder refs perform their declared setup actions", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-016");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("[data-entity-management-workflow-builder='intakeWorkflow'] [data-entity-management-workflow-status-row]")).toHaveCount(2);

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-019");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("[data-entity-management-workflow-builder='intakeWorkflow'] [data-entity-management-subworkflow-toggle]")).toBeChecked();
    await expect(page.locator("[data-entity-management-workflow-builder='intakeWorkflow'] [data-entity-management-workflow-parent-select]")).toBeVisible();

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-023");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("[data-entity-management-attribute-definition='description'] [data-entity-management-sensitive-privacy-category-field]")).toBeVisible();

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-038");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("[data-entity-management-action-error='conflict']")).toHaveJSProperty("open", true);
  });

  test("detail-panel canonical refs satisfy the declared EMPD contract", async ({ page }) => {
    const declaredStates = [
      ["EMPD-001", "Identity", "primary-details", ""],
      ["EMPD-002", "Identity", "owning-feature", ""],
      ["EMPD-003", "Identity", "source-authority-posture", ""],
      ["EMPD-004", "Identity", "primary-details", ""],
      ["EMPD-005", "Identity", "owning-feature", ""],
      ["EMPD-006", "Views", "list-views", ""],
      ["EMPD-007", "Views", "list-views", "View details"],
      ["EMPD-008", "Views", "list-views", "Location"],
      ["EMPD-009", "Views", "list-views", "Access"],
      ["EMPD-010", "Views", "list-views", "Workflow"],
      ["EMPD-011", "Views", "list-views", "Primary actions"],
      ["EMPD-012", "Views", "list-views", "Global search"],
      ["EMPD-013", "Views", "list-views", "Display"],
      ["EMPD-014", "Workflows", "intake-workflow", "Workflow details"],
      ["EMPD-015", "Workflows", "intake-workflow", "Workflow builder"],
      ["EMPD-016", "Workflows", "intake-workflow", "Workflow builder"],
      ["EMPD-017", "Workflows", "intake-workflow", "Workflow builder"],
      ["EMPD-018", "Workflows", "intake-workflow", "Workflow builder"],
      ["EMPD-019", "Workflows", "intake-workflow", "Workflow builder"],
      ["EMPD-020", "Workflows", "intake-workflow", "Workflow builder"],
      ["EMPD-021", "Relationships", "relationship-tenant", "Relationship metadata"],
      ["EMPD-022", "Attributes", "attribute-email", "Attribute details"],
      ["EMPD-023", "Attributes", "attribute-description", "Attribute details"],
      ["EMPD-024", "Attributes", "attribute-email", "Validation"],
      ["EMPD-025", "Attributes", "attribute-description", "Search"],
      ["EMPD-026", "Attributes", "attribute-email", "Search"],
      ["EMPD-027", "Catalogs", "catalog-status", "Catalog details"],
      ["EMPD-028", "Catalogs", "catalog-status", "Catalog options"],
      ["EMPD-029", "Display", "placement-primary-details", "Placement details"],
      ["EMPD-030", "Display", "placement-primary-details", "Attributes"],
      ["EMPD-031", "Permissions", "permission-role-llm", "Role"],
      ["EMPD-032", "Permissions", "permission-role-llm", "Record capabilities"],
      ["EMPD-033", "Permissions", "permission-role-llm", "Record capabilities"],
      ["EMPD-034", "Generation Model", "", "Generation mode"],
      ["EMPD-035", "Compliance Model", "", "Privacy and security"],
      ["EMPD-036", "Migration Model", "", "Migration status"],
      ["EMPD-037", "Action Models - Record", "record-action-list", "Action model"],
      ["EMPD-038", "Action Models - Record", "record-action-list", "Error audit types and messaging"],
      ["EMPD-039", "Action Models - Entity Structure", "structure-action-create-entity", "Action model"],
    ] as const;

    for (const [ref, regionTitle, nestedKey, expandedSection] of declaredStates) {
      await page.goto(`/design-system/canonical-renderings/entity-management-page-detail-panel/${ref}`);
      await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
      await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText(regionTitle);

      if (nestedKey) {
        await expect(page.locator(`[data-record-management-nested-trigger="${nestedKey}"]`)).toHaveClass(/is-active/);
        await expect(page.locator(`[data-record-management-nested-panel="${nestedKey}"]`)).toBeVisible();
      }

      if (expandedSection) {
        await expect
          .poll(() =>
            page.evaluate((title) => {
              const sections = Array.from(document.querySelectorAll("[data-entity-management-view-section]"));
              const visibleSection = sections.find((section) => section.getAttribute("aria-label") === title && !section.closest("[hidden]"));
              return visibleSection?.querySelector("[data-entity-management-section-toggle]")?.getAttribute("aria-expanded") ?? "";
            }, expandedSection))
          .toBe("true");
      } else {
        await expect
          .poll(() =>
            page.evaluate(() =>
              Array.from(document.querySelectorAll("[data-entity-management-view-section]"))
                .filter((section) => !section.closest("[hidden]"))
                .filter((section) => section.querySelector("[data-entity-management-section-toggle]")?.getAttribute("aria-expanded") === "true")
                .length,
            ))
          .toBe(0);
      }
    }
  });

  test("detail-panel pressure refs expose their declared accessibility and resilience states", async ({ page }) => {
    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-040");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Identity");
    await expect(page.locator("[data-record-management-nested-trigger='source-authority-posture']")).toHaveClass(/is-active/);
    await expect(page.locator("[data-record-management-nested-panel='source-authority-posture'] :is(input, select, textarea):disabled")).not.toHaveCount(0);

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-041");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("[name='entityName']")).toHaveValue(/intentionally long/i);

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-042");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("#entity-management-page-preview-shell")).toHaveAttribute("data-magnification", "100");

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-043");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("#entity-management-page-preview-shell")).toHaveAttribute("data-text-spacing", "wcag");

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-044");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("#entity-management-page-preview-shell")).toHaveAttribute("dir", "rtl");

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-045");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("#entity-management-page-preview-frame")).toHaveAttribute("data-theme-scope", "dark");

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-046");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("[data-record-management-nested-trigger][title]").first()).toBeVisible();

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-047");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus-visible")).toBeVisible();

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-048");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    const smallTargets = await page.locator("#entity-management-page-preview-shell button:visible").evaluateAll((buttons) =>
      buttons
        .map((button) => button.getBoundingClientRect())
        .filter((rect) => rect.width < 24 || rect.height < 24)
        .length,
    );
    expect(smallTargets).toBe(0);

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-049");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("#entity-management-page-preview-shell")).toHaveAttribute("data-viewport-class", "mobile");
    await expect
      .poll(() => page.locator("#entity-management-page-preview-shell").evaluate((shell) => shell.scrollHeight > shell.clientHeight))
      .toBe(true);

    await page.goto("/design-system/canonical-renderings/entity-management-page-detail-panel/EMPD-050");
    await expect(page.locator("#entity-management-page-preview-shell[data-render-status='ready']")).toBeVisible();
    await expect(page.locator("[data-record-management-drawer-region-title]")).toHaveText("Attributes");
    await expect.poll(() => page.locator("[data-record-management-nested-trigger]").count()).toBeGreaterThan(8);
  });
});
