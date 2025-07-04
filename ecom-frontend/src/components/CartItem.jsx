// components/CartItem.js
"use client";

import React, { useEffect } from "react";
import { Truck, Minus, Plus, X } from "lucide-react";
import cartStore from "../store/cartStore";
import { useRouter } from "next/navigation";
import userStore from "../store/userStore";

const CartItem = ({ item }) => {
  const { addToCart, removeFromCart } = cartStore();
  const { currentAddress, getCurrentAddress } = userStore();
  const router = useRouter();
  useEffect(() => {
    getCurrentAddress();
  }, [item.productId]);

  const handleItemClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  const calculateItemSavings = (originalPrice, discountPrice) => {
    return originalPrice - discountPrice;
  };

  return (
    <div
    style={item.validQuantity ? {opacity : 1} : {opacity : 0.5}}
      key={item.cartItemId}
      className="bg-white border border-gray-200 rounded-sm p-4 shadow-xs hover:shadow-sm transition-shadow cart-item"
    >
      <div className="flex gap-4">
        <div
          onClick={() => handleItemClick(item.productId)}
          className="relative cursor-pointer"
        >
          <img
            src={item.productImage}
            alt={item.productName}
            className="w-24 h-32 object-cover rounded-sm"
          />
        </div>

        <div className="flex-1">
          {currentAddress?.pincode !== item.pincode && (
            <p className="text-red-600 font-bold text-xs mb-1">
              Product not deliverable on current pincode
            </p>
          )}
          {!item.validQuantity && (
            <p className="text-red-600 font-bold text-xs mb-1">
              {`Quantity not available (Out of Stock)`}
            </p>
          )}

          <div className="flex justify-between items-start mb-1">
            <p className="text-gray-600 text-xs mb-1">{item.productName}</p>
          </div>

          {item.hasComboOffer && (
            <div className="mb-2">
              <span className="bg-blue-50 text-blue-800 font-bold text-xs px-2 py-1 rounded-xs">
                {item.quantity >= item.comboQuantity
                  ? item.offerText + " applied!"
                  : item.offerText + " applicable"}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 text-green-600 text-xs mb-3">
            <Truck className="w-4 h-4" />
            <span>
              Estimated Delivery in {item.estimatedDeliveryDays} day(s)
            </span>
          </div>

          <div className="flex gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Qty:</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => {
                    if (item.quantity > 1) {
                      addToCart({
                        productId: item.productId,
                        colorId: item.colorId,
                        sizeId: item.sizeId,
                        availId: item.availabilityId,
                        quantity: -1,
                      });
                    }
                  }}
                  className="p-1 hover:bg-gray-100"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 py-1 pr-3 text-sm">{item.quantity}</span>
                <button
                  onClick={() => {
                    if (item.quantity >= 1 && item.quantity < 10) {
                      addToCart({
                        productId: item.productId,
                        colorId: item.colorId,
                        sizeId: item.sizeId,
                        availId: item.availabilityId,
                        quantity: 1,
                      });
                    }
                  }}
                  className="p-1 hover:bg-gray-100"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-row-reverse items-center justify-between mr-[-20px]">
            <div className="flex flex-col items-center gap-0">
              <div className="flex gap-2 items-center">
                <span className="text-lg font-bold text-gray-800">
                  ₹{item.totalDiscountPrice.toFixed(0)}
                </span>
                <span className="text-gray-500 text-xs line-through">
                  ₹{item.totalProductPrice.toFixed(0)}
                </span>
              </div>
              {item.totalSavings > 0 && (
                <span className="text-green-600 font-medium text-xs">
                  You saved ₹{item.totalSavings.toFixed(0)}
                </span>
              )}
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-600">Color : {item.colorName}</p>
              <p className="text-xs text-gray-600">Size : {item.sizeLabel}</p>
            </div>
          </div>
        </div>

        <div
          className="opacity-[0.7] cursor-pointer"
          onClick={() => removeFromCart(item.cartItemId)}
        >
          <X className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
