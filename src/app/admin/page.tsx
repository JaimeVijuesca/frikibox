'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { UploadCloud, PlusCircle, Edit, Trash2, ImagePlus } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { useRouter } from 'next/navigation';
import Loading from '../loading';
import { ImagePlaceholder, PlaceHolderImages } from '../../lib/placeholder-images';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Image from 'next/image';
import { Skeleton } from '../../components/ui/skeleton';

export default function AdminPage() {
  const { user, loading: userLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<ImagePlaceholder[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && (!user || !user.isAdmin)) {
      router.push('/');
    }
    // Load products from local JSON, filtering out design assets
    const productItems = PlaceHolderImages.filter(
      p => p.id !== 'hero' && p.id !== 'founder-photo'
    );
    setProducts(productItems);
    setProductsLoading(false);
  }, [user, userLoading, router]);


  const handleAction = () => {
    toast({
      variant: 'destructive',
      title: 'Función deshabilitada',
      description: 'La gestión de productos no está disponible sin una base de datos.',
    });
  }

  const getDisplayPrice = (product: ImagePlaceholder) => {
    if (product.price) return `${product.price.toFixed(2)}€`;
    if (product.variants && product.variants.length > 0) {
      const minPrice = Math.min(...product.variants.map(v => v.price));
      return `Desde ${minPrice.toFixed(2)}€`;
    }
    return 'N/A';
  }

  if (userLoading || !user || !user.isAdmin) return <Loading />;

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                <UploadCloud className="h-6 w-6" /> Gestión de Productos
              </CardTitle>
              <CardDescription>Visualización de productos. La edición está deshabilitada.</CardDescription>
            </div>
            <Button onClick={handleAction} disabled>
              <PlusCircle className="mr-2 h-5 w-5" /> Añadir Producto
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsLoading && Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className='w-16 h-16 rounded-md'/></TableCell>
                    <TableCell><Skeleton className='h-4 w-48 rounded'/></TableCell>
                    <TableCell><Skeleton className='h-4 w-16 rounded'/></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className='h-8 w-8 rounded'/>
                        <Skeleton className='h-8 w-8 rounded'/>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!productsLoading && products?.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="rounded-md object-cover" />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                          <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{getDisplayPrice(product)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={handleAction} disabled>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleAction} disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!productsLoading && products?.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p>No hay productos definidos en el archivo local.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
