---
title: "Replacing Hosted Authentication Without Replacing It With Wishful Thinking"
description: "Removing an authentication SDK is easy. Replacing the system behind it is not. The old integration touched login pages, backend middleware, user administration, password reset,…"
date: "2026-08-14"
readTime: "9 min read"
tags: ["Go", "Nuxt", "Authentication", "Security"]
status: "PUBLISHED"
featured: true
---

Removing an authentication SDK is easy. Replacing the system behind it is not.

The old integration touched login pages, backend middleware, user administration, password reset, token refresh, exports, and several applications built with different frontend frameworks. Some backend code depended on the old provider only for a token type; other paths made real provider calls. Treating every reference as equivalent would have produced either an incomplete migration or a risky rewrite.

The replacement used a Go service for credentials and sessions and a Nuxt application for the login and administration experience. It was a hard cutover to per-application sessions, not a new single sign-on system. That distinction drove the cookie model and kept the scope understandable.

This is the migration I wish I had been able to read before starting.

## First, write the session contract

Before implementing a resolver or a form, I wrote down the credential model.

```text
browser
  -> application login route
  -> authentication service
  -> host-only session cookie + host-only refresh cookie
  -> application backend validates session against shared auth tables
```

The access credential was an opaque session identifier. Backends validated it with a direct database query. The refresh credential was random, stored only as a SHA-256 hash, and rotated on every successful refresh.

Cookies were:

- `HttpOnly`, so application JavaScript could not read them;
- `Secure` in deployed environments;
- `SameSite=Lax`;
- `Path=/`;
- host-only, with no `Domain` attribute.

Host-only cookies were deliberate. A session issued while using `cashier.example.test` should not automatically authenticate `inventory.example.test`. The session row also carried a client type, so isolation did not depend only on browser behavior.

That is not SSO. Users may authenticate separately to separate applications. The trade-off is a smaller cross-application blast radius and a simpler first migration.

## Password migration begins with what can actually be exported

The hosted system could not provide everything needed for a transparent password migration. That fact mattered more than the ideal architecture.

If legacy password verifiers are unavailable, there are only a few honest options:

- force every user through password reset;
- temporarily verify against the old provider and rehash after a successful login;
- migrate a verified subset through a controlled operational process;
- run a staged combination of those approaches.

I did not invent an “adaptive legacy hash upgrade” when the source hashes were not available. The migration created internal identity rows, generated replacement hashes for an approved subset, and kept a forced-change flag for accounts that still required a new password.

The new services shared one password scheme:

```text
normalized = HMAC-SHA256(password, server-side pepper)
stored     = bcrypt(hex(normalized))
```

The pepper came from the secret manager and had to be identical in the services that created and verified passwords. A mismatch looks exactly like every password being wrong, which makes deployment ordering and secret verification part of the authentication design.

Passwords were never logged. The refresh token was never stored in plaintext. Session revocation did not require changing a signing key or waiting for a long-lived token to expire.

## Stateful sessions were a conscious choice

Stateless JWTs are useful, but they were not automatically the best fit.

The requirements included per-application isolation, immediate revocation, session listings, filtered administrative revocation, and an audit trail. A stateful session table made those behaviors direct.

A simplified model:

```sql
auth_sessions
  id
  user_id
  client_type
  expires_at
  revoked_at
  created_at

auth_refresh_tokens
  id
  session_id
  token_hash
  expires_at
  rotated_at

auth_audit_log
  event
  actor_user_id
  subject_user_id
  client_type
  occurred_at
```

Every application backend already depended on the primary database, so a session lookup did not add a new network service hop. That does not make it free. It adds queries and couples authentication availability to the database. Connection-pool sizing, indexes, expiration cleanup, and query timeouts therefore became part of the security path.

The important claim is not “stateful is better.” It is that the model matched the revocation and observability requirements of this system.

## Refresh rotation needs replay handling

A refresh operation did more than issue another access credential.

1. Read the refresh cookie.
2. Hash the presented value.
3. Find an active, unexpired token row.
4. Lock or atomically consume that row.
5. Create a replacement token and hash.
6. Mark the old token as rotated.
7. Extend or replace the application session according to policy.
8. Set both cookies in the response.

If the old token appears again, the service treats it as a possible replay. Depending on risk tolerance, it can revoke the token family or the entire session.

The frontend retried an application request once after a `401`. The retry logic lived in the GraphQL network layer because it had to operate before a component-level hook existed.

