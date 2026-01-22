import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { PlaceHolderImages } from '../lib/placeholder-images';

export default function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white py-0 overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          /* SEO: Alt optimizado con palabras clave de búsqueda */
          alt="Caja regalo friki personalizada con Funko Pop y merchandising de anime"
          fill
          className="object-cover -z-10 scale-105"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/60 -z-10" />
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="space-y-4">
            <h1
              className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter animate-fade-in-down"
              style={{ animationDelay: '0.2s' }}
            >
              {/* SEO: H1 con intención de búsqueda clara: Caja Regalo + Friki */}
              La Caja Regalo Friki y Mystery Box que tú Diseñas
            </h1>
            <p
              className="mx-auto max-w-[700px] text-lg md:text-xl animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              {/* SEO: Párrafo con keywords de alto volumen: Regalo original, anime, merchandising */}
              Crea tu propia <strong>caja sorpresa personalizada</strong> con Funkos, camisetas y merchandising oficial de tus series, anime y videojuegos favoritos. ¡El regalo geek más original, listo para enviar!
            </p>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-300 ease-in-out hover:scale-105"
            >
              {/* SEO: El texto del botón ahora es una acción con palabra clave */}
              <Link href="/personalize">Personalizar mi Caja Sorpresa</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}