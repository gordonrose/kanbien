import type { Pool } from "pg";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import { createNotificationEmailWriter } from "./emailWriter";
import { createNotificationDeliveryRouter } from "./transport/router";

export function createNotificationDeliveryFeature(
  dbPool: Pool,
  capabilityChecker: RootCapabilityChecker,
  platformSecurityRepository: PlatformSecurityRepository,
) {
  const service = createNotificationEmailWriter(dbPool);

  return createNotificationDeliveryRouter(service, capabilityChecker, platformSecurityRepository);
}
