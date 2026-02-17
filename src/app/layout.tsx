import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { SITE } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Prevent font-loading layout shift
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Premium Real Estate in Dubai`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Premium ready & near-handover properties in Dubai. Buy, sell, invest, and get free mortgage consultancy with Makanview Properties.",
  keywords: [
    "Dubai real estate",
    "property Dubai",
    "buy property Dubai",
    "ready properties Dubai",
    "near handover Dubai",
    "off-plan Dubai",
    "Dubai investment",
    "Makanview Properties",
    "Dubai apartments for sale",
    "Dubai villas",
    "Dubai property investment",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE.name,
    title: `${SITE.name} | Premium Real Estate in Dubai`,
    description:
      "Premium ready & near-handover properties in Dubai. Buy, sell, invest, and get free mortgage consultancy.",
    images: [{ url: "/qwerty.jpg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Premium Real Estate in Dubai`,
    description:
      "Premium ready & near-handover properties in Dubai. Buy, sell, invest, and get free mortgage consultancy.",
    images: ["/qwerty.jpg"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* DNS Prefetch for external services */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        {process.env.AWS_S3_CDN_URL && (
          <link rel="dns-prefetch" href={process.env.AWS_S3_CDN_URL} />
        )}
        {process.env.AWS_S3_BUCKET && (
          <link
            rel="dns-prefetch"
            href={`//${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION || "ap-south-1"}.amazonaws.com`}
          />
        )}
        {/* Preconnect to S3/CDN for faster image loading */}
        {process.env.AWS_S3_CDN_URL && (
          <link rel="preconnect" href={process.env.AWS_S3_CDN_URL} crossOrigin="anonymous" />
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-white text-zinc-900">
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </div>
      </body>
    </html>
  );
}
