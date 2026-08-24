# irfankurniawan.com - Personal Site & Engineering Blog

The developer-focused personal website, portfolio, and technical blog of **Muhammad Irfan Kurniawan** (Senior Full Stack Engineer, Jakarta).

## Architecture & Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3, TypeScript, Composition API)
- **Content Engine**: [`@nuxt/content`](https://content.nuxt.com/) with Markdown Components (MDC)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom **Warm Monochrome** design system
- **Interactive Visualizations**: [Three.js](https://threejs.org/) for local-first node topology and interactive storage I/O simulators
- **SEO & Discovery**: Automated XML sitemaps via `@nuxtjs/sitemap`, RSS feed (`/rss.xml`), and OpenGraph tags
- **Hosting & Edge**: [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/) (zero cold-starts, sub-30ms global latency)

---

## Design Philosophy: High-Legibility Minimalist (Warm Monochrome)

- **Light Mode**: Warm paper alabaster background (`#FAF9F5`) paired with deep zinc ink (`#1C1917`).
- **Dark Mode**: Soft charcoal background (`#121214`) paired with muted off-white text (`#EDEDED`).
- **Reading Column**: Constrained strictly to `65ch` - `68ch` with `1.75` line-height for optimal eye comfort.
- **Subtle Separators**: Low-contrast borders (`#E6E3DA` light, `#242429` dark).

---

## Development

```bash
# Install dependencies
pnpm install

# Start local dev server
pnpm dev

# Build / Pre-render static site
pnpm generate

# Preview local build
pnpm preview

# Deploy to Cloudflare Workers production
pnpm deploy
```

---

## Author

- **Muhammad Irfan Kurniawan** - Senior Full Stack Engineer
- **Email**: mail@irfankurniawan.com
- **Website**: https://irfankurniawan.com
- **GitHub**: https://github.com/prostiate
- **LinkedIn**: https://www.linkedin.com/in/muhammad-irfan-kurniawan/
