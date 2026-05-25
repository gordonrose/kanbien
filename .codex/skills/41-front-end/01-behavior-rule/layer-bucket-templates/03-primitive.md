# Layer 3 Primitive Behavior Bucket

Use this bucket when the ask is for a reusable low-level UI building block.

## Recognition Test

The ask is smaller than a product workflow, reusable by more than one pattern, and would drift if consumers copied low-level markup, interaction, or accessibility behavior locally.

## Common Design-System Primitives

- Button
- Icon button
- Link
- Text input
- Text area
- Checkbox
- Radio
- Switch
- Select trigger
- Menu trigger
- Tooltip trigger
- Popover trigger
- Dialog shell
- Drawer shell
- Panel shell
- Card shell
- Field row
- Label
- Help text
- Error text
- Badge
- Tag or chip
- Avatar
- Icon
- Divider
- Progress indicator
- Spinner
- Skeleton placeholder
- Toast shell
- Table cell
- List item
- Tabs trigger
- Accordion trigger
- Breadcrumb item
- Pagination control

## Primitive Specification Attributes

Use these tables to identify the information a later Layer 3 primitive artifact
would need. Layer 1 may record which attributes are known or missing, but must
not invent primitive structure, component APIs, selectors, or implementation.

### Button

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The action role the button primitive supports. | `primary action trigger` |
| Allowed variants | Visual or semantic variants the primitive must support later. | `primary`, `secondary`, `destructive` |
| Required states | Interaction and lifecycle states the primitive must represent. | `default`, `hover`, `focus`, `disabled`, `loading` |
| Activation behavior | How the primitive is activated. | `click`, `Enter`, `Space` |
| Accessible name source | Where the accessible name comes from. | `visible label` |
| Token dependencies | Tokens the primitive likely consumes. | `control height`, `padding`, `focus ring` |

### Icon Button

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The compact icon-only action role. | `toolbar action` |
| Icon requirement | Whether the icon is decorative or meaningful. | `decorative icon with accessible label` |
| Accessible name source | Required source of the non-visual label. | `aria-label equivalent` |
| Required states | States the icon button must support. | `default`, `pressed`, `disabled`, `focus` |
| Target size | Minimum hit-area expectation. | `44px touch target` |
| Token dependencies | Tokens needed for size, focus, color, and spacing. | `icon-size`, `target-size`, `focus-ring` |

### Link

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The navigation or external reference role. | `inline navigation` |
| Destination behavior | Whether navigation is same-page, route, or external. | `same-origin route` |
| Required states | Link states that must be represented. | `default`, `visited`, `hover`, `focus`, `disabled-like unavailable` |
| Accessible name source | How the link is named. | `link text` |
| New-context rule | Whether opening a new context must be disclosed. | `external opens new tab with visible cue` |
| Token dependencies | Tokens for text color, underline, focus, and state styling. | `text-link`, `focus-ring` |

### Text Input

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The single-line text entry role. | `plain text field` |
| Value behavior | How entered value is represented. | `editable string` |
| Required states | Field states that must be supported. | `empty`, `filled`, `focused`, `disabled`, `read-only`, `error` |
| Label relationship | Required label and control association. | `visible label associated with input` |
| Error relationship | How error text is connected to the field. | `described by error text` |
| Token dependencies | Tokens for field surface, border, text, spacing, and focus. | `field-border`, `text-primary`, `focus-ring` |

### Text Area

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The multi-line text entry role. | `long-form text field` |
| Resize behavior | Whether and how resizing is allowed. | `vertical resize only` |
| Required states | Text area states that must be supported. | `empty`, `filled`, `focused`, `disabled`, `read-only`, `error` |
| Label relationship | Required label and control association. | `visible label associated with textarea` |
| Scroll behavior | How overflow text is handled. | `internal vertical scroll` |
| Token dependencies | Tokens for padding, line height, field border, and focus. | `field-padding`, `line-height-body`, `focus-ring` |

