"use client";
import Image from "next/image";
import { like, liked, star } from "../assets/Assets";
import api from "../utils/Axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import wishListStore from "../store/wishListStore";
import { useRouter } from "next/navigation";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ProductCard = ({ product }) => {
  const cardDetailRef = useRef();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const handleProductLike = wishListStore((state) => state.handleProductLike);

  const firstImage = product.colorVariants?.[0]?.images?.[0]?.url || null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const checkLike = async () => {
    try {
      const res = await api.get(`/wishlist/isPresent/${product.productId}`);
      setIsLiked(res.data === true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    await handleProductLike(isLiked, product);
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    checkLike();
  }, []);

  const handleCardClick = () => {
    router.push(`/product/${product.productId}`);
  };

  useGSAP(() => {
    const items = gsap.utils.toArray(cardDetailRef.current.children);
    items.forEach((item, i) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          x: 100,
          scale: 0.9,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          delay: i * 0.2, // smooth stagger
          scrollTrigger: {
            trigger: item,
            start: "top 120%",
            toggleActions: "play none none none", // run once only
          },
        }
      );
    });
  }, [product]);

  return (
    <div
      onClick={handleCardClick}
      className=" group border relative border-gray-100 rounded-lg overflow-hidden shadow-sm  transition duration-300 cursor-pointer bg-white hover:scale-101"
    >
      {product.hasComboOffer && (
        <div className="absolute top-0 left-[-2px] w-[40%] flex items-center bg-green-600 truncate px-4">
          <span className="text-white font-semibold text-[8px] py-1">
            {product.offerText}
          </span>
        </div>
      )}
      <div className="absolute flex gap-3 bottom-27 left-3 py-1 bg-white rounded-full truncate px-4">
        <Image
          src={star}
          alt=""
          width={12}
          className="object-contain w-full h-auto transition-transform duration-200"
        />
        <span className="text-black font-extrabold text-xs mt-1">
          {product.averageRating?.toFixed(1) || 0.0}
        </span>
      </div>
      {firstImage ? (
        <img
          src={firstImage}
          alt={product.productName}
          className="w-full h-auto object-cover transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center text-sm text-gray-500">
          No Image
        </div>
      )}

      <div className="p-3" ref={cardDetailRef}>
        {/* Brand and Wishlist */}
        <div className="flex items-start justify-between mb-1">
          <div className="w-[84%] flex flex-col items-start ">
            <p className="text-black font-bold text-sm mb-1">
              {product.productBrand}
            </p>
            <h3 className="text-xs w-[100%] text-gray-500 font-medium truncate">
              {product.productName}
            </h3>
          </div>
          <button onClick={handleLikeClick} className="p-1 cursor-pointer">
            <Image
              src={isLiked ? liked : like}
              alt="wishlist"
              width={22}
              height={22}
              className="transition-transform duration-200 hover:scale-110"
            />
          </button>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-black font-extrabold text-md">
            {formatPrice(product.discountPrice)}
          </span>
          <span className="text-gray-400 line-through text-xs">
            {formatPrice(product.productPrice)}
          </span>
          <span className="text-green-600 text-xs font-bold">
            {product.discountPercent}% off
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
