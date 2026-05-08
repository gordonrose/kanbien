import type { Layer5TaskContext, PluginCheckResult } from "../contract";
import { apiContractPlugin } from "./apiContract";
import { architectureFoundationPlugin } from "./architectureFoundation";
import { architectureUpdatePlugin } from "./architectureUpdate";
import { backendPlugin } from "./backend";
import { dataDictionaryPlugin } from "./dataDictionary";
import { designSystemPlugin } from "./designSystem";
import { docsArtifactPlugin } from "./docsArtifact";
import { frontendPlugin } from "./frontend";
import { migrationPersistencePlugin } from "./migrationPersistence";
import { permissionMappingPlugin } from "./permissionMapping";
import { platformSeamPlugin } from "./platformSeam";
import { qaEvidencePlugin } from "./qaEvidence";
import { refactorFirstPlugin } from "./refactorFirst";
import { standardsCompliancePlugin } from "./standardsCompliance";
import { standardsUpdatePlugin } from "./standardsUpdate";
import { testOnlyPlugin } from "./testOnly";
import { testSuiteAlignmentPlugin } from "./testSuiteAlignment";
import { verticalSlicePlugin } from "./verticalSlice";

const plugins = [
  platformSeamPlugin,
  migrationPersistencePlugin,
  verticalSlicePlugin,
  apiContractPlugin,
  docsArtifactPlugin,
  permissionMappingPlugin,
  dataDictionaryPlugin,
  backendPlugin,
  testOnlyPlugin,
  testSuiteAlignmentPlugin,
  refactorFirstPlugin,
  architectureFoundationPlugin,
  standardsCompliancePlugin,
  standardsUpdatePlugin,
  architectureUpdatePlugin,
  qaEvidencePlugin,
  frontendPlugin,
  designSystemPlugin,
];

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
