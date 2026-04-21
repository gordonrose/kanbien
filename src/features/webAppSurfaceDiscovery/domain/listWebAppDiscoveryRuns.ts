import { DiscoveryRunNotFoundError } from "../contract/errors";
import type { WebAppSurfaceDiscoveryRepository } from "../persistence/repository";

export async function listWebAppDiscoveryRuns(
  repository: WebAppSurfaceDiscoveryRepository,
  input: import("./types").ListDiscoveryRunsInput,
) {
  return repository.listDiscoveryRuns(input);
}

export async function getWebAppDiscoveryRun(
  repository: WebAppSurfaceDiscoveryRepository,
  webAppDiscoveryRunId: string,
) {
  const run = await repository.findDiscoveryRunById(webAppDiscoveryRunId);
  if (!run) {
    throw new DiscoveryRunNotFoundError();
  }
  return run;
}
