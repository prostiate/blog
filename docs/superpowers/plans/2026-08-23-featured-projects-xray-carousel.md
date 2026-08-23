# Featured Projects X-Ray Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two homepage project experiments with one accessible X-ray carousel for OnoToolkit, Amazone Monorepo, and pg-client-mobile.

**Architecture:** Nuxt Content remains the project metadata source. A rewritten carousel owns project selection, a reusable `ProjectXray` owns the reveal interaction, and three isolated visual components provide project-specific product and architecture layers. Motion for Vue handles only coordinated state transitions, while the precise reveal uses deterministic pointer and keyboard logic.

**Tech Stack:** Nuxt 4, Vue 3.5, Nuxt Content 3, TypeScript, Tailwind CSS 3, Motion for Vue (`motion-v`), Vitest, Vue Test Utils, happy-dom

## Global Constraints

- The homepage contains exactly one Featured Projects section.
- The homepage order is OnoToolkit, Amazone Retail & POS Monorepo, then pg-client-mobile.
- AccessButtons remains on `/projects` and is not featured on the homepage.
- No Amazone screenshot, internal data, or recognizable internal interface may be published.
- No Three.js, WebGL canvas, continuous animation loop, auto-advance, or `Engineering Decision` text block remains in the homepage Featured Projects section.
- Every factual claim must match `../../irfan/all-irfan-cv/base-knowledge/`.
- Never use an em dash. Use a plain hyphen.
- The X-ray starts at 70 percent product and 30 percent architecture.
- Motion must respect `prefers-reduced-motion`.
- New unit-tested Vue files explicitly import every Vue API they use so they work outside Nuxt auto-import transforms.
- Do not modify generated changelogs or local agent-tooling files.

---

## File map

**Create**

- `types/project.ts` - shared project and visual identifier types
- `utils/featured-projects.ts` - stable route-to-visual mapping and index wrapping
- `utils/featured-projects.spec.ts` - unit tests for the mapping and navigation helpers
- `utils/xray.ts` - pointer-coordinate normalization for the reveal control
- `vitest.config.ts` - Vue component test configuration
- `components/ui/featured-projects/ProjectXray.vue` - reusable reveal interaction
- `components/ui/featured-projects/ProjectXray.spec.ts` - reveal control tests
- `components/ui/featured-projects/OnoToolkitVisual.vue` - OnoToolkit product and local-processing scene
- `components/ui/featured-projects/AmazoneMonorepoVisual.vue` - NDA-safe abstract application and shared-layer scene
- `components/ui/featured-projects/PgClientMobileVisual.vue` - mobile screenshot and query-safety scene
- `components/ui/featured-projects/ProjectVisuals.spec.ts` - accessibility and NDA regression tests
- `components/ui/FeaturedProjectsCarousel.spec.ts` - carousel behavior tests
- `tests/content/project-content.spec.ts` - featured selection and unsupported-claim regression tests
- `public/assets/projects/onotoolkit-showcase.webp` - optimized public OnoToolkit artwork
- `public/assets/projects/pg-client-mobile-showcase.webp` - optimized real app screenshot

**Modify**

- `package.json` - Motion and test dependencies plus test scripts
- `pnpm-lock.yaml` - resolved dependency graph; retain Three.js because `TopologyCanvas.client.vue` uses it in article content
- `components/ui/FeaturedProjectsCarousel.vue` - single X-ray carousel orchestrator
- `pages/index.vue` - featured-only query and removal of the Three.js section
- `content/projects/onotoolkit.md` - concise verified content
- `content/projects/fe-amazone-monorepo.md` - verified metrics and architecture
- `content/projects/pg-client-mobile.md` - remove unsupported security and performance claims
- `content/projects/access-buttons.md` - remove homepage featured state
- `content/projects/amazone-auth-service.md` - replace JWT and Redis claims with the verified opaque-session design
- `content/projects/k8s-docker-migration.md` - align the retirement story with measured evidence
- `assets/css/main.css` - shared X-ray tokens and reduced-motion safeguards if component-local CSS is insufficient

**Delete**

- `components/ui/FeaturedProjectsThree.vue` - obsolete Three.js experiment

---

### Task 1: Establish the tested project-selection contract

**Files:**

