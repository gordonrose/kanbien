# Layer 2 Token Behavior Bucket

Use this bucket when the ask is for a reusable visual, spacing, typography, color, surface, focus, or layout decision.

## Recognition Test

The ask is about a reusable visual fact rather than behavior or composition, and local hard-coding would create drift across themes, zoom, direction, or consumers.

## Common Design-System Tokens

- Color palette tokens
- Semantic color tokens
- Text color tokens
- Background color tokens
- Border color tokens
- Surface tokens
- Elevation or shadow tokens
- Spacing tokens
- Gap tokens
- Padding tokens
- Margin tokens
- Sizing tokens
- Minimum target-size tokens
- Border-width tokens
- Border-radius tokens
- Typography family tokens
- Font-size tokens
- Font-weight tokens
- Line-height tokens
- Letter-spacing tokens
- Icon-size tokens
- Focus-ring tokens
- Outline tokens
- Motion duration tokens
- Motion easing tokens
- Z-index or layering tokens
- Opacity tokens
- Breakpoint tokens
- Container-width tokens
- Density tokens
- Theme tokens
- Direction-aware spacing tokens
- Error-state tokens
- Success-state tokens
- Warning-state tokens
- Disabled-state tokens
- Loading-state tokens

## Token Specification Attributes

Use these tables to identify the information a later Layer 2 token artifact
would need. Layer 1 may record which attributes are known or missing, but must
not invent token names, values, or usage rules.

### Color Palette Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Palette role | The neutral, brand, accent, or utility family the color belongs to. | `brand-blue` |
| Scale step | The ordered shade or tint step used for systematic variation. | `500` |
| Color value | The actual color value in the approved format. | `#2563eb` |
| Color space | The color notation or space used for the token set. | `hex`, `oklch` |
| Theme mapping | How the palette value changes across supported themes. | `dark: brand-blue-300` |
| Allowed consumers | Which token layers or primitives may consume the palette value directly. | `semantic tokens only` |

### Semantic Color Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Semantic role | The meaning represented by the color. | `danger`, `info`, `brand` |
| Usage context | Where the semantic color may be used. | `destructive action background` |
| Mapped palette token | The palette token that supplies the value. | `palette.red.600` |
| Contrast requirement | The minimum contrast expectation for paired content. | `4.5:1 with text-on-danger` |
| Theme mapping | The value used in each supported theme. | `desert: palette.rust.700` |
| State mapping | How the token changes for hover, active, disabled, or error states. | `hover: danger-hover` |

### Text Color Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Text role | The text hierarchy or meaning the token supports. | `text-primary` |
| Background pairing | The surfaces or backgrounds where the text color is approved. | `surface-default` |
| Contrast requirement | The minimum contrast against approved backgrounds. | `7:1 preferred` |
| Theme mapping | The text color used per supported theme. | `dark: palette.gray.100` |
| State mapping | Text changes for disabled, error, selected, or inverse states. | `disabled: text-disabled` |
| Allowed content | The text kinds the token can style. | `body copy`, `metadata` |

### Background Color Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Background role | The page, section, control, overlay, or state background purpose. | `background-page` |
| Surface relationship | The surfaces or components that may sit on top of it. | `supports surface-card` |
| Mapped palette token | The palette value used for the background. | `palette.gray.50` |
| Theme mapping | Background value for each supported theme. | `dark: palette.gray.950` |
| Contrast pairings | Text, border, or icon tokens approved on this background. | `text-primary`, `border-subtle` |
| State mapping | Variants for hover, selected, disabled, or error. | `selected: background-selected` |

### Border Color Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Border role | The visual purpose of the border. | `border-subtle` |
| Surface pairing | The surfaces or backgrounds where the border is valid. | `surface-default` |
| Mapped palette token | The palette token that supplies the border color. | `palette.gray.200` |
| Theme mapping | Border value for each supported theme. | `dark: palette.gray.700` |
| State mapping | Border variants for focus, error, selected, or disabled states. | `error: border-danger` |
| Visibility requirement | The minimum visibility or contrast requirement for the border. | `visible at 150% zoom` |