### Checkbox

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The binary or mixed selection role. | `select one option independently` |
| Checked states | Selection states the primitive must support. | `checked`, `unchecked`, `indeterminate` |
| Required states | Interaction states that must be represented. | `default`, `focus`, `disabled`, `error` |
| Label relationship | How the checkbox is named. | `visible label toggles input` |
| Keyboard behavior | Required keyboard interaction. | `Space toggles` |
| Token dependencies | Tokens for box size, check mark, focus, and state color. | `control-size`, `focus-ring`, `color-selected` |

### Radio

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The single-choice option role within a group. | `choose one billing cycle` |
| Group relationship | How individual radios relate to the group. | `shared group name and group label` |
| Required states | Radio states that must be supported. | `checked`, `unchecked`, `focus`, `disabled`, `error` |
| Keyboard behavior | Required group keyboard interaction. | `arrow keys move selection` |
| Label relationship | How each option is named. | `visible option label` |
| Token dependencies | Tokens for control size, selected mark, spacing, and focus. | `radio-size`, `focus-ring`, `option-gap` |

### Switch

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The immediate on/off setting role. | `enable notifications` |
| State meaning | What on and off mean in plain language. | `on means notifications enabled` |
| Required states | Switch states that must be supported. | `on`, `off`, `focus`, `disabled`, `loading` |
| Keyboard behavior | Required keyboard interaction. | `Space toggles` |
| Accessible state | How on/off state is exposed. | `checked state` |
| Token dependencies | Tokens for track, thumb, motion, focus, and target size. | `switch-track`, `motion-fast`, `focus-ring` |

### Select Trigger

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The control that opens a selection surface. | `choose current status` |
| Display value | How current selection is represented. | `selected option label` |
| Required states | Trigger states that must be supported. | `closed`, `open`, `empty`, `disabled`, `error` |
| Keyboard behavior | Required keyboard behavior before the menu/picker opens. | `Enter opens` |
| Popup relationship | How the trigger relates to its popup. | `controls listbox` |
| Token dependencies | Tokens for control height, padding, icon, border, and focus. | `control-height`, `chevron-size`, `focus-ring` |

### Menu Trigger

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The control that opens a command menu. | `row actions menu` |
| Menu relationship | How trigger and menu are associated. | `controls menu` |
| Required states | Trigger states that must be supported. | `closed`, `open`, `focus`, `disabled` |
| Keyboard behavior | Required keyboard behavior. | `Enter or Space opens menu` |
| Accessible name source | How the trigger is named. | `More actions for invoice` |
| Token dependencies | Tokens for icon size, target size, focus, and surface relation. | `icon-size`, `target-size`, `focus-ring` |

### Tooltip Trigger

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The element that reveals supplemental information. | `info icon trigger` |
| Trigger modalities | Inputs that may reveal the tooltip. | `hover`, `focus` |
| Required states | Trigger states that must be supported. | `hidden`, `visible`, `focus`, `disabled` |
| Description relationship | How tooltip content is connected. | `described by tooltip` |
| Dismissal behavior | How the tooltip hides. | `blur or Escape hides` |
| Token dependencies | Tokens for target size, focus, tooltip surface, and spacing. | `focus-ring`, `surface-tooltip`, `space-xs` |

### Popover Trigger

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The element that opens a richer floating surface. | `open filter options` |
| Popup relationship | How trigger and popover are associated. | `controls dialog-like popover` |
| Required states | Trigger states that must be supported. | `closed`, `open`, `focus`, `disabled` |
| Keyboard behavior | Required open and close interactions. | `Enter opens`, `Escape closes` |
| Focus behavior | Where focus moves when opened or closed. | `focus moves into popover, returns to trigger` |
| Token dependencies | Tokens for focus, target size, overlay layer, and surface. | `focus-ring`, `layer-popover`, `surface-popover` |

### Dialog Shell

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The modal shell for interruptive or focused tasks. | `confirmation dialog` |
| Modal behavior | Whether background content is inert. | `modal with inert background` |
| Required regions | Structural regions the shell must support. | `title`, `body`, `actions` |
| Focus behavior | Initial focus, trapping, and restoration requirements. | `trap focus and restore to opener` |
| Dismissal behavior | Approved close mechanisms. | `Escape`, `close button`, `cancel action` |
| Token dependencies | Tokens for overlay, surface, elevation, spacing, and radius. | `layer-modal`, `surface-dialog`, `shadow-lg` |

