import type { ContractTableRow, Layer5TaskContext, Layer5TaskPlugin, PluginCheckResult } from "../contract";

type ContractPluginDefinition = {
  taskType: string;
  primarySection: string;
  additionalSections?: string[];
  requiredFields: string[];
  sourceFields?: string[];
  proofFields?: string[];
  compatibilityFields?: string[];
  splitFields?: string[];
  writeEnvelopeField?: string;
  customChecks?: (input: ContractPluginCheckInput) => string[];
};

export type ContractPluginCheckInput = {
  context: Layer5TaskContext;
  primaryRow: ContractTableRow;
  sectionRows: ContractTableRow[];
  value: (field: string, row?: ContractTableRow) => string;
};

export function makeContractPlugin(definition: ContractPluginDefinition): Layer5TaskPlugin {
  return {
    taskType: definition.taskType,
    check(context: Layer5TaskContext): PluginCheckResult {
      const notes: string[] = [];
      const primaryRows = rowsForSection(context, definition.primarySection);
      if (primaryRows.length !== 1) {
        notes.push(`expected exactly one ${definition.primarySection} row, found ${primaryRows.length}`);
        return blocked(definition.taskType, notes);
      }

      const primary = primaryRows[0];
      const sections = [primary, ...rowsForSections(context, definition.additionalSections ?? [])];
      const missing = definition.requiredFields.filter((field) => isBlank(primary.values[normalizeKey(field)] ?? ""));
      if (missing.length > 0) {
        notes.push(`missing required fields: ${missing.join(", ")}`);
      } else {
        notes.push(`${definition.primarySection} required fields are present`);
      }

      const missingAdditional = (definition.additionalSections ?? [])
        .filter((section) => rowsForSection(context, section).length === 0)
        .map((section) => `${section}: ${rowsForSection(context, section).length}`);
      if (missingAdditional.length > 0) {
        notes.push(`additional contract row missing: ${missingAdditional.join(", ")}`);
      }

      if (definition.sourceFields && !definition.sourceFields.some((field) => mentionsScriptableInventory(valueForAny(sections, field)))) {
        notes.push(`source inventory is not scriptable in fields: ${definition.sourceFields.join(", ")}`);
      } else if (definition.sourceFields) {
        notes.push("source inventory names scriptable files, paths, commands, or exact runtime targets");
      }

      if (definition.proofFields && !definition.proofFields.some((field) => hasProofOrEvidence(valueForAny(sections, field)))) {
        notes.push(`proof or evidence is missing in fields: ${definition.proofFields.join(", ")}`);
      } else if (definition.proofFields) {
        notes.push("proof or evidence field is present");
      }

      const compatibilityText = (definition.compatibilityFields ?? []).map((field) => valueForAny(sections, field)).join(" ");
      if (requiresCompatibilityStrategy(compatibilityText) && !hasCompatibilityStrategy(compatibilityText)) {
        notes.push("compatibility-sensitive or blocked posture lacks an approved strategy, migration, or routed follow-up");
      }

      const splitText = (definition.splitFields ?? []).map((field) => valueForAny(sections, field)).join(" ");
      if (!hasRoutedContamination(splitText)) {
        notes.push("contamination or follow-up work is not routed to separate task types");
      }

      if (definition.writeEnvelopeField) {
        const envelope = primary.values[normalizeKey(definition.writeEnvelopeField)] ?? "";
        if (!isNarrowWriteEnvelope(envelope, context.task.allowedWriteSet)) {
          notes.push(`${definition.writeEnvelopeField} is missing exact files/narrow patterns or diverges from the task allowed write set`);
        } else {
          notes.push(`${definition.writeEnvelopeField} is narrow and aligns with task allowed write set`);
        }
      }

      if (definition.customChecks) {
        notes.push(...definition.customChecks({
          context,
          primaryRow: primary,
          sectionRows: sections,
          value: (field, row) => (row ?? primary).values[normalizeKey(field)] ?? "",
        }));
      }

      if (notes.some(isBlockingNote)) {
        return blocked(definition.taskType, notes);
      }

      return {
        plugin: definition.taskType,
        status: "pass",
        notes,
      };
    },
  };
}

