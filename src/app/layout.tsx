import type { Metadata } from "next";
import { Toaster } from "../components/ui/toaster";
import Header from "../components/header";
import { CartProvider } from "../context/cart-context";
import { DndProvider } from "../context/dnd-context";
import { AuthProvider } from "../context/auth-context";
import { ThemeProvider } from "../context/theme-context";
import { OrderProvider } from "../context/order-context";
import "./globals.css";

// 1. Configuración de Metadata con URL Base para la Etiqueta Canónica automática
export const metadata: Metadata = {
  metadataBase: new URL("https://frikibox.vercel.app"),
  alternates: {
    canonical: "/", 
  },
  title: "FrikiBox | Cajas Frikis Personalizadas y Regalos Geek",
  description:
    "Tu caja friki personalizada: Funko Pop, camisetas y accesorios de tus videojuegos, series y cómics favoritos.",
  openGraph: {
    title: "FrikiBox | Cajas Frikis Personalizadas y Regalos Geek",
    description: "Cajas frikis personalizadas y merchandising oficial de tus series y videojuegos favoritos.",
    url: "https://frikibox.vercel.app/",
    siteName: "FrikiBox",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Asegúrate de tener una imagen para compartir en redes
        width: 1200,
        height: 630,
        alt: "FrikiBox - Regalos Geek",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Esquemas de Schema.org para Google
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FrikiBox",
    "url": "https://frikibox.vercel.app",
    "logo": "https://frikibox.vercel.app/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hola@frikibox.com"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FrikiBox",
    "url": "https://frikibox.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://frikibox.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="es" suppressHydrationWarning> 
      <head>
        {/* Marcado de Datos Estructurados Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap"
          rel="stylesheet"
        />
        <meta
          name="google-site-verification"
          content="T1U4A58A9wSHXZA5dEONz58kmdWE0a5ZCMcxm_Cxa7c"
        />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="6b641f1c-c148-40be-9583-7fa9d05e7f92"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <AuthProvider>
            <DndProvider>
              <CartProvider>
                <OrderProvider>
                  {/* min-h-[100dvh] ayuda a que el layout siempre ocupe la pantalla real sin dejar huecos blancos */}
                  <div className="flex flex-col min-h-[100dvh]">
                    <Header />
                    {/* flex-1 asegura que el contenido empuje hacia abajo si es poco */}
                    <main className="flex-1 w-full h-full overflow-x-hidden relative bg-background">
                      {children}
                    </main>
                  </div>
                  <Toaster />
                </OrderProvider>
              </CartProvider>
            </DndProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}