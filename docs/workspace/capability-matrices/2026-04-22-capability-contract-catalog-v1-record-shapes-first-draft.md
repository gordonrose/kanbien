# Capability Contract Catalog V1 Record Shapes First Draft

## Purpose

This note turns the current capability-matrix direction for
`capabilityContractCatalog` into concrete record-shape guidance.

It is still a planning artifact, not final implementation truth.

Its role is to make the next steps easier:

- PRD drafting
- ADR discussion
- implementation-blueprint writing
- persistence and API-shape design

## Scope

This first draft defines three record views for v1:

- picker summary record
- exact capability record
- registry status record

These are complementary views over the same persisted capability-catalog
truth.

## Shared Design Rules

- the primary catalog unit is the backend capability
- capability ids should be feature-qualified logical ids
- governing authz capability keys are canonical access truth
- allowed roles are derived persisted views
- frontend validation may mirror exported rules, but backend validation remains
  authoritative
- picker records should be lightweight and selection-friendly
- exact records should carry binding, validation, and explanatory detail
- registry-status records should make freshness and drift explicit
- exported snapshots remain derived outputs, not authoritative storage

## 1. Picker Summary Record

Use this shape for:

- menu items
- drawer lists
- tree nodes
- filtered search or autocomplete results

The summary should give a user enough information to choose a capability
without loading its full request and response detail.

### Proposed Shape

```ts
type CapabilityPickerSummary = {
  capabilityId: string;
  displayLabel: string;
  shortDescription: string;
  featureName: string;
  routeFamily: string;
  seamType: "http-route";
  capabilityBoundary: "root" | "tenant" | "shared";
  selectionGroup: string;
  route?: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
  };
  governingAuthzCapabilities: string[];
  allowedRoles: string[];
  supportsRequestBody: boolean;
  supportsResponseFields: boolean;
  supportsFilters: boolean;
  freshnessStatus: "fresh" | "stale" | "drifted" | "blocked";
  lifecycleStatus: "active" | "deprecated" | "planned";
};
```

### Notes

- `displayLabel` is the short user-facing name shown in selection UI
- `shortDescription` should explain what the capability does in one sentence
- `selectionGroup` should support grouping by feature and route family in v1
- `supportsRequestBody`, `supportsResponseFields`, and `supportsFilters`
  support quick filtering in picker UI
- `freshnessStatus` must be visible enough for tooling to avoid presenting
  stale records as if they were fully trustworthy

## 2. Exact Capability Record

Use this shape for:

- capability detail panes
- builder inspectors
- binding a frontend element to backend request or response fields
- frontend validation mirroring

This record should expose the capability's contract in normalized form.

### Proposed Shape

```ts
type CapabilityRecord = {
  capabilityId: string;
  displayLabel: string;
  shortDescription: string;
  fullDescription?: string;
  userFacingOutcome?: string;
  featureName: string;
  routeFamily: string;
  seamType: "http-route";
  capabilityBoundary: "root" | "tenant" | "shared";
  route?: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
  };
  access: {
    governingAuthzCapabilities: string[];
    allowedRoles: string[];
    deniedByDefault: boolean;
    runtimeContextRequirements: string[];
  };
  request: {
    params: ContractField[];
    query: ContractField[];
    body: ContractField[];
    constraints: CapabilityConstraint[];
  };
  response: {
    body: ContractField[];
  };
  sourceReferences: {
    featureContracts: string[];
    apiContractDocs: string[];
    permissionMappings: string[];
    featureManifest?: string;
  };
  freshness: {
    status: "fresh" | "stale" | "drifted" | "blocked";
    lastMaterializedAt: string;
    lastAuditedAt?: string;
  };
};
```

### Field Shape

```ts
type ContractField = {
  path: string;
  displayLabel?: string;
  description?: string;
  type: string;
  required: boolean;
  nullable?: boolean;
  repeated?: boolean;
  format?: string;
  enumValues?: string[];
  systemManaged?: boolean;
  normalization?: string[];
  bindingHints?: Array<"display" | "input" | "filter" | "identifier">;
  validation?: {
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    pattern?: string;
    format?: string;
    enumValues?: string[];
    normalizedAs?: string;
  };
};
```

### Capability Constraint Shape

```ts
type CapabilityConstraint = {
  kind:
    | "at-least-one"
    | "mutually-exclusive"
    | "requires-when"
    | "comparison";
  fields: string[];
  message: string;
};
```

### Notes

- `shortDescription` is optimized for quick inspection UI
- `fullDescription` explains the capability in more human terms
- `userFacingOutcome` helps the frontend explain why a user might choose the
  capability
- `runtimeContextRequirements` prepares for later omission filters such as
  tenant context or entity relationship without pretending to evaluate them in
  v1
- field validation should be exported only when it can be derived honestly
  from approved source truth
- cross-field rules should be exported through `constraints`, not duplicated
  awkwardly on individual fields

## 3. Registry Status Record

Use this shape for:

- freshness badges
- drift warnings
- export gating
- materialization and trust decisions

This is the governance view over the persisted catalog record.

### Proposed Shape

```ts
type CapabilityRegistryStatus = {
  capabilityId: string;
  freshnessStatus: "fresh" | "stale" | "drifted" | "blocked";
  lastMaterializedAt?: string;
  lastAuditedAt?: string;
  driftReasons: string[];
  sourceCoverage: {
    featureContract: boolean;
    apiContractDoc: boolean;
    permissionMapping: boolean;
    featureManifest: boolean;
  };
  rematerializationRequired: boolean;
};
```

