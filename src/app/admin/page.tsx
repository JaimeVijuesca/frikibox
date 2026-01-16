"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { UploadCloud, PlusCircle, Edit, Trash2, ImagePlus } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import Loading from "../loading";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Skeleton } from "../../components/ui/skeleton";

interface Product {
  id: string | number;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  availableSizes?: string[];
  image_url: string;
  image_url_back?: string;
  tags?: string[];
}

export default function AdminPage() {
  const { user, loading: userLoading } = useAuth();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Modal / Nuevo Producto
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    imageHint: "",
    price: 0,
    category: "clothing",
    availableSizes: [] as string[],
    imageUrl: null as File | null,
    imageUrlBack: null as File | null,
    tag: [] as string[],
  });

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  // ----- Cargar productos desde la API -----
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch("http://localhost:3001/products/all");
      if (!res.ok) throw new Error("Error al cargar productos");
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
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const res = await fetch("http://localhost:3001/products/all");
        if (!res.ok) throw new Error("Error al cargar productos");
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
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ----- Funciones de acción -----
  const handleSizeToggle = (size: string) => {
    setNewProduct((prev) => {
      const sizes = prev.availableSizes.includes(size)
        ? prev.availableSizes.filter((s) => s !== size)
        : [...prev.availableSizes, size];
      return { ...prev, availableSizes: sizes };
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.imageUrl) {
      toast({
        variant: "destructive",
        title: "Debes subir la imagen principal",
      });
      return;
    }

    setLoadingAction(true);
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("imageHint", newProduct.imageHint);
      formData.append("price", String(newProduct.price));
      formData.append("category", newProduct.category);
      formData.append(
        "availableSizes",
        JSON.stringify(newProduct.availableSizes)
      );
      formData.append("tags", JSON.stringify(newProduct.tag));

      if (newProduct.imageUrl) formData.append("imageUrl", newProduct.imageUrl);
      if (newProduct.imageUrlBack)
        formData.append("imageUrlBack", newProduct.imageUrlBack);

      const res = await fetch("http://localhost:3001/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Error al crear el producto");
      }

      const createdProduct = await res.json();
      setProducts((prev) => [...prev, createdProduct]);
      toast({ title: "Producto añadido correctamente" });
      setNewProduct({
        name: "",
        imageHint: "",
        description: "",
        price: 0,
        category: "clothing",
        availableSizes: [],
        imageUrl: null,
        imageUrlBack: null,
        tag: [],
      });
      setModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    try {
      const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error eliminando producto");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Producto eliminado" });
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  const handleEditProduct = (id: string | number) => {
    toast({ title: "Editar producto deshabilitado por ahora" });
  };

  if (userLoading || !user || !user.isAdmin) return <Loading />;

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UploadCloud className="h-6 w-6" /> Gestión de Productos
          </h1>
          <Button onClick={() => setModalOpen(true)}>
            <PlusCircle className="mr-2 h-5 w-5" /> Añadir Producto
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {product.price ? `${product.price}€` : "N/A"}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {product.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-200 rounded-full text-sm mr-1"
                    >
                      {tag}
                    </span>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* ----- Modal Añadir Producto ----- */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form
              onSubmit={handleAddProduct}
              className="bg-white p-6 rounded-md w-full max-w-lg space-y-4 overflow-y-auto max-h-[90vh]"
            >
              {/* ... Aquí va el formulario exactamente igual que antes ... */}
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