- Create: `types/project.ts`
- Create: `utils/featured-projects.ts`
- Create: `utils/featured-projects.spec.ts`
- Create: `vitest.config.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**

- Produces: `ProjectItem`, `FeaturedVisualId`, `getFeaturedVisualId(path)`, `wrapProjectIndex(index, total)`, and `getPanelMotion(reducedMotion)`
- Consumed by: the visual components and `FeaturedProjectsCarousel.vue`

- [ ] **Step 1: Install the runtime and test dependencies**

Run:

```bash
pnpm add motion-v
pnpm add -D vitest @vue/test-utils happy-dom @vitejs/plugin-vue
```

Add these scripts to `package.json`:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "validate": "pnpm format:check && pnpm lint && pnpm test && pnpm typecheck && pnpm generate"
}
```

- [ ] **Step 2: Configure Vitest**

Create `vitest.config.ts`:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['**/*.spec.ts']
  }
})
```

- [ ] **Step 3: Write the failing helper tests**

Create `utils/featured-projects.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getFeaturedVisualId, getPanelMotion, wrapProjectIndex } from './featured-projects'

describe('featured project helpers', () => {
  it.each([
    ['/projects/onotoolkit', 'onotoolkit'],
    ['/projects/fe-amazone-monorepo', 'amazone-monorepo'],
    ['/projects/pg-client-mobile', 'pg-client-mobile']
  ] as const)('maps %s to %s', (path, visualId) => {
    expect(getFeaturedVisualId(path)).toBe(visualId)
  })

  it('does not infer a visual from a display title', () => {
    expect(getFeaturedVisualId('/projects/unknown')).toBeNull()
  })

  it.each([
    [-1, 3, 2],
    [0, 3, 0],
    [3, 3, 0],
    [8, 3, 2],
    [1, 0, 0]
  ])('wraps index %i for total %i', (index, total, expected) => {
    expect(wrapProjectIndex(index, total)).toBe(expected)
  })

  it('removes positional movement when reduced motion is active', () => {
    expect(getPanelMotion(true)).toMatchObject({
      initial: { opacity: 0, y: 0 },
      exit: { opacity: 0, y: 0 },
      transition: { duration: 0.01 }
    })
    expect(getPanelMotion(false).initial.y).toBe(8)
  })
})
```

- [ ] **Step 4: Run the helper test and confirm the expected failure**

Run: `pnpm vitest run utils/featured-projects.spec.ts`

Expected: FAIL because `utils/featured-projects.ts` does not exist.

- [ ] **Step 5: Implement the shared types and helpers**

Create `types/project.ts`:

```ts
export type FeaturedVisualId = 'onotoolkit' | 'amazone-monorepo' | 'pg-client-mobile'

export interface ProjectItem {
  path?: string
  title: string
  category: string
  description: string
  tags?: string[]
  liveUrl?: string | null
  githubUrl?: string | null
  featured?: boolean
}
```

Create `utils/featured-projects.ts`:

```ts
import type { FeaturedVisualId } from '../types/project'

const VISUAL_BY_PATH: Readonly<Record<string, FeaturedVisualId>> = {
  '/projects/onotoolkit': 'onotoolkit',
  '/projects/fe-amazone-monorepo': 'amazone-monorepo',
  '/projects/pg-client-mobile': 'pg-client-mobile'
}

export function getFeaturedVisualId(path?: string): FeaturedVisualId | null {
  return path ? VISUAL_BY_PATH[path] ?? null : null
}

export function wrapProjectIndex(index: number, total: number): number {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}

export function getPanelMotion(reducedMotion: boolean) {
  return {
    initial: { opacity: 0, y: reducedMotion ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reducedMotion ? 0 : -8 },
    transition: { duration: reducedMotion ? 0.01 : 0.22 }
  }
}
```

- [ ] **Step 6: Run the helper tests**

Run: `pnpm vitest run utils/featured-projects.spec.ts`

Expected: PASS with 10 cases.

- [ ] **Step 7: Commit the tested foundation**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts types/project.ts utils/featured-projects.ts utils/featured-projects.spec.ts
git commit -m "test: establish featured project contracts"
```

---

### Task 2: Correct project content and prepare public assets

**Files:**

