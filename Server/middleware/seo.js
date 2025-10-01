const seoMiddleware = (req, res, next) => {
  // Add SEO-related headers
  res.setHeader('X-Robots-Tag', 'index, follow');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Add security headers
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Add performance headers
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  next();
};

// SEO helper functions
const generateStructuredData = (type, data) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type
  };
  
  return { ...baseData, ...data };
};

const generatePropertyStructuredData = (property) => {
  return generateStructuredData("Apartment", {
    name: property.title,
    description: property.description,
    image: property.images ? property.images[0] : null,
    address: {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": "Trassaco",
      "addressRegion": "Greater Accra",
      "addressCountry": "GH"
    },
    numberOfRooms: property.bedrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      "value": property.size_sqft,
      "unitCode": "SQF"
    },
    priceRange: "$$$",
    amenityFeature: property.amenities ? property.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    })) : []
  });
};

const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return generateStructuredData("BreadcrumbList", {
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  });
};

const generateOrganizationStructuredData = () => {
  return generateStructuredData("Organization", {
    name: "Westbury Homes",
    url: "https://westburyhomes.com",
    logo: "https://westburyhomes.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      "telephone": "+233-20-123-4567",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    sameAs: [
      "https://www.facebook.com/luxuryapartmentsaccra",
      "https://www.instagram.com/luxuryapartmentsaccra",
      "https://www.linkedin.com/company/luxuryapartmentsaccra"
    ]
  });
};

// SEO meta tag generator
const generateMetaTags = (pageData) => {
  const {
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    structuredData = null
  } = pageData;

  const siteName = 'Westbury Homes';
  const siteUrl = 'https://luxuryapartmentsaccra.com';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image ? `${siteUrl}${image}` : `${siteUrl}/og-image.jpg`;

  return {
    title: fullTitle,
    description,
    keywords,
    canonical: fullUrl,
    og: {
      type,
      url: fullUrl,
      title: fullTitle,
      description,
      image: fullImage,
      siteName
    },
    twitter: {
      card: 'summary_large_image',
      url: fullUrl,
      title: fullTitle,
      description,
      image: fullImage
    },
    structuredData
  };
};

module.exports = {
  seoMiddleware,
  generateStructuredData,
  generatePropertyStructuredData,
  generateBreadcrumbStructuredData,
  generateOrganizationStructuredData,
  generateMetaTags
};

