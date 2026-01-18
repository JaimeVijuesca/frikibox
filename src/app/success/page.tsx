"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <section className="py-12 md:py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">¡Pago completado!</h1>
      <p className="mb-8">Gracias por tu compra. Tu pedido se ha procesado correctamente.</p>
      <Button onClick={() => router.push("/")} size="lg">
        Volver al inicio
      </Button>
    </section>
  );
}
