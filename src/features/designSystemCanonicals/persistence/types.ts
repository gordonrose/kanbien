import type {
  DesignSystemCanonicalFamilyKind,
  DesignSystemCanonicalLifecycleStatus,
} from "../contract/types";

export interface DesignSystemCanonicalFamilyRecord {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface DesignSystemCanonicalReferenceRecord {
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

