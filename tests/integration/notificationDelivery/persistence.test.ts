import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresNotificationDeliveryRepository } from "../../../src/features/notificationDelivery/persistence/postgresRepository";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("notificationDelivery postgres repository", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
  });

  beforeEach(async () => {
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
    await applyPostgresTestMigrations(pool, [
      "rootUsers",
      "platformSecurity",
      "rootAuth",
      "rootRoles",
      "tenants",
      "notificationDelivery",
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("stores logical email rows, sanitized content versions, and ordered attempts durably", async () => {
    const repository = createPostgresNotificationDeliveryRepository(pool);

    await repository.createLogicalEmail({
      emailId: "11111111-1111-4111-8111-111111111111",
      channel: "email",
      notificationType: "proof",
      templateKey: null,
      tenantId: null,
      relatedEntityType: "root_user",
      relatedEntityId: "00000000-0000-0000-0000-000000000001",
      recipientEmail: "ops@example.com",
      subject: "Original",
      status: "pending",
      provider: "fake-provider",
      createdByActorType: "root_user",
      createdByActorId: "00000000-0000-0000-0000-000000000001",
      requestedAt: new Date("2026-04-08T10:00:00.000Z"),
      duplicateGuardFingerprint: "fingerprint-1",
    });

    const firstContent = await repository.createContentSnapshot({
      contentSnapshotId: "22222222-2222-4222-8222-222222222222",
      emailId: "11111111-1111-4111-8111-111111111111",
      subject: "Original",
      bodyText: "Version one [VERIFICATION LINK]",
      containsRedactedVerificationLink: true,
      containsRedactedResetLink: false,
    });
    await repository.recordAttempt({
      attemptId: "33333333-3333-4333-8333-333333333333",
      emailId: "11111111-1111-4111-8111-111111111111",
      contentSnapshotId: firstContent.contentSnapshotId,
      status: "sent",
      providerMessageId: "msg-1",
      providerResponseCode: "202",
      providerErrorSummary: null,
      resentByActorType: null,
      resentByActorId: null,
      resendReason: null,
    });

    const secondContent = await repository.createContentSnapshot({
      contentSnapshotId: "44444444-4444-4444-8444-444444444444",
      emailId: "11111111-1111-4111-8111-111111111111",
      subject: "Updated",
      bodyText: "Version two [VERIFICATION LINK]",
      containsRedactedVerificationLink: true,
      containsRedactedResetLink: false,
    });
    const updated = await repository.recordAttempt({
      attemptId: "55555555-5555-4555-8555-555555555555",
      emailId: "11111111-1111-4111-8111-111111111111",
      contentSnapshotId: secondContent.contentSnapshotId,
      status: "sent",
      providerMessageId: "msg-2",
      providerResponseCode: "202",
      providerErrorSummary: null,
      resentByActorType: "root_user",
      resentByActorId: "00000000-0000-0000-0000-000000000001",
      resendReason: "correct content",
    });

    expect(updated.subject).toBe("Updated");
    expect(updated.contentVersions.map((item) => item.contentVersionNumber)).toEqual([1, 2]);
    expect(updated.attempts.map((item) => item.contentVersionNumber)).toEqual([1, 2]);
    expect(updated.attemptCount).toBe(2);
  });

  it("TC-NOTIFICATION-DELIVERY-EDGE-003 honors durable filters and stable attempt ordering in persistence-backed retrieval", async () => {
    const repository = createPostgresNotificationDeliveryRepository(pool);

    await repository.createLogicalEmail({
      emailId: "66666666-6666-4666-8666-666666666666",
      channel: "email",
      notificationType: "welcome",
      templateKey: null,
      tenantId: null,
      relatedEntityType: null,
      relatedEntityId: null,
      recipientEmail: "hello@example.com",
      subject: "Welcome",
      status: "pending",
      provider: "fake-provider",
      createdByActorType: "root_user",
      createdByActorId: "00000000-0000-0000-0000-000000000001",
      requestedAt: new Date(),
      duplicateGuardFingerprint: "dup-fingerprint",
    });
    const content = await repository.createContentSnapshot({
      contentSnapshotId: "77777777-7777-4777-8777-777777777777",
      emailId: "66666666-6666-4666-8666-666666666666",
      subject: "Welcome",
      bodyText: "Hello there",
      containsRedactedVerificationLink: false,
      containsRedactedResetLink: false,
    });
    await repository.recordAttempt({
      attemptId: "88888888-8888-4888-8888-888888888888",
      emailId: "66666666-6666-4666-8666-666666666666",
      contentSnapshotId: content.contentSnapshotId,
      status: "failed",
      providerMessageId: null,
      providerResponseCode: "500",
      providerErrorSummary: "provider_down",
      resentByActorType: null,
      resentByActorId: null,
      resendReason: null,
    });
    await repository.recordAttempt({
      attemptId: "99999999-9999-4999-8999-999999999999",
      emailId: "66666666-6666-4666-8666-666666666666",
      contentSnapshotId: content.contentSnapshotId,
      status: "sent",
      providerMessageId: "msg-2",
      providerResponseCode: "202",
      providerErrorSummary: null,
      resentByActorType: "root_user",
      resentByActorId: "00000000-0000-0000-0000-000000000001",
      resendReason: "retry after outage",
    });

    const duplicate = await repository.findRecentDuplicateRequest({
      normalizedRecipientEmail: "hello@example.com",
      duplicateGuardFingerprint: "dup-fingerprint",
      requestedAfter: new Date(Date.now() - 5000),
    });
    const list = await repository.list({
      page: 1,
      pageSize: 25,
      orderBy: "requestedAt",
      orderDirection: "desc",
      filters: {
        recipientEmail: "hello",
        notificationType: "welcome",
        subject: "wel",
        status: "sent",
      },
    });
    const exact = await repository.findById("66666666-6666-4666-8666-666666666666");

    expect(duplicate).toBe(true);
    expect(list.items).toHaveLength(1);
    expect(list.items[0]?.recipientEmail).toBe("hello@example.com");
    expect(exact?.attempts.map((item) => item.attemptNumber)).toEqual([1, 2]);
  });
});
