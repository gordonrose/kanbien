export type DesignSystemCanonicalLifecycleStatus = "draft" | "review" | "live" | "inactive";
export type DesignSystemCanonicalFamilyKind = "component" | "pattern" | "template";

export interface DesignSystemCanonicalFamilyResponse {
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
  createdAt: string;
  updatedAt: string;
}

export interface DesignSystemCanonicalReferenceResponse {
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
  createdAt: string;
  updatedAt: string;
}

export interface PublicCanonicalFamilyListResponse {
  items: DesignSystemCanonicalFamilyResponse[];
}

export interface PublicCanonicalLauncherResponse {
  family: DesignSystemCanonicalFamilyResponse;
  references: DesignSystemCanonicalReferenceResponse[];
}

export interface PublicCanonicalRenderingResponse {
  family: DesignSystemCanonicalFamilyResponse;
  reference: DesignSystemCanonicalReferenceResponse;
}

