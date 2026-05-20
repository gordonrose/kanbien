import {
  initializeEntityManagementPageBehavior,
  renderEntityManagementPageAttributeView,
  renderEntityManagementRobotIcon,
  renderGovernanceEvidenceIcon,
  renderPrimaryIconButton,
  syncEntityManagementOwningFeatureDerivedFields,
  syncEntityManagementViewRoleOptions,
} from "./entityManagementPage.mjs";

const familyReferenceLabels = {
  "entity-management-page-outer-page": [
    ["EMPO-001", "Desktop shell baseline"],
    ["EMPO-002", "Desktop dark shell baseline"],
    ["EMPO-003", "Desktop desert/alternate theme baseline"],
    ["EMPO-004", "Desktop constrained height"],
    ["EMPO-005", "Desktop wide viewport"],
    ["EMPO-006", "Desktop narrow-but-not-mobile"],
    ["EMPO-007", "Mobile initial shell"],
    ["EMPO-008", "Mobile page-level scroll"],
    ["EMPO-009", "Mobile short viewport"],
    ["EMPO-010", "Mobile bottom nav reachability"],
    ["EMPO-011", "Mobile landscape"],
    ["EMPO-012", "Drawer-as-page-body close affordance"],
    ["EMPO-013", "Empty-region app-data posture"],
    ["EMPO-014", "Outer framing app-consumer parity"],
    ["EMPO-015", "Route reload/restoration baseline"],
    ["EMPO-016", "Browser back/forward posture"],
    ["EMPO-017", "Long organization and status labels"],
    ["EMPO-018", "RTL outer shell"],
    ["EMPO-019", "200% zoom outer shell"],
    ["EMPO-020", "WCAG text-spacing outer shell"],
    ["EMPO-021", "WCAG focus-visible shell sweep"],
    ["EMPO-022", "WCAG target-size shell sweep"],
    ["EMPO-023", "Dark-theme mobile shell"],
    ["EMPO-024", "High-content shell pressure"],
  ],
  "entity-management-page-navigation": [
    ["EMPN-001", "Desktop region order baseline"],
    ["EMPN-002", "Desktop active region state"],
    ["EMPN-003", "Desktop long region labels"],
    ["EMPN-004", "Desktop high region count"],
    ["EMPN-005", "Desktop constrained height region index"],
    ["EMPN-006", "Desktop nested Identity baseline"],
    ["EMPN-007", "Desktop nested Workflows baseline"],
    ["EMPN-008", "Desktop nested Views baseline"],
    ["EMPN-009", "Desktop nested Relationships baseline"],
    ["EMPN-010", "Desktop nested Attributes high list"],
    ["EMPN-011", "Desktop nested Catalogs add-capable list"],
    ["EMPN-012", "Desktop nested Permissions list"],
    ["EMPN-013", "Desktop action-model nested list"],
    ["EMPN-014", "Desktop entity-structure action nested list"],
    ["EMPN-015", "Desktop resizer pointer"],
    ["EMPN-016", "Desktop resizer keyboard"],
    ["EMPN-017", "Mobile region picker baseline"],
    ["EMPN-018", "Mobile region picker full set"],
    ["EMPN-019", "Mobile region switching"],
    ["EMPN-020", "Mobile Identity carousel"],
    ["EMPN-021", "Mobile Workflows carousel"],
    ["EMPN-022", "Mobile Views carousel"],
    ["EMPN-023", "Mobile Catalogs carousel"],
    ["EMPN-024", "Mobile Permissions carousel"],
    ["EMPN-025", "Mobile high nested item count"],
    ["EMPN-026", "Mobile long nested card labels"],
    ["EMPN-027", "RTL desktop navigation"],
    ["EMPN-028", "RTL mobile carousel"],
    ["EMPN-029", "Zoomed desktop navigation"],
    ["EMPN-030", "Text-spacing navigation"],
    ["EMPN-031", "Dark-theme navigation sweep"],
    ["EMPN-032", "Tooltip/truncation navigation sweep"],
    ["EMPN-033", "WCAG focus order navigation sweep"],
    ["EMPN-034", "WCAG target-size navigation sweep"],
    ["EMPN-035", "Mobile carousel all sections"],
    ["EMPN-036", "Long localized RTL carousel"],
  ],
  "entity-management-page-detail-panel": [
    ["EMPD-001", "Identity Primary Details baseline"],
    ["EMPD-002", "Identity Owning Feature baseline"],
    ["EMPD-003", "Identity Source Authority baseline"],
    ["EMPD-004", "Primary Details long text"],
    ["EMPD-005", "Owning Feature derived visible"],
    ["EMPD-006", "Views details collapsed"],
    ["EMPD-007", "View details open"],
    ["EMPD-008", "View location open"],
    ["EMPD-009", "View access open"],
    ["EMPD-010", "View workflow-status visibility"],
    ["EMPD-011", "View actions selector"],
    ["EMPD-012", "View attributes selector"],
    ["EMPD-013", "View placements selector"],
    ["EMPD-014", "Workflow details collapsed/open"],
    ["EMPD-015", "Workflow builder base status"],
    ["EMPD-016", "Workflow status add"],
    ["EMPD-017", "Workflow status move"],
    ["EMPD-018", "Workflow status remove"],
    ["EMPD-019", "Workflow subworkflow on"],
    ["EMPD-020", "Workflow links drawer-select"],
    ["EMPD-021", "Relationship detail baseline"],
    ["EMPD-022", "Attribute identity metadata"],
    ["EMPD-023", "Attribute privacy/security dependencies"],
    ["EMPD-024", "Attribute validation rules"],
    ["EMPD-025", "Attribute searchable off"],
    ["EMPD-026", "Attribute searchable on"],
    ["EMPD-027", "Catalog metadata baseline"],
    ["EMPD-028", "Catalog option builder"],
    ["EMPD-029", "Display placement baseline"],
    ["EMPD-030", "Display placement section builder"],
    ["EMPD-031", "Permission role baseline"],
    ["EMPD-032", "Permission family enabled"],
    ["EMPD-033", "Permission family disabled"],
    ["EMPD-034", "Generation model baseline"],
    ["EMPD-035", "Compliance model baseline"],
    ["EMPD-036", "Migration model baseline"],
    ["EMPD-037", "Action model record capability"],
    ["EMPD-038", "Action model error cards"],
    ["EMPD-039", "Action model structure capability"],
    ["EMPD-040", "Readonly/disabled sweep"],
    ["EMPD-041", "Long labels and long values"],
    ["EMPD-042", "200% zoom detail panel"],
    ["EMPD-043", "Text-spacing detail panel"],
    ["EMPD-044", "RTL detail panel"],
    ["EMPD-045", "Dark-theme detail panel"],
    ["EMPD-046", "Tooltip/truncated field labels"],
    ["EMPD-047", "WCAG focus-visible detail sweep"],
    ["EMPD-048", "WCAG target-size detail sweep"],
    ["EMPD-049", "Mobile long-form page scroll"],
    ["EMPD-050", "High generated field count"],
  ],
  "entity-management-page-collection-item": [
    ["EMPI-001", "Workflow add baseline"],
    ["EMPI-002", "Workflow new item defaults"],
    ["EMPI-003", "Workflow rename sync"],
    ["EMPI-004", "Workflow description sync"],
    ["EMPI-005", "Workflow copy baseline"],
    ["EMPI-006", "Workflow delete new item"],
    ["EMPI-007", "Workflow delete active source"],
    ["EMPI-008", "Workflow repeated add/delete"],
    ["EMPI-009", "Workflow item lifecycle after lazy region"],
    ["EMPI-010", "Catalog add baseline"],
    ["EMPI-011", "Catalog new defaults"],
    ["EMPI-012", "Catalog label/scope sync"],
    ["EMPI-013", "Catalog copy baseline"],
    ["EMPI-014", "Catalog delete baseline"],
    ["EMPI-015", "Catalog option add"],
    ["EMPI-016", "Catalog option move"],
    ["EMPI-017", "Catalog option remove"],
    ["EMPI-018", "Permission role add baseline"],
    ["EMPI-019", "Permission role label sync"],
    ["EMPI-020", "Permission role copy baseline"],
    ["EMPI-021", "Permission role delete baseline"],
    ["EMPI-022", "Permission role view-option sync"],
    ["EMPI-023", "Permission family select all"],
    ["EMPI-024", "Permission family deselect all"],
    ["EMPI-025", "Add-card visual parity"],
    ["EMPI-026", "Item action icon parity"],
    ["EMPI-027", "High item count add-card reachability"],
    ["EMPI-028", "Keyboard item lifecycle"],
    ["EMPI-029", "Screen-reader status after add/delete"],
    ["EMPI-030", "Duplicate id/name sweep"],
    ["EMPI-031", "Mobile carousel item lifecycle"],
    ["EMPI-032", "Long item labels and descriptions"],
    ["EMPI-033", "RTL collection lifecycle"],
    ["EMPI-034", "Dark-theme collection lifecycle"],
    ["EMPI-035", "200% zoom collection lifecycle"],
    ["EMPI-036", "WCAG text-spacing collection cards"],
    ["EMPI-037", "WCAG target-size item controls"],
    ["EMPI-038", "High-count destructive recovery"],
  ],
  "entity-management-page-evidence-ai": [
    ["EMPE-001", "Evidence mode off baseline"],
    ["EMPE-002", "Evidence mode on baseline"],
    ["EMPE-003", "Evidence drawer open"],
    ["EMPE-004", "Evidence desktop split geometry"],
    ["EMPE-005", "Evidence close"],
    ["EMPE-006", "Evidence target in Workflows"],
    ["EMPE-007", "Evidence target in Views"],
    ["EMPE-008", "Evidence target in Action Models"],
    ["EMPE-009", "AI mode off baseline"],
    ["EMPE-010", "AI mode on baseline"],
    ["EMPE-011", "AI drawer open"],
    ["EMPE-012", "AI desktop split geometry"],
    ["EMPE-013", "AI close"],
    ["EMPE-014", "Evidence to AI mutual exclusion"],
    ["EMPE-015", "AI to evidence mutual exclusion"],
    ["EMPE-016", "Edit to evidence mutual exclusion"],
    ["EMPE-017", "Evidence to edit mutual exclusion"],
    ["EMPE-018", "Mobile evidence overlay"],
    ["EMPE-019", "Mobile AI overlay"],
    ["EMPE-020", "Mobile evidence close"],
    ["EMPE-021", "Mobile AI close"],
    ["EMPE-022", "Focus on evidence open"],
    ["EMPE-023", "Focus on evidence close"],
    ["EMPE-024", "Focus on AI open/close"],
    ["EMPE-025", "Long evidence values"],
    ["EMPE-026", "Dark theme evidence"],
    ["EMPE-027", "Dark theme AI"],
    ["EMPE-028", "RTL evidence split"],
    ["EMPE-029", "RTL mobile evidence overlay"],
    ["EMPE-030", "Zoomed evidence/AI"],
    ["EMPE-031", "Long target labels with tooltip"],
    ["EMPE-032", "High evidence-card count"],
    ["EMPE-033", "WCAG text-spacing evidence/AI"],
    ["EMPE-034", "WCAG target-size evidence/AI"],
    ["EMPE-035", "Keyboard cycle through drawer content"],
    ["EMPE-036", "Dark RTL mobile AI overlay"],
  ],
  "entity-management-page-performance": [
    ["EMPP-001", "Initial lazy footprint"],
    ["EMPP-002", "Initial DOM/control budget"],
    ["EMPP-003", "First useful render timing"],
    ["EMPP-004", "Region lazy materialization"],
    ["EMPP-005", "Multi-region visited growth"],
    ["EMPP-006", "Nested panel lazy materialization"],
    ["EMPP-007", "Repeated region switching"],
    ["EMPP-008", "Add after lazy materialization"],
    ["EMPP-009", "Copy/delete after lazy materialization"],
    ["EMPP-010", "Drawer-select after lazy materialization"],
    ["EMPP-011", "Derived fields after lazy materialization"],
    ["EMPP-012", "Evidence after lazy materialization"],
    ["EMPP-013", "AI after lazy materialization"],
    ["EMPP-014", "High nested item count lazy baseline"],
    ["EMPP-015", "High region count lazy baseline"],
    ["EMPP-016", "200% zoom lazy baseline"],
    ["EMPP-017", "Mobile lazy baseline"],
    ["EMPP-018", "Mobile multi-region visited growth"],
    ["EMPP-019", "Module size snapshot"],
    ["EMPP-020", "Fixture split readiness"],
    ["EMPP-021", "Eager import avoidance"],
    ["EMPP-022", "Render-ready signal"],
    ["EMPP-023", "Memory/DOM after full visit"],
    ["EMPP-024", "Handler count regression"],
    ["EMPP-025", "Long-label lazy footprint"],
    ["EMPP-026", "Dark-theme lazy footprint"],
    ["EMPP-027", "RTL lazy footprint"],
    ["EMPP-028", "200% zoom lazy footprint"],
    ["EMPP-029", "WCAG text-spacing lazy footprint"],
    ["EMPP-030", "Mobile carousel lazy footprint"],
    ["EMPP-031", "High evidence-card lazy budget"],
    ["EMPP-032", "WCAG focus sweep handler budget"],
  ],
};

