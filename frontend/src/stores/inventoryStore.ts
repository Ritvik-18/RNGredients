import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InventoryItem } from '../types';

interface InventoryStore {
  items: InventoryItem[];
  setItems: (items: InventoryItem[]) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, patch: Partial<InventoryItem>) => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set) => ({
      items: [],
      setItems: (items) => set({ items }),
      addItem: (item) => set((s) => ({ items: [...s.items, item] })),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateItem: (id, patch) => set((s) => ({
        items: s.items.map((i) => i.id === id ? { ...i, ...patch } : i),
      })),
    }),
    { name: 'rngredients-inventory' },
  ),
);
