import {
  DuplicateJobTypeError,
  InvalidJobRequestError,
  UnknownJobTypeError,
} from "../contract/errors";
import { assertCriticalQueueAllowed, assertJobQueueName, normalizePriority } from "./queueConfig";
import { normalizeRetryPolicy } from "./retryPolicy";
import type { JobTypeDefinition } from "./types";

export class JobTypeRegistry {
  private readonly definitions = new Map<string, JobTypeDefinition>();

  register(definition: JobTypeDefinition): void {
    if (this.definitions.has(definition.jobType)) {
      throw new DuplicateJobTypeError(definition.jobType);
    }
    if (Object.keys(definition.supportedPayloadVersions).length === 0) {
      throw new InvalidJobRequestError("A job type must declare at least one payload version.", {
        field: "supportedPayloadVersions",
        reason: "empty",
      });
    }
    if (!definition.handler) {
      throw new InvalidJobRequestError("A job type must declare a handler.", {
        field: "handler",
        reason: "missing",
      });
    }
    if (
      definition.executionScope === "shared-cross-tenant" &&
      definition.sharedCrossTenantApproved !== true
    ) {
      throw new InvalidJobRequestError("Shared cross-tenant jobs require explicit approval.", {
        field: "executionScope",
        reason: "shared_cross_tenant_unapproved",
      });
    }

    assertJobQueueName(definition.defaultQueue);
    normalizePriority(definition.defaultPriority);
    assertCriticalQueueAllowed(definition.defaultQueue, definition.allowCriticalQueue === true);
    normalizeRetryPolicy(definition.retryPolicy);
    this.definitions.set(definition.jobType, definition);
  }

  require(jobType: string): JobTypeDefinition {
    const definition = this.definitions.get(jobType);
    if (!definition) {
      throw new UnknownJobTypeError(jobType);
    }
    return definition;
  }

  list(): JobTypeDefinition[] {
    return [...this.definitions.values()];
  }
}

export function createJobTypeRegistry(definitions: JobTypeDefinition[] = []): JobTypeRegistry {
  const registry = new JobTypeRegistry();
  definitions.forEach((definition) => registry.register(definition));
  return registry;
}
