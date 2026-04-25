import { Queue, Worker, type Job as BullMqJob, type JobsOptions, type KeepJobs } from "bullmq";
import IORedis, { type RedisOptions } from "ioredis";
import type { QueueProviderAdapter, QueueProviderPublishInput, QueueProviderWorker } from "./provider";
import { assertJobQueueName, JOB_QUEUE_NAMES } from "./queueConfig";
import type { JobQueueName } from "./types";

interface BullMqJobData {
  jobId: string;
}

export interface BullMqQueueProviderAdapterOptions {
  redisUrl: string;
  queueNamePrefix?: string;
  connectionOptions?: RedisOptions;
  removeOnComplete?: KeepJobs;
  removeOnFail?: KeepJobs;
}

function createRedisConnection(
  redisUrl: string,
  options: RedisOptions = {},
  workerConnection = false,
): IORedis {
  const { maxRetriesPerRequest, ...restOptions } = options;
  return new IORedis(redisUrl, {
    connectTimeout: 10_000,
    enableOfflineQueue: false,
    retryStrategy: () => null,
    enableReadyCheck: true,
    ...restOptions,
    maxRetriesPerRequest: workerConnection ? null : (maxRetriesPerRequest ?? 1),
  });
}

function normalizeQueueName(queueNamePrefix: string, queueName: JobQueueName): string {
  return `${queueNamePrefix}:${queueName}`;
}

function getPublishDelayMs(input: QueueProviderPublishInput): number {
  return Math.max(0, input.job.runAt.getTime() - Date.now());
}

function getAttempts(input: QueueProviderPublishInput): number {
  return Math.max(1, input.job.maxAttempts - input.job.attemptCount);
}

function assertBullMqJobData(data: unknown): asserts data is BullMqJobData {
  if (!data || typeof data !== "object" || typeof (data as BullMqJobData).jobId !== "string") {
    throw new Error("BullMQ job payload is missing durable jobId.");
  }
}

export class BullMqQueueProviderAdapter implements QueueProviderAdapter {
  private readonly redisUrl: string;
  private readonly queueNamePrefix: string;
  private readonly connectionOptions: RedisOptions;
  private readonly removeOnComplete: KeepJobs;
  private readonly removeOnFail: KeepJobs;
  private readonly queueConnection: IORedis;
  private readonly queues = new Map<JobQueueName, Queue<BullMqJobData>>();
  private readonly workerConnections = new Set<IORedis>();

  constructor(options: BullMqQueueProviderAdapterOptions) {
    this.redisUrl = options.redisUrl;
    this.queueNamePrefix = options.queueNamePrefix ?? "kanbien-jobs";
    this.connectionOptions = options.connectionOptions ?? {};
    this.removeOnComplete = options.removeOnComplete ?? { age: 86_400, count: 1_000 };
    this.removeOnFail = options.removeOnFail ?? { age: 604_800, count: 5_000 };
    this.queueConnection = createRedisConnection(options.redisUrl, this.connectionOptions);
  }

  async publish(input: QueueProviderPublishInput) {
    const queue = this.getQueue(input.job.queueName);
    const job = await queue.add(input.job.jobType, { jobId: input.job.jobId }, this.getJobOptions(input));
    return { providerJobId: String(job.id ?? input.providerJobId) };
  }

  async createWorker(input: {
    queueNames: string[];
    workerId: string;
    handler: (jobId: string) => Promise<void>;
  }): Promise<QueueProviderWorker> {
    const workers = input.queueNames.map((queueName) => {
      assertJobQueueName(queueName);
      const workerConnection = createRedisConnection(this.redisUrl, this.connectionOptions, true);
      return { queueName, workerConnection };
    });

    const activeWorkers = workers.map(({ queueName, workerConnection }) => {
      this.workerConnections.add(workerConnection);
      return new Worker<BullMqJobData>(
        normalizeQueueName(this.queueNamePrefix, queueName),
        async (job: BullMqJob<BullMqJobData>) => {
          assertBullMqJobData(job.data);
          await input.handler(job.data.jobId);
        },
        {
          connection: workerConnection,
          concurrency: 1,
          removeOnComplete: this.removeOnComplete,
          removeOnFail: this.removeOnFail,
        },
      );
    });

    await Promise.all(activeWorkers.map((worker) => worker.waitUntilReady()));

    return {
      close: async () => {
        await Promise.all(activeWorkers.map((worker) => worker.close()));
        await Promise.all(
          workers.map(async ({ workerConnection }) => {
            this.workerConnections.delete(workerConnection);
            await workerConnection.quit();
          }),
        );
      },
    };
  }

  async close(): Promise<void> {
    await Promise.all([...this.queues.values()].map((queue) => queue.close()));
    this.queues.clear();
    await Promise.all([...this.workerConnections].map((connection) => connection.quit()));
    this.workerConnections.clear();
    await this.queueConnection.quit();
  }

  async obliterateQueuesForTests(): Promise<void> {
    await Promise.all(
      JOB_QUEUE_NAMES.map(async (queueName) => {
        const queue = this.getQueue(queueName);
        await queue.obliterate({ force: true });
      }),
    );
  }

  private getQueue(queueName: JobQueueName): Queue<BullMqJobData> {
    const existing = this.queues.get(queueName);
    if (existing) {
      return existing;
    }
    const queue = new Queue<BullMqJobData>(normalizeQueueName(this.queueNamePrefix, queueName), {
      connection: this.queueConnection,
    });
    this.queues.set(queueName, queue);
    return queue;
  }

  private getJobOptions(input: QueueProviderPublishInput): JobsOptions {
    return {
      jobId: input.providerJobId,
      priority: input.job.priority,
      delay: getPublishDelayMs(input),
      attempts: getAttempts(input),
      backoff: {
        type: "exponential",
        delay: 1_000,
      },
      removeOnComplete: this.removeOnComplete,
      removeOnFail: this.removeOnFail,
    };
  }
}

export function createBullMqQueueProviderAdapter(
  options: BullMqQueueProviderAdapterOptions,
): BullMqQueueProviderAdapter {
  return new BullMqQueueProviderAdapter(options);
}