### Surface Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Surface role | The kind of layered UI surface represented. | `surface-card` |
| Background value | The background token used by the surface. | `background-surface` |
| Border value | The default border token for the surface. | `border-subtle` |
| Elevation value | The shadow or elevation token used by the surface. | `shadow-sm` |
| Nesting rule | Whether and how the surface may appear inside another surface. | `not inside card` |
| Theme mapping | Surface treatment for each supported theme. | `desert: surface-warm` |

### Elevation Or Shadow Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Elevation level | The relative depth represented by the token. | `elevation-2` |
| Shadow value | The actual shadow value or shadow stack. | `0 8px 24px rgb(0 0 0 / 0.16)` |
| Usage context | The surfaces or overlays allowed to use it. | `popover`, `drawer` |
| Theme mapping | Shadow changes across themes. | `dark: shadow-none plus border` |
| Stacking relationship | How the elevation relates to z-index or overlay layers. | `above page content` |
| Motion relationship | Whether elevation changes during interaction. | `hover elevation disabled` |

### Spacing Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Scale step | The named or numbered spacing step. | `space-4` |
| Length value | The actual spacing length. | `1rem` |
| Use category | The intended spacing role. | `component internal spacing` |
| Density mapping | How spacing changes in compact or comfortable density. | `compact: space-3` |
| Direction behavior | Whether the spacing is physical or logical. | `logical inline-start` |
| Allowed consumers | Which layers may consume the spacing token. | `primitives and patterns` |

### Gap Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Gap role | The relationship the gap separates. | `control-gap` |
| Length value | The gap size. | `0.5rem` |
| Layout context | The layout type where the gap applies. | `inline action group` |
| Responsive mapping | How the gap changes by viewport or container. | `narrow: gap-sm` |
| Density mapping | How the gap changes by density. | `compact: gap-xs` |
| Wrap behavior | Whether the gap supports wrapping layouts. | `row-gap matches column-gap` |

### Padding Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Padding role | The target surface or control padding purpose. | `button-inline-padding` |
| Axis | The affected axis or side. | `inline`, `block` |
| Length value | The padding value. | `0.75rem` |
| Density mapping | Padding changes for density modes. | `compact: 0.5rem` |
| Direction behavior | Whether inline start/end swap in RTL. | `logical inline` |
| Target-size impact | Whether padding contributes to minimum hit area. | `helps meet 44px target` |

### Margin Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Margin role | The external spacing relationship represented. | `section-stack-margin` |
| Axis | The affected axis or side. | `block-end` |
| Length value | The margin value. | `1.5rem` |
| Collapse behavior | Whether margin collapse or replacement is allowed. | `use gap instead in flex layouts` |
| Responsive mapping | Margin changes by viewport or container. | `narrow: margin-md` |
| Direction behavior | Whether inline start/end swap in RTL. | `logical inline-start` |

### Sizing Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Size role | The element, control, or layout size represented. | `control-height-md` |
| Dimension | Width, height, min, max, or square size. | `height` |
| Length value | The size value. | `2.5rem` |
| Responsive mapping | Size changes by viewport or container. | `small: control-height-sm` |
| Density mapping | Size changes by density. | `compact: 2rem` |
| Accessibility constraint | Target-size or zoom requirement affected by the size. | `minimum 44px touch target` |

### Minimum Target-Size Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Input modality | The modality the target-size applies to. | `touch` |
| Minimum width | The smallest allowed hit-area width. | `44px` |
| Minimum height | The smallest allowed hit-area height. | `44px` |
| Exception rule | Any approved exception to the minimum. | `inline text link excluded` |
| Spacing relationship | Required spacing between adjacent targets. | `8px between small targets` |
| Proof requirement | Evidence needed to verify target size. | `computed bounding box check` |

