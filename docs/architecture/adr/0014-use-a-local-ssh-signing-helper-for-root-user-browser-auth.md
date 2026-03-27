# ADR 0014: Use A Local SSH Signing Helper For Root-User Browser Auth

## Status

Accepted

## Context

The platform’s root-user auth model already requires:

- password verification
- SSH proof
- server-backed sessions

Once a browser root-admin shell was introduced, the browser needed a way to
complete the SSH proof step without weakening that model.

A normal browser page cannot directly use a local SSH private key from the
workstation. The platform therefore needed a deliberate browser-to-local-key
bridge.

## Decision

Use a localhost signing helper for root-user browser auth with these rules:

- helper exists only for root-user login signing
- helper transport is localhost HTTP only
- helper accepts requests from one trusted admin origin in phase one
- helper validates root-login challenge structure before signing
- helper signs only valid root-login challenges for this platform
- helper delegates signing to workstation OpenSSH tooling instead of depending
  on direct private-key parsing inside app-managed crypto libraries
- browser selects the fingerprint from the root user’s stored active SSH keys
- helper signs with the matching local key only
- helper is installed manually
- install/reinstall guidance is exposed from the browser login flow
- no per-login user approval is required in phase one
- browser login uses a secure HTTP-only cookie after successful SSH completion
- browser sessions do not use silent recovery in phase one
- browser sessions use:
  - 30 minute idle timeout
  - 12 hour absolute maximum lifetime
  - sliding extension on valid authenticated activity

## Consequences

### Positive

- root-user browser auth preserves the existing password-plus-SSH trust model
- SSH private keys do not move into browser-managed storage
- the helper remains intentionally narrow rather than becoming a general
  signing service
- the signing path now aligns better with how operator workstations normally
  manage SSH keys and avoids runtime-specific key-format fragility
- browser login can use cookie transport instead of exposing raw bearer tokens
  to the SPA

### Negative

- workstation setup becomes part of root-user browser adoption
- helper availability is now part of the login success path
- the platform now depends on workstation OpenSSH tooling being available for
  the browser-auth helper path
- phase-one helper trust is intentionally simplified and may need tightening
  later
- removing per-login approval favors operator convenience over an additional
  runtime confirmation step

### Follow-Up

- helper trust partitioning by environment may be revisited later
- if the local Node-based shim remains a friction point, replace it with a more
  productized packaged helper without changing the browser/backend auth
  contract
- tenant-admin browser auth remains a separate future decision and does not
  inherit this localhost helper model automatically
- if workstation or browser threat assumptions change, helper approval and
  trust rules should be revisited with a new ADR
