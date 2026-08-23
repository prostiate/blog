import fs from 'node:fs'
import path from 'node:path'

interface RssItem {
  title: string
  path: string
  description: string
  date: string
}

export default defineEventHandler((event) => {
  const contentDir = path.resolve(process.cwd(), 'content/blog')
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.md'))

  const items: RssItem[] = []

  for (const file of files) {
    const filePath = path.join(contentDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const slug = file.replace(/\.md$/, '')

    if (content.startsWith('---')) {
      const parts = content.split('---', 2)
      if (parts[1]) {
        const lines = parts[1].split('\n')
        let title = ''
        let description = ''
        let date = ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith('title:')) {
            title = trimmed.replace(/^title:\s*/, '').replace(/^["']|["']$/g, '')
          } else if (trimmed.startsWith('description:')) {
            description = trimmed.replace(/^description:\s*/, '').replace(/^["']|["']$/g, '')
          } else if (trimmed.startsWith('date:')) {
            date = trimmed.replace(/^date:\s*/, '').replace(/^["']|["']$/g, '')
          }
        }

        if (title) {
          items.push({
            title,
            path: `/blog/${slug}`,
            description,
            date: date || '2026-08-23'
          })
        }
      }
    }
  }

  // Sort by date descending
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Muhammad Irfan Kurniawan - Technical Blog</title>
    <link>https://irfankurniawan.com</link>
    <description>Engineering deep dives on browser performance, local-first systems, and infrastructure.</description>
    <language>en</language>
    ${items
      .map(
        (doc) => `
    <item>
      <title><![CDATA[${doc.title}]]></title>
      <link>https://irfankurniawan.com${doc.path}</link>
      <description><![CDATA[${doc.description}]]></description>
      <pubDate>${new Date(doc.date).toUTCString()}</pubDate>
      <guid>https://irfankurniawan.com${doc.path}</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'text/xml')
  return feed
})