const familyLabels = {
  "entity-management-page-outer-page": "Entity Management Page - Outer Page",
  "entity-management-page-navigation": "Entity Management Page - Navigation",
  "entity-management-page-detail-panel": "Entity Management Page - Detail Panel",
  "entity-management-page-collection-item": "Entity Management Page - Collection Item",
  "entity-management-page-evidence-ai": "Entity Management Page - Evidence And AI",
  "entity-management-page-performance": "Entity Management Page - Performance",
};

const familyDescriptions = {
  "entity-management-page-outer-page":
    "Canonical launcher for outer shell, page framing, desktop/mobile scroll ownership, and app-consumable page boundaries.",
  "entity-management-page-navigation":
    "Canonical launcher for region navigation, mobile picker, nested cards, carousel behavior, active states, and resizer behavior.",
  "entity-management-page-detail-panel":
    "Canonical launcher for generated form panels, collapsible sections, derived fields, workflow builder, attributes, permissions, and action models.",
  "entity-management-page-collection-item":
    "Canonical launcher for add, copy, delete, card sync, panel sync, and item lifecycle behavior.",
  "entity-management-page-evidence-ai":
    "Canonical launcher for evidence and AI modes, target affordances, desktop split, mobile overlays, focus recovery, and mutual exclusion.",
  "entity-management-page-performance":
    "Canonical launcher for lazy rendering, render-ready signals, DOM/control budgets, visited-region growth, and fixture boundaries.",
};

