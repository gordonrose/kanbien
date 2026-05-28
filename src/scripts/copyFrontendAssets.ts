import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

function copyDirectoryIfPresent(sourceRelativePath: string, targetRelativePath: string): void {
  const source = resolve(process.cwd(), sourceRelativePath);
  const target = resolve(process.cwd(), targetRelativePath);

  if (!existsSync(source)) {
    return;
  }

  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

copyDirectoryIfPresent("src/frontend/rootAdminShell", "dist/frontend/rootAdminShell");
copyDirectoryIfPresent("src/frontend/designSystem", "dist/frontend/designSystem");
copyDirectoryIfPresent("src/frontend/publicSite", "dist/frontend/publicSite");
copyDirectoryIfPresent("src/rootAdminHelper", "dist/rootAdminHelper");
