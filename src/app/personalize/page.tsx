"use client";

import React, { useState, useMemo, useEffect, use } from "react";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  ImagePlaceholder,
  PlaceHolderImages,
} from "../../lib/placeholder-images";
import {
  useDraggable,
  useDroppable,
  useDndContext,
} from "../../context/dnd-context";
import { cn } from "../../lib/utils";
import {
  ShoppingCart,
  Trash2,
  Search,
  Plus,
  Minus,
  X,
  Filter,
} from "lucide-react";
import { useCart } from "../../context/cart-context";
import { useToast } from "../../hooks/use-toast";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "../../components/ui/select";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { Skeleton } from "../../components/ui/skeleton";
import type { Metadata } from "next";



const ProductCard = ({ product }: { product: ImagePlaceholder }) => {
  const { dragStart, isDragging } = useDraggable(product);
  const { addItemToBox } = useDndContext();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { toast } = useToast();

  const handleAddClothing = () => {
    if (!selectedSize) {
      toast({
        variant: "destructive",
        title: "¡Selecciona una talla!",
        description: "Por favor, elige una talla para añadir el producto.",
      });
      return;
    }
    const success = addItemToBox(product, selectedSize);

    if (success) {
      toast({
        title: "¡Producto añadido!",
        description: `${product.name} (Talla: ${selectedSize}) se ha añadido a tu FrikiBox.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "¡Caja llena!",
        description: "Has alcanzado el límite de 6 productos por caja.",
      });
    }

    setPopoverOpen(false);
    setSelectedSize(null);
  };

  const isClothing = product.category === "clothing";

  if (isClothing) {
    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="cursor-pointer flex flex-col items-center gap-2">
            <Card className="w-full">
              <CardContent className="p-2 aspect-square relative">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain rounded-md"
                  data-ai-hint={product.imageHint}
                />
              </CardContent>
            </Card>
            <p className="text-xs font-medium text-center">{product.name}</p>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{product.name}</h4>
              <p className="text-sm text-muted-foreground">
                Selecciona una talla para añadirlo a la caja.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="size-select">Talla</Label>
              <Select onValueChange={setSelectedSize}>
                <SelectTrigger id="size-select">
                  <SelectValue placeholder="Elige..." />
                </SelectTrigger>
                <SelectContent>
                  {product.availableSizes?.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddClothing}>Añadir a la caja</Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div
      draggable
      onDragStart={dragStart}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-opacity flex flex-col items-center gap-2",
        isDragging(String(product.id)) ? "opacity-50" : "opacity-100"
      )}
    >
      <Card className="w-full">
        <CardContent className="p-2 aspect-square relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain rounded-md"
            data-ai-hint={product.imageHint}
          />
        </CardContent>
      </Card>
      <p className="text-xs font-medium text-center">{product.name}</p>
    </div>
  );
};

const ProductCardSkeleton = () => (
  <div className="flex flex-col items-center gap-2">
    <Skeleton className="w-full aspect-square" />
    <Skeleton className="h-4 w-10/12" />
  </div>
);

const BoxDroppable = () => {
  const {
    boxItems,
    setBoxItems,
    removeItemFromBox,
    increaseItemQuantity,
    decreaseItemQuantity,
  } = useDndContext();
  const { drop, dragEnter, dragLeave, isOver } = useDroppable();
  const { toast } = useToast();

  const handleClearBox = () => {
    setBoxItems([]);
  };

  const handleIncreaseQuantity = (id: string) => {
    const success = increaseItemQuantity(id);
    if (!success) {
      toast({
        variant: "destructive",
        title: "¡Caja llena!",
        description: "Has alcanzado el límite de 6 productos por caja.",
      });
    }
  };

  return (
    <div
      className="flex-grow flex flex-col relative p-4 border-4 border-dashed rounded-lg bg-card min-h-[300px] md:h-full"
      onDrop={drop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
    >
      <div
        className={cn(
          "absolute inset-0 bg-primary/10 transition-opacity pointer-events-none",
          isOver ? "opacity-100" : "opacity-0"
        )}
      />
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <h2 className="text-2xl font-headline font-bold">Tu FrikiBox</h2>
        {boxItems.length > 0 && (
          <Button variant="ghost" size="icon" onClick={handleClearBox}>
            <Trash2 className="h-5 w-5 text-destructive" />
            <span className="sr-only">Vaciar caja</span>
          </Button>
        )}
      </div>

      <div className="flex-grow pt-12 flex flex-col overflow-hidden">
        {boxItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <div className="relative w-48 h-48 mb-4">
              <Image
                src="/assets/caja-frikibox.png"
                alt="Caja FrikiBox"
                fill
                className="object-contain"
              />
            </div>
            <p className="font-bold">Arrastra productos aquí</p>
            <p className="text-sm">o haz clic en la ropa para añadirla</p>
          </div>
        ) : (
          <ScrollArea className="whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {boxItems.map(({ product, quantity, id }) => (
                <div
                  key={id}
                  className="relative aspect-square bg-white rounded-md p-1 group w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain"
                    data-ai-hint={product.imageHint}
                  />
                  <Badge
                    variant="secondary"
                    className="absolute top-1 right-1 z-10"
                  >
                    {product.selectedSize && `${product.selectedSize} `}x
                    {quantity}
                  </Badge>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 z-20">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white"
                        onClick={() => decreaseItemQuantity(id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white"
                        onClick={() => handleIncreaseQuantity(id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => removeItemFromBox(id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default function PersonalizePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFranchise, setSelectedFranchise] = useState<string>("all");
  const { boxItems, setBoxItems, getTotalItemsInBox } = useDndContext();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [productsLoading, setProductsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<ImagePlaceholder[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);

        const res = await fetch(`https://frikibox-backend.vercel.app/products/all`);

        if (!res.ok) {
          throw new Error("Error al cargar productos");
        }

        const data = await res.json();
        const mappedProducts = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          imageUrl: p.image_url, // 🔴 clave
          imageUrlBack: p.image_url_back,
          imageHint: p.image_hint ?? "product image",
          category: p.category,
          availableSizes: p.availableSizes,
          tags: p.tags,
          mainFranchise: p.main_franchise,
          stock: p.stock,
        }));

        setAllProducts(mappedProducts);
      } catch (error) {
        console.error(error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const groupedFranchises = useMemo(() => {
    if (!allProducts) return {};
    const groups: Record<string, Set<string>> = {};
    allProducts.forEach((p) => {
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
    return Object.fromEntries(
      Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
    );
  }, [allProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!allProducts) return [];

    let productsToShow = allProducts;
    if (selectedFranchise !== "all") {
      productsToShow = allProducts.filter(
        (p) => p.mainFranchise === selectedFranchise
      );
    }

    // Filter by search term
    const filtered = productsToShow.filter((product) => {
      const term = searchTerm.toLowerCase();
      const searchMatch =
        product.name.toLowerCase().includes(term) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(term));
      return searchMatch;
    });

    // Sort by name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [allProducts, searchTerm, selectedFranchise]);

  const total = boxItems.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  const handleAddBoxToCart = () => {
    if (boxItems.length === 0) {
      toast({
        variant: "destructive",
        title: "¡Caja vacía!",
        description:
          "Añade algunos productos a la caja antes de añadirla al carrito.",
      });
      return;
    }
    const customBox: ImagePlaceholder = {
      id: `custom-box-${new Date().getTime()}`,
      name: `FrikiBox Personalizada (${getTotalItemsInBox()} productos)`,
      price: total,
      imageUrl: "/assets/caja-frikibox.png",
      imageHint: "custom box",
      description: boxItems
        .map(
          (p) =>
            `${p.product.name}${
              p.product.selectedSize ? ` (${p.product.selectedSize})` : ""
            } (x${p.quantity})`
        )
        .join(", "),
    };

    const boxCartItem = {
      ...customBox,
      contains: boxItems,
    };

    addToCart(boxCartItem);

    toast({
      title: "¡FrikiBox añadida!",
      description: "Tu caja personalizada está en el carrito.",
    });
    setBoxItems([]);
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 flex-grow">
      <div className="container px-4 md:px-6 h-full flex flex-col">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-fade-in-down">
              Crea tu propia FrikiBox
            </h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up">
              Arrastra y suelta tus productos favoritos o haz clic para añadir
              ropa. Límite de 6 productos por caja.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 flex-grow">
          <div className="md:w-1/3 flex flex-col">
            <h2 className="text-2xl font-headline font-bold mb-4">
              Productos Disponibles
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Select
                  value={selectedFranchise}
                  onValueChange={setSelectedFranchise}
                  disabled={productsLoading}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Filtrar por saga..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las sagas</SelectItem>
                    {Object.entries(groupedFranchises).map(
                      ([category, franchises]) => (
                        <SelectGroup key={category}>
                          <SelectLabel>{category}</SelectLabel>
                          {Array.from(franchises).map((franchise) => (
                            <SelectItem key={franchise} value={franchise}>
                              {franchise}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar en la selección..."
                  className="w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={productsLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 overflow-y-auto pr-4 max-h-[50vh] md:max-h-none md:flex-grow">
              {productsLoading ? (
                Array.from({ length: 9 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              ) : filteredAndSortedProducts &&
                filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-3 text-center text-muted-foreground py-10">
                  No se encontraron productos.
                </div>
              )}
            </div>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <BoxDroppable />
            <div className="p-4 border-t mt-4 rounded-b-lg bg-card">
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Total Caja:</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <Button size="lg" className="w-full" onClick={handleAddBoxToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Añadir Caja al Carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
