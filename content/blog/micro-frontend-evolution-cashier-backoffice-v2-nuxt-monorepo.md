---
title: "From Copy-Pasted Frontends to One Shared Nuxt Layer"
description: "Why I extracted a cashier application, rebuilt an operations portal, and eventually combined three Nuxt frontends around a shared layer without erasing their domain boundaries."
date: "2026-08-03"
readTime: "8 min read"
tags: ["Architecture","Monorepo","Nuxt","Frontend"]
status: "PUBLISHED"
featured: true
---

The monorepo was not the starting idea. It was the answer to a maintenance problem I had already experienced three times.

First, a cashier module lived inside a larger inventory frontend. I separated it so checkout work could be released and reasoned about independently. Then I rebuilt an aging operations portal with Nuxt and aligned its foundation with the newer authentication and cashier applications. At that point, the three repositories shared enough UI, session behavior, utilities, and configuration that “keeping them aligned” became a recurring task of copying code and comparing diffs.

The monorepo came last.

That sequence matters because repository consolidation is not automatically architecture. Without proven boundaries, it can turn several understandable applications into one directory tree with invisible coupling.

## Phase one: extract the domain that needs its own release cycle

Cashier screens had different operational needs from inventory administration:

- touch-friendly controls;
- fast scanning and search loops;
- clear transaction state;
- guarded submission;
- receipt and recovery flows;
- a release schedule sensitive to store operations.

Keeping the module inside inventory reduced initial setup, but the shared deployment boundary became a liability. An inventory change could force a cashier release. Shared route and state assumptions made focused testing difficult.

The extraction began with a flow map rather than components:

```text
authenticate
  -> open duty/session
  -> identify customer when required
  -> search or scan item
  -> build cart
  -> validate payment
  -> submit once
  -> show receipt
  -> reset to a known state
```

This map identified the pieces that were domain-specific. Cart rules, duty state, payment validation, and receipt behavior belonged to the cashier application. Buttons, dialogs, notifications, API error formatting, and session refresh were candidates for a shared foundation later.

The new application adopted the same visual language as the authentication frontend: strong contrast, restrained color, consistent spacing, and explicit interactive states. Matching a theme did not mean copying entire pages. It meant agreeing on tokens and primitives.

## Phase two: rebuild the operations frontend deliberately

The older operations portal had accumulated framework-specific patterns, inconsistent state ownership, and duplicated request logic. I rebuilt it with Nuxt 4, Vue 3, Nuxt UI, Pinia, and generated GraphQL operations.

This was not a line-by-line port. I separated concerns:

- pages coordinate route-level data and permissions;
- feature components own domain presentation;
- form components accept typed values and emit typed intent;
- composables own reusable async behavior;
- stores hold cross-route state, not every temporary field;
- generated GraphQL types define API boundaries;
- utilities remain pure and easy to test.

A component that fetched data, transformed it, validated a form, opened four dialogs, and rendered a large table was split along those boundaries. The goal was not tiny files. The goal was for each piece to have one reason to change.

Nuxt lifecycle and hydration rules affected the design. Browser-only APIs stayed behind client boundaries. Initial server-rendered values were deterministic. Data needed by the first render used Nuxt-aware fetching instead of an `onMounted` request that produced a blank shell and duplicated work after hydration.

I did not claim a performance percentage without a controlled before-and-after measurement. The verifiable improvements were architectural: fewer hydration hazards, typed operations, reusable loading and error states, and a build pipeline that checked each application consistently.

## The copying problem

After the rebuild, three frontends contained versions of the same foundation:

- application shell and user menu;
- session state and refresh behavior;
- permission helpers;
- notification and confirmation patterns;
- form controls;
- date, currency, and API error formatting;
- Nuxt UI configuration;
- icon behavior;
- lint, formatting, and type-check conventions.

At first, copying seemed safer than introducing a package. It avoided coordination and kept repositories independent. Over time, it created a different coordination tax.

A bug fixed in the session-refresh path had to be found and patched in several places. A component prop evolved in one application but not another. Framework upgrades required several pull requests that had to land in a compatible order. Visual consistency became a memory exercise.

The repeated work was evidence that the foundation had stabilized enough to share.

## Why a Nuxt layer

