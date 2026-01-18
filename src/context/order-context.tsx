"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface OrderContextType {
  orders: any[];
  addOrder: (order: any) => void;
  clearOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<any[]>([]);

  // Cargar pedidos desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("orders");
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  }, []);

  // Guardar pedidos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: any) => {
    setOrders(prev => [order, ...prev]);
  };

  const clearOrders = () => {
    setOrders([]);
    localStorage.removeItem("orders");
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders debe usarse dentro de OrdersProvider");
  }
  return context;
}
