function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

const organizationEntityDefinitionPreview = Object.freeze({
  entityKey: "organization",
  label: "Organization",
  description: "Company, department, partner, or other business structure managed by the platform.",
  presentationGroups: Object.freeze([
    {
      groupKey: "identity",
      label: "Identity",
      description: "Fields that identify and classify the organization.",
      displayOrder: 10,
    },
    {
      groupKey: "relationships",
      label: "Structure",
      description: "Org tree, business units, and members connected to this organization.",
      displayOrder: 20,
    },
    {
      groupKey: "legal",
      label: "Legal details",
      description: "Official legal profile values and registered identity.",
      displayOrder: 30,
    },
    {
      groupKey: "locations",
      label: "Locations",
      description: "Headquarters, registered office, sites, and opening-hour records.",
      displayOrder: 40,
    },
    {
      groupKey: "branding",
      label: "Branding",
      description: "Primary logo and public brand presentation references.",
      displayOrder: 50,
    },
    {
      groupKey: "references",
      label: "Reference data",
      description: "Approved catalogue values such as type, industry, and tier.",
      displayOrder: 60,
    },
  ]),
  attributes: Object.freeze([
    {
      attributeKey: "organizationId",
      label: "Organization ID",
      description: "Stable system identifier for the organization.",
      category: "identity",
      attributeType: "uuid",
      valueCardinality: "single",
      required: true,
      systemManaged: true,
      mutability: "immutable",
      privacyClassification: "none",
      securityClassification: "internal",
      validationRules: ["uuid_format"],
      optionsMode: "none",
      search: { searchable: true, operators: ["exact"], storageModel: "scalar" },
      placements: [],
      sampleValue: "org_456",
    },
    {
      attributeKey: "name",
      label: "Name",
      description: "Human-facing name used in lists, forms, drawers, reports, and related records.",
      category: "identity",
      attributeType: "string",
      valueCardinality: "single",
      required: true,
      systemManaged: false,
      mutability: "updateable",
      privacyClassification: "none",
      securityClassification: "internal",
      validationRules: ["trim", "max_length"],
      optionsMode: "none",
      search: { searchable: true, operators: ["exact", "prefix", "sort"], storageModel: "normalized_scalar" },
      placements: [
        { surfaceKey: "listRow", regionKey: "primaryText", groupKey: "none", displayOrder: 10, elementKey: "readonlyText", interactionMode: "read_only", visibilityMode: "default_visible" },
        { surfaceKey: "listDrawer", regionKey: "drawerSection", groupKey: "identity", displayOrder: 10, elementKey: "readonlyText", interactionMode: "read_only", visibilityMode: "default_visible" },
        { surfaceKey: "createForm", regionKey: "formSection", groupKey: "identity", displayOrder: 10, elementKey: "textInput", interactionMode: "editable", visibilityMode: "default_visible" },
      ],
      sampleValue: "Acme Operations",
    },
    {
      attributeKey: "organizationType",
      label: "Organization type",
      description: "Business classification used to group and filter organizations.",
      category: "core",
      attributeType: "limited_enum",
      valueCardinality: "single",
      required: true,
      systemManaged: false,
      mutability: "updateable",
      privacyClassification: "none",
      securityClassification: "internal",
      validationRules: ["allowed_options"],
      optionsMode: "inline",
      search: { searchable: true, operators: ["exact", "facet"], storageModel: "scalar" },
      placements: [
        { surfaceKey: "listRow", regionKey: "badgeSlot", groupKey: "none", displayOrder: 20, elementKey: "statusBadge", interactionMode: "read_only", visibilityMode: "default_visible" },
        { surfaceKey: "createForm", regionKey: "formSection", groupKey: "identity", displayOrder: 20, elementKey: "simpleSelect", interactionMode: "editable", visibilityMode: "default_visible" },
      ],
      sampleValue: "Customer",
    },
    {
      attributeKey: "systemLifecycleStatus",
      label: "System status",
      description: "Platform lifecycle state controlling visibility, retention, deletion, cleanup, and history.",
      category: "system_lifecycle",
      attributeType: "limited_enum",
      valueCardinality: "single",
      required: true,
      systemManaged: true,
      mutability: "lifecycle_managed",
      privacyClassification: "none",
      securityClassification: "internal",
      validationRules: ["allowed_options"],
      optionsMode: "catalog_reference",
      search: { searchable: true, operators: ["exact", "facet"], storageModel: "scalar" },
      placements: [
        { surfaceKey: "listRow", regionKey: "statusBadge", groupKey: "none", displayOrder: 30, elementKey: "statusBadge", interactionMode: "read_only", visibilityMode: "default_visible" },
      ],
      sampleValue: "Active",
    },
    {
      attributeKey: "businessUnits",
      label: "Business units",
      description: "Business units that belong to this organization.",
      category: "child_relation",
      attributeType: "relationship_reference",
      valueCardinality: "multiple",
      required: false,
      systemManaged: true,
      mutability: "relationship_managed",
      privacyClassification: "none",
      securityClassification: "internal",
      validationRules: ["relationship_boundary"],
      optionsMode: "relationship_source",
      search: { searchable: false, operators: [], storageModel: "not_searchable" },
      relationship: {
        targetEntityKey: "business_unit",
        boundary: "same_organization",
        navigationPosture: "navigable",
      },
      placements: [
        { surfaceKey: "listDrawer", regionKey: "relationshipPanel", groupKey: "relationships", displayOrder: 10, elementKey: "relationshipList", interactionMode: "read_only", visibilityMode: "default_visible" },
      ],
      sampleValue: "3 business units",
    },
    {
      attributeKey: "members",
      label: "Members",
      description: "People or member business units attached to the organization structure through business-unit memberships.",
      category: "child_relation",
      attributeType: "relationship_reference",
      valueCardinality: "multiple",
      required: false,
      systemManaged: true,
      mutability: "relationship_managed",
      privacyClassification: "pii_adjacent",
      securityClassification: "restricted",
      validationRules: ["real_member_reference", "membership_role_taxonomy"],
      optionsMode: "relationship_source",
      search: { searchable: true, operators: ["exact", "facet"], storageModel: "junction" },
      relationship: {
        targetEntityKey: "organization_business_unit_membership",
        boundary: "same_organization",
        navigationPosture: "navigable",
      },
      placements: [
        { surfaceKey: "listDrawer", regionKey: "membershipPanel", groupKey: "relationships", displayOrder: 20, elementKey: "relationshipList", interactionMode: "read_only", visibilityMode: "default_visible" },
      ],
      sampleValue: "12 active members",
    },
    {
      attributeKey: "legalProfile",
      label: "Legal profile",
      description: "Current legal name, registration identifier, tax/VAT number, and registered address.",
      category: "child_relation",
      attributeType: "relationship_reference",
      valueCardinality: "single",
      required: false,
      systemManaged: true,
      mutability: "relationship_managed",
      privacyClassification: "none",
      securityClassification: "confidential",
      validationRules: ["one_active_child_record"],
      optionsMode: "relationship_source",
      search: { searchable: true, operators: ["exact", "prefix"], storageModel: "scalar_child_projection" },
      relationship: {
        targetEntityKey: "organization_legal_profile",
        boundary: "same_organization",
        navigationPosture: "navigable",
      },
      placements: [
        { surfaceKey: "listDrawer", regionKey: "legalPanel", groupKey: "legal", displayOrder: 10, elementKey: "summaryPanel", interactionMode: "read_only", visibilityMode: "default_visible" },
      ],
      sampleValue: "Acme Operations Ltd",
    },
    {
      attributeKey: "headquarters",
      label: "Headquarters",
      description: "Location flagged as the head office for the organization.",
      category: "child_relation",
      attributeType: "relationship_reference",
      valueCardinality: "single",
      required: false,
      systemManaged: false,
      mutability: "relationship_managed",
      privacyClassification: "none",
      securityClassification: "internal",
      validationRules: ["same_organization_location"],
      optionsMode: "relationship_source",
      search: { searchable: true, operators: ["exact", "prefix"], storageModel: "scalar_child_projection" },
      relationship: {
        targetEntityKey: "organization_location",
        boundary: "same_organization",
        navigationPosture: "navigable",
      },
      placements: [
        { surfaceKey: "listDrawer", regionKey: "locationPanel", groupKey: "locations", displayOrder: 10, elementKey: "locationSummary", interactionMode: "read_only", visibilityMode: "default_visible" },
      ],
      sampleValue: "North Region HQ",
    },
    {
      attributeKey: "registeredOffice",
      label: "Registered office",
      description: "Location flagged as the registered office for legal and compliance use.",
      category: "child_relation",
      attributeType: "relationship_reference",
      valueCardinality: "single",
      required: false,
      systemManaged: false,
      mutability: "relationship_managed",
      privacyClassification: "none",
      securityClassification: "internal",
      validationRules: ["same_organization_location"],
      optionsMode: "relationship_source",
      search: { searchable: true, operators: ["exact", "prefix"], storageModel: "scalar_child_projection" },
      relationship: {
        targetEntityKey: "organization_location",
        boundary: "same_organization",
        navigationPosture: "navigable",
      },
      placements: [
        { surfaceKey: "listDrawer", regionKey: "locationPanel", groupKey: "locations", displayOrder: 20, elementKey: "locationSummary", interactionMode: "read_only", visibilityMode: "default_visible" },
      ],
      sampleValue: "Dublin registered office",
    },
    {
      attributeKey: "openingHours",
      label: "Opening hours",
      description: "Weekly opening slots and exceptions attached to organization locations.",
      category: "child_relation",
      attributeType: "relationship_reference",
      valueCardinality: "multiple",
      required: false,
      systemManaged: true,
      mutability: "relationship_managed",
      privacyClassification: "none",
      securityClassification: "internal",
      validationRules: ["location_scope"],
      optionsMode: "relationship_source",
      search: { searchable: false, operators: [], storageModel: "not_searchable" },
      relationship: {
        targetEntityKey: "organization_weekly_opening_hours",
        boundary: "same_organization",
        navigationPosture: "navigable",
      },
      placements: [
        { surfaceKey: "listDrawer", regionKey: "locationPanel", groupKey: "locations", displayOrder: 30, elementKey: "scheduleSummary", interactionMode: "read_only", visibilityMode: "default_visible" },
      ],
      sampleValue: "5 weekday schedules",
    },
    {
      attributeKey: "primaryLogo",
      label: "Primary logo",
      description: "Current public-ready logo relationship owned by the organization branding feature.",
      category: "domain_relation",
      attributeType: "asset_reference",
      valueCardinality: "single",
      required: false,
      systemManaged: true,
      mutability: "relationship_managed",
      privacyClassification: "none",
      securityClassification: "public_delivery_controlled",
      validationRules: ["approved_asset_kind", "public_readiness"],
      optionsMode: "relationship_source",
      search: { searchable: true, operators: ["exact"], storageModel: "scalar_child_projection" },
      relationship: {
        targetEntityKey: "organization_logo_relationship",
        boundary: "same_organization",
        navigationPosture: "display_only",
      },
      placements: [
        { surfaceKey: "listDrawer", regionKey: "brandingPanel", groupKey: "branding", displayOrder: 10, elementKey: "assetPreview", interactionMode: "read_only", visibilityMode: "default_visible" },
      ],
      sampleValue: "Primary logo ready",
    },
    {
      attributeKey: "industry",
      label: "Industry",
      description: "Reference value that classifies the organization by industry.",
      category: "reference",
      attributeType: "limited_enum",
      valueCardinality: "single",
      required: false,
      systemManaged: false,
      mutability: "updateable",
      privacyClassification: "none",
      securityClassification: "internal",
      validationRules: ["approved_reference_value"],
      optionsMode: "catalog_reference",
      search: { searchable: true, operators: ["exact", "facet"], storageModel: "scalar" },
      placements: [
        { surfaceKey: "listDrawer", regionKey: "referencePanel", groupKey: "references", displayOrder: 10, elementKey: "readonlyBadge", interactionMode: "read_only", visibilityMode: "default_visible" },
      ],
      sampleValue: "Technology",
    },
    {
      attributeKey: "tier",
      label: "Tier",
      description: "Reference value that classifies the organization for service or commercial treatment.",
      category: "reference",
      attributeType: "limited_enum",
      valueCardinality: "single",
      required: false,
      systemManaged: false,
      mutability: "updateable",
      privacyClassification: "none",
      securityClassification: "internal",
      validationRules: ["approved_reference_value"],
      optionsMode: "catalog_reference",
      search: { searchable: true, operators: ["exact", "facet"], storageModel: "scalar" },
      placements: [
        { surfaceKey: "listDrawer", regionKey: "referencePanel", groupKey: "references", displayOrder: 20, elementKey: "readonlyBadge", interactionMode: "read_only", visibilityMode: "default_visible" },
      ],
      sampleValue: "Strategic",
    },
  ]),
});

