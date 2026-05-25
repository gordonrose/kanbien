# Bad Pattern Contract Later-Layer Output

This is bad because it defines the pattern contract inside the behavior rule.

> The pattern has a left slot for filters, a right slot for results, and the consumer may pass `onFilterChange(filters)`.

Problems:

- Defines slots before Layer 4.
- Defines an event API before component seam work.
- Moves composition details into Layer 1.
