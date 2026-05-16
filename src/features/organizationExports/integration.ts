import path from "node:path";
import type { Pool } from "pg";
import { env } from "../../config/env";
import { createLocalStorageAdapter } from "../../lib/storage/localStorageAdapter";
import type { PlatformSecurityRepository } from "../../lib/security/repository";
import type { RootCapabilityChecker } from "../../lib/authz/middleware";
import type { AssetsService } from "../assets";
import type { NotificationEmailWriter } from "../notificationDelivery";
import type { OrganizationBrandingReferencesService } from "../organizationBrandingReferences";
import type { OrganizationBusinessUnitMembershipsService } from "../organizationBusinessUnitMemberships";
import type { OrganizationBusinessUnitsService } from "../organizationBusinessUnits";
import type { OrganizationCoreService } from "../organizationCore";
import type { OrganizationLegalDetailsService } from "../organizationLegalDetails";
import type { OrganizationLocationsService } from "../organizationLocations";
import type { OrganizationOpeningHoursService } from "../organizationOpeningHours";
import type { OrganizationReferenceCataloguesService } from "../organizationReferenceCatalogues";
import type { OrganizationExportJobEnqueuer } from "./domain/service";
import { createOrganizationExportsService } from "./domain/service";
import { createPostgresOrganizationExportRepository } from "./persistence/postgresRepository";
import type { TenantAuthSessionLookupRepository } from "../tenantAuth";
import {
  createRootOrganizationExportsRouter,
  createTenantOrganizationExportsRouter,
} from "./transport/router";

export function createOrganizationExportsFeature(input: {
  dbPool: Pool;
  capabilityChecker: RootCapabilityChecker;
  tenantSessionLookupRepository: TenantAuthSessionLookupRepository;
  organizationCoreService: OrganizationCoreService;
  legalDetailsService?: OrganizationLegalDetailsService;
  locationsService?: OrganizationLocationsService;
  openingHoursService?: OrganizationOpeningHoursService;
  businessUnitsService?: OrganizationBusinessUnitsService;
  membershipsService?: OrganizationBusinessUnitMembershipsService;
  referenceCataloguesService?: OrganizationReferenceCataloguesService;
  brandingService?: OrganizationBrandingReferencesService;
  assetsService?: AssetsService;
  jobEnqueuer?: OrganizationExportJobEnqueuer;
  notificationService?: NotificationEmailWriter;
  platformSecurityRepository?: PlatformSecurityRepository;
}) {
  const repository = createPostgresOrganizationExportRepository(input.dbPool);
  const storageRoot = path.resolve(env.assets.localStorageRoot ?? path.resolve(process.cwd(), ".local-assets"), "exports");
  const storage = createLocalStorageAdapter(storageRoot);
  const service = createOrganizationExportsService({
    repository,
    storage,
    secret: env.database.password,
    organizationCoreService: input.organizationCoreService,
    legalDetailsService: input.legalDetailsService,
    locationsService: input.locationsService,
    openingHoursService: input.openingHoursService,
    businessUnitsService: input.businessUnitsService,
    membershipsService: input.membershipsService,
    referenceCataloguesService: input.referenceCataloguesService,
    brandingService: input.brandingService,
    assetsService: input.assetsService,
    jobEnqueuer: input.jobEnqueuer,
    notificationService: input.notificationService,
    notificationRecipientResolver: createOrganizationExportNotificationRecipientResolver(input.dbPool),
  });

  return {
    organizationExportsService: service,
    rootOrganizationExportsRouter: createRootOrganizationExportsRouter(
      service,
      input.capabilityChecker,
      input.platformSecurityRepository,
    ),
    tenantOrganizationExportsRouter: createTenantOrganizationExportsRouter(
      input.tenantSessionLookupRepository,
      service,
    ),
  };
}

function createOrganizationExportNotificationRecipientResolver(dbPool: Pool) {
  return async (record: { actorType: string; actorId: string }): Promise<string | null> => {
    if (record.actorType === "root-user") {
      const result = await dbPool.query<{ email: string }>(
        `SELECT email
         FROM root_users
         WHERE root_user_id = $1
           AND deleted_at IS NULL
           AND anonymized = false
         LIMIT 1`,
        [record.actorId],
      );
      return result.rows[0]?.email ?? null;
    }

    const result = await dbPool.query<{ login_email: string }>(
      `SELECT login_email
       FROM tenant_auth_principal
       WHERE auth_principal_id = $1
         AND disabled_at IS NULL
       LIMIT 1`,
      [record.actorId],
    );
    return result.rows[0]?.login_email ?? null;
  };
}
