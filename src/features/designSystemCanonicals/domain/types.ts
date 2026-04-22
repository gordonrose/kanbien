import type {
  DesignSystemCanonicalFamilyKind,
  DesignSystemCanonicalFamilyResponse,
  DesignSystemCanonicalLifecycleStatus,
  DesignSystemCanonicalReferenceResponse,
  PublicCanonicalFamilyListResponse,
  PublicCanonicalLauncherResponse,
  PublicCanonicalRenderingResponse,
} from "../contract/types";

export interface DesignSystemCanonicalFamilyData {
  canonicalFamilyId: string;
  familyKey: string;
  displayLabel: string;
  familyKind: DesignSystemCanonicalFamilyKind;
  launcherTitle: string;
  launcherDescription: string;
  launcherCategory: string | null;
  launcherTemplateKey: "launcher";
  renderTemplateKey: "canonical-rendering";
  generatedLauncherRoutePath: string;
  generatedRootRoutePath: string;
  legacyLauncherRoutePath: string | null;
  sourceSurfaceRoutePath: string | null;
  status: DesignSystemCanonicalLifecycleStatus;
  sortOrder: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DesignSystemCanonicalReferenceData {
  canonicalReferenceId: string;
  canonicalFamilyId: string;
  familyKey: string;
  referenceId: string;
  displayLabel: string;
  description: string;
  renderRoutePath: string;
  legacyRenderRoutePath: string | null;
  viewport: string | null;
  width: number | null;
  height: number | null;
  theme: string;
  direction: string;
  zoom: number;
  localeFixture: string | null;
  labelDensityFixture: string | null;
  stateVariantKey: string | null;
  specimenPayload: Record<string, unknown>;
  status: DesignSystemCanonicalLifecycleStatus;
  sortOrder: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCanonicalFamilyInput {
  familyKey: string;
  displayLabel: string;
  familyKind: DesignSystemCanonicalFamilyKind;
  launcherTitle: string;
  launcherDescription: string;
  launcherCategory?: string | null;
  generatedLauncherRoutePath: string;
  generatedRootRoutePath: string;
  legacyLauncherRoutePath?: string | null;
  sourceSurfaceRoutePath?: string | null;
  status?: DesignSystemCanonicalLifecycleStatus;
  sortOrder?: number;
  featured?: boolean;
}

export interface UpdateCanonicalFamilyInput {
  canonicalFamilyId: string;
  displayLabel?: string;
  familyKind?: DesignSystemCanonicalFamilyKind;
  launcherTitle?: string;
  launcherDescription?: string;
  launcherCategory?: string | null;
  generatedLauncherRoutePath?: string;
  generatedRootRoutePath?: string;
  legacyLauncherRoutePath?: string | null;
  sourceSurfaceRoutePath?: string | null;
  status?: DesignSystemCanonicalLifecycleStatus;
  sortOrder?: number;
  featured?: boolean;
}

export interface CreateCanonicalReferenceInput {
  canonicalFamilyId: string;
  referenceId: string;
  displayLabel: string;
  description: string;
  renderRoutePath: string;
  legacyRenderRoutePath?: string | null;
  viewport?: string | null;
  width?: number | null;
  height?: number | null;
  theme?: string;
  direction?: string;
  zoom?: number;
  localeFixture?: string | null;
  labelDensityFixture?: string | null;
  stateVariantKey?: string | null;
  specimenPayload?: Record<string, unknown>;
  status?: DesignSystemCanonicalLifecycleStatus;
  sortOrder?: number;
  featured?: boolean;
}

export interface UpdateCanonicalReferenceInput {
  canonicalReferenceId: string;
  displayLabel?: string;
  description?: string;
  renderRoutePath?: string;
  legacyRenderRoutePath?: string | null;
  viewport?: string | null;
  width?: number | null;
  height?: number | null;
  theme?: string;
  direction?: string;
  zoom?: number;
  localeFixture?: string | null;
  labelDensityFixture?: string | null;
  stateVariantKey?: string | null;
  specimenPayload?: Record<string, unknown>;
  status?: DesignSystemCanonicalLifecycleStatus;
  sortOrder?: number;
  featured?: boolean;
}

export interface DesignSystemCanonicalHierarchyNode {
  familyKey: string;
  familyDisplayLabel: string;
  launcherRoutePath: string;
  rootRoutePath: string;
  renderTemplateKey: "canonical-rendering";
  launcherTemplateKey: "launcher";
  references: Array<{
    referenceId: string;
    displayLabel: string;
    renderRoutePath: string;
  }>;
}

export interface DesignSystemCanonicalsPublicSeam {
  listLiveFamilies(): Promise<PublicCanonicalFamilyListResponse>;
  getPublicLauncherByFamilyKey(familyKey: string): Promise<PublicCanonicalLauncherResponse>;
  getPublicRenderingByFamilyKeyAndReferenceId(
    familyKey: string,
    referenceId: string,
  ): Promise<PublicCanonicalRenderingResponse>;
  listLiveHierarchyNodes(): Promise<DesignSystemCanonicalHierarchyNode[]>;
}

function toIsoString(value: Date): string {
  return value.toISOString();
}

export function toCanonicalFamilyResponse(
  family: DesignSystemCanonicalFamilyData,
): DesignSystemCanonicalFamilyResponse {
  return {
    ...family,
    createdAt: toIsoString(family.createdAt),
    updatedAt: toIsoString(family.updatedAt),
  };
}

export function toCanonicalReferenceResponse(
  reference: DesignSystemCanonicalReferenceData,
): DesignSystemCanonicalReferenceResponse {
  return {
    ...reference,
    createdAt: toIsoString(reference.createdAt),
    updatedAt: toIsoString(reference.updatedAt),
  };
}

