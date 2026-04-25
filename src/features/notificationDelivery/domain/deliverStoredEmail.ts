import { randomUUID } from "node:crypto";
import {
  InvalidRequestError,
  NotificationProviderMisconfiguredError,
  NotificationProviderUnavailableError,
  NotificationSendFailedError,
  OutboundEmailNotFoundError,
} from "../contract/errors";
import { toOutboundEmail } from "./presenters";
import type { NotificationEmailProvider, ProviderSendFailure } from "./provider";
import type { NotificationDeliveryRepository } from "../persistence/repository";

export async function deliverStoredEmail(
  repository: NotificationDeliveryRepository,
  provider: NotificationEmailProvider,
  input: { emailId: string },
) {
  const current = await repository.findById(input.emailId);
  if (!current) {
    throw new OutboundEmailNotFoundError();
  }

  const contentSnapshot = current.contentVersions[current.contentVersions.length - 1] ?? null;
  if (!contentSnapshot) {
    throw new OutboundEmailNotFoundError();
  }

  if (
    contentSnapshot.containsRedactedVerificationLink ||
    contentSnapshot.containsRedactedResetLink
  ) {
    throw new InvalidRequestError(
      "Stored email content contains redacted security material and cannot be sent asynchronously.",
      { field: "emailId", reason: "redacted_content_not_deliverable" },
    );
  }

  const providerResult = await provider.send({
    recipientEmail: current.recipientEmail,
    subject: contentSnapshot.subject,
    bodyText: contentSnapshot.bodyText,
  });

  if (providerResult.success) {
    const details = await repository.recordAttempt({
      attemptId: randomUUID(),
      emailId: input.emailId,
      contentSnapshotId: contentSnapshot.contentSnapshotId,
      status: "sent",
      providerMessageId: providerResult.providerMessageId,
      providerResponseCode: providerResult.providerResponseCode,
      providerErrorSummary: null,
      resentByActorType: null,
      resentByActorId: null,
      resendReason: "job-processing delivery",
    });
    return toOutboundEmail(details);
  }

  const failureResult = providerResult as ProviderSendFailure;

  await repository.recordAttempt({
    attemptId: randomUUID(),
    emailId: input.emailId,
    contentSnapshotId: contentSnapshot.contentSnapshotId,
    status: "failed",
    providerMessageId: null,
    providerResponseCode: failureResult.providerResponseCode,
    providerErrorSummary: failureResult.providerErrorSummary,
    resentByActorType: null,
    resentByActorId: null,
    resendReason: "job-processing delivery",
  });

  if (failureResult.failureType === "misconfigured") {
    throw new NotificationProviderMisconfiguredError();
  }
  if (failureResult.failureType === "provider_unavailable") {
    throw new NotificationProviderUnavailableError();
  }
  throw new NotificationSendFailedError();
}