- Create: `tests/content/project-content.spec.ts`
- Create: `public/assets/projects/onotoolkit-showcase.webp`
- Create: `public/assets/projects/pg-client-mobile-showcase.webp`
- Modify: all six files under `content/projects/`

**Interfaces:**

- Produces: three `featured: true` project records with stable `/projects/*` paths
- Produces: two local WebP paths consumed by the visual components

- [ ] **Step 1: Write the failing content regression test**

Create `tests/content/project-content.spec.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (name: string) => readFileSync(`content/projects/${name}.md`, 'utf8')

describe('project portfolio claims', () => {
  it('features exactly the three approved homepage projects', () => {
    const states = {
      onotoolkit: /featured: true/.test(read('onotoolkit')),
      monorepo: /featured: true/.test(read('fe-amazone-monorepo')),
      pgClient: /featured: true/.test(read('pg-client-mobile')),
      accessButtons: /featured: true/.test(read('access-buttons')),
      auth: /featured: true/.test(read('amazone-auth-service')),
      platform: /featured: true/.test(read('k8s-docker-migration'))
    }
    expect(states).toEqual({
      onotoolkit: true,
      monorepo: true,
      pgClient: true,
      accessButtons: false,
      auth: false,
      platform: false
    })
  })

  it('does not publish unsupported claims', () => {
    const all = [
      'onotoolkit',
      'fe-amazone-monorepo',
      'pg-client-mobile',
      'access-buttons',
      'amazone-auth-service',
      'k8s-docker-migration'
    ].map(read).join('\n')

    const forbidden = [
      'reducing maintenance cycles by over 60%',
      '95% down to under 25%',
      '7 minutes to 1.5 minutes',
      'Zero reported browser freezes',
      'AST-based query inspection',
      'affected row estimates',
      'AES-256 GCM',
      'SSH tunnel private keys',
      'Redis session blacklist',
      'Short-lived (15 minutes)',
      '@hasPermission',
      'Sub-Millisecond Auth Checks',
      '20-component K8s stack',
      '100% uptime'
    ]

    for (const phrase of forbidden) expect(all).not.toContain(phrase)
    expect(all).not.toContain('\u2014')
  })

  it('stores showcase assets locally', () => {
    expect(existsSync('public/assets/projects/onotoolkit-showcase.webp')).toBe(true)
    expect(existsSync('public/assets/projects/pg-client-mobile-showcase.webp')).toBe(true)
  })
})
```

- [ ] **Step 2: Run the content test and confirm the expected failures**

Run: `pnpm vitest run tests/content/project-content.spec.ts`

Expected: FAIL because AccessButtons is still featured, unsupported phrases remain, and the
two local assets do not exist.

- [ ] **Step 3: Create the optimized public assets from verified sources**

Run from the blog repository:

```bash
mkdir -p public/assets/projects
magick ../../personal/onotoolkit/apps/web/public/og-image.png -resize '1280x720>' -quality 82 public/assets/projects/onotoolkit-showcase.webp
magick ../../pg-client-mobile/docs/screenshots/Screenshot_1773028395.png -resize '720x1440>' -quality 82 public/assets/projects/pg-client-mobile-showcase.webp
```

If ImageMagick is unavailable, use `cwebp -q 82` with the same source and destination paths.
Do not substitute generated artwork or an Amazone screenshot.

- [ ] **Step 4: Rewrite the project frontmatter with verified summaries**

Use these exact featured states and homepage summaries:

```yaml
# onotoolkit.md
description: Privacy-first utilities that keep file processing, model inference,
  and recording inside the browser.
featured: true
tags: [Nuxt 4, WASM, ONNX Runtime Web, IndexedDB]

# fe-amazone-monorepo.md
description: Shared Bun and Turborepo workspace powering 6 production web applications
  through a reusable Nuxt layer.
featured: true
tags: [Vue 3, Nuxt, Bun, Turborepo, Chrome 109]

# pg-client-mobile.md
description: Android-first Flutter client for PostgreSQL with connection management,
  object browsing, SQL editing, data grids, and execution logs.
featured: true
tags: [Flutter, Dart, PostgreSQL, Android]

# access-buttons.md
featured: false
```

Keep the auth and platform files at `featured: false`.

- [ ] **Step 5: Reconcile the six case-study bodies against the CV evidence**