The shared code was mostly Nuxt-shaped: components, composables, plugins, utilities, styles, and configuration. A native Nuxt layer fit better than publishing a collection of small libraries.

The resulting shape was:

```text
apps/
  auth/
  cashier/
  operations/

packages/
  base/
    app/
      components/
      composables/
      utils/
      assets/
    nuxt.config.ts
```

Each application extended the base layer. Nuxt merged the expected directories and auto-imported shared pieces. Domain code remained inside the application that owned it.

The boundary rule was practical:

> A feature moves into the base layer only when at least two applications need the same behavior and the API can be named without domain vocabulary.

A generic confirmation dialog belongs in the layer. A cashier payment confirmation does not. A generic authenticated user menu may belong there. A role-assignment table with operations-specific rules stays in its application.

This rule prevented `base` from becoming a dumping ground.

## Typed contracts instead of convenient ambiguity

The shared layer increased the blast radius of a bad type. I avoided `any` in application code and used generated GraphQL types at network boundaries.

For shared components, props and emits described intent:

```ts
type ConfirmIntent = {
  title: string;
  body: string;
  confirmLabel: string;
  tone: "neutral" | "danger";
};

const props = defineProps<{
  open: boolean;
  intent: ConfirmIntent;
  pending?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
```

The example contains no project-specific code. It shows why explicit shared contracts age better than a component that accepts an arbitrary object and reaches into unknown fields.

Runtime validation still mattered for untrusted input. Zod schemas belonged near forms or boundary adapters. TypeScript cannot validate a value arriving from local storage, a URL, or an API response at runtime.

## Shared configuration has hidden runtime consequences

Centralizing configuration fixed several differences, but it also made one mistake capable of affecting every application.

Icons were a good example. Relying on a public icon API at runtime created an external request on first render and a new availability dependency. The shared layer configured local build-time icon data and a same-origin fallback. One tested fix then applied to all three applications.

The same care applied to:

- public runtime configuration;
- plugin registration;
- color-mode defaults;
- GraphQL client behavior;
- route middleware;
- CSS ordering;
- SSR flags.

I kept application secrets out of the layer. Shared configuration defined keys and behavior; each application and environment supplied its own values.

## Monorepo does not mean deploy everything

The workspace used Bun workspaces and Turborepo to coordinate tasks. Applications still produced separate deployable artifacts.

```text
change in packages/base
  -> validate base
  -> validate all consuming applications

change in apps/cashier only
  -> validate shared dependencies
  -> validate cashier
  -> build cashier artifact
```

The CI graph followed dependency relationships rather than treating the repository as one giant application. A base-layer change had a wider verification requirement because it had a wider blast radius.

Each app kept its own:

- runtime configuration;
- routes;
- domain stores and composables;
- GraphQL operations;
- deployment image;
- smoke checks.

The repository was shared. Runtime failure domains were not.

## Migration order

I moved the frontends into the workspace in small steps.

1. Establish the workspace and task runner.
2. Add the base layer with the smallest proven shared primitives.
3. Move one application and make its existing checks pass.
4. Move the second application and replace duplicate primitives only where contracts truly match.
5. Move the third application.
6. run root-level formatting, linting, strict type checks, unit tests, and production builds.
7. deploy one application at a time through staging.

Temporary adapters were acceptable. A big-bang rewrite of every import and component would have made regressions hard to locate.

Tests focused on shared behavior with high fan-out: auth-state transitions, route authorization, error normalization, validation schemas, and components whose selected state affected navigation. Feature tests remained in their applications.

## What improved, and what became harder

The monorepo made a shared fix genuinely shared. Framework and UI dependencies could be upgraded in one coordinated change. A developer could update a base component and immediately run all consumers.

It also raised the standard for base-layer changes. A casual edit could break three applications. Root checks took longer. Ownership needed to remain clear, especially when a generic-looking component contained assumptions from the first domain that created it.

The useful outcome was not “one repository.” It was one maintained foundation with three explicit applications.

The extraction, rebuild, and consolidation were not contradictory moves. The first separated a domain boundary. The second modernized an application. The third shared the parts that had proven they were not domain boundaries at all.

That order kept the monorepo from becoming the architecture. The architecture remained in the contracts.