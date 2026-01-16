'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { type ImagePlaceholder } from '../lib/placeholder-images';

interface CartItem extends ImagePlaceholder {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ImagePlaceholder, selectedSize?: string) => void;
  increaseQuantity: (productId: string | number) => void;
  decreaseQuantity: (productId: string | number) => void;
  removeItem: (productId: string | number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: ImagePlaceholder, selectedSize?: string) => {
    increaseQuantity(product.id, product, selectedSize);
  };

  const increaseQuantity = (productId: string | number, product?: ImagePlaceholder, selectedSize?: string) => {
     setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      if (product) {
        return [...prevCart, { ...product, quantity: 1, selectedSize }];
      }
      return prevCart;
    });
  }

  const decreaseQuantity = (productId: string | number) => {
    setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === productId);
        if (existingItem && existingItem.quantity > 1) {
            return prevCart.map((item) =>
            item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );
        }
        // If quantity is 1, remove the item
        return prevCart.filter((item) => item.id !== productId);
    });
  };

  const removeItem = (productId: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
