import type { DurableJobRecord } from "./types";

export interface QueueProviderPublishInput {
  job: DurableJobRecord;
  providerJobId: string;
}

export interface QueueProviderPublishResult {
  providerJobId: string;
}

export interface QueueProviderWorker {
  close(): Promise<void>;
}

export interface QueueProviderAdapter {
  publish(input: QueueProviderPublishInput): Promise<QueueProviderPublishResult>;
  createWorker?(input: {
    queueNames: string[];
    workerId: string;
    handler: (jobId: string) => Promise<void>;
  }): Promise<QueueProviderWorker>;
  close?(): Promise<void>;
}
