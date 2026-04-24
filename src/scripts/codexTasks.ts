import { buildInventoryReport, InventoryReport, repoRoot, writeInventoryReport } from "./lib/codexTaskRegistry";

type Options = {
  json: boolean;
  write: boolean;
};

function parseArgs(argv: string[]): Options {
  return {
    json: argv.includes("--json"),
    write: argv.includes("--write"),
  };
}

function printDashboard(report: InventoryReport): void {
  console.log("Codex Tasks");
  console.log(`- repo: ${report.repoRoot}`);
  console.log(`- main: ${report.targetMain}`);
  console.log(`- generated: ${report.generatedAt}`);
  console.log("");

  for (const record of report.records) {
    const aheadBehind =
      record.aheadOfMain === null || record.behindMain === null
        ? "n/a"
        : `${record.behindMain} behind / ${record.aheadOfMain} ahead`;
    console.log(`${record.taskId}`);
    console.log(`- branch: ${record.branch}`);
    console.log(`- kind: ${record.kind}`);
    console.log(`- state: ${record.state}`);
    console.log(`- worktree: ${record.worktreePath ?? "(none)"}`);
    console.log(`- head: ${record.headCommit ?? "(missing)"}`);
    console.log(`- main delta: ${aheadBehind}`);
    console.log(`- unique patch commits: ${record.uniquePatchCommitCount ?? "n/a"}`);
    console.log(`- dirty: ${record.dirty ? "yes" : "no"}`);
    if (record.bootstrapPaths.length > 0) {
      console.log(`- bootstrap: ${record.bootstrapPaths.join(", ")}`);
    }
    if (record.parentTaskId) {
      console.log(`- parent task: ${record.parentTaskId}`);
    }
    if (record.plannedWriteSet.length > 0) {
      console.log("- planned write set:");
      for (const entry of record.plannedWriteSet) {
        console.log(`  - ${entry}`);
      }
    }
    if (record.knownSharedSeams.length > 0) {
      console.log("- shared seams:");
      for (const entry of record.knownSharedSeams) {
        console.log(`  - ${entry}`);
      }
    }
    if (record.dirtyEntries.length > 0) {
      console.log("- dirty entries:");
      for (const entry of record.dirtyEntries) {
        console.log(`  ${entry}`);
      }
    }
    console.log(`- recommendation: ${record.recommendation}`);
    console.log("");
  }
}

const options = parseArgs(process.argv.slice(2));
const report = buildInventoryReport(repoRoot());

if (options.write) {
  writeInventoryReport(report);
}

if (options.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printDashboard(report);
}
