"use client";

import React, { useEffect, useState } from "react";
import { 
  MapPin, 
  Package, 
  Tag, 
  Truck, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  CreditCard,
  ShoppingBag
} from "lucide-react";
import cartStore from "../../../store/cartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const OrderPreviewPage = () => {
  const router = useRouter();
  const { cart, fetchCart , cartValid } = cartStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(()=>{
    if(!cartValid){
        router.replace("/cart")
    }
  },[])

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, [fetchCart]);

  const handleProceedToBooking = () => {
    router.push("/order/booking");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-md font-medium text-gray-500 animate-pulse">
          Loading order preview...
        </div>
      </div>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-md font-medium text-gray-500">
          No items in cart
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="max-w-3xl lg:max-w-3xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Order Preview</h1>
          </div>
          <p className="text-gray-600">Review your order before proceeding to payment</p>
        </div>

        <div className="space-y-5">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Items ({cart.totalQuantity} item{cart.totalQuantity !== 1 ? 's' : ''})
                </h2>
              </div>
              <div className="space-y-4">
                {cart.cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                        {item.productName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>Size: {item.sizeLabel}</span>
                        <span>Color: {item.colorName}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{item.totalDiscountPrice.toFixed(0)}
                        </span>
                        {item.savings > 0 && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.totalProductPrice.toFixed(0)}
                            </span>
                            <span className="text-sm text-green-600 font-medium">
                              Save ₹{item.savings.toFixed(0)}
                            </span>
                          </>
                        )}
                      </div>
                      {item.hasComboOffer && (
                        <div className="mt-2 text-sm text-orange-600 font-medium">
                          {item.offerText}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          <span>₹{item.deliveryCharge} delivery</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{item.estimatedDeliveryDays} days delivery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Applied Coupon */}
          {cart.appliedCoupon && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Applied Coupon</h2>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                          {cart.appliedCoupon.code}
                        </span>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-700">
                        {cart.appliedCoupon.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        -₹{cart.couponDiscount.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">You saved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Address */}
          {cart.selectedAddress && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                          {cart.selectedAddress.addressType}
                        </span>
                        <span className="text-sm text-gray-600">
                          {cart.selectedAddress.phone}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {cart.selectedAddress.street}
                        {cart.selectedAddress.landmark && `, ${cart.selectedAddress.landmark}`}
                        <br />
                        {cart.selectedAddress.city}, {cart.selectedAddress.state} - {cart.selectedAddress.pincode}
                        <br />
                        {cart.selectedAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.totalQuantity} items)</span>
                  <span className="font-medium">₹{cart.subtotal.toFixed(0)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="font-medium">
                    {cart.totalDeliveryCharge > 0 ? `₹${cart.totalDeliveryCharge}` : 'FREE'}
                  </span>
                </div>
                
                {cart.shippingDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Discount</span>
                    <span className="font-medium text-green-600">-₹{cart.shippingDiscount}</span>
                  </div>
                )}
                
                {cart.appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="font-medium text-green-600">-₹{cart.couponDiscount.toFixed(0)}</span>
                  </div>
                )}
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-base font-semibold">
                  <span>Total Amount</span>
                  <span>₹{cart.finalAmount.toFixed(0)}</span>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">
                      Your order is ready for checkout
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <button
              onClick={() => router.push("/cart")}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Cart
            </button>
            <button
              onClick={handleProceedToBooking}
              className="flex-1 bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPreviewPage;