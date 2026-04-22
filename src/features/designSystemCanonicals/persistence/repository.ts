import type {
  DesignSystemCanonicalFamilyData,
  DesignSystemCanonicalReferenceData,
} from "../domain/types";
import type {
  DesignSystemCanonicalFamilyKind,
  DesignSystemCanonicalLifecycleStatus,
} from "../contract/types";

export interface DesignSystemCanonicalsRepository {
  listLiveFamilies(): Promise<DesignSystemCanonicalFamilyData[]>;
  findFamilyById(canonicalFamilyId: string): Promise<DesignSystemCanonicalFamilyData | null>;
  findFamilyByKey(familyKey: string): Promise<DesignSystemCanonicalFamilyData | null>;
  findLiveFamilyByKey(familyKey: string): Promise<DesignSystemCanonicalFamilyData | null>;
  findFamilyByGeneratedLauncherRoutePath(routePath: string): Promise<DesignSystemCanonicalFamilyData | null>;
  createFamily(input: {
    canonicalFamilyId: string;
    familyKey: string;
    displayLabel: string;
    familyKind: DesignSystemCanonicalFamilyKind;
    launcherTitle: string;
    launcherDescription: string;
    launcherCategory: string | null;
    generatedLauncherRoutePath: string;
    generatedRootRoutePath: string;
    legacyLauncherRoutePath: string | null;
    sourceSurfaceRoutePath: string | null;
    status: DesignSystemCanonicalLifecycleStatus;
    sortOrder: number;
    featured: boolean;
  }): Promise<DesignSystemCanonicalFamilyData>;
  updateFamily(input: {
    canonicalFamilyId: string;
    displayLabel: string;
    familyKind: DesignSystemCanonicalFamilyKind;
    launcherTitle: string;
    launcherDescription: string;
    launcherCategory: string | null;
    generatedLauncherRoutePath: string;
    generatedRootRoutePath: string;
    legacyLauncherRoutePath: string | null;
    sourceSurfaceRoutePath: string | null;
    status: DesignSystemCanonicalLifecycleStatus;
    sortOrder: number;
    featured: boolean;
  }): Promise<DesignSystemCanonicalFamilyData>;
  listLiveReferencesByFamilyKey(familyKey: string): Promise<DesignSystemCanonicalReferenceData[]>;
  findReferenceById(canonicalReferenceId: string): Promise<DesignSystemCanonicalReferenceData | null>;
  findReferenceByFamilyAndReferenceId(
    familyKey: string,
    referenceId: string,
  ): Promise<DesignSystemCanonicalReferenceData | null>;
  findLiveReferenceByFamilyAndReferenceId(
    familyKey: string,
    referenceId: string,
  ): Promise<DesignSystemCanonicalReferenceData | null>;
  findReferenceByRenderRoutePath(routePath: string): Promise<DesignSystemCanonicalReferenceData | null>;
  createReference(input: {
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
  }): Promise<DesignSystemCanonicalReferenceData>;
  updateReference(input: {
    canonicalReferenceId: string;
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
  }): Promise<DesignSystemCanonicalReferenceData>;
}
