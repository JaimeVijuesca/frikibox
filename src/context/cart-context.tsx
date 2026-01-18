"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { type ImagePlaceholder } from "../lib/placeholder-images";

interface CartItem extends ImagePlaceholder {
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ImagePlaceholder, selectedSize?: string) => void;
  increaseQuantity: (id: string | number, product?: ImagePlaceholder, size?: string) => void;
  decreaseQuantity: (id: string | number, size?: string) => void;
  removeItem: (id: string | number, size?: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// 🔧 CAMBIA ESTAS DOS URLS
const API_URL_GET = "http://localhost:3001/cart";   // GET /:uid
const API_URL_SAVE = "http://localhost:3001/cart";  // POST /:uid

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false); // evita guardar antes de cargar

  // ---------------------------------------------------------
  // 1️⃣ Cargar carrito al iniciar (visitante o usuario)
  // ---------------------------------------------------------
  useEffect(() => {
    // Esperar a que auth cargue
    if (user === undefined) return;

    // ❗ Si el usuario ha cerrado sesión → carrito vacío
    if (user === null) {
      setCart([]);
      setLoaded(true);
      return;
    }

    // Usuario logueado → cargar carrito del backend
    const loadUserCart = async () => {
      try {
        const res = await fetch(`${API_URL_GET}/${user.uid}`);
        const data = await res.json();

        const backendItems: CartItem[] = (data.items || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          selectedSize: item.selectedSize || "",
          quantity: item.quantity || 1,
        }));

        setCart(backendItems);
      } catch (err) {
        console.error("Error loading cart:", err);
        setCart([]);
      } finally {
        setLoaded(true);
      }
    };

    loadUserCart();
  }, [user]);

  // ---------------------------------------------------------
  // 2️⃣ Guardar carrito (solo cuando ya está cargado)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!loaded) return; // evita enviar [] al backend

    // Visitante → NO guardar nada (carrito vacío siempre)
    if (user === null) return;

    // Usuario → guardar en backend
    fetch(`${API_URL_SAVE}/${user!.uid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    }).catch(err => console.error("Error saving cart:", err));
  }, [cart, user, loaded]);

  // ---------------------------------------------------------
  // 3️⃣ Funciones del carrito
  // ---------------------------------------------------------
  const addToCart = (product: ImagePlaceholder, selectedSize = "") =>
    increaseQuantity(product.id, product, selectedSize);

  const increaseQuantity = (id: string | number, product?: ImagePlaceholder, size = "") => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id && i.selectedSize === size);
      if (existing)
        return prev.map(i =>
          i.id === id && i.selectedSize === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );

      if (product) return [...prev, { ...product, quantity: 1, selectedSize: size }];
      return prev;
    });
  };

  const decreaseQuantity = (id: string | number, size = "") => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id && i.selectedSize === size);
      if (!existing) return prev;

      if (existing.quantity > 1)
        return prev.map(i =>
          i.id === id && i.selectedSize === size
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );

      return prev.filter(i => !(i.id === id && i.selectedSize === size));
    });
  };

  const removeItem = (id: string | number, size = "") =>
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)));

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + (item.price ? item.price * item.quantity : 0), 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