Use `../../irfan/all-irfan-cv/base-knowledge/04-skills-matrix.md`,
`05-achievement-bank.md`, `06-personal-projects.md`, and `07-cv-playbook.md` as the only claim
sources. Apply these exact content boundaries:

- OnoToolkit: keep browser-local PDF, ONNX, WebGPU with WASM fallback, MI-GAN, screen
  recording, IndexedDB, JOSE, and the verified 23 MB bundle reduction. Remove claims about
  server liability, guaranteed hardware behavior, or implementation details not stated in
  the evidence source.
- Monorepo: describe three consolidated Nuxt frontends, the shared `@amazone/base` layer with
  27 components, Bun workspaces, Turborepo, the parameterized Docker build, and the verified
  median pipeline changes of 3.5 to 1.7 minutes in staging and 5.9 to 3.0 minutes in
  production. Describe the form freeze as a server-paginated, multi-page interaction after
  virtualization proved insufficient. Remove invented CPU percentages, offline mode, and
  nationwide zero-incident claims.
- pg-client-mobile: limit the page to connection management, object browser, SQL editor,
  data grid, execution and app logs, shortcut-run protection, 40 of 40 commits, MIT license,
  and the screenshot gallery. Remove AST parsing, affected-row estimation, virtualization
  FPS, SSH tunnelling, AES storage, and Android Keystore claims.
- AccessButtons: retain only the Kotlin, Jetpack Compose, WindowManager, Foreground Service,
  drag and edge snapping, haptics, and MIUI permission-flow claims supported by the CV source.
- Auth service: replace JWT and Redis descriptions with opaque revocable server-side
  sessions, rotating refresh tokens, bcrypt with HMAC pepper, HttpOnly host-only cookies,
  per-app isolation, device binding, RBAC role-creation scoping, `allowedMenus`, audit logs,
  PostgreSQL schema namespacing, backward-compatible shims, 11 applications, and zero service
  interruption.
- Platform modernization: describe the K3s, Argo CD, Argo Rollouts, Harbor, Infisical, and
  observability pilot; the measured 10-15 MB/s shared SAS HDD bottleneck; the 3 June 2026
  retirement decision; and the health-gated, one-node-at-a-time Docker Compose rollout with
  per-node rollback and smoke tests. Do not claim Kubernetes production operation or
  automatic deployment triggers.

- [ ] **Step 6: Run content verification**

Run:

```bash
pnpm vitest run tests/content/project-content.spec.ts
rg -n '\x{2014}' content/projects public/assets/projects || true
```

Expected: all content tests PASS and the em-dash scan prints no matches.

- [ ] **Step 7: Commit the verified portfolio content**

```bash
git add content/projects tests/content/project-content.spec.ts public/assets/projects
git commit -m "content: align project stories with verified evidence"
```

---

### Task 3: Build the accessible X-ray reveal primitive

**Files:**

- Create: `components/ui/featured-projects/ProjectXray.vue`
- Create: `components/ui/featured-projects/ProjectXray.spec.ts`
- Create: `utils/xray.ts`

**Interfaces:**

- Props: `label: string`, `initialPercent?: number`, `productAvailable?: boolean`
- Slots: `product`, `architecture`
- Exposes: an ARIA slider with 0 to 100 reveal state and Product or Architecture buttons
- Produces: `percentageFromPointer(clientX, left, width)` in `utils/xray.ts`

- [ ] **Step 1: Write the failing interaction tests**

Create tests that mount the component with named slot text and assert this exact behavior:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { percentageFromPointer } from '../../../utils/xray'
import ProjectXray from './ProjectXray.vue'

const mountXray = () =>
  mount(ProjectXray, {
    props: { label: 'OnoToolkit architecture reveal' },
    slots: { product: 'Product layer', architecture: 'Architecture layer' }
  })

