import { randomUUID } from "node:crypto";
import {
  NotificationProviderMisconfiguredError,
  NotificationProviderUnavailableError,
  NotificationSendFailedError,
  OutboundEmailNotFoundError,
} from "../contract/errors";
import { toOutboundEmail } from "./presenters";
import { sanitizeNotificationContent } from "./sanitizeContent";
import type { NotificationDeliveryRepository } from "../persistence/repository";
import type { NotificationEmailProvider } from "./provider";
import type { ResendEmailInput } from "./types";

export async function resendEmail(
  repository: NotificationDeliveryRepository,
  provider: NotificationEmailProvider,
  input: ResendEmailInput,
) {
  const current = await repository.findById(input.emailId);
  if (!current) {
    throw new OutboundEmailNotFoundError();
  }

  let contentSnapshotId = current.contentVersions[0]?.contentSnapshotId ?? null;
  let bodyText = current.contentVersions[current.contentVersions.length - 1]?.bodyText ?? "";
  let subject = current.contentVersions[current.contentVersions.length - 1]?.subject ?? current.subject;
  let providerBodyText = bodyText;
  let providerSubject = subject;

  const hasOverride = input.subject !== undefined || input.bodyText !== undefined;
  if (hasOverride) {
    providerSubject = (input.subject ?? subject).trim();
    providerBodyText = (input.bodyText ?? bodyText).trim();
    const sanitized = sanitizeNotificationContent({
      subject: providerSubject,
      bodyText: providerBodyText,
      redactions: input.redactions,
    });
    const contentSnapshot = await repository.createContentSnapshot({
      contentSnapshotId: randomUUID(),
      emailId: input.emailId,
      subject: sanitized.subject,
      bodyText: sanitized.bodyText,
      containsRedactedVerificationLink: sanitized.containsRedactedVerificationLink,
      containsRedactedResetLink: sanitized.containsRedactedResetLink,
    });
    contentSnapshotId = contentSnapshot.contentSnapshotId;
    bodyText = sanitized.bodyText;
    subject = sanitized.subject;
  }

  if (!contentSnapshotId) {
    throw new OutboundEmailNotFoundError();
  }

  const providerResult = await provider.send({
    recipientEmail: current.recipientEmail,
    subject: providerSubject,
    bodyText: providerBodyText,
  });

  const details = await repository.recordAttempt({
    attemptId: randomUUID(),
    emailId: input.emailId,
    contentSnapshotId,
    status: providerResult.success ? "sent" : "failed",
    providerMessageId: providerResult.success ? providerResult.providerMessageId : null,
    providerResponseCode: providerResult.providerResponseCode,
    providerErrorSummary: providerResult.success ? null : providerResult.providerErrorSummary,
    resentByActorType: input.resentByActorType,
    resentByActorId: input.resentByActorId,
    resendReason: input.resendReason ?? null,
  });

  if (!providerResult.success) {
    if (providerResult.failureType === "misconfigured") {
      throw new NotificationProviderMisconfiguredError();
    }
    if (providerResult.failureType === "provider_unavailable") {
      throw new NotificationProviderUnavailableError();
    }
    throw new NotificationSendFailedError();
  }

  return toOutboundEmail(details);
}
