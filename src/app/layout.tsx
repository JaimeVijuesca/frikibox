import type { Metadata } from 'next';
import { Toaster } from "../components/ui/toaster"
import Header from '../components/header';
import { CartProvider } from '../context/cart-context';
import './globals.css';
import { DndProvider } from '../context/dnd-context';
import { AuthProvider } from '../context/auth-context';
import { ThemeProvider } from '../context/theme-context';

export const metadata: Metadata = {
  title: 'FrikiBox',
  description: 'Tu caja friki personalizada: Funko Pop, camisetas y accesorios de tus videojuegos, series y cómics favoritos.',
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <AuthProvider>
            <DndProvider>
              <CartProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
                <Toaster />
              </CartProvider>
            </DndProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
