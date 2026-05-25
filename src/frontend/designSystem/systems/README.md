# Design-System Systems

`systems/<system-key>/` contains implementation-specific files for one
selectable design system.

For example, `systems/default/` owns the `default` design system's assets,
manifest, proof route support, and rendered review surfaces.

Governed later layers should not import directly from `systems/<system-key>/`
when a numbered layer seam exists.

Use:

```text
src/frontend/designSystem/layers/
```

as the governed runtime import area.

Use:

```text
src/frontend/designSystem/systems/<system-key>/
```

for system-specific assets, manifests, proof data, and rendered
design-system review surfaces.
