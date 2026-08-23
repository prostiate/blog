import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        readTime: z.string(),
        tags: z.array(z.string()),
        featured: z.boolean().optional()
      })
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        title: z.string(),
        category: z.string(),
        description: z.string(),
        featured: z.boolean().optional(),
        order: z.number().optional(),
        liveUrl: z.string().nullable().optional(),
        githubUrl: z.string().nullable().optional(),
        tags: z.array(z.string()).optional(),
        problemSolved: z.string().optional(),
        architecture: z.array(z.string()).optional()
      })
    })
  }
})
