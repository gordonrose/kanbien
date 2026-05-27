import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app";

const designSystemRoot = resolve(process.cwd(), "src/frontend/designSystem");

type DesignSystemRegistration = {
  systemKey: string;
  label: string;
  assetsBase: string;
  tokens?: Record<string, (() => Promise<Record<string, unknown>>) | undefined>;
};

type SystemManifest = {
  schema: string;
  systemKey: string;
  label: string;
  assetsBase: string;
  contracts: Record<
    string,
    {
      contractModule: string;
      implementationModule: string;
      implementationExport: string;
      pageRoute: string;
    }
  >;
};

function repoPath(path: string): string {
  return resolve(process.cwd(), path);
}

async function importRepoModule(path: string): Promise<Record<string, unknown>> {
  return import(pathToFileURL(repoPath(path)).href) as Promise<Record<string, unknown>>;
}

function readSystemManifest(systemKey: string): SystemManifest {
  const manifestPath = resolve(designSystemRoot, "systems", systemKey, "system.manifest.json");
  expect(existsSync(manifestPath), `Missing design-system manifest for ${systemKey}`).toBe(true);
  return JSON.parse(readFileSync(manifestPath, "utf8")) as SystemManifest;
}

function moduleExportsContractId(moduleExports: Record<string, unknown>, contractId: string): boolean {
  return Object.values(moduleExports).some((value) => {
    return (
      typeof value === "object" &&
      value !== null &&
      "contractId" in value &&
      (value as { contractId?: unknown }).contractId === contractId
    );
  });
}

describe("design-system system registry guard", () => {
  it("keeps registered systems aligned with manifests, contract modules, implementation exports, and served routes", async () => {
    const registry = (await importRepoModule("src/frontend/designSystem/registry/designSystems.mjs")) as {
      designSystems: Record<string, DesignSystemRegistration>;
      getDesignSystem: (systemKey?: string) => DesignSystemRegistration | null;
    };

    expect(Object.keys(registry.designSystems).length).toBeGreaterThan(0);

    for (const [systemKey, registration] of Object.entries(registry.designSystems)) {
      const manifest = readSystemManifest(systemKey);

      expect(registration.systemKey).toBe(systemKey);
      expect(registry.getDesignSystem(systemKey)).toBe(registration);
      expect(manifest.schema).toBe("kanbien.designSystem.systemManifest.v1");
      expect(manifest.systemKey).toBe(systemKey);
      expect(manifest.label).toBe(registration.label);
      expect(manifest.assetsBase).toBe(registration.assetsBase);
      expect(manifest.assetsBase).toBe(`/design-system/systems/${systemKey}/assets`);
      expect(Object.keys(manifest.contracts).length, `${systemKey} must declare at least one contract`).toBeGreaterThan(0);
      expect(registration.tokens, `${systemKey} must register token loaders`).toBeDefined();

      for (const [contractId, contract] of Object.entries(manifest.contracts)) {
        expect(existsSync(repoPath(contract.contractModule)), `${contractId} contract module is missing`).toBe(true);
        expect(existsSync(repoPath(contract.implementationModule)), `${contractId} implementation module is missing`).toBe(true);
        expect(contract.pageRoute).toMatch(new RegExp(`^/design-system/${systemKey}/`));

        const contractModule = await importRepoModule(contract.contractModule);
        const implementationModule = await importRepoModule(contract.implementationModule);
        const implementationExport = implementationModule[contract.implementationExport] as
          | { contractId?: unknown; systemKey?: unknown; variantSectionDescription?: unknown }
          | undefined;

        expect(moduleExportsContractId(contractModule, contractId), `${contract.contractModule} must export ${contractId}`).toBe(true);
        expect(implementationExport, `${contract.implementationModule} must export ${contract.implementationExport}`).toBeDefined();
        expect(implementationExport?.contractId).toBe(contractId);
        expect(implementationExport?.systemKey).toBe(systemKey);
        expect(
          typeof implementationExport?.variantSectionDescription === "string" &&
            implementationExport.variantSectionDescription.trim().length > 0,
          `${contract.contractModule} ${contract.implementationExport} must define a token-specific variantSectionDescription`,
        ).toBe(true);
        expect(implementationModule.tokenDefinitionV1, `${contract.implementationModule} must export tokenDefinitionV1`).toMatchObject({
          schema: "kanbien.designSystem.tokenDefinition.v1",
          designSystem: systemKey,
        });
        expect(implementationModule.tokenDefinitionV1).toHaveProperty(["codeSeam", "systemTokenExport"], contract.implementationExport);
        expect(implementationModule.tokenTypeTemplate, `${contract.implementationModule} must export tokenTypeTemplate`).toHaveProperty(
          "schema",
          "kanbien.designSystem.tokenTypeTemplate.v1",
        );
        expect(Array.isArray(implementationModule.variants), `${contract.implementationModule} must export variants`).toBe(true);
        expect((implementationModule.variants as unknown[]).length, `${contract.implementationModule} variants must not be empty`).toBeGreaterThan(
          0,
        );

        if (contractId === "tokens.background-color") {
          const registeredTokenModule = await registration.tokens?.backgroundColor?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.focus-ring") {
          const registeredTokenModule = await registration.tokens?.focusRing?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.index-nav-item-surface") {
          const registeredTokenModule = await registration.tokens?.indexNavItemSurface?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.index-nav-item-current-indicator") {
          const registeredTokenModule = await registration.tokens?.indexNavItemCurrentIndicator?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.index-nav-item-gap") {
          const registeredTokenModule = await registration.tokens?.indexNavItemGap?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.index-nav-item-padding") {
          const registeredTokenModule = await registration.tokens?.indexNavItemPadding?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.index-nav-item-radius") {
          const registeredTokenModule = await registration.tokens?.indexNavItemRadius?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.index-nav-item-supporting-text-style") {
          const registeredTokenModule = await registration.tokens?.indexNavItemSupportingTextStyle?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.index-nav-list-gap") {
          const registeredTokenModule = await registration.tokens?.indexNavListGap?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.index-nav-panel-frame") {
          const registeredTokenModule = await registration.tokens?.indexNavPanelFrame?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.label-text-style") {
          const registeredTokenModule = await registration.tokens?.labelTextStyle?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.minimum-target-size") {
          const registeredTokenModule = await registration.tokens?.minimumTargetSize?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.primary-color-source") {
          const registeredTokenModule = await registration.tokens?.primaryColorSource?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.primary-tinted-background") {
          const registeredTokenModule = await registration.tokens?.primaryTintedBackground?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.primary-tinted-foreground") {
          const registeredTokenModule = await registration.tokens?.primaryTintedForeground?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.tooltip-surface") {
          const registeredTokenModule = await registration.tokens?.tooltipSurface?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        if (contractId === "tokens.tooltip-text-style") {
          const registeredTokenModule = await registration.tokens?.tooltipTextStyle?.();
          expect(registeredTokenModule, `${systemKey} registry must load ${contractId}`).toBeDefined();
          expect(registeredTokenModule?.[contract.implementationExport]).toBe(implementationExport);
        }

        const response = await request(createApp()).get(contract.pageRoute).set("host", "admin.example.test");

        expect(response.status, contract.pageRoute).toBe(200);
        expect(response.text, contract.pageRoute).toContain(`${registration.assetsBase}/styles.css`);
        expect(response.text, contract.pageRoute).toContain("/design-system/assets/styles.css");
        expect(response.text, contract.pageRoute).toContain("/design-system/assets/app.mjs");
      }
    }

    expect(registry.getDesignSystem("missing-system")).toBeNull();
  });
});