describe('ProjectXray', () => {
  it('starts at a 70 percent product reveal', () => {
    expect(mountXray().get('[role="slider"]').attributes('aria-valuenow')).toBe('70')
  })

  it('supports explicit layer controls', async () => {
    const wrapper = mountXray()
    await wrapper.get('[data-layer="architecture"]').trigger('click')
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('0')
    await wrapper.get('[data-layer="product"]').trigger('click')
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('100')
  })

  it('supports slider keyboard controls', async () => {
    const wrapper = mountXray()
    const slider = wrapper.get('[role="slider"]')
    await slider.trigger('keydown', { key: 'ArrowLeft' })
    expect(slider.attributes('aria-valuenow')).toBe('65')
    await slider.trigger('keydown', { key: 'Home' })
    expect(slider.attributes('aria-valuenow')).toBe('0')
    await slider.trigger('keydown', { key: 'End' })
    expect(slider.attributes('aria-valuenow')).toBe('100')
  })

  it('clamps pointer positions to the visual bounds', () => {
    expect(percentageFromPointer(50, 100, 400)).toBe(0)
    expect(percentageFromPointer(300, 100, 400)).toBe(50)
    expect(percentageFromPointer(600, 100, 400)).toBe(100)
  })

  it('falls back to the full architecture layer when product media fails', async () => {
    const wrapper = mountXray()
    await wrapper.setProps({ productAvailable: false })
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('0')
    expect(wrapper.get('[data-layer="product"]').attributes()).toHaveProperty('disabled')
  })
})
```

- [ ] **Step 2: Run the tests and confirm the expected failure**

Run: `pnpm vitest run components/ui/featured-projects/ProjectXray.spec.ts`

Expected: FAIL because `ProjectXray.vue` does not exist.

- [ ] **Step 3: Implement deterministic reveal state**

Create `utils/xray.ts`:

```ts
export function percentageFromPointer(clientX: number, left: number, width: number): number {
  if (width <= 0) return 0
  return Math.round(Math.min(1, Math.max(0, (clientX - left) / width)) * 100)
}
```

Import that helper and use this state contract in `ProjectXray.vue`:

```ts
const props = withDefaults(
  defineProps<{ label: string; initialPercent?: number; productAvailable?: boolean }>(),
  { initialPercent: 70, productAvailable: true }
)

const revealPercent = ref(Math.min(100, Math.max(0, props.initialPercent)))

watch(
  () => props.productAvailable,
  (available) => {
    if (!available) revealPercent.value = 0
  },
  { immediate: true }
)

function onSliderKeydown(event: KeyboardEvent) {
  const next =
    event.key === 'ArrowLeft' ? revealPercent.value - 5
      : event.key === 'ArrowRight' ? revealPercent.value + 5
        : event.key === 'Home' ? 0
          : event.key === 'End' ? 100
            : null
  if (next === null) return
  event.preventDefault()
  revealPercent.value = Math.min(100, Math.max(0, next))
}
```

The template must include:

```vue
<div class="project-xray" :aria-label="label">
  <div class="project-xray__controls" aria-label="Visual layer">
    <button
      type="button"
      data-layer="product"
      :disabled="!productAvailable"
      @click="revealPercent = 100"
    >
      Product
    </button>
    <button type="button" data-layer="architecture" @click="revealPercent = 0">
      Architecture
    </button>
  </div>
  <div ref="stage" class="project-xray__stage">
    <div class="project-xray__architecture"><slot name="architecture" /></div>
    <div
      v-if="productAvailable"
      class="project-xray__product"
      :style="{ clipPath: `inset(0 ${100 - revealPercent}% 0 0)` }"
    >
      <slot name="product" />
    </div>
    <div
      role="slider"
      tabindex="0"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="revealPercent"
      :aria-label="label"
      class="project-xray__handle"
      :style="{ left: `${revealPercent}%` }"
      @keydown="onSliderKeydown"
    />
  </div>
