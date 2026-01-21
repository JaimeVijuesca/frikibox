"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { useToast } from "../hooks/use-toast";
import { useRouter } from 'next/navigation';
import { ImagePlaceholder, PlaceHolderImages } from '../lib/placeholder-images';
import { Skeleton } from './ui/skeleton';
import { useEffect, useState } from 'react';

export default function ProductGallery() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [images, setImages] = useState<ImagePlaceholder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Primeros 8 productos para la galería
    const galleryImages = PlaceHolderImages.filter(p => p.id.toString().startsWith('gallery-')).slice(0, 8);
    setImages(galleryImages);
    setIsLoading(false);
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: ImagePlaceholder) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.category === 'clothing' || product.variants) {
      router.push(`/product/${product.id}`);
      return;
    }

    addToCart(product);
    toast({
      title: "¡Añadido al carrito!",
      description: `${product.name} se ha añadido a tu carrito.`,
    });
  };

  const getButtonText = (product: ImagePlaceholder) =>
    product.category === 'clothing' || product.variants ? 'Ver Opciones' : 'Añadir';

  return (
    <section id="personalize" className="py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-headline font-bold animate-fade-in-down">
            Productos Estrella de FrikiBox
          </h2>
          <p className="max-w-2xl text-muted-foreground md:text-xl animate-fade-in-up">
            Descubre los artículos favoritos de nuestra comunidad friki: Funko Pops, camisetas y más.
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden rounded-xl shadow-lg flex flex-col h-full animate-pulse">
                <CardContent className="p-0 relative aspect-square">
                  <Skeleton className="w-full h-full" />
                </CardContent>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardFooter className="flex justify-between items-center mt-auto pt-4">
                  <Skeleton className="h-8 w-1/4" />
                  <Skeleton className="h-10 w-1/2" />
                </CardFooter>
              </Card>
            ))
          ) : (
            images.map((image, index) => (
              <Link key={image.id} href={`/product/${image.id}`} passHref>
                <Card
                  className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0 relative aspect-square">
                    {/* Imagen frontal */}
                    <Image
                      src={image.imageUrl}
                      alt={image.name}
                      fill
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      data-ai-hint={image.imageHint}
                    />
                    {/* Imagen trasera si existe */}
                    {image.imageUrlBack && (
                      <Image
                        src={image.imageUrlBack}
                        alt={`${image.name} (vista trasera)`}
                        fill
                        className="object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                  </CardContent>

                  <CardHeader>
                    <CardTitle className="text-lg font-bold transition-colors group-hover:text-primary">
                      {image.name}
                    </CardTitle>
                  </CardHeader>

                  <CardFooter className="flex justify-between items-center mt-auto pt-4">
                    <span className="text-xl font-bold text-primary">
                      {image.price ? `${image.price.toFixed(2)}€` : `Desde ${image.variants?.[0].price.toFixed(2)}€`}
                    </span>
                    <Button
                      onClick={(e) => handleAddToCart(e, image)}
                      className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-300 ease-in-out hover:scale-105"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {getButtonText(image)}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
