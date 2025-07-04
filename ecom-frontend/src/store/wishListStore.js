import api from "../utils/Axios";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const wishListStore = create(
  persist((set) => ({
    wishList: [],
    wishListCount: 0,

    fetchWishlist: async () => {
      try {
        const res = await api.get("/wishlist");
        const data = res.data;
        set({ wishList: data, wishListCount: data.length });
      } catch (error) {
        toast.error(`An error occured : ${error}`);
      }
    },

    handleProductLike: async (isLiked , product) => {
      try {
        if (isLiked) {
          await api.delete(`/wishlist/${product.productId}`);
          toast.success("Product removed from wishlist");
        } else {
          await api.post(`/wishlist/${product.productId}`);
          toast.success("Product added to wishlist");
        }
        wishListStore.getState().fetchWishlist();
      } catch (error) {
        toast.error(`Something went wrong with wishlist. ${error}`);
      }
    },
  }))
);

export default wishListStore;
