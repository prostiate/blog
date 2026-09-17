# irfankurniawan.com

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js&logoColor=white&style=flat-square)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vuedotjs&logoColor=white&style=flat-square)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare_Workers-F38020?logo=cloudflare&logoColor=white&style=flat-square)](https://workers.cloudflare.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-1a6b5a.svg?style=flat-square)](LICENSE)

The developer-focused personal engineering blog, monograph, and technical portfolio of **Muhammad Irfan Kurniawan** (Senior Full Stack Engineer based in Jakarta, Indonesia).

Live at [**irfankurniawan.com**](https://irfankurniawan.com).

---

## Design System: Editorial Monograph

The site is built around an editorial monograph aesthetic inspired by classical print, technical white papers, and field manuals (referencing [`axi.md`](https://axi.md)):

- **Color Palette**:
  - **Paper Canvas**: `#f5f2ed` (warm ivory paper background)
  - **Parchment Surface**: `#eceae4` (cards, containers, search modals)
  - **Stone Code Background**: `#e2ded7` (code blocks and gutter backgrounds)
  - **Charcoal Ink**: `#1a1a1a` (high-contrast, editorial typography)
  - **Muted Ink**: `#66615b` (timestamps, metadata, secondary captions)
  - **Hairline Borders**: `1px solid #d1ccc4`
  - **Pine Accent**: `#1a6b5a` (subtle teal-pine interactive accents)
  - _(Dark mode: warm dark-charcoal console with `#151412` canvas and `#2ca88d` accent)_
- **Typography**:
  - **Thesis / Headings**: `Source Serif 4` (`font-serif`, weight `600`, line-height `1.2`)
  - **Explanation / Body Copy**: `Inter` (`font-sans`, line-height `1.8` for sustained reading)
  - **Proof / Metadata / Code**: `JetBrains Mono` (`font-mono`, tabular numbers, timestamps)
- **Geometry**: Universal `2px` corners (`rounded-[2px]`) and flat elevation (`box-shadow: none`).
- **Content-First**: Landing page serves chronological dispatches immediately at the top of the viewport with zero vanity hero sections or hashtag badge clutter.

---

## Architecture & Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3, TypeScript, Composition API)
- **Content Engine**: [`@nuxt/content`](https://content.nuxt.com/) v3 with Markdown Components (MDC) and Zod collection schemas
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom CSS custom properties
- **Interactive Visualizations**: [Three.js](https://threejs.org/) for local-first node topology and interactive storage I/O simulators
- **Search**: Client-side command palette search (`⌘K`) indexing titles, descriptions, and article contents
- **SEO & Discovery**: Automated XML sitemap via `@nuxtjs/sitemap`, RSS 2.0 feed (`/rss.xml`), and OpenGraph metadata
- **Edge Deployment**: [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/) with sub-30ms global edge delivery

---

## Project Structure

```text
├── assets/
│   └── css/main.css           # Global tokens, typography, and axi.md styling
├── components/
│   ├── content/               # MDC custom Markdown components (simulators, canvas)
│   ├── layout/                # Editorial AppHeader, AppFooter, and SearchModal
│   └── ui/                    # Reusable components (ProjectCard, ThemeToggle)
├── composables/               # Vue composables (useSearch, useTheme)
├── content/
│   ├── blog/                  # Markdown posts with frontmatter metadata
│   └── projects/              # Project case studies and metadata
├── content.config.ts          # Nuxt Content v3 collection schemas (Zod)
├── nuxt.config.ts             # Nuxt configuration, fonts, meta, and modules
├── pages/
│   ├── index.vue              # Option 1 Direct Monograph Feed (content-first)
│   ├── about.vue              # Editorial background and engineering principles
│   ├── blog/                  # Chronological archive and reading views
│   └── projects/              # Project directory and technical deep-dives
├── tests/                     # Vitest unit tests
└── tailwind.config.ts         # Typography families, 2px radius, and color tokens
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 20.x`
- [pnpm](https://pnpm.io/) `>= 10.x`

### Installation

```bash
# Clone repository
git clone https://github.com/prostiate/blog.git
cd blog

# Install dependencies
pnpm install
```

### Local Development

```bash
# Start local development server with hot-reload
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Quality & Validation Suite

The project enforces strict code style, zero `any` TypeScript rules, and complete test suites:

```bash
# Run unit tests (Vitest)
pnpm test

# Run TypeScript typecheck (vue-tsc)
pnpm typecheck

# Lint check (ESLint)
pnpm lint

# Format check (Prettier)
pnpm format:check

# Auto-format codebase
pnpm format

# Prerender static output (.output/public)
pnpm generate

# Run full CI validation pipeline
pnpm validate
```

---

## Content Authoring

### Writing a Blog Post

Add a Markdown file to `content/blog/<slug>.md`:

```markdown
---
title: "Article Title in Title Case"
description: "A concise two-sentence summary of the article's core thesis."
date: "2026-08-15"
readTime: "8 min read"
tags: ["Systems", "Web Performance"]
featured: true
---

Your long-form prose begins here with classical paragraphs...
```

### Adding a Project

Add a Markdown file to `content/projects/<slug>.md`:

```markdown
---
title: "Project Name"
category: "Infrastructure"
description: "High-level summary of the system and architecture."
featured: true
order: 1
liveUrl: "https://example.com"
githubUrl: "https://github.com/prostiate/example"
tags: ["Nuxt", "Go", "Docker"]
problemSolved: "The specific architectural challenge addressed."
architecture:
  - "Distributed edge nodes on Cloudflare"
  - "Go-based microservice auth layer"
---
```

---

## Branch Protection & Contributing

The `main` branch is protected against direct pushes:

- All changes must be proposed via **Pull Requests**.
- Force pushes (`--force`) and branch deletions are disabled.
- Every PR must pass the `pnpm validate` suite (format, lint, tests, typecheck, static generation).

---

## Author

**Muhammad Irfan Kurniawan**  
_Senior Full Stack Engineer — Jakarta, Indonesia_

- Website: [irfankurniawan.com](https://irfankurniawan.com)
- GitHub: [@prostiate](https://github.com/prostiate)
- LinkedIn: [muhammad-irfan-kurniawan](https://www.linkedin.com/in/muhammad-irfan-kurniawan/)
- Email: [mail@irfankurniawan.com](mailto:mail@irfankurniawan.com)

---

## License

This project is licensed under the [MIT License](LICENSE).
