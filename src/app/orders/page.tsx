'use client';

import { useAuth } from '../../context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion"
import { Badge } from '../../components/ui/badge';
import { ShoppingBag, Package } from 'lucide-react';
import Loading from '../loading';

const mockOrders: any[] = [];


export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return <Loading />;
  }

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl flex items-center gap-3 animate-fade-in-down">
              <ShoppingBag className="h-10 w-10" />
              Mis Pedidos
            </h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up">
              Aquí puedes encontrar el historial de todas tus compras.
            </p>
          </div>
        </div>

        {mockOrders.length > 0 ? (
           <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto animate-fade-in">
            {mockOrders.map((order) => (
                <AccordionItem value={order.id} key={order.id}>
                    <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4 items-center">
                            <div className='text-left'>
                                <p className="font-bold text-lg">Pedido #{order.id}</p>
                                <p className="text-sm text-muted-foreground">Realizado el {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className='text-right'>
                                <p className="font-bold text-lg">{order.total.toFixed(2)}€</p>
                                <Badge variant={order.status === 'Entregado' ? 'secondary' : 'default'}>{order.status}</Badge>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-4">
                            <h4 className="font-semibold">Artículos del pedido:</h4>
                             {order.items.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-white">
                                        <Image src={item.imageUrl} alt={item.name} fill className="object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                           {item.selectedSize && `Talla: ${item.selectedSize} - `} Cantidad: {item.quantity}
                                        </p>
                                    </div>
                                    </div>
                                    <p className="font-medium">{((item.price || 0) * item.quantity).toFixed(2)}€</p>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        ) : (
          <Card className="w-full max-w-4xl mx-auto text-center py-16 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Todavía no has realizado ningún pedido.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