function blocked(plugin: string, notes: string[]): PluginCheckResult {
  return {
    plugin,
    status: "blocked",
    notes,
  };
}

function rowsForSection(context: Layer5TaskContext, section: string): ContractTableRow[] {
  return context.contractRows.filter((row) => row.section === section);
}

function rowsForSections(context: Layer5TaskContext, sections: string[]): ContractTableRow[] {
  return sections.flatMap((section) => rowsForSection(context, section));
}

function valueForAny(rows: ContractTableRow[], field: string): string {
  const key = normalizeKey(field);
  return rows.map((row) => row.values[key] ?? "").filter(Boolean).join(" ");
}

function normalizeKey(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function isBlank(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "" || normalized === "todo" || normalized === "tbd" || normalized === "unknown";
}

function mentionsScriptableInventory(value: string): boolean {
  return /(^|[\s;])(?:docs|src|tests|test-results)\//.test(value) ||
    value.includes("**") ||
    value.includes("*.ts") ||
    value.includes("npm run") ||
    value.includes("npx ") ||
    value.toLowerCase().includes("exact runtime target");
}

function hasProofOrEvidence(value: string): boolean {
  const normalized = value.toLowerCase();
  return !isBlank(value) && !normalized.startsWith("blocked:") && /(proof|evidence|npm run|npx |validation|traceability|coverage|test|review)/.test(normalized);
}

function requiresCompatibilityStrategy(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized.includes("compatibility-sensitive") || normalized.includes("breaking") || normalized.includes("blocked");
}

function hasCompatibilityStrategy(value: string): boolean {
  return /(approved|strategy|migration|compatibility plan|follow-up|route|gov:architecture-update|not-applicable)/i.test(value);
}

function hasRoutedContamination(value: string): boolean {
  const normalized = value.toLowerCase();
  const contaminationWords = ["api", "permission", "feature behavior", "persistence", "migration", "evidence", "frontend", "backend", "schema"];
  if (!contaminationWords.some((word) => normalized.includes(word))) {
    return true;
  }

  return /(doc:api-contract|doc:permission-mapping|dev:backend|dev:frontend|dev:vertical-slice|dev:migration-persistence|evidence:qa-evidence|test:test-only|test:test-suite-alignment|gov:architecture-update|gov:standards-update)/.test(normalized);
}

function isNarrowWriteEnvelope(exactWriteEnvelope: string, allowedWriteSet: string): boolean {
  const envelope = normalizeEnvelope(exactWriteEnvelope);
  const allowed = normalizeEnvelope(allowedWriteSet);
  if (envelope.length === 0 || allowed.length === 0 || envelope.some(isBroadEntry)) {
    return false;
  }

  return envelope.every((entry) => allowed.some((allowedEntry) => patternsOverlapOrContain(allowedEntry, entry)));
}

function normalizeEnvelope(value: string): string[] {
  return value
    .replace(/^narrow exact patterns:\s*/i, "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function isBroadEntry(value: string): boolean {
  return ["src/**", "src", "tests/**", "docs/**", "**"].includes(value) || /^(src|tests|docs)\/\*\*$/.test(value);
}

function patternsOverlapOrContain(allowedEntry: string, envelopeEntry: string): boolean {
  if (allowedEntry === envelopeEntry) {
    return true;
  }

  const allowedPrefix = patternPrefix(allowedEntry);
  const envelopePrefix = patternPrefix(envelopeEntry);
  return envelopePrefix.startsWith(allowedPrefix) || allowedPrefix.startsWith(envelopePrefix);
}

function patternPrefix(value: string): string {
  return value
    .replace(/\*\*\/\*.*$/, "")
    .replace(/\*\*.*$/, "")
    .replace(/\*.*$/, "")
    .replace(/\/$/, "");
}

function isBlockingNote(note: string): boolean {
  return note.startsWith("missing") ||
    note.startsWith("expected exactly") ||
    note.includes(" cannot ") ||
    note.includes(" must ") ||
    note.includes(" needs ") ||
    note.includes(" requires ") ||
    note.includes("mismatch") ||
    note.includes("not scriptable") ||
    note.includes("is missing") ||
    note.includes("diverges") ||
    note.includes("lacks") ||
    note.includes("not routed");
}
