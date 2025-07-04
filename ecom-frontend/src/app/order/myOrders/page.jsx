"use client";

import React, { useEffect, useState } from "react";
import orderStore from "../../../store/orderStore"; 
import { Package, MapPin, ChevronDown, ChevronUp, Calendar, CreditCard, Truck, Tag } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const MyOrdersPage = () => {
  const { orders, loading, fetchOrders, cancelOrder } = orderStore();
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCheckDetails = async (orderId) => {
    // Implementation here
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading orders...</div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6 pt-7">
          <h1 className="text-xl font-medium text-gray-900">My Orders</h1>
          <div className="text-base text-gray-500">{orders.length + ' order(s)'}</div>
        </div>

        <div className="space-y-4">
          {orders
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
            .map((order) => {
            const isExpanded = expandedOrders.has(order.orderId);
            const firstThreeItems = order.orderItems.slice(0, 3);
            const remainingItemsCount = order.orderItems.length - 3;

            return (
              <div
                key={order.orderId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                {/* Compact Order Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Order
                        </h2>
                        <h5 className="text-xs font-medium text-gray-400">
                          {'Order Id : ' + order.orderCode}
                        </h5>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.orderDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {order.orderItems.length} items
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{order.finalAmount.toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.paymentMethod==="cod" && "Cash on delivery"}
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-sm text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                        {'Status : ' + order.orderStatus}
                      </span>
                      
                      <button
                        onClick={() => toggleOrderExpansion(order.orderId)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compact Items Preview */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {firstThreeItems.map((item) => (
                      <div key={item.orderItemId} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                        <img
                          src={item.productImageUrl}
                          alt={item.productName}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} × ₹{item.pricePerUnit.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {remainingItemsCount > 0 && (
                      <div className="flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg p-2 h-14 w-20">
                        <span className="text-sm text-gray-600">+{remainingItemsCount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    Expected: {formatDate(order.expectedDeliveryDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    {order.orderStatus === "PLACED" && (
                      <button
                        onClick={() => handleCheckDetails(order.orderId)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Check Details
                      </button>
                    )}
                    <button
                      onClick={() => toggleOrderExpansion(order.orderId)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? 'Show Less' : 'View Details'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-white">
                    {/* All Order Items */}
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {order.orderItems.map((item) => (
                          <div key={item.orderItemId} className="flex gap-3 items-center">
                            <img
                              src={item.productImageUrl}
                              alt={item.productName}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{item.productName}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span>{item.colorName}</span>
                                <span>Size: {item.sizeLabel}</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">₹{item.totalPrice.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">₹{item.pricePerUnit.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary & Address in Grid */}
                    <div className="grid md:grid-cols-2 gap-4 p-4">
                      {/* Delivery Address */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Delivery Address
                        </h3>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="font-medium">{order.addressType}</p>
                          <p>{order.street}</p>
                          {order.landmark && <p>Near {order.landmark}</p>}
                          <p>{order.city}, {order.state}, {order.country} - {order.pincode}</p>
                          <p>Phone: {order.phone}</p>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h3>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between text-gray-700">
                            <span>Subtotal</span>
                            <span>₹{order.subtotal.toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>Delivery Charge</span>
                            <span>₹{order.totalDeliveryCharge.toFixed(0)}</span>
                          </div>
                          {order.couponDiscount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Coupon Discount</span>
                              <span>-₹{order.couponDiscount.toFixed(0)}</span>
                            </div>
                          )}
                          {order.shippingDiscount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Shipping Discount</span>
                              <span>-₹{order.shippingDiscount.toFixed(0)}</span>
                            </div>
                          )}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-semibold text-gray-900">
                              <span>Final Amount</span>
                              <span>₹{order.finalAmount.toFixed(0)}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-gray-600 text-xs mt-2">
                            <span>Payment Method</span>
                            <span>{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between text-gray-600 text-xs">
                            <span>Expected Delivery</span>
                            <span>{formatDate(order.expectedDeliveryDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;