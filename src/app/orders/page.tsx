"use client";

import { useAuth } from "../../context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Badge } from "../../components/ui/badge";
import { ShoppingBag } from "lucide-react";
import Loading from "../loading";
import { useOrders } from "../../context/order-context";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { orders } = useOrders();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) return <Loading />;

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingBag className="h-10 w-10" />
            Mis Pedidos
          </h1>
          <p className="text-muted-foreground md:text-xl">
            Aquí puedes ver el historial de tus compras.
          </p>
        </div>

        {orders.length > 0 ? (
          <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
            {orders.map((order) => (
              <AccordionItem value={order.id} key={order.id}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4 items-center">
                    <div className="text-left">
                      <p className="font-bold text-lg">Pedido #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Realizado el {order.date ? new Date(order.date).toLocaleDateString() : "-"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {(order.total ?? 0).toFixed(2)}€
                      </p>
                      <Badge variant={order.status === "Entregado" ? "secondary" : "default"}>
                        {order.status ?? "Pendiente"}
                      </Badge>
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
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.selectedSize && `Talla: ${item.selectedSize} - `}
                              Cantidad: {item.quantity}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Precio unitario: {(item.price ?? 0).toFixed(2)}€
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          {((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}€
                        </p>
                      </div>
                    ))}

                    <hr className="my-2" />

                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{(order.total ?? 0).toFixed(2)}€</span>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Método de pago: {order.paymentMethod ?? "Tarjeta"}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card className="w-full max-w-4xl mx-auto text-center py-16">
            <CardHeader>
              <CardTitle>No has realizado pedidos aún</CardTitle>
            </CardHeader>
          </Card>
        )}
      </div>
    </section>
  );
}
