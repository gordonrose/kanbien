import type {
  AppendHarnessChatMessageInput,
  CreateHarnessChatConversationInput,
  CreateHarnessChatPacketRevisionInput,
  HarnessChatConversationData,
  HarnessChatMessageData,
  HarnessChatPacketRevisionData,
  HarnessChatPdfAttemptData,
  RecordHarnessChatPdfAttemptInput,
} from "./types";

export interface HarnessChatRepository {
  createConversation(input: CreateHarnessChatConversationInput): Promise<HarnessChatConversationData>;
  appendMessage(input: AppendHarnessChatMessageInput): Promise<HarnessChatMessageData>;
  findConversationById(conversationId: string): Promise<HarnessChatConversationData | null>;
  listRootConversations(): Promise<HarnessChatConversationData[]>;
  listMessages(conversationId: string): Promise<HarnessChatMessageData[]>;
  createPacketRevision(input: CreateHarnessChatPacketRevisionInput): Promise<HarnessChatPacketRevisionData>;
  findCurrentPacketRevision(conversationId: string): Promise<HarnessChatPacketRevisionData | null>;
  listPacketRevisions(conversationId: string): Promise<HarnessChatPacketRevisionData[]>;
  recordPdfAttempt(input: RecordHarnessChatPdfAttemptInput): Promise<HarnessChatPdfAttemptData>;
  listPdfAttempts(packetRevisionId: string): Promise<HarnessChatPdfAttemptData[]>;
}
