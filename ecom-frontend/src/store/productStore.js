import api from "../utils/Axios";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const productStore = create(
  persist((set) => ({
    products: [],
    product: null,

    fetchProducts: async (choice) => {
      try {
        const res = await api.get(`/products?choice=${choice}`);
        const data = res.data;
        set({ products: data });
      } catch (error) {
        toast.error(`An error occured during fetching products : ${error}`);
      }
    },

    fetchProductById: async (productId) => {
      try {
        console.log("product id : " + productId);
        set({ product: null });
        const res = await api.get(`/product/${productId}`);
        const data = res.data;
        set({ product: data });
      } catch (error) {
        toast.error(`No prpduct for given id found : ${error}`);
      }
    },
    fetchByMerchandise: async (term, choice) => {
      try {
        const res = await api.get(
          `/products/merchandise/${term}?choice=${choice}`
        );
        const data = res.data;
        productStore.setState({ products: data });
      } catch (error) {
        toast.error(`Error fetching merchandise products: ${error}`);
      }
    },

    

    submitReview: async (productId, data) => {
      try {
        const res = await api.post(`product/${productId}/review`, data);
        productStore.getState().fetchProductById(productId);
        toast.success("Review submitted successfully!");
        return { success: true };
      } catch (error) {
        toast.error(`An error occured during submitting review : ${error}`);
        return { success: false };
      }
    },
  }))
);

export default productStore;