const canonicalFamilyKeys = Object.keys(familyReferenceLabels);

function toReference(familyKey, [referenceId, displayLabel], index) {
  return {
    referenceId,
    displayLabel,
    renderRoutePath: `/design-system/canonical-renderings/${familyKey}/${referenceId}`,
    featured: index < 4 || /Mobile|RTL|Dark|200%|WCAG|Long|High|lazy|split/i.test(displayLabel),
  };
}

function buildEntityManagementCanonicalFamily(familyKey) {
  const labels = familyReferenceLabels[familyKey];
  if (!labels) {
    return null;
  }

  return {
    family: {
      familyKey,
      displayLabel: familyLabels[familyKey],
      launcherTitle: `${familyLabels[familyKey]} Canonical Renderings`,
      launcherDescription: familyDescriptions[familyKey],
      generatedLauncherRoutePath: `/design-system/canonical-renderings/${familyKey}`,
      legacyLauncherRoutePath: "/design-system/templates/entity_management_page",
    },
    references: labels.map((label, index) => toReference(familyKey, label, index)),
  };
}

const entityManagementCanonicalFamilies = canonicalFamilyKeys
  .map(buildEntityManagementCanonicalFamily)
  .filter(Boolean);

function getPathInfo() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/([^/]+)(?:\/([^/]+))?$/);
  if (!match) {
    return null;
  }

  return {
    familyKey: decodeURIComponent(match[1]),
    referenceId: match[2] ? decodeURIComponent(match[2]) : null,
  };
}