### Border-Width Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Border role | The purpose of the border width. | `border-width-focus` |
| Width value | The border thickness. | `2px` |
| Affected sides | Which sides use the width. | `all`, `block-end` |
| State mapping | State-specific width changes. | `focus: 2px` |
| Layout impact | Whether the width reserves space or shifts layout. | `uses outline to avoid shift` |
| Theme mapping | Width differences by theme, if any. | `same across themes` |

### Border-Radius Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Radius role | The component or surface shape represented. | `radius-control` |
| Radius value | The corner radius. | `6px` |
| Corner scope | Which corners the radius applies to. | `all corners` |
| Size mapping | Radius changes by component size. | `large: radius-lg` |
| Surface relationship | Whether nested surfaces may share or reduce radius. | `inner radius minus border` |
| Forbidden use | Shapes the token must not create. | `not pill unless radius-pill` |

### Typography Family Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Font role | The text category using the font family. | `font-body` |
| Font stack | The font-family stack. | `Inter, system-ui, sans-serif` |
| Fallback behavior | Approved fallback fonts or system behavior. | `system sans fallback` |
| Locale support | Script or language coverage expectations. | `Latin plus extended Latin` |
| Loading strategy | How web fonts load, if applicable. | `font-display: swap` |
| Allowed consumers | Which text styles can use the family. | `body and UI labels` |

### Font-Size Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Type scale step | The named text size. | `text-sm` |
| Size value | The font-size value. | `0.875rem` |
| Intended text role | The role this size supports. | `metadata` |
| Responsive mapping | Size changes by viewport, if approved. | `none` |
| Zoom behavior | Whether text remains legible at required zoom levels. | `passes 150% zoom` |
| Paired line-height | The approved line-height token. | `line-height-sm` |

### Font-Weight Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Weight role | The semantic text emphasis represented. | `font-weight-medium` |
| Numeric value | The font-weight value. | `500` |
| Intended text role | Where the weight is used. | `button label` |
| Font availability | Whether the selected family supports the weight. | `Inter 500 available` |
| Contrast interaction | Whether the weight compensates for size or color constraints. | `not used as sole state indicator` |
| Theme mapping | Weight differences by theme, if any. | `same across themes` |

### Line-Height Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Line-height role | The text style or density role represented. | `line-height-body` |
| Line-height value | The unitless or length value. | `1.5` |
| Paired font size | The font-size token it pairs with. | `text-md` |
| Text wrapping behavior | Whether the value supports multi-line text. | `supports body wrapping` |
| Density mapping | Line-height changes by density. | `compact: 1.35` |
| Accessibility requirement | Readability or zoom requirement. | `no clipping at 150% zoom` |

### Letter-Spacing Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Spacing role | The text role needing letter spacing. | `letter-spacing-label` |
| Spacing value | The letter-spacing value. | `0` |
| Text transform pairing | Whether it pairs with uppercase or other transforms. | `not paired with uppercase` |
| Font-size pairing | The font sizes where it is allowed. | `text-xs labels` |
| Locale constraint | Whether the value is safe for supported scripts. | `Latin labels only` |
| Forbidden use | Where spacing must not be applied. | `body copy` |

### Icon-Size Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Icon size role | The control or context represented. | `icon-size-button-sm` |
| Size value | The width and height. | `16px` |
| Stroke relationship | Expected stroke width pairing. | `stroke-1.75` |
| Container pairing | The control or target-size token it pairs with. | `control-height-sm` |
| Density mapping | Size changes by density. | `compact: 14px` |
| Accessibility constraint | Whether icon-only use requires a label or target size. | `requires accessible name` |

### Focus-Ring Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Focus role | The focus treatment represented. | `focus-ring-default` |
| Ring color | The color token used for the ring. | `color-focus` |
| Ring width | The visual ring thickness. | `2px` |
| Offset | The distance between element and ring. | `2px` |
| Shape behavior | How the ring follows border radius or shape. | `matches radius-control` |
| Contrast requirement | Minimum visibility against approved backgrounds. | `3:1 adjacent contrast` |

