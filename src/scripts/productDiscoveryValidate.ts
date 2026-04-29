import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const requiredHeadings = [
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

function main(): void {
  const packetArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));

  if (!packetArg) {
    console.error("Usage: npm run product-discovery:validate -- <packet-path>");
    process.exit(1);
  }

  const packetPath = path.resolve(process.cwd(), packetArg);

  if (!existsSync(packetPath)) {
    console.error(`Packet not found: ${packetPath}`);
    process.exit(1);
  }

  const content = readFileSync(packetPath, "utf8");
  const missing = requiredHeadings.filter((heading) => !content.includes(heading));

  if (missing.length > 0) {
    console.error(`Product Discovery packet validation failed: ${packetPath}`);
    for (const heading of missing) {
      console.error(`- missing heading: ${heading}`);
    }
    process.exit(1);
  }

  console.log(`Product Discovery packet structure OK: ${packetPath}`);
}

main();
