# Featured Projects X-Ray Carousel Design

**Date:** 23 August 2026  
**Status:** Approved in brainstorming  
**Project:** `irfankurniawan.com` blog and portfolio

## Objective

Replace the two competing Featured Projects experiments on the homepage with one focused,
interactive case-study carousel. The section must help recruiters understand each project
quickly while giving engineers a meaningful way to inspect its technical structure.

The signature interaction is an X-ray reveal between a product-facing visual and a
project-specific architecture visual. The interaction must explain the project rather than
act as decoration.

## Audience and success criteria

The section serves recruiters, hiring managers, and senior engineers equally.

It succeeds when:

- A scanning visitor can identify the project, purpose, stack, and available links without
  interacting.
- An interested engineer can reveal a concise, accurate architecture visual.
- Every public claim is supported by the CV repository's `base-knowledge/` evidence.
- No Amazone internal interface, business data, or NDA-sensitive material is exposed.
- The experience works with mouse, touch, keyboard, reduced motion, light mode, and dark
  mode.
- The homepage contains one Featured Projects section rather than two alternatives.

## Scope

### Homepage projects

The homepage carousel contains exactly three projects, in this order:

1. OnoToolkit
2. Amazone Retail & POS Monorepo
3. pg-client-mobile

AccessButtons remains available on `/projects` but is not featured on the homepage. The auth
service and platform modernization projects also remain on `/projects`.

### Removed experiment

Delete the current Three.js Featured Projects section and its component. Remove Three.js
dependencies if no remaining source file uses them.

The existing carousel becomes the single Featured Projects component and is reshaped into
the approved X-ray experience.

### Content integrity

Before completion, reconcile the current project content with the CV repository source of
truth. Remove or rewrite unsupported metrics, technologies, implementation details, and
operational claims. Do not preserve a claim merely because it already appears on the blog.

This includes the project summaries, frontmatter, architecture lists, and case-study bodies
that are rendered by the homepage or linked project pages.

## Information hierarchy

The section header contains:

- `Featured Projects`
- A short description of the collection
- A link to view all projects

The carousel contains:

- Three project tabs
- Previous and next controls
- One active case-study card
- A compact position indicator

The active card uses two columns on desktop:

- Left: X-ray visual
- Right: category, title, short description, technology tags, and action links

On mobile, the visual stacks above the project content.

There is no explanatory legend below the card. Text such as "real public product imagery"
or "NDA-safe architecture" is implementation guidance and must not appear in the published
interface.

There is no `Engineering Decision` block in the card. The architecture layer carries the
technical explanation visually.

## Project content

### OnoToolkit

**Category:** `Full Stack / In-Browser ML`

**Description:** Privacy-first utilities that keep file processing, model inference, and
recording inside the browser.

**Tags:** `Nuxt 4`, `WASM`, `ONNX Runtime Web`, `IndexedDB`

**Product layer:** A real public OnoToolkit visual or screenshot.

**Architecture layer:** A browser-local processing pipeline showing local input, WebGPU or
WASM execution, Canvas output, and download. It communicates that files remain on-device.

### Amazone Retail & POS Monorepo

**Category:** `Frontend / Architecture`

**Description:** Shared Bun and Turborepo workspace powering six production web applications
through a reusable Nuxt layer.

**Tags:** `Vue 3`, `Nuxt`, `Bun`, `Turborepo`, `Chrome 109`

**Product layer:** An abstract, neutral set of application shells. It must not reproduce an
internal interface, expose data, or use a screenshot from the Amazone repositories.

**Architecture layer:** A high-level topology showing the shared Nuxt layer and its
relationship to the production applications. Only verified, public-safe labels and metrics
may appear.

### pg-client-mobile

**Category:** `Mobile / Database Tooling`

**Description:** Android-first Flutter client for PostgreSQL with connection management,
object browsing, SQL editing, data grids, and execution logs.

**Tags:** `Flutter`, `Dart`, `PostgreSQL`, `Android`

**Product layer:** A real screenshot from the repository's documented screenshot gallery.

**Architecture layer:** A concise query workflow that includes connection selection, SQL
editing, shortcut-run protection, execution, results, and logs. It must not claim AST
inspection, SSH tunnelling, encrypted credential storage, destructive-statement estimation,
or other behavior absent from the source of truth.

## Visual direction

Retain the site's warm monochrome design system, Inter body typography, and Geist Mono
utility typography. Do not redesign the surrounding homepage.

The X-ray divider is the section's one bold signature:

- A thin green inspection line separates the product and architecture layers.
- A visible handle communicates that the divider can move.
- Architecture paths use the same restrained green accent.
- The card otherwise uses the existing canvas, surface, text, and border tokens.
- No Three.js, ambient particle field, decorative mesh, or continuous animation remains.