```ts
async function fetchWithRefresh(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const first = await fetch(input, { ...init, credentials: "include" })
  if (first.status !== 401) return first

  const refreshed = await refreshSession()
  if (!refreshed) return first

  return fetch(input, { ...init, credentials: "include" })
}
```

This is example code. A production implementation must prevent several simultaneous failed requests from starting several rotations. A shared in-flight promise or small single-flight utility makes callers wait for one refresh attempt.

One retry was the limit. Repeated refresh loops hide real authorization failures and can hammer the auth service.

## Compatibility reduced the size of the backend rewrite

Several Go backends expected an identity object in request context. Resolvers read a user ID and claims from that object but did not care how it had been verified.

The new middleware validated the session, loaded the internal identity, and created a small compatibility value with the fields existing resolvers needed.

```go
type Identity struct {
    UserID string
    Claims map[string]any
}
```

The real code used concrete types at boundaries; the generic map above is only a conceptual sketch. In the migration itself, replacing the provider-specific type with a local identity type was preferable wherever feasible.

Compatibility names were temporarily retained in a few call sites to keep the vertical slice small. That was technical debt with a removal path, not proof that the old provider was still active. Searches distinguished:

- package imports;
- client initialization;
- remote verification calls;
- environment variables and credential mounts;
- database columns retained for historical linkage;
- compatibility function names.

A final “no old provider” check that merely greps a word can report false positives. The audit needs categories.

## Route GraphQL operations intentionally

The frontend talked to its application API, the user-management API, and the new session API. Generated GraphQL operation names had stable prefixes, so one client could route an operation to the correct endpoint.

```text
session_*     -> authentication service
identity_*    -> user-management service
everything   -> current application service
```

Cookies required `credentials: include`. Reverse-proxy routes kept browser requests on the application's host, preserving host-only cookie behavior without exposing internal services directly.

Generated operation documents were used for application queries and mutations. Raw `fetch` remained appropriate inside the network-level refresh handler because component hooks cannot run while the client is being constructed. Raw strings in logout components, however, were replaced by generated mutations.

That distinction prevented a style rule from damaging the architecture.

## Authorization belongs on the server

The administrative Nuxt application included user access, session management, audit views, and role-assignment scope.

Navigation hiding improved usability but was not an authorization boundary. The backend checked whether an actor could create or assign the requested role. Administrator assignment was excluded from the ordinary UI path. Non-administrators could inspect and revoke only their own sessions.

A subtle policy needed explicit documentation: if the role-scope table used “no rows means unrestricted,” then granting a user-management menu to a role without adding scope rows could grant more authority than intended. Defaults like that deserve a deployment checklist and a server-side test.

The tests covered:

- a role may assign an allowed role;
- it may not assign an out-of-scope role;
- administrator cannot be assigned through the normal flow;
- an ordinary user sees only their sessions;
- an administrator can query broader session data;
- a session from one client type fails in another application;
- rotation invalidates the old refresh token;
- logout revokes the session and clears both cookies.

## Roll out vertically, then repeat

I migrated one application end to end before touching the rest:

```text
database schema
  -> auth service
  -> one backend middleware
  -> one frontend login/refresh/logout flow
  -> reverse-proxy route
  -> staging smoke test
```

That slice exposed cookie, proxy, CORS, GraphQL routing, and forced-password-change problems while the blast radius was still small.

The later rollout followed an order:

1. apply compatible database migrations;
2. create environment secrets and verify the shared pepper;
3. deploy user-management changes that can write the new credential format;
4. deploy the session service;
5. deploy one application backend;
6. deploy its frontend;
7. verify login, protected query, refresh, logout, revocation, and cross-app isolation;
8. repeat for the next application;
9. remove old credentials and provider initialization only after searches and smoke tests are clean.

Database rollback was planned separately from application rollback. A previous container image cannot undo a migrated password or restore a revoked session.

## What “finished” meant

The migration was not finished when the new login screen rendered. It was finished when:

- no runtime path initialized or called the hosted authentication SDK;
- new passwords used the agreed scheme;
- session and refresh cookies had the intended attributes;
- refresh rotation and replay behavior were tested;
- application isolation worked in both browser and backend checks;
- user-management authorization was server-enforced;
- old credential mounts and deployment steps were gone;
- operators had a staged rollout and recovery document.

Owning authentication did not eliminate dependency. It moved dependency onto our database, secret management, code review, and operations. That is a serious trade.

The reason to make it was control: revocable sessions, per-application boundaries, observable security events, and identity data that stayed inside the platform. The reason it worked was restraint. I replaced one well-defined contract at a time instead of announcing a new identity platform and hoping the details would follow.
