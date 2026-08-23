---
title: "You Cannot Polyfill `@property`"
description: "At 14:49 I shipped legacy browser support to three applications. At 15:57 I reverted it. In between, it broke every modern browser the staff were actually on, and it turned out it…"
date: "2026-08-12"
readTime: "7 min read"
tags: ["Post-Mortem", "Frontend", "Nuxt"]
status: "PUBLISHED"
featured: true
---

At 14:49 I shipped legacy browser support to three applications. At 15:57 I reverted it. In between, it broke every modern browser the staff were actually on, and it turned out it could never have fixed the old one it was written for.

Here is the mechanism, because it is a trap with a very convincing surface.

## The report

Staff on old point-of-sale terminals reported the interface rendering wrong. Those terminals were pinned to Chrome 109, a hard floor the frontend could not negotiate with. Transparent popovers you could read the table through. Washed-out cards. Dropdown items that did not visibly respond to hover or selection. Everything technically present, nothing usable.

## The fix that wasn't

The obvious move, and the one I made: add the legacy build plugins. I configured `@vitejs/plugin-legacy` and its Nuxt wrapper across all three applications, targeting Chrome 109 and Firefox 115. Then, because the reported symptoms were visual, I added a fallback stylesheet to the shared layer - about a hundred lines of hardcoded colour, z-index and opacity overrides, using `!important` to win against the component library's theme.

Fifteen minutes later I added a browser-support guard component that reads the user agent and blocks below a minimum version. That should have been the tell. I was writing a component to tell users their browser was unsupported _inside the change that was supposed to support it_.

Then I opened the app on my own machine. Washed-out cards. Dead hover states. The exact symptoms from the report, now on a current Chrome, on every machine, for every user.

## Why it was worse than a bad implementation

The regression was easy to explain: the fallback stylesheet was loaded by the **shared layer**, unconditionally, for every browser. A hundred lines of `!important` colour overrides do not politely stand aside for modern engines. I had reproduced the bug I was fixing, at three times the scale.

That part was a one-line revert. The part that mattered was the second finding, which I only got to because I went looking for why the _old_ browser was still broken in a test build.

**The legacy plugins transpile JavaScript. They do not touch CSS.**

That is the whole trap. `@vitejs/plugin-legacy` exists to produce a second bundle with older syntax and the polyfills to run it - arrow functions, optional chaining, `Promise`, `Array.prototype.at`. It is a JavaScript tool, and it is honest about being one. Nothing about it makes a CSS feature exist in a rendering engine that does not implement it.

And the actual problem was entirely CSS. The styling came from two places:

| Source                               | Modern CSS it depends on                                      | Fixable for Chrome 109?                         |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------- |
| The app's own utility CSS            | `oklch()` colours                                             | Partly - colours can be converted at build time |
| The component library's compiled CSS | `@property`, `color-mix()`, cascade layers, container queries | No                                              |

The utility framework major we were on emits `oklch()` for its entire default palette, so every colour utility degrades. There are community plugins that convert those to legacy colour functions, and they work - on _your_ CSS. They do not rewrite a dependency's already-compiled stylesheets.

And underneath that sits `@property`, which the component library uses internally for its theming. `@property` registers a custom property with a type, an initial value and inheritance behaviour, so that the engine can _interpolate_ it. That is not syntax a build step can rewrite into something older; it is a capability of the CSS engine's typed-value system. There is no PostCSS pass, no Lightning CSS target, no plugin that adds it to Chrome 109. Transparent popovers were not a bug. They were an engine correctly rendering a component whose theme resolved to nothing.

So "make the frontend support old browsers" was never a configuration change. It was a question about which UI stack the product runs on.

## The options, including the one I turned down

**A - Put a modern browser on the old machines.** Chromium forks exist that run current engines on older machines and backport security patches. Zero application changes; every component works; the stack stays current. It is also a straightforward security improvement. These are managed terminals, so installing a browser is a one-time operations task.

This was the cheapest option by a wide margin and I did not take it. The reason: it moves a permanent product constraint onto a third-party browser build that someone has to vet, pin, and re-vet, and it makes the application's supported-platform story depend on a piece of software with one maintainer. I kept it in the decision record as the fallback if the migration failed, which I think is the honest way to reject something you cannot fault on cost.

**B - Downgrade the component library to its last pre-modern-CSS major.** Chrome-109-safe, and it keeps the framework version. But it lands on a maintenance-only major where all active development has moved on, and it is not a version bump - the underlying primitives, the theming model and most component APIs all change. A full rewrite of the UI layer, paid for by every user, to reach a dead end. Rejected.

**C - Move to a component library that is currently maintained and does not require modern CSS.** Also a full rewrite of the UI layer, but it lands somewhere with a future.

I checked C's premise instead of assuming it. I ran the candidate's shipped stylesheets - all 123 of them, the actual published package, not the docs - for `@property`, `color-mix()` and `oklch()`. Zero occurrences. Then I audited every runtime dependency in the project against Chrome 109 and found exactly two blockers: the component library and the utility CSS framework's major version. Everything else stayed. One further candidate was eliminated in the same pass because its theme engine uses `color-mix()`.

C it was.

## What the shared layer did to the cost

This is where the monorepo I had built five weeks earlier paid for itself, and also where it concentrated the risk.

Because the shared components lived in one layer rather than in three repositories, the rewrite had one canonical target. I migrated the layer and **one** application end to end first - the smallest of the three - as a vertical slice, on a branch forked from the feature branch so it could be abandoned without touching anything else. If the pilot's output CSS still contained a single `oklch()` or `color-mix()`, the whole approach was wrong and I would have thrown away one app's worth of work instead of three.

It came out clean, and the pilot's screens all migrated. The scope of that one commit, honestly stated: about 33 shared components rewritten, roughly 1,300 utility class references updated, an icon component swapped across 57 files, framework-specific type imports removed from 70 more.

The cost I am least comfortable with came later. When I ported a full design system on top of the new library to get the visual result back, I removed the test and Storybook setup across every application and package in the same commit. The reasoning at the time was that the component tests asserted against the old library's DOM and were failing wholesale, and the migration was already large. It was still the wrong order: I deleted the thing that would have told me whether the migration was faithful, in the commit where faithfulness was the open question. Restoring it is the next piece of work.

## What I do differently

I now ask one question before any compatibility work: **is this a JavaScript problem or a CSS problem?** They have different tools and the tools do not overlap, but they are marketed with the same word - "legacy support" - and the JavaScript ones are far more prominent in search results. An hour of reverting taught me that faster than reading would have.

And when the answer is CSS, I check the dependency's _shipped_ stylesheets rather than its browser-support table. A library's stated support is a claim about its own code. What renders on a five-year-old engine is a property of the bytes in `dist`.