The initial split is approximately 70 percent product and 30 percent architecture so the
product stays primary while the architecture layer remains discoverable.

## Interaction design

### Project navigation

- Clicking a tab selects a project.
- Previous and next buttons cycle through the three projects.
- Left and right arrow keys navigate only while focus is within the carousel.
- Touch users may swipe horizontally between projects from the tab strip or text panel. The
  X-ray visual reserves horizontal dragging for its reveal control.
- The carousel never auto-advances.
- Changing projects scrolls the active tab into view on narrow screens.

### X-ray reveal

- Desktop users drag the divider to reveal either layer.
- Explicit `Product` and `Architecture` controls provide a precise alternative to dragging.
- Mobile prioritizes the two explicit controls instead of requiring precise divider dragging.
- The reveal control exposes an accessible name, current value, and keyboard operation.
- The product title, description, tags, and links remain visible regardless of reveal state.

### Motion

Use Motion for Vue for the active tab indicator, slide transition, reveal gestures where it
improves input handling, and coordinated layout changes.

Use one restrained project-switch sequence:

1. The previous visual and text fade out with a small positional shift.
2. The active tab indicator moves to the selected tab.
3. The next visual and text fade in.

Do not scatter unrelated entry effects around the section. Respect `prefers-reduced-motion`
by replacing movement with immediate state changes or short opacity transitions.

## Component boundaries

### `FeaturedProjectsCarousel.vue`

Responsibilities:

- Render the section header and project tabs.
- Own the active project index.
- Handle scoped tab, button, keyboard, and optional swipe navigation.
- Render the active project's metadata and links.
- Coordinate project-switch motion.

It does not contain project-specific SVG markup.

### `ProjectXray.vue`

Responsibilities:

- Render the product and architecture layers.
- Own the reveal percentage.
- Handle pointer, touch, button, and keyboard reveal input.
- Expose accessible state.
- Apply responsive and reduced-motion behavior.

It receives the two visual layers through slots or explicit child components.

### Project visual components

Use one focused component for each architecture visual:

- `OnoToolkitVisual.vue`
- `AmazoneMonorepoVisual.vue`
- `PgClientMobileVisual.vue`

Each visual component contains only its visual scene and accessible descriptive text. It does
not own carousel state or project metadata.

## Data flow

Nuxt Content remains the source for project metadata. The homepage query returns only
projects with `featured: true`, ordered by `order`.

Set `featured: true` for the three homepage projects and `featured: false` or omit it for
AccessButtons and the remaining projects.

Project-specific visual selection must use a stable project identifier or slug. Do not match
on display-title substrings.

Store optimized public screenshots in a local project-assets directory. Do not load critical
carousel images from third-party hosts at runtime.

## Resilience and fallback behavior

- If there are no featured projects, do not render an empty carousel shell.
- If a public screenshot is missing, show the architecture layer as the complete visual.
- If Motion fails to load or JavaScript is unavailable, the server-rendered first project,
  its description, and its links remain readable.
- The visual area reserves its final aspect ratio to prevent layout shift.
- Global arrow-key listeners are prohibited. Keyboard events are scoped to the carousel.
- Pointer capture is released on pointer cancellation and component unmount.
- Public images use meaningful alternative text. Decorative SVG elements are hidden from
  assistive technology, while each architecture visual has a concise text alternative.

## Verification

Automated checks:

- Formatting check
- ESLint
- Vue and TypeScript type checking
- Nuxt static generation
- Focused interaction tests for project selection, wrapping navigation, reveal controls,
  missing-image fallback, and reduced-motion behavior

Browser verification:

- Desktop, tablet, and narrow mobile widths
- Mouse drag and pointer cancellation
- Touch controls and horizontal project navigation
- Keyboard-only navigation and visible focus
- Light and dark themes
- Reduced-motion preference
- No horizontal page overflow
- No layout shift when screenshots load
- Project detail and external links remain correct
- Only one Featured Projects section appears on the homepage
- No WebGL canvas, animation loop, or Three.js code ships on the homepage

Content verification:

- Compare all edited claims against the sibling CV repository at
  `../../irfan/all-irfan-cv/base-knowledge/`.
- Confirm no internal Amazone screenshot or sensitive label is present.
- Confirm AccessButtons remains reachable from `/projects` but is absent from the homepage
  carousel.
- Scan edited files for em dashes and replace them with plain hyphens.

## Out of scope

- Redesigning the homepage hero, blog list, header, footer, or project index
- Creating an AccessButtons screenshot or simulator
- Publishing Amazone screenshots
- Adding 3D scenes or Three.js to another section
- Auto-playing the carousel
- Adding an `Engineering Decision` text block
- Adding implementation-explanation legends to the published interface
