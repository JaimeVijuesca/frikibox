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

  if (isLoading) {
    return (
      <section id="themed-boxes" className="py-12 md:py-24 lg:py-32 bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div className="grid grid-cols-1 justify-center">
            <Card className="overflow-hidden rounded-lg shadow-lg max-w-sm mx-auto">
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
          </div>
        </div>
      </section>
    );
  }

  if (!themedBox) return null;

  const startingPrice = themedBox.variants?.reduce((min, v) => v.price < min ? v.price : min, themedBox.variants[0].price);

  return (
    <section id="themed-boxes" className="py-12 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-fade-in-down">Nuestras Cajas Temáticas</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up">
              Elige tu tema favorito y déjate sorprender.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link href={`/product/${themedBox.id}`} passHref>
              <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full group max-w-sm mx-auto">
                <CardContent className="p-0 relative aspect-square">
                  <Image
                    src={themedBox.imageUrl}
                    alt={themedBox.name}
                    fill
                    className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105"
                    data-ai-hint={themedBox.imageHint}
                  />
                </CardContent>
                <CardHeader>
                  <CardTitle className="text-lg">{themedBox.name}</CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-between items-center mt-auto pt-4">
                  {startingPrice && <span className="text-xl font-bold">Desde {startingPrice.toFixed(2)}€</span>}
                  <Button>
                    <Package className="mr-2 h-4 w-4" />
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
