import cartStore from "../store/cartStore";
import couponStore from "../store/couponStore";
import { Percent, Ticket, IndianRupee } from "lucide-react";
import { useMemo } from "react";

const CouponCard = ({ cart, coupon }) => {
  const {
    availableCoupons,
    appliedCoupon,
    fetchAvailableCoupons,
    applyCoupon,
    removeCoupon,
    setCoupon,
  } = couponStore();
  const { fetchCart } = cartStore();
  const isFlat = coupon.type === "FLAT";

  const handleApplyCoupon = async () => {
    await applyCoupon(cart.cartId, coupon.couponId);
    await fetchAvailableCoupons();
    await fetchCart();
  };

  // Predefined Tailwind-friendly pastel color classes
  const pastelColors = [
    "bg-pink-50",
    "bg-yellow-50",
    "bg-green-50",
    "bg-blue-50",
    "bg-indigo-50",
    "bg-purple-50",
    "bg-rose-50",
    "bg-teal-50",
    "bg-lime-50",
    "bg-orange-50",
    "bg-cyan-50",
    "bg-emerald-50"
  ];

  // Select a random pastel background color once per card
  const randomColor = useMemo(() => {
    const index = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[index];
  }, []);

  return (
    <div
      onClick={handleApplyCoupon}
      className={`relative flex items-center justify-between py-2 px-3 mb-4 shadow-md rounded-none cursor-pointer hover:scale-[1.01] transition-transform duration-200 ${randomColor}`}
    >
      {/* Ticket Circle Cuts */}
      <div className="absolute -left-3 top-1/4 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full z-10"></div>
      <div className="absolute -left-3 top-3/4 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full z-10"></div>

      <div className="flex items-center gap-3 z-20">
        <div
          className={`p-2 ml-1 rounded-full ${
            isFlat ? "bg-blue-500" : "bg-amber-500"
          } text-white`}
        >
          {isFlat ? <IndianRupee size={20} /> : <Percent size={20} />}
        </div>

        <div>
          <p className="text-base font-semibold">{coupon.code}</p>
          <p className="text-xs text-gray-600">{coupon.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            Min Cart: ₹{coupon.minCartAmount}{" "}
            {coupon.maxDiscountAmount &&
              `(Max Discount: ₹${coupon.maxDiscountAmount})`}
          </p>
          <p className="text-xs font-bold py-1 text-gray-600">
            {coupon.oneTimePerUser && "One Time use"}
          </p>
        </div>
      </div>

      <div className="z-20">
        <Ticket className="text-gray-500" />
      </div>
    </div>
  );
};

export default CouponCard;
