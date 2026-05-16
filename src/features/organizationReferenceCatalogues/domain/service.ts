import { randomUUID } from "node:crypto";
import {
  OrganizationReferenceReplacementInvalidError,
  OrganizationReferenceValueNotFoundError,
} from "../contract/errors";
import type { OrganizationReferenceCataloguesRepository } from "../persistence/types";
import { toReferenceValue } from "./presenters";
import type {
  CreateReferenceValueInput,
  ListReferenceValuesInput,
  ReferenceValueActorInput,
  ReferenceValueLifecycleInput,
  ReferenceValueListResult,
  ReplaceReferenceValueInput,
  UpdateReferenceValueInput,
} from "./types";

export interface OrganizationReferenceCataloguesService {
  createReferenceValue(input: CreateReferenceValueInput): Promise<ReturnType<typeof toReferenceValue>>;
  listReferenceValues(input: ListReferenceValuesInput): Promise<ReferenceValueListResult>;
  updateReferenceValueLabel(input: UpdateReferenceValueInput): Promise<ReturnType<typeof toReferenceValue>>;
  archiveReferenceValue(input: ReferenceValueLifecycleInput): Promise<ReturnType<typeof toReferenceValue>>;
  deprecateReferenceValue(input: ReferenceValueLifecycleInput): Promise<ReturnType<typeof toReferenceValue>>;
  replaceReferenceValue(input: ReplaceReferenceValueInput): Promise<ReturnType<typeof toReferenceValue>>;
  assertReferenceValueUsable(referenceValueId: string): Promise<ReturnType<typeof toReferenceValue>>;
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

async function recordAudit(
  repository: OrganizationReferenceCataloguesRepository,
  input: ReferenceValueActorInput & {
    referenceValueId: string;
    eventType: string;
    eventDetails?: Record<string, unknown>;
  },
): Promise<void> {
  await repository.recordAuditEvent({
    eventId: randomUUID(),
    referenceValueId: input.referenceValueId,
    actorType: input.actorType,
    actorId: input.actorId,
    eventType: input.eventType,
    eventOutcome: "success",
    eventDetails: input.eventDetails ?? {},
    occurredAt: new Date(),
  });
}

export function createOrganizationReferenceCataloguesService(
  repository: OrganizationReferenceCataloguesRepository,
): OrganizationReferenceCataloguesService {
  return {
    async createReferenceValue(input) {
      const record = await repository.create({
        referenceValueId: randomUUID(),
        referenceType: normalizeKey(input.referenceType),
        referenceValueKey: normalizeKey(input.referenceValueKey),
        label: input.label.trim(),
      });
      await recordAudit(repository, { ...input, referenceValueId: record.referenceValueId, eventType: "organization_reference_value_created" });
      return toReferenceValue(record);
    },
    async listReferenceValues(input) {
      const result = await repository.list({
        ...input,
        referenceType: input.referenceType ? normalizeKey(input.referenceType) : undefined,
      });
      return {
        items: result.items.map(toReferenceValue),
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.max(1, Math.ceil(result.totalMatchingRecords / input.pageSize)),
        totalMatchingRecords: result.totalMatchingRecords,
        totalSearchableRecords: result.totalSearchableRecords,
      };
    },
    async updateReferenceValueLabel(input) {
      const record = await repository.updateLabel(input.referenceValueId, input.label.trim());
      if (!record) throw new OrganizationReferenceValueNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_reference_value_label_updated" });
      return toReferenceValue(record);
    },
    async archiveReferenceValue(input) {
      const record = await repository.archive(input.referenceValueId);
      if (!record) throw new OrganizationReferenceValueNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_reference_value_archived" });
      return toReferenceValue(record);
    },
    async deprecateReferenceValue(input) {
      const record = await repository.deprecate(input.referenceValueId);
      if (!record) throw new OrganizationReferenceValueNotFoundError();
      await recordAudit(repository, { ...input, eventType: "organization_reference_value_deprecated" });
      return toReferenceValue(record);
    },
    async replaceReferenceValue(input) {
      if (input.referenceValueId === input.replacementReferenceValueId) {
        throw new OrganizationReferenceReplacementInvalidError("Replacement cannot point to the same reference value.", {
          field: "replacementReferenceValueId",
          reason: "self_replacement",
        });
      }
      const current = await repository.findById(input.referenceValueId);
      const replacement = await repository.findById(input.replacementReferenceValueId);
      if (!current) throw new OrganizationReferenceValueNotFoundError();
      if (!replacement || replacement.referenceType !== current.referenceType || replacement.lifecycleStatus !== "active") {
        throw new OrganizationReferenceReplacementInvalidError(undefined, {
          field: "replacementReferenceValueId",
          reason: "invalid_replacement",
        });
      }
      const record = await repository.replace(input.referenceValueId, input.replacementReferenceValueId);
      if (!record) throw new OrganizationReferenceValueNotFoundError();
      await recordAudit(repository, {
        ...input,
        eventType: "organization_reference_value_replaced",
        eventDetails: { replacementReferenceValueId: input.replacementReferenceValueId },
      });
      return toReferenceValue(record);
    },
    async assertReferenceValueUsable(referenceValueId) {
      const record = await repository.findById(referenceValueId);
      if (!record || record.lifecycleStatus !== "active") {
        throw new OrganizationReferenceValueNotFoundError();
      }
      return toReferenceValue(record);
    },
  };
}
