import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/Axios";
import { toast } from "sonner";

const orderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,

      fetchOrders: async () => {
        set({ loading: true });
        try {
          const res = await api.get("/orders");
          set({ orders: res.data, loading: false });
        } catch (error) {
          set({ loading: false });
          toast.error("Failed to fetch orders: " + (error?.response?.data?.message || error.message));
        }
      },

      placeOrder: async (paymentMethod ) => {
        try {
          const res = await api.post("/order", null, {
            params: { paymentMethod },
          });
          if (res.data==true) {
            toast.success("Order placed successfully!");
            await get().fetchOrders();
            return true;
          }
        } catch (error) {
          toast.error("Failed to place order: " + (error?.response?.data?.message || error.message));
          return false;
        }
      },

      cancelOrder: async (orderId) => {
        try {
          const res = await api.patch(`/orders/cancel/${orderId}`);
          if (res.status === 200) {
            toast.success("Order cancelled and refund initiated");
            await get().fetchOrders();
            return true;
          }
        } catch (error) {
          toast.error("Cancel failed: " + (error?.response?.data?.message || error.message));
          return false;
        }
      },
    }),
    {
      name: "order-store",
    }
  )
);

export default orderStore;
