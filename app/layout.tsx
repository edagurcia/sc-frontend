import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/query-provider";
import { Geist_Mono, Outfit, Inter } from "next/font/google";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import "./globals.css";

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" });

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://smartcommunity.app",
  ),
  title:
    "SmartCommunity | Plataforma SaaS de Gestión, Cobros y Seguridad Comunitarios",
  description:
    "Plataforma integral para residenciales y condominios. Control de visitas con soporte delivery (PedidosYa), dashboard de garita, anuncios de la directiva y cobros automatizados.",
  icons: {
    icon: [
      {
        url: "/logo.png",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/logo.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/logo.png",
        type: "image/png",
      },
    ],
  },
  keywords: [
    "SmartCommunity",
    "Gestión de condominios",
    "Control de visitas",
    "Seguridad en garita",
    "PedidosYa delivery residencial",
    "Cobros comunitarios",
    "SaaS residencial",
  ],
  authors: [{ name: "SmartCommunity Inc." }],
  openGraph: {
    title: "SmartCommunity | Gestión, Cobros y Seguridad",
    description:
      "Simplifica el control de acceso a garitas, la entrega de deliveries y los anuncios comunitarios en tu residencial.",
    url: "https://smartcommunity.app",
    siteName: "SmartCommunity",
    images: [
      {
        url: "/smart_community_logo.png",
        width: 1200,
        height: 630,
        alt: "SmartCommunity Logo y Plataforma",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartCommunity | Gestión de Residenciales y Garita",
    description:
      "Control ágil de visitas, entregas de delivery express y comunicados oficiales.",
    images: ["/smart_community_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable,
        interHeading.variable,
      )}
    >
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" type="image/png" />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground">
        <QueryProvider>
          <Header />
          <div className="flex flex-1 flex-col">
            <ThemeProvider>{children}</ThemeProvider>
          </div>
          <Footer />
        </QueryProvider>

        <Toaster
          position="top-right"
          expand={true}
          closeButton={true}
          theme="system"
        />
      </body>
    </html>
  );
}
