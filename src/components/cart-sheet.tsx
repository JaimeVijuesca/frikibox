"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../context/cart-context";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { useRouter } from "next/navigation";

export default function CartSheet() {
  const {
    cart,
    total,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0 text-xs"
            >
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </Badge>
          )}
          <span className="sr-only">Carrito</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex-row items-center justify-between pr-6">
          <SheetTitle>Tu Carrito</SheetTitle>
          {cart.length > 0 && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearCart}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Vaciar Carrito</span>
            </Button>
          )}
        </SheetHeader>
        {cart.length > 0 ? (
          <>
            <ScrollArea className="flex-1 -mr-6">
              <div className="flex flex-col gap-6 py-6 pr-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.selectedSize && (
                        <p className="text-sm text-muted-foreground">
                          Talla: {item.selectedSize}
                        </p>
                      )}
                      <p className="text-sm font-medium">
                        {(item.price || 0).toFixed(2)}€
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            decreaseQuantity(item.id, item.selectedSize)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            increaseQuantity(
                              item.id,
                              undefined,
                              item.selectedSize
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-lg font-bold">
                        {((item.price || 0) * item.quantity).toFixed(2)}€
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id, item.selectedSize)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Quitar producto</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto space-y-4">
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <SheetClose asChild>
                <Button className="w-full" onClick={handleCheckout}>
                  Finalizar Compra
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-1 py-6">
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingCart className="h-24 w-24 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Tu carrito está vacío.
              </p>
              <p className="text-muted-foreground text-center text-sm">
                ¡Añade algunos productos para empezar!
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
