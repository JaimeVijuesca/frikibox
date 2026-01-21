import type { Metadata } from "next";
import { Toaster } from "../components/ui/toaster";
import Header from "../components/header";
import { CartProvider } from "../context/cart-context";
import { DndProvider } from "../context/dnd-context";
import { AuthProvider } from "../context/auth-context";
import { ThemeProvider } from "../context/theme-context";
import { OrderProvider } from "../context/order-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "FrikiBox | Cajas Frikis Personalizadas y Regalos Geek",
  description:
    "Tu caja friki personalizada: Funko Pop, camisetas y accesorios de tus videojuegos, series y cómics favoritos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        <meta name="google-site-verification" content="T1U4A58A9wSHXZA5dEONz58kmdWE0a5ZCMcxm_Cxa7c" />
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
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1">{children}</main>
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
