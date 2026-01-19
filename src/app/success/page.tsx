"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../components/ui/button";
import { useOrders } from "../../context/order-context";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addOrder } = useOrders();

  useEffect(() => {
    if (!sessionId) return;

    console.log("Stripe sessionId:", sessionId);

    fetch(`https://frikibox-backend.vercel.app/checkout-session?sessionId=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        addOrder(data); // Guardar el pedido en el contexto
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return <p className="text-center py-24">Cargando pedido...</p>;
  }

  if (!order) {
    return <p className="text-center py-24">No se pudo cargar el pedido</p>;
  }

  return (
    <section className="py-12 md:py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">¡Pago completado!</h1>

      <p className="mb-6">Gracias por tu compra.</p>

      <div className="max-w-md mx-auto mb-8 text-left">
        <h2 className="font-semibold mb-2">Resumen del pedido</h2>

        {order.items?.map((item: any, index: number) => (
          <div key={index} className="flex justify-between">
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>{item.amount} €</span>
          </div>
        ))}

        <hr className="my-2" />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{order.total} €</span>
        </div>
      </div>

      <Button onClick={() => router.push("/")} size="lg">
        Volver al inicio
      </Button>
    </section>
  );
}
