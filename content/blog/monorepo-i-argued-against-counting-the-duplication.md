---
title: "I Spent a Day Building a Monorepo I'd Argued Against"
description: "Two commits, in two different Git repositories, twenty seconds apart. The subject lines were identical  -  both said I had aligned that application's shared base components against…"
date: "2026-08-09"
readTime: "8 min read"
tags: ["Monorepo","Architecture","Frontend","Nuxt"]
status: "PUBLISHED"
featured: true
---

Two commits, in two different Git repositories, twenty seconds apart. The subject lines were identical  -  both said I had aligned that application's shared base components against a reference implementation, in three rounds  -  because it was the same work. I had ported the same set of table, modal and form components into two applications by hand, one after the other, and verified each one separately: format, lint, typecheck, strict type pass, build. Twice, in one sitting.

Three days later I started merging the repositories.

I had been against that. Three applications, three repositories, three deploy pipelines: each one small enough to hold in your head, each one deployable without thinking about the others. The failure mode of a shared frontend package  -  one change, three applications broken  -  was a cost I could describe from experience. The failure mode of copying code between repositories was one I kept describing as "a bit of duplication".

It was not a bit.

## What I measured before deciding

The three applications were internal tools at a previous employer: an administrative console, an authentication and access console, and a point-of-sale application used by staff. All three were Nuxt 4, all three built by the same person, and all three had grown the same furniture  -  a data table, a confirmation dialog, a CRUD modal, a CSV importer, a date-range picker, a phone-number field, a set of formatting and validation helpers.

Before arguing for anything, I counted. Across the three applications there were roughly 700 tracked files. Ninety-six of those file paths existed in all three applications at the same relative path. Of those 96, **41 were byte-identical everywhere**. The remaining 55 had drifted into two or three versions.

The drift is the part that changed my mind, because of what caused it. I expected to find real divergence  -  one app needing a column the others did not, a genuinely different validation rule. Nine of the shared components differed **only in their default label strings**: the administrative console had been standardised on English, the other two still had Indonesian defaults. One differed only in a comment. The date-range picker was the one honest case: the console's version was a strict superset, because that is where the feature had been needed first.

So of the 96 shared-path files, the number that had drifted for a defensible engineering reason was close to one.

That reframes the whole argument. I had been defending the isolation of three copies. What I actually had was one component library, stored three times, drifting on cosmetics, and paid for twice on every change.

## What I chose, and the two things I rejected

**Rejected: publish the shared code as an internal npm package.** It is the conventional answer and it has a property I dislike  -  every change becomes publish, bump, install, in three places, and the version skew that follows is exactly the drift I was trying to kill, only now with version numbers on it. It also breaks auto-import: every shared component would need an explicit import line in every consuming file.

**Rejected: keep the repositories and enforce sync with tooling**  -  a bot that opens the same PR three times, or a script that copies files. This preserves the pretend independence while adding a machine to maintain the pretence. Three verification runs remain three verification runs.

**Chosen: one repository, one lockfile, and the shared code as a framework layer.** Concretely: a workspace-aware package manager to link the packages, a Nuxt layer that each app `extends`, and Turborepo on top as the task runner.

The split between those three is worth being precise about, because it is the thing most "we moved to a monorepo" posts blur:

- The **workspace** (bun workspaces, but npm/pnpm/yarn workspaces do the same job) is what actually shares code. One install, one lockfile, `apps/*` linked to `packages/*`.
- **Turborepo** is a task runner sitting on top. It runs build, lint, typecheck and codegen across packages in dependency order, in parallel, with caching. It is not a package manager and it cannot share anything on its own  -  it needs the workspace underneath.
- The **Nuxt layer** is what preserves the ergonomics. A layer is a directory shaped like an app that another app extends. Shared components stay auto-imported exactly as they were, there is no build step for the shared package, and an application can override any shared file by defining a file with the same name locally.

That last property is what made the drift reconciliation tolerable. I did not need every app to agree on every component before I could start; I needed a default and an escape hatch.

```
apps/
  console/        extends ../../packages/base
  auth/           extends ../../packages/base
  pos/            extends ../../packages/base
packages/
  base/           app/components, app/composables, app/utils
```

## Phase 1 had to be worth doing on its own

The rule I set for myself before starting was that if phase 2 stalled on drift reconciliation, phase 1 had to still be fully usable on its own  -  the applications would simply keep their own copies until someone reconciled them. That one constraint is what made the work startable.

Phase 1 was: create the workspace, import all three applications **completely unchanged**, add the task runner, confirm all three still build and typecheck exactly as before. Zero shared code. That commit is worth something on its own  -  one clone, one install, one command to check everything  -  and it cannot fail in an interesting way, because nothing has moved.

Phase 2 was the extraction, done in slices, lowest-risk first: utilities, then composables, then components. Each slice was a commit, and each commit had to leave all three applications typechecking before I moved on. Phase 3 was the build and CI rework.

The reason to structure it that way is not tidiness. It is that a migration you can stop halfway through is a migration you are allowed to start on a Wednesday.

The slice order paid off exactly where I expected. The 16 byte-identical components moved in one commit and needed no thought. The 9 label-drift components moved in the next one, standardised on the console's English defaults. The date-range picker got its own commit because it was the only genuine superset and I wanted it bisectable.

When phase 2 finished, the diff against the import commit read: **143 files changed, 57 insertions, about 3,500 deletions.** Sixty deleted lines for every line added. That is what the duplication had actually weighed.

## What broke

I planned four to six focused days. All three phases landed inside one, and the old repositories were retired about twenty-four hours after the first commit in the new one. I do not entirely trust that as a signal, and it broke in two ways worth naming.

**The typecheck gate was not the gate.** Application files imported the shared modules by their old app-relative paths  -  `~/utils/format`, `~/composables/useAuthState`. Once those modules lived in the layer, the paths resolved to the _consuming application_, where the files no longer existed. The dev server crashed on the first request. The strict type pass had been green the whole time, because the framework's generated tsconfig carries fallback paths that made the stale specifiers resolve for the type checker and not for the bundler.

The fix rewrote layer-module imports across 155 application files to the framework's auto-import aggregator, and kept relative paths for the layer's own internal cross-references. The lesson I actually took is narrower than "add more checks": **for a code-motion change in a bundled framework app, the build is the gate and the type checker is an opinion.** I now run the build, not the typecheck, as the per-slice guardrail.

**Blast radius is real and I have not solved it.** One bad commit in the shared layer breaks three applications at once. Running build and typecheck for all three on every shared change is a mitigation, not a fix. It is the cost I accepted, and it is the cost I would raise first if someone asked me whether to do this with three teams instead of one person.

There was also a smaller, more embarrassing one. Phase 3 carefully updated every CI script, including the Kubernetes ones, and I deleted those the next morning  -  the Kubernetes deployment had been retired six weeks earlier. Migrating dead code with full ceremony is its own small tax on not looking first.

## The thing I was wrong about

I was not wrong that shared frontend packages have a blast radius. I was wrong about what I was comparing it to. I had been holding "three independent repositories" in my head as the baseline, and that baseline did not exist  -  the applications were not independent, they were coupled through my hands, which is the worst possible coupling: invisible to tooling, unmeasured, and paid on every change.

The evidence was in my own log for weeks before I read it properly. Three commits in a row recording a first, second and third attempt at hand-matching another repository's version of the same screen. A commit that named another repository as the source of truth for table structure and styling. And in the end, two identical commits twenty seconds apart, which is what it took for me to notice.

I still would not start a project as a monorepo. I would just count sooner.