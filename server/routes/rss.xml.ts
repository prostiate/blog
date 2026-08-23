export default defineEventHandler(async (event) => {
  const docs = await queryCollection(event, 'blog')
    .order('date', 'DESC')
    .all()

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Muhammad Irfan Kurniawan - Technical Blog</title>
    <link>https://irfankurniawan.com</link>
    <description>Engineering deep dives on browser performance, local-first systems, and infrastructure.</description>
    <language>en</language>
    ${docs.map(doc => `
    <item>
      <title><![CDATA[${doc.title}]]></title>
      <link>https://irfankurniawan.com${doc.path}</link>
      <description><![CDATA[${doc.description}]]></description>
      <pubDate>${new Date(doc.date).toUTCString()}</pubDate>
      <guid>https://irfankurniawan.com${doc.path}</guid>
    </item>`).join('')}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'text/xml')
  return feed
})
