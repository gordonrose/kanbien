import { describe, expect, it } from "vitest";
import { createOneTimeTokenMaterial } from "../../../src/lib/tokens";
import { createTenantAdminsService } from "../../../src/features/tenantAdmins/domain/service";
import { TenantAdminEmailAlreadyExistsError } from "../../../src/features/tenantAdmins/contract/errors";
import { createNotificationDeliveryService } from "../../../src/features/notificationDelivery/domain/service";
import {
  createInMemoryNotificationDeliveryRepository,
  FakeNotificationEmailProvider,
} from "../../helpers/notificationDeliveryHarness";
import {
  createInMemoryTenantAdminsRepository,
  createTenantAdminRecord,
  createVisibleTenantsReader,
} from "../../helpers/tenantAdminsHarness";

describe("tenantAdmins service", () => {
  it("TC-TENANT-ADMINS-UNIT-001 creates tenant admins with normalized email and tenant-scoped uniqueness", async () => {
    const repository = createInMemoryTenantAdminsRepository([
      createTenantAdminRecord({ email: "taken@example.com", normalizedEmail: "taken@example.com" }),
    ]);
    const service = createTenantAdminsService(
      repository,
      createVisibleTenantsReader([
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ]),
      createNotificationDeliveryService(
        createInMemoryNotificationDeliveryRepository(),
        new FakeNotificationEmailProvider(),
      ),
    );

    await expect(
      service.createTenantAdmin({
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "TAKEN@example.com",
        createdByRootAdminUserId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toBeInstanceOf(TenantAdminEmailAlreadyExistsError);

    const created = await service.createTenantAdmin({
      tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      email: "NEW.ADMIN@example.com",
      createdByRootAdminUserId: "11111111-1111-1111-1111-111111111111",
    });
    expect(created.email).toBe("new.admin@example.com");
    expect(created.emailVerificationStatus).toBe("pending");
    expect(created.lastVerificationEmailRequestedAt).toBeNull();
  });

  it("TC-TENANT-ADMINS-UNIT-004 resets verification state when a verified email changes", async () => {
    const repository = createInMemoryTenantAdminsRepository([
      createTenantAdminRecord({
        emailVerificationStatus: "verified",
        emailVerifiedAt: new Date("2026-04-08T09:00:00.000Z"),
      }),
    ]);
    const service = createTenantAdminsService(
      repository,
      createVisibleTenantsReader(),
      createNotificationDeliveryService(
        createInMemoryNotificationDeliveryRepository(),
        new FakeNotificationEmailProvider(),
      ),
    );

    const updated = await service.updateTenantAdminProfile({
      tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      email: "changed@example.com",
    });

    expect(updated.email).toBe("changed@example.com");
    expect(updated.emailVerificationStatus).toBe("pending");
    expect(updated.emailVerifiedAt).toBeNull();
  });

  it("TC-TENANT-ADMINS-UNIT-002 and TC-TENANT-ADMINS-UNIT-003 read one tenant admin exactly and list tenant-scoped results deterministically", async () => {
    const repository = createInMemoryTenantAdminsRepository([
      createTenantAdminRecord(),
      createTenantAdminRecord({
        tenantAdminId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        email: "bravo@example.com",
        normalizedEmail: "bravo@example.com",
        updatedAt: new Date("2026-04-08T09:00:00.000Z"),
      }),
    ]);
    const service = createTenantAdminsService(
      repository,
      createVisibleTenantsReader(),
      createNotificationDeliveryService(
        createInMemoryNotificationDeliveryRepository(),
        new FakeNotificationEmailProvider(),
      ),
    );

    const exact = await service.getTenantAdmin({
      tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    });
    expect(exact.tenantAdminId).toBe("cccccccc-cccc-4ccc-8ccc-cccccccccccc");

    const list = await service.listTenantAdmins({
      tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      page: 1,
      pageSize: 25,
      orderBy: "updatedAt",
      orderDirection: "desc",
      filters: {},
    });
    expect(list.items).toHaveLength(2);
    expect(list.items[0]?.tenantAdminId).toBe("eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee");
  });

  it("TC-TENANT-ADMINS-UNIT-008 and TC-TENANT-ADMINS-UNIT-009 soft delete and reactivate tenant admins with explicit verification-state truth", async () => {
    const repository = createInMemoryTenantAdminsRepository([
      createTenantAdminRecord({
        emailVerificationStatus: "verified",
        emailVerifiedAt: new Date("2026-04-08T09:00:00.000Z"),
      }),
    ]);
    const service = createTenantAdminsService(
      repository,
      createVisibleTenantsReader(),
      createNotificationDeliveryService(
        createInMemoryNotificationDeliveryRepository(),
        new FakeNotificationEmailProvider(),
      ),
    );

    const deleted = await service.softDeleteTenantAdmin({
      tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    });
    expect(deleted.deletedAt).not.toBeNull();

    const reactivated = await service.reactivateTenantAdmin({
      tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    });
    expect(reactivated.deletedAt).toBeNull();
    expect(reactivated.emailVerificationStatus).toBe("pending");
    expect(reactivated.emailVerifiedAt).toBeNull();
  });

  it("TC-TENANT-ADMINS-UNIT-005 TC-TENANT-ADMINS-UNIT-006 TC-TENANT-ADMINS-UNIT-007 and TC-TENANT-ADMINS-EDGE-001 send, resend, and redeem verification with fresh token semantics", async () => {
    const repository = createInMemoryTenantAdminsRepository([createTenantAdminRecord()]);
    const notificationRepository = createInMemoryNotificationDeliveryRepository();
    const provider = new FakeNotificationEmailProvider("fake-provider");
    const service = createTenantAdminsService(
      repository,
      createVisibleTenantsReader(),
      createNotificationDeliveryService(notificationRepository, provider),
    );

    const sent = await service.sendTenantAdminVerificationEmail({
      tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      requestedByActorId: "11111111-1111-1111-1111-111111111111",
    });
    expect(sent.lastVerificationEmailRequestedAt).not.toBeNull();
    expect(provider.sentInputs).toHaveLength(1);
    const firstToken = [...repository.verificationTokens.values()].find((item) => item.invalidatedAt === null)!;
    const firstEmail = [...notificationRepository.records.values()][0]!;
    expect(firstEmail.contentVersions[0]?.bodyText).toContain("[VERIFICATION LINK]");

    const resent = await service.resendTenantAdminVerificationEmail({
      tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      requestedByActorId: "11111111-1111-1111-1111-111111111111",
      resendReason: "operator retry",
    });
    expect(resent.lastVerificationEmailRequestedAt).not.toBeNull();
    const activeTokens = [...repository.verificationTokens.values()].filter(
      (item) => item.invalidatedAt === null && item.usedAt === null,
    );
    expect(activeTokens).toHaveLength(1);
    expect(repository.verificationTokens.get(firstToken.tokenId)?.invalidatedAt).not.toBeNull();
    const latestEmail = [...notificationRepository.records.values()][0]!;
    expect(latestEmail.attemptCount).toBe(2);

    const tokenMaterial = createOneTimeTokenMaterial({
      purpose: "email_verification",
      ttlSeconds: 300,
    });
    repository.verificationTokens.clear();
    await repository.createVerificationToken({
      tenantAdminVerificationTokenId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      tokenId: tokenMaterial.tokenId,
      secretHash: tokenMaterial.secretHash,
      expiresAt: tokenMaterial.expiresAt,
      requestedByActorType: "root_user",
      requestedByActorId: "11111111-1111-1111-1111-111111111111",
    });
    const redeemed = await service.redeemTenantAdminVerificationToken({
      token: tokenMaterial.rawToken,
    });
    expect(redeemed.emailVerificationStatus).toBe("verified");
    expect(redeemed.emailVerifiedAt).not.toBeNull();
  });
});
