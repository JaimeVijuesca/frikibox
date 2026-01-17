"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type ImagePlaceholder } from "../lib/placeholder-images";
import { useAuth } from "./auth-context";

interface CartItem extends ImagePlaceholder {
  quantity: number;
  selectedSize: string; // siempre una cadena
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ImagePlaceholder, selectedSize?: string) => void;
  increaseQuantity: (productId: string | number, product?: ImagePlaceholder, selectedSize?: string) => void;
  decreaseQuantity: (productId: string | number, selectedSize?: string) => void;
  removeItem: (productId: string | number, selectedSize?: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const API_URL = "http://localhost:3001/cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  // ---------- Cargar carrito desde backend ----------
  const loadCart = async () => {
    if (!user?.uid) return;

    try {
      const res = await fetch(`${API_URL}/${user.uid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Error fetching cart");

      const data = await res.json();

      // Normalizamos los datos: selectedSize siempre string, quantity >= 1
      const normalized = (data.items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        selectedSize: item.selectedSize || "",
        quantity: item.quantity || 1,
      }));

      setCart(normalized);
    } catch (error) {
      console.error("Load cart error:", error);
    }
  };

  // ---------- Guardar carrito en backend ----------
  const saveCartToAPI = async (items: CartItem[]) => {
    if (!user?.uid) return;
    try {
      await fetch(`${API_URL}/${user.uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
    } catch (error) {
      console.error("Save cart error:", error);
    }
  };

  // ---------- Efectos ----------
  useEffect(() => { loadCart(); }, [user?.uid]);
  useEffect(() => { if (user?.uid) saveCartToAPI(cart); }, [cart, user?.uid]);

  // ---------- Funciones del carrito ----------
  const addToCart = (product: ImagePlaceholder, selectedSize?: string) => {
    increaseQuantity(product.id, product, selectedSize);
  };

  const increaseQuantity = (productId: string | number, product?: ImagePlaceholder, selectedSize = "") => {
    setCart(prev => {
      const existing = prev.find(i => i.id === productId && i.selectedSize === selectedSize);
      if (existing) return prev.map(i => i.id === productId && i.selectedSize === selectedSize ? { ...i, quantity: i.quantity + 1 } : i);
      if (product) return [...prev, { ...product, quantity: 1, selectedSize }];
      return prev;
    });
  };

  const decreaseQuantity = (productId: string | number, selectedSize = "") => {
    setCart(prev => {
      const existing = prev.find(i => i.id === productId && i.selectedSize === selectedSize);
      if (!existing) return prev;
      if (existing.quantity > 1) return prev.map(i => i.id === productId && i.selectedSize === selectedSize ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter(i => !(i.id === productId && i.selectedSize === selectedSize));
    });
  };

  const removeItem = (productId: string | number, selectedSize = "") => {
    setCart(prev => prev.filter(i => !(i.id === productId && i.selectedSize === selectedSize)));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
