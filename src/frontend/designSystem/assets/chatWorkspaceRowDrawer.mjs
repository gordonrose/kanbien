import {
  initializeFormDrawerSelects,
  refreshFormDrawerSelect,
  renderFormDrawerSelect,
  renderFormDrawerSelectOptions,
} from "./formControls.mjs";

const recordManagementDrawerSelections = new WeakMap();
const recordManagementNestedListResize = Object.freeze({
  max: 416,
  min: 176,
  step: 16,
});

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

const entityManagementViewSkeletonLists = Object.freeze({
  listViews: Object.freeze({
    label: "List views",
    description: "Table, card, and search result presentations that help users scan entity records.",
    summary: "3 draft views",
    groups: Object.freeze([
      {
        label: "View skeletons",
        items: Object.freeze([
          { title: "Default list", meta: "Primary browsing view", badge: "Draft" },
          { title: "Compact picker", meta: "Selection and relationship linking", badge: "Draft" },
          { title: "Search results", meta: "Search-first record discovery", badge: "Draft" },
        ]),
      },
    ]),
  }),
  detailViews: Object.freeze({
    label: "Detail views",
    description: "Reading and editing views that open from a selected entity record.",
    summary: "2 draft views",
    groups: Object.freeze([
      {
        label: "View skeletons",
        items: Object.freeze([
          { title: "Detail drawer", meta: "List-centric reading surface", badge: "Draft" },
          { title: "Full detail page", meta: "Deep-linkable record view", badge: "Future" },
        ]),
      },
    ]),
  }),
  workflowViews: Object.freeze({
    label: "Workflow views",
    description: "Create, update, review, and lifecycle views that change entity records.",
    summary: "4 draft views",
    groups: Object.freeze([
      {
        label: "View skeletons",
        items: Object.freeze([
          { title: "Create form", meta: "New entity record intake", badge: "Draft" },
          { title: "Edit form", meta: "Mutable field updates", badge: "Draft" },
          { title: "Review queue", meta: "Human approval and evidence checks", badge: "Draft" },
          { title: "Lifecycle actions", meta: "Archive, restore, and cleanup decisions", badge: "Future" },
        ]),
      },
    ]),
  }),
});

const entityManagementWorkflowSkeletonLists = Object.freeze({
  intake: Object.freeze({
    label: "Intake",
    description: "First-step workflow for collecting required information before a record exists.",
    summary: "Draft workflow",
  }),
  review: Object.freeze({
    label: "Review",
    description: "Human review workflow for checking evidence and approving record changes.",
    summary: "Draft workflow",
  }),
  lifecycle: Object.freeze({
    label: "Lifecycle",
    description: "Archive, restore, and cleanup workflow for record lifecycle decisions.",
    summary: "Draft workflow",
  }),
});

const entityManagementCatalogSkeletonLists = Object.freeze({
  statusCatalog: Object.freeze({
    label: "Status catalog",
    description: "Reusable status values for lifecycle and workflow-facing enum attributes.",
    summary: "Entity-specific",
    scope: "entity",
    options: Object.freeze([
      { label: "Draft", value: "draft" },
      { label: "Active", value: "active" },
      { label: "Archived", value: "archived" },
    ]),
  }),
  priorityCatalog: Object.freeze({
    label: "Priority catalog",
    description: "Shared priority values that can be reused across operational records.",
    summary: "Global",
    scope: "global",
    options: Object.freeze([
      { label: "Low", value: "low" },
      { label: "Normal", value: "normal" },
      { label: "High", value: "high" },
    ]),
  }),
  timezoneCatalog: Object.freeze({
    label: "Timezone catalog",
    description: "Global IANA timezone values used by scheduling, location, and user preference attributes.",
    summary: "Global",
    scope: "global",
    options: Object.freeze([
      { label: "UTC", value: "UTC" },
      { label: "Europe/Dublin", value: "Europe/Dublin" },
      { label: "America/New_York", value: "America/New_York" },
      { label: "Asia/Singapore", value: "Asia/Singapore" },
    ]),
  }),
  countryCodeCatalog: Object.freeze({
    label: "Country code catalog",
    description: "Global ISO 3166-1 alpha-2 country codes used by address and regional configuration attributes.",
    summary: "Global",
    scope: "global",
    options: Object.freeze([
      { label: "Ireland", value: "IE" },
      { label: "United Kingdom", value: "GB" },
      { label: "United States", value: "US" },
      { label: "Singapore", value: "SG" },
    ]),
  }),
});

const entityManagementPlacementSkeletonLists = Object.freeze({
  primaryDetails: Object.freeze({
    label: "Primary details",
    description: "Default record drawer region for the most important identifying fields.",
    summary: "3 attributes",
    secondaryNavEnabled: true,
    secondaryNavEntity: "team",
    attributes: Object.freeze(["teamName", "teamDescription", "teamStatus"]),
    sections: Object.freeze([
      Object.freeze({ label: "Summary", attributes: Object.freeze(["teamName", "teamDescription", "teamStatus"]) }),
      Object.freeze({ label: "Ownership", attributes: Object.freeze(["teamLead", "updatedAt"]) }),
    ]),
  }),
  operations: Object.freeze({
    label: "Operations",
    description: "Operational drawer region for workflow and ownership context.",
    summary: "2 attributes",
    secondaryNavEnabled: true,
    secondaryNavEntity: "task",
    attributes: Object.freeze(["taskStatus", "assignee"]),
    sections: Object.freeze([
      Object.freeze({ label: "Work queue", attributes: Object.freeze(["taskTitle", "taskStatus", "assignee"]) }),
      Object.freeze({ label: "Timing", attributes: Object.freeze(["dueDate", "priority"]) }),
    ]),
  }),
  system: Object.freeze({
    label: "System",
    description: "System drawer region for audit and lifecycle timestamps.",
    summary: "2 attributes",
    secondaryNavEnabled: false,
    secondaryNavEntity: "",
    attributes: Object.freeze(["createdAt", "updatedAt"]),
    sections: Object.freeze([
      Object.freeze({ label: "Audit", attributes: Object.freeze(["createdAt", "updatedAt"]) }),
    ]),
  }),
});

const entityManagementRecordActionErrorTypes = Object.freeze([
  "notAuthorized",
  "notFound",
  "conflict",
  "wrongLifecycleState",
  "relationshipBoundaryViolation",
  "dependencyExists",
  "validationFailed",
  "rateLimited",
  "asyncAcceptedButFailed",
  "cleanupFailed",
  "externalDependencyFailed",
  "unsupportedAction",
]);

const entityManagementRecordActionCapabilities = Object.freeze([
  { key: "list", label: "List", description: "List record rows available to the actor.", executionMode: "sync", compatibilityRisk: "low" },
  { key: "read", label: "Read", description: "Read one record and its visible detail projection.", executionMode: "sync", compatibilityRisk: "low" },
  { key: "create", label: "Create", description: "Create a new entity record.", executionMode: "sync", compatibilityRisk: "medium" },
  { key: "update", label: "Update", description: "Update mutable fields on an entity record.", executionMode: "sync", compatibilityRisk: "medium" },
  { key: "archive", label: "Archive", description: "Move an active record into archived posture.", executionMode: "sync", compatibilityRisk: "medium" },
  { key: "restore", label: "Restore", description: "Return an archived record to active posture.", executionMode: "sync", compatibilityRisk: "medium" },
  { key: "delete", label: "Delete", description: "Delete a record through the approved deletion path.", executionMode: "sync", compatibilityRisk: "high" },
  { key: "export", label: "Export", description: "Export records for approved operational use.", executionMode: "async", compatibilityRisk: "medium" },
  { key: "bulkImport", label: "Bulk import", description: "Create or update many records from an import source.", executionMode: "async", compatibilityRisk: "high" },
  { key: "bulkUpdate", label: "Bulk update", description: "Apply one update operation across many records.", executionMode: "async", compatibilityRisk: "high" },
  { key: "linkParent", label: "Link parent", description: "Attach this record to an approved parent entity.", executionMode: "sync", compatibilityRisk: "medium" },
  { key: "unlinkParent", label: "Unlink parent", description: "Remove a parent relationship from this record.", executionMode: "sync", compatibilityRisk: "medium" },
  { key: "linkChild", label: "Link child", description: "Attach an approved child entity record.", executionMode: "sync", compatibilityRisk: "medium" },
  { key: "unlinkChild", label: "Unlink child", description: "Remove a child relationship from this record.", executionMode: "sync", compatibilityRisk: "medium" },
  { key: "operationalStatusTransition", label: "Operational status transition", description: "Move a record between approved operational statuses.", executionMode: "sync", compatibilityRisk: "medium" },
]);

const entityManagementRecordActionRoutes = Object.freeze({
  list: "GET /v1/organizations",
  read: "GET /v1/organizations/:organizationId",
  create: "POST /v1/organizations",
  update: "PATCH /v1/organizations/:organizationId",
  archive: "POST /v1/organizations/:organizationId/archive",
  restore: "POST /v1/organizations/:organizationId/restore",
  delete: "DELETE /v1/organizations/:organizationId",
  export: "POST /v1/organizations/export",
  bulkImport: "POST /v1/organizations/bulk-import",
  bulkUpdate: "PATCH /v1/organizations/bulk-update",
  linkParent: "POST /v1/organizations/:organizationId/parents",
  unlinkParent: "DELETE /v1/organizations/:organizationId/parents/:parentId",
  linkChild: "POST /v1/organizations/:organizationId/children",
  unlinkChild: "DELETE /v1/organizations/:organizationId/children/:childId",
  operationalStatusTransition: "POST /v1/organizations/:organizationId/operational-status-transition",
});

