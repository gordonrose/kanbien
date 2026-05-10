import type { Pool } from "pg";
import type { HarnessChatRepository } from "./repository";
import type {
  AppendHarnessChatMessageInput,
  CompleteHarnessChatLlmUsageAttemptInput,
  CreateHarnessChatConversationInput,
  CreateHarnessChatPacketRevisionInput,
  HarnessChatConversationData,
  HarnessChatConversationRecord,
  HarnessChatLlmUsageAttemptData,
  HarnessChatLlmUsageAttemptRecord,
  HarnessChatPdfAttemptData,
  HarnessChatPdfAttemptRecord,
  HarnessChatMessageData,
  HarnessChatMessageRecord,
  HarnessChatPacketRevisionData,
  HarnessChatPacketRevisionRecord,
  RecordHarnessChatPdfAttemptInput,
  ReserveHarnessChatLlmUsageAttemptInput,
  UpdateHarnessChatConversationInput,
  UpdateHarnessChatUserMessageInput,
} from "./types";

function toJsonObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function toConversationData(record: HarnessChatConversationRecord): HarnessChatConversationData {
  return {
    conversationId: record.conversation_id,
    productRequestId: record.product_request_id,
    scopeType: record.scope_type,
    tenantId: record.tenant_id,
    createdByRootUserId: record.created_by_root_user_id,
    state: record.state,
    sourceChannel: record.source_channel,
    surfaceContext: toJsonObject(record.surface_context),
    clientContext: toJsonObject(record.client_context),
    structuredDiscoveryState: toJsonObject(record.structured_discovery_state),
    compactTranscriptSummary: record.compact_transcript_summary,
    latestPacketRevisionId: record.latest_packet_revision_id,
    retentionPosture: record.retention_posture,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    deletedAt: record.deleted_at,
  };
}

function toMessageData(record: HarnessChatMessageRecord): HarnessChatMessageData {
  return {
    messageId: record.message_id,
    conversationId: record.conversation_id,
    sequenceNumber: record.sequence_number,
    role: record.role,
    body: record.body,
    acceptedByHarness: record.accepted_by_harness,
    createdByRootUserId: record.created_by_root_user_id,
    metadata: record.metadata === null ? null : toJsonObject(record.metadata),
    createdAt: record.created_at,
  };
}

