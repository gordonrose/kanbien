import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  FakeNotificationEmailProvider,
  mountNotificationDeliveryFeature,
} from "../../helpers/notificationDeliveryHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";

interface OutboundEmailResponse {
  emailId: string;
  recipientEmail: string;
  subject: string;
  status: "pending" | "sent" | "failed";
  attemptCount: number;
  latestAttempt: { attemptNumber: number; contentVersionNumber: number } | null;
  attempts?: Array<{ attemptNumber: number; contentVersionNumber: number }>;
  contentVersions?: Array<{ contentVersionNumber: number; subject: string; bodyText: string }>;
}

interface OutboundEmailListResponse {
  items: Array<{ emailId: string; recipientEmail: string; subject: string }>;
  page: number;
  pageSize: number;
}

describe("notificationDelivery integration flows", () => {
  it("TC-NOTIFICATION-DELIVERY-INT-001 sends a proof-of-working email through the protected route family", async () => {
    const harness = createRootAuthIntegrationHarness();
    const provider = new FakeNotificationEmailProvider();
    mountNotificationDeliveryFeature(harness.app, harness, { provider });
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const response = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "POST",
      path: "/v1/notification-delivery/emails/test",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        recipientEmail: "deliver@example.com",
        subject: "Smoke Test",
        bodyText: "hello inbox",
        notificationType: "proof",
      },
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      recipientEmail: "deliver@example.com",
      subject: "Smoke Test",
      status: "sent",
      attemptCount: 1,
    });
  });

  it("TC-NOTIFICATION-DELIVERY-INT-002 lists and reads outbound-email metadata through the new route family", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountNotificationDeliveryFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "POST",
      path: "/v1/notification-delivery/emails/test",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        recipientEmail: "list@example.com",
        subject: "List Me",
        bodyText: "hello",
        notificationType: "proof",
      },
    });

    const list = await invokeJson<OutboundEmailListResponse>(harness.app, {
      method: "GET",
      path: "/v1/notification-delivery/emails?recipientEmail=list",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    const exact = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "GET",
      path: `/v1/notification-delivery/emails/${created.body.emailId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(list.status).toBe(200);
    expect(list.body.items.map((item) => item.emailId)).toEqual([created.body.emailId]);
    expect(exact.status).toBe(200);
    expect(exact.body.emailId).toBe(created.body.emailId);
    expect(exact.body.attempts).toHaveLength(1);
  });

  it("TC-NOTIFICATION-DELIVERY-INT-003 creates a second attempt and preserves truthful content-version visibility on resend", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountNotificationDeliveryFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "POST",
      path: "/v1/notification-delivery/emails/test",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        recipientEmail: "resend@example.com",
        subject: "Original Subject",
        bodyText: "Version one",
        notificationType: "proof",
      },
    });

    const resent = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "POST",
      path: `/v1/notification-delivery/emails/${created.body.emailId}/resend`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        resendReason: "correct variable",
        subject: "Updated Subject",
        bodyText: "Version two",
      },
    });
    const exact = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "GET",
      path: `/v1/notification-delivery/emails/${created.body.emailId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(resent.status).toBe(200);
    expect(resent.body.attemptCount).toBe(2);
    expect(exact.body.attempts?.map((item) => item.contentVersionNumber)).toEqual([1, 2]);
    expect(exact.body.contentVersions?.map((item) => item.subject)).toEqual([
      "Original Subject",
      "Updated Subject",
    ]);
  });

  it("TC-NOTIFICATION-DELIVERY-EDGE-002 makes repeated same-content attempts distinct from later changed-content resend attempts", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountNotificationDeliveryFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "POST",
      path: "/v1/notification-delivery/emails/test",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        recipientEmail: "edge@example.com",
        subject: "Original Subject",
        bodyText: "Version one",
        notificationType: "proof",
      },
    });

    const repeated = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "POST",
      path: `/v1/notification-delivery/emails/${created.body.emailId}/resend`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        resendReason: "same content retry",
      },
    });
    expect(repeated.status).toBe(200);

    const changed = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "POST",
      path: `/v1/notification-delivery/emails/${created.body.emailId}/resend`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        resendReason: "changed content retry",
        subject: "Updated Subject",
        bodyText: "Version two",
      },
    });
    expect(changed.status).toBe(200);

    const exact = await invokeJson<OutboundEmailResponse>(harness.app, {
      method: "GET",
      path: `/v1/notification-delivery/emails/${created.body.emailId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(exact.status).toBe(200);
    expect(exact.body.attempts?.map((item) => item.contentVersionNumber)).toEqual([1, 1, 2]);
    expect(exact.body.contentVersions?.map((item) => item.contentVersionNumber)).toEqual([1, 2]);
  });
});
