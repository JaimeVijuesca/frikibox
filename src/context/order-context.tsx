"use client"; // <- Esta línea debe ir al inicio del archivo

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";

interface CartItem {
  id: number | string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
  selectedSize?: string;
}

interface Order {
  id: number | string;
  date: string;
  status: string;
  paymentMethod: string;
  cart: CartItem[];
  total?: number;
  items: CartItem[];
}

interface OrderContextType {
  orders: Order[];
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  refreshOrders: async () => {},
});

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    if (!user?.uid) return; // solo si hay usuario
    try {
      const res = await fetch(
        `https://frikibox-backend.vercel.app/orders/my-orders?userId=${user.uid}`
      );

      const data = await res.json();

      const dataArray: Order[] = Array.isArray(data) ? data : data.orders ?? [];

      const ordersWithTotals = dataArray.map((order) => ({
        ...order,
        items: order.cart ?? [],
        total:
          order.cart?.reduce(
            (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
            0
          ) ?? 0,
      }));

      setOrders(ordersWithTotals);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <OrderContext.Provider value={{ orders, refreshOrders: fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