### Outline Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Outline role | The visual or accessibility role of the outline. | `outline-focus-inset` |
| Outline width | The outline thickness. | `2px` |
| Outline color | The color token used for the outline. | `color-focus` |
| Outline offset | The offset value. | `-2px` |
| Layout impact | Whether outline affects layout. | `no layout shift` |
| State mapping | States where the outline appears. | `focus-visible only` |

### Motion Duration Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Duration role | The interaction or transition speed represented. | `duration-fast` |
| Duration value | The time value. | `120ms` |
| Interaction context | Where the duration may be used. | `hover transition` |
| Reduced-motion behavior | Replacement behavior when motion is reduced. | `0ms or opacity only` |
| Enter/exit mapping | Whether enter and exit use different durations. | `exit: duration-fastest` |
| Maximum duration | Any upper bound for the interaction. | `under 300ms` |

### Motion Easing Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Easing role | The motion feel or transition category. | `ease-out-standard` |
| Easing value | The timing-function value. | `cubic-bezier(0.2, 0, 0, 1)` |
| Interaction context | Where the easing may be used. | `overlay enter` |
| Pairing duration | Approved duration token pairing. | `duration-medium` |
| Direction mapping | Different easing for enter, exit, or transform. | `exit: ease-in-standard` |
| Reduced-motion behavior | Whether easing is bypassed when motion is reduced. | `no transform motion` |

### Z-Index Or Layering Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Layer role | The stacking context represented. | `layer-popover` |
| Z-index value | The z-index or stacking value. | `400` |
| Relative order | What this layer sits above and below. | `above dropdown, below modal` |
| Scope | Whether the value is global or local to a stacking context. | `global overlay layer` |
| Escape rule | Whether consumers may create new local stacking contexts. | `no app-local z-index above modal` |
| Related elevation | Shadow or surface token paired with the layer. | `shadow-lg` |

### Opacity Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Opacity role | The visual state or overlay represented. | `opacity-disabled` |
| Opacity value | The opacity value. | `0.45` |
| Usage context | Where opacity may be applied. | `disabled icon` |
| Accessibility constraint | Whether opacity may reduce contrast or meaning. | `must preserve 4.5:1 for text` |
| State mapping | States that use the opacity. | `disabled`, `dragging` |
| Forbidden use | Where opacity must not be used. | `error meaning alone` |

### Breakpoint Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Breakpoint name | The named responsive threshold. | `breakpoint-md` |
| Width value | The viewport or container width. | `768px` |
| Query type | Whether it is viewport-based or container-based. | `container min-width` |
| Direction | Whether the query is min, max, or range. | `min-width` |
| Affected layouts | Layout families that may consume the breakpoint. | `list-detail patterns` |
| Zoom assumption | Whether breakpoint behavior remains valid under zoom. | `checked at 150%` |

### Container-Width Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Container role | The content or layout container represented. | `container-readable` |
| Width value | The max, min, or fixed width. | `72rem max` |
| Inline padding pairing | Padding token paired with the container. | `page-inline-padding` |
| Responsive mapping | Container changes by viewport or parent size. | `narrow: full width` |
| Content type | Content the container is meant to hold. | `forms`, `tables`, `article text` |
| Overflow behavior | How content behaves when it exceeds the container. | `horizontal scroll only for data tables` |

### Density Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Density name | The supported density mode. | `compact` |
| Affected token set | Which tokens change under the density. | `spacing`, `control height`, `font size` |
| Scale mapping | The token replacements used in that density. | `space-4 -> space-3` |
| Minimum accessibility floor | Values that density may not reduce below. | `44px touch target retained` |
| Consumer scope | Components or patterns allowed to use the density. | `data-heavy admin tables` |
| Persistence rule | Whether density is user, app, or context controlled. | `user preference` |