function normalizeTheme(label) {
  if (/dark/i.test(label)) {
    return "dark";
  }
  if (/desert|alternate/i.test(label)) {
    return "desert";
  }
  return "normal";
}

function normalizeDir(label) {
  return /rtl/i.test(label) ? "rtl" : "ltr";
}

function normalizeZoom(label) {
  return /200%|zoom|magnif/i.test(label) ? 100 : 0;
}

function normalizeWidth(label) {
  if (/mobile/i.test(label)) {
    return /landscape/i.test(label) ? 760 : 390;
  }
  if (/narrow|half|constrained/i.test(label)) {
    return 820;
  }
  if (/wide/i.test(label)) {
    return 1440;
  }
  return 1180;
}

function regionForReference(referenceId, label) {
  if (/workflows|workflow/i.test(label)) {
    return "workflows";
  }
  if (/views|view access|view details|location|placement/i.test(label)) {
    return "views";
  }
  if (/relationship/i.test(label)) {
    return "relationships";
  }
  if (/attribute|field|validation|searchable|privacy|security/i.test(label)) {
    return "attributes";
  }
  if (/catalog|option/i.test(label)) {
    return "catalogs";
  }
  if (/display|placement/i.test(label)) {
    return "placements";
  }
  if (/permission|role|capability/i.test(label)) {
    return "permissions";
  }
  if (/generation/i.test(label)) {
    return "generation-model";
  }
  if (/compliance/i.test(label)) {
    return "compliance-model";
  }
  if (/migration/i.test(label)) {
    return "migration-model";
  }
  if (/action/i.test(label) || referenceId === "EMPN-013" || referenceId === "EMPN-014") {
    return "action-models-record";
  }
  return "identity";
}

