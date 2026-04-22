#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"

if [[ -z "${repo_root}" ]]; then
  echo "Not inside a git worktree. Launching Codex without repo guardrails." >&2
  exec codex "$@"
fi

cd "${repo_root}"

if [[ ! -f "package.json" ]] || [[ ! -f "src/scripts/gitPreflight.ts" ]]; then
  echo "Repo guardrails not found in ${repo_root}. Launching Codex without repo preflight." >&2
  exec codex "$@"
fi

if ! npm run git:preflight; then
  echo >&2
  echo "Codex launch blocked by repo guardrails." >&2
  echo "Resolve the reported git/bootstrap issue first, or rerun intentionally if you know this repo state is owned by the current task." >&2
  exit 1
fi

real_codex_bin="${CODEX_REAL_BIN:-}"

if [[ -z "${real_codex_bin}" ]]; then
  current_script="$(readlink -f "$0")"
  while IFS= read -r candidate; do
    resolved_candidate="$(readlink -f "${candidate}")"
    if [[ "${resolved_candidate}" != "${current_script}" ]]; then
      real_codex_bin="${candidate}"
      break
    fi
  done < <(which -a codex 2>/dev/null || true)
fi

if [[ -z "${real_codex_bin}" ]]; then
  echo "Unable to locate the real Codex binary. Set CODEX_REAL_BIN before running this launcher." >&2
  exit 1
fi

exec "${real_codex_bin}" "$@"
