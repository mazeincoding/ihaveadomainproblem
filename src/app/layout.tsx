import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Domain Addiction Support Group",
  description:
    "Confess your domain buying addiction and join others in acknowledging the problem.",
  openGraph: {
    title: "Domain Addiction Support Group",
    description:
      "Confess your domain buying addiction and join others in acknowledging the problem.",
    url: "https://ihaveadomainproblem.com",
    siteName: "Domain Addiction Support Group",
    images: [
      {
        url: "https://ihaveadomainproblem.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Domain Addiction Support Group",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Domain Addiction Support Group",
    description:
      "Confess your domain buying addiction and join others in acknowledging the problem.",
    images: ["https://ihaveadomainproblem.com/og-image.png"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
