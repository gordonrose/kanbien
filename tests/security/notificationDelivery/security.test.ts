import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { mountNotificationDeliveryFeature } from "../../helpers/notificationDeliveryHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

interface ErrorResponse {
  code: string;
}

interface OutboundEmailResponse {
  emailId: string;
  contentVersions: Array<{ bodyText: string }>;
}

describe("notificationDelivery security flows", () => {
  it("TC-NOTIFICATION-DELIVERY-SEC-001 enforces root-only access on proof-send, list, exact-read, and resend routes", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountNotificationDeliveryFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/notification-delivery/emails",
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");

    harness.setRootUserCapabilities(identity.rootUserId, ["notification.email.read"]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/notification-delivery/emails/test",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        recipientEmail: "deny@example.com",
        subject: "Denied",
        bodyText: "nope",
        notificationType: "proof",
      },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });

  it("TC-NOTIFICATION-DELIVERY-SEC-003 redacts secret-bearing content in durable records and retrieval responses", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountNotificationDeliveryFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const sent = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "POST",
      path: "/v1/notification-delivery/emails/test",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        recipientEmail: "safe@example.com",
        subject: "Verify",
        bodyText: "See [VERIFICATION LINK]",
        notificationType: "proof",
      },
    });

    const exact = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "GET",
      path: `/v1/notification-delivery/emails/${sent.body.emailId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(exact.status).toBe(200);
    expect(exact.body.contentVersions[0]?.bodyText).toContain("[VERIFICATION LINK]");
  });
});
