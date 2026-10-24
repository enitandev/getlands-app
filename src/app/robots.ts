import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getlands.ng';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/explore',
          '/explore/*',
          '/partners',
          '/login',
          '/register',
          '/llms.txt',
          '/llms-full.txt',
        ],
        disallow: [
          '/admin/',
          '/admin/*',
          '/dashboard/',
          '/dashboard/*',
          '/agent/',
          '/agent/*',
          '/api/',
          '/*?*token=',
          '/*?*key=',
        ],
      },
      // Allow AI Search & LLM Engines to discover and cite Getlands
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'Google-Extended',
          'ClaudeBot',
          'Applebot-Extended',
          'CCBot',
          'cohere-ai',
        ],
        allow: [
          '/',
          '/explore',
          '/explore/*',
          '/partners',
          '/llms.txt',
          '/llms-full.txt',
        ],
        disallow: [
          '/admin/*',
          '/dashboard/*',
          '/agent/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
