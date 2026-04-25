import { randomUUID } from "node:crypto";
import type { QueueProviderAdapter, QueueProviderWorker } from "./provider";

export interface WorkerRuntime {
  workerId: string;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export function createWorkerIdentity(prefix = "job-worker"): string {
  return `${prefix}-${process.pid}-${randomUUID()}`;
}

export function createJobWorkerRuntime(input: {
  provider: QueueProviderAdapter;
  queueNames: string[];
  workerId?: string;
  handler: (jobId: string) => Promise<void>;
}): WorkerRuntime {
  const workerId = input.workerId ?? createWorkerIdentity();
  let worker: QueueProviderWorker | null = null;
  let stopping = false;

  return {
    workerId,
    async start() {
      if (!input.provider.createWorker) {
        throw new Error("Configured queue provider does not support workers.");
      }
      worker = await input.provider.createWorker({
        queueNames: input.queueNames,
        workerId,
        handler: async (jobId) => {
          if (!stopping) {
            await input.handler(jobId);
          }
        },
      });
    },
    async stop() {
      stopping = true;
      await worker?.close();
      await input.provider.close?.();
    },
  };
}

export function installGracefulShutdown(runtime: WorkerRuntime): void {
  const stop = () => {
    runtime.stop().finally(() => process.exit(0));
  };
  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
}
