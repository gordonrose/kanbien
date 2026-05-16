import { InvalidJobRequestError } from "../contract/errors";
import { assertSafeJobPayload } from "./payloadSafety";
import type { JobTypeRegistry } from "./jobRegistry";
import type { EnqueueJobRequest, RecurringScheduleDefinition } from "./types";

export interface RecurringScheduleRegistryDefinition {
  scheduleKey: string;
  jobType: string;
  payloadVersion: number;
  cadenceSeconds: number;
  enabled?: boolean;
  initialNextRunAt?: Date;
  payloadFactory: (input: { dueSlotAt: Date }) => EnqueueJobRequest["payload"];
  queueName?: EnqueueJobRequest["queueName"];
  priority?: number;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
}

export interface ValidatedRecurringScheduleDefinition
  extends Required<Pick<RecurringScheduleRegistryDefinition, "enabled">>,
    Omit<RecurringScheduleRegistryDefinition, "enabled" | "initialNextRunAt"> {
  initialNextRunAt: Date;
}

export class RecurringScheduleRegistry {
  private readonly definitions = new Map<string, ValidatedRecurringScheduleDefinition>();

  constructor(
    definitions: RecurringScheduleRegistryDefinition[] = [],
    private readonly jobRegistry?: JobTypeRegistry,
  ) {
    definitions.forEach((definition) => this.register(definition));
  }

  register(definition: RecurringScheduleRegistryDefinition): void {
    const scheduleKey = definition.scheduleKey.trim();
    if (!scheduleKey) {
      throw new InvalidJobRequestError("Recurring schedule key is required.", {
        field: "scheduleKey",
        reason: "required",
      });
    }
    if (this.definitions.has(scheduleKey)) {
      throw new InvalidJobRequestError("Recurring schedule keys must be unique.", {
        field: "scheduleKey",
        reason: "duplicate",
      });
    }
    if (!Number.isInteger(definition.cadenceSeconds) || definition.cadenceSeconds < 60) {
      throw new InvalidJobRequestError("Recurring schedule cadence must be at least 60 seconds.", {
        field: "cadenceSeconds",
        reason: "invalid_range",
      });
    }
    if (typeof definition.payloadFactory !== "function") {
      throw new InvalidJobRequestError("Recurring schedule payloadFactory is required.", {
        field: "payloadFactory",
        reason: "required",
      });
    }

    const jobDefinition = this.jobRegistry?.require(definition.jobType);
    if (this.jobRegistry && !jobDefinition?.supportedPayloadVersions[definition.payloadVersion]) {
      throw new InvalidJobRequestError("Recurring schedule payload version is not supported.", {
        field: "payloadVersion",
        reason: "unsupported",
      });
    }

    this.definitions.set(scheduleKey, {
      ...definition,
      scheduleKey,
      enabled: definition.enabled ?? true,
      initialNextRunAt: definition.initialNextRunAt ?? new Date(0),
    });
  }

  list(): ValidatedRecurringScheduleDefinition[] {
    return [...this.definitions.values()];
  }

  toPersistentDefinitions(): RecurringScheduleDefinition[] {
    return this.list().map((definition) => ({
      scheduleKey: definition.scheduleKey,
      jobType: definition.jobType,
      payloadVersion: definition.payloadVersion,
      cadenceSeconds: definition.cadenceSeconds,
      enabled: definition.enabled,
      nextRunAt: definition.initialNextRunAt,
    }));
  }

  require(scheduleKey: string): ValidatedRecurringScheduleDefinition {
    const definition = this.definitions.get(scheduleKey);
    if (!definition) {
      throw new InvalidJobRequestError("Unknown recurring schedule key.", {
        field: "scheduleKey",
        reason: "unknown",
      });
    }
    return definition;
  }

  buildEnqueueRequest(input: {
    scheduleKey: string;
    dueSlotAt: Date;
  }): EnqueueJobRequest {
    const definition = this.require(input.scheduleKey);
    const payload = definition.payloadFactory({ dueSlotAt: input.dueSlotAt });
    assertSafeJobPayload(payload);

    return {
      jobType: definition.jobType,
      payloadVersion: definition.payloadVersion,
      payload,
      executionScope: "platform-internal",
      queueName: definition.queueName,
      priority: definition.priority,
      runAt: input.dueSlotAt,
      idempotencyKey: `recurring-schedule:${definition.scheduleKey}:${input.dueSlotAt.toISOString()}`,
      requestedByActorType: "system",
      requestedByActorId: "recurring-scheduler",
      relatedEntityType: definition.relatedEntityType ?? "recurring_schedule",
      relatedEntityId: definition.relatedEntityId ?? definition.scheduleKey,
    };
  }
}

export function createRecurringScheduleRegistry(input: {
  definitions?: RecurringScheduleRegistryDefinition[];
  jobRegistry?: JobTypeRegistry;
} = {}): RecurringScheduleRegistry {
  return new RecurringScheduleRegistry(input.definitions ?? [], input.jobRegistry);
}

