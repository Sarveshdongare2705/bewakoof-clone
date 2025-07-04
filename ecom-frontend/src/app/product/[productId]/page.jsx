"use client";

import api from "../../../utils/Axios";
import { like, liked, offer, wishlist } from "../../../assets/Assets";
import productStore from "../../../store/productStore";
import {
  Star,
  ChevronDown,
  ShoppingBag,
  Heart,
  MapPin,
  Truck,
  Shield,
  RotateCcw,
  Award,
  HeartCrack,
  HeartPlus,
  ThumbsUp,
  ThumbsDown,
  Check,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import wishListStore from "../../../store/wishListStore";
import userStore from "../../../store/userStore";
import { toast } from "sonner";
import cartStore from "../../../store/cartStore";
import clothingColors from "../../../assets/clothingColors";

const ProductPage = () => {
  const { productId } = useParams();
  const currentAddress = userStore((state) => state.currentAddress);
  const handleProductLike = wishListStore((state) => state.handleProductLike);
  const addToCart = cartStore((state) => state.addToCart);
  const submitReview = productStore((state) => state.submitReview);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pincode, setPincode] = useState(null);
  const [activeReviewFilter, setActiveReviewFilter] = useState("Most Helpful");
  const [recommendProduct, setRecommendProduct] = useState(null);
  const [zone, setZone] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    description: false,
    returns: false,
  });
  const [isLiked, setIsLiked] = useState(false);

  const product = productStore((state) => state.product);
  const fetchProductById = productStore((state) => state.fetchProductById);

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmitReview = async () => {
    const result = await submitReview(productId, {
      rating,
      comment,
      recommend: recommendProduct,
    });
    setIsRateModalOpen(!result);
  };

  const fetchProduct = async () => {
    await fetchProductById(productId);
  };
  const checkLike = async () => {
    try {
      const res = await api.get(`/wishlist/isPresent/${productId}`);
      setIsLiked(res.data === true);
      console.log("liked");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };
  useEffect(() => {
    checkLike();
    fetchProduct();
  }, [productId]);
  useEffect(() => {
    if (product && product.colorVariants.length > 0) {
      setSelectedColor(product.colorVariants[0]);
      setSelectedImageIndex(0);
      setPincode(currentAddress?.pincode || null);
    }
  }, [product]);
  const currentImages = selectedColor?.images || [];
  const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  const currentSizes = (selectedColor?.sizes || []).slice().sort((a, b) => {
    const indexA = sizeOrder.indexOf(a.size.toUpperCase());
    const indexB = sizeOrder.indexOf(b.size.toUpperCase());

    // If size not found in predefined order, push it to the end
    return (
      (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB)
    );
  });
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  const formatText = (text) =>
    text
      ?.replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()) || "";

  const calculateRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    product?.reviews?.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = calculateRatingDistribution();
  const maxRatingCount = Math.max(...Object.values(ratingDistribution));

  const getFilteredReviews = () => {
    let filtered = [...product.reviews];

    switch (activeReviewFilter) {
      case "Most Recent":
        return filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "Most Helpful":
        return filtered; // In real app, you'd sort by helpfulness
      case "Product Quality":
        return filtered.filter((r) =>
          r.comment.toLowerCase().includes("quality")
        );
      case "Color":
        return filtered.filter((r) =>
          r.comment.toLowerCase().includes("color")
        );
      case "Material":
        return filtered.filter(
          (r) =>
            r.comment.toLowerCase().includes("fabric") ||
            r.comment.toLowerCase().includes("material")
        );
      case "Fit":
        return filtered.filter((r) => r.comment.toLowerCase().includes("fit"));
      default:
        return filtered;
    }
  };

  const handleAddToBag = async () => {
    const obj = {
      productId,
      colorId: selectedColor.colorId,
      sizeId: selectedSize.sizeId,
      availId: zone.availId,
      quantity: 1,
    };
    // Add to bag logic here
    const res = await addToCart(obj);
  };

  const handleWishlist = async () => {
    await handleProductLike(isLiked, product);
    setIsLiked(!isLiked);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDeliveryCheck = async () => {
    try {
      if (pincode) {
        const res = await api.get(`/avail/${productId}/${pincode}`);
        if (res.data) {
          setZone(res.data);
          toast.success("Product Available on current pincode");
        }
      }
    } catch (error) {
      toast.error("Product not available on current pincode");
    }
  };

  if (!product) {
    return <div className="px-6 py-10">Loading...</div>;
  }
  const breadcrumb = ["Home", product.productName];

  return (
    <div className="mt-10">
      <div
        style={isRateModalOpen ? { opacity: 0.2 } : { opacity: 1 }}
        className="max-w-7xl mx-auto px-4 lg:px-8"
      >
        <div className="text-sm text-gray-500 pt-10 pb-6">
          {breadcrumb.map((item, index) => (
            <span key={index}>
              {item}
              {index < breadcrumb.length - 1 && (
                <span className="mx-1">{">"}</span>
              )}
            </span>
          ))}
        </div>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Section: Images */}
          <div className="flex flex-col-reverse gap-4 lg:w-1/2 lg:flex-row ">
            {/* Thumbnail Images */}
            <div className="flex flex-row gap-2 w-full lg:w-18 h-[50%] overflow-x-auto lg:overflow-y-scroll scrollbar-hide lg:w-20 lg:flex-col ">
              {currentImages.map((img, i) => (
                <img
                  key={img.imageId}
                  src={img.url}
                  alt="thumbnail"
                  className={`border rounded-md cursor-pointer w-[90px] h-auto aspect-square object-cover ${
                    selectedImageIndex === i
                      ? "border-blue-500 border-2"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImageIndex(i)}
                />
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 flex justify-center rounded overflow-hidden">
              <img
                src={currentImages[selectedImageIndex]?.url}
                alt="product"
                className="max-w-full max-h-[600px] rounded-[10px] object-contain"
              />
            </div>
          </div>
          {/* Right Section: Product Details */}
          <div className="lg:w-1/2 space-y-6">
            {/* Official Merchandise Badge */}
            {product.isOfficialMerchandise && (
              <div className="text-sm font-semibold text-violet-500 mb-[10px]">
                {product.licenseInfo}
              </div>
            )}
            {/* Product Title */}
            <div>
              <h1 className="text-lg lg:text-md font-bold text-gray-800 mb-2">
                {product.productBrand}
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                {product.productName}
              </p>
            </div>
            {/* Price Section */}
            <div className="flex items-center gap-3">
              <span className="text-2xl lg:text-3xl font-bold text-black">
                {formatPrice(product.discountPrice)}
              </span>
              <span className="line-through text-gray-500 text-lg font-medium">
                {formatPrice(product.productPrice)}
              </span>
              <span className="text-green-600 font-semibold">
                {product.discountPercent}% OFF
              </span>
              <p className="text-xs text-gray-500">inclusive of all taxes</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-xl">
                  {product.averageRating?.toFixed(2) || 0.0}
                </span>
              </div>
              <span className="text-blue-600 text-sm font-medium">
                {product.totalReviews} Reviews
              </span>
            </div>
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2  text-sm">
              <ShoppingBag className="w-4 h-4" />
              <span>
                {product.recentPurchases} people bought this in the last 7 days
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.hasComboOffer && (
                <span className="bg-green-500 text-white px-3 py-2 text-xs font-semibold rounded">
                  {product.offerText}
                </span>
              )}
              <span className="bg-yellow-400 text-black px-3 py-2 text-xs font-semibold rounded">
                {formatText(product.fitType)} FIT
              </span>
              <span className="border border-gray-300 px-3 py-2 text-xs font-semibold rounded">
                {product.material.toUpperCase()}
              </span>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-700">
                Colour Options : {selectedColor?.colorName}
              </h4>
              <div className="flex gap-3">
                {product.colorVariants.map((color) => (
                  <button
                    key={color.colorId}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedImageIndex(0);
                    }}
                    className={`w-11 h-11 rounded-full  border-2 cursor-pointer ${
                      selectedColor?.colorId === color.colorId
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: clothingColors[color.colorName],
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Select Size</h4>
                <button className="text-blue-600 text-sm font-medium">
                  SIZE GUIDE
                </button>
              </div>
              <div className="flex gap-3 items-center flex-wrap mb-2">
                {currentSizes.map((size) => (
                  <button
                    key={size.sizeId}
                    onClick={() => setSelectedSize(size)}
                    disabled={!size.available}
                    className={`border px-4 py-2 text-sm cursor-pointer rounded-full min-w-[50px] ${
                      selectedSize?.sizeId === size.sizeId
                        ? "bg-black text-white border-black"
                        : size.available
                        ? "border-gray-300 hover:border-gray-400"
                        : "border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {size.size}
                  </button>
                ))}
                {selectedSize && selectedSize.quantity < 10 && (
                  <p className="text-red-500 text-sm font-bold">
                    {selectedSize.quantity} left
                  </p>
                )}
                {selectedSize && selectedSize.quantity === 0 ? (
                  <p className="text-red-500 ml-2 text-sm font-bold">
                    {"Out of Stock"}
                  </p>
                ) : (
                  <p className="text-blue-400-500 ml-2 text-sm font-bold">
                    {"In Stock"}
                  </p>
                )}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToBag}
                className="flex-1 bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4  h-4" />
                ADD TO BAG
              </button>
              <button
                onClick={handleWishlist}
                className="border cursor-pointer flex gap-2 border-gray-300 hover:border-gray-400 px-4 py-3 rounded-md transition-colors font-semibold"
              >
                {isLiked ? (
                  <Image src={liked} alt="" width={20} height={20} />
                ) : (
                  <Image src={like} alt="" width={20} height={20} />
                )}
              </button>
            </div>

            {/* Delivery Check */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Check for Delivery Details</span>
              </div>
              <div className="flex gap-2">
                <input
                  value={pincode}
                  disabled={true}
                  type="text"
                  placeholder={`${
                    currentAddress
                      ? "Your current pincode"
                      : "Set your current address first"
                  }`}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <button
                  onClick={handleDeliveryCheck}
                  className="text-blue-600 cursor-pointer font-medium text-sm px-4"
                >
                  CHECK
                </button>
              </div>
            </div>

            {/* Free Shipping */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 text-sm font-medium">
                {zone?.deliveryCharge == 0
                  ? `This product is eligible for FREE SHIPPING`
                  : `Delivery Charge is ${formatPrice(
                      zone?.deliveryCharge || 0
                    )} for pincode ${
                      zone?.pincode || " : Select a pincode first"
                    }`}
              </span>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-violet-600" />
              <span className="text-violet-600 text-sm font-medium">
                {`Estimated Delivery days is ${
                  zone?.estimatedDeliveryDays || 0
                } for pincode ${zone?.pincode || " : Select a pincode first"}`}
              </span>
            </div>

            {/* Combo Offer */}
            {product.hasComboOffer && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{product.offerText}</h3>
                  <button className="bg-black text-white px-4 py-1 rounded text-sm mt-1">
                    View All Items
                  </button>
                </div>
                <div className="text-4xl">
                  <Image src={offer} width={66} height={56} />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Key Highlights */}
        <div className="mt-12 bg-white">
          <h3 className="text-xl font-bold mb-6">Key Highlights</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Design</p>
              <p className="font-semibold">{formatText(product.designType)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Fit</p>
              <p className="font-semibold">{formatText(product.fitType)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Neck</p>
              <p className="font-semibold">{formatText(product.neckType)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Occasion</p>
              <p className="font-semibold">{formatText(product.occasion)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Sleeve Style</p>
              <p className="font-semibold">{formatText(product.sleeveType)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Wash Care</p>
              <p className="font-semibold">Gentle Machine Wash</p>
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="mt-8 space-y-4">
          {/* Product Description */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection("description")}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center">
                  <span className="text-sm">📄</span>
                </div>
                <div>
                  <h4 className="font-semibold">Product Description</h4>
                  <p className="text-sm text-gray-500">
                    Manufacture, Care and Fit
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  expandedSections.description ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.description && (
              <div className="px-4 pb-4 text-sm text-gray-600">
                {product.productDescription}
              </div>
            )}
          </div>

          {/* Returns & Exchange */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection("returns")}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold">{`${
                    zone?.returnDays || 0
                  } Days Returns & Exchange ${
                    zone?.returnDays
                      ? "(For selected pincode)"
                      : "(Select a pincode to check)"
                  }`}</h4>
                  <p className="text-sm text-gray-500">
                    Know about return & exchange policy
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  expandedSections.returns ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.returns && (
              <div className="px-4 pb-4 text-sm text-gray-600">
                <p>
                  {`We offer easy returns and exchanges within ${
                    zone?.returnDays || 0
                  } days of delivery.
                Items should be in original condition with tags attached.`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex justify-center">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-sm font-medium">100% SECURE</p>
              <p className="text-xs text-gray-500">PAYMENT</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <RotateCcw className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">EASY RETURNS &</p>
              <p className="text-xs text-gray-500">INSTANT REFUNDS</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-sm font-medium">100% GENUINE</p>
              <p className="text-xs text-gray-500">PRODUCT</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 pb-20">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              <button className="pb-3 border-b-2 border-yellow-400 font-semibold">
                Product Reviews
              </button>
              <button className="pb-3 text-gray-500">Brand Reviews</button>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                <span className="text-sm">
                  <ThumbsUp className="w-6 h-6 text-red-500" />
                </span>
                <span className="text-sm font-medium">
                  {product.recommendPercentage + " %"}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                of verified buyers recommend this product
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Rating Summary */}
              <div className="lg:w-1/3">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2">
                    {product.averageRating.toFixed(2) || 0.0}
                  </div>
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(product.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : star <= product.averageRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    {product.totalReviews} ratings
                  </div>
                  <button
                    onClick={() => setIsRateModalOpen(true)}
                    className="w-full mt-3 text-blue-600 border border-blue-600 px-4 py-2 cursor-pointer hover:bg-blue-600 hover:text-white ease-in-out rounded text-sm"
                  >
                    RATE
                  </button>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="w-4">{rating}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            rating === 5
                              ? "bg-green-500"
                              : rating === 4
                              ? "bg-green-400"
                              : rating === 3
                              ? "bg-yellow-400"
                              : rating === 2
                              ? "bg-orange-400"
                              : "bg-red-400"
                          }`}
                          style={{
                            width:
                              maxRatingCount > 0
                                ? `${
                                    (ratingDistribution[rating] /
                                      maxRatingCount) *
                                    100
                                  }%`
                                : "0%",
                          }}
                        />
                      </div>
                      <span className="text-gray-600 w-8 text-right">
                        ({ratingDistribution[rating]})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:w-2/3">
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">
                    Hear what our customers say ({product.reviews.length})
                  </h4>

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      "Most Helpful",
                      "Most Recent",
                      "Product Quality",
                      "Color",
                      "Material",
                      "Fit",
                      "Price",
                    ].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveReviewFilter(filter)}
                        className={`px-3 py-1 text-sm rounded-full border ${
                          activeReviewFilter === filter
                            ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                            : "border-gray-300 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                <div className="space-y-6 h-100 overflow-y-scroll scrollbar-hide">
                  {getFilteredReviews().map((review) => (
                    <div
                      key={review.reviewId}
                      className="border-b border-gray-100 pb-6"
                    >
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm">
                          <Check className="w-4 h-4 ml-2 mr-[-5px] cursor-pointer text-green-600" />
                        </span>
                        <span className="ml-1 text-green-600 text-sm">
                          Verified Buyer
                        </span>
                      </div>

                      <p className="text-gray-800 mb-3">{review.comment}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {review.userName}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs">
                            ({ratingDistribution[review.rating]}) People found
                            this helpful
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isRateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
            <button
              onClick={() => setIsRateModalOpen(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-4">Rate this Product</h2>

            {/* Star Rating */}
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>

            {/* Recommendation */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 font-medium mb-2">
                Would you recommend this product?
              </p>
              <div className="flex gap-4">
                <ThumbsUp
                  className={`w-6 h-6 cursor-pointer ${
                    recommendProduct === true
                      ? "fill-green-500 text-green-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => setRecommendProduct(true)}
                />
                <ThumbsDown
                  className={`w-6 h-6 cursor-pointer ${
                    recommendProduct === false
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => setRecommendProduct(false)}
                />
              </div>
            </div>

            {/* Comment Box */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
            />

            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
              onClick={handleSubmitReview}
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
