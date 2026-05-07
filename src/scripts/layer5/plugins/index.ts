import type { Layer5TaskContext, PluginCheckResult } from "../contract";
import { platformSeamPlugin } from "./platformSeam";

const plugins = [platformSeamPlugin];

export function runPluginChecks(context: Layer5TaskContext): PluginCheckResult[] {
  const plugin = plugins.find((candidate) => candidate.taskType === context.task.taskType);
  if (!plugin) {
    return [
      {
        plugin: "generic",
        status: "pass",
        notes: [`no task-type plugin registered for ${context.task.taskType}`],
      },
    ];
  }

  return [plugin.check(context)];
}
