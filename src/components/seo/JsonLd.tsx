import React from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://getlands.ng';

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'RealEstateAgent'],
    name: 'Getlands Limited',
    alternateName: ['Getlands', 'Getlands Nigeria', 'Getlands Real-Asset Marketplace'],
    url: BASE_URL,
    logo: `${BASE_URL}/assets/getlands-logo.png`,
    image: `${BASE_URL}/assets/images/hero-farmland.jpg`,
    description: 'Getlands is Nigeria’s leading physical real-asset marketplace, enabling direct investments in verified freehold land, managed agricultural commodity trading cycles, and structured land banking.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3rd Floor, Okedara Building, Beside Jendol Superstores, Alakuko',
      addressLocality: 'Alakuko',
      addressRegion: 'Lagos State',
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '6.6804',
      longitude: '3.2562',
    },
    telephone: '+2349133485636',
    email: 'hello@getlands.ng',
    currenciesAccepted: 'NGN',
    priceRange: '₦₦₦',
    areaServed: [
      { '@type': 'Country', name: 'Nigeria' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
    ],
    sameAs: [
      'https://twitter.com/getlands_ng',
      'https://www.instagram.com/getlands.ng',
      'https://www.linkedin.com/company/getlands',
      'https://wa.me/2349133485636',
    ],
    knowsAbout: [
      'Real Estate Investment in Nigeria',
      'Agricultural Land Co-ownership',
      'Agricultural Commodity Trading (Tomato, Pepper, Garri)',
      'Land Banking Schemes',
      'Title Verification and Deed of Assignment',
      'Diaspora Real Estate Investments in Nigeria',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Getlands Investment Portfolios',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Freehold Land Ownership',
          description: '100% verified physical land with Deed of Assignment and beacon-pegged survey plans in Ogun State and Lagos.',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Short-Cycle Agricultural Commodity Trading',
          description: 'Short 30 to 90-day cycles in tomato, pepper, and garri produce aggregation with fixed return distributions.',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Strategic Land Banking',
          description: '12 to 24-month structured land banking projects in high-growth infrastructure corridors.',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Getlands',
    alternateName: 'Getlands Real-Asset Marketplace',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/explore?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Getlands and how does the platform work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Getlands is Nigeria’s premier real-asset marketplace specializing in verified freehold land, managed agricultural commodity trading cycles, and structured land banking. Users browse verified opportunities, subscribe with clear terms, track performance via a secure dashboard, and receive automated profits and principal returns directly to their bank accounts.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Getlands verify land titles and ensure security of ownership?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every land parcel on Getlands undergoes rigorous legal and physical due diligence. Land is perimeter-surveyed with registered boundary beacons, vetted through relevant state ministries of land and registry archives, and confirmed free from government acquisition or traditional encumbrances. Upon purchase, investors receive an official Allocation Letter, survey plan coordinates, and a legally binding Deed of Assignment.',
        },
      },
      {
        '@type': 'Question',
        name: 'What returns can I earn from agricultural commodity trading cycles?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our agricultural trading cycles (covering commodities like fresh tomatoes, pepper, and garri) operate across fixed 30, 60, or 90-day intervals with defined historical returns between 5% and 20% per cycle. Trading cycles are 100% physically backed by crop aggregation and off-take agreements with commercial food processors and open markets.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can Nigerians in the diaspora invest on Getlands?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Getlands is built for both Nigerian residents and international diaspora investors across the UK, US, Canada, Europe, and worldwide. Diaspora clients can browse live opportunities, fund their accounts, track their assets digitally, inspect survey coordinates, and receive payouts directly to their local Nigerian bank accounts.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do payouts and withdrawal settlements work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'On the contractual maturity date of your opportunity or commodity cycle, your returns and principal capital are automatically credited to your secure Getlands wallet. You can request a withdrawal at any time, which is processed directly to your linked, verified Nigerian commercial bank account.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is structured land banking and how does it generate returns?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Land banking on Getlands involves acquiring strategic parcels of land in high-growth corridors (such as Abeokuta and Epe growth axes) for fixed 12 to 24-month durations. Investors benefit from projected appreciation driven by infrastructural development and expanding urban corridors, with a defined exit schedule.',
        },
      },
      {
        '@type': 'Question',
        name: 'What documents do I receive upon acquiring land on Getlands?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Upon full payment clearance, investors receive an official Allocation Letter confirming plot boundaries, a certified Perimeter Survey Plan with registered beacon numbers, a Purchase Receipt, and an executed Deed of Assignment signed by Getlands Limited legal representatives.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the Getlands Partner and Agent Network work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Getlands Partner Network enables certified real estate and financial sales agents to earn attractive commissions (up to 10% on direct purchases) by introducing clients to verified land and commodity opportunities. Agents receive real-time CRM tracking, branded marketing resources, and instant commission payouts upon transaction clearance.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  category,
  slug,
}: {
  name: string;
  description: string;
  image?: string;
  price: number;
  category: string;
  slug: string;
}) {
  const url = `${BASE_URL}/explore/${slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image || `${BASE_URL}/assets/images/hero-farmland.jpg`,
    url,
    category,
    brand: {
      '@type': 'Brand',
      name: 'Getlands',
    },
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
      url,
      seller: {
        '@type': 'Organization',
        name: 'Getlands Limited',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ItemListJsonLd({
  items,
}: {
  items: { name: string; url: string; image?: string; price: number; description?: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Getlands Real-Asset Marketplace Listings',
    description: 'Active freehold land, agricultural commodity trading cycles, and land banking opportunities in Nigeria.',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        description: item.description,
        image: item.image || `${BASE_URL}/assets/images/hero-farmland.jpg`,
        url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
        offers: {
          '@type': 'Offer',
          price: item.price.toString(),
          priceCurrency: 'NGN',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