const entityManagementStructureActionCapabilities = Object.freeze([
  { key: "create_entity", label: "Create entity", description: "Create a new draft entity definition lineage.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "definition_lifecycle", apiRoute: "POST /v1/entity-definitions" },
  { key: "read_entity", label: "Read entity", description: "Read an entity definition and its visible structure sections.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "definition_lifecycle", apiRoute: "GET /v1/entity-definitions/:entityId" },
  { key: "update_entity_identity", label: "Update entity identity", description: "Update labels, ownership, family, scope, and identity metadata.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "entity_identity", apiRoute: "PATCH /v1/entity-definitions/:entityId/identity" },
  { key: "archive_entity", label: "Archive entity", description: "Archive a retained entity definition lineage when allowed.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "definition_lifecycle", apiRoute: "POST /v1/entity-definitions/:entityId/archive" },
  { key: "restore_entity", label: "Restore entity", description: "Restore an archived entity definition lineage when explicitly allowed.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "definition_lifecycle", apiRoute: "POST /v1/entity-definitions/:entityId/restore" },
  { key: "delete_entity", label: "Delete entity", description: "Delete a draft or unused entity definition through the approved deletion path.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "definition_lifecycle", apiRoute: "DELETE /v1/entity-definitions/:entityId" },
  { key: "read_source_authority", label: "Read source authority", description: "Read source authority posture for an entity definition.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "source_authority", apiRoute: "GET /v1/entity-definitions/:entityId/source-authority" },
  { key: "update_source_authority", label: "Update source authority", description: "Update current or target source authority posture for an entity definition.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "source_authority", apiRoute: "PATCH /v1/entity-definitions/:entityId/source-authority" },
  { key: "promote_source_authority_to_primary_truth", label: "Promote source authority to primary truth", description: "Promote source authority after approved migration and compatibility evidence.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "source_authority", apiRoute: "POST /v1/entity-definitions/:entityId/source-authority/promote" },
  { key: "review_source_authority", label: "Review source authority", description: "Record a review decision for source authority posture.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "source_authority", apiRoute: "POST /v1/entity-definitions/:entityId/source-authority/reviews" },
  { key: "read_workflow_model", label: "Read workflow model", description: "Read definition workflow and lifecycle configuration.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "definition_workflow_model", apiRoute: "GET /v1/entity-definitions/:entityId/workflow-model" },
  { key: "edit_creation_flow", label: "Edit creation flow", description: "Edit how draft entities or managed records are created.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "definition_workflow_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/workflow-model/creation-flow" },
  { key: "edit_review_flow", label: "Edit review flow", description: "Edit review-request, approval, and request-changes behavior.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "definition_workflow_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/workflow-model/review-flow" },
  { key: "edit_definition_lifecycle_flow", label: "Edit definition lifecycle flow", description: "Edit definition lifecycle transitions and review gates.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "definition_workflow_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/workflow-model/definition-lifecycle" },
  { key: "edit_record_lifecycle_flow", label: "Edit record lifecycle flow", description: "Edit managed-record archive, restore, delete, and cleanup posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "definition_workflow_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/workflow-model/record-lifecycle" },
  { key: "validate_workflow_model", label: "Validate workflow model", description: "Validate lifecycle, status, workflow, and cleanup consistency.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "definition_workflow_model", apiRoute: "POST /v1/entity-definitions/:entityId/workflow-model/validate" },
  { key: "create_collection_view", label: "Create collection view", description: "Add a governed collection view for a managed entity.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "collection_view", apiRoute: "POST /v1/entity-definitions/:entityId/views" },
  { key: "edit_collection_view", label: "Edit collection view", description: "Edit collection-view labels, descriptions, ordering, and base metadata.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "collection_view", apiRoute: "PATCH /v1/entity-definitions/:entityId/views/:viewId" },
  { key: "set_default_collection_view", label: "Set default collection view", description: "Change the default view with compatibility checks.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "collection_view", apiRoute: "POST /v1/entity-definitions/:entityId/views/:viewId/set-default" },
  { key: "edit_view_role_eligibility", label: "Edit view role eligibility", description: "Change which actors or contexts may use a collection view.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "collection_view", apiRoute: "PATCH /v1/entity-definitions/:entityId/views/:viewId/role-eligibility" },
  { key: "edit_view_status_membership", label: "Edit view status membership", description: "Change which statuses and sub-statuses belong to a view.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "collection_view", apiRoute: "PATCH /v1/entity-definitions/:entityId/views/:viewId/status-membership" },
  { key: "edit_view_display_model", label: "Edit view display model", description: "Change list and drawer display posture for a collection view.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "view_display_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/views/:viewId/display-model" },
  { key: "validate_collection_view", label: "Validate collection view", description: "Validate role, status, default, display, and template-region consistency.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "collection_view", apiRoute: "POST /v1/entity-definitions/:entityId/views/:viewId/validate" },
  { key: "create_relationship_definition", label: "Create relationship definition", description: "Add a relationship definition with boundary and lifecycle posture.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "relationship_definition", apiRoute: "POST /v1/entity-definitions/:entityId/relationships" },
  { key: "edit_relationship_definition", label: "Edit relationship definition", description: "Edit relationship metadata, boundary, navigation, and lifecycle impact.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "relationship_definition", apiRoute: "PATCH /v1/entity-definitions/:entityId/relationships/:relationshipId" },
  { key: "remove_relationship_definition", label: "Remove relationship definition", description: "Remove a relationship definition only when compatibility checks pass.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "relationship_definition", apiRoute: "DELETE /v1/entity-definitions/:entityId/relationships/:relationshipId" },
  { key: "validate_relationship_definition", label: "Validate relationship definition", description: "Validate boundary, cardinality, lifecycle, and target entity rules.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "relationship_definition", apiRoute: "POST /v1/entity-definitions/:entityId/relationships/:relationshipId/validate" },
  { key: "create_attribute", label: "Create attribute", description: "Add a field-complete attribute to a draft entity definition.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "attribute_definition", apiRoute: "POST /v1/entity-definitions/:entityId/attributes" },
  { key: "edit_attribute_metadata", label: "Edit attribute metadata", description: "Edit labels, type, cardinality, mutability, and requiredness.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "attribute_definition", apiRoute: "PATCH /v1/entity-definitions/:entityId/attributes/:attributeKey/metadata" },
  { key: "edit_attribute_validation", label: "Edit attribute validation", description: "Add, edit, or remove validation rules for an attribute.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "attribute_definition", apiRoute: "PATCH /v1/entity-definitions/:entityId/attributes/:attributeKey/validation" },
  { key: "edit_attribute_search_posture", label: "Edit attribute search posture", description: "Change search operators, storage model, and index posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "attribute_definition", apiRoute: "PATCH /v1/entity-definitions/:entityId/attributes/:attributeKey/search" },
  { key: "edit_attribute_privacy_security", label: "Edit attribute privacy and security", description: "Change privacy and security classifications for an attribute.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "attribute_definition", apiRoute: "PATCH /v1/entity-definitions/:entityId/attributes/:attributeKey/privacy-security" },
  { key: "remove_attribute", label: "Remove attribute", description: "Remove an attribute only when compatibility and migration checks pass.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "attribute_definition", apiRoute: "DELETE /v1/entity-definitions/:entityId/attributes/:attributeKey" },
  { key: "create_catalog", label: "Create catalog", description: "Add a reusable value catalog for constrained values.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "catalog_definition", apiRoute: "POST /v1/entity-definitions/:entityId/catalogs" },
  { key: "edit_catalog", label: "Edit catalog", description: "Edit catalog metadata and source posture.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "catalog_definition", apiRoute: "PATCH /v1/entity-definitions/:entityId/catalogs/:catalogId" },
  { key: "add_catalog_value", label: "Add catalog value", description: "Add an allowed value to a value catalog.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "catalog_value", apiRoute: "POST /v1/entity-definitions/:entityId/catalogs/:catalogId/values" },
  { key: "edit_catalog_value", label: "Edit catalog value", description: "Edit a catalog value label, display order, badge tone, or description.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "catalog_value", apiRoute: "PATCH /v1/entity-definitions/:entityId/catalogs/:catalogId/values/:valueKey" },
  { key: "remove_catalog_value", label: "Remove catalog value", description: "Remove a catalog value only when compatibility rules allow.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "catalog_value", apiRoute: "DELETE /v1/entity-definitions/:entityId/catalogs/:catalogId/values/:valueKey" },
  { key: "reorder_catalog_value", label: "Reorder catalog value", description: "Change the order of values within a catalog.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "catalog_value", apiRoute: "POST /v1/entity-definitions/:entityId/catalogs/:catalogId/values/reorder" },
  { key: "edit_attribute_option_source", label: "Edit attribute option source", description: "Attach an attribute to inline, catalog, or relationship-backed options.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "catalog_definition", apiRoute: "PATCH /v1/entity-definitions/:entityId/attributes/:attributeKey/option-source" },
  { key: "create_placement", label: "Create placement", description: "Add an attribute or relationship placement to an approved surface.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "display_model", apiRoute: "POST /v1/entity-definitions/:entityId/placements" },
  { key: "edit_placement", label: "Edit placement", description: "Change placement metadata, visibility, or interaction posture.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "display_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/placements/:placementId" },
  { key: "remove_placement", label: "Remove placement", description: "Remove a placement without deleting the underlying attribute or relationship.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "display_model", apiRoute: "DELETE /v1/entity-definitions/:entityId/placements/:placementId" },
  { key: "reorder_placement", label: "Reorder placement", description: "Move a placement within an approved region, sub-region, and group.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "display_model", apiRoute: "POST /v1/entity-definitions/:entityId/placements/reorder" },
  { key: "select_placement_attribute", label: "Select placement attribute", description: "Add one attribute to a display section.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "placement_attribute", apiRoute: "POST /v1/entity-definitions/:entityId/placements/:placementId/sections/:sectionId/attributes" },
  { key: "deselect_placement_attribute", label: "Deselect placement attribute", description: "Remove one attribute from a display section.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "placement_attribute", apiRoute: "DELETE /v1/entity-definitions/:entityId/placements/:placementId/sections/:sectionId/attributes/:attributeKey" },
  { key: "reorder_placement_attribute", label: "Reorder placement attribute", description: "Reorder attributes within a display section.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "placement_attribute", apiRoute: "POST /v1/entity-definitions/:entityId/placements/:placementId/sections/:sectionId/attributes/reorder" },
  { key: "show_view_drawer_placement", label: "Show view drawer placement", description: "Make a placement visible in a view drawer.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "view_display_model", apiRoute: "POST /v1/entity-definitions/:entityId/views/:viewId/display/drawer/placements/:placementId/show" },
  { key: "hide_view_drawer_placement", label: "Hide view drawer placement", description: "Hide a placement from a view drawer.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "view_display_model", apiRoute: "POST /v1/entity-definitions/:entityId/views/:viewId/display/drawer/placements/:placementId/hide" },
  { key: "validate_display_model", label: "Validate display model", description: "Validate template region, sub-region, element, and placement compatibility.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "display_model", apiRoute: "POST /v1/entity-definitions/:entityId/display-model/validate" },
  { key: "read_generation_model", label: "Read generation model", description: "Read what this entity definition is allowed to generate or drive.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "generation_model", apiRoute: "GET /v1/entity-definitions/:entityId/generation-model" },
  { key: "edit_generation_model", label: "Edit generation model", description: "Edit allowed outputs, blocked outputs, and drift-detection posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "generation_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/generation-model" },
  { key: "preview_generated_page", label: "Preview generated page", description: "Preview generated entity-management page defaults without applying app changes.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "generation_model", apiRoute: "POST /v1/entity-definitions/:entityId/generation/page-preview" },
  { key: "generate_api_contract_draft", label: "Generate API contract draft", description: "Generate a draft API contract from action and capability metadata.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "generation_model", apiRoute: "POST /v1/entity-definitions/:entityId/generation/api-contract-draft" },
  { key: "generate_capability_mapping_draft", label: "Generate capability mapping draft", description: "Generate draft capability and permission mappings from the action model.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "generation_model", apiRoute: "POST /v1/entity-definitions/:entityId/generation/capability-mapping-draft" },
  { key: "generate_test_draft", label: "Generate test draft", description: "Generate draft test coverage from schema, actions, and compatibility posture.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "generation_model", apiRoute: "POST /v1/entity-definitions/:entityId/generation/test-draft" },
  { key: "generate_docs_draft", label: "Generate docs draft", description: "Generate source-independent documentation drafts from canonical definition truth.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "generation_model", apiRoute: "POST /v1/entity-definitions/:entityId/generation/docs-draft" },
  { key: "read_compliance_model", label: "Read compliance model", description: "Read entity-level privacy, security, audit, retention, export, and cleanup posture.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "compliance_model", apiRoute: "GET /v1/entity-definitions/:entityId/compliance-model" },
  { key: "edit_privacy_posture", label: "Edit privacy posture", description: "Edit privacy impact and sensitive privacy category summary.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "compliance_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/compliance-model/privacy" },
  { key: "edit_security_posture", label: "Edit security posture", description: "Edit entity-level security impact and encryption posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "compliance_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/compliance-model/security" },
  { key: "edit_audit_posture", label: "Edit audit posture", description: "Edit whether entity-level operations require durable audit events.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "compliance_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/compliance-model/audit" },
  { key: "edit_retention_cleanup_posture", label: "Edit retention and cleanup posture", description: "Edit retention policy, legal hold, cleanup ownership, and delete posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "compliance_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/compliance-model/retention-cleanup" },
  { key: "edit_export_posture", label: "Edit export posture", description: "Edit whether and how entity data can be exported.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "compliance_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/compliance-model/export" },
  { key: "validate_compliance_model", label: "Validate compliance model", description: "Validate compliance posture against attributes, assets, retention, and evidence.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "compliance_model", apiRoute: "POST /v1/entity-definitions/:entityId/compliance-model/validate" },
  { key: "read_migration_model", label: "Read migration model", description: "Read migration adoption posture from repo/source artifacts into persistent truth.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "migration_model", apiRoute: "GET /v1/entity-definitions/:entityId/migration-model" },
  { key: "edit_migration_model", label: "Edit migration model", description: "Edit migration status, source posture, target record, and evidence keys.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "migration_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/migration-model" },
  { key: "record_migration_blocker", label: "Record migration blocker", description: "Record a blocker that prevents migration or source-authority promotion.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "migration_model", apiRoute: "POST /v1/entity-definitions/:entityId/migration-model/blockers" },
  { key: "resolve_migration_blocker", label: "Resolve migration blocker", description: "Mark a migration blocker as resolved with evidence.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "migration_model", apiRoute: "POST /v1/entity-definitions/:entityId/migration-model/blockers/:blockerId/resolve" },
  { key: "record_compatibility_check", label: "Record compatibility check", description: "Record API, persistence, docs, permission, or runtime parity evidence.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "migration_model", apiRoute: "POST /v1/entity-definitions/:entityId/migration-model/compatibility-checks" },
  { key: "validate_migration_readiness", label: "Validate migration readiness", description: "Validate whether migration and source-authority promotion can proceed.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "migration_model", apiRoute: "POST /v1/entity-definitions/:entityId/migration-model/validate-readiness" },
  { key: "read_action_model", label: "Read action model", description: "Read entity action metadata and capability mappings.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "action_model", apiRoute: "GET /v1/entity-definitions/:entityId/action-model" },
  { key: "edit_action_model", label: "Edit action model", description: "Edit action metadata, surface placement, and capability mappings.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "action_model", apiRoute: "PATCH /v1/entity-definitions/:entityId/action-model" },
  { key: "validate_action_model", label: "Validate action model", description: "Validate action, route, capability, authz, audit, and evidence coverage.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "action_model", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/validate" },
  { key: "generate_action_model_from_sections", label: "Generate action model from sections", description: "Draft action model entries from entity sections without granting runtime authority.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "action_model", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/generate-from-sections" },
  { key: "create_record_list_capability", label: "Create record list capability", description: "Create the runtime list capability from entity view, filter, sort, pagination, authz, and audit posture.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/list" },
  { key: "create_record_read_capability", label: "Create record read capability", description: "Create the runtime read capability from drawer projection, field visibility, authz, evidence, and audit posture.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/read" },
  { key: "create_record_create_capability", label: "Create record create capability", description: "Create the runtime create capability from required fields, source authority, workflow, validation, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/create" },
  { key: "create_record_update_capability", label: "Create record update capability", description: "Create the runtime update capability from mutable fields, validation, source authority, authz, evidence, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/update" },
  { key: "create_record_archive_capability", label: "Create record archive capability", description: "Create the runtime archive capability from record lifecycle, retention, cleanup, authz, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/archive" },
  { key: "create_record_restore_capability", label: "Create record restore capability", description: "Create the runtime restore capability from lifecycle reactivation, validation, authz, evidence, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/restore" },
  { key: "create_record_delete_capability", label: "Create record delete capability", description: "Create the runtime delete capability from deletion eligibility, retention, legal hold, cleanup, authz, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/delete" },
  { key: "create_record_export_capability", label: "Create record export capability", description: "Create the runtime export capability from export posture, privacy, field eligibility, async job, authz, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/export" },
  { key: "create_record_bulk_import_capability", label: "Create record bulk import capability", description: "Create the runtime bulk-import capability from import mapping, validation, idempotency, async job, evidence, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/bulk-import" },
  { key: "create_record_bulk_update_capability", label: "Create record bulk update capability", description: "Create the runtime bulk-update capability from mutable-field rules, selection filters, async job, authz, evidence, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/bulk-update" },
  { key: "create_record_link_parent_capability", label: "Create record link parent capability", description: "Create the runtime parent-link capability from relationship definitions, boundary rules, authz, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/link-parent" },
  { key: "create_record_unlink_parent_capability", label: "Create record unlink parent capability", description: "Create the runtime parent-unlink capability from relationship lifecycle, boundary rules, authz, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/unlink-parent" },
  { key: "create_record_link_child_capability", label: "Create record link child capability", description: "Create the runtime child-link capability from relationship definitions, boundary rules, authz, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/link-child" },
  { key: "create_record_unlink_child_capability", label: "Create record unlink child capability", description: "Create the runtime child-unlink capability from relationship lifecycle, boundary rules, authz, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/unlink-child" },
  { key: "create_record_status_transition_capability", label: "Create record status transition capability", description: "Create the runtime status-transition capability from workflow statuses, allowed transitions, authz, evidence, and audit posture.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "record_capability_generation", apiRoute: "POST /v1/entity-definitions/:entityId/action-model/record-capabilities/status-transition" },
  { key: "attach_entity_evidence", label: "Attach entity evidence", description: "Attach evidence to an entity-definition section or model.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "evidence_audit", apiRoute: "POST /v1/entity-definitions/:entityId/evidence" },
  { key: "edit_entity_evidence", label: "Edit entity evidence", description: "Edit evidence metadata for an entity-definition section or model.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "evidence_audit", apiRoute: "PATCH /v1/entity-definitions/:entityId/evidence/:evidenceId" },
  { key: "remove_entity_evidence", label: "Remove entity evidence", description: "Remove an evidence link when retention and review rules allow.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "evidence_audit", apiRoute: "DELETE /v1/entity-definitions/:entityId/evidence/:evidenceId" },
  { key: "reconcile_evidence", label: "Reconcile evidence", description: "Compare evidence links against current source truth and report drift.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "evidence_audit", apiRoute: "POST /v1/entity-definitions/:entityId/evidence/reconcile" },
  { key: "attach_field_evidence", label: "Attach field evidence", description: "Attach evidence to a specific entity-definition field.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "evidence_audit", apiRoute: "POST /v1/entity-definitions/:entityId/fields/:fieldId/evidence" },
  { key: "read_llm_guidance", label: "Read LLM guidance", description: "Read reusable LLM guidance for a schema field or section.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "llm_guidance", apiRoute: "GET /v1/entity-definitions/:entityId/fields/:fieldId/llm-guidance" },
  { key: "edit_authoring_guidance", label: "Edit authoring guidance", description: "Edit how an LLM obtains, infers, or defaults a value.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "llm_guidance", apiRoute: "PATCH /v1/entity-definitions/:entityId/fields/:fieldId/llm-guidance/authoring" },
  { key: "edit_writing_guidance", label: "Edit writing guidance", description: "Edit writing style, examples, tone, and copy rules.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "llm_guidance", apiRoute: "PATCH /v1/entity-definitions/:entityId/fields/:fieldId/llm-guidance/writing" },
  { key: "edit_question_guidance", label: "Edit question guidance", description: "Edit how an LLM asks a human for a value.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "llm_guidance", apiRoute: "PATCH /v1/entity-definitions/:entityId/fields/:fieldId/llm-guidance/question" },
  { key: "validate_llm_guidance", label: "Validate LLM guidance", description: "Check guidance does not ask for system-owned or source-derived values.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "llm_guidance", apiRoute: "POST /v1/entity-definitions/:entityId/fields/:fieldId/llm-guidance/validate" },
  { key: "capture_role_need", label: "Capture role need", description: "Record a role need before proposing authz mapping changes.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "role_need", apiRoute: "POST /v1/entity-definitions/:entityId/permissions/role-needs" },
  { key: "edit_role_need", label: "Edit role need", description: "Edit a captured role need and its business evidence.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "role_need", apiRoute: "PATCH /v1/entity-definitions/:entityId/permissions/role-needs/:roleNeedId" },
  { key: "create_authz_mapping", label: "Create authz mapping", description: "Create a draft authz mapping for review.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "authz_mapping", apiRoute: "POST /v1/entity-definitions/:entityId/permissions/authz-mappings" },
  { key: "edit_authz_mapping", label: "Edit authz mapping", description: "Edit a draft authz mapping without granting runtime permission.", executionMode: "sync", compatibilityRisk: "high", actionFamily: "authz_mapping", apiRoute: "PATCH /v1/entity-definitions/:entityId/permissions/authz-mappings/:mappingId" },
  { key: "validate_authz_mapping", label: "Validate authz mapping", description: "Validate role, capability, boundary, and artifact requirements.", executionMode: "sync", compatibilityRisk: "low", actionFamily: "authz_mapping", apiRoute: "POST /v1/entity-definitions/:entityId/permissions/authz-mappings/:mappingId/validate" },
  { key: "add_permission_capability", label: "Add permission capability", description: "Add one capability to a role permission entry.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "permission_capability", apiRoute: "POST /v1/entity-definitions/:entityId/permissions/roles/:rolePermissionId/capabilities" },
  { key: "remove_permission_capability", label: "Remove permission capability", description: "Remove one capability from a role permission entry.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "permission_capability", apiRoute: "DELETE /v1/entity-definitions/:entityId/permissions/roles/:rolePermissionId/capabilities/:capabilityKey" },
  { key: "select_permission_capability_family", label: "Select permission capability family", description: "Grant every selected capability in a family to a role permission entry.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "permission_capability", apiRoute: "POST /v1/entity-definitions/:entityId/permissions/roles/:rolePermissionId/capabilities/select-family" },
  { key: "deselect_permission_capability_family", label: "Deselect permission capability family", description: "Remove every selected capability in a family from a role permission entry.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "permission_capability", apiRoute: "POST /v1/entity-definitions/:entityId/permissions/roles/:rolePermissionId/capabilities/deselect-family" },
  { key: "generate_permission_mapping_draft", label: "Generate permission mapping draft", description: "Generate maintained permission-mapping artifact drafts from approved role needs.", executionMode: "sync", compatibilityRisk: "medium", actionFamily: "authz_mapping", apiRoute: "POST /v1/entity-definitions/:entityId/permissions/mapping-draft" },
]);

const entityManagementViewWorkflowOptions = Object.freeze([
  { value: "intakeWorkflow", label: "Intake", description: "First-step workflow for collecting required information before a record exists.", attribute: "Draft workflow" },
  { value: "reviewWorkflow", label: "Review", description: "Human review workflow for checking evidence and approving record changes.", attribute: "Draft workflow" },
  { value: "lifecycleWorkflow", label: "Lifecycle", description: "Archive, restore, and cleanup workflow for record lifecycle decisions.", attribute: "Draft workflow" },
]);

const entityManagementViewWorkflowStatuses = Object.freeze({
  intakeWorkflow: Object.freeze([
    { value: "draft", label: "Draft", visible: true },
    { value: "inRefinement", label: "In refinement", visible: true },
    { value: "queued", label: "Queued", visible: true },
  ]),
  reviewWorkflow: Object.freeze([
    { value: "submitted", label: "Submitted", visible: true },
    { value: "needsChanges", label: "Needs changes", visible: true },
    { value: "approved", label: "Approved", visible: true },
  ]),
  lifecycleWorkflow: Object.freeze([
    { value: "active", label: "Active", visible: true },
    { value: "archived", label: "Archived", visible: false },
    { value: "restored", label: "Restored", visible: true },
  ]),
});

const entityManagementViewModuleOptions = Object.freeze([
  { value: "organizationCore", label: "Organization Core", description: "Root/admin entity management module", attribute: "root-admin" },
  { value: "tenantDirectory", label: "Tenant Directory", description: "Tenant-scoped directory module", attribute: "tenant" },
  { value: "designSystemTemplates", label: "Design System Templates", description: "Design-system proving-ground module", attribute: "design-system" },
]);

const entityManagementViewParentPageOptions = Object.freeze([
  { value: "rootOrganizations", label: "Root organizations", description: "Organization record-management list page", attribute: "/root-admin/organizations" },
  { value: "tenantOrganizations", label: "Tenant organizations", description: "Tenant-scoped organization list page", attribute: "/tenant/organizations" },
  { value: "entityTemplates", label: "Entity templates", description: "Design-system entity template page", attribute: "/design-system/templates/entity_management_page" },
]);

const entityManagementViewPageTemplateOptions = Object.freeze([
  { value: "record_management_page", label: "record_management_page", description: "Full-page record management template", attribute: "Page template" },
  { value: "record_management_list_centric", label: "record_management_list_centric", description: "List-centric record management template", attribute: "Page template" },
]);

const entityManagementViewRoleOptions = Object.freeze([
  { value: "rootAdmin", label: "Root Admin", description: "Platform operator with root access", attribute: "Existing role" },
  { value: "tenantAdmin", label: "Tenant Admin", description: "Tenant operator inside the current tenant", attribute: "Existing role" },
  { value: "organizationOwner", label: "Organization Owner", description: "Owner for the matching organization", attribute: "Existing role" },
  { value: "organizationViewer", label: "Organization Viewer", description: "Read-only organization participant", attribute: "Existing role" },
]);

const entityManagementPermissionRoleOptions = Object.freeze([
  { value: "llm", label: "LLM", description: "Default machine-assisted authoring actor", attribute: "System role" },
  ...entityManagementViewRoleOptions,
]);

const entityManagementInitialViewAccessRoleOptions = Object.freeze([
  entityManagementPermissionRoleOptions[0],
]);

const entityManagementPermissionCapabilityFamilies = Object.freeze([
  {
    key: "record",
    label: "Record capabilities",
    description: "Runtime record actions this role may use.",
    capabilities: entityManagementRecordActionCapabilities.map(({ key, label }) => ({ key, label })),
  },
  {
    key: "entityStructure",
    label: "Entity structure capabilities",
    description: "Definition and field-management actions this role may use.",
    capabilities: entityManagementStructureActionCapabilities.map(({ key, label }) => ({ key, label })),
  },
]);

const entityManagementViewRelationshipOptions = Object.freeze([
  { value: "tenant", label: "Tenant", description: "Hardcoded current tenant context", attribute: "Hardcoded entity" },
  { value: "organization", label: "Organization", description: "User and entity share the same organization ID", attribute: "Shared parent relationship" },
  { value: "team", label: "Team", description: "User and entity share the same team ID", attribute: "Shared parent relationship" },
]);

const entityManagementViewObjectOptions = Object.freeze([
  { value: "notApplicable", label: "Not applicable", description: "No specific object record assignment is required", attribute: "Optional" },
  { value: "deal", label: "Deal", description: "User must be assigned to a specific deal record", attribute: "Entity record" },
  { value: "organization", label: "Organization", description: "User must be assigned to a specific organization record", attribute: "Entity record" },
  { value: "task", label: "Task", description: "User must be assigned to a specific task record", attribute: "Entity record" },
]);

const entityManagementViewObjectCapacityOptions = Object.freeze([
  { value: "notApplicable", label: "Not applicable", description: "No object-specific capacity is required", attribute: "Optional" },
  { value: "owner", label: "Owner", description: "Assigned as the owner for that object", attribute: "Object capacity" },
  { value: "reader", label: "Reader", description: "Assigned read access for that object", attribute: "Object capacity" },
  { value: "editor", label: "Editor", description: "Assigned edit access for that object", attribute: "Object capacity" },
]);

const entityManagementRelationshipEntityOptions = Object.freeze([
  { value: "organization", label: "Organization", description: "Company, department, partner, or business structure", attribute: "Current entity" },
  { value: "tenant", label: "Tenant", description: "Customer or workspace boundary", attribute: "Available entity" },
  { value: "user", label: "User", description: "Human actor record", attribute: "Available entity" },
  { value: "team", label: "Team", description: "Collaborative group under an organization", attribute: "Available entity" },
  { value: "deal", label: "Deal", description: "Commercial opportunity record", attribute: "Available entity" },
  { value: "task", label: "Task", description: "Assignable unit of work", attribute: "Available entity" },
]);

const entityManagementRelationshipCategoryOptions = Object.freeze([
  "parentRelation",
  "childRelation",
  "domainRelation",
]);

const entityManagementRelationshipCardinalityOptions = Object.freeze([
  "oneToOne",
  "oneToMany",
  "manyToOne",
  "manyToMany",
]);

const entityManagementRelationshipResolutionOptions = Object.freeze([
  "storedReference",
  "inverseLookup",
  "joinEntity",
  "computed",
  "externalLookup",
]);

const entityManagementRelationshipNavigationPostureOptions = Object.freeze([
  "notNavigable",
  "displayOnly",
  "navigable",
  "governanceOnly",
  "supportOnly",
]);

const entityManagementRelationshipOwnershipPostureOptions = Object.freeze([
  "owns",
  "references",
  "sharedReference",
  "dependent",
]);

const entityManagementRelationshipBoundaryOptions = Object.freeze([
  "notApplicable",
  "sameTenant",
  "sameOrganization",
  "sameBusinessUnit",
  "sameOrganizationTree",
  "sameBusinessUnitTree",
  "crossTenantDenied",
  "crossOrganizationDenied",
  "crossBusinessUnitDenied",
  "crossTenantAllowedWithApproval",
  "crossOrganizationAllowedWithApproval",
  "crossBusinessUnitAllowedWithApproval",
  "crossTenantAllowed",
  "crossOrganizationAllowed",
  "crossBusinessUnitAllowed",
]);

const entityManagementRelationshipLifecycleImpactOptions = Object.freeze([
  "none",
  "restrict",
  "cascadeArchive",
  "cascadeDelete",
  "detach",
  "reassignRequired",
  "preserveHistorical",
  "cleanupRequired",
]);

const entityManagementRelationshipSkeletonLists = Object.freeze({
  tenant: Object.freeze({
    relationshipKey: "tenant",
    labelKey: "entity.organization.relationship.tenant.label",
    labelFallback: "Tenant",
    descriptionKey: "entity.organization.relationship.tenant.description",
    descriptionFallback: "Tenant that owns this organization.",
    relationshipCategory: "parentRelation",
    targetEntityKey: "tenant",
    relationshipRole: "tenant",
    inverseRelationshipRole: "organizations",
    cardinality: "manyToOne",
    resolution: "storedReference",
    sourceAttributeKey: "tenantId",
    inverseAttributeKey: "none",
    joinEntityKey: "none",
    ownershipPosture: "dependent",
    navigationPosture: "governanceOnly",
    relationshipBoundary: Object.freeze({
      tenantBoundary: "sameTenant",
      organizationBoundary: "notApplicable",
      businessUnitBoundary: "notApplicable",
    }),
    relationshipLifecycleImpact: Object.freeze({
      onArchive: "none",
      onDelete: "restrict",
      onRestore: "none",
      onSupersede: "preserveHistorical",
    }),
  }),
  businessUnits: Object.freeze({
    relationshipKey: "businessUnits",
    labelKey: "entity.organization.relationship.businessUnits.label",
    labelFallback: "Business units",
    descriptionKey: "entity.organization.relationship.businessUnits.description",
    descriptionFallback: "Business units that belong to this organization.",
    relationshipCategory: "childRelation",
    targetEntityKey: "businessUnit",
    relationshipRole: "businessUnits",
    inverseRelationshipRole: "organization",
    cardinality: "oneToMany",
    resolution: "inverseLookup",
    sourceAttributeKey: "none",
    inverseAttributeKey: "organizationId",
    joinEntityKey: "none",
    ownershipPosture: "owns",
    navigationPosture: "navigable",
    relationshipBoundary: Object.freeze({
      tenantBoundary: "sameTenant",
      organizationBoundary: "sameOrganization",
      businessUnitBoundary: "notApplicable",
    }),
    relationshipLifecycleImpact: Object.freeze({
      onArchive: "cascadeArchive",
      onDelete: "restrict",
      onRestore: "none",
      onSupersede: "preserveHistorical",
    }),
  }),
  primaryLogo: Object.freeze({
    relationshipKey: "primaryLogo",
    labelKey: "entity.organization.relationship.primaryLogo.label",
    labelFallback: "Primary logo",
    descriptionKey: "entity.organization.relationship.primaryLogo.description",
    descriptionFallback: "Primary logo asset displayed for this organization.",
    relationshipCategory: "domainRelation",
    targetEntityKey: "asset",
    relationshipRole: "primaryLogo",
    inverseRelationshipRole: "none",
    cardinality: "oneToOne",
    resolution: "storedReference",
    sourceAttributeKey: "primaryLogoAssetId",
    inverseAttributeKey: "none",
    joinEntityKey: "none",
    ownershipPosture: "references",
    navigationPosture: "displayOnly",
    relationshipBoundary: Object.freeze({
      tenantBoundary: "sameTenant",
      organizationBoundary: "sameOrganization",
      businessUnitBoundary: "notApplicable",
    }),
    relationshipLifecycleImpact: Object.freeze({
      onArchive: "none",
      onDelete: "detach",
      onRestore: "none",
      onSupersede: "preserveHistorical",
    }),
  }),
});

const entityManagementChildEntityOptions = Object.freeze([
  { value: "user", label: "User", description: "Human actor records attached to this entity", attribute: "Child entity" },
  { value: "team", label: "Team", description: "Collaborative group records attached to this entity", attribute: "Child entity" },
  { value: "deal", label: "Deal", description: "Commercial opportunity records attached to this entity", attribute: "Child entity" },
  { value: "task", label: "Task", description: "Assignable work records attached to this entity", attribute: "Child entity" },
]);

const entityManagementPlacementAttributeOptionsByEntity = Object.freeze({
  organization: Object.freeze([
    { key: "email", label: "Email", description: "Primary contact email for the organization." },
    { key: "description", label: "Description", description: "Human-facing summary for the organization." },
    { key: "status", label: "Status", description: "Lifecycle or operational posture for the organization." },
    { key: "owner", label: "Owner", description: "Internal owner responsible for this organization." },
    { key: "createdAt", label: "Created at", description: "When this organization record was created." },
    { key: "updatedAt", label: "Updated at", description: "When this organization record was last updated." },
  ]),
  user: Object.freeze([
    { key: "userName", label: "User name", description: "Human-facing display name for the user." },
    { key: "email", label: "Email", description: "Primary email address for the user." },
    { key: "role", label: "Role", description: "Primary role assigned to the user." },
    { key: "status", label: "Status", description: "Lifecycle or operational posture for the user." },
    { key: "createdAt", label: "Created at", description: "When this user record was created." },
    { key: "updatedAt", label: "Updated at", description: "When this user record was last updated." },
  ]),
  team: Object.freeze([
    { key: "teamName", label: "Team name", description: "Human-facing display name for the team." },
    { key: "teamDescription", label: "Team description", description: "Human-facing summary for the team." },
    { key: "teamStatus", label: "Team status", description: "Lifecycle or operational posture for the team." },
    { key: "teamLead", label: "Team lead", description: "User responsible for coordinating the team." },
    { key: "createdAt", label: "Created at", description: "When this team record was created." },
    { key: "updatedAt", label: "Updated at", description: "When this team record was last updated." },
  ]),
  deal: Object.freeze([
    { key: "dealName", label: "Deal name", description: "Human-facing display name for the deal." },
    { key: "dealValue", label: "Deal value", description: "Expected value for the deal." },
    { key: "dealStage", label: "Deal stage", description: "Current pipeline stage for the deal." },
    { key: "dealOwner", label: "Deal owner", description: "User responsible for the deal." },
    { key: "closeDate", label: "Close date", description: "Expected or actual close date." },
    { key: "updatedAt", label: "Updated at", description: "When this deal record was last updated." },
  ]),
  task: Object.freeze([
    { key: "taskTitle", label: "Task title", description: "Human-facing display name for the task." },
    { key: "taskStatus", label: "Task status", description: "Current status for the task." },
    { key: "assignee", label: "Assignee", description: "User assigned to the task." },
    { key: "dueDate", label: "Due date", description: "Date the task is expected to be completed." },
    { key: "priority", label: "Priority", description: "Relative urgency for the task." },
    { key: "updatedAt", label: "Updated at", description: "When this task record was last updated." },
  ]),
});

const entityManagementAttributeSkeletonLists = Object.freeze({
  email: Object.freeze({
    attributeKey: "email",
    label: "Email",
    labelKey: "entity.rootUser.attribute.email.label",
    labelFallback: "Email",
    description: "Primary email address used to identify and contact the user.",
    descriptionKey: "entity.rootUser.attribute.email.description",
    descriptionFallback: "Primary email address used to identify and contact the user.",
    category: "identity",
    attributeType: "email",
    valueCardinality: "single",
    required: true,
    systemManaged: false,
    mutability: "updateable",
    privacyClassification: "notSensitive",
    securityClassification: "internal",
    search: Object.freeze({
      searchable: true,
      operators: Object.freeze(["exact", "prefix", "contains", "sort"]),
      storageModel: "normalizedScalar",
      indexPosture: "required",
    }),
    validationRules: [
      {
        ruleKey: "maxLength",
        argumentType: "integer",
        argumentValue: 120,
        messageKey: "validation.maxLength",
        messageFallback: "Must be 120 characters or fewer.",
      },
    ],
    summary: "Email",
  }),
  description: Object.freeze({
    label: "Description",
    description: "Short plain-language summary of what the record represents.",
    summary: "Long text",
  }),
  status: Object.freeze({
    label: "Status",
    description: "Lifecycle state or operational posture for the record.",
    summary: "Workflow",
  }),
  owner: Object.freeze({
    label: "Owner",
    description: "User, team, or role accountable for the record.",
    summary: "Relationship",
  }),
  createdAt: Object.freeze({
    label: "Created at",
    description: "System-managed timestamp captured when the record is created.",
    summary: "System",
  }),
  updatedAt: Object.freeze({
    label: "Updated at",
    description: "System-managed timestamp captured when the record changes.",
    summary: "System",
  }),
});

const entityManagementAttributeTypeOptions = Object.freeze([
  "string",
  "text",
  "boolean",
  "integer",
  "decimal",
  "uuid",
  "email",
  "url",
  "date",
  "datetime",
  "dateRange",
  "dateTimeRange",
  "limitedEnum",
  "expandedEnum",
  "coordinates",
  "json",
  "money",
  "phoneNumber",
  "countryCode",
  "timezone",
  "relationshipReference",
  "imageReference",
  "videoReference",
  "audioReference",
  "documentReference",
  "spreadsheetReference",
]);

const entityManagementAttributeMutabilityOptions = Object.freeze([
  "immutable",
  "createOnly",
  "updateable",
  "systemUpdateable",
  "lifecycleManaged",
  "relationshipManaged",
  "derived",
  "calculated",
]);

const entityManagementPrivacyClassificationOptions = Object.freeze([
  "none",
  "notSensitive",
  "sensitive",
]);

const entityManagementSensitivePrivacyCategoryOptions = Object.freeze([
  { value: "racialOrEthnicOrigin", label: "racial or ethnic origin" },
  { value: "politicalOpinions", label: "political opinions" },
  { value: "religiousOrPhilosophicalBeliefs", label: "religious or philosophical beliefs" },
  { value: "tradeUnionMembership", label: "trade union membership" },
  { value: "healthData", label: "health data, health insurance information, patient IDs" },
  { value: "sexLifeOrSexualOrientation", label: "sex life or sexual orientation" },
  { value: "criminalConvictions", label: "criminal convictions" },
  { value: "governmentIdentifiers", label: "Social Security numbers, passport numbers, driver's license numbers" },
  { value: "financialData", label: "credit card numbers, bank routing numbers, tax records" },
  { value: "medicalOrBiometricData", label: "fingerprints, genetic data, medical or biometric identifiers" },
]);

const entityManagementSecurityClassificationOptions = Object.freeze([
  { value: "none", label: "none", description: "No special security visibility restriction beyond normal entity access." },
  { value: "internal", label: "internal", description: "Visible only to internal users." },
  { value: "restricted", label: "restricted", description: "Visible only to internal users with explicit authorization." },
  { value: "classified", label: "classified", description: "Visible only to internal users with explicit authorization and required clearance." },
]);

const entityManagementItemLimitOptions = Object.freeze([
  { value: "notApplicable", label: "Not applicable" },
  ...Array.from({ length: 10 }, (_, index) => {
    const value = String(index + 1);
    return { value, label: value };
  }),
]);

const entityManagementSearchOperatorOptions = Object.freeze([
  { value: "exact", label: "Exact", description: "Exact value matching.", attribute: "Filter" },
  { value: "prefix", label: "Prefix", description: "Starts-with matching.", attribute: "Filter" },
  { value: "contains", label: "Contains", description: "Contains matching.", attribute: "Filter" },
  { value: "fullText", label: "Full text", description: "Full-text search over approved text.", attribute: "Search" },
  { value: "range", label: "Range", description: "Range filtering for ordered values.", attribute: "Filter" },
  { value: "facet", label: "Facet", description: "Facet/count grouping.", attribute: "Facet" },
  { value: "sort", label: "Sort", description: "Sort by this attribute.", attribute: "Sort" },
]);

const entityManagementSearchStorageModelOptions = Object.freeze([
  { value: "scalar", label: "scalar", description: "A single ordinary stored value is searched directly." },
  { value: "normalizedScalar", label: "normalizedScalar", description: "A normalized stored value supports search/filtering." },
  { value: "junctionTable", label: "junctionTable", description: "Multi-value values are stored in a separate relation/table." },
  { value: "generatedColumn", label: "generatedColumn", description: "A database or persistence-generated value supports search." },
  { value: "jsonApproved", label: "jsonApproved", description: "Searchable values live in JSON/JSONB with explicit approval for operators and scale." },
  { value: "externalIndex", label: "externalIndex", description: "Search is handled outside the main database." },
  { value: "notSearchable", label: "notSearchable", description: "The attribute is not searchable, filterable, facetable, or sortable." },
]);

const entityManagementSearchIndexPostureOptions = Object.freeze([
  "notApplicable",
  "required",
  "recommended",
  "existing",
  "deferred",
]);

const entityManagementMigrationStatusOptions = Object.freeze([
  "notStarted",
  "inventoryInProgress",
  "mappedToDefinition",
  "persistentRecordCreated",
  "mirroredTransitional",
  "persistentPrimary",
  "blocked",
]);

const entityManagementMigrationSourcePostureOptions = Object.freeze([
  "repoArtifactsPrimary",
  "persistentEntityDefinitionPrimary",
]);

const entityManagementMigrationCompatibilityCheckOptions = Object.freeze([
  { value: "apiContractParity", label: "API contract parity", description: "Route and payload contracts match the persistent entity definition.", attribute: "Compatibility check" },
  { value: "persistenceSchemaParity", label: "Persistence schema parity", description: "Tables, columns, constraints, and indexes match the definition.", attribute: "Compatibility check" },
  { value: "dataDictionaryParity", label: "Data dictionary parity", description: "Human-readable data dictionary agrees with the definition.", attribute: "Compatibility check" },
  { value: "permissionMappingParity", label: "Permission mapping parity", description: "Permissions and grants agree with the definition.", attribute: "Compatibility check" },
  { value: "featureManifestParity", label: "Feature manifest parity", description: "Feature manifest seams and dependencies agree with the definition.", attribute: "Compatibility check" },
  { value: "generatedDocParity", label: "Generated doc parity", description: "Generated architecture and catalog docs agree with the definition.", attribute: "Compatibility check" },
  { value: "runtimeBehaviorParity", label: "Runtime behavior parity", description: "Observed runtime behavior matches the migrated definition.", attribute: "Compatibility check" },
]);

const entityManagementGenerationModeOptions = Object.freeze([
  "none",
  "previewOnly",
  "previewThenApply",
  "automatic",
  "manualOperational",
]);

const entityManagementGenerationOutputCategoryOptions = Object.freeze([
  { value: "docs", label: "Docs", description: "Source-independent documentation output.", attribute: "Allowed by default" },
  { value: "uiDefaults", label: "UI defaults", description: "Default UI configuration values.", attribute: "Allowed by default" },
  { value: "designSystemPreview", label: "Design-system preview", description: "Design-system-only preview surfaces.", attribute: "Allowed by default" },
  { value: "validationConfig", label: "Validation config", description: "Validation rule configuration drafts.", attribute: "Allowed by default" },
  { value: "searchConfig", label: "Search config", description: "Search operator and index posture drafts.", attribute: "Allowed by default" },
  { value: "capabilityMappingDraft", label: "Capability mapping draft", description: "Draft capability mapping artifacts.", attribute: "Allowed by default" },
  { value: "apiContractDraft", label: "API contract draft", description: "Draft API contract artifacts.", attribute: "Allowed by default" },
  { value: "testDraft", label: "Test draft", description: "Draft test-case or executable test scaffolds.", attribute: "Allowed by default" },
  { value: "runtimeSource", label: "Runtime source", description: "Runtime source-code generation.", attribute: "Blocked by default" },
  { value: "databaseMigration", label: "Database migration", description: "Database migration generation.", attribute: "Blocked by default" },
  { value: "authorizationLogic", label: "Authorization logic", description: "Authorization implementation generation.", attribute: "Blocked by default" },
  { value: "permissionGrant", label: "Permission grant", description: "Permission grant generation or mutation.", attribute: "Blocked by default" },
]);

const entityManagementCompliancePrivacyImpactOptions = Object.freeze([
  "none",
  "containsPII",
  "containsSensitivePII",
  "mixed",
]);

const entityManagementComplianceDeletePostureOptions = Object.freeze([
  "notDeletable",
  "softDelete",
  "softDeleteWithPendingDeletion",
  "hardDeleteEligible",
  "purgeOnlyWithApproval",
]);

const entityManagementComplianceExportPostureOptions = Object.freeze([
  "notExportable",
  "includedInStandardExport",
  "restrictedExport",
  "privacyReviewedExport",
]);

const entityManagementComplianceCleanupPostureOptions = Object.freeze([
  "notApplicable",
  "featureOwnedCleanup",
  "platformSchedulerCleanup",
  "manualOperationalCleanup",
  "externalResourceCleanup",
]);

const entityManagementComplianceEncryptionRequirementOptions = Object.freeze([
  "notRequired",
  "required",
]);

const entityManagementValidationRuleOptions = Object.freeze([
  { value: "trim", label: "trim", attribute: "validation.trim", description: "Remove extra spaces at the beginning or end." },
  { value: "lowercase", label: "lowercase", attribute: "validation.lowercase", description: "Use lowercase text." },
  { value: "uppercase", label: "uppercase", attribute: "validation.uppercase", description: "Use uppercase text." },
  { value: "minLength", label: "minLength", attribute: "validation.minLength", description: "Must be at least {minLength} characters." },
  { value: "maxLength", label: "maxLength", attribute: "validation.maxLength", description: "Must be {maxLength} characters or fewer." },
  { value: "pattern", label: "pattern", attribute: "validation.pattern", description: "Enter text in the required format." },
  { value: "allowedCharacters", label: "allowedCharacters", attribute: "validation.allowedCharacters", description: "Use only the allowed characters." },
  { value: "uuidFormat", label: "uuidFormat", attribute: "validation.uuidFormat", description: "Enter a valid identifier." },
  { value: "emailFormat", label: "emailFormat", attribute: "validation.emailFormat", description: "Enter a valid email address." },
  { value: "urlFormat", label: "urlFormat", attribute: "validation.urlFormat", description: "Enter a valid URL." },
  { value: "phoneNumberFormat", label: "phoneNumberFormat", attribute: "validation.phoneNumberFormat", description: "Enter a valid phone number." },
  { value: "countryCodeFormat", label: "countryCodeFormat", attribute: "validation.countryCodeFormat", description: "Enter a valid country code." },
  { value: "allowedCountryCode", label: "allowedCountryCode", attribute: "validation.allowedCountryCode", description: "Choose an allowed country." },
  { value: "timezoneFormat", label: "timezoneFormat", attribute: "validation.timezoneFormat", description: "Enter a valid time zone." },
  { value: "allowedTimezone", label: "allowedTimezone", attribute: "validation.allowedTimezone", description: "Choose an allowed time zone." },
  { value: "integerFormat", label: "integerFormat", attribute: "validation.integerFormat", description: "Enter a whole number." },
  { value: "decimalFormat", label: "decimalFormat", attribute: "validation.decimalFormat", description: "Enter a valid number." },
  { value: "moneyFormat", label: "moneyFormat", attribute: "validation.moneyFormat", description: "Enter a valid monetary amount." },
  { value: "minValue", label: "minValue", attribute: "validation.minValue", description: "Must be greater than or equal to {minValue}." },
  { value: "maxValue", label: "maxValue", attribute: "validation.maxValue", description: "Must be less than or equal to {maxValue}." },
  { value: "decimalPlaces", label: "decimalPlaces", attribute: "validation.decimalPlaces", description: "Use no more than {decimalPlaces} decimal places." },
  { value: "positiveOnly", label: "positiveOnly", attribute: "validation.positiveOnly", description: "Must be greater than zero." },
  { value: "nonNegative", label: "nonNegative", attribute: "validation.nonNegative", description: "Must be zero or greater." },
  { value: "currencyRequired", label: "currencyRequired", attribute: "validation.currencyRequired", description: "Choose a currency." },
  { value: "booleanFormat", label: "booleanFormat", attribute: "validation.booleanFormat", description: "Choose yes or no." },
  { value: "dateFormat", label: "dateFormat", attribute: "validation.dateFormat", description: "Enter a valid date." },
  { value: "dateTimeFormat", label: "dateTimeFormat", attribute: "validation.dateTimeFormat", description: "Enter a valid date and time." },
  { value: "dateRangeFormat", label: "dateRangeFormat", attribute: "validation.dateRangeFormat", description: "Enter a valid date range." },
  { value: "dateTimeRangeFormat", label: "dateTimeRangeFormat", attribute: "validation.dateTimeRangeFormat", description: "Enter a valid date and time range." },
  { value: "minDate", label: "minDate", attribute: "validation.minDate", description: "Date must be on or after {minDate}." },
  { value: "maxDate", label: "maxDate", attribute: "validation.maxDate", description: "Date must be on or before {maxDate}." },
  { value: "minDateTime", label: "minDateTime", attribute: "validation.minDateTime", description: "Date and time must be on or after {minDateTime}." },
  { value: "maxDateTime", label: "maxDateTime", attribute: "validation.maxDateTime", description: "Date and time must be on or before {maxDateTime}." },
  { value: "notInPast", label: "notInPast", attribute: "validation.notInPast", description: "Must not be in the past." },
  { value: "notInFuture", label: "notInFuture", attribute: "validation.notInFuture", description: "Must not be in the future." },
  { value: "startBeforeEnd", label: "startBeforeEnd", attribute: "validation.startBeforeEnd", description: "Start must be before end." },
  { value: "maxDuration", label: "maxDuration", attribute: "validation.maxDuration", description: "Duration must be {maxDuration} or shorter." },
  { value: "allowedOptions", label: "allowedOptions", attribute: "validation.allowedOptions", description: "Choose one of the allowed options." },
  { value: "optionCatalogRequired", label: "optionCatalogRequired", attribute: "validation.optionCatalogRequired", description: "Choose an option from the approved catalog." },
  { value: "minItems", label: "minItems", attribute: "validation.minItems", description: "Choose at least {minItems} item(s)." },
  { value: "maxItems", label: "maxItems", attribute: "validation.maxItems", description: "Choose no more than {maxItems} item(s)." },
  { value: "uniqueItems", label: "uniqueItems", attribute: "validation.uniqueItems", description: "Each selected item must be unique." },
  { value: "targetExists", label: "targetExists", attribute: "validation.targetExists", description: "Choose a valid related record." },
  { value: "relationshipBoundary", label: "relationshipBoundary", attribute: "validation.relationshipBoundary", description: "Choose a related record within the allowed boundary." },
  { value: "allowedTargetStatus", label: "allowedTargetStatus", attribute: "validation.allowedTargetStatus", description: "Choose a related record with an allowed status." },
  { value: "allowedMimeTypes", label: "allowedMimeTypes", attribute: "validation.allowedMimeTypes", description: "Choose an allowed file type." },
  { value: "maxFileSize", label: "maxFileSize", attribute: "validation.maxFileSize", description: "File must be {maxFileSize} or smaller." },
  { value: "maxFileCount", label: "maxFileCount", attribute: "validation.maxFileCount", description: "Choose no more than {maxFileCount} file(s)." },
  { value: "jsonShape", label: "jsonShape", attribute: "validation.jsonShape", description: "Enter structured data in the required shape." },
]);

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

function renderEntityManagementRobotIcon() {
  return `
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M12 5V3" />
      <path d="M8 9h8a4 4 0 0 1 4 4v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a4 4 0 0 1 4-4Z" />
      <path d="M9 14h.01" />
      <path d="M15 14h.01" />
      <path d="M9.5 17h5" />
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

function renderEntityManagementAiButton(label) {
  return `
    <button
      class="entity-management-ai-button"
      type="button"
      aria-label="Open AI options for ${escapeHtml(label)}"
      title="AI options"
      data-record-management-ai-button
    >
      <span aria-hidden="true">${renderEntityManagementRobotIcon()}</span>
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

function clampRecordManagementNestedListWidth(width) {
  return Math.min(
    recordManagementNestedListResize.max,
    Math.max(recordManagementNestedListResize.min, width),
  );
}

function setRecordManagementNestedListWidth(nestedList, width) {
  nestedList.style.setProperty("--record-management-secondary-nav-width", `${clampRecordManagementNestedListWidth(width)}px`);
}

function getRecordManagementNestedListWidth(nestedList) {
  const cards = nestedList.querySelector(".record-management-nested-list-cards");
  if (cards instanceof HTMLElement) {
    return cards.getBoundingClientRect().width;
  }
  return 224;
}

function initializeNestedListResizer(nestedList) {
  const resizer = nestedList.querySelector("[data-record-management-nested-resizer]");
  if (!(nestedList instanceof HTMLElement) || !(resizer instanceof HTMLElement)) {
    return;
  }

  const resizeBy = (delta) => {
    const nextWidth = getRecordManagementNestedListWidth(nestedList) + delta;
    setRecordManagementNestedListWidth(nestedList, nextWidth);
  };

  resizer.addEventListener("keydown", (event) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      resizeBy(-recordManagementNestedListResize.step);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      resizeBy(recordManagementNestedListResize.step);
    }
    if (event.key === "Home") {
      event.preventDefault();
      setRecordManagementNestedListWidth(nestedList, recordManagementNestedListResize.min);
    }
    if (event.key === "End") {
      event.preventDefault();
      setRecordManagementNestedListWidth(nestedList, recordManagementNestedListResize.max);
    }
  });

  resizer.addEventListener("pointerdown", (event) => {
    if (!(event instanceof PointerEvent) || event.button !== 0) {
      return;
    }
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = getRecordManagementNestedListWidth(nestedList);
    nestedList.dataset.recordManagementNestedResizing = "true";
    resizer.setPointerCapture(event.pointerId);

    const handlePointerMove = (moveEvent) => {
      setRecordManagementNestedListWidth(nestedList, startWidth + moveEvent.clientX - startX);
    };
    const handlePointerEnd = (endEvent) => {
      nestedList.dataset.recordManagementNestedResizing = "false";
      if (resizer.hasPointerCapture(endEvent.pointerId)) {
        resizer.releasePointerCapture(endEvent.pointerId);
      }
      resizer.removeEventListener("pointermove", handlePointerMove);
      resizer.removeEventListener("pointerup", handlePointerEnd);
      resizer.removeEventListener("pointercancel", handlePointerEnd);
    };

    resizer.addEventListener("pointermove", handlePointerMove);
    resizer.addEventListener("pointerup", handlePointerEnd);
    resizer.addEventListener("pointercancel", handlePointerEnd);
  });
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
        const aiToggle = drawer.querySelector("[data-record-management-ai-mode-toggle]");
        drawer.dataset.recordManagementEditMode = "false";
        drawer.dataset.recordManagementAiMode = "false";
        closeRecordManagementAiDrawer(drawer);
        if (editToggle instanceof HTMLElement) {
          editToggle.setAttribute("aria-pressed", "false");
        }
        if (aiToggle instanceof HTMLElement) {
          aiToggle.setAttribute("aria-pressed", "false");
        }
      } else {
        closeRecordManagementEvidenceDrawer(drawer);
      }
      if (nextMode) {
        drawer.querySelector("[data-record-management-evidence-button]")?.focus();
      }
      return;
    }

    const aiModeToggle = event.target instanceof Element
      ? event.target.closest("[data-record-management-ai-mode-toggle]")
      : null;
    if (aiModeToggle instanceof HTMLElement) {
      const nextMode = drawer.dataset.recordManagementAiMode !== "true";
      const evidenceToggle = drawer.querySelector("[data-record-management-evidence-mode-toggle]");
      drawer.dataset.recordManagementAiMode = String(nextMode);
      drawer.dataset.recordManagementEditMode = "false";
      aiModeToggle.setAttribute("aria-pressed", String(nextMode));
      if (nextMode) {
        drawer.dataset.recordManagementEvidenceMode = "false";
        closeRecordManagementEvidenceDrawer(drawer);
        if (evidenceToggle instanceof HTMLElement) {
          evidenceToggle.setAttribute("aria-pressed", "false");
        }
        drawer.querySelector("[data-record-management-ai-button]")?.focus();
      } else {
        closeRecordManagementAiDrawer(drawer);
      }
      return;
    }

    const aiButton = event.target instanceof Element
      ? event.target.closest("[data-record-management-ai-button]")
      : null;
    if (aiButton instanceof HTMLElement) {
      const guidanceTarget = aiButton.closest("[data-entity-management-evidence-target]");
      const entityWorkspace = drawer.closest("[data-chat-workspace-entity-workspace]");
      if (guidanceTarget instanceof HTMLElement && entityWorkspace instanceof HTMLElement) {
        renderRecordManagementAiGuidanceDrawer({
          drawer,
          entityWorkspace,
          guidance: getEntityManagementAuthoringGuidanceFromTarget(guidanceTarget),
        });
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

    const aiReturn = event.target instanceof Element
      ? event.target.closest("[data-record-management-ai-return]")
      : null;
    if (aiReturn instanceof HTMLElement) {
      closeRecordManagementAiDrawer(drawer);
      return;
    }

    const sectionToggle = event.target instanceof Element
      ? event.target.closest("[data-entity-management-section-toggle]")
      : null;
    if (sectionToggle instanceof HTMLElement) {
      const section = sectionToggle.closest("[data-entity-management-view-section]");
      const sectionDefinition = sectionToggle.closest("[data-entity-management-view-definition], [data-entity-management-workflow-definition], [data-entity-management-attribute-definition], [data-entity-management-catalog-definition], [data-entity-management-placement-definition], [data-entity-management-action-model-definition], [data-entity-management-permission-definition]");
      const body = sectionToggle.getAttribute("aria-controls")
        ? drawer.querySelector(`#${CSS.escape(sectionToggle.getAttribute("aria-controls") ?? "")}`)
        : section?.querySelector("[data-entity-management-section-body]");
      const isExpanded = sectionToggle.getAttribute("aria-expanded") !== "false";
      if (!isExpanded && sectionDefinition instanceof HTMLElement) {
        sectionDefinition.querySelectorAll("[data-entity-management-section-toggle]").forEach((toggle) => {
          if (toggle instanceof HTMLElement) {
            toggle.setAttribute("aria-expanded", "false");
          }
        });
        sectionDefinition.querySelectorAll("[data-entity-management-section-body]").forEach((sectionBody) => {
          if (sectionBody instanceof HTMLElement) {
            sectionBody.hidden = true;
          }
        });
      }
      sectionToggle.setAttribute("aria-expanded", String(!isExpanded));
      if (body instanceof HTMLElement) {
        body.hidden = isExpanded;
        if (!isExpanded) {
          body.querySelectorAll("[data-entity-management-workflow-builder]").forEach((builder) => {
            if (builder instanceof HTMLElement) {
              syncEntityManagementWorkflowSubworkflowControls(builder);
            }
          });
        }
      }
      const nestedDrawer = sectionToggle.closest(".record-management-nested-list-drawer");
      if (nestedDrawer instanceof HTMLElement) {
        nestedDrawer.dataset.entityManagementExpandedSection = String(!isExpanded);
      }
      return;
    }

    const workflowStatusAdd = event.target instanceof Element
      ? event.target.closest("[data-entity-management-workflow-status-add]")
      : null;
    if (workflowStatusAdd instanceof HTMLElement) {
      const builder = workflowStatusAdd.closest("[data-entity-management-workflow-builder]");
      const currentRow = workflowStatusAdd.closest("[data-entity-management-workflow-status-row]");
      const list = builder?.querySelector("[data-entity-management-workflow-status-list]");
      if (builder instanceof HTMLElement && list instanceof HTMLElement) {
        const workflowKey = builder.dataset.entityManagementWorkflowBuilder ?? "workflow";
        const nextNumber = list.querySelectorAll("[data-entity-management-workflow-status-row]").length + 1;
        const statusNames = getEntityManagementWorkflowStatusNames(builder);
        const nextMarkup = renderEntityManagementWorkflowStatusRow({
          index: nextNumber - 1,
          isCreate: false,
          name: `Status ${nextNumber}`,
          parentStatus: getEntityManagementWorkflowInheritedParentStatus({ builder, currentRow }),
          statuses: [...statusNames, `Status ${nextNumber}`],
          workflowKey,
        });
        let insertedRow = null;
        if (currentRow instanceof HTMLElement) {
          currentRow.insertAdjacentHTML("afterend", nextMarkup);
          insertedRow = currentRow.nextElementSibling;
        } else {
          list.insertAdjacentHTML("beforeend", nextMarkup);
          insertedRow = list.lastElementChild;
        }
        initializeFormDrawerSelects({ scope: insertedRow instanceof HTMLElement ? insertedRow : list });
        syncEntityManagementWorkflowStatusBuilder(builder);
        const input = insertedRow instanceof HTMLElement
          ? insertedRow.querySelector("[data-entity-management-workflow-status-name]")
          : list.querySelector("[data-entity-management-workflow-status-row]:last-child input");
        if (input instanceof HTMLInputElement) {
          input.focus();
          input.select();
        }
      }
      return;
    }

    const validationRuleAdd = event.target instanceof Element
      ? event.target.closest("[data-entity-management-validation-rule-add]")
      : null;
    if (validationRuleAdd instanceof HTMLElement) {
      const rule = validationRuleAdd.closest("[data-entity-management-validation-rule]");
      const sectionBody = validationRuleAdd.closest("[data-entity-management-section-body]");
      const attributeDefinition = validationRuleAdd.closest("[data-entity-management-attribute-definition]");
      if (sectionBody instanceof HTMLElement && attributeDefinition instanceof HTMLElement) {
        const attributeName = attributeDefinition.dataset.entityManagementAttributeDefinition ?? "attribute";
        const nextRule = {
          ruleKey: "",
          argumentType: "",
          argumentValue: "",
          messageKey: "",
          messageFallback: "",
        };
        const nextIndex = sectionBody.querySelectorAll("[data-entity-management-validation-rule]").length;
        const markup = renderEntityManagementValidationRule({ attributeName, index: nextIndex, rule: nextRule });
        if (rule instanceof HTMLElement) {
          rule.insertAdjacentHTML("afterend", markup);
        } else {
          sectionBody.insertAdjacentHTML("beforeend", markup);
        }
        const insertedRule = rule instanceof HTMLElement ? rule.nextElementSibling : sectionBody.lastElementChild;
        initializeFormDrawerSelects({ scope: insertedRule instanceof HTMLElement ? insertedRule : sectionBody });
        syncEntityManagementValidationRules(sectionBody);
        const ruleKeyButton = insertedRule instanceof HTMLElement
          ? insertedRule.querySelector("[data-entity-management-validation-rule-key] [data-form-drawer-select-button]")
          : null;
        if (ruleKeyButton instanceof HTMLButtonElement) {
          ruleKeyButton.focus();
        }
      }
      return;
    }

    const validationRuleCopy = event.target instanceof Element
      ? event.target.closest("[data-entity-management-validation-rule-copy]")
      : null;
    if (validationRuleCopy instanceof HTMLElement) {
      const rule = validationRuleCopy.closest("[data-entity-management-validation-rule]");
      const sectionBody = validationRuleCopy.closest("[data-entity-management-section-body]");
      const attributeDefinition = validationRuleCopy.closest("[data-entity-management-attribute-definition]");
      if (rule instanceof HTMLElement && sectionBody instanceof HTMLElement && attributeDefinition instanceof HTMLElement) {
        const attributeName = attributeDefinition.dataset.entityManagementAttributeDefinition ?? "attribute";
        const nextIndex = sectionBody.querySelectorAll("[data-entity-management-validation-rule]").length;
        const markup = renderEntityManagementValidationRule({
          attributeName,
          index: nextIndex,
          rule: readEntityManagementValidationRule(rule),
        });
        rule.insertAdjacentHTML("afterend", markup);
        const insertedRule = rule.nextElementSibling;
        initializeFormDrawerSelects({ scope: insertedRule instanceof HTMLElement ? insertedRule : sectionBody });
        syncEntityManagementValidationRules(sectionBody);
      }
      return;
    }

    const validationRuleRemove = event.target instanceof Element
      ? event.target.closest("[data-entity-management-validation-rule-remove]")
      : null;
    if (validationRuleRemove instanceof HTMLElement) {
      const rule = validationRuleRemove.closest("[data-entity-management-validation-rule]");
      const sectionBody = validationRuleRemove.closest("[data-entity-management-section-body]");
      if (rule instanceof HTMLElement && sectionBody instanceof HTMLElement) {
        rule.remove();
        syncEntityManagementValidationRules(sectionBody);
      }
      return;
    }

    const validationRuleKeyOption = event.target instanceof Element
      ? event.target.closest("[data-entity-management-validation-rule-key] [data-form-drawer-select-option], [data-entity-management-validation-rule-key] [data-form-drawer-select-remove]")
      : null;
    if (validationRuleKeyOption instanceof HTMLElement) {
      const rule = validationRuleKeyOption.closest("[data-entity-management-validation-rule]");
      window.requestAnimationFrame(() => syncEntityManagementValidationRuleFromRuleKey(rule));
      return;
    }

    const permissionFamilyToggle = event.target instanceof Element
      ? event.target.closest("[data-entity-management-permission-family-toggle]")
      : null;
    if (permissionFamilyToggle instanceof HTMLInputElement) {
      const family = permissionFamilyToggle.closest("[data-entity-management-permission-family]");
      if (family instanceof HTMLElement) {
        syncEntityManagementPermissionFamily(family);
      }
      return;
    }

    const permissionCapabilityBulk = event.target instanceof Element
      ? event.target.closest("[data-entity-management-permission-bulk]")
      : null;
    if (permissionCapabilityBulk instanceof HTMLElement) {
      const family = permissionCapabilityBulk.closest("[data-entity-management-permission-family]");
      const action = permissionCapabilityBulk.dataset.entityManagementPermissionBulk;
      const shouldSelect = action === "select";
      if (family instanceof HTMLElement) {
        const familyToggle = family.querySelector("[data-entity-management-permission-family-toggle]");
        if (familyToggle instanceof HTMLInputElement && !familyToggle.checked) {
          familyToggle.checked = true;
        }
        family.querySelectorAll("[data-entity-management-permission-capability-toggle]").forEach((toggle) => {
          if (toggle instanceof HTMLElement) {
            toggle.setAttribute("aria-pressed", String(shouldSelect));
          }
        });
        syncEntityManagementPermissionFamily(family);
      }
      return;
    }

    const permissionCapabilityToggle = event.target instanceof Element
      ? event.target.closest("[data-entity-management-permission-capability-toggle]")
      : null;
    if (permissionCapabilityToggle instanceof HTMLElement) {
      const isAvailable = permissionCapabilityToggle.getAttribute("aria-pressed") !== "false";
      permissionCapabilityToggle.setAttribute("aria-pressed", String(!isAvailable));
      syncEntityManagementPermissionFamily(permissionCapabilityToggle.closest("[data-entity-management-permission-family]"));
      return;
    }

    const permissionRoleOption = event.target instanceof Element
      ? event.target.closest("[data-entity-management-view-drawer-select$='PermissionRole'] [data-form-drawer-select-option], [data-entity-management-view-drawer-select$='PermissionRole'] [data-form-drawer-select-remove]")
      : null;
    if (permissionRoleOption instanceof HTMLElement) {
      const field = permissionRoleOption.closest("[data-entity-management-view-drawer-select$='PermissionRole']");
      const input = field?.querySelector("[data-form-drawer-select-value]");
      if (input instanceof HTMLInputElement) {
        window.requestAnimationFrame(() => syncEntityManagementPermissionCardCopy(input));
      }
      return;
    }

    const viewWorkflowOption = event.target instanceof Element
      ? event.target.closest("[data-entity-management-view-drawer-select$='Workflow'] [data-form-drawer-select-option], [data-entity-management-view-drawer-select$='Workflow'] [data-form-drawer-select-remove]")
      : null;
    if (viewWorkflowOption instanceof HTMLElement) {
      const field = viewWorkflowOption.closest("[data-entity-management-view-drawer-select$='Workflow']");
      if (field instanceof HTMLElement) {
        window.requestAnimationFrame(() => syncEntityManagementViewWorkflowStatusVisibility(field));
      }
      return;
    }

    const placementSecondaryNavEntityOption = event.target instanceof Element
      ? event.target.closest("[data-entity-management-placement-secondary-nav-source] [data-form-drawer-select-option], [data-entity-management-placement-secondary-nav-source] [data-form-drawer-select-remove]")
      : null;
    if (placementSecondaryNavEntityOption instanceof HTMLElement) {
      const placementDefinition = placementSecondaryNavEntityOption.closest("[data-entity-management-placement-definition]");
      if (placementDefinition instanceof HTMLElement) {
        window.requestAnimationFrame(() => syncEntityManagementPlacementAttributeSource(placementDefinition));
      }
      return;
    }

    const viewPageTemplateOption = event.target instanceof Element
      ? event.target.closest("[data-entity-management-view-drawer-select$='PageTemplate'] [data-form-drawer-select-option], [data-entity-management-view-drawer-select$='PageTemplate'] [data-form-drawer-select-remove]")
      : null;
    if (viewPageTemplateOption instanceof HTMLElement) {
      const viewDefinition = viewPageTemplateOption.closest("[data-entity-management-view-definition]");
      if (viewDefinition instanceof HTMLElement) {
        window.requestAnimationFrame(() => syncEntityManagementViewDisplayTemplateSettings(viewDefinition));
      }
      return;
    }

    const viewStatusToggle = event.target instanceof Element
      ? event.target.closest("[data-entity-management-view-workflow-status-toggle]")
      : null;
    if (viewStatusToggle instanceof HTMLElement) {
      const isVisible = viewStatusToggle.getAttribute("aria-pressed") !== "false";
      viewStatusToggle.setAttribute("aria-pressed", String(!isVisible));
      viewStatusToggle.classList.toggle("is-hidden", isVisible);
      syncEntityManagementViewWorkflowStatusInput(viewStatusToggle.closest("[data-entity-management-view-workflow-statuses]"));
      return;
    }

    const viewActionToggle = event.target instanceof Element
      ? event.target.closest("[data-entity-management-view-action-toggle]")
      : null;
    if (viewActionToggle instanceof HTMLElement) {
      const isSelected = viewActionToggle.getAttribute("aria-pressed") === "true";
      viewActionToggle.setAttribute("aria-pressed", String(!isSelected));
      syncEntityManagementViewActionSelector(viewActionToggle.closest("[data-entity-management-view-action-selector]"));
      return;
    }

    const viewAttributeToggle = event.target instanceof Element
      ? event.target.closest("[data-entity-management-view-attribute-toggle]")
      : null;
    if (viewAttributeToggle instanceof HTMLElement) {
      const isSelected = viewAttributeToggle.getAttribute("aria-pressed") === "true";
      viewAttributeToggle.setAttribute("aria-pressed", String(!isSelected));
      syncEntityManagementViewAttributeSelector(viewAttributeToggle.closest("[data-entity-management-view-attribute-selector]"));
      return;
    }

    const viewPlacementToggle = event.target instanceof Element
      ? event.target.closest("[data-entity-management-view-placement-toggle]")
      : null;
    if (viewPlacementToggle instanceof HTMLElement) {
      const isVisible = viewPlacementToggle.getAttribute("aria-pressed") === "true";
      viewPlacementToggle.setAttribute("aria-pressed", String(!isVisible));
      syncEntityManagementViewPlacementSelector(viewPlacementToggle.closest("[data-entity-management-view-placement-selector]"));
      return;
    }

    const placementSectionMove = event.target instanceof Element
      ? event.target.closest("[data-entity-management-placement-section-move]")
      : null;
    if (placementSectionMove instanceof HTMLElement) {
      const row = placementSectionMove.closest("[data-entity-management-placement-attribute-section]");
      const builder = placementSectionMove.closest("[data-entity-management-placement-attribute-builder]");
      const direction = placementSectionMove.dataset.entityManagementPlacementSectionMove;
      if (row instanceof HTMLElement && builder instanceof HTMLElement) {
        if (direction === "up") {
          const previous = row.previousElementSibling;
          if (previous instanceof HTMLElement && previous.matches("[data-entity-management-placement-attribute-section]")) {
            previous.before(row);
          }
        }
        if (direction === "down") {
          const next = row.nextElementSibling;
          if (next instanceof HTMLElement && next.matches("[data-entity-management-placement-attribute-section]")) {
            next.after(row);
          }
        }
        syncEntityManagementPlacementAttributeSections(builder);
      }
      return;
    }

    const placementSectionRemove = event.target instanceof Element
      ? event.target.closest("[data-entity-management-placement-section-remove]")
      : null;
    if (placementSectionRemove instanceof HTMLElement) {
      const row = placementSectionRemove.closest("[data-entity-management-placement-attribute-section]");
      const builder = placementSectionRemove.closest("[data-entity-management-placement-attribute-builder]");
      if (row instanceof HTMLElement && builder instanceof HTMLElement && builder.querySelectorAll("[data-entity-management-placement-attribute-section]").length > 1) {
        row.remove();
        syncEntityManagementPlacementAttributeSections(builder);
      }
      return;
    }

    const placementSectionAdd = event.target instanceof Element
      ? event.target.closest("[data-entity-management-placement-section-add]")
      : null;
    if (placementSectionAdd instanceof HTMLElement) {
      const row = placementSectionAdd.closest("[data-entity-management-placement-attribute-section]");
      const builder = placementSectionAdd.closest("[data-entity-management-placement-attribute-builder]");
      if (builder instanceof HTMLElement) {
        const placementDefinition = builder.closest("[data-entity-management-placement-definition]");
        const entityKey = getEntityManagementPlacementAttributeSource(placementDefinition);
        const nextIndex = builder.querySelectorAll("[data-entity-management-placement-attribute-section]").length;
        const placementKey = builder.dataset.entityManagementPlacementAttributeBuilder ?? "placement";
        const markup = renderEntityManagementPlacementAttributeSectionRow({
          entityKey,
          index: nextIndex,
          placementKey,
          section: {
            label: `Section ${nextIndex + 1}`,
            attributes: getEntityManagementPlacementAttributeDefaults(entityKey),
          },
        });
        if (row instanceof HTMLElement) {
          row.insertAdjacentHTML("afterend", markup);
        } else {
          builder.insertAdjacentHTML("beforeend", markup);
        }
        syncEntityManagementPlacementAttributeSections(builder);
      }
      return;
    }

    const workflowStatusMove = event.target instanceof Element
      ? event.target.closest("[data-entity-management-workflow-status-move]")
      : null;
    if (workflowStatusMove instanceof HTMLElement) {
      const row = workflowStatusMove.closest("[data-entity-management-workflow-status-row]");
      const builder = workflowStatusMove.closest("[data-entity-management-workflow-builder]");
      const direction = workflowStatusMove.dataset.entityManagementWorkflowStatusMove;
      if (row instanceof HTMLElement && builder instanceof HTMLElement && row.dataset.statusLocation !== "create") {
        if (direction === "up") {
          const previous = row.previousElementSibling;
          if (previous instanceof HTMLElement && previous.matches("[data-entity-management-workflow-status-row]") && previous.dataset.statusLocation !== "create") {
            previous.before(row);
          }
        }
        if (direction === "down") {
          const next = row.nextElementSibling;
          if (next instanceof HTMLElement && next.matches("[data-entity-management-workflow-status-row]")) {
            next.after(row);
          }
        }
        syncEntityManagementWorkflowStatusBuilder(builder);
      }
      return;
    }

    const workflowStatusRemove = event.target instanceof Element
      ? event.target.closest("[data-entity-management-workflow-status-remove]")
      : null;
    if (workflowStatusRemove instanceof HTMLElement) {
      const row = workflowStatusRemove.closest("[data-entity-management-workflow-status-row]");
      const builder = workflowStatusRemove.closest("[data-entity-management-workflow-builder]");
      if (row instanceof HTMLElement && builder instanceof HTMLElement && row.dataset.statusLocation !== "create") {
        row.remove();
        syncEntityManagementWorkflowStatusBuilder(builder);
      }
      return;
    }

    const catalogOptionMove = event.target instanceof Element
      ? event.target.closest("[data-entity-management-catalog-option-move]")
      : null;
    if (catalogOptionMove instanceof HTMLElement) {
      const row = catalogOptionMove.closest("[data-entity-management-catalog-option-row]");
      const builder = catalogOptionMove.closest("[data-entity-management-catalog-builder]");
      const direction = catalogOptionMove.dataset.entityManagementCatalogOptionMove;
      if (row instanceof HTMLElement && builder instanceof HTMLElement) {
        if (direction === "up") {
          const previous = row.previousElementSibling;
          if (previous instanceof HTMLElement && previous.matches("[data-entity-management-catalog-option-row]")) {
            previous.before(row);
          }
        }
        if (direction === "down") {
          const next = row.nextElementSibling;
          if (next instanceof HTMLElement && next.matches("[data-entity-management-catalog-option-row]")) {
            next.after(row);
          }
        }
        syncEntityManagementCatalogBuilder(builder);
      }
      return;
    }

    const catalogOptionRemove = event.target instanceof Element
      ? event.target.closest("[data-entity-management-catalog-option-remove]")
      : null;
    if (catalogOptionRemove instanceof HTMLElement) {
      const row = catalogOptionRemove.closest("[data-entity-management-catalog-option-row]");
      const builder = catalogOptionRemove.closest("[data-entity-management-catalog-builder]");
      if (row instanceof HTMLElement && builder instanceof HTMLElement) {
        row.remove();
        syncEntityManagementCatalogBuilder(builder);
      }
      return;
    }

    const catalogOptionAdd = event.target instanceof Element
      ? event.target.closest("[data-entity-management-catalog-option-add]")
      : null;
    if (catalogOptionAdd instanceof HTMLElement) {
      const builder = catalogOptionAdd.closest("[data-entity-management-catalog-builder]");
      const currentRow = catalogOptionAdd.closest("[data-entity-management-catalog-option-row]");
      const list = builder?.querySelector("[data-entity-management-catalog-option-list]");
      if (builder instanceof HTMLElement && list instanceof HTMLElement) {
        const catalogKey = builder.dataset.entityManagementCatalogBuilder ?? "catalog";
        const nextNumber = list.querySelectorAll("[data-entity-management-catalog-option-row]").length + 1;
        const markup = renderEntityManagementCatalogOptionRow({
          catalogKey,
          index: nextNumber - 1,
          option: { label: `Option ${nextNumber}`, value: `option_${nextNumber}` },
        });
        let insertedRow = null;
        if (currentRow instanceof HTMLElement) {
          currentRow.insertAdjacentHTML("afterend", markup);
          insertedRow = currentRow.nextElementSibling;
        } else {
          list.insertAdjacentHTML("beforeend", markup);
          insertedRow = list.lastElementChild;
        }
        syncEntityManagementCatalogBuilder(builder);
        const input = insertedRow instanceof HTMLElement
          ? insertedRow.querySelector("[data-entity-management-catalog-option-label]")
          : null;
        if (input instanceof HTMLInputElement) {
          input.focus();
          input.select();
        }
      }
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
      const aiToggle = drawer.querySelector("[data-record-management-ai-mode-toggle]");
      drawer.dataset.recordManagementEvidenceMode = "false";
      drawer.dataset.recordManagementAiMode = "false";
      closeRecordManagementAiDrawer(drawer);
      closeRecordManagementEvidenceDrawer(drawer);
      if (evidenceToggle instanceof HTMLElement) {
        evidenceToggle.setAttribute("aria-pressed", "false");
      }
      if (aiToggle instanceof HTMLElement) {
        aiToggle.setAttribute("aria-pressed", "false");
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
    initializeNestedListResizer(nestedList);
    nestedList.addEventListener("click", (event) => {
      const addButton = event.target instanceof Element
        ? event.target.closest("[data-record-management-nested-add]")
        : null;
      if (addButton instanceof HTMLElement && nestedList.closest("[data-record-management-region-panel='workflows']")) {
        addEntityManagementWorkflowRecord({ nestedList });
        return;
      }
      if (addButton instanceof HTMLElement && nestedList.closest("[data-record-management-region-panel='catalogs']")) {
        addEntityManagementCatalogRecord({ nestedList });
        return;
      }
      if (addButton instanceof HTMLElement && nestedList.closest("[data-record-management-region-panel='permissions']")) {
        addEntityManagementPermissionRecord({ nestedList });
        syncEntityManagementViewRoleOptions(drawer);
        return;
      }

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
      activateNestedListItem(nestedList, key);
    });
  });

  drawer.addEventListener("click", (event) => {
    const copyButton = event.target instanceof Element
      ? event.target.closest("[data-entity-management-workflow-copy]")
      : null;
    if (copyButton instanceof HTMLElement) {
      const panel = copyButton.closest("[data-record-management-nested-panel]");
      const nestedList = copyButton.closest("[data-record-management-nested-list]");
      if (panel instanceof HTMLElement && nestedList instanceof HTMLElement) {
        addEntityManagementWorkflowRecord({ nestedList, sourcePanel: panel });
      }
      return;
    }

    const deleteButton = event.target instanceof Element
      ? event.target.closest("[data-entity-management-workflow-delete]")
      : null;
    if (deleteButton instanceof HTMLElement) {
      const panel = deleteButton.closest("[data-record-management-nested-panel]");
      const nestedList = deleteButton.closest("[data-record-management-nested-list]");
      if (panel instanceof HTMLElement && nestedList instanceof HTMLElement) {
        removeEntityManagementWorkflowRecord({ nestedList, panel });
      }
      return;
    }

    const catalogCopyButton = event.target instanceof Element
      ? event.target.closest("[data-entity-management-catalog-copy]")
      : null;
    if (catalogCopyButton instanceof HTMLElement) {
      const panel = catalogCopyButton.closest("[data-record-management-nested-panel]");
      const nestedList = catalogCopyButton.closest("[data-record-management-nested-list]");
      if (panel instanceof HTMLElement && nestedList instanceof HTMLElement) {
        addEntityManagementCatalogRecord({ nestedList, sourcePanel: panel });
      }
      return;
    }

    const catalogDeleteButton = event.target instanceof Element
      ? event.target.closest("[data-entity-management-catalog-delete]")
      : null;
    if (catalogDeleteButton instanceof HTMLElement) {
      const panel = catalogDeleteButton.closest("[data-record-management-nested-panel]");
      const nestedList = catalogDeleteButton.closest("[data-record-management-nested-list]");
      if (panel instanceof HTMLElement && nestedList instanceof HTMLElement) {
        removeEntityManagementWorkflowRecord({ nestedList, panel });
      }
      return;
    }

    const permissionCopyButton = event.target instanceof Element
      ? event.target.closest("[data-entity-management-permission-copy]")
      : null;
    if (permissionCopyButton instanceof HTMLElement) {
      const panel = permissionCopyButton.closest("[data-record-management-nested-panel]");
      const nestedList = permissionCopyButton.closest("[data-record-management-nested-list]");
      if (panel instanceof HTMLElement && nestedList instanceof HTMLElement) {
        addEntityManagementPermissionRecord({ nestedList, sourcePanel: panel });
        syncEntityManagementViewRoleOptions(drawer);
      }
      return;
    }

    const permissionDeleteButton = event.target instanceof Element
      ? event.target.closest("[data-entity-management-permission-delete]")
      : null;
    if (permissionDeleteButton instanceof HTMLElement) {
      const panel = permissionDeleteButton.closest("[data-record-management-nested-panel]");
      const nestedList = permissionDeleteButton.closest("[data-record-management-nested-list]");
      if (panel instanceof HTMLElement && nestedList instanceof HTMLElement) {
        removeEntityManagementWorkflowRecord({ nestedList, panel });
        syncEntityManagementViewRoleOptions(drawer);
      }
      return;
    }

    const parentWorkflowOption = event.target instanceof Element
      ? event.target.closest("[data-entity-management-workflow-parent-select] [data-form-drawer-select-option]")
      : null;
    if (parentWorkflowOption instanceof HTMLElement) {
      const builder = parentWorkflowOption.closest("[data-entity-management-workflow-builder]");
      if (builder instanceof HTMLElement) {
        window.requestAnimationFrame(() => syncEntityManagementWorkflowSubworkflowControls(builder));
      }
      return;
    }

    const owningFeatureOption = event.target instanceof Element
      ? event.target.closest("[data-entity-management-owning-feature-key] [data-form-drawer-select-option], [data-entity-management-owning-feature-key] [data-form-drawer-select-remove]")
      : null;
    if (owningFeatureOption instanceof HTMLElement) {
      window.requestAnimationFrame(() => syncEntityManagementOwningFeatureDerivedFields(drawer));
    }
  });

  drawer.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
      return;
    }
    if (target.closest("[data-entity-management-validation-rule]")) {
      const sectionBody = target.closest("[data-entity-management-section-body]");
      if (sectionBody instanceof HTMLElement) {
        syncEntityManagementValidationRules(sectionBody);
      }
      return;
    }
    if (target.matches("[data-entity-management-workflow-status-name]")) {
      const builder = target.closest("[data-entity-management-workflow-builder]");
      if (builder instanceof HTMLElement) {
        syncEntityManagementWorkflowLinkOptions(builder);
      }
      return;
    }
    if (target.name.endsWith("CatalogName") || target.name.endsWith("CatalogDescription")) {
      syncEntityManagementCatalogCardCopy(target);
      return;
    }
    if (target.name.endsWith("PermissionRole")) {
      syncEntityManagementPermissionCardCopy(target);
      return;
    }
    if (target.matches("[data-entity-management-catalog-option-label]")) {
      const row = target.closest("[data-entity-management-catalog-option-row]");
      const valueInput = row?.querySelector("[data-entity-management-catalog-option-value]");
      if (valueInput instanceof HTMLInputElement) {
        valueInput.value = target.value
          .trim()
          .toLowerCase()
          .replaceAll(/[^a-z0-9]+/g, "_")
          .replaceAll(/^_+|_+$/g, "");
      }
      return;
    }
    if (!target.name.endsWith("WorkflowName") && !target.name.endsWith("WorkflowDescription")) {
      return;
    }
    syncEntityManagementWorkflowCardCopy(target);
  });

  drawer.addEventListener("change", (event) => {
    const subworkflowToggle = event.target instanceof Element
      ? event.target.closest("[data-entity-management-subworkflow-toggle]")
      : null;
    if (subworkflowToggle instanceof HTMLInputElement) {
      const builder = subworkflowToggle.closest("[data-entity-management-workflow-builder]");
      if (builder instanceof HTMLElement) {
        syncEntityManagementWorkflowSubworkflowControls(builder);
      }
      return;
    }

    const placementSecondaryNavToggle = event.target instanceof Element
      ? event.target.closest("[data-entity-management-placement-secondary-nav-toggle]")
      : null;
    if (placementSecondaryNavToggle instanceof HTMLInputElement) {
      const section = placementSecondaryNavToggle.closest("[data-entity-management-view-section]");
      const source = section?.querySelector("[data-entity-management-placement-secondary-nav-source]");
      if (source instanceof HTMLElement) {
        source.hidden = !placementSecondaryNavToggle.checked;
      }
      syncEntityManagementPlacementAttributeSource(placementSecondaryNavToggle.closest("[data-entity-management-placement-definition]"));
      return;
    }

    const target = event.target instanceof Element
      ? event.target.closest("[data-entity-management-feature-status]")
      : null;
    if (target instanceof HTMLInputElement) {
      syncEntityManagementOwningFeatureDerivedFields(drawer);
      return;
    }

    const privacyClassification = event.target instanceof Element
      ? event.target.closest("[data-entity-management-privacy-classification]")
      : null;
    if (privacyClassification instanceof HTMLSelectElement) {
      syncEntityManagementSensitivePrivacyCategoryField(privacyClassification);
      return;
    }

    const securityClassification = event.target instanceof Element
      ? event.target.closest("[data-entity-management-security-classification]")
      : null;
    if (securityClassification instanceof HTMLSelectElement) {
      syncEntityManagementSecurityLevelField(securityClassification);
      return;
    }

    const valueCardinality = event.target instanceof Element
      ? event.target.closest("[data-entity-management-value-cardinality]")
      : null;
    if (valueCardinality instanceof HTMLSelectElement) {
      syncEntityManagementItemLimitFields(valueCardinality);
      return;
    }

    const attributeSearchable = event.target instanceof Element
      ? event.target.closest("[data-entity-management-attribute-searchable]")
      : null;
    if (attributeSearchable instanceof HTMLInputElement) {
      syncEntityManagementAttributeSearchFields(attributeSearchable);
    }
  });
}

function syncEntityManagementOwningFeatureDerivedFields(drawer) {
  const selectedFeatureStatus = drawer.querySelector("[data-entity-management-feature-status]:checked");
  const owningFeatureKey = drawer.querySelector("[data-entity-management-owning-feature-key]");
  const owningFeatureInput = owningFeatureKey?.querySelector("[data-form-drawer-select-value]");
  const derivedFields = drawer.querySelector("[data-entity-management-owning-feature-derived-fields]");
  const hasExistingFeatureStatus = selectedFeatureStatus instanceof HTMLInputElement && selectedFeatureStatus.value === "existing";
  const hasOwningFeature = owningFeatureInput instanceof HTMLInputElement && owningFeatureInput.value.trim() !== "";
  if (owningFeatureKey instanceof HTMLElement) {
    owningFeatureKey.hidden = !hasExistingFeatureStatus;
  }
  if (derivedFields instanceof HTMLElement) {
    derivedFields.hidden = !(hasExistingFeatureStatus && hasOwningFeature);
  }
}

function syncEntityManagementSensitivePrivacyCategoryField(privacyClassification) {
  const attributeDefinition = privacyClassification.closest("[data-entity-management-attribute-definition]");
  const sensitiveCategoryField = attributeDefinition?.querySelector("[data-entity-management-sensitive-privacy-category-field]");
  const sensitiveCategorySelect = sensitiveCategoryField?.querySelector("select");
  const isSensitive = privacyClassification.value === "sensitive";
  if (sensitiveCategoryField instanceof HTMLElement) {
    sensitiveCategoryField.hidden = !isSensitive;
  }
  if (sensitiveCategorySelect instanceof HTMLSelectElement) {
    if (isSensitive) {
      sensitiveCategorySelect.setAttribute("required", "");
    } else {
      sensitiveCategorySelect.removeAttribute("required");
    }
  }
}

function syncEntityManagementSecurityLevelField(securityClassification) {
  const attributeDefinition = securityClassification.closest("[data-entity-management-attribute-definition]");
  const securityLevelField = attributeDefinition?.querySelector("[data-entity-management-security-level-field]");
  const securityLevelSelect = securityLevelField?.querySelector("select");
  const isClassified = securityClassification.value === "classified";
  if (securityLevelField instanceof HTMLElement) {
    securityLevelField.hidden = !isClassified;
  }
  if (securityLevelSelect instanceof HTMLSelectElement) {
    if (isClassified) {
      securityLevelSelect.setAttribute("required", "");
    } else {
      securityLevelSelect.removeAttribute("required");
    }
  }
}

function syncEntityManagementItemLimitFields(valueCardinality) {
  const attributeDefinition = valueCardinality.closest("[data-entity-management-attribute-definition]");
  const itemLimitFields = attributeDefinition?.querySelectorAll("[data-entity-management-item-limit-field]");
  const isMultiple = valueCardinality.value === "multiple";
  itemLimitFields?.forEach((field) => {
    if (!(field instanceof HTMLElement)) {
      return;
    }
    field.hidden = !isMultiple;
    if (!isMultiple) {
      const select = field.querySelector("select");
      if (select instanceof HTMLSelectElement) {
        select.value = "notApplicable";
      }
    }
  });
}

function syncEntityManagementAttributeSearchFields(searchableToggle) {
  const attributeDefinition = searchableToggle.closest("[data-entity-management-attribute-definition]");
  if (!(attributeDefinition instanceof HTMLElement)) {
    return;
  }
  const isSearchable = searchableToggle.checked;
  attributeDefinition.querySelectorAll("[data-entity-management-attribute-search-config-field]").forEach((field) => {
    if (field instanceof HTMLElement) {
      field.hidden = !isSearchable;
    }
  });
  const storageModel = attributeDefinition.querySelector("[data-entity-management-attribute-search-storage-model]");
  const indexPosture = attributeDefinition.querySelector("[data-entity-management-attribute-search-index-posture]");
  if (storageModel instanceof HTMLSelectElement && !isSearchable) {
    storageModel.value = "notSearchable";
  }
  if (indexPosture instanceof HTMLSelectElement && !isSearchable) {
    indexPosture.value = "notApplicable";
  }
}

function hasEntityManagementValidationArgumentPlaceholder(message) {
  return /\{[^{}]+\}/.test(String(message ?? ""));
}

function getEntityManagementValidationRuleOption(ruleKey) {
  return entityManagementValidationRuleOptions.find((option) => option.value === ruleKey);
}

function readEntityManagementValidationRule(rule) {
  const getValue = (suffix) => {
    const input = rule.querySelector(`input[name$="${suffix}"], textarea[name$="${suffix}"]`);
    return input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement ? input.value : "";
  };
  return {
    ruleKey: getValue("RuleKey"),
    argumentType: getValue("ArgumentType"),
    argumentValue: getValue("ArgumentValue"),
    messageKey: getValue("MessageKey"),
    messageFallback: getValue("MessageFallback"),
  };
}

function syncEntityManagementValidationRuleFromRuleKey(rule) {
  if (!(rule instanceof HTMLElement)) {
    return;
  }
  const sectionBody = rule.closest("[data-entity-management-section-body]");
  const ruleKeyInput = rule.querySelector('[data-entity-management-validation-rule-key] input[name$="RuleKey"]');
  const messageKeyInput = rule.querySelector('input[name$="MessageKey"]');
  const messageFallbackInput = rule.querySelector('textarea[name$="MessageFallback"]');
  const selectedOption = ruleKeyInput instanceof HTMLInputElement
    ? getEntityManagementValidationRuleOption(ruleKeyInput.value.trim())
    : null;

  if (messageKeyInput instanceof HTMLInputElement) {
    messageKeyInput.value = selectedOption?.attribute ?? "";
  }
  if (messageFallbackInput instanceof HTMLTextAreaElement) {
    messageFallbackInput.value = selectedOption?.description ?? "";
  }
  const hasArgument = hasEntityManagementValidationArgumentPlaceholder(selectedOption?.description);
  if (!hasArgument) {
    const argumentTypeInput = rule.querySelector('input[name$="ArgumentType"]');
    const argumentValueInput = rule.querySelector('input[name$="ArgumentValue"]');
    if (argumentTypeInput instanceof HTMLInputElement) {
      argumentTypeInput.value = "";
    }
    if (argumentValueInput instanceof HTMLInputElement) {
      argumentValueInput.value = "";
    }
  }
  if (sectionBody instanceof HTMLElement) {
    syncEntityManagementValidationRules(sectionBody);
  }
}

function syncEntityManagementValidationRules(sectionBody) {
  const attributeDefinition = sectionBody.closest("[data-entity-management-attribute-definition]");
  const attributeName = attributeDefinition instanceof HTMLElement
    ? attributeDefinition.dataset.entityManagementAttributeDefinition ?? "attribute"
    : "attribute";
  const rules = Array.from(sectionBody.querySelectorAll("[data-entity-management-validation-rule]"))
    .filter((rule) => rule instanceof HTMLElement);
  rules.forEach((rule, index) => {
    if (!(rule instanceof HTMLElement)) {
      return;
    }
    const ruleNumber = index + 1;
    const ruleKeyInput = rule.querySelector('input[name$="RuleKey"]');
    const summary = rule.querySelector("[data-entity-management-validation-rule-summary]");
    const title = rule.querySelector("[data-entity-management-validation-rule-title]");
    const ruleKeySelect = rule.querySelector("[data-entity-management-validation-rule-key] [data-form-drawer-select]");
    const ruleKey = ruleKeyInput instanceof HTMLInputElement ? ruleKeyInput.value.trim() : "";
    const messageFallbackInput = rule.querySelector('textarea[name$="MessageFallback"]');
    const selectedOption = getEntityManagementValidationRuleOption(ruleKey);
    const hasArgument = hasEntityManagementValidationArgumentPlaceholder(
      selectedOption?.description ?? (messageFallbackInput instanceof HTMLTextAreaElement ? messageFallbackInput.value : ""),
    );
    rule.dataset.entityManagementValidationRule = ruleKey || `rule-${ruleNumber}`;
    if (title instanceof HTMLElement) {
      title.textContent = `Validation rule ${ruleNumber}`;
    }
    if (summary instanceof HTMLElement) {
      summary.textContent = ruleKey || "New rule";
    }
    [
      ["RuleKey", "Rule key"],
      ["ArgumentType", "Argument type"],
      ["ArgumentValue", "Argument value"],
      ["MessageKey", "Message key"],
      ["MessageFallback", "Message fallback"],
    ].forEach(([suffix, label]) => {
      const control = rule.querySelector(`input[name$="${suffix}"], textarea[name$="${suffix}"]`);
      if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) {
        control.name = `${attributeName}AttributeValidation${ruleNumber}${suffix}`;
        control.id = `entity-management-${control.name}`;
        if (suffix === "RuleKey" && ruleKeySelect instanceof HTMLElement) {
          const selectedOption = getEntityManagementValidationRuleOption(control.value.trim());
          ruleKeySelect.id = `entity-management-${attributeName}-validation-${ruleNumber}-rule-key-select`;
          refreshFormDrawerSelect(ruleKeySelect);
          if (summary instanceof HTMLElement) {
            summary.textContent = selectedOption?.label ?? (control.value.trim() || "New rule");
          }
          return;
        }
        if (suffix === "ArgumentType" || suffix === "ArgumentValue") {
          const field = control.closest("[data-entity-management-validation-argument-field]");
          if (field instanceof HTMLElement) {
            field.hidden = !hasArgument;
          }
        }
        const field = control.closest(".form-field");
        const labelElement = field?.querySelector(".form-field-label");
        if (labelElement instanceof HTMLLabelElement) {
          labelElement.htmlFor = control.id;
          labelElement.textContent = label;
        }
      }
    });
  });
}

function syncEntityManagementWorkflowStatusBuilder(builder) {
  const workflowKey = builder.dataset.entityManagementWorkflowBuilder ?? "workflow";
  const rows = Array.from(builder.querySelectorAll("[data-entity-management-workflow-status-row]"))
    .filter((row) => row instanceof HTMLElement);
  const movableRows = rows.filter((row) => row instanceof HTMLElement && row.dataset.statusLocation !== "create");
  rows.forEach((row, index) => {
    if (!(row instanceof HTMLElement)) {
      return;
    }
    row.dataset.statusIndex = String(index);
    const nameInput = row.querySelector("[data-entity-management-workflow-status-name]");
    if (nameInput instanceof HTMLInputElement) {
      nameInput.name = `${workflowKey}Status${index}Name`;
      nameInput.id = `entity-management-${workflowKey}-status-${index}-name`;
    }
    const nameLabel = row.querySelector("[data-entity-management-workflow-status-name-label]");
    if (nameLabel instanceof HTMLLabelElement) {
      nameLabel.htmlFor = `entity-management-${workflowKey}-status-${index}-name`;
    }
    const linksInput = row.querySelector("[data-form-drawer-select-value]");
    if (linksInput instanceof HTMLInputElement) {
      linksInput.name = `${workflowKey}Status${index}LinksTo`;
    }
    row.querySelectorAll("[data-entity-management-workflow-status-detail-field]").forEach((field) => {
      if (!(field instanceof HTMLElement)) {
        return;
      }
      const suffix = field.dataset.entityManagementWorkflowStatusDetailField ?? "";
      if (!suffix) {
        return;
      }
      const control = field.querySelector("input, textarea");
      const label = field.querySelector(".form-field-label");
      const controlId = `entity-management-${workflowKey}-status-${index}-${suffix.toLowerCase()}`;
      if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) {
        control.name = `${workflowKey}Status${index}${suffix}`;
        control.id = controlId;
      }
      if (label instanceof HTMLLabelElement) {
        label.htmlFor = controlId;
      }
    });
  });
  syncEntityManagementWorkflowLinkOptions(builder);
  syncEntityManagementWorkflowSubworkflowControls(builder);
  movableRows.forEach((row, movableIndex) => {
    const upButton = row.querySelector("[data-entity-management-workflow-status-move='up']");
    const downButton = row.querySelector("[data-entity-management-workflow-status-move='down']");
    if (upButton instanceof HTMLButtonElement) {
      upButton.disabled = movableIndex === 0;
    }
    if (downButton instanceof HTMLButtonElement) {
      downButton.disabled = movableIndex === movableRows.length - 1;
    }
  });
}

function getEntityManagementWorkflowInheritedParentStatus({ builder, currentRow }) {
  const toggle = builder.querySelector("[data-entity-management-subworkflow-toggle]");
  if (!(toggle instanceof HTMLInputElement) || !toggle.checked) {
    return "status-0";
  }
  const sourceRow = currentRow instanceof HTMLElement
    ? currentRow
    : builder.querySelector("[data-entity-management-workflow-status-row]:last-child");
  const sourceInput = sourceRow?.querySelector("[data-entity-management-workflow-parent-status] [data-form-drawer-select-value]");
  return sourceInput instanceof HTMLInputElement && sourceInput.value
    ? sourceInput.value
    : "status-0";
}

function getEntityManagementWorkflowParentOptions(builder) {
  const nestedList = builder.closest("[data-record-management-nested-list]");
  const currentPanel = builder.closest("[data-record-management-nested-panel]");
  const currentKey = currentPanel instanceof HTMLElement ? currentPanel.dataset.recordManagementNestedPanel : "";
  if (!(nestedList instanceof HTMLElement)) {
    return [];
  }
  return Array.from(nestedList.querySelectorAll("[data-record-management-nested-trigger]"))
    .filter((trigger) => trigger instanceof HTMLElement && trigger.dataset.recordManagementNestedTrigger !== currentKey)
    .map((trigger) => ({
      value: trigger.dataset.recordManagementNestedTrigger ?? "",
      label: trigger.querySelector("strong")?.textContent?.trim() || "Untitled workflow",
      description: trigger.querySelector("small")?.textContent?.trim() || "Workflow definition",
      attribute: trigger.querySelector("em")?.textContent?.trim() || "Workflow",
    }))
    .filter((option) => option.value);
}

function getEntityManagementWorkflowParentStatusOptions(builder) {
  const nestedList = builder.closest("[data-record-management-nested-list]");
  const parentInput = builder.querySelector("[data-entity-management-workflow-parent-select] [data-form-drawer-select-value]");
  const parentKey = parentInput instanceof HTMLInputElement ? parentInput.value : "";
  const parentPanel = nestedList instanceof HTMLElement && parentKey
    ? nestedList.querySelector(`[data-record-management-nested-panel="${CSS.escape(parentKey)}"]`)
    : null;
  const parentStatuses = parentPanel instanceof HTMLElement
    ? readEntityManagementWorkflowStatusConfig(parentPanel)
    : [{ name: "Home" }];
  return parentStatuses.map((status, index) => ({
    value: `status-${index}`,
    label: status.name || (index === 0 ? "Home" : `Status ${index + 1}`),
    description: index === 0 ? "Base status in parent workflow" : "Parent workflow status",
    attribute: index === 0 ? "Base" : "Parent status",
  }));
}

function syncEntityManagementWorkflowSubworkflowControls(builder) {
  const workflowKey = builder.dataset.entityManagementWorkflowBuilder ?? "workflow";
  const toggle = builder.querySelector("[data-entity-management-subworkflow-toggle]");
  const isSubworkflow = toggle instanceof HTMLInputElement && toggle.checked;
  const parentField = builder.querySelector("[data-entity-management-workflow-parent-select]");
  const parentRoot = parentField?.querySelector("[data-form-drawer-select]");
  const parentInput = parentRoot?.querySelector("[data-form-drawer-select-value]");
  const parentOptions = getEntityManagementWorkflowParentOptions(builder);
  const parentOptionValues = new Set(parentOptions.map((option) => option.value));

  if (parentField instanceof HTMLElement) {
    parentField.hidden = !isSubworkflow;
  }
  if (parentInput instanceof HTMLInputElement) {
    parentInput.value = parentOptionValues.has(parentInput.value)
      ? parentInput.value
      : parentOptions[0]?.value ?? "";
  }
  if (parentRoot instanceof HTMLElement) {
    const optionList = parentRoot.querySelector("[data-form-drawer-select-option-list]");
    if (optionList instanceof HTMLElement) {
      optionList.innerHTML = renderFormDrawerSelectOptions(parentOptions);
    }
    refreshFormDrawerSelect(parentRoot);
  }

  const parentStatusOptions = getEntityManagementWorkflowParentStatusOptions(builder);
  const parentStatusValues = new Set(parentStatusOptions.map((option) => option.value));
  builder.querySelectorAll("[data-entity-management-workflow-parent-status]").forEach((field, index) => {
    if (!(field instanceof HTMLElement)) {
      return;
    }
    field.hidden = !isSubworkflow;
    const fieldKey = `${workflowKey}-status-${index}-parent-status`;
    const inputName = `${workflowKey}Status${index}ParentStatus`;
    field.dataset.entityManagementWorkflowParentStatus = inputName;
    const label = field.querySelector(".form-field-label");
    const root = field.querySelector("[data-form-drawer-select]");
    const hiddenInput = root?.querySelector("[data-form-drawer-select-value]");
    const trigger = root?.querySelector("[data-form-drawer-select-button]");
    const panel = root?.querySelector("[data-form-drawer-select-panel]");
    const title = panel?.querySelector("h4");
    const search = root?.querySelector("[data-form-drawer-select-search]");
    const optionList = root?.querySelector("[data-form-drawer-select-option-list]");

    if (label instanceof HTMLElement) {
      label.id = `entity-management-${fieldKey}-label`;
    }
    if (root instanceof HTMLElement) {
      root.id = `entity-management-${fieldKey}-select`;
    }
    if (hiddenInput instanceof HTMLInputElement) {
      hiddenInput.id = `entity-management-${fieldKey}-value`;
      hiddenInput.name = inputName;
      hiddenInput.value = parentStatusValues.has(hiddenInput.value)
        ? hiddenInput.value
        : parentStatusOptions[0]?.value ?? "";
    }
    if (trigger instanceof HTMLButtonElement) {
      trigger.id = `entity-management-${fieldKey}-trigger`;
      trigger.setAttribute("aria-labelledby", `entity-management-${fieldKey}-label entity-management-${fieldKey}-trigger`);
    }
    if (panel instanceof HTMLElement) {
      panel.setAttribute("aria-labelledby", `entity-management-${fieldKey}-title`);
    }
    if (title instanceof HTMLElement) {
      title.id = `entity-management-${fieldKey}-title`;
    }
    if (search instanceof HTMLInputElement) {
      search.id = `entity-management-${fieldKey}-search`;
    }
    if (optionList instanceof HTMLElement) {
      optionList.id = `entity-management-${fieldKey}-options`;
      optionList.innerHTML = renderFormDrawerSelectOptions(parentStatusOptions);
    }
    if (root instanceof HTMLElement) {
      refreshFormDrawerSelect(root);
    }
  });
}

function activateNestedListItem(nestedList, key) {
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
}

function getNextEntityManagementWorkflowRecordKeys(nestedList) {
  let index = nestedList.querySelectorAll("[data-record-management-nested-trigger]").length + 1;
  let nestedKey = `workflow-${index}`;
  while (nestedList.querySelector(`[data-record-management-nested-trigger="${CSS.escape(nestedKey)}"]`)) {
    index += 1;
    nestedKey = `workflow-${index}`;
  }
  return {
    formKey: `workflow${index}`,
    nestedKey,
  };
}

function getNextEntityManagementCatalogRecordKeys(nestedList) {
  let index = nestedList.querySelectorAll("[data-record-management-nested-trigger]").length + 1;
  let nestedKey = `catalog-${index}`;
  while (nestedList.querySelector(`[data-record-management-nested-trigger="${CSS.escape(nestedKey)}"]`)) {
    index += 1;
    nestedKey = `catalog-${index}`;
  }
  return {
    formKey: `catalog${index}`,
    nestedKey,
  };
}

function readEntityManagementWorkflowConfig(panel) {
  const builder = panel.querySelector("[data-entity-management-workflow-builder]");
  if (!(builder instanceof HTMLElement)) {
    return {
      isSubworkflow: false,
      parentWorkflow: "",
      statuses: [{ linksTo: "all", name: "Home", parentStatus: "status-0" }],
    };
  }
  const toggle = builder.querySelector("[data-entity-management-subworkflow-toggle]");
  const parentInput = builder.querySelector("[data-entity-management-workflow-parent-select] [data-form-drawer-select-value]");
  return {
    isSubworkflow: toggle instanceof HTMLInputElement && toggle.checked,
    parentWorkflow: parentInput instanceof HTMLInputElement ? parentInput.value : "",
    statuses: Array.from(builder.querySelectorAll("[data-entity-management-workflow-status-row]"))
    .filter((row) => row instanceof HTMLElement)
    .map((row, index) => {
      const nameInput = row.querySelector("[data-entity-management-workflow-status-name]");
      const linksInput = row.querySelector("[data-entity-management-workflow-links] [data-form-drawer-select-value]");
      const parentStatusInput = row.querySelector("[data-entity-management-workflow-parent-status] [data-form-drawer-select-value]");
      const labelKeyInput = row.querySelector("[data-entity-management-workflow-status-label-key]");
      const labelFallbackInput = row.querySelector("[data-entity-management-workflow-status-label-fallback]");
      const descriptionKeyInput = row.querySelector("[data-entity-management-workflow-status-description-key]");
      const descriptionFallbackInput = row.querySelector("[data-entity-management-workflow-status-description-fallback]");
      const tabEligibleInput = row.querySelector("[data-entity-management-workflow-status-tab-eligible]");
      return {
        descriptionFallback: descriptionFallbackInput instanceof HTMLTextAreaElement ? descriptionFallbackInput.value : "",
        descriptionKey: descriptionKeyInput instanceof HTMLInputElement ? descriptionKeyInput.value : "",
        labelFallback: labelFallbackInput instanceof HTMLInputElement ? labelFallbackInput.value : "",
        labelKey: labelKeyInput instanceof HTMLInputElement ? labelKeyInput.value : "",
        linksTo: linksInput instanceof HTMLInputElement && linksInput.value ? linksInput.value : "all",
        name: nameInput instanceof HTMLInputElement && nameInput.value.trim()
          ? nameInput.value.trim()
          : index === 0
            ? "Home"
            : `Status ${index + 1}`,
        parentStatus: parentStatusInput instanceof HTMLInputElement && parentStatusInput.value ? parentStatusInput.value : "status-0",
        tabEligible: tabEligibleInput instanceof HTMLInputElement ? tabEligibleInput.checked : true,
      };
    }),
  };
}

function readEntityManagementCatalogConfig(panel) {
  const getValue = (suffix) => {
    const control = panel.querySelector(`input[name$="${suffix}"], textarea[name$="${suffix}"]`);
    return control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement ? control.value : "";
  };
  const selectedScope = panel.querySelector("input[name$='CatalogScope']:checked");
  return {
    catalogDescription: getValue("CatalogDescription"),
    catalogName: getValue("CatalogName"),
    options: Array.from(panel.querySelectorAll("[data-entity-management-catalog-option-row]"))
      .filter((row) => row instanceof HTMLElement)
      .map((row, index) => {
        const labelInput = row.querySelector("[data-entity-management-catalog-option-label]");
        const valueInput = row.querySelector("[data-entity-management-catalog-option-value]");
        const label = labelInput instanceof HTMLInputElement && labelInput.value.trim()
          ? labelInput.value.trim()
          : `Option ${index + 1}`;
        return {
          label,
          value: valueInput instanceof HTMLInputElement && valueInput.value.trim()
            ? valueInput.value.trim()
            : label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_").replaceAll(/^_+|_+$/g, ""),
        };
      }),
    scope: selectedScope instanceof HTMLInputElement ? selectedScope.value : "entity",
  };
}

function readEntityManagementPermissionConfig(panel) {
  const roleInput = panel.querySelector("input[name$='PermissionRole']");
  return {
    roleValue: roleInput instanceof HTMLInputElement && roleInput.value ? roleInput.value : "llm",
  };
}

function readEntityManagementWorkflowStatusConfig(panel) {
  return readEntityManagementWorkflowConfig(panel).statuses;
}

function renderEntityManagementNestedRecordCard({ description = "", isActive = false, key, label = "", summary = "" }) {
  const displayLabel = label.trim() || "Untitled";
  return `
    <button
      class="record-management-nested-list-card${isActive ? " is-active" : ""}"
      type="button"
      aria-pressed="${isActive ? "true" : "false"}"
      data-record-management-nested-trigger="${escapeHtml(key)}"
    >
      <span>
        <strong>${escapeHtml(displayLabel)}</strong>
        <small title="${escapeHtml(description)}">${escapeHtml(description)}</small>
      </span>
      <em>${escapeHtml(summary)}</em>
    </button>
  `;
}

function renderEntityManagementWorkflowNestedCard({ description = "", isActive = false, key, label = "", summary = "Draft workflow" }) {
  return renderEntityManagementNestedRecordCard({
    description,
    isActive,
    key,
    label: label.trim() || "Untitled workflow",
    summary,
  });
}

function renderEntityManagementCatalogNestedCard({ description = "", isActive = false, key, label = "", summary = "Entity-specific" }) {
  return renderEntityManagementNestedRecordCard({
    description,
    isActive,
    key,
    label: label.trim() || "Untitled catalog",
    summary,
  });
}

function renderEntityManagementPermissionNestedCard({ isActive = false, key, roleValue = "llm" }) {
  const role = entityManagementPermissionRoleOptions.find((option) => option.value === roleValue) ?? entityManagementPermissionRoleOptions[0];
  return renderEntityManagementNestedRecordCard({
    description: role.description,
    isActive,
    key,
    label: role.label,
    summary: "Role permissions",
  });
}

function addEntityManagementWorkflowRecord({ nestedList, sourcePanel = null }) {
  const cards = nestedList.querySelector(".record-management-nested-list-cards");
  const drawer = nestedList.querySelector(".record-management-nested-list-drawer");
  const addCard = nestedList.querySelector("[data-record-management-nested-add]");
  if (!(cards instanceof HTMLElement) || !(drawer instanceof HTMLElement)) {
    return;
  }

  const { formKey, nestedKey } = getNextEntityManagementWorkflowRecordKeys(nestedList);
  const workflowConfig = sourcePanel instanceof HTMLElement
    ? readEntityManagementWorkflowConfig(sourcePanel)
    : { isSubworkflow: false, parentWorkflow: "", statuses: [{ linksTo: "all", name: "Home", parentStatus: "status-0" }] };
  const cardMarkup = renderEntityManagementWorkflowNestedCard({ key: nestedKey });
  const panelMarkup = `
    <section data-record-management-nested-panel="${escapeHtml(nestedKey)}" hidden>
      ${renderEntityManagementWorkflowDefinitionPanel({
        key: formKey,
        isSubworkflow: workflowConfig.isSubworkflow,
        parentWorkflow: workflowConfig.parentWorkflow,
        workflowDescription: "",
        workflowName: "",
        statuses: workflowConfig.statuses,
      })}
    </section>
  `;

  if (addCard instanceof HTMLElement) {
    addCard.insertAdjacentHTML("beforebegin", cardMarkup);
  } else {
    cards.insertAdjacentHTML("beforeend", cardMarkup);
  }
  drawer.insertAdjacentHTML("beforeend", panelMarkup);
  const panel = drawer.querySelector(`[data-record-management-nested-panel="${CSS.escape(nestedKey)}"]`);
  if (panel instanceof HTMLElement) {
    initializeFormDrawerSelects({ scope: panel });
    panel.querySelectorAll("[data-entity-management-workflow-builder]").forEach((builder) => {
      if (builder instanceof HTMLElement) {
        syncEntityManagementWorkflowStatusBuilder(builder);
      }
    });
  }
  activateNestedListItem(nestedList, nestedKey);
}

function addEntityManagementCatalogRecord({ nestedList, sourcePanel = null }) {
  const cards = nestedList.querySelector(".record-management-nested-list-cards");
  const drawer = nestedList.querySelector(".record-management-nested-list-drawer");
  const addCard = nestedList.querySelector("[data-record-management-nested-add]");
  if (!(cards instanceof HTMLElement) || !(drawer instanceof HTMLElement)) {
    return;
  }

  const { formKey, nestedKey } = getNextEntityManagementCatalogRecordKeys(nestedList);
  const catalogConfig = sourcePanel instanceof HTMLElement
    ? readEntityManagementCatalogConfig(sourcePanel)
    : { catalogDescription: "", catalogName: "", scope: "entity" };
  const cardMarkup = renderEntityManagementCatalogNestedCard({ key: nestedKey });
  const panelMarkup = `
    <section data-record-management-nested-panel="${escapeHtml(nestedKey)}" hidden>
      ${renderEntityManagementCatalogDefinitionPanel({
        catalogDescription: sourcePanel instanceof HTMLElement ? catalogConfig.catalogDescription : "",
        catalogName: sourcePanel instanceof HTMLElement ? catalogConfig.catalogName : "",
        key: formKey,
        options: sourcePanel instanceof HTMLElement ? catalogConfig.options : [{ label: "Option 1", value: "option_1" }],
        scope: catalogConfig.scope,
      })}
    </section>
  `;

  if (addCard instanceof HTMLElement) {
    addCard.insertAdjacentHTML("beforebegin", cardMarkup);
  } else {
    cards.insertAdjacentHTML("beforeend", cardMarkup);
  }
  drawer.insertAdjacentHTML("beforeend", panelMarkup);
  activateNestedListItem(nestedList, nestedKey);
}

function getNextEntityManagementPermissionRecordKeys(nestedList) {
  const nextIndex = nestedList.querySelectorAll("[data-record-management-nested-trigger^='permission-role-']").length + 1;
  return {
    formKey: `permissionRole${nextIndex}`,
    nestedKey: `permission-role-${nextIndex}`,
  };
}

function addEntityManagementPermissionRecord({ nestedList, sourcePanel = null }) {
  const cards = nestedList.querySelector(".record-management-nested-list-cards");
  const drawer = nestedList.querySelector(".record-management-nested-list-drawer");
  const addCard = nestedList.querySelector("[data-record-management-nested-add]");
  if (!(cards instanceof HTMLElement) || !(drawer instanceof HTMLElement)) {
    return;
  }

  const { formKey, nestedKey } = getNextEntityManagementPermissionRecordKeys(nestedList);
  const permissionConfig = sourcePanel instanceof HTMLElement
    ? readEntityManagementPermissionConfig(sourcePanel)
    : { roleValue: "" };
  const cardMarkup = renderEntityManagementPermissionNestedCard({ key: nestedKey, roleValue: permissionConfig.roleValue || "llm" });
  const panelMarkup = `
    <section data-record-management-nested-panel="${escapeHtml(nestedKey)}" hidden>
      ${renderEntityManagementPermissionRolePanel({
        key: formKey,
        roleValue: sourcePanel instanceof HTMLElement ? permissionConfig.roleValue : "",
      })}
    </section>
  `;

  if (addCard instanceof HTMLElement) {
    addCard.insertAdjacentHTML("beforebegin", cardMarkup);
  } else {
    cards.insertAdjacentHTML("beforeend", cardMarkup);
  }
  drawer.insertAdjacentHTML("beforeend", panelMarkup);
  const panel = drawer.querySelector(`[data-record-management-nested-panel="${CSS.escape(nestedKey)}"]`);
  if (panel instanceof HTMLElement) {
    initializeFormDrawerSelects({ scope: panel });
  }
  activateNestedListItem(nestedList, nestedKey);
}

function removeEntityManagementWorkflowRecord({ nestedList, panel }) {
  const nestedKey = panel.dataset.recordManagementNestedPanel;
  if (!nestedKey) {
    return;
  }
  const trigger = nestedList.querySelector(`[data-record-management-nested-trigger="${CSS.escape(nestedKey)}"]`);
  const nextTrigger = trigger?.nextElementSibling?.matches("[data-record-management-nested-trigger]")
    ? trigger.nextElementSibling
    : trigger?.previousElementSibling?.matches("[data-record-management-nested-trigger]")
      ? trigger.previousElementSibling
      : nestedList.querySelector("[data-record-management-nested-trigger]");
  trigger?.remove();
  panel.remove();
  if (nextTrigger instanceof HTMLElement) {
    activateNestedListItem(nestedList, nextTrigger.dataset.recordManagementNestedTrigger ?? "");
  }
}

function syncEntityManagementCatalogCardCopy(field) {
  const panel = field.closest("[data-record-management-nested-panel]");
  const nestedList = field.closest("[data-record-management-nested-list]");
  const nestedKey = panel instanceof HTMLElement ? panel.dataset.recordManagementNestedPanel : "";
  if (!(nestedList instanceof HTMLElement) || !nestedKey) {
    return;
  }
  const trigger = nestedList.querySelector(`[data-record-management-nested-trigger="${CSS.escape(nestedKey)}"]`);
  const catalogName = panel.querySelector("input[name$='CatalogName']");
  const catalogDescription = panel.querySelector("textarea[name$='CatalogDescription']");
  const label = catalogName instanceof HTMLInputElement && catalogName.value.trim()
    ? catalogName.value.trim()
    : "Untitled catalog";
  const description = catalogDescription instanceof HTMLTextAreaElement ? catalogDescription.value.trim() : "";
  const titleNode = trigger?.querySelector("strong");
  const descriptionNode = trigger?.querySelector("small");
  if (titleNode instanceof HTMLElement) {
    titleNode.textContent = label;
  }
  if (descriptionNode instanceof HTMLElement) {
    descriptionNode.textContent = description;
    descriptionNode.title = description;
  }
}

function syncEntityManagementPermissionCardCopy(field) {
  const panel = field.closest("[data-record-management-nested-panel]");
  const nestedList = field.closest("[data-record-management-nested-list]");
  const nestedKey = panel instanceof HTMLElement ? panel.dataset.recordManagementNestedPanel : "";
  if (!(nestedList instanceof HTMLElement) || !nestedKey) {
    return;
  }
  const trigger = nestedList.querySelector(`[data-record-management-nested-trigger="${CSS.escape(nestedKey)}"]`);
  const roleValue = field instanceof HTMLInputElement ? field.value : "";
  const role = entityManagementPermissionRoleOptions.find((option) => option.value === roleValue);
  const titleNode = trigger?.querySelector("strong");
  const descriptionNode = trigger?.querySelector("small");
  if (titleNode instanceof HTMLElement) {
    titleNode.textContent = role?.label ?? "Choose role";
  }
  if (descriptionNode instanceof HTMLElement) {
    const description = role?.description ?? "Role permissions need a selected role.";
    descriptionNode.textContent = description;
    descriptionNode.title = description;
  }
  const drawer = field.closest(".chat-workspace-list-drawer");
  if (drawer instanceof HTMLElement) {
    syncEntityManagementViewRoleOptions(drawer);
  }
}

function getEntityManagementPermissionRoleOptionsFromDrawer(drawer) {
  const values = Array.from(drawer.querySelectorAll("[data-record-management-region-panel='permissions'] input[name$='PermissionRole']"))
    .filter((input) => input instanceof HTMLInputElement)
    .map((input) => input.value.trim())
    .filter(Boolean);
  const uniqueValues = values.length ? [...new Set(values)] : ["llm"];
  return uniqueValues
    .map((value) => entityManagementPermissionRoleOptions.find((option) => option.value === value))
    .filter((option) => option);
}

function syncEntityManagementViewRoleOptions(drawer) {
  const options = getEntityManagementPermissionRoleOptionsFromDrawer(drawer);
  const optionValues = new Set(options.map((option) => option.value));
  drawer.querySelectorAll("[data-entity-management-view-drawer-select$='Roles']").forEach((field) => {
    if (!(field instanceof HTMLElement)) {
      return;
    }
    const root = field.querySelector("[data-form-drawer-select]");
    const input = root?.querySelector("[data-form-drawer-select-value]");
    const optionList = root?.querySelector("[data-form-drawer-select-option-list]");
    if (input instanceof HTMLInputElement) {
      const selectedValues = input.value
        .split(",")
        .map((value) => value.trim())
        .filter((value) => optionValues.has(value));
      input.value = selectedValues.length ? selectedValues.join(",") : options[0]?.value ?? "";
    }
    if (optionList instanceof HTMLElement) {
      optionList.innerHTML = renderFormDrawerSelectOptions(options);
    }
    if (root instanceof HTMLElement) {
      refreshFormDrawerSelect(root);
    }
  });
}

function syncEntityManagementPermissionFamily(family) {
  if (!(family instanceof HTMLElement)) {
    return;
  }
  const familyToggle = family.querySelector("[data-entity-management-permission-family-toggle]");
  const isEnabled = familyToggle instanceof HTMLInputElement && familyToggle.checked;
  const list = family.querySelector("[data-entity-management-permission-capability-list]");
  if (list instanceof HTMLElement) {
    list.hidden = !isEnabled;
  }
  family.querySelectorAll("[data-entity-management-permission-capability-toggle]").forEach((toggle) => {
    if (!(toggle instanceof HTMLElement)) {
      return;
    }
    const isAvailable = isEnabled && toggle.getAttribute("aria-pressed") !== "false";
    toggle.classList.toggle("is-hidden", !isAvailable);
    const label = toggle.querySelector("span")?.textContent?.trim() ?? "capability";
    const meta = toggle.querySelector("em");
    toggle.setAttribute("aria-label", `${isAvailable ? "Disable" : "Enable"} ${label}`);
    if (meta instanceof HTMLElement) {
      meta.textContent = isAvailable ? "Available" : "Unavailable";
    }
    const currentIcon = toggle.querySelector("svg");
    if (currentIcon instanceof SVGElement) {
      currentIcon.outerHTML = renderEntityManagementPermissionCapabilityIcon({ available: isAvailable });
    }
  });
}

function syncEntityManagementCatalogBuilder(builder) {
  const catalogKey = builder.dataset.entityManagementCatalogBuilder ?? "catalog";
  const rows = Array.from(builder.querySelectorAll("[data-entity-management-catalog-option-row]"))
    .filter((row) => row instanceof HTMLElement);
  rows.forEach((row, index) => {
    if (!(row instanceof HTMLElement)) {
      return;
    }
    const optionNumber = index + 1;
    row.dataset.catalogOptionIndex = String(index);
    const labelInput = row.querySelector("[data-entity-management-catalog-option-label]");
    const valueInput = row.querySelector("[data-entity-management-catalog-option-value]");
    if (labelInput instanceof HTMLInputElement) {
      labelInput.name = `${catalogKey}Option${optionNumber}Label`;
      labelInput.id = `entity-management-${catalogKey}-option-${index}-label`;
    }
    if (valueInput instanceof HTMLInputElement) {
      valueInput.name = `${catalogKey}Option${optionNumber}Value`;
      valueInput.id = `entity-management-${catalogKey}-option-${index}-value`;
    }
    const labelField = row.querySelector("[data-entity-management-catalog-option-label-field]");
    const valueField = row.querySelector("[data-entity-management-catalog-option-value-field]");
    const labelElement = labelField?.querySelector(".form-field-label");
    const valueElement = valueField?.querySelector(".form-field-label");
    if (labelElement instanceof HTMLLabelElement) {
      labelElement.htmlFor = `entity-management-${catalogKey}-option-${index}-label`;
    }
    if (valueElement instanceof HTMLLabelElement) {
      valueElement.htmlFor = `entity-management-${catalogKey}-option-${index}-value`;
    }
  });
}

function syncEntityManagementWorkflowCardCopy(field) {
  const panel = field.closest("[data-record-management-nested-panel]");
  const nestedList = field.closest("[data-record-management-nested-list]");
  const nestedKey = panel instanceof HTMLElement ? panel.dataset.recordManagementNestedPanel : "";
  if (!(nestedList instanceof HTMLElement) || !nestedKey) {
    return;
  }
  const trigger = nestedList.querySelector(`[data-record-management-nested-trigger="${CSS.escape(nestedKey)}"]`);
  const workflowName = panel.querySelector("input[name$='WorkflowName']");
  const workflowDescription = panel.querySelector("textarea[name$='WorkflowDescription']");
  const label = workflowName instanceof HTMLInputElement && workflowName.value.trim()
    ? workflowName.value.trim()
    : "Untitled workflow";
  const description = workflowDescription instanceof HTMLTextAreaElement ? workflowDescription.value.trim() : "";
  const titleNode = trigger?.querySelector("strong");
  const descriptionNode = trigger?.querySelector("small");
  if (titleNode instanceof HTMLElement) {
    titleNode.textContent = label;
  }
  if (descriptionNode instanceof HTMLElement) {
    descriptionNode.textContent = description;
    descriptionNode.title = description;
  }
  nestedList.querySelectorAll("[data-entity-management-workflow-builder]").forEach((builder) => {
    if (builder instanceof HTMLElement) {
      syncEntityManagementWorkflowSubworkflowControls(builder);
    }
  });
}

function getEntityManagementWorkflowStatusNames(builder) {
  return Array.from(builder.querySelectorAll("[data-entity-management-workflow-status-row]"))
    .filter((row) => row instanceof HTMLElement)
    .map((row, index) => {
      const input = row.querySelector("[data-entity-management-workflow-status-name]");
      return input instanceof HTMLInputElement && input.value.trim()
        ? input.value.trim()
        : index === 0
          ? "Home"
          : `Status ${index + 1}`;
    });
}

function getEntityManagementWorkflowLinkOptions(statusNames = []) {
  return [
    { value: "all", label: "All", description: "Every status in this workflow", attribute: "Default" },
    ...statusNames.map((statusName, index) => ({
      value: `status-${index}`,
      label: statusName || (index === 0 ? "Home" : `Status ${index + 1}`),
      description: index === 0 ? "Base workflow status" : "Workflow status",
      attribute: index === 0 ? "Base" : "Status",
    })),
  ];
}

function syncEntityManagementWorkflowLinkOptions(builder) {
  const workflowKey = builder.dataset.entityManagementWorkflowBuilder ?? "workflow";
  const statusNames = getEntityManagementWorkflowStatusNames(builder);
  const options = getEntityManagementWorkflowLinkOptions(statusNames);
  const optionValues = new Set(options.map((option) => option.value));
  const rows = Array.from(builder.querySelectorAll("[data-entity-management-workflow-status-row]"))
    .filter((row) => row instanceof HTMLElement);

  rows.forEach((row, index) => {
    if (!(row instanceof HTMLElement)) {
      return;
    }
    const fieldKey = `${workflowKey}-status-${index}-links`;
    const inputName = `${workflowKey}Status${index}LinksTo`;
    const linksField = row.querySelector("[data-entity-management-workflow-links]");
    if (linksField instanceof HTMLElement) {
      linksField.dataset.entityManagementWorkflowLinks = inputName;
    }
    const label = linksField?.querySelector(".form-field-label");
    if (label instanceof HTMLElement) {
      label.id = `entity-management-${fieldKey}-label`;
    }

    const root = row.querySelector("[data-form-drawer-select]");
    const hiddenInput = root?.querySelector("[data-form-drawer-select-value]");
    const trigger = root?.querySelector("[data-form-drawer-select-button]");
    const panel = root?.querySelector("[data-form-drawer-select-panel]");
    const title = panel?.querySelector("h4");
    const search = root?.querySelector("[data-form-drawer-select-search]");
    const optionList = root?.querySelector("[data-form-drawer-select-option-list]");

    if (root instanceof HTMLElement) {
      root.id = `entity-management-${fieldKey}-select`;
    }
    if (hiddenInput instanceof HTMLInputElement) {
      hiddenInput.id = `entity-management-${fieldKey}-value`;
      hiddenInput.name = inputName;
      const selectedValues = hiddenInput.value
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      hiddenInput.value = selectedValues.includes("all")
        ? "all"
        : selectedValues.filter((value) => optionValues.has(value)).join(",") || "all";
    }
    if (trigger instanceof HTMLButtonElement) {
      trigger.id = `entity-management-${fieldKey}-trigger`;
      trigger.setAttribute("aria-labelledby", `entity-management-${fieldKey}-label entity-management-${fieldKey}-trigger`);
    }
    if (panel instanceof HTMLElement) {
      panel.setAttribute("aria-labelledby", `entity-management-${fieldKey}-title`);
    }
    if (title instanceof HTMLElement) {
      title.id = `entity-management-${fieldKey}-title`;
    }
    if (search instanceof HTMLInputElement) {
      search.id = `entity-management-${fieldKey}-search`;
    }
    if (optionList instanceof HTMLElement) {
      optionList.id = `entity-management-${fieldKey}-options`;
      optionList.innerHTML = renderFormDrawerSelectOptions(options);
    }
    if (root instanceof HTMLElement) {
      refreshFormDrawerSelect(root);
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

function renderNestedListPicker({ addAction = null, label, description, items }) {
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
                  <small title="${escapeHtml(item.description)}">${escapeHtml(item.description)}</small>
                </span>
                <em>${escapeHtml(item.summary)}</em>
              </button>
            `;
          }).join("")}
          ${addAction ? `
            <button
              class="record-management-nested-list-card record-management-nested-list-add-card"
              type="button"
              aria-label="${escapeHtml(addAction.ariaLabel ?? addAction.label)}"
              data-record-management-nested-add
            >
              <span class="record-management-nested-list-add-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <strong>${escapeHtml(addAction.label)}</strong>
            </button>
          ` : ""}
        </div>
        <div
          class="record-management-nested-list-resizer"
          role="separator"
          aria-label="Resize secondary navigation"
          aria-orientation="vertical"
          tabindex="0"
          data-record-management-nested-resizer
        ></div>
        <div class="record-management-nested-list-drawer" data-entity-management-expanded-section="false">
          ${items.map((item) => {
            const isActive = item.key === activeKey;
            return `
              <section data-record-management-nested-panel="${escapeHtml(item.key)}" ${isActive ? "" : "hidden"}>
                ${item.content ? "" : `
                  <div class="record-management-nested-list-drawer-header">
                    <span>${escapeHtml(item.label)}</span>
                    <strong>${escapeHtml(item.summary)}</strong>
                    <p>${escapeHtml(item.description)}</p>
                  </div>
                `}
                ${item.content ? item.content : `
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
                `}
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
        <div
          class="record-management-nested-list-resizer"
          role="separator"
          aria-label="Resize secondary navigation"
          aria-orientation="vertical"
          tabindex="0"
          data-record-management-nested-resizer
        ></div>
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
  fieldAttributes = "",
  hidden = false,
  label,
  multiline = false,
  name,
  rows = 1,
  value,
}) {
  const inputId = `entity-management-${name}`;
  const control = multiline
    ? `<textarea id="${escapeHtml(inputId)}" class="form-field-input form-field-textarea" name="${escapeHtml(name)}" rows="${escapeHtml(String(Math.min(Math.max(rows, 1), 50)))}" ${editable ? "" : "readonly"}>${escapeHtml(value)}</textarea>`
    : `<input id="${escapeHtml(inputId)}" class="form-field-input" type="text" name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${editable ? "" : "readonly"} />`;
  return `
    <div class="form-field entity-management-field${multiline ? " form-field-span-2" : ""}" ${fieldAttributes} ${hidden ? "hidden" : ""} ${renderEvidenceTargetAttributes({ name: label, value })}>
      <label class="form-field-label" for="${escapeHtml(inputId)}">${escapeHtml(label)}</label>
      ${renderEntityManagementEvidenceButton(label)}
      ${renderEntityManagementAiButton(label)}
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
      ${renderEntityManagementAiButton(label)}
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

function renderEntityManagementSelectField({
  description = "",
  disabled = false,
  fieldAttributes = "",
  hidden = false,
  label,
  name,
  options,
  selectAttributes = "",
  value,
}) {
  const inputId = `entity-management-${name}`;
  const selectedOption = options.find((option) => (typeof option === "string" ? option : option.value) === value);
  const selectedLabel = typeof selectedOption === "string" ? selectedOption : selectedOption?.label ?? value;
  return `
    <div class="form-field entity-management-field" ${fieldAttributes} ${hidden ? "hidden" : ""} ${renderEvidenceTargetAttributes({ name: label, value: selectedLabel })}>
      <label class="form-field-label" for="${escapeHtml(inputId)}">${escapeHtml(label)}</label>
      ${renderEntityManagementEvidenceButton(label)}
      ${renderEntityManagementAiButton(label)}
      <select id="${escapeHtml(inputId)}" class="form-field-input" name="${escapeHtml(name)}" ${selectAttributes} ${disabled ? "disabled" : ""}>
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

function renderEntityManagementPrivacyClassificationField({ name, value }) {
  const markup = renderEntityManagementSelectField({
    label: "Privacy classification",
    name,
    options: entityManagementPrivacyClassificationOptions,
    value,
  });
  return markup.replace("<select ", "<select data-entity-management-privacy-classification ");
}

function renderEntityManagementSecurityClassificationField({ description = "", name, value }) {
  const markup = renderEntityManagementSelectField({
    description,
    label: "Security classification",
    name,
    options: entityManagementSecurityClassificationOptions,
    value,
  });
  return markup.replace("<select ", "<select data-entity-management-security-classification ");
}

function renderEntityManagementSensitivePrivacyCategoryField({ hidden = true, name, value = "governmentIdentifiers" }) {
  return `
    <div class="form-field entity-management-field" data-entity-management-sensitive-privacy-category-field ${hidden ? "hidden" : ""} ${renderEvidenceTargetAttributes({ name: "Sensitive privacy category", value })}>
      <label class="form-field-label" for="entity-management-${escapeHtml(name)}">Sensitive privacy category</label>
      ${renderEntityManagementEvidenceButton("Sensitive privacy category")}
      ${renderEntityManagementAiButton("Sensitive privacy category")}
      <select id="entity-management-${escapeHtml(name)}" class="form-field-input" name="${escapeHtml(name)}" ${hidden ? "" : "required"}>
        ${entityManagementSensitivePrivacyCategoryOptions.map((option) => `
          <option value="${escapeHtml(option.value)}" ${option.value === value ? "selected" : ""}>${escapeHtml(option.label)}</option>
        `).join("")}
      </select>
      <span class="form-field-help">Required when privacy classification is sensitive.</span>
    </div>
  `;
}

function renderEntityManagementSecurityLevelField({ hidden = true, name, value = "level1" }) {
  return `
    <div class="form-field entity-management-field" data-entity-management-security-level-field ${hidden ? "hidden" : ""} ${renderEvidenceTargetAttributes({ name: "Security level", value })}>
      <label class="form-field-label" for="entity-management-${escapeHtml(name)}">Security level</label>
      ${renderEntityManagementEvidenceButton("Security level")}
      ${renderEntityManagementAiButton("Security level")}
      <select id="entity-management-${escapeHtml(name)}" class="form-field-input" name="${escapeHtml(name)}" ${hidden ? "" : "required"}>
        ${Array.from({ length: 10 }, (_, index) => {
          const level = `level${index + 1}`;
          return `<option value="${escapeHtml(level)}" ${level === value ? "selected" : ""}>Level ${index + 1}</option>`;
        }).join("")}
      </select>
      <span class="form-field-help">Required when security classification is classified.</span>
    </div>
  `;
}

function renderEntityManagementSearchableToggle({ name, searchable }) {
  return `
    <label class="entity-management-subworkflow-toggle form-field-span-2" ${renderEvidenceTargetAttributes({ name: "Searchable", value: searchable ? "true" : "false" })}>
      <span>
        <strong>Searchable</strong>
        <small>Declares whether this attribute can be searched, filtered, faceted, or sorted.</small>
      </span>
      ${renderEntityManagementEvidenceButton("Searchable")}
      ${renderEntityManagementAiButton("Searchable")}
      <input type="checkbox" name="${escapeHtml(name)}" value="true" data-entity-management-attribute-searchable ${searchable ? "checked" : ""} />
    </label>
  `;
}

function renderEntityManagementSearchOperatorsField({ attributeName, operators = [] }) {
  return renderEntityManagementDrawerSelectField({
    viewKey: attributeName,
    label: "Operators",
    inputName: `${attributeName}AttributeSearchOperators`,
    value: operators.join(","),
    options: entityManagementSearchOperatorOptions,
    emptySummary: "Choose operators",
    drawerEyebrow: "Search operators",
    dialogTitle: "Choose search operators",
    closeLabel: "Close search operator selector",
    searchPlaceholder: "Search operators",
    selectedTitle: "Selected Operators",
    selectedEmpty: "No operators selected yet.",
    availableTitle: "Available Operators",
    description: "Supported search, filter, facet, and sort operations for this attribute.",
  });
}

function renderEntityManagementValidationRule({ attributeName, index, rule }) {
  const ruleName = `${attributeName}AttributeValidation${index + 1}`;
  const selectedRuleOption = getEntityManagementValidationRuleOption(rule.ruleKey);
  const hasArgument = hasEntityManagementValidationArgumentPlaceholder(selectedRuleOption?.description ?? rule.messageFallback);
  return `
    <article class="entity-management-validation-rule form-field-span-2" data-entity-management-validation-rule="${escapeHtml(rule.ruleKey)}">
      <div class="entity-management-validation-rule-header">
        <div class="record-management-user-attribute-group-header">
          <h5 data-entity-management-validation-rule-title>Validation rule ${index + 1}</h5>
          <p data-entity-management-validation-rule-summary>${escapeHtml(selectedRuleOption?.label ?? (rule.ruleKey || "New rule"))}</p>
        </div>
        <div class="entity-management-validation-rule-actions" aria-label="Validation rule actions">
          <button class="entity-management-validation-rule-action" type="button" aria-label="Copy validation rule" title="Copy validation rule" data-entity-management-validation-rule-copy>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M8 8h10v12H8z" />
              <path d="M5 16H4V4h12v1" />
            </svg>
          </button>
          <button class="entity-management-validation-rule-action entity-management-validation-rule-action-danger" type="button" aria-label="Remove validation rule" title="Remove validation rule" data-entity-management-validation-rule-remove>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M6 9l1 11h10l1-11" />
              <path d="M10 12v5" />
              <path d="M14 12v5" />
            </svg>
          </button>
          <button class="entity-management-validation-rule-action entity-management-validation-rule-action-add" type="button" aria-label="Add validation rule" title="Add validation rule" data-entity-management-validation-rule-add>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
      <div class="entity-management-form-grid">
        ${renderEntityManagementValidationRuleKeySelect({
          index,
          rule,
          ruleName,
        })}
        ${renderEntityManagementTextField({
          label: "Argument type",
          name: `${ruleName}ArgumentType`,
          value: rule.argumentType,
          hidden: !hasArgument,
          fieldAttributes: "data-entity-management-validation-argument-field",
        })}
        ${renderEntityManagementTextField({
          label: "Argument value",
          name: `${ruleName}ArgumentValue`,
          value: String(rule.argumentValue),
          hidden: !hasArgument,
          fieldAttributes: "data-entity-management-validation-argument-field",
        })}
        ${renderEntityManagementTextField({
          label: "Message key",
          name: `${ruleName}MessageKey`,
          value: rule.messageKey,
        })}
        ${renderEntityManagementTextField({
          label: "Message fallback",
          multiline: true,
          name: `${ruleName}MessageFallback`,
          value: rule.messageFallback,
        })}
      </div>
    </article>
  `;
}

function renderEntityManagementValidationRuleKeySelect({ index, rule, ruleName }) {
  const fieldKey = `${ruleName}-rule-key`;
  const selectedOption = getEntityManagementValidationRuleOption(rule.ruleKey);
  const triggerLabel = selectedOption?.label ?? "Choose rule";
  const selectMarkup = renderFormDrawerSelect({
    rootId: `entity-management-${fieldKey}-select`,
    inputId: `entity-management-${fieldKey}-value`,
    inputName: `${ruleName}RuleKey`,
    value: rule.ruleKey,
    triggerId: `entity-management-${fieldKey}-trigger`,
    labelId: `entity-management-${fieldKey}-label`,
    panelTitleId: `entity-management-${fieldKey}-title`,
    searchInputId: `entity-management-${fieldKey}-search`,
    optionListId: `entity-management-${fieldKey}-options`,
    emptySummary: "Choose rule",
    triggerLabel,
    triggerMeta: selectedOption ? "1 selected" : "0 selected",
    drawerEyebrow: "Validation rule",
    dialogTitle: "Choose validation rule",
    closeLabel: "Close validation rule selector",
    searchPlaceholder: "Search validation rules",
    selectedTitle: "Selected Rule",
    selectedEmpty: "No validation rule selected yet.",
    availableTitle: "Validation Rules",
    emptyMessage: "No validation rules match this search.",
    maxSelections: 1,
  }).replace(
    'data-form-drawer-select-option-list\n          ></div>',
    `data-form-drawer-select-option-list\n          >${renderFormDrawerSelectOptions(entityManagementValidationRuleOptions)}</div>`,
  );
  return `
    <section class="form-field entity-management-drawer-select-field" data-entity-management-validation-rule-key ${renderEvidenceTargetAttributes({ name: "Rule key", value: selectedOption?.label ?? rule.ruleKey ?? "" })}>
      <span class="form-field-label" id="entity-management-${escapeHtml(fieldKey)}-label">Rule key</span>
      ${renderEntityManagementEvidenceButton("Rule key")}
      ${renderEntityManagementAiButton("Rule key")}
      ${selectMarkup}
    </section>
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
    value: "",
    triggerId: "entity-management-owning-feature-key-trigger",
    labelId: "entity-management-owning-feature-key-label",
    panelTitleId: "entity-management-owning-feature-key-title",
    searchInputId: "entity-management-owning-feature-key-search",
    optionListId: "entity-management-owning-feature-key-options",
    emptySummary: "Choose feature key",
    triggerLabel: "Choose feature key",
    triggerMeta: "0 selected",
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
    <section class="form-field form-field-span-2 entity-management-drawer-select-field" data-entity-management-owning-feature-key ${renderEvidenceTargetAttributes({ name: "Owning feature key", value: "Not selected" })}>
      <span class="form-field-label" id="entity-management-owning-feature-key-label">Owning feature key</span>
      ${renderEntityManagementEvidenceButton("Owning feature key")}
      ${renderEntityManagementAiButton("Owning feature key")}
      ${selectMarkup}
      <span class="form-field-help">Drawer select preview; this will bind to runtime feature keys later.</span>
    </section>
  `;
}

function renderEntityManagementDrawerSelectField({
  availableTitle = "Available",
  closeLabel,
  createAction = "",
  description = "",
  dialogTitle,
  drawerEyebrow,
  emptyMessage = "No items match this search.",
  emptySummary,
  inputName,
  label,
  layout = "full",
  maxSelections = null,
  options,
  searchPlaceholder,
  selectedEmpty,
  selectedTitle = "Selected",
  value,
  viewKey,
}) {
  const fieldKey = `${viewKey}-${inputName}`;
  const selectedValues = value.split(",").map((item) => item.trim()).filter(Boolean);
  const selectedLabels = selectedValues
    .map((selectedValue) => options.find((option) => option.value === selectedValue)?.label ?? selectedValue);
  const triggerLabel = selectedLabels.length ? selectedLabels.join(", ") : emptySummary;
  const selectMarkup = renderFormDrawerSelect({
    rootId: `entity-management-${fieldKey}-select`,
    inputId: `entity-management-${fieldKey}-value`,
    inputName,
    value,
    triggerId: `entity-management-${fieldKey}-trigger`,
    labelId: `entity-management-${fieldKey}-label`,
    panelTitleId: `entity-management-${fieldKey}-title`,
    searchInputId: `entity-management-${fieldKey}-search`,
    optionListId: `entity-management-${fieldKey}-options`,
    emptySummary,
    triggerLabel,
    triggerMeta: `${selectedValues.length} selected`,
    drawerEyebrow,
    dialogTitle,
    closeLabel,
    searchPlaceholder,
    selectedTitle,
    selectedEmpty,
    availableTitle,
    emptyMessage,
    maxSelections,
  }).replace(
    'data-form-drawer-select-option-list\n          ></div>',
    `data-form-drawer-select-option-list\n          >${renderFormDrawerSelectOptions(options)}</div>`,
  );
  const layoutClass = layout === "inline" ? "entity-management-drawer-select-field-inline" : "form-field-span-2";
  return `
    <section class="form-field ${escapeHtml(layoutClass)} entity-management-drawer-select-field" data-entity-management-view-drawer-select="${escapeHtml(inputName)}" ${renderEvidenceTargetAttributes({ name: label, value: triggerLabel })}>
      <span class="form-field-label" id="entity-management-${escapeHtml(fieldKey)}-label">${escapeHtml(label)}</span>
      ${renderEntityManagementEvidenceButton(label)}
      ${renderEntityManagementAiButton(label)}
      ${selectMarkup}
      ${description ? `<span class="form-field-help">${escapeHtml(description)}</span>` : ""}
      ${createAction}
    </section>
  `;
}

function getEntityManagementViewWorkflowStatuses(workflowKey = "intakeWorkflow") {
  return entityManagementViewWorkflowStatuses[workflowKey] ?? entityManagementViewWorkflowStatuses.intakeWorkflow;
}

function renderEntityManagementEyeIcon({ hidden = false } = {}) {
  return `
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      ${hidden ? '<path d="m4.5 4.5 15 15" />' : ""}
    </svg>
  `;
}

function renderEntityManagementViewWorkflowStatusVisibility({ inputName, statuses }) {
  const visibleValues = statuses.filter((status) => status.visible !== false).map((status) => status.value);
  return `
    <section class="entity-management-view-workflow-statuses" data-entity-management-view-workflow-statuses>
      <input type="hidden" name="${escapeHtml(inputName)}" value="${escapeHtml(visibleValues.join(","))}" data-entity-management-view-workflow-status-value />
      <div class="entity-management-view-workflow-statuses-header">
        <strong>Status visibility</strong>
        <span>Choose which statuses appear in this view.</span>
      </div>
      <div class="entity-management-view-workflow-status-list">
        ${statuses.map((status) => {
          const isVisible = status.visible !== false;
          return `
            <button
              class="entity-management-view-workflow-status-toggle${isVisible ? "" : " is-hidden"}"
              type="button"
              aria-pressed="${escapeHtml(String(isVisible))}"
              aria-label="${escapeHtml(`${isVisible ? "Hide" : "Show"} ${status.label}`)}"
              data-status-value="${escapeHtml(status.value)}"
              data-entity-management-view-workflow-status-toggle
            >
              ${renderEntityManagementEyeIcon({ hidden: !isVisible })}
              <span>${escapeHtml(status.label)}</span>
              <em>${isVisible ? "Visible" : "Hidden"}</em>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function syncEntityManagementViewWorkflowStatusInput(statusList) {
  if (!(statusList instanceof HTMLElement)) {
    return;
  }
  const input = statusList.querySelector("[data-entity-management-view-workflow-status-value]");
  const visibleValues = Array.from(statusList.querySelectorAll("[data-entity-management-view-workflow-status-toggle]"))
    .filter((toggle) => toggle instanceof HTMLElement && toggle.getAttribute("aria-pressed") !== "false")
    .map((toggle) => toggle instanceof HTMLElement ? toggle.dataset.statusValue ?? "" : "")
    .filter(Boolean);
  if (input instanceof HTMLInputElement) {
    input.value = visibleValues.join(",");
  }
  statusList.querySelectorAll("[data-entity-management-view-workflow-status-toggle]").forEach((toggle) => {
    if (!(toggle instanceof HTMLElement)) {
      return;
    }
    const isVisible = toggle.getAttribute("aria-pressed") !== "false";
    toggle.classList.toggle("is-hidden", !isVisible);
    const label = toggle.querySelector("span")?.textContent?.trim() ?? "status";
    const meta = toggle.querySelector("em");
    toggle.setAttribute("aria-label", `${isVisible ? "Hide" : "Show"} ${label}`);
    if (meta instanceof HTMLElement) {
      meta.textContent = isVisible ? "Visible" : "Hidden";
    }
    const currentIcon = toggle.querySelector("svg");
    if (currentIcon instanceof SVGElement) {
      currentIcon.outerHTML = renderEntityManagementEyeIcon({ hidden: !isVisible });
    }
  });
}

function syncEntityManagementViewWorkflowStatusVisibility(workflowField) {
  if (!(workflowField instanceof HTMLElement)) {
    return;
  }
  const input = workflowField.querySelector("[data-form-drawer-select-value]");
  const sectionBody = workflowField.closest("[data-entity-management-section-body]");
  const currentStatusList = sectionBody?.querySelector("[data-entity-management-view-workflow-statuses]");
  if (!(input instanceof HTMLInputElement) || !(currentStatusList instanceof HTMLElement)) {
    return;
  }
  const workflowInputName = input.name;
  const statusInputName = workflowInputName.replace(/Workflow$/, "WorkflowVisibleStatuses");
  currentStatusList.outerHTML = renderEntityManagementViewWorkflowStatusVisibility({
    inputName: statusInputName,
    statuses: getEntityManagementViewWorkflowStatuses(input.value),
  });
}

function getEntityManagementViewActionOptions() {
  return entityManagementRecordActionCapabilities.map((capability) => ({
    key: capability.key,
    label: capability.label,
  }));
}

function renderEntityManagementViewActionSelector({ inputName, selectedValues = [] }) {
  const selectedSet = new Set(selectedValues);
  return `
    <section class="entity-management-view-action-selector form-field-span-2" data-entity-management-view-action-selector>
      <input type="hidden" name="${escapeHtml(inputName)}" value="${escapeHtml(selectedValues.join(","))}" data-entity-management-view-action-value />
      <div class="entity-management-view-workflow-status-list entity-management-permission-capability-list">
        ${getEntityManagementViewActionOptions().map((capability) => {
          const order = selectedValues.indexOf(capability.key) + 1;
          const isSelected = selectedSet.has(capability.key);
          return `
            <button
              class="entity-management-view-workflow-status-toggle entity-management-permission-capability-toggle${isSelected ? "" : " is-hidden"}"
              type="button"
              aria-pressed="${escapeHtml(String(isSelected))}"
              aria-label="${escapeHtml(`${isSelected ? "Remove" : "Add"} ${capability.label}`)}"
              data-capability-key="${escapeHtml(capability.key)}"
              data-entity-management-view-action-toggle
            >
              ${renderEntityManagementPermissionCapabilityIcon({ available: isSelected })}
              <span>${escapeHtml(capability.label)}</span>
              <em>${isSelected ? `Priority ${order}` : "Not selected"}</em>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function syncEntityManagementViewActionSelector(selector) {
  if (!(selector instanceof HTMLElement)) {
    return;
  }
  const input = selector.querySelector("[data-entity-management-view-action-value]");
  const currentValues = input instanceof HTMLInputElement
    ? input.value.split(",").map((value) => value.trim()).filter(Boolean)
    : [];
  const selectedValues = currentValues.filter((value) => {
    const toggle = selector.querySelector(`[data-entity-management-view-action-toggle][data-capability-key="${CSS.escape(value)}"]`);
    return toggle instanceof HTMLElement && toggle.getAttribute("aria-pressed") === "true";
  });
  selector.querySelectorAll("[data-entity-management-view-action-toggle]").forEach((toggle) => {
    if (!(toggle instanceof HTMLElement)) {
      return;
    }
    const value = toggle.dataset.capabilityKey ?? "";
    if (toggle.getAttribute("aria-pressed") === "true" && value && !selectedValues.includes(value)) {
      selectedValues.push(value);
    }
  });
  if (input instanceof HTMLInputElement) {
    input.value = selectedValues.join(",");
  }
  selector.querySelectorAll("[data-entity-management-view-action-toggle]").forEach((toggle) => {
    if (!(toggle instanceof HTMLElement)) {
      return;
    }
    const value = toggle.dataset.capabilityKey ?? "";
    const order = selectedValues.indexOf(value) + 1;
    const isSelected = order > 0;
    toggle.setAttribute("aria-pressed", String(isSelected));
    toggle.classList.toggle("is-hidden", !isSelected);
    const label = toggle.querySelector("span")?.textContent?.trim() ?? "action";
    const meta = toggle.querySelector("em");
    toggle.setAttribute("aria-label", `${isSelected ? "Remove" : "Add"} ${label}`);
    if (meta instanceof HTMLElement) {
      meta.textContent = isSelected ? `Priority ${order}` : "Not selected";
    }
    const currentIcon = toggle.querySelector("svg");
    if (currentIcon instanceof SVGElement) {
      currentIcon.outerHTML = renderEntityManagementPermissionCapabilityIcon({ available: isSelected });
    }
  });
}

function getEntityManagementViewAttributeOptions(entityKey = "organization") {
  const placementOptions = entityManagementPlacementAttributeOptionsByEntity[entityKey];
  if (placementOptions) {
    return [...placementOptions];
  }
  return Object.entries(entityManagementAttributeSkeletonLists).map(([key, attribute]) => ({
    key,
    label: attribute.label,
    description: attribute.description,
  }));
}

function getEntityManagementPlacementAttributeDefaults(entityKey = "organization") {
  return getEntityManagementViewAttributeOptions(entityKey).slice(0, 3).map((attribute) => attribute.key);
}

function getEntityManagementSearchableAttributeOptions() {
  return Object.entries(entityManagementAttributeSkeletonLists)
    .filter(([, attribute]) => attribute.search?.searchable)
    .map(([key, attribute]) => ({
      key,
      label: attribute.label,
      description: attribute.description,
    }));
}

function getEntityManagementViewFilterOptions() {
  const searchableAttributes = getEntityManagementSearchableAttributeOptions().map((attribute) => ({
    ...attribute,
    description: `${attribute.description} Searchable attribute.`,
  }));
  const parentRelationships = Object.entries(entityManagementRelationshipSkeletonLists)
    .filter(([, relationship]) => relationship.relationshipCategory === "parentRelation")
    .map(([key, relationship]) => ({
      key: `parent:${key}`,
      label: relationship.labelFallback,
      description: `${relationship.descriptionFallback} Parent relationship.`,
    }));
  return [...searchableAttributes, ...parentRelationships];
}

function getEntityManagementPlacementAttributeSource(placementDefinition) {
  if (!(placementDefinition instanceof HTMLElement)) {
    return "organization";
  }
  const enabledToggle = placementDefinition.querySelector("[data-entity-management-placement-secondary-nav-toggle]");
  if (enabledToggle instanceof HTMLInputElement && enabledToggle.checked) {
    const secondaryEntityInput = placementDefinition.querySelector("[data-entity-management-placement-secondary-nav-source] [data-form-drawer-select-value]");
    if (secondaryEntityInput instanceof HTMLInputElement && secondaryEntityInput.value) {
      return secondaryEntityInput.value;
    }
  }
  return "organization";
}

function renderEntityManagementViewAttributeSelector({
  entityKey = "organization",
  inputName,
  note = "Included attributes can display in this view. Editable versus read-only behavior is resolved by role permissions and object capacity.",
  optionsOverride = null,
  selectedValues = [],
}) {
  const options = optionsOverride ?? getEntityManagementViewAttributeOptions(entityKey);
  const optionKeys = new Set(options.map((attribute) => attribute.key));
  const effectiveSelectedValues = selectedValues.filter((value) => optionKeys.has(value));
  const selectedSet = new Set(effectiveSelectedValues);
  return `
    <section class="entity-management-view-attribute-selector form-field-span-2" data-entity-management-view-attribute-selector data-entity-management-attribute-source="${escapeHtml(entityKey)}">
      <input type="hidden" name="${escapeHtml(inputName)}" value="${escapeHtml(effectiveSelectedValues.join(","))}" data-entity-management-view-attribute-value />
      <p class="form-field-help entity-management-view-attribute-note">${escapeHtml(note)}</p>
      <div class="entity-management-view-workflow-status-list entity-management-permission-capability-list">
        ${options.map((attribute) => {
          const order = effectiveSelectedValues.indexOf(attribute.key) + 1;
          const isSelected = selectedSet.has(attribute.key);
          return `
            <button
              class="entity-management-view-workflow-status-toggle entity-management-permission-capability-toggle${isSelected ? "" : " is-hidden"}"
              type="button"
              aria-pressed="${escapeHtml(String(isSelected))}"
              aria-label="${escapeHtml(`${isSelected ? "Hide" : "Show"} ${attribute.label}`)}"
              data-attribute-key="${escapeHtml(attribute.key)}"
              data-entity-management-view-attribute-toggle
            >
              ${renderEntityManagementPermissionCapabilityIcon({ available: isSelected })}
              <span>${escapeHtml(attribute.label)}</span>
              <em>${isSelected ? `Priority ${order}` : "Not on"}</em>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function syncEntityManagementViewAttributeSelector(selector) {
  if (!(selector instanceof HTMLElement)) {
    return;
  }
  const input = selector.querySelector("[data-entity-management-view-attribute-value]");
  const currentValues = input instanceof HTMLInputElement
    ? input.value.split(",").map((value) => value.trim()).filter(Boolean)
    : [];
  const selectedValues = currentValues.filter((value) => {
    const toggle = selector.querySelector(`[data-entity-management-view-attribute-toggle][data-attribute-key="${CSS.escape(value)}"]`);
    return toggle instanceof HTMLElement && toggle.getAttribute("aria-pressed") === "true";
  });
  selector.querySelectorAll("[data-entity-management-view-attribute-toggle]").forEach((toggle) => {
    if (!(toggle instanceof HTMLElement)) {
      return;
    }
    const value = toggle.dataset.attributeKey ?? "";
    if (toggle.getAttribute("aria-pressed") === "true" && value && !selectedValues.includes(value)) {
      selectedValues.push(value);
    }
  });
  if (input instanceof HTMLInputElement) {
    input.value = selectedValues.join(",");
  }
  selector.querySelectorAll("[data-entity-management-view-attribute-toggle]").forEach((toggle) => {
    if (!(toggle instanceof HTMLElement)) {
      return;
    }
    const isSelected = toggle.getAttribute("aria-pressed") === "true";
    const value = toggle.dataset.attributeKey ?? "";
    const order = selectedValues.indexOf(value) + 1;
    toggle.classList.toggle("is-hidden", !isSelected);
    const label = toggle.querySelector("span")?.textContent?.trim() ?? "attribute";
    const meta = toggle.querySelector("em");
    toggle.setAttribute("aria-label", `${isSelected ? "Hide" : "Show"} ${label}`);
    if (meta instanceof HTMLElement) {
      meta.textContent = isSelected && order > 0 ? `Priority ${order}` : "Not on";
    }
    const currentIcon = toggle.querySelector("svg");
    if (currentIcon instanceof SVGElement) {
      currentIcon.outerHTML = renderEntityManagementPermissionCapabilityIcon({ available: isSelected });
    }
  });
}

function getEntityManagementViewPlacementOptions() {
  return Object.entries(entityManagementPlacementSkeletonLists).map(([key, placement]) => ({
    key,
    label: placement.label,
    description: placement.description,
  }));
}

function renderEntityManagementViewPlacementSelector({ inputName, selectedValues = [] }) {
  const selectedSet = new Set(selectedValues);
  return `
    <section class="entity-management-view-placement-selector form-field-span-2" data-entity-management-view-placement-selector>
      <input type="hidden" name="${escapeHtml(inputName)}" value="${escapeHtml(selectedValues.join(","))}" data-entity-management-view-placement-value />
      <p class="form-field-help entity-management-view-attribute-note">Visible placements control which drawer regions this view renders. Placement sections own the ordered attributes inside each region.</p>
      <div class="entity-management-view-workflow-status-list entity-management-permission-capability-list">
        ${getEntityManagementViewPlacementOptions().map((placement) => {
          const isSelected = selectedSet.has(placement.key);
          return `
            <button
              class="entity-management-view-workflow-status-toggle entity-management-permission-capability-toggle${isSelected ? "" : " is-hidden"}"
              type="button"
              aria-pressed="${escapeHtml(String(isSelected))}"
              aria-label="${escapeHtml(`${isSelected ? "Hide" : "Show"} ${placement.label}`)}"
              data-placement-key="${escapeHtml(placement.key)}"
              data-entity-management-view-placement-toggle
            >
              ${renderEntityManagementPermissionCapabilityIcon({ available: isSelected })}
              <span>${escapeHtml(placement.label)}</span>
              <em>${isSelected ? "Visible" : "Hidden"}</em>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function syncEntityManagementViewPlacementSelector(selector) {
  if (!(selector instanceof HTMLElement)) {
    return;
  }
  const input = selector.querySelector("[data-entity-management-view-placement-value]");
  const selectedValues = [];
  selector.querySelectorAll("[data-entity-management-view-placement-toggle]").forEach((toggle) => {
    if (!(toggle instanceof HTMLElement)) {
      return;
    }
    const value = toggle.dataset.placementKey ?? "";
    const isSelected = toggle.getAttribute("aria-pressed") === "true";
    if (value && isSelected) {
      selectedValues.push(value);
    }
  });
  if (input instanceof HTMLInputElement) {
    input.value = selectedValues.join(",");
  }
  selector.querySelectorAll("[data-entity-management-view-placement-toggle]").forEach((toggle) => {
    if (!(toggle instanceof HTMLElement)) {
      return;
    }
    const isSelected = toggle.getAttribute("aria-pressed") === "true";
    toggle.classList.toggle("is-hidden", !isSelected);
    const label = toggle.querySelector("span")?.textContent?.trim() ?? "placement";
    const meta = toggle.querySelector("em");
    toggle.setAttribute("aria-label", `${isSelected ? "Hide" : "Show"} ${label}`);
    if (meta instanceof HTMLElement) {
      meta.textContent = isSelected ? "Visible" : "Hidden";
    }
    const currentIcon = toggle.querySelector("svg");
    if (currentIcon instanceof SVGElement) {
      currentIcon.outerHTML = renderEntityManagementPermissionCapabilityIcon({ available: isSelected });
    }
  });
}

function syncEntityManagementViewDisplayTemplateSettings(viewDefinition) {
  if (!(viewDefinition instanceof HTMLElement)) {
    return;
  }
  const pageTemplateInput = viewDefinition.querySelector("[data-entity-management-view-drawer-select$='PageTemplate'] [data-form-drawer-select-value]");
  const listDisplay = viewDefinition.querySelector("[data-entity-management-view-list-display-settings]");
  if (listDisplay instanceof HTMLElement && pageTemplateInput instanceof HTMLInputElement) {
    listDisplay.hidden = pageTemplateInput.value !== "record_management_list_centric";
  }
}

function syncEntityManagementPlacementAttributeSource(placementDefinition) {
  if (!(placementDefinition instanceof HTMLElement)) {
    return;
  }
  const sectionBody = placementDefinition.querySelector("[aria-label='Attributes'] [data-entity-management-section-body]");
  const builder = sectionBody?.querySelector("[data-entity-management-placement-attribute-builder]");
  if (!(sectionBody instanceof HTMLElement) || !(builder instanceof HTMLElement)) {
    return;
  }
  const entityKey = getEntityManagementPlacementAttributeSource(placementDefinition);
  const currentSource = builder.dataset.entityManagementAttributeSource ?? "";
  if (entityKey === currentSource) {
    return;
  }
  const note = entityKey === "organization"
    ? "Included attributes can display in this drawer region. Secondary nav is off, so attributes come from the parent entity."
    : "Included attributes can display in this drawer region. Secondary nav is on, so attributes come from the selected child entity.";
  builder.dataset.entityManagementAttributeSource = entityKey;
  const placementKey = builder.dataset.entityManagementPlacementAttributeBuilder ?? "placement";
  builder.querySelectorAll("[data-entity-management-placement-attribute-section]").forEach((row, index) => {
    if (!(row instanceof HTMLElement)) {
      return;
    }
    const nameInput = row.querySelector("[data-entity-management-placement-section-name]");
    const label = nameInput instanceof HTMLInputElement ? nameInput.value : `Section ${index + 1}`;
    row.outerHTML = renderEntityManagementPlacementAttributeSectionRow({
      entityKey,
      index,
      note,
      placementKey,
      section: {
        label,
        attributes: getEntityManagementPlacementAttributeDefaults(entityKey),
      },
    });
  });
  syncEntityManagementPlacementAttributeSections(builder);
}

function syncEntityManagementPlacementAttributeSections(builder) {
  if (!(builder instanceof HTMLElement)) {
    return;
  }
  const placementKey = builder.dataset.entityManagementPlacementAttributeBuilder ?? "placement";
  const rows = Array.from(builder.querySelectorAll("[data-entity-management-placement-attribute-section]"))
    .filter((row) => row instanceof HTMLElement);
  rows.forEach((row, index) => {
    if (!(row instanceof HTMLElement)) {
      return;
    }
    row.dataset.placementSectionIndex = String(index);
    const nameInput = row.querySelector("[data-entity-management-placement-section-name]");
    if (nameInput instanceof HTMLInputElement) {
      nameInput.name = `${placementKey}PlacementSection${index + 1}Name`;
      nameInput.id = `entity-management-${placementKey}-placement-section-${index + 1}-name`;
      const label = row.querySelector("label[for]");
      if (label instanceof HTMLLabelElement) {
        label.htmlFor = nameInput.id;
      }
    }
    const valueInput = row.querySelector("[data-entity-management-view-attribute-value]");
    if (valueInput instanceof HTMLInputElement) {
      valueInput.name = `${placementKey}PlacementSection${index + 1}Attributes`;
    }
    const moveUp = row.querySelector("[data-entity-management-placement-section-move='up']");
    const moveDown = row.querySelector("[data-entity-management-placement-section-move='down']");
    const remove = row.querySelector("[data-entity-management-placement-section-remove]");
    if (moveUp instanceof HTMLButtonElement) {
      moveUp.disabled = index === 0;
    }
    if (moveDown instanceof HTMLButtonElement) {
      moveDown.disabled = index === rows.length - 1;
    }
    if (remove instanceof HTMLButtonElement) {
      remove.disabled = rows.length <= 1;
    }
  });
}

function renderEntityManagementViewSection({ children, description, id, title }) {
  const bodyId = `entity-management-${id}-body`;
  return `
    <section class="entity-management-subpanel entity-management-view-section" aria-label="${escapeHtml(title)}" data-entity-management-view-section>
      <button
        class="record-management-user-attribute-group-header entity-management-view-section-toggle"
        type="button"
        aria-expanded="false"
        aria-controls="${escapeHtml(bodyId)}"
        data-entity-management-section-toggle
      >
        <span>
          <h5>${escapeHtml(title)}</h5>
          <p>${escapeHtml(description)}</p>
        </span>
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div id="${escapeHtml(bodyId)}" class="entity-management-form-grid" data-entity-management-section-body hidden>
        ${children}
      </div>
    </section>
  `;
}

function renderEntityManagementViewDefinitionPanel({ key, routeName, routePreview, viewDescription, viewName }) {
  return `
    <div class="entity-management-view-definition" data-entity-management-view-definition="${escapeHtml(key)}">
      ${renderEntityManagementViewSection({
        id: `${key}-details`,
        title: "View details",
        description: "Name and description for this view definition.",
        children: `
          ${renderEntityManagementTextField({
            label: "View name",
            name: `${key}ViewName`,
            value: viewName,
          })}
          ${renderEntityManagementTextField({
            label: "Description",
            multiline: true,
            name: `${key}ViewDescription`,
            value: viewDescription,
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${key}-location`,
        title: "Location",
        description: "Where this view lives and how its route is presented.",
        children: `
          ${renderEntityManagementSelectField({
            label: "App",
            name: `${key}App`,
            options: [
              { value: "root", label: "Root" },
              { value: "tenant", label: "Tenant" },
              { value: "admin", label: "Admin" },
              { value: "design-system", label: "Design system" },
            ],
            value: "root",
          })}
          ${renderEntityManagementDrawerSelectField({
            viewKey: key,
            label: "Module",
            inputName: `${key}Module`,
            value: "organizationCore",
            options: entityManagementViewModuleOptions,
            emptySummary: "Choose module",
            drawerEyebrow: "Module",
            dialogTitle: "Choose module",
            closeLabel: "Close module selector",
            searchPlaceholder: "Search modules",
            selectedTitle: "Selected Module",
            selectedEmpty: "No module selected yet.",
            availableTitle: "Available Modules",
            description: "Available modules are filtered by the selected app.",
            maxSelections: 1,
          })}
          ${renderEntityManagementDrawerSelectField({
            viewKey: key,
            label: "Parent page",
            inputName: `${key}ParentPage`,
            value: "rootOrganizations",
            options: entityManagementViewParentPageOptions,
            emptySummary: "Choose parent page",
            drawerEyebrow: "Parent page",
            dialogTitle: "Choose parent page",
            closeLabel: "Close parent page selector",
            searchPlaceholder: "Search pages",
            selectedTitle: "Selected Parent",
            selectedEmpty: "No parent page selected yet.",
            availableTitle: "Pages Under Module",
            description: "Page choices come from the selected module.",
            maxSelections: 1,
          })}
          ${renderEntityManagementTextField({
            description: "Prepopulated from the entity reference.",
            editable: false,
            label: "Route Name",
            name: `${key}RouteName`,
            value: routeName,
          })}
          ${renderEntityManagementTextField({
            description: "Preview URL for this entity's record-management page.",
            editable: false,
            label: "Route preview",
            name: `${key}RoutePreview`,
            value: routePreview,
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${key}-access`,
        title: "Access",
        description: "Who can reach this view and which shared relationship gates the record.",
        children: `
          ${renderEntityManagementDrawerSelectField({
            viewKey: key,
            label: "Roles",
            inputName: `${key}Roles`,
            value: "llm",
            options: entityManagementInitialViewAccessRoleOptions,
            emptySummary: "Choose roles",
            drawerEyebrow: "Roles",
            dialogTitle: "Choose roles",
            closeLabel: "Close role selector",
            searchPlaceholder: "Search roles",
            selectedTitle: "Selected Roles",
            selectedEmpty: "No roles selected yet.",
            availableTitle: "Permission Roles",
            description: "Only roles added under Permissions can be selected for view access.",
          })}
          <div class="entity-management-access-drawer-row">
            ${renderEntityManagementDrawerSelectField({
              viewKey: key,
              description: "This view only applies to records for this entity that have this shared relationship.",
              label: "Boundary",
              layout: "inline",
              inputName: `${key}Relationship`,
              value: "tenant",
              options: entityManagementViewRelationshipOptions,
              emptySummary: "Choose relationship",
              drawerEyebrow: "Boundary",
              dialogTitle: "Choose boundary",
              closeLabel: "Close boundary selector",
              searchPlaceholder: "Search relationships",
              selectedTitle: "Selected Boundary",
              selectedEmpty: "No boundary selected yet.",
              availableTitle: "Available Boundaries",
            })}
            ${renderEntityManagementDrawerSelectField({
              viewKey: key,
              description: "Optional specific entity record assignment.",
              label: "Object",
              layout: "inline",
              inputName: `${key}Object`,
              value: "notApplicable",
              options: entityManagementViewObjectOptions,
              emptySummary: "Choose object",
              drawerEyebrow: "Object",
              dialogTitle: "Choose object",
              closeLabel: "Close object selector",
              searchPlaceholder: "Search objects",
              selectedTitle: "Selected Object",
              selectedEmpty: "No object selected yet.",
              availableTitle: "Available Objects",
              maxSelections: 1,
            })}
            ${renderEntityManagementDrawerSelectField({
              viewKey: key,
              description: "Optional role for the selected object.",
              label: "Object capacity",
              layout: "inline",
              inputName: `${key}ObjectCapacity`,
              value: "notApplicable",
              options: entityManagementViewObjectCapacityOptions,
              emptySummary: "Choose object capacity",
              drawerEyebrow: "Object capacity",
              dialogTitle: "Choose object capacity",
              closeLabel: "Close object capacity selector",
              searchPlaceholder: "Search object capacities",
              selectedTitle: "Selected Object Capacity",
              selectedEmpty: "No object capacity selected yet.",
              availableTitle: "Available Object Capacities",
              maxSelections: 1,
            })}
          </div>
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${key}-workflow`,
        title: "Workflow",
        description: "Which workflow powers this view.",
        children: `
          ${renderEntityManagementDrawerSelectField({
            viewKey: key,
            label: "Workflow",
            inputName: `${key}Workflow`,
            value: "intakeWorkflow",
            options: entityManagementViewWorkflowOptions,
            emptySummary: "Choose workflow",
            drawerEyebrow: "Workflow",
            dialogTitle: "Choose workflow",
            closeLabel: "Close workflow selector",
            searchPlaceholder: "Search workflows",
            selectedTitle: "Selected Workflow",
            selectedEmpty: "No workflow selected yet.",
            availableTitle: "Available Workflows",
            description: "Single workflow selected for this entity view.",
            maxSelections: 1,
          })}
          ${renderEntityManagementViewWorkflowStatusVisibility({
            inputName: `${key}WorkflowVisibleStatuses`,
            statuses: getEntityManagementViewWorkflowStatuses("intakeWorkflow"),
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${key}-global-search`,
        title: "Global search",
        description: "Searchable attributes from this entity that apply to global search for this view.",
        children: renderEntityManagementViewAttributeSelector({
          inputName: `${key}GlobalSearchAttributes`,
          note: "Only attributes declared searchable in Attribute details can be selected for global search. Selection order becomes search priority.",
          optionsOverride: getEntityManagementSearchableAttributeOptions(),
          selectedValues: ["email"],
        }),
      })}
      ${renderEntityManagementViewSection({
        id: `${key}-filter-bar`,
        title: "Filter bar",
        description: "Searchable attributes and parent relationships that appear as filters for this view.",
        children: renderEntityManagementViewAttributeSelector({
          inputName: `${key}FilterBarItems`,
          note: "Only searchable attributes and parent relationships can be selected for the filter bar. Selection order becomes filter order.",
          optionsOverride: getEntityManagementViewFilterOptions(),
          selectedValues: ["email", "parent:tenant"],
        }),
      })}
      ${renderEntityManagementViewSection({
        id: `${key}-primary-actions`,
        title: "Primary actions",
        description: "Record capabilities shown as primary actions for this view, ordered by selection priority.",
        children: renderEntityManagementViewActionSelector({
          inputName: `${key}PrimaryActions`,
          selectedValues: ["read", "update"],
        }),
      })}
      ${renderEntityManagementViewSection({
        id: `${key}-secondary-actions`,
        title: "Secondary actions",
        description: "Record capabilities shown as secondary actions for this view, ordered by selection priority.",
        children: renderEntityManagementViewActionSelector({
          inputName: `${key}SecondaryActions`,
          selectedValues: ["archive", "export"],
        }),
      })}
      ${renderEntityManagementViewSection({
        id: `${key}-display`,
        title: "Display",
        description: "Template-specific display settings for this view.",
        children: `
          ${renderEntityManagementDrawerSelectField({
            viewKey: key,
            label: "Page template",
            inputName: `${key}PageTemplate`,
            value: "record_management_list_centric",
            options: entityManagementViewPageTemplateOptions,
            emptySummary: "Choose page template",
            drawerEyebrow: "Page template",
            dialogTitle: "Choose page template",
            closeLabel: "Close page template selector",
            searchPlaceholder: "Search page templates",
            selectedTitle: "Selected Page Template",
            selectedEmpty: "No page template selected yet.",
            availableTitle: "Available Page Templates",
            description: "Template used for this entity view route.",
            maxSelections: 1,
          })}
          <section class="entity-management-display-setting-group form-field-span-2" aria-label="List display" data-entity-management-view-list-display-settings>
            <div class="record-management-user-attribute-group-header">
              <h5>List display</h5>
              <p>Attributes displayed in the list area, ordered by priority.</p>
            </div>
            ${renderEntityManagementViewAttributeSelector({
              inputName: `${key}ListDisplayAttributes`,
              selectedValues: ["email", "description", "status"],
            })}
          </section>
          <section class="entity-management-display-setting-group form-field-span-2" aria-label="Drawer display" data-entity-management-view-drawer-display-settings>
            <div class="record-management-user-attribute-group-header">
              <h5>Drawer display</h5>
              <p>Placement regions shown in the drawer for this view.</p>
            </div>
            ${renderEntityManagementViewPlacementSelector({
              inputName: `${key}DrawerDisplayPlacements`,
              selectedValues: ["primaryDetails", "operations"],
            })}
          </section>
        `,
      })}
    </div>
  `;
}

function getEntityManagementWorkflowLinkSummary({ selectedValues = ["all"], statuses = ["Home"] } = {}) {
  const options = getEntityManagementWorkflowLinkOptions(statuses);
  const selectedRecords = options.filter((option) => selectedValues.includes(option.value));
  if (!selectedRecords.length) {
    return "Choose links";
  }
  if (selectedRecords.length <= 2) {
    return selectedRecords.map((option) => option.label).join(", ");
  }
  return `${selectedRecords.slice(0, 2).map((option) => option.label).join(", ")} +${selectedRecords.length - 2} more`;
}

function renderEntityManagementWorkflowDrawerSelect({
  availableTitle,
  closeLabel,
  dialogTitle,
  drawerEyebrow,
  emptyMessage,
  emptySummary,
  fieldKey,
  inputName,
  options,
  searchPlaceholder,
  selectedEmpty,
  selectedTitle,
  value = "",
}) {
  const selectedValue = value || options[0]?.value || "";
  const selectedOption = options.find((option) => option.value === selectedValue);
  const triggerLabel = selectedOption?.label ?? emptySummary;
  return renderFormDrawerSelect({
    rootId: `entity-management-${fieldKey}-select`,
    inputId: `entity-management-${fieldKey}-value`,
    inputName,
    value: selectedValue,
    triggerId: `entity-management-${fieldKey}-trigger`,
    labelId: `entity-management-${fieldKey}-label`,
    panelTitleId: `entity-management-${fieldKey}-title`,
    searchInputId: `entity-management-${fieldKey}-search`,
    optionListId: `entity-management-${fieldKey}-options`,
    emptySummary,
    triggerLabel,
    triggerMeta: selectedValue ? "1 selected" : "0 selected",
    drawerEyebrow,
    dialogTitle,
    closeLabel,
    searchPlaceholder,
    selectedTitle,
    selectedEmpty,
    availableTitle,
    emptyMessage,
    maxSelections: 1,
  }).replace(
    'data-form-drawer-select-option-list\n          ></div>',
    `data-form-drawer-select-option-list\n          >${renderFormDrawerSelectOptions(options)}</div>`,
  );
}

function renderEntityManagementWorkflowParentSelect({ parentWorkflow = "", workflowKey }) {
  const fieldKey = `${workflowKey}-parent-workflow`;
  return `
    <section class="form-field entity-management-drawer-select-field entity-management-workflow-parent-field" data-entity-management-workflow-parent-select="${escapeHtml(`${workflowKey}ParentWorkflow`)}" ${renderEvidenceTargetAttributes({ name: "Parent workflow", value: "Choose parent workflow" })} hidden>
      <span class="form-field-label" id="entity-management-${escapeHtml(fieldKey)}-label">Parent workflow</span>
      ${renderEntityManagementEvidenceButton("Parent workflow")}
      ${renderEntityManagementWorkflowDrawerSelect({
        availableTitle: "Available Workflows",
        closeLabel: "Close parent workflow selector",
        dialogTitle: "Choose parent workflow",
        drawerEyebrow: "Parent workflow",
        emptyMessage: "No workflows match this search.",
        emptySummary: "Choose parent workflow",
        fieldKey,
        inputName: `${workflowKey}ParentWorkflow`,
        options: [],
        searchPlaceholder: "Search workflows",
        selectedEmpty: "No parent workflow selected yet.",
        selectedTitle: "Selected Parent Workflow",
        value: parentWorkflow,
      })}
    </section>
  `;
}

function renderEntityManagementWorkflowParentStatusSelect({ index, parentStatus = "status-0", workflowKey }) {
  const fieldKey = `${workflowKey}-status-${index}-parent-status`;
  return `
    <section class="form-field entity-management-drawer-select-field entity-management-workflow-parent-status-field" data-entity-management-workflow-parent-status="${escapeHtml(`${workflowKey}Status${index}ParentStatus`)}" ${renderEvidenceTargetAttributes({ name: "Parent status", value: "Home" })} hidden>
      <span class="form-field-label" id="entity-management-${escapeHtml(fieldKey)}-label">Parent status</span>
      ${renderEntityManagementEvidenceButton("Parent status")}
      ${renderEntityManagementWorkflowDrawerSelect({
        availableTitle: "Available Parent Statuses",
        closeLabel: "Close parent status selector",
        dialogTitle: "Map parent status",
        drawerEyebrow: "Parent status",
        emptyMessage: "No parent statuses match this search.",
        emptySummary: "Choose parent status",
        fieldKey,
        inputName: `${workflowKey}Status${index}ParentStatus`,
        options: [{ value: "status-0", label: "Home", description: "Base status in parent workflow", attribute: "Base" }],
        searchPlaceholder: "Search parent statuses",
        selectedEmpty: "No parent status selected yet.",
        selectedTitle: "Selected Parent Status",
        value: parentStatus,
      })}
    </section>
  `;
}

function renderEntityManagementWorkflowLinksDrawerSelect({ index, linksTo = "all", statuses = ["Home"], workflowKey }) {
  const fieldKey = `${workflowKey}-status-${index}-links`;
  const selectedValues = linksTo
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const effectiveSelectedValues = selectedValues.length ? selectedValues : ["all"];
  const triggerLabel = getEntityManagementWorkflowLinkSummary({ selectedValues: effectiveSelectedValues, statuses });
  const options = getEntityManagementWorkflowLinkOptions(statuses);
  return renderFormDrawerSelect({
    rootId: `entity-management-${fieldKey}-select`,
    inputId: `entity-management-${fieldKey}-value`,
    inputName: `${workflowKey}Status${index}LinksTo`,
    value: effectiveSelectedValues.join(","),
    triggerId: `entity-management-${fieldKey}-trigger`,
    labelId: `entity-management-${fieldKey}-label`,
    panelTitleId: `entity-management-${fieldKey}-title`,
    searchInputId: `entity-management-${fieldKey}-search`,
    optionListId: `entity-management-${fieldKey}-options`,
    emptySummary: "Choose links",
    triggerLabel,
    triggerMeta: `${effectiveSelectedValues.length} selected`,
    drawerEyebrow: "Links to",
    dialogTitle: "Choose linked statuses",
    closeLabel: "Close linked status selector",
    searchPlaceholder: "Search statuses",
    selectedTitle: "Selected Links",
    selectedEmpty: "No linked statuses selected yet.",
    availableTitle: "Available Status Links",
    emptyMessage: "No status links match this search.",
  }).replace(
    'data-form-drawer-select-option-list\n          ></div>',
    `data-form-drawer-select-option-list\n          >${renderFormDrawerSelectOptions(options)}</div>`,
  );
}

function getEntityManagementWorkflowStatusDefaultKey({ index, name, suffix, workflowKey }) {
  const statusKey = String(name || (index === 0 ? "Home" : `Status ${index + 1}`))
    .trim()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, character) => character.toUpperCase())
    .replace(/^[A-Z]/, (character) => character.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, "") || `status${index + 1}`;
  return `entity.organization.workflow.${workflowKey}.status.${statusKey}.${suffix}`;
}

function renderEntityManagementWorkflowStatusDetails({
  descriptionFallback = "",
  descriptionKey = "",
  index,
  labelFallback = "",
  labelKey = "",
  name,
  tabEligible = true,
  workflowKey,
}) {
  const effectiveLabelKey = labelKey || getEntityManagementWorkflowStatusDefaultKey({ index, name, suffix: "label", workflowKey });
  const effectiveLabelFallback = labelFallback || name || (index === 0 ? "Home" : `Status ${index + 1}`);
  const effectiveDescriptionKey = descriptionKey || getEntityManagementWorkflowStatusDefaultKey({ index, name, suffix: "description", workflowKey });
  return `
    <details class="entity-management-workflow-status-details" data-entity-management-workflow-status-details>
      <summary>
        <span>
          <strong>Status metadata</strong>
          <small>Localization, description, and tab eligibility.</small>
        </span>
      </summary>
      <div class="entity-management-form-grid entity-management-workflow-status-details-grid">
        ${renderEntityManagementTextField({
          fieldAttributes: 'data-entity-management-workflow-status-detail-field="LabelKey"',
          label: "Label key",
          name: `${workflowKey}Status${index}LabelKey`,
          value: effectiveLabelKey,
        }).replace("<input ", '<input data-entity-management-workflow-status-label-key ')}
        ${renderEntityManagementTextField({
          fieldAttributes: 'data-entity-management-workflow-status-detail-field="LabelFallback"',
          label: "Label fallback",
          name: `${workflowKey}Status${index}LabelFallback`,
          value: effectiveLabelFallback,
        }).replace("<input ", '<input data-entity-management-workflow-status-label-fallback ')}
        ${renderEntityManagementTextField({
          fieldAttributes: 'data-entity-management-workflow-status-detail-field="DescriptionKey"',
          label: "Description key",
          name: `${workflowKey}Status${index}DescriptionKey`,
          value: effectiveDescriptionKey,
        }).replace("<input ", '<input data-entity-management-workflow-status-description-key ')}
        ${renderEntityManagementTextField({
          fieldAttributes: 'data-entity-management-workflow-status-detail-field="DescriptionFallback"',
          label: "Description fallback",
          multiline: true,
          name: `${workflowKey}Status${index}DescriptionFallback`,
          value: descriptionFallback,
        }).replace("<textarea ", '<textarea data-entity-management-workflow-status-description-fallback ')}
        <label class="entity-management-subworkflow-toggle form-field-span-2" ${renderEvidenceTargetAttributes({ name: "Tab eligible", value: tabEligible ? "true" : "false" })}>
          <span>
            <strong>Tab eligible</strong>
            <small>This status can be exposed as a workflow tab when a surface supports status tabs.</small>
          </span>
          ${renderEntityManagementEvidenceButton("Tab eligible")}
          ${renderEntityManagementAiButton("Tab eligible")}
          <input type="checkbox" name="${escapeHtml(`${workflowKey}Status${index}TabEligible`)}" value="true" data-entity-management-workflow-status-tab-eligible ${tabEligible ? "checked" : ""} />
        </label>
      </div>
    </details>
  `;
}

function renderEntityManagementWorkflowStatusRow({
  descriptionFallback = "",
  descriptionKey = "",
  index,
  isCreate = false,
  labelFallback = "",
  labelKey = "",
  linksTo = "all",
  name,
  parentStatus = "status-0",
  statuses = ["Home"],
  tabEligible = true,
  workflowKey,
}) {
  const inputId = `entity-management-${workflowKey}-status-${index}-name`;
  return `
    <article class="entity-management-workflow-status-row" data-entity-management-workflow-status-row data-status-index="${escapeHtml(String(index))}" data-status-location="${isCreate ? "create" : "sequence"}">
      <div class="form-field entity-management-field entity-management-workflow-status-name" ${renderEvidenceTargetAttributes({ name: "Status name", value: name })}>
        <label class="form-field-label" for="${escapeHtml(inputId)}" data-entity-management-workflow-status-name-label>Status name</label>
        ${renderEntityManagementEvidenceButton("Status name")}
        <input id="${escapeHtml(inputId)}" class="form-field-input" type="text" name="${escapeHtml(`${workflowKey}Status${index}Name`)}" value="${escapeHtml(name)}" data-entity-management-workflow-status-name />
      </div>
      <div class="entity-management-workflow-status-location" aria-label="Status location">
        ${isCreate ? `
          <span class="entity-management-workflow-location-badge" aria-disabled="true">Base</span>
        ` : `
          <button class="entity-management-workflow-status-move" type="button" aria-label="Move status up" data-entity-management-workflow-status-move="up">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="m6 15 6-6 6 6" />
            </svg>
          </button>
          <button class="entity-management-workflow-status-move" type="button" aria-label="Move status down" data-entity-management-workflow-status-move="down">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        `}
      </div>
      <section class="form-field entity-management-drawer-select-field entity-management-workflow-links-field" data-entity-management-workflow-links="${escapeHtml(`${workflowKey}Status${index}LinksTo`)}" ${renderEvidenceTargetAttributes({ name: "Links to", value: "All" })}>
        <span class="form-field-label" id="entity-management-${escapeHtml(workflowKey)}-status-${escapeHtml(String(index))}-links-label">Links to</span>
        ${renderEntityManagementEvidenceButton("Links to")}
        ${renderEntityManagementWorkflowLinksDrawerSelect({ index, linksTo, statuses, workflowKey })}
      </section>
      ${renderEntityManagementWorkflowParentStatusSelect({ index, parentStatus, workflowKey })}
      <div class="entity-management-workflow-status-row-actions">
        ${isCreate ? "" : `
          <button class="entity-management-workflow-status-remove" type="button" aria-label="Remove workflow status" data-entity-management-workflow-status-remove>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M6 9l1 11h10l1-11" />
              <path d="M10 12v5" />
              <path d="M14 12v5" />
            </svg>
          </button>
        `}
        <button class="entity-management-workflow-status-add" type="button" aria-label="Add workflow status" data-entity-management-workflow-status-add>
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
      ${renderEntityManagementWorkflowStatusDetails({
        descriptionFallback,
        descriptionKey,
        index,
        labelFallback,
        labelKey,
        name,
        tabEligible,
        workflowKey,
      })}
    </article>
  `;
}

function renderEntityManagementWorkflowBuilder({ isSubworkflow = false, parentWorkflow = "", statuses = [{ linksTo: "all", name: "Home" }], workflowKey }) {
  const effectiveStatuses = statuses.length ? statuses : [{ linksTo: "all", name: "Home" }];
  const statusNames = effectiveStatuses.map((status, index) => status.name || (index === 0 ? "Home" : `Status ${index + 1}`));
  return `
    ${renderEntityManagementViewSection({
      id: `${workflowKey}-builder`,
      title: "Workflow builder",
      description: "Status sequence for this workflow. The first status is fixed to the create location.",
      children: `
        <div class="entity-management-workflow-builder" data-entity-management-workflow-builder="${escapeHtml(workflowKey)}">
          <div class="entity-management-workflow-builder-settings">
            <label class="entity-management-subworkflow-toggle">
              <span>
                <strong>Sub-workflow</strong>
                <small>Map this workflow to statuses from a parent workflow.</small>
              </span>
              <input type="checkbox" name="${escapeHtml(`${workflowKey}IsSubworkflow`)}" value="true" data-entity-management-subworkflow-toggle ${isSubworkflow ? "checked" : ""} />
            </label>
            ${renderEntityManagementWorkflowParentSelect({ parentWorkflow, workflowKey })}
          </div>
          <div class="entity-management-workflow-status-list" data-entity-management-workflow-status-list>
            ${effectiveStatuses.map((status, index) => renderEntityManagementWorkflowStatusRow({
              index,
              isCreate: index === 0,
              descriptionFallback: status.descriptionFallback ?? "",
              descriptionKey: status.descriptionKey ?? "",
              labelFallback: status.labelFallback ?? "",
              labelKey: status.labelKey ?? "",
              linksTo: status.linksTo ?? "all",
              name: status.name || (index === 0 ? "Home" : `Status ${index + 1}`),
              parentStatus: status.parentStatus ?? "status-0",
              statuses: statusNames,
              tabEligible: status.tabEligible ?? true,
              workflowKey,
            })).join("")}
          </div>
        </div>
      `,
    })}
  `;
}

function renderEntityManagementWorkflowActions({ workflowKey }) {
  return `
    <div class="entity-management-workflow-actions" aria-label="Workflow actions">
      <button
        class="entity-management-workflow-action-button"
        type="button"
        aria-label="Copy workflow"
        title="Copy workflow"
        data-entity-management-workflow-copy="${escapeHtml(workflowKey)}"
      >
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M8 8h10v12H8z" />
          <path d="M5 16H4V4h12v1" />
        </svg>
      </button>
      <button
        class="entity-management-workflow-action-button entity-management-workflow-action-button-danger"
        type="button"
        aria-label="Delete workflow"
        title="Delete workflow"
        data-entity-management-workflow-delete="${escapeHtml(workflowKey)}"
      >
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M6 9l1 11h10l1-11" />
          <path d="M10 12v5" />
          <path d="M14 12v5" />
        </svg>
      </button>
    </div>
  `;
}

function renderEntityManagementCatalogActions({ catalogKey }) {
  return `
    <div class="entity-management-workflow-actions" aria-label="Catalog actions">
      <button
        class="entity-management-workflow-action-button"
        type="button"
        aria-label="Copy catalog"
        title="Copy catalog"
        data-entity-management-catalog-copy="${escapeHtml(catalogKey)}"
      >
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M8 8h10v12H8z" />
          <path d="M5 16H4V4h12v1" />
        </svg>
      </button>
      <button
        class="entity-management-workflow-action-button entity-management-workflow-action-button-danger"
        type="button"
        aria-label="Delete catalog"
        title="Delete catalog"
        data-entity-management-catalog-delete="${escapeHtml(catalogKey)}"
      >
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M6 9l1 11h10l1-11" />
          <path d="M10 12v5" />
          <path d="M14 12v5" />
        </svg>
      </button>
    </div>
  `;
}

function renderEntityManagementPermissionActions({ permissionKey }) {
  return `
    <div class="entity-management-workflow-actions" aria-label="Permission role actions">
      <button class="entity-management-workflow-action-button" type="button" aria-label="Copy permission role" title="Copy permission role" data-entity-management-permission-copy="${escapeHtml(permissionKey)}">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M8 8h10v12H8z" />
          <path d="M5 16H4V4h12v1" />
        </svg>
      </button>
      <button class="entity-management-workflow-action-button entity-management-workflow-action-button-danger" type="button" aria-label="Delete permission role" title="Delete permission role" data-entity-management-permission-delete="${escapeHtml(permissionKey)}">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M6 9l1 11h10l1-11" />
          <path d="M10 12v5" />
          <path d="M14 12v5" />
        </svg>
      </button>
    </div>
  `;
}

function renderEntityManagementWorkflowDefinitionPanel({ isSubworkflow = false, key, parentWorkflow = "", statuses = [{ linksTo: "all", name: "Home" }], workflowDescription, workflowName }) {
  return `
    <div class="entity-management-view-definition" data-entity-management-workflow-definition="${escapeHtml(key)}">
      ${renderEntityManagementWorkflowActions({ workflowKey: key })}
      ${renderEntityManagementViewSection({
        id: `${key}-details`,
        title: "Workflow details",
        description: "Name and description for this workflow definition.",
        children: `
          ${renderEntityManagementTextField({
            label: "Workflow name",
            name: `${key}WorkflowName`,
            value: workflowName,
          })}
          ${renderEntityManagementTextField({
            label: "Description",
            multiline: true,
            name: `${key}WorkflowDescription`,
            value: workflowDescription,
          })}
        `,
      })}
      ${renderEntityManagementWorkflowBuilder({ isSubworkflow, parentWorkflow, statuses, workflowKey: key })}
    </div>
  `;
}

function renderEntityManagementCatalogOptionRow({ catalogKey, index, option }) {
  const label = option.label ?? `Option ${index + 1}`;
  const value = option.value ?? label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_").replaceAll(/^_+|_+$/g, "");
  return `
    <article class="entity-management-workflow-status-row entity-management-catalog-option-row" data-entity-management-catalog-option-row data-catalog-option-index="${escapeHtml(String(index))}">
      <div class="form-field entity-management-field entity-management-workflow-status-name" data-entity-management-catalog-option-label-field ${renderEvidenceTargetAttributes({ name: "Option label", value: label })}>
        <label class="form-field-label" for="entity-management-${escapeHtml(catalogKey)}-option-${escapeHtml(String(index))}-label">Option label</label>
        ${renderEntityManagementEvidenceButton("Option label")}
        ${renderEntityManagementAiButton("Option label")}
        <input id="entity-management-${escapeHtml(catalogKey)}-option-${escapeHtml(String(index))}-label" class="form-field-input" type="text" name="${escapeHtml(`${catalogKey}Option${index + 1}Label`)}" value="${escapeHtml(label)}" data-entity-management-catalog-option-label />
      </div>
      <div class="entity-management-workflow-status-location" aria-label="Option location">
        <button class="entity-management-workflow-status-move" type="button" aria-label="Move option up" data-entity-management-catalog-option-move="up">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="m6 15 6-6 6 6" />
          </svg>
        </button>
        <button class="entity-management-workflow-status-move" type="button" aria-label="Move option down" data-entity-management-catalog-option-move="down">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
      <div class="form-field entity-management-field entity-management-workflow-links-field" data-entity-management-catalog-option-value-field ${renderEvidenceTargetAttributes({ name: "Option value", value })}>
        <label class="form-field-label" for="entity-management-${escapeHtml(catalogKey)}-option-${escapeHtml(String(index))}-value">Option value</label>
        ${renderEntityManagementEvidenceButton("Option value")}
        ${renderEntityManagementAiButton("Option value")}
        <input id="entity-management-${escapeHtml(catalogKey)}-option-${escapeHtml(String(index))}-value" class="form-field-input" type="text" name="${escapeHtml(`${catalogKey}Option${index + 1}Value`)}" value="${escapeHtml(value)}" data-entity-management-catalog-option-value />
      </div>
      <div class="entity-management-workflow-status-row-actions">
        <button class="entity-management-workflow-status-remove" type="button" aria-label="Remove catalog option" data-entity-management-catalog-option-remove>
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M6 9l1 11h10l1-11" />
            <path d="M10 12v5" />
            <path d="M14 12v5" />
          </svg>
        </button>
        <button class="entity-management-workflow-status-add" type="button" aria-label="Add catalog option" data-entity-management-catalog-option-add>
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </article>
  `;
}

function renderEntityManagementCatalogBuilder({ catalogKey, options = [{ label: "Option 1", value: "option_1" }] }) {
  const effectiveOptions = options.length ? options : [{ label: "Option 1", value: "option_1" }];
  return renderEntityManagementViewSection({
    id: `${catalogKey}-options`,
    title: "Catalog options",
    description: "Possible enum values made available by this catalog.",
    children: `
      <div class="entity-management-workflow-builder entity-management-catalog-builder" data-entity-management-catalog-builder="${escapeHtml(catalogKey)}">
        <div class="entity-management-workflow-status-list" data-entity-management-catalog-option-list>
          ${effectiveOptions.map((option, index) => renderEntityManagementCatalogOptionRow({ catalogKey, index, option })).join("")}
        </div>
      </div>
    `,
  });
}

function renderEntityManagementCatalogDefinitionPanel({ catalogDescription, catalogName, key, options = [{ label: "Option 1", value: "option_1" }], scope = "entity" }) {
  return `
    <div class="entity-management-view-definition" data-entity-management-catalog-definition="${escapeHtml(key)}">
      ${renderEntityManagementCatalogActions({ catalogKey: key })}
      ${renderEntityManagementViewSection({
        id: `${key}-catalog-details`,
        title: "Catalog details",
        description: "Name and purpose for this enum value catalog.",
        children: `
          ${renderEntityManagementTextField({
            label: "Catalog name",
            name: `${key}CatalogName`,
            value: catalogName,
          })}
          ${renderEntityManagementTextField({
            label: "Description",
            multiline: true,
            name: `${key}CatalogDescription`,
            value: catalogDescription,
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${key}-catalog-scope`,
        title: "Catalog scope",
        description: "Whether edits stay on this entity or apply platform-wide.",
        children: `
          ${renderEntityManagementRadioGroup({
            label: "Catalog scope",
            name: `${key}CatalogScope`,
            options: [
              { value: "entity", label: "Entity specific", description: "Values are owned by this entity definition." },
              { value: "global", label: "Global", description: "Values are shared across entity attributes that consume this catalog." },
            ],
            value: scope,
          })}
          <article class="form-field form-field-span-2 entity-management-field" data-entity-management-catalog-impact ${renderEvidenceTargetAttributes({ name: "Catalog impact", value: scope === "global" ? "Global changes apply platform-wide" : "Changes apply to this entity" })}>
            <span class="form-field-label">Catalog impact</span>
            ${renderEntityManagementEvidenceButton("Catalog impact")}
            ${renderEntityManagementAiButton("Catalog impact")}
            <p class="form-field-help">
              ${scope === "global"
                ? "Global catalog edits apply to every entity attribute that consumes this catalog across the platform."
                : "Entity-specific catalog edits apply only to attributes on this entity definition."}
            </p>
          </article>
        `,
      })}
      ${renderEntityManagementCatalogBuilder({ catalogKey: key, options })}
    </div>
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
          label: "Singular label key",
          name: "singularLabelKey",
          value: "entity.organization.label.singular",
        })}
        ${renderEntityManagementTextField({
          label: "Singular label fallback",
          name: "singularLabelFallback",
          value: "Organization",
        })}
        ${renderEntityManagementTextField({
          label: "Plural label key",
          name: "pluralLabelKey",
          value: "entity.organization.label.plural",
        })}
        ${renderEntityManagementTextField({
          label: "Plural label fallback",
          name: "pluralLabelFallback",
          value: "Organizations",
        })}
        ${renderEntityManagementTextField({
          label: "Description key",
          name: "descriptionKey",
          value: "entity.organization.description",
        })}
        ${renderEntityManagementTextField({
          label: "Description fallback",
          multiline: true,
          name: "descriptionFallback",
          value: "An organization represents a company, department, partner, or other business structure that the platform manages, displays, and connects to related records.",
        })}
        ${renderEntityManagementTextField({
          label: "Purpose key",
          name: "purposeKey",
          value: "entity.organization.purpose",
        })}
        ${renderEntityManagementTextField({
          label: "Purpose fallback",
          multiline: true,
          name: "purposeFallback",
          value: "Organizations give the platform a stable business structure for ownership, reporting, relationships, permissions, and operational workflows.",
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
        <div class="entity-management-owning-feature-derived-fields" data-entity-management-owning-feature-derived-fields hidden>
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
      summary: "10 fields",
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
          <div
            class="record-management-nested-list-resizer"
            role="separator"
            aria-label="Resize secondary navigation"
            aria-orientation="vertical"
            tabindex="0"
            data-record-management-nested-resizer
          ></div>
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

function renderEntityManagementViewsRegion() {
  return renderNestedListPicker({
    addAction: {
      label: "Add View",
      ariaLabel: "Add another entity view",
    },
    label: "Views",
    description: "Who can access this entity in the system, where they'll find it and how it will behave.",
    items: [
      {
        key: "list-views",
        ...entityManagementViewSkeletonLists.listViews,
        content: renderEntityManagementViewDefinitionPanel({
          key: "listViews",
          routeName: "organization",
          routePreview: "/root-admin/organizations/:organizationId",
          viewDescription: entityManagementViewSkeletonLists.listViews.description,
          viewName: "List views",
        }),
      },
      {
        key: "detail-views",
        ...entityManagementViewSkeletonLists.detailViews,
        content: renderEntityManagementViewDefinitionPanel({
          key: "detailViews",
          routeName: "organizationDetail",
          routePreview: "/root-admin/organizations/:organizationId/details",
          viewDescription: entityManagementViewSkeletonLists.detailViews.description,
          viewName: "Detail views",
        }),
      },
      {
        key: "workflow-views",
        ...entityManagementViewSkeletonLists.workflowViews,
        content: renderEntityManagementViewDefinitionPanel({
          key: "workflowViews",
          routeName: "organizationWorkflow",
          routePreview: "/root-admin/organizations/:organizationId/workflows",
          viewDescription: entityManagementViewSkeletonLists.workflowViews.description,
          viewName: "Workflow views",
        }),
      },
    ],
  });
}

function renderEntityManagementWorkflowsRegion() {
  return renderNestedListPicker({
    addAction: {
      label: "Add Workflow",
      ariaLabel: "Add another entity workflow",
    },
    label: "Workflows",
    description: "Workflow definitions for how this entity is created, reviewed, and moved through lifecycle steps.",
    items: [
      {
        key: "intake-workflow",
        ...entityManagementWorkflowSkeletonLists.intake,
        content: renderEntityManagementWorkflowDefinitionPanel({
          key: "intakeWorkflow",
          workflowDescription: entityManagementWorkflowSkeletonLists.intake.description,
          workflowName: entityManagementWorkflowSkeletonLists.intake.label,
        }),
      },
      {
        key: "review-workflow",
        ...entityManagementWorkflowSkeletonLists.review,
        content: renderEntityManagementWorkflowDefinitionPanel({
          key: "reviewWorkflow",
          workflowDescription: entityManagementWorkflowSkeletonLists.review.description,
          workflowName: entityManagementWorkflowSkeletonLists.review.label,
        }),
      },
      {
        key: "lifecycle-workflow",
        ...entityManagementWorkflowSkeletonLists.lifecycle,
        content: renderEntityManagementWorkflowDefinitionPanel({
          key: "lifecycleWorkflow",
          workflowDescription: entityManagementWorkflowSkeletonLists.lifecycle.description,
          workflowName: entityManagementWorkflowSkeletonLists.lifecycle.label,
        }),
      },
    ],
  });
}

function renderEntityManagementRelationshipDefinitionPanel({ key, relationship }) {
  const name = `${key}Relationship`;
  return `
    <div class="entity-management-view-definition" data-entity-management-relationship-definition="${escapeHtml(key)}">
      ${renderEntityManagementViewSection({
        id: `${name}-metadata`,
        title: "Relationship metadata",
        description: "How this entity connects to another entity and what the app can do with the connection.",
        children: `
          ${renderEntityManagementTextField({ label: "Relationship key", name: `${name}Key`, value: relationship.relationshipKey })}
          ${renderEntityManagementTextField({ label: "Target entity key", name: `${name}TargetEntityKey`, value: relationship.targetEntityKey })}
          ${renderEntityManagementTextField({ label: "Label key", name: `${name}LabelKey`, value: relationship.labelKey })}
          ${renderEntityManagementTextField({ label: "Label fallback", name: `${name}LabelFallback`, value: relationship.labelFallback })}
          ${renderEntityManagementTextField({ label: "Description key", name: `${name}DescriptionKey`, value: relationship.descriptionKey })}
          ${renderEntityManagementTextField({ label: "Description fallback", multiline: true, name: `${name}DescriptionFallback`, value: relationship.descriptionFallback })}
          ${renderEntityManagementSelectField({ label: "Relationship category", name: `${name}Category`, options: entityManagementRelationshipCategoryOptions, value: relationship.relationshipCategory })}
          ${renderEntityManagementSelectField({ label: "Cardinality", name: `${name}Cardinality`, options: entityManagementRelationshipCardinalityOptions, value: relationship.cardinality })}
          ${renderEntityManagementTextField({ label: "Relationship role", name: `${name}Role`, value: relationship.relationshipRole })}
          ${renderEntityManagementTextField({ label: "Inverse relationship role", name: `${name}InverseRole`, value: relationship.inverseRelationshipRole })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${name}-lookup`,
        title: "Relationship lookup recipe",
        description: "Where the stored reference, inverse lookup, join entity, or external lookup path lives.",
        children: `
          ${renderEntityManagementSelectField({ label: "Resolution", name: `${name}Resolution`, options: entityManagementRelationshipResolutionOptions, value: relationship.resolution })}
          ${renderEntityManagementTextField({ description: "Required for storedReference; use none when unused.", label: "Source attribute key", name: `${name}SourceAttributeKey`, value: relationship.sourceAttributeKey })}
          ${renderEntityManagementTextField({ description: "Required for inverseLookup; use none when unused.", label: "Inverse attribute key", name: `${name}InverseAttributeKey`, value: relationship.inverseAttributeKey })}
          ${renderEntityManagementTextField({ description: "Required for joinEntity; use none when unused.", label: "Join entity key", name: `${name}JoinEntityKey`, value: relationship.joinEntityKey })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${name}-navigation-ownership`,
        title: "Navigation and ownership",
        description: "Whether users can navigate the connection and how strongly this entity owns the target.",
        children: `
          ${renderEntityManagementSelectField({ label: "Navigation posture", name: `${name}NavigationPosture`, options: entityManagementRelationshipNavigationPostureOptions, value: relationship.navigationPosture })}
          ${renderEntityManagementSelectField({ label: "Ownership posture", name: `${name}OwnershipPosture`, options: entityManagementRelationshipOwnershipPostureOptions, value: relationship.ownershipPosture })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${name}-boundaries`,
        title: "Relationship boundaries",
        description: "Structural boundary constraints that must hold before permissions are checked.",
        children: `
          ${renderEntityManagementSelectField({ label: "Tenant boundary", name: `${name}TenantBoundary`, options: entityManagementRelationshipBoundaryOptions, value: relationship.relationshipBoundary.tenantBoundary })}
          ${renderEntityManagementSelectField({ label: "Organization boundary", name: `${name}OrganizationBoundary`, options: entityManagementRelationshipBoundaryOptions, value: relationship.relationshipBoundary.organizationBoundary })}
          ${renderEntityManagementSelectField({ label: "Business unit boundary", name: `${name}BusinessUnitBoundary`, options: entityManagementRelationshipBoundaryOptions, value: relationship.relationshipBoundary.businessUnitBoundary })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${name}-lifecycle`,
        title: "Relationship lifecycle impact",
        description: "What happens to related records or links when the source entity changes lifecycle state.",
        children: `
          ${renderEntityManagementSelectField({ label: "On archive", name: `${name}OnArchive`, options: entityManagementRelationshipLifecycleImpactOptions, value: relationship.relationshipLifecycleImpact.onArchive })}
          ${renderEntityManagementSelectField({ label: "On delete", name: `${name}OnDelete`, options: entityManagementRelationshipLifecycleImpactOptions, value: relationship.relationshipLifecycleImpact.onDelete })}
          ${renderEntityManagementSelectField({ label: "On restore", name: `${name}OnRestore`, options: entityManagementRelationshipLifecycleImpactOptions, value: relationship.relationshipLifecycleImpact.onRestore })}
          ${renderEntityManagementSelectField({ label: "On supersede", name: `${name}OnSupersede`, options: entityManagementRelationshipLifecycleImpactOptions, value: relationship.relationshipLifecycleImpact.onSupersede })}
        `,
      })}
    </div>
  `;
}

function renderEntityManagementRelationshipsRegion() {
  const relationshipEntries = Object.entries(entityManagementRelationshipSkeletonLists);
  return renderNestedListPicker({
    label: "Relationships",
    description: "Field-complete relationship definitions for how this entity connects to other entities.",
    items: relationshipEntries.map(([key, relationship]) => ({
      key: `relationship-${key}`,
      label: relationship.labelFallback,
      summary: relationship.relationshipCategory,
      description: relationship.descriptionFallback,
      content: renderEntityManagementRelationshipDefinitionPanel({ key, relationship }),
    })),
  });
}

function renderEntityManagementAttributePanel({ attribute }) {
  const name = attribute.formKey;
  const isSensitive = attribute.privacyClassification === "sensitive";
  const isClassified = attribute.securityClassification === "classified";
  const isMultiple = attribute.valueCardinality === "multiple";
  return `
    <div class="entity-management-view-definition" data-entity-management-attribute-definition="${escapeHtml(name)}">
      ${renderEntityManagementViewSection({
        id: `${name}-attribute-details`,
        title: "Attribute details",
        description: "Definition metadata, data type, and classification for this attribute.",
        children: `
          ${renderEntityManagementTextField({
            label: "Attribute key",
            name: `${name}AttributeKey`,
            value: attribute.attributeKey ?? name,
          })}
          ${renderEntityManagementTextField({
            label: "Label key",
            name: `${name}AttributeLabelKey`,
            value: attribute.labelKey ?? `entity.organization.attribute.${name}.label`,
          })}
          ${renderEntityManagementTextField({
            label: "Label fallback",
            name: `${name}AttributeLabelFallback`,
            value: attribute.labelFallback ?? attribute.label,
          })}
          ${renderEntityManagementTextField({
            label: "Description key",
            name: `${name}AttributeDescriptionKey`,
            value: attribute.descriptionKey ?? `entity.organization.attribute.${name}.description`,
          })}
          ${renderEntityManagementTextField({
            label: "Description fallback",
            multiline: true,
            name: `${name}AttributeDescriptionFallback`,
            value: attribute.descriptionFallback ?? attribute.description,
          })}
          ${renderEntityManagementTextField({
            label: "Category",
            name: `${name}AttributeCategory`,
            value: attribute.category ?? "identity",
          })}
          ${renderEntityManagementSelectField({
            label: "Attribute type",
            name: `${name}AttributeType`,
            options: entityManagementAttributeTypeOptions,
            value: attribute.attributeType ?? "string",
          })}
          ${renderEntityManagementSelectField({
            label: "Value cardinality",
            name: `${name}AttributeValueCardinality`,
            options: ["single", "multiple"],
            value: attribute.valueCardinality ?? "single",
            fieldAttributes: "data-entity-management-value-cardinality-field",
            selectAttributes: "data-entity-management-value-cardinality",
          })}
          ${renderEntityManagementSelectField({
            description: "Minimum selected items when the attribute allows multiple values.",
            hidden: !isMultiple,
            label: "Min items",
            name: `${name}AttributeMinItems`,
            options: entityManagementItemLimitOptions,
            value: attribute.minItems ?? "notApplicable",
            fieldAttributes: "data-entity-management-item-limit-field",
          })}
          ${renderEntityManagementSelectField({
            description: "Maximum selected items when the attribute allows multiple values.",
            hidden: !isMultiple,
            label: "Max items",
            name: `${name}AttributeMaxItems`,
            options: entityManagementItemLimitOptions,
            value: attribute.maxItems ?? "notApplicable",
            fieldAttributes: "data-entity-management-item-limit-field",
          })}
          ${renderEntityManagementRadioGroup({
            label: "Required",
            name: `${name}AttributeRequired`,
            options: [
              { value: "true", label: "Required" },
              { value: "false", label: "Optional" },
            ],
            value: attribute.required ? "true" : "false",
          })}
          ${renderEntityManagementRadioGroup({
            label: "System managed",
            name: `${name}AttributeSystemManaged`,
            options: [
              { value: "true", label: "System-managed" },
              { value: "false", label: "User supplied" },
            ],
            value: attribute.systemManaged ? "true" : "false",
          })}
          ${renderEntityManagementSelectField({
            label: "Mutability",
            name: `${name}AttributeMutability`,
            options: entityManagementAttributeMutabilityOptions,
            value: attribute.mutability ?? "updateable",
          })}
          ${renderEntityManagementPrivacyClassificationField({
            name: `${name}AttributePrivacyClassification`,
            value: attribute.privacyClassification ?? "none",
          })}
          ${renderEntityManagementSensitivePrivacyCategoryField({
            hidden: !isSensitive,
            name: `${name}AttributeSensitivePrivacyCategory`,
            value: attribute.sensitivePrivacyCategory ?? "governmentIdentifiers",
          })}
          ${renderEntityManagementSecurityClassificationField({
            description: entityManagementSecurityClassificationOptions.find((option) => option.value === (attribute.securityClassification ?? "none"))?.description ?? "",
            name: `${name}AttributeSecurityClassification`,
            value: attribute.securityClassification ?? "none",
          })}
          ${renderEntityManagementSecurityLevelField({
            hidden: !isClassified,
            name: `${name}AttributeSecurityLevel`,
            value: attribute.securityLevel ?? "level1",
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${name}-attribute-storage`,
        title: "Ownership and storage",
        description: "System posture, requirement behavior, and storage naming.",
        children: `
          ${renderEntityManagementTextField({
            editable: false,
            label: "Owning entity",
            name: `${name}AttributeOwningEntity`,
            value: "Organization",
          })}
          ${renderEntityManagementRadioGroup({
            disabled: true,
            label: "Supply posture",
            name: `${name}AttributeSupplyPosture`,
            options: [
              { value: "system-managed", label: "System-managed", description: "The system creates or maintains this attribute." },
              { value: "user-supplied", label: "User-supplied", description: "A user supplies this attribute value." },
            ],
            value: attribute.systemManaged ? "system-managed" : "user-supplied",
          })}
          ${renderEntityManagementRadioGroup({
            label: "Requirement posture",
            name: `${name}AttributeRequirementPosture`,
            options: [
              { value: "required", label: "Required" },
              { value: "optional", label: "Optional" },
              { value: "nullable", label: "Nullable" },
              { value: "derived", label: "Derived" },
            ],
            value: attribute.required ? "required" : "optional",
          })}
          ${renderEntityManagementTextField({
            label: "DB record location",
            name: `${name}AttributeDbLocation`,
            value: "organizations",
          })}
          ${renderEntityManagementTextField({
            label: "DB record name",
            name: `${name}AttributeDbName`,
            value: name,
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${name}-attribute-search`,
        title: "Search",
        description: "Search, filter, facet, and sort support declared by this attribute.",
        children: `
          ${renderEntityManagementSearchableToggle({
            name: `${name}AttributeSearchable`,
            searchable: attribute.search?.searchable ?? false,
          })}
          ${renderEntityManagementSearchOperatorsField({
            attributeName: name,
            operators: attribute.search?.operators ?? [],
          }).replace("entity-management-drawer-select-field\"", `entity-management-drawer-select-field" data-entity-management-attribute-search-config-field ${attribute.search?.searchable ? "" : "hidden"}`)}
          ${renderEntityManagementSelectField({
            description: "How searchable values are stored or resolved for this attribute.",
            fieldAttributes: `data-entity-management-attribute-search-config-field ${attribute.search?.searchable ? "" : "hidden"}`,
            label: "Storage model",
            name: `${name}AttributeSearchStorageModel`,
            options: entityManagementSearchStorageModelOptions,
            selectAttributes: "data-entity-management-attribute-search-storage-model",
            value: attribute.search?.storageModel ?? "notSearchable",
          })}
          ${renderEntityManagementSelectField({
            description: "Whether the supporting index is required, already present, or not applicable.",
            fieldAttributes: `data-entity-management-attribute-search-config-field ${attribute.search?.searchable ? "" : "hidden"}`,
            label: "Index posture",
            name: `${name}AttributeSearchIndexPosture`,
            options: entityManagementSearchIndexPostureOptions,
            selectAttributes: "data-entity-management-attribute-search-index-posture",
            value: attribute.search?.indexPosture ?? "notApplicable",
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${name}-attribute-validation`,
        title: "Validation",
        description: "Validation rules and messages that apply to this attribute.",
        children: `
          ${(attribute.validationRules?.length ? attribute.validationRules : [{
            ruleKey: "required",
            argumentType: "boolean",
            argumentValue: Boolean(attribute.required),
            messageKey: "validation.required",
            messageFallback: "This field is required.",
          }]).map((rule, index) => renderEntityManagementValidationRule({
            attributeName: name,
            index,
            rule,
          })).join("")}
        `,
      })}
    </div>
  `;
}

function renderEntityManagementAttributesRegion() {
  const attributes = [
    { key: "attribute-email", formKey: "email", ...entityManagementAttributeSkeletonLists.email },
    { key: "attribute-description", formKey: "description", ...entityManagementAttributeSkeletonLists.description },
    { key: "attribute-status", formKey: "status", ...entityManagementAttributeSkeletonLists.status },
    { key: "attribute-owner", formKey: "owner", ...entityManagementAttributeSkeletonLists.owner },
    { key: "attribute-created-at", formKey: "createdAt", ...entityManagementAttributeSkeletonLists.createdAt },
    { key: "attribute-updated-at", formKey: "updatedAt", ...entityManagementAttributeSkeletonLists.updatedAt },
  ];
  return renderNestedListPicker({
    label: "Attributes",
    description: "Common attributes available for this entity definition.",
    items: attributes.map((attribute) => ({
      key: attribute.key,
      label: attribute.label,
      summary: attribute.summary,
      description: attribute.description,
      content: renderEntityManagementAttributePanel({ attribute }),
    })),
  });
}

function renderEntityManagementCatalogsRegion() {
  return renderNestedListPicker({
    addAction: {
      label: "Add Catalog",
      ariaLabel: "Add another value catalog",
    },
    label: "Catalogs",
    description: "Enum value catalogs this entity can use for constrained attribute values.",
    items: [
      {
        key: "catalog-status",
        ...entityManagementCatalogSkeletonLists.statusCatalog,
        content: renderEntityManagementCatalogDefinitionPanel({
          catalogDescription: entityManagementCatalogSkeletonLists.statusCatalog.description,
          catalogName: entityManagementCatalogSkeletonLists.statusCatalog.label,
          key: "statusCatalog",
          options: entityManagementCatalogSkeletonLists.statusCatalog.options,
          scope: entityManagementCatalogSkeletonLists.statusCatalog.scope,
        }),
      },
      {
        key: "catalog-priority",
        ...entityManagementCatalogSkeletonLists.priorityCatalog,
        content: renderEntityManagementCatalogDefinitionPanel({
          catalogDescription: entityManagementCatalogSkeletonLists.priorityCatalog.description,
          catalogName: entityManagementCatalogSkeletonLists.priorityCatalog.label,
          key: "priorityCatalog",
          options: entityManagementCatalogSkeletonLists.priorityCatalog.options,
          scope: entityManagementCatalogSkeletonLists.priorityCatalog.scope,
        }),
      },
      {
        key: "catalog-timezone",
        ...entityManagementCatalogSkeletonLists.timezoneCatalog,
        content: renderEntityManagementCatalogDefinitionPanel({
          catalogDescription: entityManagementCatalogSkeletonLists.timezoneCatalog.description,
          catalogName: entityManagementCatalogSkeletonLists.timezoneCatalog.label,
          key: "timezoneCatalog",
          options: entityManagementCatalogSkeletonLists.timezoneCatalog.options,
          scope: entityManagementCatalogSkeletonLists.timezoneCatalog.scope,
        }),
      },
      {
        key: "catalog-country-code",
        ...entityManagementCatalogSkeletonLists.countryCodeCatalog,
        content: renderEntityManagementCatalogDefinitionPanel({
          catalogDescription: entityManagementCatalogSkeletonLists.countryCodeCatalog.description,
          catalogName: entityManagementCatalogSkeletonLists.countryCodeCatalog.label,
          key: "countryCodeCatalog",
          options: entityManagementCatalogSkeletonLists.countryCodeCatalog.options,
          scope: entityManagementCatalogSkeletonLists.countryCodeCatalog.scope,
        }),
      },
    ],
  });
}

function renderEntityManagementPlacementSecondaryNav({ enabled, key, selectedEntity }) {
  const toggleId = `entity-management-${key}-secondary-nav-toggle`;
  return `
    <div class="entity-management-form-grid">
      <label class="entity-management-subworkflow-toggle form-field-span-2" for="${escapeHtml(toggleId)}">
        <span>
          <strong>Secondary nav</strong>
          <small>Show record-level secondary navigation inside this drawer region.</small>
        </span>
        <input id="${escapeHtml(toggleId)}" type="checkbox" name="${escapeHtml(`${key}SecondaryNavEnabled`)}" value="true" data-entity-management-placement-secondary-nav-toggle ${enabled ? "checked" : ""} />
      </label>
      <div class="form-field-span-2" data-entity-management-placement-secondary-nav-source ${enabled ? "" : "hidden"}>
        ${renderEntityManagementDrawerSelectField({
          availableTitle: "Available Child Entities",
          closeLabel: "Close child entity selector",
          description: "Records from this child entity populate the secondary nav for the placement.",
          dialogTitle: "Choose secondary nav child entity",
          drawerEyebrow: "Secondary nav",
          emptySummary: "Choose child entity",
          inputName: `${key}SecondaryNavEntity`,
          label: "Child entity records",
          maxSelections: 1,
          options: entityManagementChildEntityOptions,
          searchPlaceholder: "Search child entities",
          selectedEmpty: "No child entity selected.",
          selectedTitle: "Selected Child Entity",
          value: selectedEntity,
          viewKey: key,
        })}
      </div>
    </div>
  `;
}

function renderEntityManagementPlacementAttributeSectionRow({
  entityKey,
  index,
  note,
  placementKey,
  section,
}) {
  const label = section.label ?? `Section ${index + 1}`;
  const sectionNote = note ?? (entityKey === "organization"
    ? "Included attributes can display in this drawer section. Secondary nav is off, so attributes come from the parent entity."
    : "Included attributes can display in this drawer section. Secondary nav is on, so attributes come from the selected child entity.");
  return `
    <article class="entity-management-placement-attribute-section" data-entity-management-placement-attribute-section data-placement-section-index="${escapeHtml(String(index))}">
      <div class="form-field entity-management-field entity-management-placement-section-name" ${renderEvidenceTargetAttributes({ name: "Section name", value: label })}>
        <label class="form-field-label" for="entity-management-${escapeHtml(placementKey)}-placement-section-${escapeHtml(String(index + 1))}-name">Section name</label>
        ${renderEntityManagementEvidenceButton("Section name")}
        ${renderEntityManagementAiButton("Section name")}
        <input id="entity-management-${escapeHtml(placementKey)}-placement-section-${escapeHtml(String(index + 1))}-name" class="form-field-input" type="text" name="${escapeHtml(`${placementKey}PlacementSection${index + 1}Name`)}" value="${escapeHtml(label)}" data-entity-management-placement-section-name />
      </div>
      <div class="entity-management-workflow-status-location" aria-label="Section location">
        <button class="entity-management-workflow-status-move" type="button" aria-label="Move section up" data-entity-management-placement-section-move="up" ${index === 0 ? "disabled" : ""}>
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="m6 15 6-6 6 6" />
          </svg>
        </button>
        <button class="entity-management-workflow-status-move" type="button" aria-label="Move section down" data-entity-management-placement-section-move="down">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
      <div class="entity-management-placement-section-attributes">
        ${renderEntityManagementViewAttributeSelector({
          entityKey,
          inputName: `${placementKey}PlacementSection${index + 1}Attributes`,
          note: sectionNote,
          selectedValues: [...(section.attributes ?? getEntityManagementPlacementAttributeDefaults(entityKey))],
        })}
      </div>
      <div class="entity-management-workflow-status-row-actions">
        <button class="entity-management-workflow-status-remove" type="button" aria-label="Remove placement section" data-entity-management-placement-section-remove>
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M6 9l1 11h10l1-11" />
            <path d="M10 12v5" />
            <path d="M14 12v5" />
          </svg>
        </button>
        <button class="entity-management-workflow-status-add" type="button" aria-label="Add placement section" data-entity-management-placement-section-add>
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </article>
  `;
}

function renderEntityManagementPlacementAttributeBuilder({ entityKey, key, sections }) {
  const effectiveSections = sections?.length
    ? sections
    : [{ label: "Section 1", attributes: getEntityManagementPlacementAttributeDefaults(entityKey) }];
  return `
    <div class="entity-management-placement-attribute-builder" data-entity-management-placement-attribute-builder="${escapeHtml(key)}" data-entity-management-attribute-source="${escapeHtml(entityKey)}">
      ${effectiveSections.map((section, index) => renderEntityManagementPlacementAttributeSectionRow({
        entityKey,
        index,
        placementKey: key,
        section,
      })).join("")}
    </div>
  `;
}

function renderEntityManagementPlacementPanel({
  description,
  key,
  label,
  secondaryNavEnabled,
  secondaryNavEntity,
  sections,
  selectedAttributes,
}) {
  const attributeSourceEntity = secondaryNavEnabled && secondaryNavEntity ? secondaryNavEntity : "organization";
  return `
    <div class="entity-management-view-definition" data-entity-management-placement-definition="${escapeHtml(key)}">
      ${renderEntityManagementViewSection({
        id: `${key}-placement-details`,
        title: "Placement details",
        description: "Drawer primary region represented by this placement record.",
        children: `
          ${renderEntityManagementTextField({
            editable: false,
            label: "Placement name",
            name: `${key}PlacementName`,
            value: label,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Description",
            multiline: true,
            name: `${key}PlacementDescription`,
            value: description,
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: `${key}-placement-secondary-nav`,
        title: "Secondary nav",
        description: "Record source used to populate secondary navigation inside this drawer region.",
        children: renderEntityManagementPlacementSecondaryNav({
          enabled: secondaryNavEnabled,
          key,
          selectedEntity: secondaryNavEntity,
        }),
      })}
      ${renderEntityManagementViewSection({
        id: `${key}-placement-attributes`,
        title: "Attributes",
        description: "Drawer sections and the attributes displayed inside each section, ordered by screen placement priority.",
        children: renderEntityManagementPlacementAttributeBuilder({
          entityKey: attributeSourceEntity,
          key,
          sections: sections ?? [{ label: "Section 1", attributes: selectedAttributes }],
        }),
      })}
    </div>
  `;
}

function renderEntityManagementPlacementsRegion() {
  return renderNestedListPicker({
    label: "Display",
    description: "Drawer primary regions and the ordered sections displayed in each region.",
    items: Object.entries(entityManagementPlacementSkeletonLists).map(([key, placement]) => ({
      key: `placement-${key.replaceAll(/([A-Z])/g, "-$1").toLowerCase()}`,
      label: placement.label,
      summary: placement.summary,
      description: placement.description,
      content: renderEntityManagementPlacementPanel({
        description: placement.description,
        key,
        label: placement.label,
        secondaryNavEnabled: placement.secondaryNavEnabled,
        secondaryNavEntity: placement.secondaryNavEntity,
        sections: placement.sections,
        selectedAttributes: [...placement.attributes],
      }),
    })),
  });
}

function getEntityManagementActionModel(capability, {
  actionFamily = "record",
  defaultApiRoute = `POST /v1/organizations/:organizationId/${capability.key}`,
  ownerKey = "organization",
  owningLayer = "runtime",
  keyPrefix = `entity.organization.action.${capability.key}`,
  subjectLabel = "organization record",
} = {}) {
  const actionKey = capability.key;
  const requestBodyKey = `${keyPrefix}.requestBody`;
  const responseBodyKey = `${keyPrefix}.responseBody`;
  return {
    actionKey,
    actionFamily,
    actionKeyPrefix: keyPrefix,
    owningLayer,
    ownerKey,
    apiRoute: capability.apiRoute ?? defaultApiRoute,
    labelKey: `${keyPrefix}.label`,
    labelFallback: capability.label,
    descriptionKey: `${keyPrefix}.description`,
    descriptionFallback: capability.description,
    requestBody: {
      bodyKey: requestBodyKey,
      bodyFallback: `${capability.label} request body for the ${subjectLabel} action.`,
      schemaTemplate: {
        actorContext: "{{actorContext}}",
        ownerKey,
        targetId: "{{targetId}}",
        requestId: "{{requestId}}",
      },
    },
    responseBody: {
      bodyKey: responseBodyKey,
      bodyFallback: `${capability.label} response body for the ${subjectLabel} action.`,
      schemaTemplate: {
        actionKey,
        ownerKey,
        targetId: "{{targetId}}",
        outcome: "accepted|succeeded|failed",
      },
    },
    executionMode: capability.executionMode,
    compatibilityRisk: capability.compatibilityRisk,
    auditRequired: true,
    actionErrorModel: {
      defaultErrorKey: `${keyPrefix}.failed`,
      defaultErrorFallback: `The ${capability.label.toLowerCase()} action could not be completed.`,
      errors: [
        {
          errorKey: "conflict",
          messageKey: `${keyPrefix}.conflict`,
          messageFallback: `The ${subjectLabel} changed before ${capability.label.toLowerCase()} could complete.`,
          retryable: true,
          auditRequired: true,
        },
      ],
    },
  };
}

function getActionModelDomKey(actionKey) {
  return String(actionKey ?? "")
    .replaceAll("_", "-")
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .replace(/^-+/, "");
}

function getEntityManagementRecordActionModel(capability) {
  return getEntityManagementActionModel(capability, {
    actionFamily: "record",
    defaultApiRoute: entityManagementRecordActionRoutes[capability.key] ?? `POST /v1/organizations/:organizationId/${capability.key}`,
    ownerKey: "organization",
    owningLayer: "runtime",
    keyPrefix: `entity.organization.action.${capability.key}`,
    subjectLabel: "organization record",
  });
}

function getEntityManagementStructureActionModel(capability) {
  return getEntityManagementActionModel(capability, {
    actionFamily: capability.actionFamily ?? "definition_structure",
    defaultApiRoute: capability.apiRoute ?? `POST /v1/entity-definitions/:entityId/${capability.key}`,
    ownerKey: "entity_definition",
    owningLayer: "platform",
    keyPrefix: `entityDefinition.action.${capability.key}`,
    subjectLabel: "entity definition",
  });
}

function renderEntityManagementActionBodySection({ actionModel, body, fieldSuffix, id, title, description }) {
  const schemaTemplate = JSON.stringify(body.schemaTemplate, null, 2);
  const isRequestBody = fieldSuffix === "RequestBody";
  const actionKey = actionModel.actionKey;
  return renderEntityManagementViewSection({
    id,
    title,
    description,
    children: `
      ${isRequestBody ? renderEntityManagementTextField({
        editable: false,
        label: "API route",
        name: `${actionKey}ApiRoute`,
        value: actionModel.apiRoute,
      }) : ""}
      ${renderEntityManagementTextField({
        editable: false,
        label: "Body key",
        name: `${actionKey}${fieldSuffix}Key`,
        value: body.bodyKey,
      })}
      ${renderEntityManagementTextField({
        editable: false,
        label: "Body fallback",
        multiline: true,
        name: `${actionKey}${fieldSuffix}Fallback`,
        value: body.bodyFallback,
      })}
      ${renderEntityManagementTextField({
        editable: false,
        label: "Schema template",
        multiline: true,
        name: `${actionKey}${fieldSuffix}SchemaTemplate`,
        rows: schemaTemplate.split("\n").length,
        value: schemaTemplate,
      })}
    `,
  });
}

function renderEntityManagementActionModelErrorCard({ actionModel, errorKey }) {
  const actionKey = actionModel.actionKey;
  const messageKey = `${actionModel.actionKeyPrefix}.${errorKey}`;
  const auditType = `${actionModel.actionKeyPrefix}.${errorKey}.audit`;
  const fallback = `The ${actionKey} action could not complete because ${errorKey}.`;
  return `
    <details class="entity-management-action-error-card" data-entity-management-action-error="${escapeHtml(errorKey)}">
      <summary>
        <span>
          <strong>${escapeHtml(errorKey)}</strong>
          <em>${escapeHtml(messageKey)}</em>
        </span>
      </summary>
      <div class="entity-management-action-error-card-body">
        ${renderEntityManagementTextField({
          editable: false,
          label: "Message key",
          name: `${actionKey}${errorKey}MessageKey`,
          value: messageKey,
        })}
        ${renderEntityManagementTextField({
          editable: false,
          label: "Message fallback",
          multiline: true,
          name: `${actionKey}${errorKey}MessageFallback`,
          value: fallback,
        })}
        ${renderEntityManagementTextField({
          editable: false,
          label: "Audit type",
          name: `${actionKey}${errorKey}AuditType`,
          value: auditType,
        })}
        ${renderEntityManagementTextField({
          editable: false,
          label: "Log template",
          multiline: true,
          name: `${actionKey}${errorKey}LogTemplate`,
          value: `actor={{actorId}} action=${actionKey} owner=${actionModel.ownerKey} target={{targetId}} outcome=error error=${errorKey} request={{requestId}}`,
        })}
      </div>
    </details>
  `;
}

function renderEntityManagementActionModelSuccessAuditTypes({ actionModel }) {
  const { actionKey } = actionModel;
  const auditTypes = [
    {
      label: "Action requested",
      value: `${actionModel.actionKeyPrefix}.requested`,
      template: `actor={{actorId}} action=${actionKey} owner=${actionModel.ownerKey} target={{targetId}} outcome=requested request={{requestId}}`,
    },
    {
      label: "Action succeeded",
      value: `${actionModel.actionKeyPrefix}.succeeded`,
      template: `actor={{actorId}} action=${actionKey} owner=${actionModel.ownerKey} target={{targetId}} outcome=success request={{requestId}}`,
    },
  ];
  return `
    <div class="entity-management-action-audit-list form-field-span-2">
      ${auditTypes.map((auditType) => `
        <article class="entity-management-action-audit-card" ${renderEvidenceTargetAttributes({ name: auditType.label, value: auditType.value })}>
          <span>${escapeHtml(auditType.label)}</span>
          ${renderEntityManagementEvidenceButton(auditType.label)}
          ${renderEntityManagementAiButton(auditType.label)}
          <strong>${escapeHtml(auditType.value)}</strong>
          <code>${escapeHtml(auditType.template)}</code>
        </article>
      `).join("")}
    </div>
  `;
}

function renderEntityManagementActionModelPanel({ capability, modelFactory = getEntityManagementRecordActionModel }) {
  const actionModel = modelFactory(capability);
  const isStructureAction = modelFactory === getEntityManagementStructureActionModel;
  const subject = isStructureAction ? "entity-definition structure action" : "record capability";
  return `
    <div class="entity-management-view-definition entity-management-action-model-definition" data-entity-management-action-model-definition="${escapeHtml(capability.key)}">
      ${renderEntityManagementViewSection({
        id: `${capability.key}-action-model`,
        title: "Action model",
        description: isStructureAction
          ? "Definition-structure action metadata used by governed entity-builder hooks."
          : "Runtime capability metadata populated when entity runtime capabilities are created.",
        children: `
          ${renderEntityManagementTextField({
            editable: false,
            label: "Action key",
            name: `${capability.key}ActionKey`,
            value: actionModel.actionKey,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Action family",
            name: `${capability.key}ActionFamily`,
            value: actionModel.actionFamily,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Owning layer",
            name: `${capability.key}OwningLayer`,
            value: actionModel.owningLayer,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Owner key",
            name: `${capability.key}OwnerKey`,
            value: actionModel.ownerKey,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Label key",
            name: `${capability.key}LabelKey`,
            value: actionModel.labelKey,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Label fallback",
            name: `${capability.key}LabelFallback`,
            value: actionModel.labelFallback,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Description key",
            name: `${capability.key}DescriptionKey`,
            value: actionModel.descriptionKey,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Description fallback",
            multiline: true,
            name: `${capability.key}DescriptionFallback`,
            value: actionModel.descriptionFallback,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Execution mode",
            name: `${capability.key}ExecutionMode`,
            value: actionModel.executionMode,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Compatibility risk",
            name: `${capability.key}CompatibilityRisk`,
            value: actionModel.compatibilityRisk,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Audit required",
            name: `${capability.key}AuditRequired`,
            value: String(actionModel.auditRequired),
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Default error key",
            name: `${capability.key}DefaultErrorKey`,
            value: actionModel.actionErrorModel.defaultErrorKey,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Default error fallback",
            multiline: true,
            name: `${capability.key}DefaultErrorFallback`,
            value: actionModel.actionErrorModel.defaultErrorFallback,
          })}
          ${renderEntityManagementTextField({
            editable: false,
            label: "Seed error model",
            multiline: true,
            name: `${capability.key}SeedErrorModel`,
            value: JSON.stringify(actionModel.actionErrorModel.errors[0], null, 2),
          })}
        `,
      })}
      ${renderEntityManagementActionBodySection({
        actionModel,
        body: actionModel.requestBody,
        fieldSuffix: "RequestBody",
        id: `${capability.key}-request-body`,
        title: "Request body",
        description: `Generated request payload contract for this ${subject}.`,
      })}
      ${renderEntityManagementActionBodySection({
        actionModel,
        body: actionModel.responseBody,
        fieldSuffix: "ResponseBody",
        id: `${capability.key}-response-body`,
        title: "Response body",
        description: `Generated response payload contract for this ${subject}.`,
      })}
      ${renderEntityManagementViewSection({
        id: `${capability.key}-success-audit-types`,
        title: "Success audit types",
        description: "Logs generated when this capability is requested and succeeds.",
        children: renderEntityManagementActionModelSuccessAuditTypes({ actionModel }),
      })}
      ${renderEntityManagementViewSection({
        id: `${capability.key}-error-audit-types`,
        title: "Error audit types and messaging",
        description: "Error keys, user-facing messages, and log templates for this capability.",
        children: `
          <div class="entity-management-action-error-list form-field-span-2">
            ${entityManagementRecordActionErrorTypes.map((errorKey) => renderEntityManagementActionModelErrorCard({
              actionModel,
              errorKey,
            })).join("")}
          </div>
        `,
      })}
    </div>
  `;
}

function renderEntityManagementActionModelsRecordRegion() {
  return renderNestedListPicker({
    label: "Action Models - Record",
    description: "Default runtime record capabilities generated for this entity.",
    items: entityManagementRecordActionCapabilities.map((capability) => ({
      key: `record-action-${getActionModelDomKey(capability.key)}`,
      label: capability.label,
      summary: capability.executionMode,
      description: capability.description,
      content: renderEntityManagementActionModelPanel({ capability }),
    })),
  });
}

function renderEntityManagementActionModelsEntityStructureRegion() {
  return renderNestedListPicker({
    label: "Action Models - Entity Structure",
    description: "Read-only structure capabilities for entity definitions and their managed domains.",
    items: entityManagementStructureActionCapabilities.map((capability) => ({
      key: `structure-action-${getActionModelDomKey(capability.key)}`,
      label: capability.label,
      summary: capability.executionMode,
      description: capability.description,
      content: renderEntityManagementActionModelPanel({
        capability,
        modelFactory: getEntityManagementStructureActionModel,
      }),
    })),
  });
}

function renderEntityManagementPermissionFamily({ family, permissionKey, enabled = false }) {
  const switchId = `entity-management-${permissionKey}-${family.key}-available`;
  return renderEntityManagementViewSection({
    id: `${permissionKey}-${family.key}-permissions`,
    title: family.label,
    description: family.description,
    children: `
      <section class="entity-management-permission-family form-field-span-2" data-entity-management-permission-family="${escapeHtml(family.key)}">
        <label class="entity-management-permission-family-switch" for="${escapeHtml(switchId)}">
          <input id="${escapeHtml(switchId)}" type="checkbox" name="${escapeHtml(`${permissionKey}${family.key}Available`)}" ${enabled ? "checked" : ""} data-entity-management-permission-family-toggle />
          <span>
            <strong>Make available</strong>
            <em>Expose this capability family to the selected role.</em>
          </span>
        </label>
        <div class="entity-management-permission-bulk-actions" aria-label="${escapeHtml(`${family.label} bulk actions`)}">
          <button class="entity-management-permission-bulk-button" type="button" data-entity-management-permission-bulk="select">Select all</button>
          <button class="entity-management-permission-bulk-button" type="button" data-entity-management-permission-bulk="deselect">Deselect all</button>
        </div>
        <div class="entity-management-view-workflow-status-list entity-management-permission-capability-list" data-entity-management-permission-capability-list ${enabled ? "" : "hidden"}>
          ${family.capabilities.map((capability, index) => {
            const isAvailable = enabled && index < 3;
            return `
              <button
                class="entity-management-view-workflow-status-toggle entity-management-permission-capability-toggle${isAvailable ? "" : " is-hidden"}"
                type="button"
                aria-pressed="${escapeHtml(String(isAvailable))}"
                aria-label="${escapeHtml(`${isAvailable ? "Disable" : "Enable"} ${capability.label}`)}"
                data-capability-key="${escapeHtml(capability.key)}"
                data-entity-management-permission-capability-toggle
              >
                ${renderEntityManagementPermissionCapabilityIcon({ available: isAvailable })}
                <span>${escapeHtml(capability.label)}</span>
                <em>${isAvailable ? "Available" : "Unavailable"}</em>
              </button>
            `;
          }).join("")}
        </div>
      </section>
    `,
  });
}

function renderEntityManagementPermissionCapabilityIcon({ available = false } = {}) {
  return `
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      ${available
        ? '<path d="m5 12 4 4 10-10" />'
        : '<path d="m7 7 10 10" /><path d="m17 7-10 10" />'}
    </svg>
  `;
}

function renderEntityManagementPermissionRolePanel({ key, roleValue = "llm" }) {
  const selectedRole = roleValue || "llm";
  return `
    <div class="entity-management-view-definition entity-management-permission-definition" data-entity-management-permission-definition="${escapeHtml(key)}">
      ${renderEntityManagementPermissionActions({ permissionKey: key })}
      ${renderEntityManagementViewSection({
        id: `${key}-role`,
        title: "Role",
        description: "Role receiving capability access for this entity.",
        children: renderEntityManagementDrawerSelectField({
          viewKey: key,
          label: "Role",
          inputName: `${key}PermissionRole`,
          value: selectedRole,
          options: entityManagementPermissionRoleOptions,
          emptySummary: "Choose role",
          drawerEyebrow: "Role",
          dialogTitle: "Choose role",
          closeLabel: "Close role selector",
          searchPlaceholder: "Search roles",
          selectedTitle: "Selected Role",
          selectedEmpty: "No role selected yet.",
          availableTitle: "Available Roles",
          description: "Single role selected for this permission entry.",
          maxSelections: 1,
        }),
      })}
      ${entityManagementPermissionCapabilityFamilies.map((family, index) => renderEntityManagementPermissionFamily({
        enabled: index === 0,
        family,
        permissionKey: key,
      })).join("")}
    </div>
  `;
}

function renderEntityManagementPermissionsRegion() {
  return renderNestedListPicker({
    addAction: {
      label: "Add Role",
      ariaLabel: "Add another permission role",
    },
    label: "Permissions",
    description: "Role access to entity record and structure capability families.",
    items: [
      {
        key: "permission-role-llm",
        label: "LLM",
        summary: "Role permissions",
        description: "Default machine-assisted authoring actor",
        content: renderEntityManagementPermissionRolePanel({ key: "llmPermission", roleValue: "llm" }),
      },
    ],
  });
}

function renderEntityManagementMigrationModelRegion() {
  return `
    <div class="entity-management-view-definition" data-entity-management-view-definition="migrationModel" data-entity-management-migration-model-definition="organization">
      ${renderEntityManagementViewSection({
        id: "migration-model-status",
        title: "Migration status",
        description: "Current adoption posture from repo/source artifacts into persistent entity-definition truth.",
        children: `
          ${renderEntityManagementSelectField({
            label: "Migration status",
            name: "entityMigrationStatus",
            options: entityManagementMigrationStatusOptions,
            value: "notStarted",
          })}
          ${renderEntityManagementSelectField({
            label: "Current source posture",
            name: "entityMigrationCurrentSourcePosture",
            options: entityManagementMigrationSourcePostureOptions,
            value: "repoArtifactsPrimary",
          })}
          ${renderEntityManagementSelectField({
            label: "Target source posture",
            name: "entityMigrationTargetSourcePosture",
            options: entityManagementMigrationSourcePostureOptions,
            value: "persistentEntityDefinitionPrimary",
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: "migration-model-target",
        title: "Source and target",
        description: "Repo artifact inventory and the persistent record this migration should promote.",
        children: `
          ${renderEntityManagementTextField({
            description: "Explicit source artifact keys identified during migration inventory. Empty until inventory starts.",
            label: "Current artifact keys",
            multiline: true,
            name: "entityMigrationCurrentArtifactKeys",
            value: "[]",
          })}
          ${renderEntityManagementTextField({
            label: "Target persistent record key",
            name: "entityMigrationTargetPersistentRecordKey",
            value: "organization",
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: "migration-model-compatibility",
        title: "Compatibility checks",
        description: "Checks required before persistent entity definition can become primary truth.",
        children: renderEntityManagementDrawerSelectField({
          availableTitle: "Available Checks",
          closeLabel: "Close compatibility check selector",
          dialogTitle: "Choose compatibility checks",
          drawerEyebrow: "Migration compatibility",
          emptySummary: "Choose checks",
          inputName: "entityMigrationCompatibilityChecksRequired",
          label: "Compatibility checks required",
          options: entityManagementMigrationCompatibilityCheckOptions,
          searchPlaceholder: "Search checks",
          selectedEmpty: "No compatibility checks selected yet.",
          selectedTitle: "Selected Checks",
          value: "apiContractParity,persistenceSchemaParity,dataDictionaryParity,permissionMappingParity",
          viewKey: "migrationModel",
        }),
      })}
      ${renderEntityManagementViewSection({
        id: "migration-model-blockers",
        title: "Blockers and evidence",
        description: "Migration-only blockers and evidence keys. Future definition changes should use source authority, lifecycle/versioning, action models, and evidence.",
        children: `
          ${renderEntityManagementTextField({
            description: "Explicit blocker keys or notes. Empty when no migration blockers are known.",
            label: "Blocking issues",
            multiline: true,
            name: "entityMigrationBlockingIssues",
            value: "[]",
          })}
          ${renderEntityManagementTextField({
            description: "Evidence keys proving migration parity or promotion readiness.",
            label: "Migration evidence keys",
            multiline: true,
            name: "entityMigrationEvidenceKeys",
            value: "[]",
          })}
        `,
      })}
    </div>
  `;
}

function renderEntityManagementGenerationModelRegion() {
  return `
    <div class="entity-management-view-definition" data-entity-management-view-definition="generationModel" data-entity-management-generation-model-definition="organization">
      ${renderEntityManagementViewSection({
        id: "generation-model-mode",
        title: "Generation mode",
        description: "What this entity definition is allowed to generate or drive.",
        children: `
          ${renderEntityManagementSelectField({
            label: "Generation mode",
            name: "entityGenerationMode",
            options: entityManagementGenerationModeOptions,
            value: "previewThenApply",
          })}
          <label class="entity-management-subworkflow-toggle form-field-span-2" ${renderEvidenceTargetAttributes({ name: "Drift detection required", value: "true" })}>
            <span>
              <strong>Drift detection required</strong>
              <small>Generated output must be checked against source truth before it is applied or trusted.</small>
            </span>
            ${renderEntityManagementEvidenceButton("Drift detection required")}
            ${renderEntityManagementAiButton("Drift detection required")}
            <input type="checkbox" name="entityGenerationDriftDetectionRequired" value="true" checked />
          </label>
        `,
      })}
      ${renderEntityManagementViewSection({
        id: "generation-model-allowed",
        title: "Allowed outputs",
        description: "Cautious V1 outputs this entity may generate or plan.",
        children: renderEntityManagementDrawerSelectField({
          availableTitle: "Available Output Categories",
          closeLabel: "Close allowed output selector",
          dialogTitle: "Choose allowed outputs",
          drawerEyebrow: "Generation outputs",
          emptySummary: "Choose outputs",
          inputName: "entityGenerationAllowedOutputCategories",
          label: "Allowed output categories",
          options: entityManagementGenerationOutputCategoryOptions,
          searchPlaceholder: "Search outputs",
          selectedEmpty: "No allowed outputs selected yet.",
          selectedTitle: "Selected Outputs",
          value: "docs,uiDefaults,designSystemPreview,validationConfig,searchConfig,capabilityMappingDraft,apiContractDraft,testDraft",
          viewKey: "generationModel",
        }),
      })}
      ${renderEntityManagementViewSection({
        id: "generation-model-blocked",
        title: "Blocked outputs",
        description: "High-risk outputs blocked by default until explicitly approved with heavier compatibility checks.",
        children: renderEntityManagementDrawerSelectField({
          availableTitle: "Available Output Categories",
          closeLabel: "Close blocked output selector",
          dialogTitle: "Choose blocked outputs",
          drawerEyebrow: "Generation guardrails",
          emptySummary: "Choose blocked outputs",
          inputName: "entityGenerationBlockedOutputCategories",
          label: "Blocked output categories",
          options: entityManagementGenerationOutputCategoryOptions,
          searchPlaceholder: "Search outputs",
          selectedEmpty: "No blocked outputs selected yet.",
          selectedTitle: "Blocked Outputs",
          value: "runtimeSource,databaseMigration,authorizationLogic,permissionGrant",
          viewKey: "generationModel",
        }),
      })}
      ${renderEntityManagementViewSection({
        id: "generation-model-evidence",
        title: "Evidence",
        description: "Evidence keys proving why generation permissions and blocked categories are acceptable.",
        children: renderEntityManagementTextField({
          description: "Evidence keys for generation guardrails. Empty until governance evidence is attached.",
          label: "Evidence keys",
          multiline: true,
          name: "entityGenerationEvidenceKeys",
          value: "[]",
        }),
      })}
    </div>
  `;
}

function renderEntityManagementComplianceAuditToggle({ checked = true, label, name, note }) {
  return `
    <label class="entity-management-subworkflow-toggle form-field-span-2" ${renderEvidenceTargetAttributes({ name: label, value: checked ? "true" : "false" })}>
      <span>
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(note)}</small>
      </span>
      ${renderEntityManagementEvidenceButton(label)}
      ${renderEntityManagementAiButton(label)}
      <input type="checkbox" name="${escapeHtml(name)}" value="true" ${checked ? "checked" : ""} />
    </label>
  `;
}

function renderEntityManagementComplianceModelRegion() {
  return `
    <div class="entity-management-view-definition" data-entity-management-view-definition="complianceModel" data-entity-management-compliance-model-definition="organization">
      ${renderEntityManagementViewSection({
        id: "compliance-model-privacy-security",
        title: "Privacy and security",
        description: "Entity-level compliance summary for auditors, generators, reports, and reviewers.",
        children: `
          ${renderEntityManagementSelectField({
            label: "Privacy impact",
            name: "entityCompliancePrivacyImpact",
            options: entityManagementCompliancePrivacyImpactOptions,
            value: "containsSensitivePII",
          })}
          ${renderEntityManagementDrawerSelectField({
            availableTitle: "Available Categories",
            closeLabel: "Close sensitive privacy category selector",
            dialogTitle: "Choose sensitive privacy categories",
            drawerEyebrow: "Sensitive privacy",
            emptySummary: "Choose categories",
            inputName: "entityComplianceSensitivePrivacyCategoriesPresent",
            label: "Sensitive privacy categories present",
            options: entityManagementSensitivePrivacyCategoryOptions.map((option) => ({
              value: option.value,
              label: option.label,
              description: "Sensitive category present on one or more attributes.",
              attribute: "Entity summary",
            })),
            searchPlaceholder: "Search categories",
            selectedEmpty: "No sensitive privacy categories selected yet.",
            selectedTitle: "Selected Categories",
            value: "governmentIdentifiers",
            viewKey: "complianceModel",
          })}
          ${renderEntityManagementSelectField({
            label: "Security impact",
            name: "entityComplianceSecurityImpact",
            options: entityManagementSecurityClassificationOptions,
            value: "restricted",
          })}
          ${renderEntityManagementComplianceAuditToggle({
            label: "Audit required",
            name: "entityComplianceAuditRequired",
            note: "Entity-level operations require durable audit events.",
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: "compliance-model-lifecycle",
        title: "Lifecycle and export",
        description: "Default retention, deletion, legal hold, export, and cleanup posture.",
        children: `
          ${renderEntityManagementTextField({
            label: "Retention policy key",
            name: "entityComplianceRetentionPolicyKey",
            value: "standardTenantRecordRetention",
          })}
          ${renderEntityManagementSelectField({
            label: "Delete posture",
            name: "entityComplianceDeletePosture",
            options: entityManagementComplianceDeletePostureOptions,
            value: "softDeleteWithPendingDeletion",
          })}
          ${renderEntityManagementComplianceAuditToggle({
            label: "Legal hold supported",
            name: "entityComplianceLegalHoldSupported",
            note: "Records can be held from deletion or cleanup when required.",
          })}
          ${renderEntityManagementSelectField({
            label: "Export posture",
            name: "entityComplianceExportPosture",
            options: entityManagementComplianceExportPostureOptions,
            value: "privacyReviewedExport",
          })}
          ${renderEntityManagementSelectField({
            label: "Cleanup posture",
            name: "entityComplianceCleanupPosture",
            options: entityManagementComplianceCleanupPostureOptions,
            value: "featureOwnedCleanup",
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: "compliance-model-encryption",
        title: "Encryption posture",
        description: "Entity-level encryption defaults and key-management policy for auditability.",
        children: `
          ${renderEntityManagementSelectField({
            label: "At rest",
            name: "entityComplianceEncryptionAtRest",
            options: entityManagementComplianceEncryptionRequirementOptions,
            value: "required",
          })}
          ${renderEntityManagementSelectField({
            label: "In transit",
            name: "entityComplianceEncryptionInTransit",
            options: entityManagementComplianceEncryptionRequirementOptions,
            value: "required",
          })}
          ${renderEntityManagementSelectField({
            label: "Field level",
            name: "entityComplianceEncryptionFieldLevel",
            options: entityManagementComplianceEncryptionRequirementOptions,
            value: "notRequired",
          })}
          ${renderEntityManagementTextField({
            label: "Key management policy key",
            name: "entityComplianceKeyManagementPolicyKey",
            value: "platformStandardKms",
          })}
          ${renderEntityManagementTextField({
            description: "Attribute-specific encryption overrides for especially sensitive fields.",
            label: "Attribute overrides",
            multiline: true,
            name: "entityComplianceEncryptionAttributeOverrides",
            value: "[]",
          })}
        `,
      })}
      ${renderEntityManagementViewSection({
        id: "compliance-model-evidence",
        title: "Evidence",
        description: "Evidence keys proving the entity-level compliance posture.",
        children: renderEntityManagementTextField({
          description: "Evidence keys for entity-level compliance posture.",
          label: "Evidence keys",
          multiline: true,
          name: "entityComplianceEvidenceKeys",
          value: "[]",
        }),
      })}
    </div>
  `;
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
      key: "workflows",
      label: "Workflows",
      headerLabel: "Workflows",
      headerDescription: "Workflow definitions for how this entity is created, reviewed, and moved through lifecycle steps.",
      count: 3,
      content: renderEntityManagementWorkflowsRegion(),
    },
    {
      key: "views",
      label: "Views",
      headerLabel: "Views",
      headerDescription: "Who can access this entity in the system, where they'll find it and how it will behave.",
      count: 3,
      content: renderEntityManagementViewsRegion(),
    },
    {
      key: "relationships",
      label: "Relationships",
      headerLabel: "Relationships",
      headerDescription: "Field-complete relationship definitions for how this entity connects to other entities.",
      count: 3,
      content: renderEntityManagementRelationshipsRegion(),
    },
    {
      key: "attributes",
      label: "Attributes",
      headerLabel: "Attributes",
      headerDescription: "Common attributes available for this entity definition.",
      count: 6,
      content: renderEntityManagementAttributesRegion(),
    },
    {
      key: "catalogs",
      label: "Catalogs",
      headerLabel: "Catalogs",
      headerDescription: "Enum value catalogs this entity can use for constrained attribute values.",
      count: 4,
      content: renderEntityManagementCatalogsRegion(),
    },
    {
      key: "placements",
      label: "Display",
      headerLabel: "Display",
      headerDescription: "Drawer primary regions and the ordered sections displayed in each region.",
      count: Object.keys(entityManagementPlacementSkeletonLists).length,
      content: renderEntityManagementPlacementsRegion(),
    },
    {
      key: "permissions",
      label: "Permissions",
      headerLabel: "Permissions",
      headerDescription: "Role access to entity record and structure capability families.",
      count: 1,
      content: renderEntityManagementPermissionsRegion(),
    },
    {
      key: "generation-model",
      label: "Generation Model",
      headerLabel: "Generation Model",
      headerDescription: "What this entity definition is allowed to generate or drive.",
      count: 4,
      content: renderEntityManagementGenerationModelRegion(),
    },
    {
      key: "compliance-model",
      label: "Compliance Model",
      headerLabel: "Compliance Model",
      headerDescription: "Entity-level compliance posture for audit, generation, reporting, and review.",
      count: 4,
      content: renderEntityManagementComplianceModelRegion(),
    },
    {
      key: "migration-model",
      label: "Migration Model",
      headerLabel: "Migration Model",
      headerDescription: "Adoption tracking from current repo/source artifacts into persistent entity-definition truth.",
      count: 4,
      content: renderEntityManagementMigrationModelRegion(),
    },
    {
      key: "action-models-record",
      label: "Action Models - Record",
      headerLabel: "Action Models - Record",
      headerDescription: "Default runtime record capabilities generated for this entity.",
      count: entityManagementRecordActionCapabilities.length,
      content: renderEntityManagementActionModelsRecordRegion(),
    },
    {
      key: "action-models-entity-structure",
      label: "Action Models - Entity Structure",
      headerLabel: "Action Models - Entity Structure",
      headerDescription: "Read-only structure capabilities for entity definitions and their managed domains.",
      count: entityManagementStructureActionCapabilities.length,
      content: renderEntityManagementActionModelsEntityStructureRegion(),
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

function getEntityManagementFieldKeyFromTarget(target) {
  const control = target.querySelector("input[name], textarea[name], select[name]");
  const fieldName = control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement
    ? control.name
    : (target.dataset.evidenceElementName ?? "field").toLowerCase().replaceAll(" ", ".");
  const identityFieldKeys = new Set([
    "entityName",
    "stableEntityKey",
    "singularLabelKey",
    "singularLabelFallback",
    "pluralLabelKey",
    "pluralLabelFallback",
    "descriptionKey",
    "descriptionFallback",
    "purposeKey",
    "purposeFallback",
  ]);
  return identityFieldKeys.has(fieldName) ? `entityIdentity.${fieldName}` : fieldName;
}

function getEntityManagementAuthoringGuidanceFromTarget(target) {
  const fieldKey = getEntityManagementFieldKeyFromTarget(target);
  const elementName = target.dataset.evidenceElementName ?? "Element";
  const elementValue = target.dataset.evidenceElementValue ?? "";
  const defaultGuidance = {
    fieldKey,
    valueType: "text",
    authoringGuidance: {
      newEntity: {
        primaryMode: "recommendAndConfirm",
        fallbackModes: ["askHuman"],
      },
      repoMigration: {
        primaryMode: "deriveFromSourceTruth",
        fallbackModes: ["technicalReviewRequired"],
      },
    },
    writingGuidance: {
      audience: "platform maintainer and product stakeholder",
      tone: "plain-language, context-rich, human-facing",
      requiredContent: [
        "the durable meaning of this field",
        "how it helps humans maintain the entity definition",
      ],
      avoid: [
        "implementation jargon",
        "generic placeholder wording",
      ],
      goodExample: elementValue || "A clear, specific value that explains the entity definition field.",
      badExample: "A managed field.",
    },
    questionGuidance: {
      questionStyle: "one plain-language question at a time",
      avoid: [
        "platform jargon",
        "asking for technical mechanism choices when business intent is enough",
      ],
      recommendationPosture: "offer a recommended value when the LLM has enough context",
      exampleQuestion: `What should ${elementName.toLowerCase()} say for the people maintaining this entity definition?`,
    },
    validationGuidance: {
      required: true,
      defaultValue: "none",
    },
  };
  if (fieldKey !== "entityIdentity.descriptionFallback") {
    return { elementName, elementValue, ...defaultGuidance };
  }
  return {
    elementName,
    elementValue,
    fieldKey: "entityIdentity.descriptionFallback",
    valueType: "text",
    authoringGuidance: {
      newEntity: {
        primaryMode: "recommendAndConfirm",
        fallbackModes: ["askHuman"],
      },
      repoMigration: {
        primaryMode: "deriveFromSourceTruth",
        fallbackModes: ["technicalReviewRequired"],
      },
    },
    writingGuidance: {
      audience: "platform maintainer and product stakeholder",
      tone: "plain-language, context-rich, human-facing",
      requiredContent: [
        "what the entity represents",
        "where it fits in the business or product context",
      ],
      avoid: [
        "generic record wording",
        "implementation jargon",
        "empty phrases like 'managed record'",
      ],
      goodExample: "An organization represents a company, department, partner, or other business structure that the platform manages, displays, and connects to related records.",
      badExample: "A managed organization record.",
    },
    questionGuidance: {
      questionStyle: "one plain-language question at a time",
      avoid: [
        "platform jargon",
        "asking for technical mechanism choices when business intent is enough",
      ],
      recommendationPosture: "offer a recommended value when the LLM has enough context",
      exampleQuestion: "What kind of real-world thing should this entity represent for the people using the platform?",
    },
    validationGuidance: {
      required: true,
      defaultValue: "none",
    },
  };
}

function closeRecordManagementEvidenceDrawer(drawer) {
  drawer.dataset.recordManagementEvidenceView = "false";
  drawer.querySelector("[data-record-management-evidence-drawer]")?.remove();
}

function closeRecordManagementAiDrawer(drawer) {
  drawer.dataset.recordManagementAiView = "false";
  drawer.querySelector("[data-record-management-ai-drawer]")?.remove();
}

function renderGuidanceList(items) {
  return Array.isArray(items) && items.length
    ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "<p>None specified.</p>";
}

function renderRecordManagementAiGuidanceDrawer({ drawer, entityWorkspace, guidance }) {
  entityWorkspace.dataset.chatWorkspaceDrawerOpen = "true";
  drawer.hidden = false;
  drawer.dataset.recordManagementEditMode = "false";
  drawer.dataset.recordManagementEvidenceMode = "false";
  drawer.dataset.recordManagementEvidenceView = "false";
  drawer.dataset.recordManagementAiMode = "true";
  drawer.dataset.recordManagementAiView = "true";
  closeRecordManagementEvidenceDrawer(drawer);
  const evidenceToggle = drawer.querySelector("[data-record-management-evidence-mode-toggle]");
  const aiToggle = drawer.querySelector("[data-record-management-ai-mode-toggle]");
  if (evidenceToggle instanceof HTMLElement) {
    evidenceToggle.setAttribute("aria-pressed", "false");
  }
  if (aiToggle instanceof HTMLElement) {
    aiToggle.setAttribute("aria-pressed", "true");
  }
  const body = drawer.querySelector(".chat-workspace-list-drawer-body");
  if (!(body instanceof HTMLElement)) {
    return;
  }
  body.querySelector("[data-record-management-ai-drawer]")?.remove();
  body.insertAdjacentHTML("beforeend", `
    <aside class="record-management-evidence-drawer record-management-ai-guidance-drawer" aria-label="AI authoring guidance" data-record-management-ai-drawer>
      <div class="chat-workspace-list-drawer-header">
        <div class="chat-workspace-list-drawer-header-copy">
          <p>EntityDefinitionAuthoringGuidanceCatalog</p>
          <h4>${escapeHtml(guidance.elementName)}</h4>
          <div class="record-management-drawer-header-meta">
            <span>Field key</span>
            <span class="record-management-status-badge">${escapeHtml(guidance.fieldKey)}</span>
          </div>
        </div>
        <button class="icon-button" type="button" aria-label="Close AI authoring guidance" data-record-management-ai-return>
          <span class="icon-button-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </span>
        </button>
      </div>
      <section class="record-management-evidence-list" aria-label="EntityDefinitionAuthoringGuidanceCatalog">
        <article class="record-management-evidence-card">
          <dl>
            <div>
              <dt>Value type</dt>
              <dd>${escapeHtml(guidance.valueType)}</dd>
            </div>
            <div>
              <dt>Current value</dt>
              <dd>${escapeHtml(guidance.elementValue || "Not set")}</dd>
            </div>
          </dl>
        </article>
        <article class="record-management-evidence-card">
          <h5>Authoring guidance</h5>
          <dl>
            <div>
              <dt>New entity</dt>
              <dd>${escapeHtml(guidance.authoringGuidance.newEntity.primaryMode)}; fallback: ${escapeHtml(guidance.authoringGuidance.newEntity.fallbackModes.join(", "))}</dd>
            </div>
            <div>
              <dt>Repo migration</dt>
              <dd>${escapeHtml(guidance.authoringGuidance.repoMigration.primaryMode)}; fallback: ${escapeHtml(guidance.authoringGuidance.repoMigration.fallbackModes.join(", "))}</dd>
            </div>
          </dl>
        </article>
        <article class="record-management-evidence-card">
          <h5>Writing guidance</h5>
          <dl>
            <div>
              <dt>Audience</dt>
              <dd>${escapeHtml(guidance.writingGuidance.audience)}</dd>
            </div>
            <div>
              <dt>Tone</dt>
              <dd>${escapeHtml(guidance.writingGuidance.tone)}</dd>
            </div>
            <div>
              <dt>Required content</dt>
              <dd>${renderGuidanceList(guidance.writingGuidance.requiredContent)}</dd>
            </div>
            <div>
              <dt>Avoid</dt>
              <dd>${renderGuidanceList(guidance.writingGuidance.avoid)}</dd>
            </div>
            <div>
              <dt>Good example</dt>
              <dd>${escapeHtml(guidance.writingGuidance.goodExample)}</dd>
            </div>
            <div>
              <dt>Bad example</dt>
              <dd>${escapeHtml(guidance.writingGuidance.badExample)}</dd>
            </div>
          </dl>
        </article>
        <article class="record-management-evidence-card">
          <h5>Question guidance</h5>
          <dl>
            <div>
              <dt>Question style</dt>
              <dd>${escapeHtml(guidance.questionGuidance.questionStyle)}</dd>
            </div>
            <div>
              <dt>Avoid</dt>
              <dd>${renderGuidanceList(guidance.questionGuidance.avoid)}</dd>
            </div>
            <div>
              <dt>Recommendation posture</dt>
              <dd>${escapeHtml(guidance.questionGuidance.recommendationPosture)}</dd>
            </div>
            <div>
              <dt>Example question</dt>
              <dd>${escapeHtml(guidance.questionGuidance.exampleQuestion)}</dd>
            </div>
          </dl>
        </article>
        <article class="record-management-evidence-card">
          <h5>Validation guidance</h5>
          <dl>
            <div>
              <dt>Required</dt>
              <dd>${guidance.validationGuidance.required ? "true" : "false"}</dd>
            </div>
            <div>
              <dt>Default value</dt>
              <dd>${escapeHtml(guidance.validationGuidance.defaultValue)}</dd>
            </div>
          </dl>
        </article>
      </section>
    </aside>
  `);
  drawer.querySelector("[data-record-management-ai-return]")?.focus();
}

function renderRecordManagementEvidenceDrawer({ drawer, entityWorkspace, evidence }) {
  entityWorkspace.dataset.chatWorkspaceDrawerOpen = "true";
  drawer.hidden = false;
  drawer.dataset.recordManagementEditMode = "false";
  drawer.dataset.recordManagementAiMode = "false";
  drawer.dataset.recordManagementAiView = "false";
  drawer.dataset.recordManagementEvidenceMode = "true";
  drawer.dataset.recordManagementEvidenceView = "true";
  closeRecordManagementAiDrawer(drawer);
  const editToggle = drawer.querySelector("[data-record-management-drawer-edit]");
  const evidenceToggle = drawer.querySelector("[data-record-management-evidence-mode-toggle]");
  const aiToggle = drawer.querySelector("[data-record-management-ai-mode-toggle]");
  if (editToggle instanceof HTMLElement) {
    editToggle.setAttribute("aria-pressed", "false");
  }
  if (evidenceToggle instanceof HTMLElement) {
    evidenceToggle.setAttribute("aria-pressed", "true");
  }
  if (aiToggle instanceof HTMLElement) {
    aiToggle.setAttribute("aria-pressed", "false");
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
        ${isEntityManagementPageTemplate(entityWorkspace) ? renderPrimaryIconButton({
          ariaLabel: "Toggle AI mode",
          className: "record-management-drawer-ai-button",
          icon: renderEntityManagementRobotIcon(),
          title: "AI",
          toggleAttribute: "data-record-management-ai-mode-toggle",
        }) : renderPrimaryIconButton({
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
  syncEntityManagementViewRoleOptions(drawer);
  syncEntityManagementOwningFeatureDerivedFields(drawer);
}
