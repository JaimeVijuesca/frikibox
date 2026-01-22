"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../../../context/cart-context";
import { useToast } from "../../../hooks/use-toast";
import { Button } from "../../../components/ui/button";
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  Star,
  ChevronLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { cn } from "../../../lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://frikibox-backend.vercel.app/products/${id}`,
        );
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err: any) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) notFound();

  const handleAddToCart = () => {
    if (!product) return;
    let productToAdd: any;
    let sizeInfo: string | undefined = undefined;
    let toastDescription: string;

    if (product.variants && selectedVariant) {
      productToAdd = {
        ...product,
        id: selectedVariant.id,
        name: selectedVariant.name,
        price: selectedVariant.price,
        imageUrl: product.image_url,
      };
      toastDescription = `${selectedVariant.name} añadido.`;
    } else if (product.category === "clothing" && selectedSize) {
      sizeInfo = selectedSize;
      productToAdd = {
        ...product,
        id: `${product.id}-${selectedSize}`,
        imageUrl: product.image_url,
      };
      toastDescription = `${product.name} (Talla: ${selectedSize}) añadido.`;
    } else {
      productToAdd = { ...product, imageUrl: product.image_url };
      toastDescription = `${product.name} añadido.`;
    }

    if (product.category === "clothing" && !selectedSize) {
      toast({ variant: "destructive", title: "Elige una talla" });
      return;
    }

    addToCart(productToAdd, sizeInfo);
    toast({ title: "¡Añadido!", description: toastDescription });
  };

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayDescription = selectedVariant
    ? selectedVariant.description
    : product.description;
  const displayName = selectedVariant ? selectedVariant.name : product.name;

  return (
    // Reducimos el padding vertical y usamos min-h de forma controlada
    <section className="py-6 md:py-12 bg-background min-h-[70vh]">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Botón de volver atrás para mejorar UX */}
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Volver a productos
        </Link>

        {/* items-start es la clave para evitar el hueco blanco gigante */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* LADO IZQUIERDO: IMAGEN (Sticky para que no se mueva al hacer scroll en texto largo) */}
          <div className="md:sticky md:top-24">
            <div className="relative aspect-square w-full max-w-[500px] mx-auto overflow-hidden rounded-xl bg-white shadow-sm border">
              <Image
                src={product.image_url}
                alt={displayName}
                fill
                className="object-contain p-4"
                priority
              />
              {product.image_url_back && (
                <Image
                  src={product.image_url_back}
                  alt="Vista trasera"
                  fill
                  className="object-contain p-4 absolute top-0 left-0 opacity-0 hover:opacity-100 transition-opacity bg-white"
                />
              )}
            </div>
          </div>

          {/* LADO DERECHO: DETALLES */}
          <div className="flex flex-col space-y-6">
            <div>
              <Badge
                variant="outline"
                className="mb-2 uppercase tracking-widest text-[10px]"
              >
                {product.mainFranchise || product.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">
                {displayName}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-3xl font-extrabold text-primary">
                  {displayPrice ? `${displayPrice.toFixed(2)}€` : "---"}
                </span>
                <div className="flex text-yellow-500 items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">
                    (Oficial)
                  </span>
                </div>
              </div>
            </div>

            <div className="prose prose-sm text-muted-foreground">
              <h3 className="text-foreground font-semibold mb-1">
                Sobre este producto:
              </h3>
              <p className="leading-relaxed">{displayDescription}</p>
            </div>

            {/* OPCIONES */}
            <div className="space-y-4 pt-4 border-t">
              {product.variants ? (
                <div className="grid gap-3">
                  <Label className="font-bold">Selecciona una opción:</Label>
                  <RadioGroup
                    value={selectedVariant?.id}
                    onValueChange={(id) =>
                      setSelectedVariant(
                        product.variants.find((v: any) => v.id === id),
                      )
                    }
                  >
                    {product.variants.map((variant: any) => (
                      <div
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all",
                          selectedVariant?.id === variant.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "hover:bg-accent",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value={variant.id} />
                          <span className="text-sm font-medium">
                            {variant.name}
                          </span>
                        </div>
                        <span className="font-bold text-sm">
                          {variant.price.toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ) : product.category === "clothing" && product.availableSizes ? (
                <div className="space-y-2">
                  <Label className="font-bold">Talla disponible:</Label>
                  <Select onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Escoger talla" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.availableSizes.map((size: string) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>

            {/* ACCIÓN Y CONFIANZA */}
            <div className="flex flex-col gap-4 pt-2">
              <Button
                size="lg"
                className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20"
                onClick={handleAddToCart}
                disabled={product.category === "clothing" && !selectedSize}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Añadir al carrito
              </Button>

              <div className="grid grid-cols-2 gap-4 text-[13px] border-t pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>
                    {product.category === "clothing"
                      ? "Entrega estimada: 5-7 días hábiles" // Las camisetas suelen tardar más
                      : "Envío estimado: 3-5 días hábiles"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span>Garantía Oficial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Skeleton ajustado para no crear huecos
function ProductDetailSkeleton() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
