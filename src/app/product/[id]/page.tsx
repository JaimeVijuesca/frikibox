"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "../../../context/cart-context";
import { useToast } from "../../../hooks/use-toast";
import { Button } from "../../../components/ui/button";
import { ShoppingCart, Truck, ShieldCheck, Star } from "lucide-react"; // Añadimos iconos de confianza
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { cn } from "../../../lib/utils";
import Link from "next/link";

// ... (interfaces se mantienen igual)

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
        const res = await fetch(`https://frikibox-backend.vercel.app/products/${id}`);
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

  if (loading) return <Skeleton />;
  if (!product) notFound();

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayDescription = selectedVariant ? selectedVariant.description : product.description;
  const displayName = selectedVariant ? selectedVariant.name : product.name;

  return (
    <section className="py-12 md:py-24">
      {/* SEO: JSON-LD para que Google muestre precio y stock en el buscador */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": displayName,
            "image": [product.image_url],
            "description": displayDescription,
            "brand": { "@type": "Brand", "name": product.mainFranchise || "FrikiBox" },
            "offers": {
              "@type": "Offer",
              "price": displayPrice,
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock",
              "url": `https://frikibox.vercel.app/product/${product.id}`
            }
          }),
        }}
      />

      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Imagen con Alt optimizado para Google Imágenes */}
          <div className="relative aspect-square">
            <Image
              src={product.image_url}
              alt={`${displayName} - Merchandising Oficial de ${product.mainFranchise || 'Cine y TV'}`}
              fill
              className="object-contain rounded-lg shadow-lg"
              priority
            />
            {product.image_url_back && (
              <Image
                src={product.image_url_back}
                alt={`${displayName} (Detalle trasero)`}
                fill
                className="object-contain rounded-lg shadow-lg absolute top-0 left-0 opacity-0 hover:opacity-100 transition-opacity"
              />
            )}
          </div>

          {/* Detalles */}
          <div className="flex flex-col justify-center space-y-6">
            <nav className="text-sm text-muted-foreground mb-2">
              <Link href="/products" className="hover:text-primary">Productos</Link> / {product.mainFranchise}
            </nav>
            
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                {displayName}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                  Producto Oficial
                </Badge>
                <div className="flex text-yellow-500"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
              </div>
              {displayPrice && (
                <p className="text-3xl font-bold mt-4 text-primary">
                  {displayPrice.toFixed(2)}€
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Descripción del producto</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {displayDescription || `Compra este fantástico ${displayName}. Ideal para coleccionistas y fans de ${product.mainFranchise}. Merchandising de alta calidad.`}
              </p>
            </div>

            {/* Tags (Keywords secundarias) */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Opciones de compra (Variantes/Tallas) */}
            <div className="pt-4 border-t">
              {product.variants ? (
                <div className="space-y-4">
                  <Label className="text-lg font-medium">Elige tu edición:</Label>
                  <RadioGroup
                    value={selectedVariant?.id}
                    onValueChange={(id) => setSelectedVariant(product.variants.find((v:any) => v.id === id))}
                    className="grid gap-3"
                  >
                    {product.variants.map((variant:any) => (
                      <Card key={variant.id} className={cn("cursor-pointer transition-all", selectedVariant?.id === variant.id && "border-primary ring-1 ring-primary")}>
                        <CardHeader className="flex flex-row items-center gap-4 p-4" onClick={() => setSelectedVariant(variant)}>
                          <RadioGroupItem value={variant.id} id={variant.id} />
                          <div className="flex-1 flex justify-between items-center">
                            <span className="font-medium">{variant.name}</span>
                            <span className="font-bold">{variant.price.toFixed(2)}€</span>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </RadioGroup>
                </div>
              ) : product.category === "clothing" && product.availableSizes ? (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="size-select" className="text-lg font-medium">Seleccionar Talla:</Label>
                  <Select onValueChange={setSelectedSize}>
                    <SelectTrigger id="size-select" className="w-[180px]">
                      <SelectValue placeholder="Elige tu talla" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.availableSizes.map((size:any) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>

            {/* Botón y Señales de Confianza (Keywords de conversión) */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full md:w-auto px-12 py-6 text-lg"
                onClick={() => {/* handleAddToCart logic */}}
                disabled={product.category === "clothing" && !selectedSize}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Añadir al carrito
              </Button>
              
              <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-primary" />
                  <span>Envío rápido 24/48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" />
                  <span>Pago 100% seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}