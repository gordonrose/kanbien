import type { SourceCapabilityDefinition } from "./types";

const notificationDeliverySources = [
  "src/features/notificationDelivery/contract/schemas.ts",
  "src/features/notificationDelivery/contract/types.ts",
  "src/features/notificationDelivery/feature.manifest.json",
  "docs/api-contracts/notification-delivery.md",
  "docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md",
  "docs/architecture/permission-mappings/role-to-authz-capability-mapping.md",
];

export const INITIAL_CAPABILITY_SOURCE_REGISTRY: SourceCapabilityDefinition[] = [
  {
    capabilityId: "notificationDelivery.sendEmail",
    featureName: "notificationDelivery",
    displayLabel: "Send Test Email",
    shortDescription: "Send one outbound email through the shared notification delivery feature.",
    fullDescription:
      "Creates one logical outbound email, one sanitized content snapshot, and one attempt through the root-only notification delivery operator API.",
    userFacingOutcome:
      "An operator can verify outbound delivery and inspect the resulting email metadata.",
    routeFamily: "notification-delivery",
    seamType: "http-route",
    capabilityBoundary: "root",
    selectionGroup: "notification-delivery",
    httpMethod: "POST",
    routePath: "/v1/notification-delivery/emails/test",
    governingAuthzCapabilities: ["notification.email.send"],
    allowedRoles: ["RootUserAdmin"],
    supportsRequestBody: true,
    supportsResponseFields: true,
    supportsFilters: false,
    lifecycleStatus: "active",
    requestBody: [
      {
        path: "body.recipientEmail",
        fieldType: "string",
        required: true,
        format: "email",
        bindingHints: ["input"],
        normalizationSteps: ["trim", "lowercase"],
        validation: { format: "email", minLength: 1, normalizedAs: "trim-lowercase" },
      },
      {
        path: "body.subject",
        fieldType: "string",
        required: true,
        bindingHints: ["input"],
        normalizationSteps: ["trim"],
        validation: { minLength: 1, normalizedAs: "trim" },
      },
      {
        path: "body.bodyText",
        fieldType: "string",
        required: true,
        bindingHints: ["input"],
        normalizationSteps: ["trim"],
        validation: { minLength: 1, normalizedAs: "trim" },
      },
      {
        path: "body.notificationType",
        fieldType: "string",
        required: true,
        bindingHints: ["input"],
        normalizationSteps: ["trim"],
        validation: { minLength: 1, normalizedAs: "trim" },
      },
      {
        path: "body.tenantId",
        fieldType: "string",
        required: false,
        format: "uuid",
        bindingHints: ["input", "identifier"],
        validation: { format: "uuid" },
      },
      {
        path: "body.relatedEntityType",
        fieldType: "string",
        required: false,
        bindingHints: ["input"],
        normalizationSteps: ["trim"],
        validation: { minLength: 1, normalizedAs: "trim" },
      },
      {
        path: "body.relatedEntityId",
        fieldType: "string",
        required: false,
        bindingHints: ["input", "identifier"],
        normalizationSteps: ["trim"],
        validation: { minLength: 1, normalizedAs: "trim" },
      },
    ],
    responseBody: [
      {
        path: "response.emailId",
        fieldType: "string",
        required: true,
        format: "uuid",
        bindingHints: ["display", "identifier"],
      },
      {
        path: "response.recipientEmail",
        fieldType: "string",
        required: true,
        bindingHints: ["display"],
      },
      {
        path: "response.subject",
        fieldType: "string",
        required: true,
        bindingHints: ["display"],
      },
      {
        path: "response.status",
        fieldType: "enum",
        required: true,
        enumValues: ["pending", "sent", "failed"],
        bindingHints: ["display"],
      },
      {
        path: "response.latestAttempt.status",
        fieldType: "enum",
        required: false,
        nullable: true,
        enumValues: ["sent", "failed"],
        bindingHints: ["display"],
      },
    ],
    sourceReferences: notificationDeliverySources.map((sourcePath) => ({
      sourceType: sourcePath.endsWith(".md")
        ? sourcePath.includes("permission-mappings")
          ? "permission-mapping"
          : "api-contract-doc"
        : sourcePath.endsWith(".json")
          ? "feature-manifest"
          : "feature-contract",
      sourcePath,
    })),
  },
  {
    capabilityId: "notificationDelivery.listOutboundEmails",
    featureName: "notificationDelivery",
    displayLabel: "List Outbound Emails",
    shortDescription: "List outbound email metadata with explicit filters.",
    fullDescription:
      "Returns paginated logical outbound email summaries with latest-attempt metadata and approved root-only filter support.",
    userFacingOutcome:
      "An operator can browse and filter outbound email metadata without opening one exact email record first.",
    routeFamily: "notification-delivery",
    seamType: "http-route",
    capabilityBoundary: "root",
    selectionGroup: "notification-delivery",
    httpMethod: "GET",
    routePath: "/v1/notification-delivery/emails",
    governingAuthzCapabilities: ["notification.email.read"],
    allowedRoles: ["RootUserAdmin"],
    supportsRequestBody: false,
    supportsResponseFields: true,
    supportsFilters: true,
    lifecycleStatus: "active",
    requestQuery: [
      { path: "query.page", fieldType: "number", required: true, bindingHints: ["filter"], validation: { minimum: 1 } },
      { path: "query.pageSize", fieldType: "number", required: true, bindingHints: ["filter"], validation: { minimum: 1, maximum: 100 } },
      { path: "query.orderBy", fieldType: "enum", required: true, enumValues: ["requestedAt", "sentAt", "subject", "recipientEmail", "status"], bindingHints: ["filter"] },
      { path: "query.orderDirection", fieldType: "enum", required: true, enumValues: ["asc", "desc"], bindingHints: ["filter"] },
      { path: "query.tenantId", fieldType: "string", required: false, format: "uuid", bindingHints: ["filter", "identifier"], validation: { format: "uuid" } },
      { path: "query.notificationType", fieldType: "string", required: false, bindingHints: ["filter"], normalizationSteps: ["trim", "lowercase"], validation: { minLength: 1, normalizedAs: "trim-lowercase" } },
      { path: "query.recipientEmail", fieldType: "string", required: false, format: "email", bindingHints: ["filter"], normalizationSteps: ["trim", "lowercase"], validation: { minLength: 1, format: "email", normalizedAs: "trim-lowercase" } },
      { path: "query.relatedEntityType", fieldType: "string", required: false, bindingHints: ["filter"], normalizationSteps: ["trim", "lowercase"], validation: { minLength: 1, normalizedAs: "trim-lowercase" } },
      { path: "query.relatedEntityId", fieldType: "string", required: false, bindingHints: ["filter", "identifier"], normalizationSteps: ["trim"], validation: { minLength: 1, normalizedAs: "trim" } },
      { path: "query.subject", fieldType: "string", required: false, bindingHints: ["filter"], normalizationSteps: ["trim", "lowercase"], validation: { minLength: 1, normalizedAs: "trim-lowercase" } },
      { path: "query.status", fieldType: "enum", required: false, enumValues: ["pending", "sent", "failed"], bindingHints: ["filter"] },
      { path: "query.provider", fieldType: "string", required: false, bindingHints: ["filter"], normalizationSteps: ["trim", "lowercase"], validation: { minLength: 1, normalizedAs: "trim-lowercase" } },
      { path: "query.createdByActorType", fieldType: "string", required: false, bindingHints: ["filter"], normalizationSteps: ["trim", "lowercase"], validation: { minLength: 1, normalizedAs: "trim-lowercase" } },
      { path: "query.createdByActorId", fieldType: "string", required: false, bindingHints: ["filter", "identifier"], normalizationSteps: ["trim"], validation: { minLength: 1, normalizedAs: "trim" } },
      { path: "query.requestedAtFrom", fieldType: "string", required: false, format: "date-time", bindingHints: ["filter"], validation: { format: "date-time" } },
      { path: "query.requestedAtTo", fieldType: "string", required: false, format: "date-time", bindingHints: ["filter"], validation: { format: "date-time" } },
      { path: "query.sentAtFrom", fieldType: "string", required: false, format: "date-time", bindingHints: ["filter"], validation: { format: "date-time" } },
      { path: "query.sentAtTo", fieldType: "string", required: false, format: "date-time", bindingHints: ["filter"], validation: { format: "date-time" } },
    ],
    responseBody: [
      { path: "response.items[]", fieldType: "object", required: true, repeated: true, bindingHints: ["display"] },
      { path: "response.items[].emailId", fieldType: "string", required: true, format: "uuid", bindingHints: ["display", "identifier"] },
      { path: "response.items[].recipientEmail", fieldType: "string", required: true, bindingHints: ["display"] },
      { path: "response.items[].subject", fieldType: "string", required: true, bindingHints: ["display"] },
      { path: "response.items[].status", fieldType: "enum", required: true, enumValues: ["pending", "sent", "failed"], bindingHints: ["display"] },
      { path: "response.page", fieldType: "number", required: true, bindingHints: ["display"] },
      { path: "response.pageSize", fieldType: "number", required: true, bindingHints: ["display"] },
      { path: "response.totalPages", fieldType: "number", required: true, bindingHints: ["display"] },
    ],
    sourceReferences: notificationDeliverySources.map((sourcePath) => ({
      sourceType: sourcePath.endsWith(".md")
        ? sourcePath.includes("permission-mappings")
          ? "permission-mapping"
          : "api-contract-doc"
        : sourcePath.endsWith(".json")
          ? "feature-manifest"
          : "feature-contract",
      sourcePath,
    })),
  },
  {
    capabilityId: "notificationDelivery.getOutboundEmail",
    featureName: "notificationDelivery",
    displayLabel: "Get Outbound Email",
    shortDescription: "Read one logical outbound email and its delivery history.",
    fullDescription:
      "Returns one logical outbound email, sanitized content snapshots, and ordered attempt history through the root-only notification delivery API.",
    userFacingOutcome:
      "An operator can inspect one outbound email in detail, including content-version and attempt history.",
    routeFamily: "notification-delivery",
    seamType: "http-route",
    capabilityBoundary: "root",
    selectionGroup: "notification-delivery",
    httpMethod: "GET",
    routePath: "/v1/notification-delivery/emails/:emailId",
    governingAuthzCapabilities: ["notification.email.read"],
    allowedRoles: ["RootUserAdmin"],
    supportsRequestBody: false,
    supportsResponseFields: true,
    supportsFilters: false,
    lifecycleStatus: "active",
    requestParams: [
      { path: "params.emailId", fieldType: "string", required: true, format: "uuid", bindingHints: ["identifier"], validation: { format: "uuid" } },
    ],
    responseBody: [
      { path: "response.emailId", fieldType: "string", required: true, format: "uuid", bindingHints: ["display", "identifier"] },
      { path: "response.subject", fieldType: "string", required: true, bindingHints: ["display"] },
      { path: "response.status", fieldType: "enum", required: true, enumValues: ["pending", "sent", "failed"], bindingHints: ["display"] },
      { path: "response.contentVersions[]", fieldType: "object", required: true, repeated: true, bindingHints: ["display"] },
      { path: "response.attempts[]", fieldType: "object", required: true, repeated: true, bindingHints: ["display"] },
    ],
    sourceReferences: notificationDeliverySources.map((sourcePath) => ({
      sourceType: sourcePath.endsWith(".md")
        ? sourcePath.includes("permission-mappings")
          ? "permission-mapping"
          : "api-contract-doc"
        : sourcePath.endsWith(".json")
          ? "feature-manifest"
          : "feature-contract",
      sourcePath,
    })),
  },
  {
    capabilityId: "notificationDelivery.resendEmail",
    featureName: "notificationDelivery",
    displayLabel: "Resend Outbound Email",
    shortDescription: "Resend one previously created outbound email.",
    fullDescription:
      "Creates a new delivery attempt for an existing logical outbound email and may reuse or replace the sanitized content snapshot when updated subject or body text is supplied.",
    userFacingOutcome:
      "An operator can trigger another delivery attempt for a previously created outbound email.",
    routeFamily: "notification-delivery",
    seamType: "http-route",
    capabilityBoundary: "root",
    selectionGroup: "notification-delivery",
    httpMethod: "POST",
    routePath: "/v1/notification-delivery/emails/:emailId/resend",
    governingAuthzCapabilities: ["notification.email.resend"],
    allowedRoles: ["RootUserAdmin"],
    runtimeContextRequirements: [
      "root-session-context",
      "future-tenant-and-entity-relationship-omission-rules-remain-server-enforced",
    ],
    supportsRequestBody: true,
    supportsResponseFields: true,
    supportsFilters: false,
    lifecycleStatus: "active",
    requestParams: [
      { path: "params.emailId", fieldType: "string", required: true, format: "uuid", bindingHints: ["identifier"], validation: { format: "uuid" } },
    ],
    requestBody: [
      { path: "body.resendReason", fieldType: "string", required: false, bindingHints: ["input"], normalizationSteps: ["trim"], validation: { minLength: 1, normalizedAs: "trim" } },
      { path: "body.subject", fieldType: "string", required: false, bindingHints: ["input"], normalizationSteps: ["trim"], validation: { minLength: 1, normalizedAs: "trim" } },
      { path: "body.bodyText", fieldType: "string", required: false, bindingHints: ["input"], normalizationSteps: ["trim"], validation: { minLength: 1, normalizedAs: "trim" } },
    ],
    responseBody: [
      { path: "response.emailId", fieldType: "string", required: true, format: "uuid", bindingHints: ["display", "identifier"] },
      { path: "response.subject", fieldType: "string", required: true, bindingHints: ["display"] },
      { path: "response.status", fieldType: "enum", required: true, enumValues: ["pending", "sent", "failed"], bindingHints: ["display"] },
      { path: "response.latestAttempt.resendReason", fieldType: "string", required: false, nullable: true, bindingHints: ["display"] },
    ],
    constraints: [
      {
        constraintKind: "at-least-one",
        fields: ["body.resendReason", "body.subject", "body.bodyText"],
        message: "At least one field must be supplied.",
      },
    ],
    sourceReferences: notificationDeliverySources.map((sourcePath) => ({
      sourceType: sourcePath.endsWith(".md")
        ? sourcePath.includes("permission-mappings")
          ? "permission-mapping"
          : "api-contract-doc"
        : sourcePath.endsWith(".json")
          ? "feature-manifest"
          : "feature-contract",
      sourcePath,
    })),
  },
];
