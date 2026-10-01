import type { Metadata } from "next";
import { Instrument_Serif, Manrope, IBM_Plex_Mono } from "next/font/google";
import "@designcodeio/threeui/style.css";
import "./components/shaders/threeui.css";
import "./globals.css";
import { LangProvider } from "./i18n/LangContext";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://arjunrao.dev"),
  title: {
    default: "ARJUN RAO | Creative Developer",
    template: "%s | ARJUN RAO",
  },
  description: "Arjun Rao | Creative Developer Portfolio showcasing interactive engineering, backend systems, and AI integration by Arjun Rao K.",
  keywords: ["Arjun Rao", "Arjun Rao K", "Arjun K Rao", "Vercel Arjun Rao", "Creative Developer", "Frontend Engineer", "Backend Developer", "Three.js", "React", "Next.js", "Portfolio"],
  authors: [{ name: "Arjun Rao" }],
  creator: "Arjun Rao",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "ARJUN RAO | Creative Developer Portfolio",
    description: "Creative Developer Portfolio showcasing interactive engineering, backend systems, and AI integration by Arjun Rao.",
    siteName: "ARJUN RAO Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARJUN RAO | Creative Developer Portfolio",
    description: "Creative Developer Portfolio showcasing interactive engineering, backend systems, and AI integration by Arjun Rao.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Arjun Rao",
  url: "https://arjunrao.dev",
  jobTitle: "Creative Developer",
  description: "Creative Developer Portfolio showcasing interactive engineering, backend systems, and AI integration.",
  sameAs: [
    "https://github.com/arjun1127",
    "https://www.linkedin.com/in/arjun-rao-1520a424a",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${manrope.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <meta name="google-site-verification" content="5b8FMYqjuYv6KfdBzeOECG5sVU7eLSYhnTV6uIIOft4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
