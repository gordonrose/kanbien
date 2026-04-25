export interface AssetRecord {
  asset_id: string;
  scope_type: "root" | "tenant";
  tenant_id: string | null;
  kind: "image" | "video" | "audio" | "document" | "other";
  visibility: "private" | "public";
  original_filename: string | null;
  storage_provider: string;
  storage_key: string;
  claimed_content_type: string;
  verified_content_type: string | null;
  byte_size: number;
  expected_checksum_sha256: string | null;
  observed_checksum_sha256: string | null;
  checksum_verification_status: string;
  content_verification_status: string;
  lifecycle_status: string;
  processing_status: string;
  pii_posture: string;
  cleanup_status: string;
  cleanup_failure_reason: string | null;
  cleanup_attempted_at: Date | null;
  rejection_reason: string | null;
  created_by_actor_type: string;
  created_by_actor_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface AssetUploadIntentRecord {
  upload_intent_id: string;
  asset_id: string;
  status: "pending" | "completed" | "expired" | "rejected";
  actor_type: string;
  actor_id: string;
  scope_type: "root" | "tenant";
  tenant_id: string | null;
  storage_key: string;
  expected_content_type: string;
  max_byte_size: number;
  expected_checksum_sha256: string | null;
  expires_at: Date;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
