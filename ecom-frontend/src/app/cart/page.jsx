"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Truck, Tag, ChevronDown, X } from "lucide-react";
import cartStore from "../../store/cartStore";
import userStore from "../../store/userStore";
import couponStore from "../../store/couponStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CouponCard from "../../components/CouponCard";
import CartItem from "../../components/CartItem";

gsap.registerPlugin(ScrollTrigger);

const CartPage = () => {
  const offerPrice = 1499;
  const router = useRouter();
  const { cart, cartCount, fetchCart, cartValid } = cartStore();
  const { currentAddress, getCurrentAddress } = userStore();
  const { availableCoupons, fetchAvailableCoupons, removeCoupon, setCoupon } =
    couponStore();
  const containerRef = useRef(null);
  const modalRef = useRef(null);
  const [showCoupons, setShowCoupons] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchAvailableCoupons();
  }, [fetchCart, fetchAvailableCoupons]);

  useEffect(() => {
    if (cart?.cartItems && currentAddress?.pincode) {
      getCurrentAddress();
      cartStore.getState().validateCart(currentAddress.pincode);
      setCoupon(cart?.appliedCoupon);
    }
  }, [cart?.cartItems, currentAddress?.pincode, getCurrentAddress, setCoupon]);

  const handleProceed = () => {
    router.push("/order/preview");
  };

  useGSAP(
    () => {
      gsap.fromTo(
        ".savings-banner",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".savings-banner",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".delivery-address",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".delivery-address",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".cart-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".cart-item",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".coupons-section",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".coupons-section",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".price-summary > *",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".price-summary",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".proceed-button",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".proceed-button",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
      if (showCoupons && modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, y: -50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      }
    },
    { scope: containerRef, dependencies: [showCoupons] }
  );

  const setAddress = () => {
    if (cart.selectedAddress == null && currentAddress != null) {
      cart.selectedAddress = currentAddress;
    }
  };

  useEffect(()=>{
    setAddress();
  },[])

  const calculateOriginal = () => {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => {
      return total + item.productPrice * item.quantity;
    }, 0);
  };

  const calculateTotalSavings = () => {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => {
      return total + item.totalSavings;
    }, 0);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon(cart?.cartId);
    await fetchAvailableCoupons();
    await fetchCart();
  };

  const handleCloseModal = () => {
    setShowCoupons(false);
  };

  const original = calculateOriginal();
  const totalSavings = calculateTotalSavings();

  const handleItemClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  if (!cart || !cart.cartItems) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-md font-medium text-gray-500 animate-pulse">
          Loading your cart...
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-screen px-5 md:px-20 lg:px-30 mx-auto py-6 pt-20"
      ref={containerRef}
    >
      <div className="mb-6">
        <h1 className="text-md font-semibold text-gray-800 mb-2">
          My Bag ({cartCount} Item{cartCount !== 1 ? "s" : ""})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {totalSavings > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-sm p-3 flex items-center gap-2 mb-4 savings-banner">
              <Tag className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium text-sm">
                You are saving ₹{totalSavings.toFixed(0)} on this order
              </span>
            </div>
          )}
          {cart.selectedAddress ? (
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-4 delivery-address">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-blue-900">
                    Deliver to:
                  </h3>
                  <p className="text-blue-800 text-xs">
                    {cart.selectedAddress?.street}, {cart.selectedAddress?.city}
                    , {cart.selectedAddress?.state} -{" "}
                    {cart.selectedAddress?.pincode}
                  </p>
                  <p className="text-blue-700 text-xs mt-1">
                    {cart.selectedAddress?.addressType}
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Change
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 delivery-address">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 text-sm">
                    Cannot order:
                  </h3>
                  <p className="text-blue-800 text-xs">
                    Please set your address before making an order
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Set address
                </Link>
              </div>
            </div>
          )}
          <div className="space-y-4">
            {cart.cartItems.map((item) => (
              <CartItem key={item.cartItemId} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            <div className="mb-6 coupons-section">
              <h3 className="font-semibold text-gray-900 mb-3">
                Coupons & Offers
              </h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-medium text-sm">
                      Apply Coupon / Gift Card
                    </p>
                    <p className="text-xs text-gray-500">
                      Crazy deals and other amazing offers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCoupons(true)}
                  className="text-blue-600 text-sm font-medium cursor-pointer"
                >
                  VIEW
                </button>
              </div>
            </div>

            <div className="mb-6 price-summary">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Price Summary</h3>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Price</span>
                  <span className="font-medium">₹{original.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Savings</span>
                  <span className="font-medium">
                    ₹{totalSavings.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{cart.subtotal.toFixed(2)}
                  </span>
                </div>
                {cart.totalDeliveryCharge > 0 ? (
                  <div
                    className={`flex justify-between ${
                      cart.shippingDiscount > 0 && "line-through"
                    }`}
                  >
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="font-medium">
                      ₹{cart.totalDeliveryCharge.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  cart.totalDeliveryCharge == 0 &&
                  cart.totalQuantity > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Delivery Charge</span>
                      <span className="font-medium">FREE</span>
                    </div>
                  )
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center text-base font-semibold">
                  <span>Total</span>
                  <span>₹{cart.merchandiseTotal?.toFixed(0)}</span>
                </div>
                {cart.shippingDiscount > 0 && (
                  <div className="w-full flex flex-col">
                    <div className="mb-2 coupons-section bg-yellow-200 px-3 py-0">
                      <div className="text-center bg-yellow-100 text-yellow-500 p-2 rounded text-sm font-bold">
                        {`Yay! Order above ₹${offerPrice}`}
                      </div>
                    </div>
                    <div className="flex justify-between text-black-600">
                      <span>Delivery Charge</span>
                      <span className="font-medium">FREE</span>
                    </div>
                  </div>
                )}
                {cart.appliedCoupon !== null && (
                  <div className="w-full">
                    <div className="w-full flex items-center justify-between py-1 mb-3 border-b-1 border-gray-100">
                      <span>Applied Coupon</span>
                      <span
                        onClick={handleRemoveCoupon}
                        className="font-bold text-red-500 cursor-pointer"
                      >
                        {"Remove"}
                      </span>
                    </div>
                    <CouponCard cart={cart} coupon={cart.appliedCoupon} />
                    <div className="flex justify-between text-black-600">
                      <span>Coupon Discount</span>
                      <span className="font-bold text-green-500">
                        {"- ₹ " + cart.couponDiscount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center text-base font-semibold">
                  <span>Final Price</span>
                  <span>₹{cart.finalAmount?.toFixed(0)}</span>
                </div>
                {cart.totalDeliveryCharge == 0 && cart.totalQuantity > 0 && (
                  <div className="text-center bg-green-50 text-green-800 p-2 rounded text-sm">
                    Yay! You get FREE delivery on this order
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={cartCount !== 0 && cartValid ? handleProceed : () => {}}
              style={
                !cartValid || cartCount === 0
                  ? { backgroundColor: "#f9f9f9" }
                  : { backgroundColor: "#facc15" }
              }
              className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-md transition-colors mb-4 proceed-button"
            >
              {cartCount === 0
                ? "Cart is empty!"
                : cartValid
                ? "PROCEED"
                : "CANNOT PROCEED"}
            </button>
          </div>
        </div>
      </div>

      {showCoupons && (
        <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm z-50 flex justify-center items-start pt-30">
          <div
            ref={modalRef}
            className="bg-white w-[90%] max-w-md p-5 border border-gray-200 shadow-lg rounded-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Coupons & Offers
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[300px] overflow-y-scroll scrollbar-hide p-3">
              {availableCoupons.length === 0 ? (
                <p className="text-center text-gray-500">
                  No coupons available
                </p>
              ) : (
                availableCoupons.map((coupon) => (
                  <CouponCard
                    key={coupon.couponId}
                    cart={cart}
                    coupon={coupon}
                  />
                ))
              )}
            </div>
            <button
              onClick={handleCloseModal}
              className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
