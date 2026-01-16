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
          alt={heroImage.description || 'Fondo de FrikiBox'}
          fill
          className="object-cover -z-10 scale-105"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60 -z-10" />
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
              🎁 ¡Bienvenido a FrikiBox!
            </h1>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Tu caja friki personalizada: Funko Pop, camisetas y accesorios de tus videojuegos, series y cómics favoritos.
            </p>
          </div>
          <p className="text-lg md:text-xl font-medium animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            📦 Personaliza tu caja y recíbela lista para regalar.
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-300 ease-in-out hover:scale-105">
              <Link href="/personalize">Reservar mi FrikiBox</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
