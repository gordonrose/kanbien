import { DiscoveredWebAppSurfaceNotFoundError } from "../contract/errors";
import type { WebAppSurfaceDiscoveryRepository } from "../persistence/repository";

export async function listDiscoveredWebAppSurfaces(
  repository: WebAppSurfaceDiscoveryRepository,
  input: import("./types").ListDiscoveredWebAppSurfacesInput,
) {
  return repository.listDiscoveredSurfaces(input);
}

export async function getDiscoveredWebAppSurface(
  repository: WebAppSurfaceDiscoveryRepository,
  discoveredWebAppSurfaceId: string,
) {
  const surface = await repository.findDiscoveredSurfaceById(discoveredWebAppSurfaceId);
  if (!surface) {
    throw new DiscoveredWebAppSurfaceNotFoundError();
  }
  return surface;
}
