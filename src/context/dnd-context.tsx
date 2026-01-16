'use client';

import React, { createContext, useContext, useState, ReactNode, DragEvent } from 'react';
import { type ImagePlaceholder } from '../lib/placeholder-images';
import { useToast } from '../hooks/use-toast';

export interface BoxItem {
    id: string;
    product: ImagePlaceholder & { selectedSize?: string };
    quantity: number;
}

interface DndContextType {
  draggedItem: ImagePlaceholder | null;
  setDraggedItem: (item: ImagePlaceholder | null) => void;
  boxItems: BoxItem[];
  setBoxItems: React.Dispatch<React.SetStateAction<BoxItem[]>>;
  addItemToBox: (product: ImagePlaceholder, selectedSize: string) => boolean;
  addDraggableItemToBox: (product: ImagePlaceholder) => boolean;
  removeItemFromBox: (id: string) => void;
  increaseItemQuantity: (id: string) => boolean;
  decreaseItemQuantity: (id: string) => void;
  getTotalItemsInBox: () => number;
}

const BOX_ITEM_LIMIT = 6;

const DndContext = createContext<DndContextType | undefined>(undefined);

export const DndProvider = ({ children }: { children: ReactNode }) => {
  const [draggedItem, setDraggedItem] = useState<ImagePlaceholder | null>(null);
  const [boxItems, setBoxItems] = useState<BoxItem[]>([]);

  const getTotalItemsInBox = () => {
    return boxItems.reduce((total, item) => total + item.quantity, 0);
  }

  const addItemToBox = (product: ImagePlaceholder, selectedSize: string): boolean => {
    const currentTotal = getTotalItemsInBox();
    if (currentTotal >= BOX_ITEM_LIMIT) {
        return false;
    }

    setBoxItems((prevItems) => {
      const id = `${product.id}-${selectedSize}`;
      const existingItem = prevItems.find((item) => item.id === id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { id, product: {...product, selectedSize}, quantity: 1 }];
    });
    return true;
  }

  const addDraggableItemToBox = (product: ImagePlaceholder): boolean => {
    const currentTotal = getTotalItemsInBox();
    if (currentTotal >= BOX_ITEM_LIMIT) {
        return false;
    }

    setBoxItems((prevItems) => {
      const id = String(product.id); // Non-clothing items don't have sizes
      const existingItem = prevItems.find((item) => item.id === id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { id, product, quantity: 1 }];
    });
    return true;
  }
  
  const removeItemFromBox = (id: string) => {
    setBoxItems((prevItems) => prevItems.filter(item => item.id !== id));
  }

  const increaseItemQuantity = (id: string): boolean => {
     const currentTotal = getTotalItemsInBox();
     if (currentTotal >= BOX_ITEM_LIMIT) {
        return false;
     }
     setBoxItems((prevItems) => prevItems.map(item => item.id === id ? {...item, quantity: item.quantity + 1} : item));
     return true;
  }

  const decreaseItemQuantity = (id: string) => {
    setBoxItems((prevItems) => {
      const itemToDecrease = prevItems.find(item => item.id === id);
      if (itemToDecrease && itemToDecrease.quantity > 1) {
        return prevItems.map(item => item.id === id ? {...item, quantity: item.quantity - 1} : item);
      }
      // if quantity is 1, remove it
      return prevItems.filter(item => item.id !== id);
    });
  }


  return (
    <DndContext.Provider value={{ 
      draggedItem, 
      setDraggedItem, 
      boxItems, 
      setBoxItems,
      addItemToBox,
      addDraggableItemToBox,
      removeItemFromBox,
      increaseItemQuantity,
      decreaseItemQuantity,
      getTotalItemsInBox,
    }}>
      {children}
    </DndContext.Provider>
  );
};

export const useDndContext = () => {
  const context = useContext(DndContext);
  if (!context) {
    throw new Error('useDndContext must be used within a DndProvider');
  }
  return context;
};

export const useDraggable = (item: ImagePlaceholder) => {
  const { draggedItem, setDraggedItem } = useDndContext();

  const dragStart = (e: DragEvent<HTMLDivElement>) => {
    if (item.category === 'clothing') {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(item);
  };
  
  const isDragging = (id: string) => String(draggedItem?.id) === id;

  return { dragStart, isDragging };
};

export const useDroppable = () => {
  const { draggedItem, setDraggedItem, addDraggableItemToBox } = useDndContext();
  const [isOver, setIsOver] = useState(false);
  const { toast } = useToast();

  const drop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedItem) {
      const success = addDraggableItemToBox(draggedItem);
      if (success) {
        toast({
          title: '¡Producto añadido!',
          description: `${draggedItem.name} se ha añadido a tu FrikiBox.`,
        });
      } else {
         toast({
          variant: 'destructive',
          title: '¡Caja llena!',
          description: 'Has alcanzado el límite de 6 productos por caja.',
        });
      }
      setDraggedItem(null);
    }
    setIsOver(false);
  };

  const dragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const dragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  return { drop, dragEnter, dragLeave, isOver };
};
