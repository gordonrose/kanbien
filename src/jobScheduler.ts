import { dbPool } from "./lib/db";
import { createPostgresPlatformSecurityRepository } from "./lib/security/postgresRepository";
import { createAssetsFeature } from "./features/assets";
import { createNotificationDeliveryJobTypesForRuntime } from "./features/notificationDelivery";
import { createOrganizationBrandingReferencesFeature } from "./features/organizationBrandingReferences";
import { createOrganizationBusinessUnitMembershipsFeature } from "./features/organizationBusinessUnitMemberships";
import { createOrganizationBusinessUnitsFeature } from "./features/organizationBusinessUnits";
import { createOrganizationCoreFeature } from "./features/organizationCore";
import {
  createOrganizationExportJobTypes,
  createOrganizationExportRecurringSchedules,
  createOrganizationExportsFeature,
} from "./features/organizationExports";
import { createOrganizationLegalDetailsFeature } from "./features/organizationLegalDetails";
import { createOrganizationLocationsFeature } from "./features/organizationLocations";
import { createOrganizationOpeningHoursFeature } from "./features/organizationOpeningHours";
import { createOrganizationReferenceCataloguesFeature } from "./features/organizationReferenceCatalogues";
import { createTenantAuthSessionLookupRepository } from "./features/tenantAuth";
import {
  createJobTypeRegistry,
  createPostgresJobProcessingRepository,
  createRecurringScheduleRegistry,
  runRecurringSchedulerOnce,
} from "./features/jobProcessing";

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
  });
  const jobRegistry = createJobTypeRegistry([
    ...createNotificationDeliveryJobTypesForRuntime(dbPool),
    ...createOrganizationExportJobTypes(organizationExportsFeature.organizationExportsService),
  ]);
  const scheduleRegistry = createRecurringScheduleRegistry({
    jobRegistry,
    definitions: createOrganizationExportRecurringSchedules(),
  });
  const schedulerId = `job-scheduler-${process.pid}`;

  try {
    const result = await runRecurringSchedulerOnce({
      repository,
      jobRegistry,
      scheduleRegistry,
      schedulerId,
    });
    console.info("Job scheduler completed", result);
  } finally {
    await dbPool.end();
  }
}

main().catch(async (error: unknown) => {
  console.error("Job scheduler failed", error);
  await dbPool.end().catch(() => undefined);
  process.exit(1);
});
