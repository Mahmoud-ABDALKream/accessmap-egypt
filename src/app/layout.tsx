import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://accessmap-egypt.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AccessMap Egypt — Accessibility Map for Egyptian Cities",
    template: "%s | AccessMap Egypt",
  },
  description:
    "A crowdsourced platform to discover, rate, and review the physical accessibility of public places in Alexandria, Cairo, and Giza for people with mobility, visual, and wheelchair-related disabilities.",
  keywords: [
    "accessibility",
    "Egypt",
    "Alexandria",
    "Cairo",
    "Giza",
    "wheelchair",
    "disability",
    "map",
    "crowdsource",
    "إمكانية الوصول",
    "مصر",
    "الإسكندرية",
    "القاهرة",
    "الجيزة",
    "كرسي متحرك",
    "إعاقة",
    "خريطة",
  ],
  authors: [{ name: "AccessMap Egypt Team" }],
  creator: "AccessMap Egypt",
  publisher: "AccessMap Egypt",
  applicationName: "AccessMap Egypt",
  category: "Accessibility",
  classification: "Community Service",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_EG",
    url: siteUrl,
    siteName: "AccessMap Egypt",
    title: "AccessMap Egypt — Accessibility Map for Egyptian Cities",
    description:
      "Discover, rate, and review the physical accessibility of public places in Alexandria, Cairo, and Giza. Helping people with disabilities navigate Egyptian cities.",
    images: [
      {
        url: "/og-image.png",
        width: 1344,
        height: 768,
        alt: "AccessMap Egypt — Accessibility Map for Egyptian Cities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AccessMap Egypt — Accessibility Map for Egyptian Cities",
    description:
      "Discover, rate, and review the physical accessibility of public places in Egypt for people with disabilities.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-1024.png", type: "image/png", sizes: "1024x1024" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "1024x1024", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

// JSON-LD structured data for the website
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AccessMap Egypt",
  alternateName: "خريطة الوصول مصر",
  url: siteUrl,
  description:
    "A crowdsourced platform to discover, rate, and review the physical accessibility of public places in Alexandria, Cairo, and Giza for people with mobility, visual, and wheelchair-related disabilities.",
  applicationCategory: "CommunityApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EGP",
  },
  author: {
    "@type": "Organization",
    name: "AccessMap Egypt",
  },
  inLanguage: ["en", "ar"],
  keywords:
    "accessibility, Egypt, Alexandria, Cairo, Giza, wheelchair, disability, map, crowdsource",
  featureList: [
    "Interactive accessibility map",
    "Crowdsourced ratings",
    "Wheelchair accessibility scores",
    "Bilingual English/Arabic",
    "Community reviews",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <meta name="theme-color" content="#0d9488" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
