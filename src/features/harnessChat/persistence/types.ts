export type HarnessChatConversationState = "draft" | "active" | "packet-ready" | "abandoned" | "closed";
export type HarnessChatScopeType = "root";
export type HarnessChatSourceChannel = "app";
export type HarnessChatRetentionPosture = "indefinite";
export type HarnessChatMessageRole = "user" | "assistant" | "system";
export type HarnessChatPacketRevisionState = "draft" | "generated" | "pdf-ready" | "downloaded" | "superseded" | "failed";
export type HarnessChatPdfAttemptState = "requested" | "preparing" | "succeeded" | "failed" | "denied" | "rate-limited";

export interface HarnessChatConversationRecord {
  conversation_id: string;
  product_request_id: string | null;
  scope_type: HarnessChatScopeType;
  tenant_id: string | null;
  created_by_root_user_id: string;
  state: HarnessChatConversationState;
  source_channel: HarnessChatSourceChannel;
  surface_context: Record<string, unknown>;
  client_context: Record<string, unknown>;
  structured_discovery_state: Record<string, unknown>;
  compact_transcript_summary: string | null;
  latest_packet_revision_id: string | null;
  retention_posture: HarnessChatRetentionPosture;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface HarnessChatMessageRecord {
  message_id: string;
  conversation_id: string;
  sequence_number: number;
  role: HarnessChatMessageRole;
  body: string;
  accepted_by_harness: boolean;
  created_by_root_user_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}

export interface HarnessChatPacketRevisionRecord {
  packet_revision_id: string;
  conversation_id: string;
  product_request_id: string | null;
  version: number;
  state: HarnessChatPacketRevisionState;
  product_discovery_packet_path: string | null;
  packet_data: Record<string, unknown>;
  source_message_sequence_max: number;
  previous_packet_revision_id: string | null;
  next_packet_revision_id: string | null;
  generated_by_root_user_id: string;
  generated_at: Date | null;
  superseded_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface HarnessChatPdfAttemptRecord {
  pdf_attempt_id: string;
  packet_revision_id: string;
  requested_by_root_user_id: string;
  state: HarnessChatPdfAttemptState;
  safe_failure_reason: string | null;
  source_data_size_bytes: number | null;
  rendered_html_size_bytes: number | null;
  output_size_bytes: number | null;
  duration_ms: number | null;
  retry_of_attempt_id: string | null;
  started_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
}

export interface CreateHarnessChatConversationInput {
  conversationId: string;
  productRequestId?: string | null;
  createdByRootUserId: string;
  state?: HarnessChatConversationState;
  surfaceContext?: Record<string, unknown>;
  clientContext?: Record<string, unknown>;
  structuredDiscoveryState?: Record<string, unknown>;
  compactTranscriptSummary?: string | null;
}

export interface AppendHarnessChatMessageInput {
  messageId: string;
  conversationId: string;
  role: HarnessChatMessageRole;
  body: string;
  acceptedByHarness?: boolean;
  createdByRootUserId?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface CreateHarnessChatPacketRevisionInput {
  packetRevisionId: string;
  conversationId: string;
  productRequestId?: string | null;
  state?: HarnessChatPacketRevisionState;
  productDiscoveryPacketPath?: string | null;
  packetData: Record<string, unknown>;
  sourceMessageSequenceMax: number;
  generatedByRootUserId: string;
}

export interface RecordHarnessChatPdfAttemptInput {
  pdfAttemptId: string;
  packetRevisionId: string;
  requestedByRootUserId: string;
  state: HarnessChatPdfAttemptState;
  safeFailureReason?: string | null;
  sourceDataSizeBytes?: number | null;
  renderedHtmlSizeBytes?: number | null;
  outputSizeBytes?: number | null;
  durationMs?: number | null;
  retryOfAttemptId?: string | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
}

export interface HarnessChatConversationData {
  conversationId: string;
  productRequestId: string | null;
  scopeType: HarnessChatScopeType;
  tenantId: string | null;
  createdByRootUserId: string;
  state: HarnessChatConversationState;
  sourceChannel: HarnessChatSourceChannel;
  surfaceContext: Record<string, unknown>;
  clientContext: Record<string, unknown>;
  structuredDiscoveryState: Record<string, unknown>;
  compactTranscriptSummary: string | null;
  latestPacketRevisionId: string | null;
  retentionPosture: HarnessChatRetentionPosture;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface HarnessChatMessageData {
  messageId: string;
  conversationId: string;
  sequenceNumber: number;
  role: HarnessChatMessageRole;
  body: string;
  acceptedByHarness: boolean;
  createdByRootUserId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface HarnessChatPacketRevisionData {
  packetRevisionId: string;
  conversationId: string;
  productRequestId: string | null;
  version: number;
  state: HarnessChatPacketRevisionState;
  productDiscoveryPacketPath: string | null;
  packetData: Record<string, unknown>;
  sourceMessageSequenceMax: number;
  previousPacketRevisionId: string | null;
  nextPacketRevisionId: string | null;
  generatedByRootUserId: string;
  generatedAt: Date | null;
  supersededAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface HarnessChatPdfAttemptData {
  pdfAttemptId: string;
  packetRevisionId: string;
  requestedByRootUserId: string;
  state: HarnessChatPdfAttemptState;
  safeFailureReason: string | null;
  sourceDataSizeBytes: number | null;
  renderedHtmlSizeBytes: number | null;
  outputSizeBytes: number | null;
  durationMs: number | null;
  retryOfAttemptId: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}
