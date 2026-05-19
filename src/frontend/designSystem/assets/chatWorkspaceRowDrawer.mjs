import {
  initializeFormDrawerSelects,
  renderFormDrawerSelect,
  renderFormDrawerSelectOptions,
} from "./formControls.mjs";

const recordManagementDrawerSelections = new WeakMap();

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
      description: "The next organization layer below the current record.",
      displayOrder: 20,
    },
    {
      groupKey: "members",
      label: "Members",
      description: "Membership lists grouped by authority or participation tier.",
      displayOrder: 25,
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
        { surfaceKey: "listDrawer", regionKey: "membershipPanel", groupKey: "members", displayOrder: 20, elementKey: "relationshipList", interactionMode: "read_only", visibilityMode: "default_visible" },
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

const organizationNestedLists = Object.freeze({
  businessUnits: Object.freeze({
    label: "Business units",
    description: "Next layer down only from the current organization.",
    summary: "3 direct units",
    groups: Object.freeze([
      {
        label: "Current children",
        items: Object.freeze([
          { title: "North Region", meta: "Owner: Jordan Reyes", badge: "Active" },
          { title: "Implementation", meta: "Owner: Kim Anders", badge: "Active" },
          { title: "Support Operations", meta: "Owner needed", badge: "Review" },
        ]),
      },
    ]),
  }),
  tenantAdmins: Object.freeze({
    label: "Tenant admins",
    description: "Members with tenant administration responsibility for this organization context.",
    summary: "2 members",
    groups: Object.freeze([
      {
        label: "Tenant admins",
        items: Object.freeze([
          { title: "Jordan Reyes", meta: "Primary tenant admin", badge: "Owner" },
          { title: "Mara Okafor", meta: "Backup tenant admin", badge: "Admin" },
        ]),
      },
    ]),
  }),
  businessUnitOwners: Object.freeze({
    label: "Business unit owners",
    description: "Members accountable for a business unit under this organization.",
    summary: "3 owners",
    groups: Object.freeze([
      {
        label: "Business unit owners",
        items: Object.freeze([
          { title: "Kim Anders", meta: "Implementation", badge: "Owner" },
          { title: "Rina Patel", meta: "Support Operations", badge: "Owner" },
          { title: "Owen Walsh", meta: "North Region", badge: "Owner" },
        ]),
      },
    ]),
  }),
  regularMembers: Object.freeze({
    label: "Regular members",
    description: "Standard participating members without owner or tenant-admin tier.",
    summary: "7 members",
    groups: Object.freeze([
      {
        label: "Regular members",
        items: Object.freeze([
          { title: "Priya Shah", meta: "Implementation", badge: "Member" },
          { title: "Liam Chen", meta: "North Region", badge: "Member" },
          { title: "Noor Hassan", meta: "Support Operations", badge: "Member" },
          { title: "Elena Ruiz", meta: "Implementation", badge: "Viewer" },
        ]),
      },
    ]),
  }),
  locationsEu: Object.freeze({
    label: "EU",
    description: "Configurable location grouping for European sites.",
    summary: "4 locations",
    groups: Object.freeze([
      {
        label: "EU locations",
        items: Object.freeze([
          { title: "Dublin registered office", meta: "Registered office", badge: "Active" },
          { title: "North Region HQ", meta: "Head office", badge: "Active" },
          { title: "Berlin field site", meta: "Sales office", badge: "Active" },
        ]),
      },
    ]),
  }),
  locationsMena: Object.freeze({
    label: "MENA",
    description: "Configurable location grouping for Middle East and North Africa sites.",
    summary: "2 locations",
    groups: Object.freeze([
      {
        label: "MENA locations",
        items: Object.freeze([
          { title: "Dubai operations", meta: "Regional office", badge: "Active" },
          { title: "Riyadh partner desk", meta: "Partner location", badge: "Review" },
        ]),
      },
    ]),
  }),
  locationsApac: Object.freeze({
    label: "APAC",
    description: "Configurable location grouping for Asia-Pacific sites.",
    summary: "3 locations",
    groups: Object.freeze([
      {
        label: "APAC locations",
        items: Object.freeze([
          { title: "Singapore hub", meta: "Operations hub", badge: "Active" },
          { title: "Sydney support", meta: "Support office", badge: "Active" },
          { title: "Tokyo liaison", meta: "Representative office", badge: "Planned" },
        ]),
      },
    ]),
  }),
  logos: Object.freeze({
    label: "Logos",
    description: "Logo relationships attached to this organization branding context.",
    summary: "3 logos",
    items: Object.freeze([
      { key: "logo-primary", title: "Primary mark", meta: "PNG, ready for public delivery", badge: "Primary", preview: "primary", summary: "Public delivery", alt: "Acme Operations primary logo" },
      { key: "logo-square", title: "Square icon", meta: "WebP, internal preview", badge: "Ready", preview: "square", summary: "App icon", alt: "Acme Operations square icon" },
      { key: "logo-mono", title: "Monochrome mark", meta: "JPEG, pending review", badge: "Review", preview: "mono", summary: "Review needed", alt: "Acme Operations monochrome logo" },
    ]),
  }),
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

function isRecordManagementDrawerEditableAttribute(attribute) {
  return !attribute.systemManaged && attribute.mutability === "updateable";
}

function renderRecordManagementEditableControl(attribute) {
  const inputName = `record-management-${attribute.attributeKey}`;
  if (attribute.attributeKey === "industry") {
    return `
      <label class="record-management-editable-field drawer-form-field" data-record-management-editable-field>
        <span class="drawer-form-label">${escapeHtml(attribute.label)}</span>
        <select class="drawer-form-input" name="${escapeHtml(inputName)}">
          <option selected>Technology</option>
          <option>Financial services</option>
          <option>Healthcare</option>
          <option>Education</option>
        </select>
      </label>
    `;
  }
  if (attribute.attributeKey === "tier") {
    return `
      <label class="record-management-editable-field drawer-form-field" data-record-management-editable-field>
        <span class="drawer-form-label">${escapeHtml(attribute.label)}</span>
        <select class="drawer-form-input" name="${escapeHtml(inputName)}">
          <option>Standard</option>
          <option selected>Strategic</option>
          <option>Enterprise</option>
          <option>Watchlist</option>
        </select>
      </label>
    `;
  }
  return `
    <label class="record-management-editable-field drawer-form-field" data-record-management-editable-field>
      <span class="drawer-form-label">${escapeHtml(attribute.label)}</span>
      <input class="drawer-form-input" type="text" name="${escapeHtml(inputName)}" value="${escapeHtml(attribute.sampleValue)}" />
    </label>
  `;
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

function isEntityManagementPageTemplate(entityWorkspace) {
  return entityWorkspace.closest("[data-record-management-entity-page-template]") instanceof HTMLElement;
}

function renderGovernanceEvidenceIcon() {
  return `
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M12 3 19 6v5c0 4.4-2.8 7.6-7 10-4.2-2.4-7-5.6-7-10V6l7-3Z" />
      <path d="M9 12.2 11 14l4-5" />
    </svg>
  `;
}

function renderEntityManagementEditIcon() {
  return `
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M5 18.5 6 14l9.8-9.8a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8L10 18l-5 1Z" />
      <path d="m14.5 5.5 4 4" />
      <path d="M4 21h16" />
    </svg>
  `;
}

function renderPrimaryIconButton({ ariaLabel, className, icon, pressed = false, title, toggleAttribute }) {
  return `
    <button
      class="record-management-drawer-primary-icon-button ${escapeHtml(className)}"
      type="button"
      aria-label="${escapeHtml(ariaLabel)}"
      aria-pressed="${pressed ? "true" : "false"}"
      title="${escapeHtml(title)}"
      ${toggleAttribute}
    >
      <span aria-hidden="true">${icon}</span>
    </button>
  `;
}

function renderEntityManagementRegionDropdown({ activeKey, label, regions }) {
  const activeRegion = regions.find((region) => region.key === activeKey) ?? regions[0];
  return `
    <div class="form-select entity-management-region-dropdown" data-record-management-region-dropdown data-form-select>
      <input type="hidden" name="recordManagementRegion" value="${escapeHtml(activeRegion?.key ?? "")}" data-form-select-value />
      <button
        class="form-select-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-label="${escapeHtml(label)}"
        data-form-select-button
      >
        <span data-form-select-current-label>${escapeHtml(activeRegion?.label ?? "Choose section")}</span>
        <span class="form-select-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      <div class="form-select-menu hidden" role="listbox" tabindex="-1" data-form-select-listbox>
        ${regions.map((region) => {
          const isActive = region.key === activeRegion?.key;
          return `
            <button
              class="form-select-option${isActive ? " active" : ""}"
              type="button"
              role="option"
              aria-selected="${isActive ? "true" : "false"}"
              data-form-select-option
              data-value="${escapeHtml(region.key)}"
            >
              ${escapeHtml(region.label)}
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderEntityManagementEvidenceButton(label) {
  return `
    <button
      class="entity-management-evidence-button"
      type="button"
      aria-label="Open evidence for ${escapeHtml(label)}"
      title="Open evidence"
      data-record-management-evidence-button
    >
      <span aria-hidden="true">${renderGovernanceEvidenceIcon()}</span>
    </button>
  `;
}

function renderEvidenceTargetAttributes({
  name,
  note = "Existing data dictionary uses Organization as the canonical entity name.",
  posture = "derived_from_source_truth",
  source = "docs/data-dictionary/organization.md",
  value = "",
}) {
  return [
    `data-entity-management-evidence-target`,
    `data-evidence-element-name="${escapeHtml(name)}"`,
    `data-evidence-element-value="${escapeHtml(value)}"`,
    `data-evidence-posture="${escapeHtml(posture)}"`,
    `data-evidence-source="${escapeHtml(source)}"`,
    `data-evidence-note="${escapeHtml(note)}"`,
  ].join(" ");
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
      <label class="record-management-region-mobile-header">
        <span>${escapeHtml(label)}</span>
        ${renderEntityManagementRegionDropdown({ activeKey, label, regions: visibleRegions })}
      </label>
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
                data-record-management-region-header-label="${escapeHtml(region.headerLabel ?? region.label)}"
                data-record-management-region-header-description="${escapeHtml(region.headerDescription ?? "")}"
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
  function activateRegion(shell, key) {
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
    const select = shell.querySelector("[data-record-management-region-select]");
    if (select instanceof HTMLSelectElement) {
      select.value = key;
    }
    const drawer = shell.closest("[data-chat-workspace-list-drawer]");
    const trigger = shell.querySelector(`[data-record-management-region-trigger="${CSS.escape(key)}"]`);
    const title = drawer?.querySelector("[data-record-management-drawer-region-title]");
    const description = drawer?.querySelector("[data-record-management-drawer-region-description]");
    if (title instanceof HTMLElement && trigger instanceof HTMLElement) {
      title.textContent = trigger.dataset.recordManagementRegionHeaderLabel ?? "";
    }
    if (description instanceof HTMLElement && trigger instanceof HTMLElement) {
      description.textContent = trigger.dataset.recordManagementRegionHeaderDescription ?? "";
    }
  }

  drawer.addEventListener("click", (event) => {
    const evidenceModeToggle = event.target instanceof Element
      ? event.target.closest("[data-record-management-evidence-mode-toggle]")
      : null;
    if (evidenceModeToggle instanceof HTMLElement) {
      const nextMode = drawer.dataset.recordManagementEvidenceMode !== "true";
      drawer.dataset.recordManagementEvidenceMode = String(nextMode);
      evidenceModeToggle.setAttribute("aria-pressed", String(nextMode));
      if (nextMode) {
        const editToggle = drawer.querySelector("[data-record-management-drawer-edit]");
        drawer.dataset.recordManagementEditMode = "false";
        if (editToggle instanceof HTMLElement) {
          editToggle.setAttribute("aria-pressed", "false");
        }
      } else {
        closeRecordManagementEvidenceDrawer(drawer);
      }
      if (nextMode) {
        drawer.querySelector("[data-record-management-evidence-button]")?.focus();
      }
      return;
    }

    const evidenceButton = event.target instanceof Element
      ? event.target.closest("[data-record-management-evidence-button]")
      : null;
    if (evidenceButton instanceof HTMLElement) {
      const evidenceTarget = evidenceButton.closest("[data-entity-management-evidence-target]");
      const entityWorkspace = drawer.closest("[data-chat-workspace-entity-workspace]");
      if (evidenceTarget instanceof HTMLElement && entityWorkspace instanceof HTMLElement) {
        renderRecordManagementEvidenceDrawer({
          drawer,
          entityWorkspace,
          evidence: getEntityManagementEvidenceFromTarget(evidenceTarget),
        });
      }
      return;
    }

    const evidenceReturn = event.target instanceof Element
      ? event.target.closest("[data-record-management-evidence-return]")
      : null;
    if (evidenceReturn instanceof HTMLElement) {
      closeRecordManagementEvidenceDrawer(drawer);
      return;
    }

    const trigger = event.target instanceof Element
      ? event.target.closest("[data-record-management-drawer-edit]")
      : null;
    if (!(trigger instanceof HTMLElement)) {
      return;
    }
    const isEditing = drawer.dataset.recordManagementEditMode === "true";
    const nextEditing = !isEditing;
    drawer.dataset.recordManagementEditMode = String(nextEditing);
    if (nextEditing) {
      const evidenceToggle = drawer.querySelector("[data-record-management-evidence-mode-toggle]");
      drawer.dataset.recordManagementEvidenceMode = "false";
      closeRecordManagementEvidenceDrawer(drawer);
      if (evidenceToggle instanceof HTMLElement) {
        evidenceToggle.setAttribute("aria-pressed", "false");
      }
    }
    trigger.setAttribute("aria-pressed", String(nextEditing));
    if (nextEditing) {
      drawer.querySelector("[data-record-management-editable-field] input, [data-record-management-editable-field] select, [data-form-image-card-edit]")?.focus();
    }
  });

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
      activateRegion(shell, key);
    });
    shell.addEventListener("change", (event) => {
      const select = event.target instanceof Element
        ? event.target.closest("[data-record-management-region-select]")
        : null;
      if (!(select instanceof HTMLSelectElement) || !select.value) {
        return;
      }
      activateRegion(shell, select.value);
    });
    shell.addEventListener("click", (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest(".record-management-region-mobile-header [data-form-select-button]")
        : null;
      if (trigger instanceof HTMLButtonElement) {
        const root = trigger.closest("[data-form-select]");
        const listbox = root?.querySelector("[data-form-select-listbox]");
        if (listbox instanceof HTMLElement) {
          const isOpen = trigger.getAttribute("aria-expanded") === "true";
          trigger.setAttribute("aria-expanded", String(!isOpen));
          listbox.classList.toggle("hidden", isOpen);
          if (!isOpen) {
            root.querySelector("[data-form-select-option][aria-selected='true']")?.focus();
          }
        }
        return;
      }

      const option = event.target instanceof Element
        ? event.target.closest(".record-management-region-mobile-header [data-form-select-option]")
        : null;
      if (!(option instanceof HTMLButtonElement)) {
        return;
      }
      const root = option.closest("[data-form-select]");
      const hiddenInput = root?.querySelector("[data-form-select-value]");
      const currentLabel = root?.querySelector("[data-form-select-current-label]");
      const triggerButton = root?.querySelector("[data-form-select-button]");
      const listbox = root?.querySelector("[data-form-select-listbox]");
      const key = option.dataset.value ?? "";
      if (hiddenInput instanceof HTMLInputElement) {
        hiddenInput.value = key;
      }
      if (currentLabel instanceof HTMLElement) {
        currentLabel.textContent = option.textContent?.trim() ?? "";
      }
      root?.querySelectorAll("[data-form-select-option]").forEach((candidate) => {
        const isSelected = candidate === option;
        candidate.classList.toggle("active", isSelected);
        candidate.setAttribute("aria-selected", String(isSelected));
      });
      if (triggerButton instanceof HTMLButtonElement && listbox instanceof HTMLElement) {
        triggerButton.setAttribute("aria-expanded", "false");
        listbox.classList.add("hidden");
        triggerButton.focus();
      }
      if (key) {
        activateRegion(shell, key);
      }
    });
  });

  const nestedLists = Array.from(drawer.querySelectorAll("[data-record-management-nested-list]"));
  nestedLists.forEach((nestedList) => {
    nestedList.addEventListener("click", (event) => {
      const trigger = event.target instanceof Element
        ? event.target.closest("[data-record-management-nested-trigger]")
        : null;
      if (!(trigger instanceof HTMLElement)) {
        return;
      }
      const key = trigger.dataset.recordManagementNestedTrigger;
      if (!key) {
        return;
      }
      nestedList.querySelectorAll("[data-record-management-nested-trigger]").forEach((candidate) => {
        const isActive = candidate instanceof HTMLElement && candidate.dataset.recordManagementNestedTrigger === key;
        candidate.classList.toggle("is-active", isActive);
        candidate.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      nestedList.querySelectorAll("[data-record-management-nested-panel]").forEach((panel) => {
        if (!(panel instanceof HTMLElement)) {
          return;
        }
        panel.hidden = panel.dataset.recordManagementNestedPanel !== key;
      });
    });
  });

  drawer.addEventListener("change", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest("[data-entity-management-feature-status]")
      : null;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const owningFeatureKey = drawer.querySelector("[data-entity-management-owning-feature-key]");
    if (owningFeatureKey instanceof HTMLElement) {
      owningFeatureKey.hidden = target.value !== "existing";
    }
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
        headerLabel: group.label,
        headerDescription: group.description,
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
      headerLabel: "Attributes outside the drawer",
      headerDescription: "Definition attributes that are not placed in this drawer surface.",
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
  const isEditable = isRecordManagementDrawerEditableAttribute(attribute);
  return `
    <article class="record-management-user-attribute-card" data-record-management-user-attribute-card="${escapeHtml(attribute.attributeKey)}" ${isEditable ? 'data-record-management-editable-card="true"' : ""}>
      <div data-record-management-readonly-value>
        <span>${escapeHtml(attribute.label)}</span>
        <strong>${escapeHtml(attribute.sampleValue)}</strong>
        <p>${escapeHtml(attribute.description)}</p>
      </div>
      ${isEditable ? renderRecordManagementEditableControl(attribute) : ""}
      ${placement.elementKey === "relationshipList" ? relatedRows : ""}
    </article>
  `;
}

function renderNestedListPicker({ label, description, items }) {
  const activeKey = items[0]?.key ?? "";
  return `
    <section class="record-management-nested-list" aria-label="${escapeHtml(label)}" data-record-management-nested-list>
      <div class="record-management-nested-list-header">
        <div>
          <h5>${escapeHtml(label)}</h5>
          <p>${escapeHtml(description)}</p>
        </div>
      </div>
      <div class="record-management-nested-list-layout">
        <div class="record-management-nested-list-cards">
          ${items.map((item) => {
            const isActive = item.key === activeKey;
            return `
              <button
                class="record-management-nested-list-card${isActive ? " is-active" : ""}"
                type="button"
                aria-pressed="${isActive ? "true" : "false"}"
                data-record-management-nested-trigger="${escapeHtml(item.key)}"
              >
                <span>
                  <strong>${escapeHtml(item.label)}</strong>
                  <small>${escapeHtml(item.description)}</small>
                </span>
                <em>${escapeHtml(item.summary)}</em>
              </button>
            `;
          }).join("")}
        </div>
        <div class="record-management-nested-list-drawer">
          ${items.map((item) => {
            const isActive = item.key === activeKey;
            return `
              <section data-record-management-nested-panel="${escapeHtml(item.key)}" ${isActive ? "" : "hidden"}>
                <div class="record-management-nested-list-drawer-header">
                  <span>${escapeHtml(item.label)}</span>
                  <strong>${escapeHtml(item.summary)}</strong>
                  <p>${escapeHtml(item.description)}</p>
                </div>
                <div class="record-management-nested-list-rows">
                  ${item.groups.map((group) => `
                    <div class="record-management-nested-list-group">
                      <h6>${escapeHtml(group.label)}</h6>
                      ${group.items.map((row) => `
                        <article>
                          ${row.preview ? `<div class="record-management-logo-preview" data-logo-preview="${escapeHtml(row.preview)}" aria-label="${escapeHtml(row.title)} preview"><span>AC</span></div>` : ""}
                          <span>
                            <strong>${escapeHtml(row.title)}</strong>
                            <small>${escapeHtml(row.meta)}</small>
                          </span>
                          <em>${escapeHtml(row.badge)}</em>
                        </article>
                      `).join("")}
                    </div>
                  `).join("")}
                </div>
              </section>
            `;
          }).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderNestedListPanel(item) {
  return `
    <div class="record-management-nested-list-drawer record-management-nested-list-drawer-direct" data-record-management-nested-panel="${escapeHtml(item.key)}">
      <div class="record-management-nested-list-drawer-header">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.summary)}</strong>
        <p>${escapeHtml(item.description)}</p>
      </div>
      <div class="record-management-nested-list-rows">
        ${item.groups.map((group) => `
          <div class="record-management-nested-list-group">
            <h6>${escapeHtml(group.label)}</h6>
            ${group.items.map((row) => `
              <article>
                ${row.preview ? `<div class="record-management-logo-preview" data-logo-preview="${escapeHtml(row.preview)}" aria-label="${escapeHtml(row.title)} preview"><span>AC</span></div>` : ""}
                <span>
                  <strong>${escapeHtml(row.title)}</strong>
                  <small>${escapeHtml(row.meta)}</small>
                </span>
                <em>${escapeHtml(row.badge)}</em>
              </article>
            `).join("")}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderLogoPreviewGraphic(preview, label) {
  return `<span class="record-management-logo-preview" data-logo-preview="${escapeHtml(preview)}" aria-label="${escapeHtml(label)} preview"><span>AC</span></span>`;
}

function renderLogoUploadField(asset) {
  const inputId = `record-management-${asset.key}-upload`;
  return `
    <div class="record-management-logo-edit-surface" data-record-management-logo-edit-surface>
      <span class="form-field-label" id="${escapeHtml(inputId)}-label">Replace logo asset</span>
      <div
        class="form-upload-field"
        data-form-upload-field
        data-form-upload-state="idle"
      >
        <input
          id="${escapeHtml(inputId)}"
          class="form-upload-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          aria-labelledby="${escapeHtml(inputId)}-label"
          aria-describedby="${escapeHtml(inputId)}-help ${escapeHtml(inputId)}-status"
          data-form-upload-input
        />
        <label class="form-upload-dropzone" for="${escapeHtml(inputId)}" data-form-upload-dropzone>
          <span class="form-upload-preview" aria-hidden="true">
            <span class="form-upload-preview-art form-upload-preview-art-image"><span></span></span>
          </span>
          <span class="form-upload-copy">
            <strong data-form-upload-title>Drop a replacement logo here</strong>
            <span data-form-upload-summary>or choose PNG, JPEG, or WebP from this device</span>
          </span>
          <span class="form-upload-action">Browse</span>
        </label>
        <div class="form-upload-status" id="${escapeHtml(inputId)}-status" aria-live="polite">
          <span class="form-upload-status-dot" aria-hidden="true"></span>
          <span data-form-upload-status-copy>No replacement selected</span>
        </div>
        <div class="form-upload-progress" aria-hidden="true">
          <span data-form-upload-progress-bar></span>
        </div>
      </div>
      <span class="form-field-help" id="${escapeHtml(inputId)}-help">Preview only; no file bytes are read or persisted.</span>
    </div>
  `;
}

function renderLogoAssetPicker({ label, description, assets }) {
  const activeKey = assets[0]?.key ?? "";
  return `
    <section class="record-management-nested-list record-management-logo-asset-list" aria-label="${escapeHtml(label)}" data-record-management-nested-list data-record-management-logo-asset-list>
      <div class="record-management-nested-list-header">
        <div>
          <h5>${escapeHtml(label)}</h5>
          <p>${escapeHtml(description)}</p>
        </div>
      </div>
      <div class="record-management-nested-list-layout">
        <div class="record-management-nested-list-cards">
          ${assets.map((asset) => {
            const isActive = asset.key === activeKey;
            return `
              <button
                class="record-management-nested-list-card${isActive ? " is-active" : ""}"
                type="button"
                aria-pressed="${isActive ? "true" : "false"}"
                data-record-management-nested-trigger="${escapeHtml(asset.key)}"
              >
                <span>
                  <strong>${escapeHtml(asset.title)}</strong>
                  <small>${escapeHtml(asset.meta)}</small>
                </span>
                <em>${escapeHtml(asset.badge)}</em>
              </button>
            `;
          }).join("")}
        </div>
        <div class="record-management-nested-list-drawer">
          ${assets.map((asset) => {
            const isActive = asset.key === activeKey;
            return `
              <section data-record-management-nested-panel="${escapeHtml(asset.key)}" ${isActive ? "" : "hidden"}>
                <article class="record-management-logo-asset-detail" data-record-management-logo-asset-detail="${escapeHtml(asset.key)}">
                  <div class="record-management-nested-list-drawer-header">
                    <span>${escapeHtml(asset.badge)}</span>
                    <strong>${escapeHtml(asset.title)}</strong>
                    <p>${escapeHtml(asset.meta)}</p>
                  </div>
                  <article class="form-image-card" aria-labelledby="${escapeHtml(asset.key)}-title" data-form-image-card data-form-image-card-variant="person-full">
                    <div class="form-image-card-media" data-form-image-card-media>
                      <span class="form-image-card-placeholder" aria-hidden="true">
                        ${renderLogoPreviewGraphic(asset.preview, asset.title)}
                      </span>
                      <button class="form-image-card-edit" type="button" aria-label="Edit logo asset for ${escapeHtml(asset.title)}" data-form-image-card-edit>
                        <svg viewBox="0 0 24 24" focusable="false"><path d="m4 16.5-.5 4 4-.5L18.8 8.7 15.3 5.2Zm12-12 1.2-1.2a1.7 1.7 0 0 1 2.4 0l1.1 1.1a1.7 1.7 0 0 1 0 2.4L19.5 8" /></svg>
                      </button>
                    </div>
                    <div class="form-image-card-copy">
                      <strong id="${escapeHtml(asset.key)}-title">${escapeHtml(asset.title)}</strong>
                      <span>${escapeHtml(asset.summary)}</span>
                      <small>${escapeHtml(asset.alt)}</small>
                    </div>
                  </article>
                  ${renderLogoUploadField(asset)}
                </article>
              </section>
            `;
          }).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderScalarDetailCard({ label, value, description }) {
  return `
    <article class="record-management-user-attribute-card">
      <div>
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        <p>${escapeHtml(description)}</p>
      </div>
    </article>
  `;
}

function renderRegisteredAddressCard() {
  return `
    <article class="record-management-address-card" data-record-management-address-card="registeredAddress">
      <span>Registered address</span>
      <address>
        <strong>18 Legal Row</strong>
        <strong>Dublin 2</strong>
        <strong>Ireland</strong>
      </address>
      <p>Address used for legal correspondence.</p>
    </article>
  `;
}

function renderDetailsRegion(overviewAttributes) {
  const nameAttribute = overviewAttributes.find(({ attribute }) => attribute.attributeKey === "name")?.attribute;
  const industryAttribute = overviewAttributes.find(({ attribute }) => attribute.attributeKey === "industry")?.attribute;
  const tierAttribute = overviewAttributes.find(({ attribute }) => attribute.attributeKey === "tier")?.attribute;
  return `
    <section class="record-management-user-attribute-group" aria-label="Primary details">
      <div class="record-management-user-attribute-group-header">
        <h5>Primary details</h5>
        <p>Root Organization facts and reference data that identify the record.</p>
      </div>
      <div class="record-management-user-attribute-list">
        ${nameAttribute ? renderEndUserAttributeCard(nameAttribute, getAttributePlacement(nameAttribute, "listDrawer")) : ""}
        ${industryAttribute ? renderEndUserAttributeCard(industryAttribute, getAttributePlacement(industryAttribute, "listDrawer")) : ""}
        ${tierAttribute ? renderEndUserAttributeCard(tierAttribute, getAttributePlacement(tierAttribute, "listDrawer")) : ""}
      </div>
    </section>
  `;
}

function renderEntityManagementTextField({
  description = "",
  editable = true,
  label,
  multiline = false,
  name,
  value,
}) {
  const inputId = `entity-management-${name}`;
  const control = multiline
    ? `<textarea id="${escapeHtml(inputId)}" class="form-field-input form-field-textarea" name="${escapeHtml(name)}" rows="4" ${editable ? "" : "readonly"}>${escapeHtml(value)}</textarea>`
    : `<input id="${escapeHtml(inputId)}" class="form-field-input" type="text" name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${editable ? "" : "readonly"} />`;
  return `
    <div class="form-field entity-management-field${multiline ? " form-field-span-2" : ""}" ${renderEvidenceTargetAttributes({ name: label, value })}>
      <label class="form-field-label" for="${escapeHtml(inputId)}">${escapeHtml(label)}</label>
      ${renderEntityManagementEvidenceButton(label)}
      ${control}
      ${description ? `<span class="form-field-help">${escapeHtml(description)}</span>` : ""}
    </div>
  `;
}

function renderEntityManagementRadioGroup({ description = "", disabled = false, label, name, options, value }) {
  const legendId = `entity-management-${name}-legend`;
  const selectedOption = options.find((option) => option.value === value);
  return `
    <fieldset class="form-choice-group entity-management-choice-group" aria-labelledby="${escapeHtml(legendId)}" ${renderEvidenceTargetAttributes({ name: label, value: selectedOption?.label ?? value })}>
      <legend id="${escapeHtml(legendId)}" class="form-choice-legend">${escapeHtml(label)}</legend>
      ${renderEntityManagementEvidenceButton(label)}
      ${description ? `<p class="form-field-help">${escapeHtml(description)}</p>` : ""}
      <div class="form-choice-stack">
        ${options.map((option) => `
          <label class="form-choice-row">
            <input
              type="radio"
              name="${escapeHtml(name)}"
              value="${escapeHtml(option.value)}"
              ${option.value === value ? "checked" : ""}
              ${disabled ? "disabled" : ""}
              ${name === "featureStatus" ? "data-entity-management-feature-status" : ""}
            />
            <span>
              <strong>${escapeHtml(option.label)}</strong>
              ${option.description ? `<span>${escapeHtml(option.description)}</span>` : ""}
            </span>
          </label>
        `).join("")}
      </div>
    </fieldset>
  `;
}

function renderEntityManagementSelectField({ description = "", disabled = false, label, name, options, value }) {
  const inputId = `entity-management-${name}`;
  const selectedOption = options.find((option) => (typeof option === "string" ? option : option.value) === value);
  const selectedLabel = typeof selectedOption === "string" ? selectedOption : selectedOption?.label ?? value;
  return `
    <div class="form-field entity-management-field" ${renderEvidenceTargetAttributes({ name: label, value: selectedLabel })}>
      <label class="form-field-label" for="${escapeHtml(inputId)}">${escapeHtml(label)}</label>
      ${renderEntityManagementEvidenceButton(label)}
      <select id="${escapeHtml(inputId)}" class="form-field-input" name="${escapeHtml(name)}" ${disabled ? "disabled" : ""}>
        ${options.map((option) => {
          const optionValue = typeof option === "string" ? option : option.value;
          const optionLabel = typeof option === "string" ? option : option.label;
          return `
          <option value="${escapeHtml(optionValue)}" ${optionValue === value ? "selected" : ""}>${escapeHtml(optionLabel)}</option>
        `;
        }).join("")}
      </select>
      ${description ? `<span class="form-field-help">${escapeHtml(description)}</span>` : ""}
    </div>
  `;
}

function renderEntityManagementFeatureDrawerSelect() {
  const options = [
    {
      value: "organizationCore",
      label: "organizationCore",
      description: "Organization Core",
      attribute: "Existing feature key",
    },
    {
      value: "entityBuilder",
      label: "entityBuilder",
      description: "Entity Builder",
      attribute: "Existing feature key",
    },
    {
      value: "webAppHierarchyBuilder",
      label: "webAppHierarchyBuilder",
      description: "Web App Hierarchy Builder",
      attribute: "Existing feature key",
    },
  ];
  const selectMarkup = renderFormDrawerSelect({
    rootId: "entity-management-owning-feature-key-select",
    inputId: "entity-management-owning-feature-key-value",
    inputName: "owningFeatureKey",
    value: "organizationCore",
    triggerId: "entity-management-owning-feature-key-trigger",
    labelId: "entity-management-owning-feature-key-label",
    panelTitleId: "entity-management-owning-feature-key-title",
    searchInputId: "entity-management-owning-feature-key-search",
    optionListId: "entity-management-owning-feature-key-options",
    emptySummary: "Choose feature key",
    triggerLabel: "organizationCore",
    triggerMeta: "1 selected",
    drawerEyebrow: "Feature key",
    dialogTitle: "Choose owning feature key",
    closeLabel: "Close owning feature key selector",
    searchPlaceholder: "Search feature keys",
    selectedTitle: "Selected Feature Key",
    selectedEmpty: "No owning feature key selected yet.",
    availableTitle: "Existing Feature Keys",
    emptyMessage: "No feature keys match this search.",
    maxSelections: 1,
  }).replace(
    'data-form-drawer-select-option-list\n          ></div>',
    `data-form-drawer-select-option-list\n          >${renderFormDrawerSelectOptions(options)}</div>`,
  );
  return `
    <section class="form-field form-field-span-2 entity-management-drawer-select-field" data-entity-management-owning-feature-key ${renderEvidenceTargetAttributes({ name: "Owning feature key", value: "organizationCore" })}>
      <span class="form-field-label" id="entity-management-owning-feature-key-label">Owning feature key</span>
      ${renderEntityManagementEvidenceButton("Owning feature key")}
      ${selectMarkup}
      <span class="form-field-help">Drawer select preview; this will bind to runtime feature keys later.</span>
    </section>
  `;
}

function renderEntityManagementPrimaryDetailsPanel() {
  return `
    <section class="entity-management-subpanel" aria-label="Primary Details">
      <div class="record-management-user-attribute-group-header">
        <h5>Primary Details</h5>
        <p>Human-facing identity fields for the entity definition.</p>
      </div>
      <div class="entity-management-form-grid">
        ${renderEntityManagementTextField({
          label: "Entity name",
          name: "entityName",
          value: "Organization",
        })}
        ${renderEntityManagementTextField({
          description: "Stable key is locked once the entity definition exists.",
          editable: false,
          label: "Stable entity key",
          name: "stableEntityKey",
          value: "organization",
        })}
        ${renderEntityManagementTextField({
          label: "Plain-language description",
          multiline: true,
          name: "plainLanguageDescription",
          value: "A company, department, partner, or other business structure managed by the platform.",
        })}
        ${renderEntityManagementTextField({
          label: "Purpose / why this entity exists",
          multiline: true,
          name: "entityPurpose",
          value: "Keeps durable organization identity, ownership, structure, and reference data available for operations and reporting.",
        })}
      </div>
    </section>
  `;
}

function renderEntityManagementOwningFeaturePanel() {
  return `
    <section class="entity-management-subpanel" aria-label="Owning Feature">
      <div class="record-management-user-attribute-group-header">
        <h5>Owning Feature</h5>
        <p>Which feature will own this entity once it exists?</p>
      </div>
      <div class="entity-management-form-grid">
        ${renderEntityManagementRadioGroup({
          label: "Feature status",
          name: "featureStatus",
          options: [
            { value: "existing", label: "Existing" },
            { value: "planned", label: "Planned" },
            { value: "not_yet_assigned", label: "Not yet assigned" },
          ],
          value: "existing",
        })}
        ${renderEntityManagementFeatureDrawerSelect()}
        ${renderEntityManagementSelectField({
          description: "Will be autocompleted from feature selection once runtime-backed.",
          label: "Owning feature posture",
          name: "owningFeaturePosture",
          options: [
            { value: "implemented", label: "Implemented" },
            { value: "planned", label: "Planned" },
            { value: "not_yet_assigned", label: "Not yet assigned" },
          ],
          value: "implemented",
        })}
        ${renderEntityManagementSelectField({
          description: "Will be autocompleted from feature selection once runtime-backed.",
          label: "Owning layer",
          name: "owningLayer",
          options: [
            { value: "feature", label: "Feature" },
            { value: "platform", label: "Platform" },
            { value: "system", label: "System" },
            { value: "shared", label: "Shared" },
          ],
          value: "feature",
        })}
      </div>
    </section>
  `;
}

function renderEntityManagementSourceAuthorityPanel() {
  return `
    <section class="entity-management-subpanel" aria-label="Source Authority Posture">
      <div class="record-management-user-attribute-group-header">
        <h5>Source Authority Posture</h5>
        <p>Autocompleted posture values supplied by entity builder capabilities.</p>
      </div>
      <div class="entity-management-form-grid">
        ${renderEntityManagementRadioGroup({
          disabled: true,
          label: "Current authority",
          name: "currentAuthority",
          options: [
            { value: "repo_artifacts", label: "Repo artifacts", description: "Truth currently lives in docs/code/planning artifacts" },
            { value: "runtime_source", label: "Runtime source", description: "Truth currently lives in runtime code/schema/API behavior" },
            { value: "planning_artifact", label: "Planning artifact", description: "Truth is still planning-only" },
            { value: "persistent_entity_definition", label: "Persistent entity definition", description: "Persistent entity definition is already truth" },
            { value: "mixed_transitional", label: "Mixed transitional", description: "Multiple sources intentionally coexist during migration" },
          ],
          value: "repo_artifacts",
        })}
        ${renderEntityManagementRadioGroup({
          disabled: true,
          label: "Target authority",
          name: "targetAuthority",
          options: [
            { value: "persistent_entity_definition", label: "Persistent entity definition", description: "Intended normal target" },
            { value: "external_system_of_record", label: "External system of record", description: "Approved exception where another system owns truth" },
          ],
          value: "persistent_entity_definition",
        })}
        ${renderEntityManagementRadioGroup({
          disabled: true,
          label: "Markdown posture",
          name: "markdownPosture",
          options: [
            { value: "source", label: "Source", description: "Markdown is current source of truth" },
            { value: "source_independent_planning", label: "Source independent planning", description: "Markdown is planning/reference material" },
            { value: "mirrored_transitional", label: "Mirrored transitional", description: "Markdown mirrors persistent/runtime truth during transition" },
            { value: "generated_output", label: "Generated output", description: "Markdown should be generated from persistent truth" },
            { value: "not_applicable", label: "Not applicable" },
          ],
          value: "source_independent_planning",
        })}
        ${renderEntityManagementSelectField({
          disabled: true,
          description: "Autocompleted by entity builder capabilities.",
          label: "Migration status",
          name: "migrationStatus",
          options: [
            { value: "not_started", label: "Not started" },
            { value: "inventory_in_progress", label: "Inventory in progress" },
            { value: "mapped_to_definition", label: "Mapped to definition" },
            { value: "persistent_record_created", label: "Persistent record created" },
            { value: "mirrored_transitional", label: "Mirrored transitional" },
            { value: "persistent_primary", label: "Persistent primary" },
            { value: "blocked", label: "Blocked" },
          ],
          value: "not_started",
        })}
      </div>
    </section>
  `;
}

function renderEntityManagementIdentityRegion() {
  const items = [
    {
      key: "primary-details",
      label: "Primary Details",
      summary: "4 fields",
      description: "Entity name, stable key, description, and purpose.",
      content: renderEntityManagementPrimaryDetailsPanel(),
    },
    {
      key: "owning-feature",
      label: "Owning Feature",
      summary: "4 fields",
      description: "Which feature will own this entity once it exists?",
      content: renderEntityManagementOwningFeaturePanel(),
    },
    {
      key: "source-authority-posture",
      label: "Source Authority Posture",
      summary: "4 fields",
      description: "Current and target authority plus Markdown and migration posture.",
      content: renderEntityManagementSourceAuthorityPanel(),
    },
  ];
  const activeKey = items[0].key;
  return `
    <section class="record-management-user-attribute-group entity-management-identity-region" aria-label="Identity">
      <div class="record-management-user-attribute-group-header">
        <h5>Identity</h5>
        <p>Definition identity fields, feature ownership, and source authority posture.</p>
      </div>
      <div class="record-management-nested-list entity-management-sublist" data-record-management-nested-list>
        <div class="record-management-nested-list-layout">
          <div class="record-management-nested-list-cards" role="tablist" aria-label="Identity sublist">
            ${items.map((item) => {
              const isActive = item.key === activeKey;
              return `
                <button
                  class="record-management-nested-list-card${isActive ? " is-active" : ""}"
                  type="button"
                  role="tab"
                  aria-pressed="${isActive ? "true" : "false"}"
                  data-record-management-nested-trigger="${escapeHtml(item.key)}"
                >
                  <span>
                    <strong>${escapeHtml(item.label)}</strong>
                    <small>${escapeHtml(item.description)}</small>
                  </span>
                  <em>${escapeHtml(item.summary)}</em>
                </button>
              `;
            }).join("")}
          </div>
          <div class="record-management-nested-list-drawer entity-management-sublist-drawer">
            ${items.map((item) => `
              <section data-record-management-nested-panel="${escapeHtml(item.key)}" ${item.key === activeKey ? "" : "hidden"}>
                ${item.content}
              </section>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderStructureRegion() {
  return renderNestedListPicker({
    label: "Business units",
    description: "Only direct child business units from the next layer down are shown here.",
    items: [
      { key: "business-units", ...organizationNestedLists.businessUnits },
    ],
  });
}

function renderMembersRegion() {
  return renderNestedListPicker({
    label: "Members",
    description: "Membership lists are grouped by the tier that governs how users scan and action them.",
    items: [
      { key: "tenant-admins", ...organizationNestedLists.tenantAdmins },
      { key: "business-unit-owners", ...organizationNestedLists.businessUnitOwners },
      { key: "regular-members", ...organizationNestedLists.regularMembers },
    ],
  });
}

function renderLegalRegion() {
  return `
    <section class="record-management-user-attribute-group" aria-label="Legal details">
      <div class="record-management-user-attribute-group-header">
        <h5>Legal details</h5>
        <p>Official legal profile fields that users need without opening a separate record.</p>
      </div>
      <div class="record-management-field-grid">
        ${renderScalarDetailCard({
          label: "Legal name",
          value: "Acme Operations Ltd",
          description: "Current active legal profile.",
        })}
        ${renderScalarDetailCard({
          label: "Registration number",
          value: "IE-77842",
          description: "Official registration identifier.",
        })}
        ${renderScalarDetailCard({
          label: "VAT number",
          value: "IE998877A",
          description: "Tax/VAT value retained on the legal profile.",
        })}
      </div>
      ${renderRegisteredAddressCard()}
    </section>
  `;
}

function renderLocationsRegion() {
  return renderNestedListPicker({
    label: "Locations",
    description: "Location grouping is configurable; this preview uses EU, MENA, and APAC.",
    items: [
      { key: "locations-eu", ...organizationNestedLists.locationsEu },
      { key: "locations-mena", ...organizationNestedLists.locationsMena },
      { key: "locations-apac", ...organizationNestedLists.locationsApac },
    ],
  });
}

function renderBrandingRegion() {
  return `
    <section class="record-management-user-attribute-group" aria-label="Branding">
      <div class="record-management-user-attribute-group-header">
        <h5>Branding</h5>
        <p>Branding shows the current primary colour alongside logo relationships.</p>
      </div>
      <div class="record-management-branding-summary">
        <span aria-hidden="true"></span>
        <div>
          <strong>Primary colour</strong>
          <p>#0f766e</p>
        </div>
      </div>
      ${renderLogoAssetPicker({
        label: organizationNestedLists.logos.label,
        description: organizationNestedLists.logos.description,
        assets: organizationNestedLists.logos.items,
      })}
    </section>
  `;
}

function renderRecordManagementEndUserAttributeView() {
  const { definition, drawerAttributes } = getDrawerAttributeGroups();
  const overviewAttributes = drawerAttributes.filter(({ placement }) => (
    placement.groupKey === "identity"
    || placement.groupKey === "references"
  ));

  const regions = [
    {
      key: "details",
      label: "Details",
      headerLabel: "Organization details",
      headerDescription: "Root Organization facts and reference data that identify the record.",
      count: 3,
      content: renderDetailsRegion(overviewAttributes),
    },
    {
      key: "relationships",
      label: "Structure",
      headerLabel: "Business units",
      headerDescription: "Only direct child business units from the next layer down are shown here.",
      count: 1,
      content: renderStructureRegion(),
    },
    {
      key: "members",
      label: "Members",
      headerLabel: "Members",
      headerDescription: "Membership lists grouped by tenant admins, business unit owners, and regular members.",
      count: 3,
      content: renderMembersRegion(),
    },
    {
      key: "legal",
      label: "Legal details",
      headerLabel: "Legal details",
      headerDescription: "Official legal profile fields that users need without opening a separate record.",
      count: 4,
      content: renderLegalRegion(),
    },
    {
      key: "locations",
      label: "Locations",
      headerLabel: "Locations",
      headerDescription: "Location grouping is configurable; this preview uses EU, MENA, and APAC.",
      count: 3,
      content: renderLocationsRegion(),
    },
    {
      key: "branding",
      label: "Branding",
      headerLabel: "Branding",
      headerDescription: "Branding shows the current primary colour alongside logo relationships.",
      count: 2,
      content: renderBrandingRegion(),
    },
  ];

  return `
    <section class="record-management-user-attribute-view" aria-label="Organization record details" data-record-management-user-attribute-view>
      ${renderRecordManagementRegionShell({ label: "Organization drawer", regions })}
    </section>
  `;
}

function renderEntityManagementPageAttributeView() {
  const regions = [
    {
      key: "identity",
      label: "Identity",
      headerLabel: "Identity",
      headerDescription: "Definition identity fields, feature ownership, and source authority posture.",
      count: 3,
      content: renderEntityManagementIdentityRegion(),
    },
    {
      key: "relationships",
      label: "Structure",
      headerLabel: "Business units",
      headerDescription: "Only direct child business units from the next layer down are shown here.",
      count: 1,
      content: renderStructureRegion(),
    },
    {
      key: "members",
      label: "Members",
      headerLabel: "Members",
      headerDescription: "Membership lists grouped by tenant admins, business unit owners, and regular members.",
      count: 3,
      content: renderMembersRegion(),
    },
    {
      key: "legal",
      label: "Legal details",
      headerLabel: "Legal details",
      headerDescription: "Official legal profile fields that users need without opening a separate record.",
      count: 4,
      content: renderLegalRegion(),
    },
    {
      key: "locations",
      label: "Locations",
      headerLabel: "Locations",
      headerDescription: "Location grouping is configurable; this preview uses EU, MENA, and APAC.",
      count: 3,
      content: renderLocationsRegion(),
    },
    {
      key: "branding",
      label: "Branding",
      headerLabel: "Branding",
      headerDescription: "Branding shows the current primary colour alongside logo relationships.",
      count: 2,
      content: renderBrandingRegion(),
    },
  ];

  return `
    <section class="record-management-user-attribute-view" aria-label="Entity management page details" data-record-management-user-attribute-view>
      ${renderRecordManagementRegionShell({ label: "Entity management page", regions })}
    </section>
  `;
}

function renderRecordManagementAttributeView(selected, entityWorkspace) {
  if (isEntityManagementPageTemplate(entityWorkspace)) {
    return renderEntityManagementPageAttributeView(selected);
  }
  return getRecordManagementDrawerMode(entityWorkspace) === "root"
    ? renderRecordManagementRootAttributeView(selected)
    : renderRecordManagementEndUserAttributeView(selected);
}

function getEntityManagementEvidenceFromTarget(target) {
  return {
    elementName: target.dataset.evidenceElementName ?? "Element",
    elementValue: target.dataset.evidenceElementValue ?? "",
    points: [
      {
        generatedBy: "human",
        posture: target.dataset.evidencePosture ?? "derived_from_source_truth",
        source: target.dataset.evidenceSource ?? "docs/data-dictionary/organization.md",
        note: target.dataset.evidenceNote ?? "Existing data dictionary uses Organization as the canonical entity name.",
      },
      {
        generatedBy: "system",
        posture: "builder_autocomplete_candidate",
        source: "entityBuilder.capabilities.identityEvidencePreview",
        note: "Runtime entity builder capabilities will autocomplete this evidence set once connected.",
      },
      {
        generatedBy: "LLM",
        posture: "draft_interpretation",
        source: "entityBuilder.assistedDraft.evidenceSuggestion",
        note: "Assisted drafting may suggest evidence notes for human review before promotion.",
      },
    ],
  };
}

function closeRecordManagementEvidenceDrawer(drawer) {
  drawer.dataset.recordManagementEvidenceView = "false";
  drawer.querySelector("[data-record-management-evidence-drawer]")?.remove();
}

function renderRecordManagementEvidenceDrawer({ drawer, entityWorkspace, evidence }) {
  entityWorkspace.dataset.chatWorkspaceDrawerOpen = "true";
  drawer.hidden = false;
  drawer.dataset.recordManagementEditMode = "false";
  drawer.dataset.recordManagementEvidenceMode = "true";
  drawer.dataset.recordManagementEvidenceView = "true";
  const editToggle = drawer.querySelector("[data-record-management-drawer-edit]");
  const evidenceToggle = drawer.querySelector("[data-record-management-evidence-mode-toggle]");
  if (editToggle instanceof HTMLElement) {
    editToggle.setAttribute("aria-pressed", "false");
  }
  if (evidenceToggle instanceof HTMLElement) {
    evidenceToggle.setAttribute("aria-pressed", "true");
  }
  const body = drawer.querySelector(".chat-workspace-list-drawer-body");
  if (!(body instanceof HTMLElement)) {
    return;
  }
  body.querySelector("[data-record-management-evidence-drawer]")?.remove();
  body.insertAdjacentHTML("beforeend", `
    <aside class="record-management-evidence-drawer" aria-label="Evidence detail" data-record-management-evidence-drawer>
      <div class="chat-workspace-list-drawer-header">
        <div class="chat-workspace-list-drawer-header-copy">
          <p>Evidence</p>
          <h4>${escapeHtml(evidence.elementName)}</h4>
          <div class="record-management-drawer-header-meta">
            <span>Element value</span>
            <span class="record-management-status-badge">${escapeHtml(evidence.elementValue || "Not set")}</span>
          </div>
        </div>
        <button class="icon-button" type="button" aria-label="Close evidence detail" data-record-management-evidence-return>
          <span class="icon-button-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </span>
        </button>
      </div>
      <section class="record-management-evidence-list" aria-label="Evidence points">
        ${evidence.points.map((point) => `
          <article class="record-management-evidence-card">
            <dl>
              <div>
                <dt>Generated by</dt>
                <dd>${escapeHtml(point.generatedBy)}</dd>
              </div>
              <div>
                <dt>Posture</dt>
                <dd>${escapeHtml(point.posture)}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>${escapeHtml(point.source)}</dd>
              </div>
              <div>
                <dt>Note</dt>
                <dd>${escapeHtml(point.note)}</dd>
              </div>
            </dl>
          </article>
        `).join("")}
      </section>
    </aside>
  `);
  drawer.querySelector("[data-record-management-evidence-return]")?.focus();
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
  drawer.dataset.recordManagementEditMode = "false";
  drawer.dataset.recordManagementEvidenceMode = "false";
  drawer.dataset.recordManagementEvidenceView = "false";
  if (!selected) {
    recordManagementDrawerSelections.delete(entityWorkspace);
    drawer.replaceChildren();
    return;
  }
  recordManagementDrawerSelections.set(entityWorkspace, selected);

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
      <div class="chat-workspace-list-drawer-header-copy">
        <p>${escapeHtml(selected.entity)}</p>
        <h4>${escapeHtml(selected.title)}</h4>
        <div class="record-management-drawer-header-meta">
          <span>${escapeHtml(selected.status)}</span>
          <span class="record-management-status-badge">${escapeHtml(selected.note)}</span>
        </div>
      </div>
      <div class="chat-workspace-list-drawer-header-actions">
        ${renderPrimaryIconButton({
          ariaLabel: "Toggle edit mode",
          className: "record-management-drawer-edit-button",
          icon: renderEntityManagementEditIcon(),
          title: "Edit",
          toggleAttribute: "data-record-management-drawer-edit",
        })}
        ${isEntityManagementPageTemplate(entityWorkspace) ? renderPrimaryIconButton({
          ariaLabel: "Toggle evidence mode",
          className: "record-management-drawer-evidence-button",
          icon: renderGovernanceEvidenceIcon(),
          title: "Evidence",
          toggleAttribute: "data-record-management-evidence-mode-toggle",
        }) : ""}
        <button class="icon-button" type="button" aria-label="Close item detail" data-chat-workspace-list-drawer-close>
          <span class="icon-button-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </span>
        </button>
      </div>
    </div>
    <div class="chat-workspace-list-drawer-body">
      <div class="record-management-active-group-summary">
        <h5 data-record-management-drawer-region-title>${isEntityManagementPageTemplate(entityWorkspace) ? "Identity" : "Organization details"}</h5>
        <p data-record-management-drawer-region-description>${isEntityManagementPageTemplate(entityWorkspace) ? "Definition identity fields, feature ownership, and source authority posture." : "Root Organization facts and reference data that identify the record."}</p>
      </div>
      ${renderRecordManagementAttributeView(selected, entityWorkspace)}
    </div>
  `;
  installRecordManagementRegionIndex(drawer);
  initializeFormDrawerSelects({ scope: drawer });
}
