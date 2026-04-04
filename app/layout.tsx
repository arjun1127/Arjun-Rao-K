import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className="intel-one-mono-300 antialiased"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
