import { env } from "./config/env";
import { dbPool } from "./lib/db";
import { createPostgresPlatformSecurityRepository } from "./lib/security/postgresRepository";
import {
  createNotificationDeliveryJobTypesForRuntime,
  createNotificationEmailWriter,
} from "./features/notificationDelivery";
import { createAssetsFeature } from "./features/assets";
import { createOrganizationBrandingReferencesFeature } from "./features/organizationBrandingReferences";
import { createOrganizationBusinessUnitMembershipsFeature } from "./features/organizationBusinessUnitMemberships";
import { createOrganizationBusinessUnitsFeature } from "./features/organizationBusinessUnits";
import { createOrganizationCoreFeature } from "./features/organizationCore";
import { createOrganizationExportJobTypes, createOrganizationExportsFeature } from "./features/organizationExports";
import { createOrganizationLegalDetailsFeature } from "./features/organizationLegalDetails";
import { createOrganizationLocationsFeature } from "./features/organizationLocations";
import { createOrganizationOpeningHoursFeature } from "./features/organizationOpeningHours";
import { createOrganizationReferenceCataloguesFeature } from "./features/organizationReferenceCatalogues";
import { createTenantAuthSessionLookupRepository } from "./features/tenantAuth";
import {
  JOB_QUEUE_NAMES,
  createJobTypeRegistry,
  createJobWorkerRuntime,
  createPostgresJobProcessingRepository,
  createWorkerIdentity,
  executeRegisteredJob,
  installGracefulShutdown,
} from "./features/jobProcessing";
import { createBullMqQueueProviderAdapter } from "./features/jobProcessing/domain/bullmqQueueProviderAdapter";

async function main(): Promise<void> {
  const repository = createPostgresJobProcessingRepository(dbPool);
  const platformSecurityRepository = createPostgresPlatformSecurityRepository(dbPool);
  const capabilityChecker = {
    async hasCapability() {
      return true;
    },
  };
  const tenantSessionLookupRepository = createTenantAuthSessionLookupRepository(dbPool);
  const assetsFeature = createAssetsFeature(dbPool, capabilityChecker, platformSecurityRepository);
  const organizationCoreFeature = createOrganizationCoreFeature(
    dbPool,
    capabilityChecker,
    tenantSessionLookupRepository,
  );
  const organizationLegalDetailsFeature = createOrganizationLegalDetailsFeature(
    dbPool,
    capabilityChecker,
    tenantSessionLookupRepository,
    organizationCoreFeature.organizationCoreService,
  );
  const organizationLocationsFeature = createOrganizationLocationsFeature(
    dbPool,
    capabilityChecker,
    tenantSessionLookupRepository,
    organizationCoreFeature.organizationCoreService,
  );
  const organizationOpeningHoursFeature = createOrganizationOpeningHoursFeature(
    dbPool,
    capabilityChecker,
    tenantSessionLookupRepository,
    organizationLocationsFeature.organizationLocationsService,
  );
  const organizationBusinessUnitsFeature = createOrganizationBusinessUnitsFeature(
    dbPool,
    capabilityChecker,
    tenantSessionLookupRepository,
    organizationCoreFeature.organizationCoreService,
  );
  const organizationBusinessUnitMembershipsFeature = createOrganizationBusinessUnitMembershipsFeature(
    dbPool,
    capabilityChecker,
    tenantSessionLookupRepository,
    organizationBusinessUnitsFeature.organizationBusinessUnitsService,
  );
  const organizationReferenceCataloguesFeature = createOrganizationReferenceCataloguesFeature(
    dbPool,
    capabilityChecker,
    tenantSessionLookupRepository,
  );
  const organizationBrandingReferencesFeature = createOrganizationBrandingReferencesFeature(
    dbPool,
    capabilityChecker,
    tenantSessionLookupRepository,
    organizationCoreFeature.organizationCoreService,
    assetsFeature.assetsService,
  );
  const organizationExportsFeature = createOrganizationExportsFeature({
    dbPool,
    capabilityChecker,
    tenantSessionLookupRepository,
    organizationCoreService: organizationCoreFeature.organizationCoreService,
    legalDetailsService: organizationLegalDetailsFeature.organizationLegalDetailsService,
    locationsService: organizationLocationsFeature.organizationLocationsService,
    openingHoursService: organizationOpeningHoursFeature.organizationOpeningHoursService,
    businessUnitsService: organizationBusinessUnitsFeature.organizationBusinessUnitsService,
    membershipsService: organizationBusinessUnitMembershipsFeature.organizationBusinessUnitMembershipsService,
    referenceCataloguesService: organizationReferenceCataloguesFeature.organizationReferenceCataloguesService,
    brandingService: organizationBrandingReferencesFeature.organizationBrandingReferencesService,
    assetsService: assetsFeature.assetsService,
    notificationService: createNotificationEmailWriter(dbPool),
  });
  const registry = createJobTypeRegistry([
    ...createNotificationDeliveryJobTypesForRuntime(dbPool),
    ...createOrganizationExportJobTypes(organizationExportsFeature.organizationExportsService),
  ]);
  const provider = createBullMqQueueProviderAdapter({ redisUrl: env.jobProcessing.redisUrl });
  const workerId = createWorkerIdentity();
  const runtime = createJobWorkerRuntime({
    provider,
    queueNames: JOB_QUEUE_NAMES,
    workerId,
    handler: async (jobId) => {
      const result = await executeRegisteredJob({
        repository,
        registry,
        jobId,
        workerId,
      });
      if (result === "retryable") {
        throw new Error("Durable job remains retryable.");
      }
    },
  });

  installGracefulShutdown(runtime);
  await runtime.start();
  console.info("Job worker started", { workerId: runtime.workerId });
}

main().catch(async (error: unknown) => {
  console.error("Job worker failed", error);
  await dbPool.end().catch(() => undefined);
  process.exit(1);
});