</div>
```

Use pointer capture on the stage for `pointerdown`, `pointermove`, `pointerup`, and
`pointercancel`. Calculate each update from `stage.getBoundingClientRect()`. Release capture
on completion and unmount. Hide the draggable handle below the mobile breakpoint while
leaving the two explicit buttons visible.

- [ ] **Step 4: Run the X-ray tests**

Run: `pnpm vitest run components/ui/featured-projects/ProjectXray.spec.ts`

Expected: PASS with five behaviors.

- [ ] **Step 5: Commit the reveal primitive**

```bash
git add components/ui/featured-projects/ProjectXray.vue components/ui/featured-projects/ProjectXray.spec.ts utils/xray.ts
git commit -m "feat: add accessible project x-ray reveal"
```

---

### Task 4: Build the three project-specific visual scenes

**Files:**

- Create: `components/ui/featured-projects/OnoToolkitVisual.vue`
- Create: `components/ui/featured-projects/AmazoneMonorepoVisual.vue`
- Create: `components/ui/featured-projects/PgClientMobileVisual.vue`
- Create: `components/ui/featured-projects/ProjectVisuals.spec.ts`

**Interfaces:**

- Each component has no props and renders one `ProjectXray` instance.
- Each component provides a visible visual and a concise screen-reader description.

- [ ] **Step 1: Write failing visual-content tests**

Create `ProjectVisuals.spec.ts` and mount each component. Assert:

```ts
expect(ono.text()).toContain('Files stay on this device')
expect(ono.find('img').attributes('src')).toBe('/assets/projects/onotoolkit-showcase.webp')

expect(amazone.text()).toContain('@amazone/base')
expect(amazone.text()).toContain('6 production apps')
expect(amazone.find('img').exists()).toBe(false)
expect(amazone.html()).not.toMatch(/revenue|cashier data|employee|customer/i)

expect(pg.text()).toContain('Shortcut guard')
expect(pg.find('img').attributes('src')).toBe('/assets/projects/pg-client-mobile-showcase.webp')
```

- [ ] **Step 2: Run the visual tests and confirm the expected failure**

Run: `pnpm vitest run components/ui/featured-projects/ProjectVisuals.spec.ts`

Expected: FAIL because the three visual components do not exist.

- [ ] **Step 3: Implement the OnoToolkit scene**

The product slot uses `onotoolkit-showcase.webp` with alt text `OnoToolkit browser tools home
screen`. Keep a `productAvailable` ref, pass it to `ProjectXray`, and set it to `false` from the
image `error` event. The architecture slot uses these exact nodes and directed connections:

```text
Local file -> WebGPU / WASM -> Canvas output -> Download
                       |
                  IndexedDB
```

Display `Files stay on this device` as the architecture caption. Use inline SVG only for the
connecting lines. Mark the line SVG `aria-hidden="true"` and provide the same flow as visually
hidden text.

- [ ] **Step 4: Implement the Amazone monorepo scene**

The product slot uses six neutral window outlines labeled only `App 1` through `App 6` and the
caption `6 production apps`. The architecture slot uses these exact public-safe nodes:

```text
Backoffice   Auth Login   Cashier
      \          |          /
        @amazone/base
      /          |          \
27 components  8 composables  10 utilities
                 |
        Parameterized Docker build
```

Do not import an image and do not use business-domain screen labels or data.

- [ ] **Step 5: Implement the pg-client-mobile scene**

The product slot uses `pg-client-mobile-showcase.webp` with alt text `pg-client-mobile SQL
editor and command menu`. Apply the same `productAvailable` error handling as OnoToolkit. The
architecture slot uses these nodes:

```text
Connection -> Object browser -> SQL editor -> Shortcut guard -> Results and logs
```

The only safety claim shown is `Shortcut guard`. Do not show AST inspection, affected rows,
encryption, SSH tunnels, or 60 FPS.

- [ ] **Step 6: Run the visual tests**

Run: `pnpm vitest run components/ui/featured-projects/ProjectVisuals.spec.ts`

Expected: PASS.

- [ ] **Step 7: Commit the project visuals**

```bash
git add components/ui/featured-projects/OnoToolkitVisual.vue components/ui/featured-projects/AmazoneMonorepoVisual.vue components/ui/featured-projects/PgClientMobileVisual.vue components/ui/featured-projects/ProjectVisuals.spec.ts
git commit -m "feat: add project-specific x-ray visuals"
```

---

### Task 5: Rewrite the carousel around the X-ray scenes

**Files:**

- Modify: `components/ui/FeaturedProjectsCarousel.vue`
- Create: `components/ui/FeaturedProjectsCarousel.spec.ts`

**Interfaces:**

- Props: `projects: ProjectItem[]`
- Consumes: `getFeaturedVisualId`, `wrapProjectIndex`, and the three visual components
- Produces: one accessible tablist, one active panel, scoped keyboard navigation, and project links

- [ ] **Step 1: Write the failing carousel tests**

Use three project fixtures with the approved paths. Mount the component with a `NuxtLink`
stub. Before mounting, provide the browser API used by Motion:

```ts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  })
})
```

Assert:

```ts
expect(wrapper.findAll('[role="tab"]')).toHaveLength(3)
expect(wrapper.get('[role="tabpanel"]').text()).toContain('OnoToolkit')
expect(wrapper.text()).not.toContain('Engineering Decision')

