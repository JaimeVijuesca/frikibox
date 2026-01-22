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
    canonical: "/", // Esto genera la etiqueta <link rel="canonical" href="..." />
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning> 
      {/* Cambiado lang="en" a "es" ya que tu web es en español, clave para SEO */}
      <head>
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
                  {/* h-full y flex-col aseguran que el footer (si añades uno) se quede abajo y no flote dejando blancos */}
                  <div className="flex flex-col min-h-[100dvh]">
                    <Header />
                    {/* Añadimos h-full para que el contenido principal siempre intente llenar el espacio */}
                    <main className="flex-1 w-full h-full overflow-x-hidden">
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