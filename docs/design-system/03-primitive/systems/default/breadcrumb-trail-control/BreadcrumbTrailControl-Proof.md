# Breadcrumb Trail Control Default Proof

Shared contract:
`docs/design-system/03-primitive/shared/breadcrumb-trail-control/BreadcrumbTrailControl-Contract.md`

Rendered view:
`/design-system/default/primitives/breadcrumb-trail-control`

The default proof renders full, reduced, compact, mobile-hidden, long-label,
and RTL breadcrumb states using signed button, label, focus, target-size, and
icon-size token seams plus the accepted `truncating-label` primitive and the
governed `icon-button-control` signpost trigger for compact recovery.
Visible breadcrumb labels request below-placement from `truncating-label` so
full-label disclosure remains clear of shell top navigation when hosted by
sub-navigation.

The proof does not approve sub-navigation row placement, search shell behavior,
component props, app route hierarchy generation, or app adoption.
