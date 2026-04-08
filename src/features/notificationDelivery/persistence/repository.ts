import type {
  ListOutboundEmailsInput,
  OutboundEmailContentVersionData,
  OutboundEmailDetailsData,
} from "../domain/types";
import type {
  CreateContentSnapshotInput,
  CreateLogicalEmailInput,
  OutboundEmailRepositoryListResult,
  RecordAttemptInput,
  RecentDuplicateLookup,
} from "./types";

export interface NotificationDeliveryRepository {
  findRecentDuplicateRequest(input: RecentDuplicateLookup): Promise<boolean>;
  createLogicalEmail(input: CreateLogicalEmailInput): Promise<void>;
  createContentSnapshot(input: CreateContentSnapshotInput): Promise<OutboundEmailContentVersionData>;
  recordAttempt(input: RecordAttemptInput): Promise<OutboundEmailDetailsData>;
  findById(emailId: string): Promise<OutboundEmailDetailsData | null>;
  list(input: ListOutboundEmailsInput): Promise<OutboundEmailRepositoryListResult>;
}