await wrapper.findAll('[role="tab"]')[1]!.trigger('click')
expect(wrapper.get('[role="tabpanel"]').text()).toContain('Amazone Retail & POS Monorepo')

await wrapper.get('[data-nav="next"]').trigger('click')
expect(wrapper.get('[role="tabpanel"]').text()).toContain('pg-client-mobile')
await wrapper.get('[data-nav="next"]').trigger('click')
expect(wrapper.get('[role="tabpanel"]').text()).toContain('OnoToolkit')

await wrapper.get('[role="tablist"]').trigger('keydown', { key: 'ArrowLeft' })
expect(wrapper.get('[role="tabpanel"]').text()).toContain('pg-client-mobile')
```

Add a second test with `projects: []` and assert the section does not render.

- [ ] **Step 2: Run the carousel tests and confirm the expected failure**

Run: `pnpm vitest run components/ui/FeaturedProjectsCarousel.spec.ts`

Expected: FAIL because the existing component does not implement the approved semantics or visuals.

- [ ] **Step 3: Replace title matching with stable visual selection**

Use an explicit component map:

```ts
const visualComponents = {
  onotoolkit: OnoToolkitVisual,
  'amazone-monorepo': AmazoneMonorepoVisual,
  'pg-client-mobile': PgClientMobileVisual
} as const

