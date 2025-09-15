import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  const today = new Date()
  const lastModified = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/extract`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/interpolate`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Tutorial Pages
    {
      url: `${baseUrl}/tutorials`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tutorials/extract-single-frame`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tutorials/double-frame-rate`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Feature & Use Case Pages
    {
      url: `${baseUrl}/features`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/use-cases`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Support Pages
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