function renderRouteFor(reference, familyKey) {
  return `/design-system/canonical-renderings/${familyKey}/${reference.referenceId}`;
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node instanceof HTMLElement) {
    node.textContent = value;
  }
}

function updateStepper(familyKey, references, activeIndex) {
  const current = document.getElementById("entity-management-page-canonical-current");
  const previous = document.getElementById("entity-management-page-canonical-prev");
  const next = document.getElementById("entity-management-page-canonical-next");
  const active = references[activeIndex];

  if (current instanceof HTMLElement) {
    current.textContent = `${active.referenceId} - ${active.displayLabel}`;
  }
  if (previous instanceof HTMLAnchorElement) {
    const previousRef = references[activeIndex - 1];
    previous.href = previousRef ? renderRouteFor(previousRef, familyKey) : "#";
    previous.setAttribute("aria-disabled", String(!previousRef));
  }
  if (next instanceof HTMLAnchorElement) {
    const nextRef = references[activeIndex + 1];
    next.href = nextRef ? renderRouteFor(nextRef, familyKey) : "#";
    next.setAttribute("aria-disabled", String(!nextRef));
  }
}

function setRegion(drawer, regionKey) {
  const trigger = drawer.querySelector(`[data-record-management-region-trigger="${CSS.escape(regionKey)}"]`);
  if (trigger instanceof HTMLButtonElement) {
    trigger.click();
  }
}

