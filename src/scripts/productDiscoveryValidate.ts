import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

export type ProductDiscoveryValidationResult = {
  status: "PASS" | "BLOCKED";
  errors: string[];
};

export const requiredProductDiscoveryHeadings = [
  "# Product Discovery Packet:",
  "## Status",
  "## Discovery Interview Summary",
  "## Known Questions Gate",
  "## Product Intent",
  "## Taxonomy Classification",
  "## Job-To-Be-Done Bridge",
  "## Use Case Statements",
  "## State-Based Journey Matrix",
  "## Product Capability Breakdown",
  "## Technical Steering Handoff",
];

export function validateProductDiscoveryContent(content: string): ProductDiscoveryValidationResult {
  const missing = requiredProductDiscoveryHeadings.filter((heading) => !content.includes(heading));

  return {
    status: missing.length === 0 ? "PASS" : "BLOCKED",
    errors: missing.map((heading) => `missing heading: ${heading}`),
  };
}

export function validateProductDiscoveryFile(packetPath: string): ProductDiscoveryValidationResult {
  const content = readFileSync(packetPath, "utf8");
  return validateProductDiscoveryContent(content);
}

export function listProductDiscoveryPacketPaths(root = path.resolve(process.cwd(), "docs/workspace/product-discovery")): string[] {
  if (!existsSync(root)) {
    return [];
  }

  return readdirSync(root)
    .map((entry) => path.join(root, entry))
    .filter((entryPath) => statSync(entryPath).isFile())
    .filter((entryPath) => entryPath.endsWith(".md"))
    .filter((entryPath) => path.basename(entryPath).toLowerCase() !== "readme.md")
    .sort();
}

export function validateAllProductDiscoveryPackets(root?: string): Array<{ packetPath: string; result: ProductDiscoveryValidationResult }> {
  return listProductDiscoveryPacketPaths(root).map((packetPath) => ({
    packetPath,
    result: validateProductDiscoveryFile(packetPath),
  }));
}

function main(): void {
  const args = process.argv.slice(2);
  const validateAll = args.includes("--all");
  const packetArg = args.find((arg) => !arg.startsWith("--"));

  if (validateAll) {
    const results = validateAllProductDiscoveryPackets();
    const failures = results.filter(({ result }) => result.status === "BLOCKED");

    if (results.length === 0) {
      console.error("No Product Discovery packets found under docs/workspace/product-discovery.");
      process.exit(1);
    }

    if (failures.length > 0) {
      console.error("Product Discovery packet validation failed:");
      for (const failure of failures) {
        console.error(`- ${failure.packetPath}`);
        for (const error of failure.result.errors) {
          console.error(`  - ${error}`);
        }
      }
      process.exit(1);
    }

    console.log("Product Discovery packet validation OK:");
    console.log(`- packets: ${results.length}`);
    console.log("- root: docs/workspace/product-discovery");
    return;
  }

  if (!packetArg) {
    console.error("Usage: npm run product-discovery:validate -- <packet-path>");
    console.error("   or: npm run product-discovery:validate -- --all");
    process.exit(1);
  }

  const packetPath = path.resolve(process.cwd(), packetArg);

  if (!existsSync(packetPath)) {
    console.error(`Packet not found: ${packetPath}`);
    process.exit(1);
  }

  const result = validateProductDiscoveryFile(packetPath);

  if (result.status === "BLOCKED") {
    console.error(`Product Discovery packet validation failed: ${packetPath}`);
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Product Discovery packet structure OK: ${packetPath}`);
}

if (require.main === module) {
  main();
}
