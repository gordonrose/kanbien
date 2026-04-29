import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Options = {
  slug: string | null;
  title: string | null;
  outDir: string;
};

const repoRoot = process.cwd();
const templatePath = path.join(repoRoot, "docs", "templates", "product-discovery-packet-template.md");

function parseArg(argv: string[], flag: string): string | null {
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === flag) {
      return argv[index + 1] ?? null;
    }
    if (value.startsWith(`${flag}=`)) {
      return value.slice(flag.length + 1) || null;
    }
  }
  return null;
}

function parseOptions(argv: string[]): Options {
  return {
    slug: parseArg(argv, "--slug"),
    title: parseArg(argv, "--title"),
    outDir: parseArg(argv, "--out-dir") ?? path.join("docs", "workspace", "product-discovery"),
  };
}

function validateSlug(slug: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("`--slug` must use lowercase letters, numbers, and single hyphens only.");
  }
}

function renderDraftPacket(template: string, title: string): string {
  const withoutTemplateHeading = template.replace(/^# Product Discovery Packet Template\n/, "");
  return `# Product Discovery Packet: ${title}

Draft safety label:

- Created as a draft discovery artifact.
- Full repo guardrails and artifact sweeps were intentionally skipped.
- This packet is not validated, governed, complete, implementation-ready, or
  artifact-complete.

${withoutTemplateHeading}`;
}

function main(): void {
  const options = parseOptions(process.argv.slice(2));

  if (!options.slug || !options.title) {
    console.error("Usage: npm run product-discovery:draft -- --slug <slug> --title \"<title>\"");
    process.exit(1);
  }

  validateSlug(options.slug);

  if (!existsSync(templatePath)) {
    console.error(`Required template not found: ${templatePath}`);
    console.error("Stop and ask for guidance rather than doing a broad repo crawl.");
    process.exit(1);
  }

  const outputDir = path.resolve(repoRoot, options.outDir);
  const outputPath = path.join(outputDir, `${new Date().toISOString().slice(0, 10)}-${options.slug}.md`);

  if (existsSync(outputPath)) {
    console.error(`Draft packet already exists: ${outputPath}`);
    process.exit(1);
  }

  mkdirSync(outputDir, { recursive: true });

  const template = readFileSync(templatePath, "utf8");
  writeFileSync(outputPath, renderDraftPacket(template, options.title), "utf8");

  console.log(outputPath);
}

main();