function openMode(drawer, label) {
  if (!/evidence|ai/i.test(label)) {
    return;
  }

  const isAi = /AI/i.test(label) && !/Evidence to AI/i.test(label);
  const toggle = drawer.querySelector(isAi ? "[data-record-management-ai-mode-toggle]" : "[data-record-management-evidence-mode-toggle]");
  if (toggle instanceof HTMLButtonElement) {
    toggle.click();
  }

  const target = drawer.querySelector(isAi ? "[data-record-management-ai-button]" : "[data-record-management-evidence-button]");
  if (target instanceof HTMLButtonElement && /drawer|split|overlay|open|target|values|count|cycle/i.test(label)) {
    target.click();
  }
}

async function waitForAnimationFrame() {
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
}

async function renderSpecimen({ familyKey, reference }) {
  const frame = document.getElementById("entity-management-page-preview-frame");
  const shell = document.getElementById("entity-management-page-preview-shell");
  const mount = document.getElementById("entity-management-page-preview-mount");
  if (!(frame instanceof HTMLElement) || !(shell instanceof HTMLElement) || !(mount instanceof HTMLElement)) {
    return;
  }

  const label = reference.displayLabel;
  const theme = normalizeTheme(label);
  const dir = normalizeDir(label);
  const zoom = normalizeZoom(label);
  const width = normalizeWidth(label);
  const regionKey = regionForReference(reference.referenceId, label);
  const scale = zoom === 100 ? "1.5" : "1";

  document.documentElement.removeAttribute("dir");
  document.documentElement.style.removeProperty("--ui-scale");
  delete document.documentElement.dataset.theme;

  frame.style.setProperty("--entity-management-canonical-width", `${width}px`);
  frame.dataset.themeScope = theme;
  shell.setAttribute("dir", dir);
  shell.style.setProperty("--ui-scale", scale);
  shell.dataset.viewportClass = width <= 480 ? "mobile" : width <= 900 ? "half-page" : "desktop";
  shell.dataset.renderStatus = "settling";

  mount.innerHTML = `
    <div
      class="chat-workspace-entity-workspace floating-tab-entity-workspace"
      data-chat-workspace-entity-workspace
      data-record-management-entity-page-template
    >
      <aside
        class="chat-workspace-list-drawer"
        aria-label="Entity management canonical specimen"
        data-chat-workspace-list-drawer
        data-record-management-edit-mode="false"
        data-record-management-evidence-mode="false"
        data-record-management-ai-mode="false"
        data-record-management-evidence-view="false"
      >
        <div class="chat-workspace-list-drawer-header">
          <div class="chat-workspace-list-drawer-header-copy">
            <p>Organizations</p>
            <h4>Northstar Operations</h4>
            <div class="record-management-drawer-header-meta">
              <span>Operations</span>
              <span class="record-management-status-badge">Ready</span>
            </div>
          </div>
          <div class="chat-workspace-list-drawer-header-actions">
            ${renderPrimaryIconButton({
              ariaLabel: "Toggle AI mode",
              className: "record-management-drawer-ai-button",
              icon: renderEntityManagementRobotIcon(),
              title: "AI",
              toggleAttribute: "data-record-management-ai-mode-toggle",
            })}
            ${renderPrimaryIconButton({
              ariaLabel: "Toggle evidence mode",
              className: "record-management-drawer-evidence-button",
              icon: renderGovernanceEvidenceIcon(),
              title: "Evidence",
              toggleAttribute: "data-record-management-evidence-mode-toggle",
            })}
          </div>
        </div>
        <div class="chat-workspace-list-drawer-body">
          <div class="record-management-active-group-summary">
            <h5 data-record-management-drawer-region-title>Identity</h5>
            <p data-record-management-drawer-region-description>Definition identity fields, feature ownership, and source authority posture.</p>
          </div>
          ${renderEntityManagementPageAttributeView()}
        </div>
      </aside>
    </div>
  `;

  const drawer = mount.querySelector("[data-chat-workspace-list-drawer]");
  if (drawer instanceof HTMLElement) {
    initializeEntityManagementPageBehavior(drawer);
    setRegion(drawer, regionKey);
    syncEntityManagementViewRoleOptions(drawer);
    syncEntityManagementOwningFeatureDerivedFields(drawer);
    await waitForAnimationFrame();
    openMode(drawer, label);
  }

  setText(
    "entity-management-page-preview-summary",
    `${reference.referenceId} renders the ${familyLabels[familyKey]} child matrix using the shared entity-management page behavior module.`,
  );
  shell.dataset.renderStatus = "ready";
  document.body.dataset.renderStatus = "ready";
}