function getAttributePlacement(attribute, surfaceKey) {
  return (attribute.placements ?? []).find((placement) => placement.surfaceKey === surfaceKey);
}

function getPlacementSummary(attribute) {
  const placements = attribute.placements ?? [];
  if (!placements.length) {
    return "Definition-only";
  }
  return placements
    .map((placement) => `${placement.surfaceKey}:${placement.regionKey}`)
    .join(", ");
}

function renderAttributeChips(attribute, placement = null) {
  const chips = [
    attribute.required ? "required" : "optional",
    attribute.systemManaged ? "system managed" : attribute.mutability,
    attribute.search?.searchable ? "searchable" : "not searchable",
    placement?.interactionMode ?? "not placed here",
    placement?.elementKey ?? attribute.attributeType,
  ];
  return chips
    .filter(Boolean)
    .map((chip) => `<span>${escapeHtml(chip)}</span>`)
    .join("");
}

function renderAttributeCard(attribute, placement = null, { compact = false } = {}) {
  return `
    <article class="record-management-attribute-card${compact ? " record-management-attribute-card-compact" : ""}" data-record-management-attribute-card="${escapeHtml(attribute.attributeKey)}">
      <div class="record-management-attribute-card-main">
        <span class="record-management-attribute-key">${escapeHtml(attribute.attributeKey)}</span>
        <strong>${escapeHtml(attribute.label)}</strong>
        <p>${escapeHtml(attribute.description)}</p>
      </div>
      <div class="record-management-attribute-value">
        <span>Preview value</span>
        <strong>${escapeHtml(attribute.sampleValue)}</strong>
      </div>
      <dl class="record-management-attribute-settings">
        <div><dt>Type</dt><dd>${escapeHtml(attribute.attributeType)} / ${escapeHtml(attribute.valueCardinality)}</dd></div>
        <div><dt>Category</dt><dd>${escapeHtml(attribute.category)}</dd></div>
        <div><dt>Options</dt><dd>${escapeHtml(attribute.optionsMode)}</dd></div>
        <div><dt>Placement</dt><dd>${escapeHtml(placement ? `${placement.regionKey} / ${placement.elementKey}` : getPlacementSummary(attribute))}</dd></div>
      </dl>
      <div class="record-management-attribute-chips" aria-label="${escapeHtml(attribute.label)} settings">
        ${renderAttributeChips(attribute, placement)}
      </div>
    </article>
  `;
}

