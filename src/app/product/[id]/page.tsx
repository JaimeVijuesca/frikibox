'use client';

import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '../../../context/cart-context';
import { useToast } from '../../../hooks/use-toast';
import { PlaceHolderImages, ImagePlaceholder } from '../../../lib/placeholder-images';
import {
  Button
} from '../../../components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { Card, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import { cn } from '../../../lib/utils';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<ImagePlaceholder | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = () => {
      setLoading(true);
      const foundProduct = PlaceHolderImages.find(p => String(p.id) === id);

      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          setSelectedVariant(foundProduct.variants[0]);
        }
      } else {
        setProduct(null);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    let productToAdd: any;
    let sizeInfo: string | undefined = undefined;
    let toastDescription: string;

    if (product.variants && selectedVariant) {
      productToAdd = {
        ...product,
        id: selectedVariant.id,
        name: selectedVariant.name,
        price: selectedVariant.price,
        description: selectedVariant.description,
        variants: undefined,
      };
      toastDescription = `${selectedVariant.name} se ha añadido al carrito.`;
    } else if (product.category === 'clothing' && selectedSize) {
      sizeInfo = selectedSize;
      productToAdd = {
        ...product,
        id: `${product.id}-${selectedSize}`,
      };
      toastDescription = `${product.name} (Talla: ${selectedSize}) se ha añadido al carrito.`;
    } else {
      productToAdd = product;
      toastDescription = `${product.name} se ha añadido al carrito.`;
    }

    if (product.category === 'clothing' && !selectedSize) {
      toast({
        variant: 'destructive',
        title: '¡Selecciona una talla!',
        description: 'Por favor, elige una talla antes de añadir el producto al carrito.',
      });
      return;
    }

    addToCart(productToAdd, sizeInfo);
    toast({
      title: '¡Añadido al carrito!',
      description: toastDescription,
    });
  };

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayDescription = selectedVariant ? selectedVariant.description : product.description;
  const displayName = selectedVariant ? selectedVariant.name : product.name;

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Imagen */}
          <div className="relative aspect-square">
            <Image
              src={product.imageUrl || '/placeholder.png'}
              alt={displayName}
              fill
              className="object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Detalles */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">{displayName}</h1>
              {displayPrice && <p className="text-2xl font-bold mt-2">{displayPrice.toFixed(2)}€</p>}
            </div>

            <p className="text-muted-foreground text-lg">{displayDescription || 'No hay descripción disponible.'}</p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}

            {/* Variantes */}
            {product.variants ? (
              <RadioGroup
                value={selectedVariant?.id}
                onValueChange={(variantId) => {
                  const newVariant = product.variants?.find(v => v.id === variantId);
                  setSelectedVariant(newVariant || null);
                }}
                className="grid gap-4"
              >
                <Label className="text-lg font-medium">Opciones:</Label>
                {product.variants.map((variant) => (
                  <Card
                    key={variant.id}
                    className={cn(
                      'cursor-pointer',
                      selectedVariant?.id === variant.id && 'border-primary ring-2 ring-primary'
                    )}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                      <RadioGroupItem value={variant.id} id={variant.id} />
                      <div className="w-full">
                        <div className="flex justify-between items-baseline">
                          <CardTitle className="text-base">{variant.name}</CardTitle>
                          <p className="font-bold text-base">{variant.price.toFixed(2)}€</p>
                        </div>
                        <CardDescription className="text-xs">{variant.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </RadioGroup>
            ) : product.category === 'clothing' && product.availableSizes ? (
              <div className="flex items-center gap-4">
                <Label htmlFor="size-select" className="text-lg font-medium">Talla:</Label>
                <Select onValueChange={setSelectedSize}>
                  <SelectTrigger id="size-select" className="w-[120px]">
                    <SelectValue placeholder="Elige..." />
                  </SelectTrigger>
                  <SelectContent>
                    {product.availableSizes.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {/* Botón de añadir al carrito */}
            <div className="flex items-center gap-4">
              <Button size="lg" onClick={handleAddToCart} disabled={product.category === 'clothing' && !selectedSize}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Añadir al carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Skeleton mientras carga
function ProductDetailSkeleton() {
  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex flex-col justify-center space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    </section>
  );
}
