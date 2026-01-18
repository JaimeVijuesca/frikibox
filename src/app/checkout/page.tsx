"use client";

import { useCart } from "../../context/cart-context";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "../../hooks/use-toast";
import { Lock } from "lucide-react";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Datos del cliente
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // Redirigir al inicio si el carrito está vacío
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/");
    }
  }, [cart, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckout = async () => {
    // Validar campos
    if (!address.fullName || !address.street || !address.city || !address.postalCode || !address.country) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todos los campos de dirección",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Enviar carrito + dirección al backend
      const res = await fetch("http://localhost:3001/payments/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, address }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear la sesión de pago");
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No se recibió la URL de Stripe");
      }
    } catch (error: any) {
      toast({
        title: "Error al procesar el pago",
        description: error.message || "Ha ocurrido un error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Finalizar Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Resumen del pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Talla: {item.selectedSize}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {((item.price ?? 0) * item.quantity).toFixed(2)}€
                  </p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <p>Total</p>
                <p>{total.toFixed(2)}€</p>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de pago */}
          <Card>
            <CardHeader>
              <CardTitle>Proceder al Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Serás redirigido a la pasarela de pago segura de Stripe para
                completar tu compra.
              </p>

              {/* Formulario de dirección */}
              <div className="space-y-2">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nombre completo"
                  value={address.fullName}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Calle y número"
                  value={address.street}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Ciudad"
                  value={address.city}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Código postal"
                  value={address.postalCode}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="País"
                  value={address.country}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full"
                disabled={loading}
              >
                <Lock className="mr-2 h-5 w-5" />
                {loading ? "Procesando..." : `Pagar ${total.toFixed(2)}€`}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Pago seguro garantizado por Stripe.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