function getRecordManagementDrawerMode(entityWorkspace) {
  const template = entityWorkspace.closest("[data-record-management-list-centric-template]");
  return template instanceof HTMLElement
    ? template.dataset.recordManagementDrawerViewMode ?? "end_user"
    : "end_user";
}

function getDrawerAttributeGroups() {
  const definition = organizationEntityDefinitionPreview;
  const drawerAttributes = definition.attributes
    .map((attribute) => ({ attribute, placement: getAttributePlacement(attribute, "listDrawer") }))
    .filter(({ placement }) => placement?.visibilityMode === "default_visible")
    .sort((left, right) => (left.placement.displayOrder ?? 0) - (right.placement.displayOrder ?? 0));
  const otherAttributes = definition.attributes
    .filter((attribute) => !getAttributePlacement(attribute, "listDrawer"));
  return { definition, drawerAttributes, otherAttributes };
}

function renderRecordManagementRegionShell({ label, regions }) {
  const visibleRegions = regions.filter((region) => region?.content);
  const activeKey = visibleRegions[0]?.key ?? "details";
  return `
    <div class="record-management-region-shell" data-record-management-region-shell>
      <div class="record-management-region-index" role="tablist" aria-label="${escapeHtml(label)} regions">
        ${visibleRegions
          .map((region) => {
            const isActive = region.key === activeKey;
            return `
              <button
                class="record-management-region-trigger${isActive ? " is-active" : ""}"
                type="button"
                role="tab"
                aria-selected="${isActive ? "true" : "false"}"
                aria-controls="record-management-region-${escapeHtml(region.key)}"
                data-record-management-region-trigger="${escapeHtml(region.key)}"
              >
                <span>${escapeHtml(region.label)}</span>
                <strong>${escapeHtml(region.count)} ${region.count === 1 ? "item" : "items"}</strong>
              </button>
            `;
          })
          .join("")}
      </div>
      <div class="record-management-region-panels">
        ${visibleRegions
          .map((region) => {
            const isActive = region.key === activeKey;
            return `
              <section
                id="record-management-region-${escapeHtml(region.key)}"
                class="record-management-region-panel"
                role="tabpanel"
                data-record-management-region-panel="${escapeHtml(region.key)}"
                ${isActive ? "" : "hidden"}
              >
                ${region.content}
              </section>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function installRecordManagementRegionIndex(drawer) {
  const shells = Array.from(drawer.querySelectorAll("[data-record-management-region-shell]"));
  shells.forEach((shell) => {
    shell.addEventListener("click", (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest("[data-record-management-region-trigger]")
        : null;
      if (!(trigger instanceof HTMLElement)) {
        return;
      }
      const key = trigger.dataset.recordManagementRegionTrigger;
      if (!key) {
        return;
      }
      shell.querySelectorAll("[data-record-management-region-trigger]").forEach((candidate) => {
        const isActive = candidate instanceof HTMLElement && candidate.dataset.recordManagementRegionTrigger === key;
        candidate.classList.toggle("is-active", isActive);
        candidate.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      shell.querySelectorAll("[data-record-management-region-panel]").forEach((panel) => {
        if (!(panel instanceof HTMLElement)) {
          return;
        }
        panel.hidden = panel.dataset.recordManagementRegionPanel !== key;
      });
    });
  });
}

function renderRecordManagementRootAttributeView(selected) {
  const { definition, drawerAttributes, otherAttributes } = getDrawerAttributeGroups();
  const groupRegions = [...definition.presentationGroups]
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((group) => {
      const grouped = drawerAttributes.filter(({ placement }) => placement.groupKey === group.groupKey);
      if (!grouped.length) {
        return null;
      }
      return {
        key: group.groupKey,
        label: group.label,
        count: grouped.length,
        content: `
        <section class="record-management-attribute-group" aria-label="${escapeHtml(group.label)} attributes">
          <div class="record-management-attribute-group-header">
            <div>
              <span>${escapeHtml(group.groupKey)}</span>
              <h5>${escapeHtml(group.label)}</h5>
              <p>${escapeHtml(group.description)}</p>
            </div>
            <strong>${escapeHtml(grouped.length)} shown</strong>
          </div>
          <div class="record-management-attribute-list">
            ${grouped.map(({ attribute, placement }) => renderAttributeCard(attribute, placement)).join("")}
          </div>
        </section>
      `,
      };
    })
    .filter(Boolean);

  const regions = [
    ...groupRegions,
    {
      key: "elsewhere",
      label: "Elsewhere",
      count: otherAttributes.length,
      content: `
        <section class="record-management-attribute-group record-management-attribute-group-muted" aria-label="Attributes used elsewhere">
          <div class="record-management-attribute-group-header">
            <div>
              <span>elsewhere</span>
              <h5>Other attributes in the definition</h5>
              <p>These remain visible here as definition context because their placements point to another surface or are definition-only.</p>
            </div>
            <strong>${escapeHtml(otherAttributes.length)} not in drawer</strong>
          </div>
          <div class="record-management-attribute-list">
            ${otherAttributes.map((attribute) => renderAttributeCard(attribute, null, { compact: true })).join("")}
          </div>
        </section>
      `,
    },
  ];

  return `
    <section class="record-management-attribute-view" aria-label="Organization entity attributes" data-record-management-attribute-view>
      <div class="record-management-attribute-view-header">
        <div>
          <p>Entity attribute view</p>
          <h5>${escapeHtml(definition.label)} attributes placed for this drawer</h5>
        </div>
        <span>${escapeHtml(selected.entity)} preview</span>
      </div>
      ${renderRecordManagementRegionShell({ label: "Root attribute view", regions })}
    </section>
  `;
}

function renderEndUserAttributeCard(attribute, placement) {
  const relatedRowsByAttribute = {
    businessUnits: `
      <div class="record-management-user-related-list">
        <article><strong>North Region</strong><span>Active</span></article>
        <article><strong>Implementation</strong><span>Active</span></article>
        <article><strong>Support Operations</strong><span>Review</span></article>
      </div>
    `,
    members: `
      <div class="record-management-user-related-list">
        <article><strong>Jordan Reyes</strong><span>Owner</span></article>
        <article><strong>Implementation</strong><span>Manager</span></article>
        <article><strong>Rina Patel</strong><span>Member</span></article>
      </div>
    `,
    legalProfile: `
      <div class="record-management-user-related-list">
        <article><strong>Registration</strong><span>IE-77842</span></article>
        <article><strong>Tax/VAT</strong><span>IE998877A</span></article>
        <article><strong>Registered address</strong><span>Dublin, Ireland</span></article>
      </div>
    `,
    headquarters: `
      <div class="record-management-user-related-list">
        <article><strong>Address</strong><span>42 North Quay</span></article>
        <article><strong>Coordinates</strong><span>53.349, -6.260</span></article>
      </div>
    `,
    registeredOffice: `
      <div class="record-management-user-related-list">
        <article><strong>Address</strong><span>18 Legal Row</span></article>
        <article><strong>Office flag</strong><span>Registered</span></article>
      </div>
    `,
    openingHours: `
      <div class="record-management-user-related-list">
        <article><strong>Weekdays</strong><span>09:00-17:30</span></article>
        <article><strong>Exceptions</strong><span>2 upcoming</span></article>
      </div>
    `,
    primaryLogo: `
      <div class="record-management-user-related-list">
        <article><strong>Logo type</strong><span>Primary</span></article>
        <article><strong>Readiness</strong><span>Ready</span></article>
        <article><strong>Alt text</strong><span>Acme Operations logo</span></article>
      </div>
    `,
    industry: `
      <div class="record-management-user-related-list">
        <article><strong>Reference type</strong><span>industry</span></article>
        <article><strong>Reference key</strong><span>technology</span></article>
      </div>
    `,
    tier: `
      <div class="record-management-user-related-list">
        <article><strong>Reference type</strong><span>tier</span></article>
        <article><strong>Reference key</strong><span>strategic</span></article>
      </div>
    `,
  };
  const relatedRows = relatedRowsByAttribute[attribute.attributeKey] ?? "";
  return `
    <article class="record-management-user-attribute-card" data-record-management-user-attribute-card="${escapeHtml(attribute.attributeKey)}">
      <div>
        <span>${escapeHtml(attribute.label)}</span>
        <strong>${escapeHtml(attribute.sampleValue)}</strong>
        <p>${escapeHtml(attribute.description)}</p>
      </div>
      ${placement.elementKey === "relationshipList" ? relatedRows : ""}
    </article>
  `;
}

function renderRecordManagementEndUserAttributeView() {
  const { definition, drawerAttributes } = getDrawerAttributeGroups();
  const overviewAttributes = drawerAttributes.filter(({ placement }) => placement.groupKey === "identity");
  const groupRegions = [...definition.presentationGroups]
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((group) => {
      const grouped = drawerAttributes.filter(({ placement }) => placement.groupKey === group.groupKey);
      if (!grouped.length || group.groupKey === "identity") {
        return null;
      }
      return {
        key: group.groupKey,
        label: group.label,
        count: grouped.length,
        content: `
        <section class="record-management-user-attribute-group" aria-label="${escapeHtml(group.label)}">
          <div class="record-management-user-attribute-group-header">
            <h5>${escapeHtml(group.label)}</h5>
            <p>${escapeHtml(group.description)}</p>
          </div>
          <div class="record-management-user-attribute-list">
            ${grouped.map(({ attribute, placement }) => renderEndUserAttributeCard(attribute, placement)).join("")}
          </div>
        </section>
      `,
      };
    })
    .filter(Boolean);

  const regions = [
    {
      key: "details",
      label: "Details",
      count: overviewAttributes.length + 1,
      content: `
        <div class="record-management-user-attribute-hero">
          <span>${escapeHtml(definition.entityKey)}</span>
          <h5>${escapeHtml(definition.label)} details</h5>
          <p>${escapeHtml(definition.description)}</p>
        </div>
        <section class="record-management-user-attribute-group" aria-label="Primary details">
          <div class="record-management-user-attribute-group-header">
            <h5>Primary details</h5>
            <p>Root Organization facts that make the record recognizable before related regions are opened.</p>
          </div>
          <div class="record-management-user-attribute-list">
            ${overviewAttributes.map(({ attribute, placement }) => renderEndUserAttributeCard(attribute, placement)).join("")}
          </div>
        </section>
      `,
    },
    ...groupRegions,
  ];

  return `
    <section class="record-management-user-attribute-view" aria-label="Organization record details" data-record-management-user-attribute-view>
      ${renderRecordManagementRegionShell({ label: "Organization drawer", regions })}
    </section>
  `;
}

function renderRecordManagementAttributeView(selected, entityWorkspace) {
  return getRecordManagementDrawerMode(entityWorkspace) === "root"
    ? renderRecordManagementRootAttributeView(selected)
    : renderRecordManagementEndUserAttributeView(selected);
}

export function getChatWorkspaceDrawerRowFromElement(row, { layer, entity } = {}) {
  const title = row.querySelector("strong")?.textContent?.trim() ?? "Selected workspace item";
  const status = row.querySelector("span:not(.floating-tab-row-marker)")?.textContent?.trim() ?? "Status";
  const note = row.querySelector("small")?.textContent?.trim() ?? "Workspace detail";
  const placeholderRecordId = row.dataset.recordManagementPlaceholderRecord ?? "";
  return {
    createRecord: Boolean(placeholderRecordId),
    title,
    status,
    note,
    entity: entity?.label ?? "Workspace entity",
    key: placeholderRecordId
      ? `${layer?.key ?? "layer"}:${entity?.key ?? "entity"}:${placeholderRecordId}`
      : `${layer?.key ?? "layer"}:${entity?.key ?? "entity"}:${title}`,
    layer: layer?.label ?? "Workspace layer",
    placeholderRecordId,
  };
}

export function getClosedChatWorkspaceDrawerState() {
  return { open: false, row: null };
}

export function getChatWorkspaceDrawerRowTarget(target) {
  const canUseElement = typeof Element !== "undefined";
  const row = (canUseElement ? target instanceof Element : Boolean(target?.closest))
    ? target.closest("[data-chat-workspace-list-row], .floating-tab-row")
    : null;
  if (typeof HTMLElement === "undefined") {
    return row;
  }
  return row instanceof HTMLElement ? row : null;
}

export function isChatWorkspaceDrawerCloseTarget(target) {
  const canUseElement = typeof Element !== "undefined";
  return Boolean(
    (canUseElement ? target instanceof Element : Boolean(target?.closest))
    && target.closest("[data-chat-workspace-list-drawer-close]"),
  );
}

export function getChatWorkspaceDrawerStateFromTarget(target, { layer, entity } = {}) {
  const row = getChatWorkspaceDrawerRowTarget(target);
  if (!row) {
    return null;
  }
  return {
    open: true,
    row: getChatWorkspaceDrawerRowFromElement(row, { layer, entity }),
  };
}

export function syncChatWorkspaceRowSelection({ entityWorkspace, selectedRow, layer, entity }) {
  const rows = Array.from(entityWorkspace.querySelectorAll(".floating-tab-row"));
  rows.forEach((row) => {
    if (!(row instanceof HTMLElement)) {
      return;
    }
    const rowState = getChatWorkspaceDrawerRowFromElement(row, {
      layer,
      entity,
    });
    const selected = Boolean(selectedRow?.open && selectedRow.row?.key === rowState.key);
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-pressed", selected ? "true" : "false");
    row.dataset.chatWorkspaceListRow = "";
    row.classList.toggle("is-selected", selected);
  });
}

export function renderChatWorkspaceListDrawer({ entityWorkspace, selected }) {
  const panel = entityWorkspace.querySelector(".floating-tab-list-panel");
  const list = entityWorkspace.querySelector(".floating-tab-list");
  if (!(panel instanceof HTMLElement) || !(list instanceof HTMLElement)) {
    return;
  }

  let drawer = entityWorkspace.querySelector("[data-chat-workspace-list-drawer]");
  if (!(drawer instanceof HTMLElement)) {
    drawer = document.createElement("aside");
    drawer.className = "chat-workspace-list-drawer";
    drawer.dataset.chatWorkspaceListDrawer = "";
    drawer.setAttribute("aria-label", "Workspace item detail");
    panel.append(drawer);
  }

  entityWorkspace.dataset.chatWorkspaceDrawerOpen = selected ? "true" : "false";
  drawer.hidden = !selected;
  if (!selected) {
    drawer.replaceChildren();
    return;
  }

  if (selected.createRecord) {
    drawer.innerHTML = `
      <div class="chat-workspace-list-drawer-header">
        <div>
          <p>${escapeHtml(selected.entity)}</p>
          <h4>${escapeHtml(selected.title)}</h4>
        </div>
        <button class="icon-button" type="button" aria-label="Close item detail" data-chat-workspace-list-drawer-close>
          <span class="icon-button-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </span>
        </button>
      </div>
      <form class="record-management-draft-form" aria-label="Build new draft record" data-record-management-drawer-form data-placeholder-record-id="${escapeHtml(selected.placeholderRecordId)}">
        <label>
          <span>Record name</span>
          <input type="text" name="recordName" placeholder="Untitled record" />
        </label>
        <label>
          <span>Owner or source</span>
          <input type="text" name="recordOwner" placeholder="Owner needed" />
        </label>
        <label>
          <span>Next action</span>
          <textarea name="recordAction" rows="3" placeholder="Describe what needs to happen next"></textarea>
        </label>
        <div class="record-management-draft-form-actions">
          <button class="list-page-state-button" type="button" data-record-management-form-cancel>Cancel</button>
          <button class="list-page-state-button" type="submit">Save draft</button>
        </div>
      </form>
    `;
    drawer.querySelector("input")?.focus();
    return;
  }

  drawer.innerHTML = `
    <div class="chat-workspace-list-drawer-header">
      <button class="icon-button" type="button" aria-label="Close item detail" data-chat-workspace-list-drawer-close>
        <span class="icon-button-glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </span>
      </button>
    </div>
    <div class="chat-workspace-list-drawer-body">
      ${renderRecordManagementAttributeView(selected, entityWorkspace)}
    </div>
  `;
  installRecordManagementRegionIndex(drawer);
}
