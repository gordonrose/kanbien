import type { CapabilityFieldValidation } from "../domain/types";

export interface CapabilityCatalogRecordRow {
  capability_catalog_record_id: string;
  capability_id: string;
  feature_name: string;
  display_label: string;
  short_description: string;
  full_description: string | null;
  user_facing_outcome: string | null;
  route_family: string;
  seam_type: string;
  capability_boundary: string;
  selection_group: string;
  http_method: string | null;
  route_path: string | null;
  governing_authz_capabilities: string[];
  allowed_roles: string[];
  supports_request_body: boolean;
  supports_response_fields: boolean;
  supports_filters: boolean;
  lifecycle_status: string;
  normalized_hash: string;
  last_materialized_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CapabilityCatalogFieldRow {
  capability_catalog_field_id: string;
  capability_id: string;
  contract_side: string;
  path: string;
  display_label: string | null;
  description: string | null;
  field_type: string;
  required: boolean;
  nullable: boolean;
  repeated: boolean;
  format: string | null;
  enum_values: string[];
  system_managed: boolean;
  normalization_steps: string[];
  binding_hints: string[];
  validation: CapabilityFieldValidation | null;
  display_order: number;
}

export interface CapabilityCatalogConstraintRow {
  capability_catalog_constraint_id: string;
  capability_id: string;
  constraint_kind: string;
  field_paths: string[];
  message: string;
  display_order: number;
}

export interface CapabilityCatalogSourceReferenceRow {
  capability_catalog_source_reference_id: string;
  capability_id: string;
  source_type: string;
  source_path: string;
  source_coverage: string | null;
}
