"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import ProductCard from "../../components/ProductCard";
import userStore from "../../store/userStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import {
  merch1,
  merch2,
  merch3,
  merch4,
  merch5,
} from "../../assets/Assets";

gsap.registerPlugin(ScrollTrigger);

// Collection data mapping
const collectionsData = {
  "The Squid Game Collection": {
    image: merch1,
    bgColor: "bg-gradient-to-br from-red-900 via-red-800 to-black",
    textColor: "text-white",
    accent: "text-red-400"
  },
  "The Marvel Collection": {
    image: merch2,
    bgColor: "bg-gradient-to-br from-red-600 via-blue-600 to-red-800",
    textColor: "text-white",
    accent: "text-yellow-400"
  },
  "The Harry Potter Collection": {
    image: merch3,
    bgColor: "bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-600",
    textColor: "text-white",
    accent: "text-amber-400"
  },
  "The Disney's Collection": {
    image: merch4,
    bgColor: "bg-gradient-to-br from-pink-500 via-blue-500 to-purple-600",
    textColor: "text-white",
    accent: "text-pink-200"
  },
  "The DC Collection": {
    image: merch5,
    bgColor: "bg-gradient-to-br from-gray-900 via-blue-900 to-black",
    textColor: "text-white",
    accent: "text-blue-400"
  }
};

export default function MerchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const collectionName = searchParams.get("name");
  const choice = userStore((state) => state.choice);
  
  const bannerRef = useRef();
  const productsRef = useRef();
  const titleRef = useRef();

  const collectionData = collectionsData[collectionName] || collectionsData["The Marvel Collection"];

  const fetchMerchandiseProducts = async () => {
    if (!collectionName) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `http://localhost:8080/products/merchandise/${encodeURIComponent(collectionName.toLowerCase())}?choice=${choice}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching merchandise products:", err);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (collectionName) {
      fetchMerchandiseProducts();
    }
  }, [collectionName, choice]);

  // Banner animation
  useGSAP(() => {
    if (bannerRef.current) {
      gsap.fromTo(
        bannerRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: -50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        }
      );
    }

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power2.out",
        }
      );
    }
  }, [collectionName]);

  // Products grid animation
  useGSAP(() => {
    if (productsRef.current && products.length > 0) {
      const productCards = gsap.utils.toArray(productsRef.current.children);
      
      gsap.fromTo(
        productCards,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: productsRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, [products]);

  if (!collectionName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Collection Not Found
          </h1>
          <p className="text-gray-600">Please select a valid collection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-7">
      {/* Hero Banner */}
      <div 
        ref={bannerRef}
        className="relative w-full h-[500px] md:h-[600px] overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={collectionData.image}
            alt={collectionName}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        {/* Left side gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>

        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="flex-1 max-w-2xl">
            <h1 
              ref={titleRef}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              {collectionName}
            </h1>
            <p className="text-lg md:text-xl text-white opacity-90 mb-6">
              Discover exclusive merchandise from your favorite universe
            </p>
            <div className="inline-block px-6 py-3 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
              <span className="font-semibold text-black">
                {products.length} Products Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-6 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-lg text-gray-600">Loading amazing products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">😔</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchMerchandiseProducts}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">🛍️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Products Found</h2>
              <p className="text-gray-600">
                We couldn't find any products for "{collectionName}". 
                Check back later for new arrivals!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Featured Products
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            
            <div 
              ref={productsRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {products.map((product) => (
                <div key={product.productId} className="transform transition-transform hover:scale-105">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA Section */}
      {!loading && !error && products.length > 0 && (
        <div className={`w-full py-16 ${collectionData.bgColor}`}>
          <div className="container mx-auto px-6 text-center">
            <h3 className={`text-2xl md:text-3xl font-bold ${collectionData.textColor} mb-4`}>
              Love this collection?
            </h3>
            <p className={`text-lg ${collectionData.textColor} opacity-90 mb-8`}>
              Get exclusive updates on new arrivals and special offers
            </p>
            <button className={`px-8 py-4 bg-white ${collectionData.accent} font-semibold rounded-full hover:bg-opacity-90 transition-all transform hover:scale-105`}>
              Notify Me
            </button>
          </div>
        </div>
      )}
    </div>
  );
}