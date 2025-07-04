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
  ShoppingBag,
  Smartphone,
  Banknote,
  AlertCircle,
  Loader2,
} from "lucide-react";
import cartStore from "../../../store/cartStore";
import { useRouter } from "next/navigation";
import orderStore from "../../../store/orderStore";

const OrderBookingPage = () => {
  const router = useRouter();
  const { cart, fetchCart, cartValid } = cartStore();
  const { placeOrder } = orderStore();
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccessful, setOrderSuccessful] = useState(false);

  useEffect(() => {
    if (!cartValid) {
      router.replace("/cart");
    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, [fetchCart]);

  useEffect(() => {
    if (orderSuccessful) {
      const timer = setTimeout(() => {
        router.push("/cart");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [orderSuccessful, router]);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) return;

    setPlacingOrder(true);

    // TODO: Implement your order placement logic here
    // Example: await placeOrder(cart, selectedPaymentMethod);
    const success = await placeOrder(selectedPaymentMethod);

    setTimeout(() => {
      setPlacingOrder(false);
      setOrderSuccessful(success);
    }, 2000);
  };

  const renderPaymentMethodContent = () => {
    if (selectedPaymentMethod === "cod") {
      return (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Cash on Delivery Selected
            </span>
          </div>
          <p className="text-sm text-gray-700">
            You will pay ₹{cart.finalAmount.toFixed(0)} in cash when your order
            is delivered.
          </p>
        </div>
      );
    }

    if (selectedPaymentMethod === "upi") {
      return (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              UPI Payment Selected
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            You will be redirected to your UPI app to complete the payment of ₹
            {cart.finalAmount.toFixed(0)}.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                UPI integration coming soon!
              </span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-md font-medium text-gray-500 animate-pulse">
          Loading order details...
        </div>
      </div>
    );
  }

  if (orderSuccessful) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">Redirecting to home page...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Complete Your Order
            </h1>
          </div>
          <p className="text-gray-600">
            Choose your payment method and place your order
          </p>
        </div>

        <div className="space-y-5">
          {/* Payment Method Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === "cod"
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handlePaymentMethodSelect("cod")}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-gray-700" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        Cash on Delivery
                      </h3>
                      <p className="text-sm text-gray-600">
                        Pay when your order is delivered
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedPaymentMethod === "cod"
                          ? "border-yellow-400 bg-yellow-400"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPaymentMethod === "cod" && (
                        <div className="w-full h-full bg-white rounded-full scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* UPI Payment */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === "upi"
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handlePaymentMethodSelect("upi")}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-700" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">UPI Payment</h3>
                      <p className="text-sm text-gray-600">
                        Pay instantly using any UPI app
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        selectedPaymentMethod === "upi"
                          ? "border-yellow-400 bg-yellow-400"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPaymentMethod === "upi" && (
                        <div className="w-full h-full bg-white rounded-full scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {renderPaymentMethodContent()}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Items ({cart.totalQuantity} item
                  {cart.totalQuantity !== 1 ? "s" : ""})
                </h2>
              </div>
              <div className="space-y-4">
                {cart.cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cart.totalQuantity} items)
                  </span>
                  <span className="font-medium">
                    ₹{cart.subtotal.toFixed(0)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="font-medium">
                    {cart.totalDeliveryCharge > 0
                      ? `₹${cart.totalDeliveryCharge}`
                      : "FREE"}
                  </span>
                </div>

                {cart.shippingDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Discount</span>
                    <span className="font-medium text-green-600">
                      -₹{cart.shippingDiscount}
                    </span>
                  </div>
                )}

                {cart.appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="font-medium text-green-600">
                      -₹{cart.couponDiscount.toFixed(0)}
                    </span>
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{cart.finalAmount.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {selectedPaymentMethod==="cod" && (
            <div className="flex flex-col sm:flex-row gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
              <button
                onClick={() => router.push("/order/preview")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                disabled={placingOrder}
              >
                Back to Preview
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="flex-1 bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderBookingPage;
