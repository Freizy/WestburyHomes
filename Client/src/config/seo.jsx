// SEO Configuration for Westbury Homes

export const siteConfig = {
  name: "Westbury Homes - Luxury Apartments in Accra",
  url: "https://westburyhomes.com",
  description:
    "Discover Westbury Homes in Accra, Ghana — premium apartments and villas designed for modern living. Experience comfort, elegance, and world-class service.",
  keywords:
    "westbury homes, luxury apartments accra, premium accommodation ghana, high-end apartments accra, luxury living ghana, serviced apartments accra, villas east legon",
  image: "/og-image.jpg",
  logo: "/logo.png",
  phone: "+233-20-123-4567",
  email: "info@westburyhomes.com",
  address: {
    street: "Westbury Homes, Trassaco",
    city: "East Legon",
    region: "Greater Accra",
    country: "Ghana",
    postalCode: "00233",
  },
  coordinates: {
    latitude: 5.56,
    longitude: -0.2057,
  },
  social: {
    instagram: "https://www.instagram.com/westburyhomes",
    linkedin: "https://www.linkedin.com/company/westburyhomes",
    twitter: "https://twitter.com/westburyhomes",
  },
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: "Westbury Homes – Luxury Apartments in Accra",
    description:
      "Welcome to Westbury Homes. Explore luxury apartments and villas in Accra, Ghana. Premium amenities, secure living, and world-class comfort for families and executives.",
    keywords:
      "westbury homes accra, luxury apartments ghana, serviced apartments accra, premium accommodation ghana, villas east legon",
    url: "/",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  },

  properties: {
    title: "Westbury Homes – Premium Properties in Accra",
    description:
      "Browse our collection of luxury apartments and villas at Westbury Homes, Accra. From modern studios to spacious family residences, find your perfect home today.",
    keywords:
      "westbury homes properties, luxury apartments accra, villas ghana, serviced apartments east legon, premium accommodation accra",
    url: "/properties",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Westbury Homes Properties in Accra",
      description: "Collection of premium luxury apartments and villas in Accra, Ghana",
    },
  },

  about: {
    title: "About Westbury Homes",
    description:
      "Learn about Westbury Homes, Accra’s premier luxury accommodation provider. Discover our commitment to elegant design, premium service, and modern living.",
    keywords:
      "about westbury homes, luxury apartments accra, premium housing ghana, villas east legon",
    url: "/about",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.logo}`,
      description: "Accra’s premier provider of luxury apartments and villas",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "customer service",
        availableLanguage: "English",
      },
    },
  },

  contact: {
    title: "Contact Westbury Homes",
    description:
      "Get in touch with Westbury Homes. Contact us for bookings, property viewings, or to learn more about our luxury apartments and villas in Accra, Ghana.",
    keywords:
      "contact westbury homes, apartments booking accra, property inquiries ghana, villas east legon contact",
    url: "/contact",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Westbury Homes",
      url: `${siteConfig.url}/contact`,
      mainEntity: {
        "@type": "Organization",
        name: siteConfig.name,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: siteConfig.phone,
          email: siteConfig.email,
          contactType: "customer service",
        },
      },
    },
  },

  booking: {
    title: "Book Your Stay at Westbury Homes",
    description:
      "Book your luxury apartment or villa at Westbury Homes, Accra. Easy online booking, secure payments, and guaranteed comfort.",
    keywords:
      "book westbury homes, luxury apartments booking accra, villa rental accra, serviced apartment booking ghana",
    url: "/booking",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ReservationPage",
      name: "Book Westbury Homes Accommodation",
      url: `${siteConfig.url}/booking`,
      mainEntity: {
        "@type": "Hotel",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    },
  },
};

// Property-specific SEO generator
export const generatePropertySEO = (property) => {
  const propertyUrl = `/properties/${property.id}`;

  return {
    title: `${property.title} – Westbury Homes`,
    description: property.description,
    keywords: `${property.title.toLowerCase()}, westbury homes accra, luxury apartment ghana, ${property.bedrooms} bedroom villa accra`,
    url: propertyUrl,
    image: property.images ? property.images[0] : siteConfig.image,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Apartment",
      name: property.title,
      description: property.description,
      image: property.images
        ? property.images[0]
        : `${siteConfig.url}${siteConfig.image}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: property.address,
        addressLocality: "Accra",
        addressRegion: "Greater Accra",
        addressCountry: "GH",
      },
      numberOfRooms: property.bedrooms,
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.size_sqft,
        unitCode: "SQF",
      },
      priceRange: "$$$",
      amenityFeature: property.amenities
        ? property.amenities.map((amenity) => ({
            "@type": "LocationFeatureSpecification",
            name: amenity,
            value: true,
          }))
        : [],
    },
  };
};

// Breadcrumb generator
export const generateBreadcrumbs = (path) => {
  const breadcrumbs = [{ name: "Home", url: "/" }];

  const pathParts = path.split("/").filter((part) => part);

  pathParts.forEach((part, index) => {
    const name =
      part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");
    const url = "/" + pathParts.slice(0, index + 1).join("/");
    breadcrumbs.push({ name, url });
  });

  return breadcrumbs;
};

// Structured data for breadcrumbs
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.url}`,
    })),
  };
};

// FAQ structured data
export const generateFAQStructuredData = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

// Local business structured data
export const generateLocalBusinessStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    image: `${siteConfig.url}${siteConfig.image}`,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
      postalCode: siteConfig.address.postalCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.coordinates.latitude,
      longitude: siteConfig.coordinates.longitude,
    },
    openingHours: "Mo-Su 00:00-23:59",
    priceRange: "$$$",
    sameAs: Object.values(siteConfig.social),
  };
};
