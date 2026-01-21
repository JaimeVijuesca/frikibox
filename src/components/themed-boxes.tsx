"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Package } from 'lucide-react';
import { ImagePlaceholder, PlaceHolderImages } from '../lib/placeholder-images';
import { Skeleton } from './ui/skeleton';
import { useEffect, useState } from 'react';

const themedBoxId = "themed-box-zelda";

export default function ThemedBoxes() {
  const [themedBox, setThemedBox] = useState<ImagePlaceholder | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const box = PlaceHolderImages.find(p => p.id === themedBoxId);
    setThemedBox(box);
    setIsLoading(false);
  }, []);

  if (isLoading) return <ThemedBoxesSkeleton />;

  if (!themedBox) return null;

  const startingPrice = themedBox.variants?.reduce((min, v) => (v.price < min ? v.price : min), themedBox.variants[0].price);

  return (
    <section id="themed-boxes" className="py-16 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 space-y-2">
          <h2 className="text-3xl sm:text-5xl font-headline font-bold animate-fade-in-down">
            Nuestras Cajas Temáticas
          </h2>
          <p className="max-w-2xl text-muted-foreground md:text-xl animate-fade-in-up">
            Elige tu tema favorito y déjate sorprender con tu FrikiBox personalizada.
          </p>
        </div>

        {/* Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link href={`/product/${themedBox.id}`} passHref>
            <Card className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full max-w-sm mx-auto">
              <CardContent className="relative aspect-square p-0">
                <Image
                  src={themedBox.imageUrl}
                  alt={`Caja temática ${themedBox.name}`}
                  fill
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={themedBox.imageHint}
                />
              </CardContent>
              <CardHeader>
                <CardTitle className="text-lg font-bold">{themedBox.name}</CardTitle>
              </CardHeader>
              <CardFooter className="flex justify-between items-center mt-auto pt-4">
                {startingPrice && (
                  <span className="text-xl font-bold text-primary">Desde {startingPrice.toFixed(2)}€</span>
                )}
                <Button className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-300 ease-in-out hover:scale-105">
                  <Package className="h-4 w-4" />
                  Ver Opciones
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Skeleton separado para limpieza
function ThemedBoxesSkeleton() {
  return (
    <section id="themed-boxes" className="py-12 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-xl shadow-lg max-w-sm mx-auto">
              <CardContent className="p-0 relative aspect-square">
                <Skeleton className="w-full h-full" />
              </CardContent>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardFooter className="flex justify-between items-center mt-auto pt-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-10 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
