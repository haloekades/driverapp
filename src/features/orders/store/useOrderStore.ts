import { create } from "zustand";
import { Order } from "../api/orderAPI";

interface OrderState {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  selectedOrder: null,
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}));