### Theme Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Theme name | The named theme or mode. | `dark` |
| Token overrides | The tokens remapped by the theme. | `background-page`, `text-primary` |
| Invariant tokens | Tokens that must not change by theme. | `spacing scale` |
| Contrast proof | Required contrast evidence for the theme. | `all text tokens pass AA` |
| State coverage | States that need explicit theme mappings. | `error`, `disabled`, `selected` |
| Activation scope | Where the theme applies. | `root data-theme attribute` |

### Direction-Aware Spacing Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Directional role | The logical spacing relationship represented. | `space-inline-start-control` |
| Logical side | The logical side or axis. | `inline-start` |
| Length value | The spacing value. | `0.75rem` |
| RTL mapping | How the value flips or remains stable in RTL. | `inline-start becomes right` |
| Physical fallback | Whether any physical-side fallback is allowed. | `none` |
| Consumer scope | Components or patterns that may use it. | `icon plus label controls` |

### Error-State Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Error role | The visual error purpose represented. | `error-border` |
| Mapped semantic token | The semantic token used for the state. | `color-danger` |
| Affected properties | The visual properties changed in error state. | `border`, `text`, `icon` |
| Accessibility pairing | Required non-color communication. | `error text plus aria-describedby` |
| Theme mapping | Error treatment in each theme. | `dark: danger-300` |
| Recovery state | How the token resolves after the error clears. | `returns to border-default` |

### Success-State Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Success role | The visual success purpose represented. | `success-text` |
| Mapped semantic token | The semantic token used for the state. | `color-success` |
| Affected properties | The visual properties changed in success state. | `text`, `icon`, `background` |
| Accessibility pairing | Required non-color communication. | `status text` |
| Theme mapping | Success treatment in each theme. | `desert: success-olive` |
| Duration rule | Whether success state persists or times out. | `persists until next edit` |

### Warning-State Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Warning role | The visual warning purpose represented. | `warning-background` |
| Mapped semantic token | The semantic token used for the state. | `color-warning` |
| Affected properties | The visual properties changed in warning state. | `background`, `border`, `icon` |
| Accessibility pairing | Required non-color communication. | `warning label` |
| Theme mapping | Warning treatment in each theme. | `dark: amber-300` |
| Severity boundary | What separates warning from error. | `warns but does not block save` |

### Disabled-State Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Disabled role | The disabled visual treatment represented. | `disabled-control` |
| Affected properties | Properties changed in disabled state. | `opacity`, `text`, `background`, `border` |
| Contrast rule | Contrast expectation for disabled content. | `legible but not interactive` |
| Interaction pairing | Required behavior paired with disabled styling. | `not focusable if native disabled` |
| Theme mapping | Disabled treatment in each theme. | `dark: text-disabled-dark` |
| Forbidden use | What must not be communicated by disabled styling. | `permission denial without explanation` |

### Loading-State Tokens

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Loading role | The loading visual treatment represented. | `loading-skeleton-surface` |
| Affected properties | Properties changed during loading. | `background`, `motion`, `opacity` |
| Motion pairing | Motion duration or easing used, if any. | `duration-slow shimmer` |
| Reduced-motion behavior | Loading treatment when motion is reduced. | `static skeleton` |
| Theme mapping | Loading treatment in each theme. | `dark: skeleton-dark` |
| Completion transition | How loading resolves to loaded content. | `fade disabled under reduced motion` |

## Information Needed

- Source behavior or downstream need
- Existing token inventory
- Exact visual decision needed
- Expected consumers
- Supported themes
- Direction and magnification expectations
- Review evidence needed

## Things That Do Not Belong

Product-specific meaning, workflow state machines, component APIs, pattern layout, demo-only styling, app page CSS, one-off overrides.

## Behavior Rule Output Needed

Record the token ask as a later-layer dependency or next step. Name missing information as a blocker. Do not define token names, values, or usage rules inside the behavior rule.
