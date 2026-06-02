import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/sections/hero';
import { ServicesSection } from '@/components/sections/services';
import { ProjectsSection } from '@/components/sections/projects';
import { BrandsSection } from '@/components/sections/brands';
import { ReviewsSection } from '@/components/sections/reviews';
import { AboutSection } from '@/components/sections/about';
import { ContactSection } from '@/components/sections/contact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Solar Panel Dealer & Installation Services in Lucknow | Gargee Solar Uttar Pradesh',
  description: 'Looking for reliable solar panel installation in Lucknow, Gorakhpur, Ayodhya, Barabanki, Bahraich, Gonda & Kushinagar? Get affordable rooftop solar installation, maintenance, repair & after-sales services from Gargee Solar.',
  keywords: [
    'solar panels Lucknow',
    'solar installation Uttar Pradesh',
    'solar dealer Lucknow',
    'rooftop solar system',
    'Gargee Solar ',
    'best solar panels UP',
    'solar installer Lucknow',
    'renewable energy Lucknow',
    'solar power installation',
    'solar panel vendor Uttar Pradesh',
    'grid-connected solar systems',
    'solar quotations Lucknow',
    'solar maintenance services',
    'green energy solutions UP',
    'solar panel price in Lucknow',
    'best solar company near me',
    'rooftop solar installation cost in Gorakhpur',
    'solar subsidy services in Uttar Pradesh',
    'home solar installation in Ayodhya',
    'commercial solar installation company in Barabanki',
    'solar repair near me',
    'solar maintenance company in Bahraich',
    'hybrid solar system dealer in Gonda',
    'solar battery replacement in Kushinagar'
  ],
  authors: [{ name: 'Gargee Solar' }],
  creator: 'Gargee Solar',
  publisher: 'Gargee Solar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://gargeesolar.in'), // Assuming domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Gargee Solar - Solar Panel Experts in Lucknow',
    description: 'Professional solar panel installation and dealer services in Lucknow, Uttar Pradesh. Quality solar solutions for your home and business.',
    url: 'https://gargeesolar.in',
    siteName: 'Gargee Solar',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/homeheroimage.jpg',
        width: 1200,
        height: 630,
        alt: 'Gargee Solar Panel Installation Services in Lucknow and Uttar Pradesh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Solar Panel Dealer & Installation Services in Lucknow | Gargee Solar Uttar Pradesh',
    description: 'Looking for reliable solar panel installation in Lucknow, Gorakhpur, Ayodhya, Barabanki, Bahraich, Gonda & Kushinagar? Get affordable rooftop solar installation, maintenance, repair & after-sales services.',
    images: [{ url: '/homeheroimage.jpg', alt: 'Gargee Solar Panel Installation Services in Lucknow and Uttar Pradesh' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add actual code
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Gargee Solar",
    "description": "Leading solar panel dealer and installer in Lucknow, Uttar Pradesh. Providing high-quality solar panels, installation services, and renewable energy solutions.",
    "url": "https://gargeesolar.in",
    "telephone": "+91-9695902026",
    "email": "gargeeenterprisesmld@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Lucknow",
      "addressLocality": "Lucknow",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.8467, // Lucknow coordinates
      "longitude": 80.9462
    },
    "openingHours": "Mo-Sa 09:00-18:00",
    "priceRange": "$$",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 26.8467,
        "longitude": 80.9462
      },
      "geoRadius": 100000 // 100km radius
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Solar Panel Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Solar Panel Installation",
            "description": "Professional installation of rooftop solar panels"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Solar System Maintenance",
            "description": "Maintenance and repair services for solar systems"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <BrandsSection />
        <ReviewsSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