### Drawer Shell

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The slide-in panel shell role. | `side editing drawer` |
| Placement | Allowed drawer edge or placement. | `inline-end` |
| Required regions | Structural regions the shell must support. | `header`, `content`, `footer` |
| Focus behavior | Focus trapping and restoration requirements. | `trap focus while open` |
| Dismissal behavior | Approved close mechanisms. | `Escape`, `close button`, backdrop if approved` |
| Token dependencies | Tokens for width, overlay, surface, elevation, and motion. | `drawer-width`, `layer-drawer`, `motion-enter` |

### Panel Shell

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The non-modal content container role. | `details panel` |
| Required regions | Structural regions the shell may expose. | `header`, `body`, `actions` |
| Nesting rule | Whether panels may nest and how. | `no panel inside panel without pattern approval` |
| Overflow behavior | How content overflow is handled. | `body scrolls, header fixed` |
| Heading relationship | How the panel is named. | `visible heading` |
| Token dependencies | Tokens for surface, border, padding, and container size. | `surface-panel`, `border-subtle`, `space-md` |

### Card Shell

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The grouped content surface role. | `summary card` |
| Surface treatment | Background, border, and elevation expectations. | `surface-card with subtle border` |
| Required regions | Structural regions the shell may expose. | `media`, `header`, `body`, `footer` |
| Interaction posture | Whether the card itself may be interactive. | `non-interactive by default` |
| Nesting rule | Whether cards may appear inside other cards. | `no nested cards` |
| Token dependencies | Tokens for surface, radius, border, padding, and shadow. | `surface-card`, `radius-card`, `space-lg` |

### Field Row

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The layout relationship for a form control and its text. | `label plus input row` |
| Required parts | Parts the row must support. | `label`, `control`, `help`, `error` |
| Association rule | How text associates with the control. | `label references input` |
| State behavior | How row-level states are represented. | `error displays below control` |
| Layout behavior | Stacking or inline behavior at constrained widths. | `label stacks above control` |
| Token dependencies | Tokens for gap, label text, error text, and spacing. | `field-gap`, `text-label`, `text-error` |

### Label

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | The visible name for a control or field group. | `Email address` |
| Association rule | How the label attaches to the target control. | `for input id` |
| Required indicator | How required or optional state is communicated. | `Required text, not color alone` |
| Disabled behavior | How label changes when the control is disabled. | `uses disabled text token` |
| Wrapping behavior | How long labels wrap. | `wraps without overlapping control` |
| Token dependencies | Tokens for font size, weight, color, and spacing. | `text-label`, `font-weight-medium` |

### Help Text

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Supplemental guidance for a control or group. | `Must be at least 8 characters` |
| Association rule | How help text is connected to the target. | `described by field` |
| Visibility behavior | Whether help text is persistent or conditional. | `persistent below field` |
| Priority rule | How help text behaves when error text appears. | `error appears after help` |
| Wrapping behavior | How long help text wraps. | `wraps within field width` |
| Token dependencies | Tokens for text color, size, line height, and spacing. | `text-muted`, `text-sm`, `space-xs` |

### Error Text

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Text that identifies a validation or system error. | `Email is required` |
| Association rule | How error text is connected to the target. | `described by field` |
| Announcement behavior | Whether and how errors are announced. | `announced on validation failure` |
| Priority rule | How error text relates to help text and status text. | `error takes precedence` |
| Non-color rule | How error is communicated beyond color. | `text plus icon if used` |
| Token dependencies | Tokens for error text color, icon, spacing, and line height. | `text-error`, `error-icon-size` |

### Badge

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Compact status or categorization marker. | `Active` |
| Meaning type | Whether the badge is status, count, or category. | `status` |
| Required states | Badge states or meanings to represent. | `neutral`, `success`, `warning`, `error` |
| Accessible text | How meaning is exposed without color alone. | `Visible text names status` |
| Size behavior | Badge size and text wrapping constraints. | `single-line with max width` |
| Token dependencies | Tokens for background, text, border, radius, and padding. | `badge-success-bg`, `radius-pill` |

### Tag Or Chip

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Compact selected value, filter, or label. | `Selected tenant` |
| Interaction posture | Whether the chip is static, removable, or selectable. | `removable` |
| Required states | Chip states that must be supported. | `default`, `selected`, `disabled`, `focus` |
| Removal behavior | How removal is triggered if supported. | `remove button with accessible name` |
| Text overflow | How long chip labels behave. | `truncate with full label available` |
| Token dependencies | Tokens for gap, radius, background, text, and icon size. | `chip-bg`, `chip-gap`, `icon-size-xs` |

### Avatar

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Visual representation of a person, team, or account. | `user avatar` |
| Content source | Image, initials, icon, or fallback source. | `initials fallback` |
| Accessible posture | Whether the avatar is named or decorative. | `decorative when adjacent name exists` |
| Size variants | Required avatar sizes. | `sm`, `md`, `lg` |
| Fallback behavior | What appears when image fails or is absent. | `initials on neutral background` |
| Token dependencies | Tokens for size, radius, background, text, and border. | `avatar-size-md`, `radius-full` |

### Icon

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Symbolic visual element. | `warning icon` |
| Meaning posture | Whether the icon is decorative or semantic. | `semantic with accessible text elsewhere` |
| Size variants | Required icon sizes. | `16px`, `20px`, `24px` |
| Stroke or fill rule | Approved stroke width or fill style. | `1.75 stroke` |
| Color inheritance | Whether icon color inherits from text or uses state token. | `currentColor` |
| Token dependencies | Tokens for icon size, color, and state color. | `icon-size-md`, `text-muted` |

### Divider

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Visual separation between content groups. | `section divider` |
| Orientation | Horizontal or vertical divider direction. | `horizontal` |
| Semantic posture | Whether it is decorative or structural. | `decorative separator` |
| Thickness | Border-width or divider thickness. | `1px` |
| Spacing relationship | Space before and after divider. | `section-gap` |
| Token dependencies | Tokens for border color, width, and spacing. | `border-subtle`, `space-md` |

### Progress Indicator

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Progress feedback for a bounded process. | `upload progress` |
| Progress type | Determinate or indeterminate progress. | `determinate` |
| Value semantics | How current, min, and max values are exposed. | `value now 40 of 100` |
| Label relationship | How progress is named. | `Upload progress` |
| Completion behavior | What happens when progress completes. | `changes to success status` |
| Token dependencies | Tokens for track, fill, size, motion, and state color. | `progress-track`, `progress-fill` |

### Spinner

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Indeterminate loading indicator. | `loading search results` |
| Accessible label | How loading purpose is named. | `Loading results` |
| Motion behavior | Animation behavior and reduced-motion fallback. | `rotates unless reduced motion` |
| Size variants | Required spinner sizes. | `sm`, `md` |
| Delay rule | Whether spinner appears immediately or after delay. | `show after 300ms` |
| Token dependencies | Tokens for size, stroke, color, and motion duration. | `spinner-size-md`, `duration-slow` |

### Skeleton Placeholder

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Placeholder shape while content loads. | `text row skeleton` |
| Shape variants | Skeleton shapes supported. | `line`, `block`, `avatar` |
| Motion behavior | Shimmer, pulse, or static behavior. | `static under reduced motion` |
| Accessible posture | Whether skeleton is hidden from assistive tech. | `decorative; status text elsewhere` |
| Sizing relationship | How skeleton dimensions match expected content. | `matches text line height` |
| Token dependencies | Tokens for loading surface, radius, motion, and spacing. | `loading-skeleton-surface`, `radius-sm` |

### Toast Shell

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Temporary status message container. | `save confirmation toast` |
| Status type | Toast meaning or severity. | `success`, `error`, `info` |
| Region semantics | How toast is announced. | `status region` |
| Dismissal behavior | Whether and how it can be dismissed. | `dismiss button` |
| Duration rule | Auto-dismiss timing or persistence. | `error does not auto-dismiss` |
| Token dependencies | Tokens for surface, elevation, state color, spacing, and motion. | `surface-toast`, `layer-toast`, `motion-enter` |

### Table Cell

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Cell container for tabular data. | `numeric data cell` |
| Cell type | Header, data, row header, or action cell. | `column header` |
| Alignment rule | Text or content alignment. | `numeric aligns end` |
| Sort relationship | Whether header cell can expose sort state. | `aria-sort on sortable header` |
| Overflow behavior | How long content behaves. | `truncate with accessible full value` |
| Token dependencies | Tokens for padding, border, text, and row height. | `table-cell-padding`, `border-subtle` |

### List Item

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Reusable item row in a list or menu-like collection. | `record list item` |
| Selection posture | Static, selectable, active, or draggable posture. | `selectable` |
| Required states | Item states that must be supported. | `default`, `hover`, `focus`, `selected`, `disabled` |
| Content regions | Basic content slots the item may expose later. | `leading`, `label`, `metadata`, `trailing` |
| Keyboard behavior | Required keyboard interaction if selectable. | `Enter activates` |
| Token dependencies | Tokens for padding, gap, text, surface, and focus. | `list-item-gap`, `focus-ring` |

### Tabs Trigger

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Control that selects a tab panel. | `Settings tab` |
| Selection states | Tab trigger selection states. | `selected`, `unselected` |
| Group relationship | How triggers relate to tablist and panels. | `controls tabpanel` |
| Keyboard behavior | Required tablist keyboard interaction. | `arrow keys move focus` |
| Orientation | Supported tablist orientation. | `horizontal` |
| Token dependencies | Tokens for text, indicator, spacing, focus, and target size. | `tab-indicator`, `focus-ring` |

### Accordion Trigger

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Control that expands or collapses a section. | `Billing details trigger` |
| Expanded state | How open or closed state is represented. | `expanded`, `collapsed` |
| Panel relationship | How trigger and panel are associated. | `controls region` |
| Keyboard behavior | Required keyboard interaction. | `Enter or Space toggles` |
| Icon behavior | Whether a disclosure icon is present and decorative. | `chevron rotates when expanded` |
| Token dependencies | Tokens for spacing, icon size, focus, and border. | `accordion-gap`, `icon-size-sm`, `focus-ring` |

### Breadcrumb Item

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | One step in a breadcrumb trail. | `Settings` |
| Current-page behavior | How the current item is represented. | `aria-current page` |
| Link behavior | Whether the item is a link or current text. | `ancestor item is link` |
| Separator behavior | How separator is exposed. | `decorative slash hidden from assistive tech` |
| Truncation behavior | How long labels behave. | `middle truncate when constrained` |
| Token dependencies | Tokens for text, separator, gap, focus, and font size. | `breadcrumb-gap`, `text-muted` |

### Pagination Control

| Attribute Name | Attribute Description | Attribute Example |
| --- | --- | --- |
| Primitive role | Control for moving through pages of results. | `next page button` |
| Control type | Previous, next, page number, or overflow control. | `page number` |
| Current-page behavior | How current page is represented. | `aria-current page` |
| Disabled behavior | How unavailable navigation is represented. | `previous disabled on first page` |
| Keyboard behavior | Required activation behavior. | `Enter activates focused page` |
| Token dependencies | Tokens for target size, spacing, focus, text, and selected state. | `pagination-gap`, `target-size`, `focus-ring` |

## Information Needed

- Source behavior rule
- Primitive name
- User action or affordance
- Required states
- Accessibility responsibilities
- Existing primitive inventory
- Consumed tokens or token gaps
- Expected consumers

## Things That Do Not Belong

Product workflow, page layout, token values, pattern slots, component API beyond the public boundary, demo route behavior, canonical scenarios, app adoption.

## Behavior Rule Output Needed

Record the primitive ask as a later-layer dependency or next step. Name missing information as a blocker. Do not define primitive structure or implementation inside the behavior rule.
