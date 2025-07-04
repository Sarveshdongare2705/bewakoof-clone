"use client";

import userStore from "../../store/userStore";
import { profileImg } from "../../assets/Assets";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import cartStore from "../../store/cartStore";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Package,
  Settings,
  Heart,
  Headphones,
} from "lucide-react";
import wishListStore from "../../store/wishListStore";
import searchStore from "../../store/searchStore";

const Profile = () => {
  const router = useRouter(); // Initialize router
  const user = userStore((state) => state.user);
  const updateProfile = userStore((state) => state.updateProfile);
  const addAddress = userStore((state) => state.addAddress);
  const setCurrentAddress = userStore((state) => state.setCurrentAddress);
  const getCurrentAddress = userStore((state) => state.getCurrentAddress);
  const validateCart = cartStore((state) => state.validateCart);
  const wishList = wishListStore((state) => state.wishList);
  const fetchWishlist = wishListStore((state) => state.fetchWishlist);
  const setSearchData = searchStore((state) => state.setSearchData);

  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    mobileNo: user?.mobileNo || "",
    gender: user?.gender || "",
    birthDate: user?.birthDate?.split("T")[0] || "",
  });

  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressType: "",
    phone: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const callFunctions = async () => {
    await fetchWishlist();
  };

  //wishlist part
  useEffect(() => {
    callFunctions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    updateProfile(formData);
  };

  const handleWishListRoute = () => {
    router.push("/wishlist");
    setSearchData(wishList, "");
  };

  const handleMyOrdersRoute = () => {
    router.push("/order/myOrders");
  };

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        mobileNo: user.mobileNo || "",
        gender: user.gender || "",
        birthDate: user.birthDate?.split("T")[0] || "",
      });
      getCurrentAddress();
    }
  }, [user, getCurrentAddress]);

  const handleAddAddress = async () => {
    const hadNoAddresses = (user?.addresses?.length || 0) === 0;

    const result = await addAddress(newAddress);
    await getCurrentAddress();
    await validateCart(newAddress.pincode);

    //first address exception
    if (hadNoAddresses && result.success) {
      const updatedUser = userStore.getState().user;
      const defaultAddress = updatedUser?.addresses?.find(
        (addr) => addr.isDefault
      );
      if (defaultAddress) {
        await handleSelectAddress(defaultAddress);
      }
    }

    setShowModal(!result.success);
  };

  const handleSelectAddress = async (addr) => {
    await setCurrentAddress(addr);
    await getCurrentAddress();
    await validateCart(addr.pincode);
  };

  const userActions = [
    {
      id: "profile",
      label: "Edit Profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      id: "addresses",
      label: "My Addresses",
      icon: <MapPin className="w-5 h-5" />,
    },
    { id: "orders", label: "My Orders", icon: <Package className="w-5 h-5" /> },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
    { id: "wishlist", label: "Wishlist", icon: <Heart className="w-5 h-5" /> },
    {
      id: "support",
      label: "Help & Support",
      icon: <Headphones className="w-5 h-5" />,
    },
  ];

  if (user) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Card */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Image
                  src={profileImg}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full ring-4 ring-yellow-400 ring-opacity-20"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.userName}
                </h1>
                <p className="text-gray-600 mt-1">{user?.email}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium">
                    Manage your account
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {userActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setActiveTab(action.id)}
                  className={`flex-1 flex items-center justify-center cursor-pointer min-w-fit px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                    activeTab === action.id
                      ? "border-yellow-400 text-yellow-600 bg-yellow-50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2 inline-flex items-center">
                    {action.icon}
                  </span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100">
            {activeTab === "profile" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profile Information
                  </h2>
                  <span className="text-sm text-gray-500">
                    Keep your information up to date
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        name="mobileNo"
                        value={formData.mobileNo || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter mobile number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleUpdate}
                    className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    My Addresses
                  </h2>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    <span className="mr-2">+</span>
                    Add New Address
                  </button>
                </div>

                {user?.addresses?.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No addresses added yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Add your first address to get started with deliveries
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors duration-200"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.addresses?.map((addr, idx) => (
                      <div
                        key={idx}
                        className={`border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${
                          addr.isDefault
                            ? "border-yellow-400 bg-yellow-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                              {addr.addressType}
                            </span>
                            {addr.isDefault && (
                              <span className="px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-bold">
                                Current
                              </span>
                            )}
                          </div>
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSelectAddress(addr)}
                              className="px-4 py-2 border border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 rounded-lg text-sm font-medium transition-colors duration-200"
                            >
                              Set as Current
                            </button>
                          )}
                        </div>

                        <div className="space-y-2 text-gray-700">
                          <p className="font-medium">{addr.street}</p>
                          {addr.landmark && (
                            <p className="text-sm">Near {addr.landmark}</p>
                          )}
                          <p className="text-sm">
                            {addr.city}, {addr.state}
                          </p>
                          <p className="text-sm">
                            {addr.country} - {addr.pincode || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            📞 {addr.phone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="p-6">
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    My Orders
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Your order history will appear here
                  </p>
                  <button
                    onClick={handleMyOrdersRoute}
                    className="px-6 py-3 cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors duration-200"
                  >
                    View My Orders
                  </button>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="p-6">
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Settings
                  </h3>
                  <p className="text-gray-500">
                    Account settings and preferences
                  </p>
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="p-6">
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    My Wishlist
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Items you've saved for later
                  </p>
                  <button
                    onClick={handleWishListRoute}
                    className="px-6 py-3 cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors duration-200"
                  >
                    View My Wishlist
                  </button>
                </div>
              </div>
            )}

            {activeTab === "support" && (
              <div className="p-6">
                <div className="text-center py-12">
                  <Headphones className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Help & Support
                  </h3>
                  <p className="text-gray-500">
                    Get help with your account and orders
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Adding Address */}
        {showModal && (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add New Address
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <span className="text-xl text-gray-500">×</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Type
                    </label>
                    <select
                      name="addressType"
                      value={newAddress.addressType}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    >
                      <option value="">Select Address Type</option>
                      {[
                        "HOME",
                        "OFFICE",
                        "OTHER",
                        "HOSTEL",
                        "FRIEND",
                        "RELATIVE",
                        "TEMPORARY",
                      ].map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      name="phone"
                      value={newAddress.phone}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Phone Number"
                    />
                    <input
                      type="text"
                      name="street"
                      value={newAddress.street}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Street Address"
                    />
                    <input
                      type="text"
                      name="landmark"
                      value={newAddress.landmark}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Landmark (Optional)"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder="State"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="country"
                        value={newAddress.country}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder="Country"
                      />
                      <input
                        type="number"
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder="Pincode"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAddress}
                    className="flex-1 px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors duration-200"
                  >
                    Add Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default Profile;
