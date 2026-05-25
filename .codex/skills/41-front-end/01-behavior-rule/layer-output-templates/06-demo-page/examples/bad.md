# Bad Demo Page Later-Layer Output

This is bad because it treats a demo route as source truth.

> Build `/design-system/filter-panel-demo` with local markup and use that route as the contract for app pages.

Problems:

- Creates demo route behavior before Layer 6.
- Lets app pages copy demo markup.
- Skips component seam ownership.
