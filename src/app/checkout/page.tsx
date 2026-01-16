'use client';

import { useCart } from '../../context/cart-context';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '../../hooks/use-toast';
import { Lock } from 'lucide-react';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart }),
        });

        if (response.ok) {
            const { url } = await response.json();
            window.location.href = url;
            clearCart();
        } else {
            throw new Error('Failed to create checkout session');
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudo iniciar el proceso de pago. Inténtalo de nuevo.',
        });
        setLoading(false);
    }
  };


  if (cart.length === 0) {
    if (typeof window !== 'undefined') router.push('/');
    return null;
  }

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <h1 className="text-3xl font-bold text-center mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Resumen del pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{((item.price ?? 0) * item.quantity).toFixed(2)}€</p>
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
            <CardContent>
                <p className="text-muted-foreground">
                    Serás redirigido a la pasarela de pago segura de Stripe para completar tu compra.
                </p>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button onClick={handleCheckout} size="lg" className="w-full" disabled={loading}>
                  <Lock className="mr-2 h-5 w-5" />
                  {loading ? 'Procesando...' : `Pagar ${total.toFixed(2)}€`}
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
