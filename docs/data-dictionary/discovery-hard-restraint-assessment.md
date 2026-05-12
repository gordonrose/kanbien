# Discovery Hard Restraint Assessment

## Summary

- Description:
  Planned assessment record for a non-negotiable restraint detected during
  discovery.
- Owning feature:
  TBD with discovery inference ownership.
- Status:
  planned.

## Fields

- `hard_restraint_assessment_id`
  Type / Shape: `UUID`
  Description: Stable identifier for one assessment.
- `discovery_session_id`
  Type / Shape: `UUID`
  Description: Session where the restraint was detected or evaluated.
- `restraint_category`
  Type / Shape: `TEXT`
  Description: Category such as `tenantBoundaryRestraint`,
  `roleAuthorityRestraint`, `dataHandlingRestraint`,
  `complianceRestraint`, `auditabilityRestraint`,
  `securityRestraint`, `designSystemSeamRestraint`,
  `platformBoundaryRestraint`, `featureOwnershipRestraint`,
  `commercialEntitlementRestraint`, `operationalEnvironmentRestraint`,
  `availabilityReliabilityRestraint`, `performanceRestraint`,
  `reversibilityRestraint`, `timeBudgetRestraint`, or
  `supportModelRestraint`.
- `source_type`
  Type / Shape: `TEXT`
  Description: record-backed, user-stated, inferred, catalogue-backed, or
  policy-backed.
- `severity`
  Type / Shape: `TEXT`
  Description: `low`, `medium`, `high`, or `blocking`.
- `confidence`
  Type / Shape: `NUMERIC`
  Description: Evidence-backed confidence.
- `enforcement_mode`
  Type / Shape: `TEXT`
  Description: `block`, `reroute`, `requiresReview`, `warn`, or `track`.
- `accountable_route`
  Type / Shape: `TEXT`
  Description: architecture, security, dataAccess, compliance, designSystem,
  pricingCommercial, featureOwner, platformOwner, tenantAdmin, or rootOperator.
- `packet_impact`
  Type / Shape: `TEXT`
  Description: How the restraint affects readiness or recommendation.

## Governance Notes

- Hard restraints override preference, convenience, and inferred ROI.
- Role authority, data handling, and compliance restraints must align with the
  existing authz and compliance architecture before implementation.
