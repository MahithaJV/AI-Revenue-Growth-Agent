---
name: OpenAPI integer compatibility
description: A workspace generator/runtime mismatch affects integer schemas in generated Zod validators.
---

When the current Orval output targets `zod.int()` but the workspace resolves Zod 3, model integer-like API fields as numeric values with `multipleOf: 1` in OpenAPI until the generator/runtime are upgraded together.

**Why:** Code generation can succeed while the chained library typecheck fails because Zod 3 does not expose `z.int()`.

**How to apply:** Check the installed Zod major version before adding integer schemas to a new OpenAPI contract; prefer the compatibility shape above for this workspace.