async function resolveReference(familyKey, referenceId) {
  const fallbackPayload = buildEntityManagementCanonicalFamily(familyKey);
  if (!fallbackPayload) {
    return null;
  }

  try {
    const response = await fetch(
      `/v1/design-system-canonicals/public/families/${encodeURIComponent(familyKey)}/references/${encodeURIComponent(referenceId)}`,
      {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      },
    );
    if (response.ok) {
      const payload = await response.json();
      const reference = fallbackPayload.references.find((item) => item.referenceId === payload.reference.referenceId)
        ?? fallbackPayload.references[0];
      return { payload: fallbackPayload, reference };
    }
  } catch {
    // Local fallback keeps provisional child canonical routes inspectable before persistence seeding.
  }

  const reference = fallbackPayload.references.find((item) => item.referenceId === referenceId)
    ?? fallbackPayload.references[0];
  return { payload: fallbackPayload, reference };
}

async function main() {
  const pathInfo = getPathInfo();
  if (!pathInfo?.familyKey || !pathInfo.referenceId) {
    return;
  }

  const resolved = await resolveReference(pathInfo.familyKey, pathInfo.referenceId);
  if (!resolved) {
    throw new Error(`Unknown entity management canonical family: ${pathInfo.familyKey}`);
  }

  const { payload, reference } = resolved;
  const activeIndex = Math.max(0, payload.references.findIndex((item) => item.referenceId === reference.referenceId));
  const label = reference.displayLabel;
  const theme = normalizeTheme(label);
  const dir = normalizeDir(label);
  const zoom = normalizeZoom(label);
  const width = normalizeWidth(label);

  setText("entity-management-page-canonical-title", payload.family.displayLabel);
  setText("entity-management-page-canonical-profile", payload.family.displayLabel);
  setText("entity-management-page-canonical-breadcrumb", payload.family.displayLabel);
  setText("entity-management-page-canonical-match-list", `${reference.referenceId} - ${reference.displayLabel}`);
  setText("entity-management-page-canonical-circumstances", `${width}px review width · ${dir.toUpperCase()} · ${zoom}% magnification · ${theme} theme`);
  setText("entity-management-page-meta-state", reference.displayLabel);
  setText("entity-management-page-meta-viewport", width <= 480 ? "Mobile page-template specimen" : width <= 900 ? "Constrained page-template specimen" : "Desktop page-template specimen");
  setText("entity-management-page-meta-notes", "Review-candidate child canonical surface. It consumes the shared entity-management page behavior module; persistence-backed seeding and pixel-parity review are still pending.");
  updateStepper(pathInfo.familyKey, payload.references, activeIndex);
  await renderSpecimen({ familyKey: pathInfo.familyKey, reference });
}

void main().catch((error) => {
  console.error("Failed to render entity-management-page canonical", error);
});

export {
  buildEntityManagementCanonicalFamily,
  entityManagementCanonicalFamilies,
};
