"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '../../components/ui/select';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { useCart } from '../../context/cart-context';
import { useToast } from "../../hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Skeleton } from '../../components/ui/skeleton';

// NOTA SEO: En Next.js App Router, los metadatos deben ir en un archivo de servidor (page.tsx).
// Si este archivo es tu page.tsx, deberías separar el cliente a un componente hijo.
// Pero aquí optimizo los textos para que Google los indexe mejor:

export default function ProductsPage() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFranchise, setSelectedFranchise] = useState<string>('all');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('https://frikibox-backend.vercel.app/products/all');
        if (!res.ok) throw new Error('Error al cargar productos');
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ... (groupedFranchises y filteredAndSortedProducts se mantienen igual)
  const groupedFranchises = useMemo(() => {
    if (!products) return {};
    const groups: Record<string, Set<string>> = {};
    products.forEach(p => {
        if (p.franchiseCategory && p.mainFranchise) {
            if (!groups[p.franchiseCategory]) {
                groups[p.franchiseCategory] = new Set();
            }
            groups[p.franchiseCategory].add(p.mainFranchise);
        }
    });
    for (const category in groups) {
      groups[category] = new Set(Array.from(groups[category]).sort());
    }
    return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)));
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];
    let productsToShow = products;
    if (selectedFranchise !== 'all') {
        productsToShow = products.filter(p => p.mainFranchise === selectedFranchise);
    }
    const filtered = productsToShow.filter(product => {
      const term = searchTerm.toLowerCase();
      return (
          product.name.toLowerCase().includes(term) ||
          product.tags?.some((tag: string) => tag.toLowerCase().includes(term))
      );
    });
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [products, searchTerm, selectedFranchise]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
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

  return (
    <section id="products" className="py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            {/* SEO: H1 con palabras clave transaccionales */}
            <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-fade-in-down">
              Merchandising Oficial y Regalos para Gamers
            </h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up">
              {/* SEO: Descripción rica en keywords de nicho */}
              Encuentra las mejores <strong>figuras de colección, Funko Pop y ropa geek</strong> de tus sagas favoritas. El catálogo más completo para coleccionistas de anime, series y videojuegos.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            <div className='relative flex-grow'>
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 <Select value={selectedFranchise} onValueChange={setSelectedFranchise} disabled={isLoading}>
                    <SelectTrigger className="pl-10">
                        {/* SEO: El placeholder ayuda a dar contexto */}
                        <SelectValue placeholder="Filtrar por saga (Marvel, Anime...)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las franquicias</SelectItem>
                        {Object.entries(groupedFranchises).map(([category, franchises]) => (
                            <SelectGroup key={category}>
                                <SelectLabel>{category}</SelectLabel>
                                {Array.from(franchises).map(franchise => (
                                    <SelectItem key={franchise} value={franchise}>{franchise}</SelectItem>
                                ))}
                            </SelectGroup>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    /* SEO: Placeholder que sugiere búsquedas populares */
                    placeholder="Buscar Funko, camisetas, tazas..."
                    className="w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                />
            </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} handleAddToCart={handleAddToCart} />
            ))}
            </div>
        ) : (
            <div className='text-center text-muted-foreground py-10 col-span-full'>
                No se han encontrado productos de esta temática. Intenta con otra búsqueda.
            </div>
        )}
      </div>
    </section>
  );
}

// -------------------- ProductCard con SEO en Imágenes --------------------
function ProductCard({ product, handleAddToCart }: { product: any, handleAddToCart: (e: React.MouseEvent, product: any) => void }) {
  const getButtonText = (product: any) => {
    if (product.category === 'clothing' || product.variants) return 'Ver detalles';
    return 'Comprar ahora';
  };

  return (
    <Link href={`/product/${product.id}`} passHref>
      <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
        <CardContent className="p-0 relative aspect-square">
          <Image
            src={product.image_url}
            /* SEO: Alt dinámico para que Google Imágenes te encuentre */
            alt={`${product.name} - Merchandising oficial ${product.mainFranchise || ''}`}
            fill
            className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105"
          />
          {product.image_url_back && (
            <Image
              src={product.image_url_back}
              alt={`${product.name} (vista trasera)`}
              fill
              className="object-cover w-full h-full transition-all duration-500 opacity-0 group-hover:opacity-100"
            />
          )}
        </CardContent>
        <CardHeader>
          {/* SEO: Usar una etiqueta de título para el nombre del producto es bueno para la jerarquía */}
          <CardTitle className="text-lg transition-colors group-hover:text-primary">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-between items-center mt-auto pt-4">
          <span className="text-lg font-bold">{product.price ? `${product.price.toFixed(2)}€` : '0.00€'}</span>
          <Button onClick={(e) => handleAddToCart(e, product)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {getButtonText(product)}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-lg shadow-lg flex flex-col h-full">
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
  );
}