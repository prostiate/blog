---
title: Lessons Learned from 13 Rounds of Production Iterations: Mistakes, Hotfixes, and Architectural Evolution
description: A transparent post-mortem of real production mistakes, auth traps, edge-case hotfixes, and performance balancing across 13 iterative rounds of engineering.
date: 2026-07-23
readTime: 4 min read
tags: ["Architecture","PostgreSQL","Cloudflare","Security"]
status: PUBLISHED
featured: true
---

Shipping software in a single sprint sounds heroic, but production realities always hit differently. Over 13 iterative release rounds of building and hardening **Onoapp**, we encountered subtler edge cases that no tutorial prepares you for.

Here is an honest breakdown of the mistakes we made, the hotfixes we deployed, and how our architecture evolved.

---

### Mistake 1: Treating Worker Rollbacks as Database Migrations

In Round 7, we pushed a database schema change to Neon Postgres alongside a new API Worker release. When a subtle UI bug appeared in the frontend, our instinct was to immediately run `wrangler rollback` to restore the previous Worker version.

**The Trap**: Rolling back a Cloudflare Worker does **not** roll back your database schema! The older Worker code immediately crashed because it expected columns that had been renamed or altered in Neon.

**The Fix**: We separated schema pushes from code releases:

- Schema changes must always be **backward compatible** (e.g. adding columns with default values, never dropping columns until code is decoupled).
- We automated migration dry-runs in staging before running `db:push:production`.

---

### Mistake 2: Auth Provider Drift & Allowlist Race Conditions

During Round 9, we migrated auth from custom magic-link tokens to Google Sign-In via Firebase Auth. We had an administrative allowlist table for superadmins.

When a superadmin signed in with Google, their Firebase email was `User.Email@gmail.com` (with capital letters), but our database allowlist stored lowercased `user.email@gmail.com`. Because case-sensitivity mismatch bypassed the SQL lookup, superadmins were temporarily demoted to regular users!

```ts
// The Bug
const [allow] = await sql`SELECT active FROM superadmin_allowlist WHERE email = ${email}`;

// The Fix: Always normalize emails before querying or inserting
const normalizedEmail = email.trim().toLowerCase();
const [allow] = await sql`SELECT active FROM superadmin_allowlist WHERE email = ${normalizedEmail}`;
```

---

### Mistake 3: WebSocket Disconnect Storms and Backpressure

In early rounds, when a user lost mobile internet connection or switched tabs, their WebSocket connection dropped without sending a clean close frame. The Durable Object room coordinator kept stale socket references in memory and attempted to broadcast messages to dead connections.

Under high broadcast rates, write queues backed up, causing memory consumption to spike inside the DO isolate.

**The Fix**:

1. Implemented heartbeats (ping/pong) every 30 seconds.
2. Handled socket errors gracefully by removing dead sockets immediately during broadcast iterations:

```ts
for (const socket of Array.from(this.sockets)) {
  try {
    socket.send(payload);
  } catch (err) {
    // Dead connection detected - clean up instantly
    this.sockets.delete(socket);
    try {
      socket.close(1011, "Connection lost");
    } catch {}
  }
}
```

---

### Security vs. Performance: Edge Rate-Limiting

Defending public APIs against automated abuse without harming user experience requires delicate tuning:

- **Auth Endpoints**: Strictly capped at 5 requests per minute per IP using Cloudflare Rate Limiting bindings (`AUTH_RATE_LIMITER`).
- **Message Creation**: Allowed up to 30 messages per minute per active session.
- **Turnstile Captcha**: Enforced on public user lookup and contact forms to block bot scraping without imposing friction on authenticated room chats.

```ts
// Cloudflare Rate Limiter check inside Hono middleware
const { success } = await c.env.AUTH_RATE_LIMITER.limit({ key: clientIp });
if (!success) {
  return c.json({ error: "Too many requests. Please slow down." }, 429);
}
```

---

### Next Improvements Roadmap

Looking ahead, our next architectural milestones include:

1. **End-to-End Encryption (E2EE)**: Moving payload encryption into the client browser using Web Crypto API (`SubtleCrypto`), ensuring message bodies are encrypted before hitting Durable Objects.
2. **Read Receipt Optimizations**: Batching unread state updates on client idle rather than sending immediate database mutations per message.
3. **Web Push Notification Reliability**: Integrating VAPID push subscriptions directly into Durable Object alarm triggers for offline user notifications.

---

### Summary Checklist for Engineering Resilience

- **Schema Safety**: Never pair non-additive schema changes with worker deployments.
- **Normalize Inputs**: Always sanitize and lowercase user identifiers like emails.
- **Prune Stale Connections**: Handle WebSocket dead sockets aggressively to prevent backpressure memory leaks.
- **Rate Limit at Edge**: Enforce rate limits at Cloudflare's network edge before hits reach your database.