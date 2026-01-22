import type { Metadata } from "next";
import Image from "next/image"; // Importante para imágenes optimizadas
import { Toaster } from "../components/ui/toaster";
import Header from "../components/header";
import { CartProvider } from "../context/cart-context";
import { DndProvider } from "../context/dnd-context";
import { AuthProvider } from "../context/auth-context";
import { ThemeProvider } from "../context/theme-context";
import { OrderProvider } from "../context/order-context";
import "./globals.css";

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
    description: "Cajas frikis personalizadas y merchandising oficial.",
    url: "https://frikibox.vercel.app/",
    siteName: "FrikiBox",
    type: "website",
    images: [{ url: "/og-image.png" }],
  },
  // Esto asegura que el favicon se vea en todas las pestañas
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FrikiBox",
    "url": "https://frikibox.vercel.app",
    "logo": "https://frikibox.vercel.app/logo.png",
  };

  return (
    <html lang="es" suppressHydrationWarning> 
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* ... tus otros links de fuentes ... */}
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <DndProvider>
              <CartProvider>
                <OrderProvider>
                  <div className="flex flex-col min-h-[100dvh] relative">
                    

                    <Header />
                    
                    {/* main con flex-1 para que el contenido empuje el footer y no haya huecos blancos */}
                    <main className="flex-1 w-full flex flex-col overflow-x-hidden relative">
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