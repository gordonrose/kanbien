import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { mountNotificationDeliveryFeature } from "../../helpers/notificationDeliveryHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

interface OutboundEmailResponse {
  emailId: string;
}

describe("notificationDelivery audit visibility", () => {
  it("TC-NOTIFICATION-DELIVERY-AUD-001 keeps successful send and resend actions operator-visible through durable audit events", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountNotificationDeliveryFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "POST",
      path: "/v1/notification-delivery/emails/test",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        recipientEmail: "audit@example.com",
        subject: "Audit",
        bodyText: "One",
        notificationType: "proof",
      },
    });
    expect(created.status).toBe(201);

    const resent = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "POST",
      path: `/v1/notification-delivery/emails/${created.body.emailId}/resend`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        resendReason: "retry",
      },
    });
    expect(resent.status).toBe(200);

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "notification_email_sent",
          eventOutcome: "success",
          rootUserId: identity.rootUserId,
        }),
        expect.objectContaining({
          eventType: "notification_email_resent",
          eventOutcome: "success",
          rootUserId: identity.rootUserId,
        }),
      ]),
    );
  });

  it("TC-NOTIFICATION-DELIVERY-AUD-002 keeps privileged list and exact-read activity operator-visible where policy treats reads as sensitive", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountNotificationDeliveryFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "POST",
      path: "/v1/notification-delivery/emails/test",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        recipientEmail: "read-audit@example.com",
        subject: "Read Audit",
        bodyText: "One",
        notificationType: "proof",
      },
    });
    expect(created.status).toBe(201);

    await invokeJson(harness.app, {
      method: "GET",
      path: "/v1/notification-delivery/emails",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    await invokeJson(harness.app, {
      method: "GET",
      path: `/v1/notification-delivery/emails/${created.body.emailId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "notification_email_listed",
          eventOutcome: "success",
          rootUserId: identity.rootUserId,
        }),
        expect.objectContaining({
          eventType: "notification_email_read",
          eventOutcome: "success",
          rootUserId: identity.rootUserId,
        }),
      ]),
    );
  });
});