const activeVisual = computed(() => {
  const id = getFeaturedVisualId(currentProject.value?.path)
  return id ? visualComponents[id] : null
})
```

If `activeVisual` is null, render an accessible architecture-only fallback containing the
project title, category, and tags.

- [ ] **Step 4: Implement accessible tabs and scoped navigation**

Use `role="tablist"`, one `role="tab"` per project, `aria-selected`, roving `tabindex`, and
one `role="tabpanel"`. Attach the arrow-key handler to the tablist or carousel root. Do not
register listeners on `window`.

Use `wrapProjectIndex` for buttons and arrow keys. Swipe navigation is limited to the tab
strip or text panel and uses a 48-pixel horizontal threshold. Do not attach swipe navigation
to the X-ray visual.

- [ ] **Step 5: Add restrained Motion transitions**

Import `AnimatePresence`, `motion`, and `useReducedMotion` from `motion-v`. Use a shared
`layoutId="featured-project-active-tab"` for the tab indicator. Key the panel by project path.

Use this transition contract:

```ts
const prefersReducedMotion = useReducedMotion()
const panelMotion = computed(() => getPanelMotion(prefersReducedMotion.value))
```

Do not animate continuously and do not auto-advance.

- [ ] **Step 6: Implement the approved information hierarchy**

The active text panel contains only:

1. Category
2. Title
3. Description
4. Technology tags
5. `Read case study`, optional `Live project`, and optional `Source code` links

Do not render `problemSolved`, `architecture`, an explanatory legend, or an `Engineering
Decision` block on the homepage card.

- [ ] **Step 7: Run the carousel tests**

Run: `pnpm vitest run components/ui/FeaturedProjectsCarousel.spec.ts`

Expected: PASS.

- [ ] **Step 8: Commit the rewritten carousel**

```bash
git add components/ui/FeaturedProjectsCarousel.vue components/ui/FeaturedProjectsCarousel.spec.ts
git commit -m "feat: build featured project x-ray carousel"
```

---

### Task 6: Wire the homepage and remove the Three.js showcase

**Files:**

- Modify: `pages/index.vue`
- Delete: `components/ui/FeaturedProjectsThree.vue`

**Interfaces:**

- Consumes: Nuxt Content's `featured` boolean and the rewritten carousel
- Produces: exactly one Featured Projects section with three ordered records

- [ ] **Step 1: Change the homepage query**

Replace the project query with:

```ts
const { data: rawProjects } = await useAsyncData('home-projects', () => {
  return queryCollection('projects')
    .where('featured', '=', true)
    .order('order', 'ASC')
    .all()
})
```

Keep `featuredProjectsList` as the null-safe computed array passed to the carousel.

- [ ] **Step 2: Remove the duplicate section and component**

Delete the `<UiFeaturedProjectsThree>` section from `pages/index.vue`, then delete
`components/ui/FeaturedProjectsThree.vue`.

- [ ] **Step 3: Confirm Three.js is absent from the homepage feature**

Verify no remaining imports:

```bash
rg -n "from 'three'|from \"three\"|FeaturedProjectsThree|WebGL" components/ui pages/index.vue
```

Expected after deletion: no matches. Keep `three` and `@types/three` in `package.json` because
`components/content/TopologyCanvas.client.vue` still uses them for an interactive article.

- [ ] **Step 4: Run focused and static verification**

Run:

```bash
pnpm test
pnpm typecheck
pnpm generate
```

Expected: all commands exit 0 and the generated homepage contains `Featured Projects` once.

- [ ] **Step 5: Commit the homepage integration**

```bash
git add pages/index.vue components/ui/FeaturedProjectsThree.vue
git commit -m "refactor: replace duplicate project showcases"
```

---

### Task 7: Visual QA, accessibility QA, and final cleanup

**Files:**

- Modify as findings require: `components/ui/FeaturedProjectsCarousel.vue`
- Modify as findings require: `components/ui/featured-projects/*.vue`
- Modify as findings require: `assets/css/main.css`

**Interfaces:**

- Verifies the complete homepage behavior without adding a new feature boundary.

- [ ] **Step 1: Run the app and inspect the end-user path**

Run: `pnpm dev`

Open `/` and exercise this sequence at 1440, 1024, 768, 390, and 320 CSS pixels:

1. Confirm only one Featured Projects heading exists.
2. Select each tab and verify the correct title, description, tags, visual, and links.
3. Drag the X-ray handle at desktop widths.
4. Switch Product and Architecture at mobile widths.
5. Navigate all tabs and controls using only the keyboard.
6. Toggle light and dark modes.
7. Enable reduced motion and repeat project navigation.
8. Open `/projects` and confirm AccessButtons is still present.
9. Open each of the three featured case-study routes.
10. Disable JavaScript, reload `/`, and confirm the first project description and links remain
    readable in the prerendered HTML.

- [ ] **Step 2: Check exact visual requirements**

Record screenshots at 1440x900, 390x844, and one dark-mode viewport. Confirm:

- The card fits the homepage's `max-w-4xl` reading rail without clipped text.
- The initial split visibly reads as 70 percent product and 30 percent architecture.
- The green divider is the only high-attention decorative element.
- OnoToolkit and pg-client-mobile images are crisp and not stretched.
- The Amazone visual contains no screenshot, internal data, or recognizable internal UI.
- Focus rings remain visible against every surface.
- No horizontal page overflow appears at 320 pixels.
- The layout height stays stable while images and projects change.

- [ ] **Step 3: Fix every observed issue and rerun focused tests**

For each issue, first add or tighten the nearest component regression test when the behavior is
testable. Then make the smallest CSS or component change and rerun:

```bash
pnpm test
```

Expected: PASS after each fix.

- [ ] **Step 4: Run the complete repository validation**

Run:

```bash
pnpm validate
git diff --check
rg -n '\x{2014}' components pages content/projects assets/css tests types utils docs/superpowers/plans/2026-08-23-featured-projects-xray-carousel.md || true
rg -n "from 'three'|from \"three\"|FeaturedProjectsThree|WebGL" components/ui pages/index.vue || true
```

Expected:

- `pnpm validate` exits 0.
- `git diff --check` prints nothing.
- Both `rg` commands print nothing.

- [ ] **Step 5: Review the final diff against the approved specification**

Run:

```bash
git status --short
git diff --stat
git diff -- docs/superpowers/specs/2026-08-23-featured-projects-xray-carousel-design.md
```

Expected: the approved specification is unchanged and no unrelated file is modified.

- [ ] **Step 6: Commit final QA adjustments**

If Task 7 produced changes:

```bash
git add components/ui/FeaturedProjectsCarousel.vue components/ui/featured-projects assets/css/main.css
git commit -m "fix: polish featured project interactions"
```

If Task 7 produced no changes, do not create an empty commit.
