import api from "../utils/Axios";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const couponStore = create(persist((set)=>({
    availableCoupons : [],
    appliedCoupon : null,

    fetchAvailableCoupons : async ()=>{
        try {
            const res = await api.get("/api/coupons/available");
            const data = res.data;
            set({availableCoupons : data});
        }catch (error) {
          const errMsg = error?.response?.data?.message || "Failed to fetch coupons";
          toast.error(errMsg);
        }
    },
    applyCoupon : async (cartId , couponId)=>{
        try {
            const res = await api.post(`/api/coupons/apply?cartId=${cartId}&couponId=${couponId}`);
            toast.success("Coupon applied !");
        } catch (error) {
          const errMsg = error?.response?.data?.message || "Failed to apply coupon";
          toast.error(errMsg);
        }
    },

    removeCoupon : async (cartId)=>{
        try {
            const res = await api.post(`/api/coupons/remove?cartId=${cartId}`);
            toast.success("Coupon removed !");
            couponStore.getState().setCoupon(null);
        } catch (error) {
          const errMsg = error?.response?.data?.message || "Failed to remove coupon";
          toast.error(errMsg);
        }
    },
    setCoupon : (coupon)=>{
        set({appliedCoupon : coupon});
    },

})))

export default couponStore;