### Notes

- `driftReasons` should be explainable and user-readable, not only internal
  error codes
- `sourceCoverage` makes it visible which artifacts exist and which are absent
- `rematerializationRequired` gives tooling a simple action signal

## Example

Below is an illustrative example for `notificationDelivery.resendEmail`.

### Picker Summary Example

```json
{
  "capabilityId": "notificationDelivery.resendEmail",
  "displayLabel": "Resend Outbound Email",
  "shortDescription": "Resend one previously created outbound email.",
  "featureName": "notificationDelivery",
  "routeFamily": "notification-delivery",
  "seamType": "http-route",
  "capabilityBoundary": "root",
  "selectionGroup": "notification-delivery",
  "route": {
    "method": "POST",
    "path": "/v1/notification-delivery/emails/:emailId/resend"
  },
  "governingAuthzCapabilities": [
    "notification.email.resend"
  ],
  "allowedRoles": [
    "RootUserAdmin"
  ],
  "supportsRequestBody": true,
  "supportsResponseFields": true,
  "supportsFilters": false,
  "freshnessStatus": "fresh",
  "lifecycleStatus": "active"
}
```

### Exact Record Example

```json
{
  "capabilityId": "notificationDelivery.resendEmail",
  "displayLabel": "Resend Outbound Email",
  "shortDescription": "Resend one previously created outbound email.",
  "fullDescription": "Creates a new delivery attempt for an existing logical outbound email and may reuse or replace the sanitized content snapshot when updated subject or body text is supplied.",
  "userFacingOutcome": "An operator can trigger another delivery attempt for a previously created outbound email.",
  "featureName": "notificationDelivery",
  "routeFamily": "notification-delivery",
  "seamType": "http-route",
  "capabilityBoundary": "root",
  "route": {
    "method": "POST",
    "path": "/v1/notification-delivery/emails/:emailId/resend"
  },
  "access": {
    "governingAuthzCapabilities": [
      "notification.email.resend"
    ],
    "allowedRoles": [
      "RootUserAdmin"
    ],
    "deniedByDefault": true,
    "runtimeContextRequirements": []
  },
  "request": {
    "params": [
      {
        "path": "params.emailId",
        "type": "string",
        "required": true,
        "format": "uuid",
        "bindingHints": ["identifier"],
        "validation": {
          "format": "uuid"
        }
      }
    ],
    "query": [],
    "body": [
      {
        "path": "body.resendReason",
        "type": "string",
        "required": false,
        "bindingHints": ["input"],
        "validation": {
          "minLength": 1,
          "normalizedAs": "trim"
        }
      },
      {
        "path": "body.subject",
        "type": "string",
        "required": false,
        "bindingHints": ["input"],
        "validation": {
          "minLength": 1,
          "normalizedAs": "trim"
        }
      },
      {
        "path": "body.bodyText",
        "type": "string",
        "required": false,
        "bindingHints": ["input"],
        "validation": {
          "minLength": 1,
          "normalizedAs": "trim"
        }
      }
    ],
    "constraints": [
      {
        "kind": "at-least-one",
        "fields": [
          "body.resendReason",
          "body.subject",
          "body.bodyText"
        ],
        "message": "At least one field must be supplied."
      }
    ]
  },
  "response": {
    "body": [
      {
        "path": "response.emailId",
        "type": "string",
        "required": true,
        "format": "uuid",
        "bindingHints": ["identifier", "display"]
      },
      {
        "path": "response.subject",
        "type": "string",
        "required": true,
        "bindingHints": ["display"]
      },
      {
        "path": "response.status",
        "type": "enum",
        "required": true,
        "enumValues": ["pending", "sent", "failed"],
        "bindingHints": ["display"]
      },
      {
        "path": "response.latestAttempt.resendReason",
        "type": "string",
        "required": false,
        "nullable": true,
        "bindingHints": ["display"]
      }
    ]
  },
  "sourceReferences": {
    "featureContracts": [
      "src/features/notificationDelivery/contract/schemas.ts",
      "src/features/notificationDelivery/contract/types.ts"
    ],
    "apiContractDocs": [
      "docs/api-contracts/notification-delivery.md"
    ],
    "permissionMappings": [
      "docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md",
      "docs/architecture/permission-mappings/role-to-authz-capability-mapping.md"
    ],
    "featureManifest": "src/features/notificationDelivery/feature.manifest.json"
  },
  "freshness": {
    "status": "fresh",
    "lastMaterializedAt": "2026-04-22T10:15:00Z",
    "lastAuditedAt": "2026-04-22T10:20:00Z"
  }
}
```

### Registry Status Example

```json
{
  "capabilityId": "notificationDelivery.resendEmail",
  "freshnessStatus": "fresh",
  "lastMaterializedAt": "2026-04-22T10:15:00Z",
  "lastAuditedAt": "2026-04-22T10:20:00Z",
  "driftReasons": [],
  "sourceCoverage": {
    "featureContract": true,
    "apiContractDoc": true,
    "permissionMapping": true,
    "featureManifest": true
  },
  "rematerializationRequired": false
}
```

## Remaining Questions

- whether these shapes should become:
  - repo-generated JSON artifacts
  - API response contracts only
  - persistence-table rows plus API presenters
- how much validation detail can be normalized safely from current schema
  sources without creating a drifting parallel validation model
- where short and full descriptions should come from when current source
  artifacts are too technical
- whether summary and exact records should carry explicit frontend suitability
  hints such as `supportsTableBinding` or `supportsFormBinding` in v1 or later