function toPacketRevisionData(record: HarnessChatPacketRevisionRecord): HarnessChatPacketRevisionData {
  return {
    packetRevisionId: record.packet_revision_id,
    conversationId: record.conversation_id,
    productRequestId: record.product_request_id,
    version: record.version,
    state: record.state,
    productDiscoveryPacketPath: record.product_discovery_packet_path,
    packetData: toJsonObject(record.packet_data),
    sourceMessageSequenceMax: record.source_message_sequence_max,
    previousPacketRevisionId: record.previous_packet_revision_id,
    nextPacketRevisionId: record.next_packet_revision_id,
    generatedByRootUserId: record.generated_by_root_user_id,
    generatedAt: record.generated_at,
    supersededAt: record.superseded_at,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function toPdfAttemptData(record: HarnessChatPdfAttemptRecord): HarnessChatPdfAttemptData {
  return {
    pdfAttemptId: record.pdf_attempt_id,
    packetRevisionId: record.packet_revision_id,
    requestedByRootUserId: record.requested_by_root_user_id,
    state: record.state,
    safeFailureReason: record.safe_failure_reason,
    sourceDataSizeBytes: record.source_data_size_bytes,
    renderedHtmlSizeBytes: record.rendered_html_size_bytes,
    outputSizeBytes: record.output_size_bytes,
    durationMs: record.duration_ms,
    retryOfAttemptId: record.retry_of_attempt_id,
    startedAt: record.started_at,
    completedAt: record.completed_at,
    createdAt: record.created_at,
  };
}

function toLlmUsageAttemptData(record: HarnessChatLlmUsageAttemptRecord): HarnessChatLlmUsageAttemptData {
  return {
    llmUsageAttemptId: record.llm_usage_attempt_id,
    conversationId: record.conversation_id,
    provider: record.provider,
    model: record.model,
    state: record.state,
    safeFailureReason: record.safe_failure_reason,
    requestDay: record.request_day,
    requestMonth: record.request_month,
    dailyRequestLimit: record.daily_request_limit,
    monthlyRequestLimit: record.monthly_request_limit,
    inputChars: record.input_chars,
    transcriptMessageCount: record.transcript_message_count,
    outputChars: record.output_chars,
    errorCode: record.error_code,
    createdAt: record.created_at,
    completedAt: record.completed_at,
  };
}

export function createPostgresHarnessChatRepository(dbPool: Pool): HarnessChatRepository {
  async function queryConversation(sql: string, params: unknown[]): Promise<HarnessChatConversationData | null> {
    const result = await dbPool.query<HarnessChatConversationRecord>(sql, params);
    return result.rows[0] ? toConversationData(result.rows[0]) : null;
  }

  return {
    async createConversation(input: CreateHarnessChatConversationInput) {
      const result = await dbPool.query<HarnessChatConversationRecord>(
        `
          INSERT INTO harness_chat_conversations (
            conversation_id,
            product_request_id,
            scope_type,
            tenant_id,
            created_by_root_user_id,
            state,
            source_channel,
            surface_context,
            client_context,
            structured_discovery_state,
            compact_transcript_summary,
            latest_packet_revision_id,
            retention_posture,
            created_at,
            updated_at,
            deleted_at
          )
          VALUES ($1, $2, 'root', NULL, $3, $4, 'app', $5::jsonb, $6::jsonb, $7::jsonb, $8, NULL, 'indefinite', NOW(), NOW(), NULL)
          RETURNING *
        `,
        [
          input.conversationId,
          input.productRequestId ?? null,
          input.createdByRootUserId,
          input.state ?? "active",
          JSON.stringify(input.surfaceContext ?? {}),
          JSON.stringify(input.clientContext ?? {}),
          JSON.stringify(input.structuredDiscoveryState ?? {}),
          input.compactTranscriptSummary ?? null,
        ],
      );

      return toConversationData(result.rows[0]);
    },

    async appendMessage(input: AppendHarnessChatMessageInput) {
      const client = await dbPool.connect();

      try {
        await client.query("BEGIN");
        const message = await client.query<HarnessChatMessageRecord>(
          `
            WITH next_sequence AS (
              SELECT COALESCE(MAX(sequence_number), 0) + 1 AS sequence_number
              FROM harness_chat_messages
              WHERE conversation_id = $2
            )
            INSERT INTO harness_chat_messages (
              message_id,
              conversation_id,
              sequence_number,
              role,
              body,
              accepted_by_harness,
              created_by_root_user_id,
              metadata,
              created_at
            )
            SELECT $1, $2, next_sequence.sequence_number, $3, $4, $5, $6, $7::jsonb, NOW()
            FROM next_sequence
            RETURNING *
          `,
          [
            input.messageId,
            input.conversationId,
            input.role,
            input.body,
            input.acceptedByHarness ?? false,
            input.createdByRootUserId ?? null,
            input.metadata === undefined ? null : JSON.stringify(input.metadata),
          ],
        );
        await client.query(
          `
            UPDATE harness_chat_conversations
            SET updated_at = NOW()
            WHERE conversation_id = $1
              AND deleted_at IS NULL
          `,
          [input.conversationId],
        );
        await client.query("COMMIT");
        return toMessageData(message.rows[0]);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    findConversationById(conversationId: string) {
      return queryConversation(
        `
          SELECT *
          FROM harness_chat_conversations
          WHERE conversation_id = $1
            AND deleted_at IS NULL
        `,
        [conversationId],
      );
    },

    async listRootConversations() {
      const result = await dbPool.query<HarnessChatConversationRecord>(
        `
          SELECT *
          FROM harness_chat_conversations
          WHERE scope_type = 'root'
            AND tenant_id IS NULL
            AND deleted_at IS NULL
          ORDER BY updated_at DESC
        `,
      );
      return result.rows.map(toConversationData);
    },

    async listMessages(conversationId: string) {
      const result = await dbPool.query<HarnessChatMessageRecord>(
        `
          SELECT *
          FROM harness_chat_messages
          WHERE conversation_id = $1
          ORDER BY sequence_number ASC
        `,
        [conversationId],
      );
      return result.rows.map(toMessageData);
    },

    async updateConversation(input: UpdateHarnessChatConversationInput) {
      return queryConversation(
        `
          UPDATE harness_chat_conversations
          SET state = COALESCE($2, state),
              compact_transcript_summary = COALESCE($3, compact_transcript_summary),
              updated_at = NOW()
          WHERE conversation_id = $1
            AND deleted_at IS NULL
          RETURNING *
        `,
        [input.conversationId, input.state ?? null, input.compactTranscriptSummary ?? null],
      );
    },

    async updateUserMessageAndDeleteDownstream(input: UpdateHarnessChatUserMessageInput) {
      const client = await dbPool.connect();

      try {
        await client.query("BEGIN");
        const existing = await client.query<HarnessChatMessageRecord>(
          `
            SELECT *
            FROM harness_chat_messages
            WHERE conversation_id = $1
              AND message_id = $2
              AND role = 'user'
              AND created_by_root_user_id = $3
            FOR UPDATE
          `,
          [input.conversationId, input.messageId, input.rootUserId],
        );
        const message = existing.rows[0] ?? null;
        if (!message) {
          await client.query("ROLLBACK");
          return null;
        }

        await client.query(
          `
            DELETE FROM harness_chat_messages
            WHERE conversation_id = $1
              AND sequence_number > $2
          `,
          [input.conversationId, message.sequence_number],
        );

        const updated = await client.query<HarnessChatMessageRecord>(
          `
            UPDATE harness_chat_messages
            SET body = $1,
                metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb
            WHERE message_id = $3
            RETURNING *
          `,
          [
            input.body,
            JSON.stringify(input.metadata ?? {}),
            input.messageId,
          ],
        );

        await client.query(
          `
            UPDATE harness_chat_conversations
            SET latest_packet_revision_id = NULL,
                state = 'active',
                updated_at = NOW()
            WHERE conversation_id = $1
              AND deleted_at IS NULL
          `,
          [input.conversationId],
        );
        await client.query("COMMIT");
        return toMessageData(updated.rows[0]);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async createPacketRevision(input: CreateHarnessChatPacketRevisionInput) {
      const client = await dbPool.connect();

      try {
        await client.query("BEGIN");
        const previous = await client.query<HarnessChatPacketRevisionRecord>(
          `
            SELECT *
            FROM harness_chat_packet_revisions
            WHERE conversation_id = $1
              AND superseded_at IS NULL
              AND state IN ('generated', 'pdf-ready', 'downloaded')
            ORDER BY version DESC
            LIMIT 1
            FOR UPDATE
          `,
          [input.conversationId],
        );
        const previousRevision = previous.rows[0] ?? null;
        const nextVersion = (previousRevision?.version ?? 0) + 1;

        if (previousRevision) {
          await client.query(
            `
              UPDATE harness_chat_packet_revisions
              SET state = 'superseded',
                  superseded_at = NOW(),
                  updated_at = NOW()
              WHERE packet_revision_id = $1
            `,
            [previousRevision.packet_revision_id],
          );
        }

        const created = await client.query<HarnessChatPacketRevisionRecord>(
          `
            INSERT INTO harness_chat_packet_revisions (
              packet_revision_id,
              conversation_id,
              product_request_id,
              version,
              state,
              product_discovery_packet_path,
              packet_data,
              source_message_sequence_max,
              previous_packet_revision_id,
              next_packet_revision_id,
              generated_by_root_user_id,
              generated_at,
              superseded_at,
              created_at,
              updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, NULL, $10, NOW(), NULL, NOW(), NOW())
            RETURNING *
          `,
          [
            input.packetRevisionId,
            input.conversationId,
            input.productRequestId ?? null,
            nextVersion,
            input.state ?? "generated",
            input.productDiscoveryPacketPath ?? null,
            JSON.stringify(input.packetData),
            input.sourceMessageSequenceMax,
            previousRevision?.packet_revision_id ?? null,
            input.generatedByRootUserId,
          ],
        );

        if (previousRevision) {
          await client.query(
            `
              UPDATE harness_chat_packet_revisions
              SET next_packet_revision_id = $1,
                  updated_at = NOW()
              WHERE packet_revision_id = $2
            `,
            [input.packetRevisionId, previousRevision.packet_revision_id],
          );
        }

        await client.query(
          `
            UPDATE harness_chat_conversations
            SET latest_packet_revision_id = $1,
                state = 'packet-ready',
                updated_at = NOW()
            WHERE conversation_id = $2
              AND deleted_at IS NULL
          `,
          [input.packetRevisionId, input.conversationId],
        );
        await client.query("COMMIT");
        return toPacketRevisionData(created.rows[0]);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async findCurrentPacketRevision(conversationId: string) {
      const result = await dbPool.query<HarnessChatPacketRevisionRecord>(
        `
          SELECT *
          FROM harness_chat_packet_revisions
          WHERE conversation_id = $1
            AND superseded_at IS NULL
            AND state IN ('generated', 'pdf-ready', 'downloaded')
          ORDER BY version DESC
          LIMIT 1
        `,
        [conversationId],
      );
      return result.rows[0] ? toPacketRevisionData(result.rows[0]) : null;
    },

    async listPacketRevisions(conversationId: string) {
      const result = await dbPool.query<HarnessChatPacketRevisionRecord>(
        `
          SELECT *
          FROM harness_chat_packet_revisions
          WHERE conversation_id = $1
          ORDER BY version ASC
        `,
        [conversationId],
      );
      return result.rows.map(toPacketRevisionData);
    },

    async markPacketDownloaded(packetRevisionId: string) {
      const result = await dbPool.query<HarnessChatPacketRevisionRecord>(
        `
          UPDATE harness_chat_packet_revisions
          SET state = 'downloaded',
              updated_at = NOW()
          WHERE packet_revision_id = $1
            AND state IN ('generated', 'pdf-ready', 'downloaded')
          RETURNING *
        `,
        [packetRevisionId],
      );
      return result.rows[0] ? toPacketRevisionData(result.rows[0]) : null;
    },

    async recordPdfAttempt(input: RecordHarnessChatPdfAttemptInput) {
      const result = await dbPool.query<HarnessChatPdfAttemptRecord>(
        `
          INSERT INTO harness_chat_pdf_attempts (
            pdf_attempt_id,
            packet_revision_id,
            requested_by_root_user_id,
            state,
            safe_failure_reason,
            source_data_size_bytes,
            rendered_html_size_bytes,
            output_size_bytes,
            duration_ms,
            retry_of_attempt_id,
            started_at,
            completed_at,
            created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
          RETURNING *
        `,
        [
          input.pdfAttemptId,
          input.packetRevisionId,
          input.requestedByRootUserId,
          input.state,
          input.safeFailureReason ?? null,
          input.sourceDataSizeBytes ?? null,
          input.renderedHtmlSizeBytes ?? null,
          input.outputSizeBytes ?? null,
          input.durationMs ?? null,
          input.retryOfAttemptId ?? null,
          input.startedAt ?? null,
          input.completedAt ?? null,
        ],
      );
      return toPdfAttemptData(result.rows[0]);
    },

    async listPdfAttempts(packetRevisionId: string) {
      const result = await dbPool.query<HarnessChatPdfAttemptRecord>(
        `
          SELECT *
          FROM harness_chat_pdf_attempts
          WHERE packet_revision_id = $1
          ORDER BY created_at ASC
        `,
        [packetRevisionId],
      );
      return result.rows.map(toPdfAttemptData);
    },

    async reserveLlmUsageAttempt(input: ReserveHarnessChatLlmUsageAttemptInput) {
      const client = await dbPool.connect();
      const requestedAt = input.requestedAt ?? new Date();

      try {
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
          `harness_chat_llm_usage:${input.provider}:${input.model}`,
        ]);

        const usage = await client.query<{
          daily_count: string;
          monthly_count: string;
          request_day: Date;
          request_month: Date;
        }>(
          `
            WITH request_window AS (
              SELECT
                ($1::timestamptz AT TIME ZONE 'UTC')::date AS request_day,
                date_trunc('month', $1::timestamptz AT TIME ZONE 'UTC')::date AS request_month
            )
            SELECT
              request_window.request_day,
              request_window.request_month,
              COUNT(*) FILTER (
                WHERE attempts.request_day = request_window.request_day
                  AND attempts.state IN ('reserved', 'succeeded', 'failed')
              ) AS daily_count,
              COUNT(*) FILTER (
                WHERE attempts.request_month = request_window.request_month
                  AND attempts.state IN ('reserved', 'succeeded', 'failed')
              ) AS monthly_count
            FROM request_window
            LEFT JOIN harness_chat_llm_usage_attempts attempts
              ON attempts.provider = $2
             AND attempts.model = $3
             AND attempts.request_month = request_window.request_month
            GROUP BY request_window.request_day, request_window.request_month
          `,
          [requestedAt, input.provider, input.model],
        );
        const counts = usage.rows[0];
        const dailyCount = Number.parseInt(counts.daily_count, 10);
        const monthlyCount = Number.parseInt(counts.monthly_count, 10);
        const state = dailyCount >= input.dailyRequestLimit || monthlyCount >= input.monthlyRequestLimit
          ? "blocked"
          : "reserved";
        const safeFailureReason = dailyCount >= input.dailyRequestLimit
          ? "daily_request_limit"
          : monthlyCount >= input.monthlyRequestLimit
            ? "monthly_request_limit"
            : null;

        const inserted = await client.query<HarnessChatLlmUsageAttemptRecord>(
          `
            INSERT INTO harness_chat_llm_usage_attempts (
              llm_usage_attempt_id,
              conversation_id,
              provider,
              model,
              state,
              safe_failure_reason,
              request_day,
              request_month,
              daily_request_limit,
              monthly_request_limit,
              input_chars,
              transcript_message_count,
              output_chars,
              error_code,
              created_at,
              completed_at
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8,
              $9,
              $10,
              $11,
              $12,
              NULL,
              NULL,
              $13::timestamptz,
              CASE WHEN $5 = 'blocked' THEN $13::timestamptz ELSE NULL END
            )
            RETURNING *
          `,
          [
            input.llmUsageAttemptId,
            input.conversationId,
            input.provider,
            input.model,
            state,
            safeFailureReason,
            counts.request_day,
            counts.request_month,
            input.dailyRequestLimit,
            input.monthlyRequestLimit,
            input.inputChars,
            input.transcriptMessageCount,
            requestedAt,
          ],
        );
        await client.query("COMMIT");
        return toLlmUsageAttemptData(inserted.rows[0]);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async completeLlmUsageAttempt(input: CompleteHarnessChatLlmUsageAttemptInput) {
      const result = await dbPool.query<HarnessChatLlmUsageAttemptRecord>(
        `
          UPDATE harness_chat_llm_usage_attempts
          SET state = $2,
              safe_failure_reason = $3,
              output_chars = $4,
              error_code = $5,
              completed_at = $6
          WHERE llm_usage_attempt_id = $1
            AND state = 'reserved'
          RETURNING *
        `,
        [
          input.llmUsageAttemptId,
          input.state,
          input.safeFailureReason ?? null,
          input.outputChars ?? null,
          input.errorCode ?? null,
          input.completedAt ?? new Date(),
        ],
      );
      return toLlmUsageAttemptData(result.rows[0]);
    },

    async listLlmUsageAttempts(conversationId: string) {
      const result = await dbPool.query<HarnessChatLlmUsageAttemptRecord>(
        `
          SELECT *
          FROM harness_chat_llm_usage_attempts
          WHERE conversation_id = $1
          ORDER BY created_at ASC
        `,
        [conversationId],
      );
      return result.rows.map(toLlmUsageAttemptData);
    },
  };
}
