import api from "../utils/Axios";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const getCurrentAddress = (set) => {
  try {
    set((state) => {
      const user = state.user;
      const addr = user?.addresses?.find((item) => item.isDefault) || null;
      console.log("Current address:", addr);
      return { currentAddress: addr };

    });
  } catch (error) {
    toast.error(`An error occurred: ${error}`);
  }
};

const userStore = create(
  persist(
    (set) => ({
      user: null,
      choice: true,
      currentAddress: null,

      login: async (data) => {
        try {
          const response = await api.post(`/user/login`, data);
          console.log(response.data);
          if (response.data) {
            set({ user: response.data });
            toast.success(`User login done successfully.`);
            return { success: true };
          } else {
            toast.error(`Login failed: Unexpected response`);
            return { success: false };
          }
        } catch (error) {
          toast.error(`An error occurred: ${error}`);
          return { success: false };
        }
      },

      signup: async (data) => {
        try {
          const response = await api.post("/user/register", data);
          console.log(response.data);
          if (response.data) {
            set({ user: response.data });
            toast.success(`User has been registered successfully`);
            return { success: true };
          } else {
            toast.error(`Signup failed: Unexpected response`);
            return { success: false };
          }
        } catch (error) {
          toast.error(`An error occurred: ${error}`);
          return { success: false };
        }
      },

      logout: () => {
        try {
          set({ user: null, currentAddress: null });
          return { success: true };
        } catch (error) {
          toast.error(`An error occurred: ${error}`);
          return { success: false };
        }
      },

      updateProfile: async (data) => {
        try {
          const response = await api.put("/update-profile", data);
          if (response.data) {
            set({ user: response.data });
            toast.success(`User has been updated successfully`);
            return { success: true };
          } else {
            toast.error(`Update failed: Unexpected response`);
            return { success: false };
          }
        } catch (error) {
          toast.error(`An error occurred: ${error}`);
          return { success: false };
        }
      },

      chooseGender: (data) => {
        if (data === "WOMEN") set({ choice: false });
        else if (data === "MEN") set({ choice: true });
      },

      getCurrentAddress: () => getCurrentAddress(set),

      addAddress: async (data) => {
        try {
          const response = await api.post("/address", data);
          if (response.data) {
            set((state) => ({
              user: { ...state.user, ...response.data },
              currentAddress: response.data.addresses?.find((item) => item.isDefault) || state.currentAddress,
            }));
            toast.success(`Address added successfully`);
            return { success: true };
          } else {
            toast.error(`Address add/update failed: Unexpected response`);
            return { success: false };
          }
        } catch (error) {
          toast.error(`An error occurred: ${error}`);
          return { success: false };
        }
      },

      setCurrentAddress: async (addr) => {
        try {
          const response = await api.put(`/address/set-current/${addr.addressId}`);
          console.log('dgdzdddddddddddddddddddddddddddddddddddddfggggggggggggggggggggggg')
          console.log(response)
          if (response.data) {
            set((state) => ({
              user: { ...state.user, ...response.data },
              currentAddress: response.data.addresses?.find((item) => item.isDefault) || null,
            }));
            toast.success(`Address ${addr.addressType} set as current`);
            return { success: true };
          } else {
            toast.error(`Address set failed: Unexpected response`);
            return { success: false };
          }
        } catch (error) {
          console.log(error)
          toast.error(`An error occurred at setting address: ${error}`);
          return { success: false };
        }
      },
    }),
    { name: "user-store" }
  )
);

export default userStore;