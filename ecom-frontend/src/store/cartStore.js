import api from "../utils/Axios";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const cartStore = create(
  persist(
    (set) => ({
      cart: [],
      cartCount: 0,
      cartValid : false,

      fetchCart: async () => {
        try {
          const res = await api.get("/cart");
          const data = res.data;
          console.log('cart---------------------------------------------------------------')
          console.log(data)
          set({ cart: data, cartCount: data.totalQuantity || 0 });
          cartStore.getState().validateCart();
          console.log(cartStore.getState().cartValid)
        } catch (error) {
          toast.error(`An error occurred : ${error}`);
        }
      },

      addToCart: async (data) => {
        try {
          const res = await api.post("/cart", data);
          if (res.data) {
            toast.success("Updated your Cart!");
            cartStore.getState().fetchCart();
          }
        } catch (error) {
          toast.error(
            `Unable to add to cart. Please check if you selected color, size and availability on your pincode.`
          );
        }
      },

      removeFromCart: async (cartItemId) => {
        try {
          const res = await api.delete(`/cart/cart-item/${cartItemId}`);
          if (res.data) {
            toast.success("Item removed from cart!");
            cartStore.getState().fetchCart();
          }
        } catch (error) {
          toast.error(
            error?.response?.data?.message || error.message || "Something went wrong"
          );
        }
      },

      validateCart : async()=>{
        try {
          set({cartValid : false})
          const res = await api.get(`/cart-validate`);
          if (res.data) {

            set({cartValid : res.data})
          }
        } catch (error) {
          console.log(error)
          toast.error('Error during validating cart' + error);
        }
      }
      
    }),
    {
      name: "cart-store",
    }
  )
);

export default cartStore;
