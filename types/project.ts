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
