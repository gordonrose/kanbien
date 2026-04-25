import { describe, expect, it } from "vitest";
import { createNotificationDeliveryService } from "../../../src/features/notificationDelivery/domain/service";
import {
  DuplicateEmailRequestError,
  InvalidRequestError,
  NotificationProviderUnavailableError,
  NotificationSendFailedError,
} from "../../../src/features/notificationDelivery/contract/errors";
import { createPendingEmail } from "../../../src/features/notificationDelivery/domain/createPendingEmail";
import { createNotificationDeliveryJobTypes } from "../../../src/features/notificationDelivery/domain/jobTypes";
import {
  createInMemoryNotificationDeliveryRepository,
  FakeNotificationEmailProvider,
} from "../../helpers/notificationDeliveryHarness";

describe("notificationDelivery service", () => {
  it("TC-NOTIFICATION-DELIVERY-UNIT-001 creates one logical outbound email and one attempt on successful send", async () => {
    const repository = createInMemoryNotificationDeliveryRepository();
    const provider = new FakeNotificationEmailProvider();
    const service = createNotificationDeliveryService(repository, provider);

    const result = await service.sendEmail({
      recipientEmail: "  Ada.Admin@Example.com ",
      subject: " Verify email ",
      bodyText: "Hello from Kanbien",
      notificationType: "email-verification",
      createdByActorType: "root_user",
      createdByActorId: "11111111-1111-1111-1111-111111111111",
    });

    expect(result.recipientEmail).toBe("ada.admin@example.com");
    expect(result.status).toBe("sent");
    expect(result.attemptCount).toBe(1);
    expect(result.latestAttempt?.attemptNumber).toBe(1);
    expect(result.contentVersions).toHaveLength(1);
  });

  it("TC-NOTIFICATION-DELIVERY-UNIT-002 normalizes provider failure into a stable platform error and persists failure metadata", async () => {
    const repository = createInMemoryNotificationDeliveryRepository();
    const provider = new FakeNotificationEmailProvider();
    provider.queueResult({
      success: false,
      failureType: "send_failed",
      providerResponseCode: "422",
      providerErrorSummary: "provider_rejected",
    });
    const service = createNotificationDeliveryService(repository, provider);

    await expect(
      service.sendEmail({
        recipientEmail: "ops@example.com",
        subject: "Rejected",
        bodyText: "This should fail",
        notificationType: "proof",
        createdByActorType: "root_user",
        createdByActorId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toBeInstanceOf(NotificationSendFailedError);

    const [stored] = [...repository.records.values()];
    expect(stored).toBeDefined();
    expect(stored.status).toBe("failed");
    expect(stored.latestAttempt?.providerResponseCode).toBe("422");
    expect(stored.createdByActorId).toBe("11111111-1111-1111-1111-111111111111");
  });

  it("TC-NOTIFICATION-DELIVERY-UNIT-003 creates a new attempt rather than a second logical email row on resend", async () => {
    const repository = createInMemoryNotificationDeliveryRepository();
    const provider = new FakeNotificationEmailProvider();
    const service = createNotificationDeliveryService(repository, provider);

    const sent = await service.sendEmail({
      recipientEmail: "ops@example.com",
      subject: "Hello",
      bodyText: "Version one",
      notificationType: "proof",
      createdByActorType: "root_user",
      createdByActorId: "11111111-1111-1111-1111-111111111111",
    });

    const resent = await service.resendEmail({
      emailId: sent.emailId,
      resentByActorType: "root_user",
      resentByActorId: "11111111-1111-1111-1111-111111111111",
      resendReason: "manual retry",
    });

    expect(repository.records.size).toBe(1);
    expect(resent.attemptCount).toBe(2);
    expect(resent.latestAttempt?.attemptNumber).toBe(2);
  });

  it("TC-NOTIFICATION-DELIVERY-UNIT-004 returns one logical email with attempt history and content-version visibility", async () => {
    const repository = createInMemoryNotificationDeliveryRepository();
    const provider = new FakeNotificationEmailProvider();
    const service = createNotificationDeliveryService(repository, provider);

    const sent = await service.sendEmail({
      recipientEmail: "ops@example.com",
      subject: "Original",
      bodyText: "Version one",
      notificationType: "proof",
      createdByActorType: "root_user",
      createdByActorId: "11111111-1111-1111-1111-111111111111",
    });

    await service.resendEmail({
      emailId: sent.emailId,
      resentByActorType: "root_user",
      resentByActorId: "11111111-1111-1111-1111-111111111111",
      resendReason: "correct variable",
      subject: "Updated",
      bodyText: "Version two",
    });

    const exact = await service.getOutboundEmail({ emailId: sent.emailId });

    expect(exact.emailId).toBe(sent.emailId);
    expect(exact.contentVersions.map((item) => item.contentVersionNumber)).toEqual([1, 2]);
    expect(exact.attempts.map((item) => item.contentVersionNumber)).toEqual([1, 2]);
    expect(exact.attempts).toHaveLength(2);
  });

  it("TC-NOTIFICATION-DELIVERY-UNIT-005 lists logical emails with filtering and pagination defaults", async () => {
    const repository = createInMemoryNotificationDeliveryRepository();
    const provider = new FakeNotificationEmailProvider();
    const service = createNotificationDeliveryService(repository, provider);

    await service.sendEmail({
      recipientEmail: "tenant.one@example.com",
      subject: "Tenant One",
      bodyText: "One",
      notificationType: "welcome",
      tenantId: "11111111-1111-4111-8111-111111111111",
      createdByActorType: "root_user",
      createdByActorId: "11111111-1111-1111-1111-111111111111",
    });
    await service.sendEmail({
      recipientEmail: "tenant.two@example.com",
      subject: "Tenant Two",
      bodyText: "Two",
      notificationType: "proof",
      createdByActorType: "root_user",
      createdByActorId: "11111111-1111-1111-1111-111111111111",
    });

    const list = await service.listOutboundEmails({
      page: 1,
      pageSize: 25,
      orderBy: "requestedAt",
      orderDirection: "desc",
      filters: {
        recipientEmail: "tenant.one",
        notificationType: "welcome",
      },
    });

    expect(list.page).toBe(1);
    expect(list.pageSize).toBe(25);
    expect(list.items).toHaveLength(1);
    expect(list.items[0]?.recipientEmail).toBe("tenant.one@example.com");
  });

  it("TC-NOTIFICATION-DELIVERY-SEC-002 blocks obvious rapid duplicate sends for the same payload and recipient", async () => {
    const repository = createInMemoryNotificationDeliveryRepository();
    const provider = new FakeNotificationEmailProvider();
    const service = createNotificationDeliveryService(repository, provider);

    await service.sendEmail({
      recipientEmail: "duplicate@example.com",
      subject: "Same",
      bodyText: "Same body",
      notificationType: "proof",
      createdByActorType: "root_user",
      createdByActorId: "11111111-1111-1111-1111-111111111111",
    });

    await expect(
      service.sendEmail({
        recipientEmail: "duplicate@example.com",
        subject: "Same",
        bodyText: "Same body",
        notificationType: "proof",
        createdByActorType: "root_user",
        createdByActorId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toBeInstanceOf(DuplicateEmailRequestError);
  });

  it("TC-NOTIFICATION-DELIVERY-SEC-004 preserves caller-owned regeneration by storing redacted snapshots and accepting fresh resend content", async () => {
    const repository = createInMemoryNotificationDeliveryRepository();
    const provider = new FakeNotificationEmailProvider();
    const service = createNotificationDeliveryService(repository, provider);

    const originalLink = "https://example.com/verify?token=one";
    const updatedLink = "https://example.com/verify?token=two";

    const sent = await service.sendEmail({
      recipientEmail: "safe@example.com",
      subject: "Verify",
      bodyText: `Use this link: ${originalLink}`,
      notificationType: "email_verification",
      createdByActorType: "root_user",
      createdByActorId: "11111111-1111-1111-1111-111111111111",
      redactions: [{ rawValue: originalLink, placeholder: "[VERIFICATION LINK]" }],
    });

    const resent = await service.resendEmail({
      emailId: sent.emailId,
      resentByActorType: "root_user",
      resentByActorId: "11111111-1111-1111-1111-111111111111",
      resendReason: "fresh token",
      bodyText: `Use this link instead: ${updatedLink}`,
      redactions: [{ rawValue: updatedLink, placeholder: "[VERIFICATION LINK]" }],
    });

    expect(sent.contentVersions[0]?.bodyText).toContain("[VERIFICATION LINK]");
    expect(sent.contentVersions[0]?.bodyText).not.toContain(originalLink);
    expect(resent.contentVersions[1]?.bodyText).toContain("[VERIFICATION LINK]");
    expect(resent.contentVersions[1]?.bodyText).not.toContain(updatedLink);
    expect(provider.sentInputs[0]?.bodyText).toContain(originalLink);
    expect(provider.sentInputs[1]?.bodyText).toContain(updatedLink);
  });

  it("TC-NOTIFICATION-DELIVERY-EDGE-001 normalizes provider-unavailable failures into stable platform semantics", async () => {
    const repository = createInMemoryNotificationDeliveryRepository();
    const provider = new FakeNotificationEmailProvider();
    provider.queueResult({
      success: false,
      failureType: "provider_unavailable",
      providerResponseCode: null,
      providerErrorSummary: "network_error",
    });
    const service = createNotificationDeliveryService(repository, provider);

    await expect(
      service.sendEmail({
        recipientEmail: "ops@example.com",
        subject: "Unavailable",
        bodyText: "Later",
        notificationType: "proof",
        createdByActorType: "root_user",
        createdByActorId: "11111111-1111-1111-1111-111111111111",
      }),
    ).rejects.toBeInstanceOf(NotificationProviderUnavailableError);
  });

  it("TC-NOTIFICATION-DELIVERY-UNIT-006 delivers a pending provider-safe email through the job-processing handler", async () => {
    const repository = createInMemoryNotificationDeliveryRepository();
    const provider = new FakeNotificationEmailProvider();
    const [jobType] = createNotificationDeliveryJobTypes({ repository, provider });
    const pending = await createPendingEmail(repository, provider.providerName, {
      recipientEmail: "async@example.com",
      subject: "Async",
      bodyText: "This body is safe to persist and send later",
      notificationType: "proof",
      createdByActorType: "system",
      createdByActorId: "job-processing",
    });

    await jobType!.handler({ outboundEmailId: pending.emailId }, {
      jobId: "job-1",
      jobType: "notification.email.send",
      payloadVersion: 1,
      tenantId: null,
      executionScope: "platform-internal",
      workerId: "worker-1",
      attemptNumber: 1,
      idempotencyKey: `notification-email-send:${pending.emailId}`,
    });

    const stored = repository.records.get(pending.emailId)!;
    expect(provider.sentInputs).toHaveLength(1);
    expect(provider.sentInputs[0]).toMatchObject({
      recipientEmail: "async@example.com",
      subject: "Async",
      bodyText: "This body is safe to persist and send later",
    });
    expect(stored.status).toBe("sent");
    expect(stored.attemptCount).toBe(1);
  });

  it("TC-NOTIFICATION-DELIVERY-SEC-006 refuses async delivery when the durable content snapshot is redacted", async () => {
    const repository = createInMemoryNotificationDeliveryRepository();
    const provider = new FakeNotificationEmailProvider();
    const [jobType] = createNotificationDeliveryJobTypes({ repository, provider });
    const secretLink = "https://example.com/verify?token=secret";
    const pending = await createPendingEmail(repository, provider.providerName, {
      recipientEmail: "redacted@example.com",
      subject: "Verify",
      bodyText: `Use ${secretLink}`,
      notificationType: "email_verification",
      createdByActorType: "system",
      createdByActorId: "job-processing",
      redactions: [{ rawValue: secretLink, placeholder: "[VERIFICATION LINK]" }],
    });

    await expect(
      jobType!.handler({ outboundEmailId: pending.emailId }, {
        jobId: "job-1",
        jobType: "notification.email.send",
        payloadVersion: 1,
        tenantId: null,
        executionScope: "platform-internal",
        workerId: "worker-1",
        attemptNumber: 1,
        idempotencyKey: `notification-email-send:${pending.emailId}`,
      }),
    ).rejects.toBeInstanceOf(InvalidRequestError);

    expect(provider.sentInputs).toHaveLength(0);
    expect(repository.records.get(pending.emailId)?.attemptCount).toBe(0);
  });
});
