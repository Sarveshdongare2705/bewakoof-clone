"use client";

import ProductCard from "../components/ProductCard";
import {
  ban1,
  ban2,
  ban3,
  ban4,
  ban5,
  ban6,
  cargos,
  classic,
  fullsleeve,
  jeans,
  joggers,
  merch1,
  merch2,
  merch3,
  merch4,
  merch5,
  merch6,
  oversized_tshirts,
  pants,
  pyjamas,
  shirts,
  shorts,
} from "../assets/Assets";
import userStore from "../store/userStore";
import { Montserrat_Alternates, Outfit } from "next/font/google";
import Image from "next/image";
import prodcutStore from "../store/productStore";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import searchStore from "../store/searchStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const outfit = Montserrat_Alternates({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const merch = [
  { imgMerch: merch1, name: "The Squid Game Collection" },
  { imgMerch: merch2, name: "The Marvel Collection" },
  { imgMerch: merch3, name: "The Harry Potter Collection" },
  { imgMerch: merch4, name: "The Disney's Collection" },
  { imgMerch: merch5, name: "The DC Collection" },
];

const categories = [
  {
    img: cargos,
    name: "Cargos",
    filter: {
      mainCategory: ["Bottomwear"],
      category: ["TROUSERS", "TRACK_PANTS"],
      gender: [],
      sizes: [],
      brand: [],
      sleeve: [],
      discount: [],
      ageGroup: [],
      fitType: ["LOOSE", "RELAXED"],
      designType: [],
      occasion: ["CASUAL_WEAR", "TRAVEL"],
    },
  },
  {
    img: classic,
    name: "Classic Fit T-shirts",
    filter: {
      mainCategory: ["Topwear"],
      category: ["T_SHIRT"],
      gender: [],
      sizes: [],
      brand: [],
      sleeve: [],
      discount: [],
      ageGroup: [],
      fitType: ["REGULAR", "SLIM"],
      designType: [],
      occasion: [],
    },
  },
  {
    img: fullsleeve,
    name: "Full sleeve T-shirts",
    filter: {
      mainCategory: ["Topwear"],
      category: ["T_SHIRT"],
      gender: ["MEN"],
      sizes: [],
      brand: [],
      sleeve: ["FULL_SLEEVE"],
      discount: [],
      ageGroup: [],
      fitType: ["REGULAR", "SLIM"],
      designType: [],
      occasion: [],
    },
  },
  {
    img: jeans,
    name: "Jeans",
    filter: {
      mainCategory: ["Bottomwear"],
      category: ["JEANS"],
      gender: ["MEN"],
      sizes: [],
      brand: [],
      sleeve: [],
      discount: [],
      ageGroup: [],
      fitType: ["SLIM", "REGULAR"],
      designType: [],
      occasion: [],
    },
  },
  {
    img: joggers,
    name: "Joggers",
    filter: {
      mainCategory: ["Bottomwear"],
      category: ["JOGGERS"],
      gender: ["MEN"],
      sizes: [],
      brand: [],
      sleeve: [],
      discount: [],
      ageGroup: [],
      fitType: ["RELAXED", "SLIM"],
      designType: [],
      occasion: [],
    },
  },
  {
    img: oversized_tshirts,
    name: "Oversized T-shirts",
    filter: {
      mainCategory: ["Topwear"],
      category: ["T_SHIRT"],
      gender: ["MEN"],
      sizes: [],
      brand: [],
      sleeve: ["HALF_SLEEVE", "FULL_SLEEVE"],
      discount: [],
      ageGroup: [],
      fitType: ["OVERSIZED"],
      designType: ["GRAPHIC_PRINT", "TYPOGRAPHY"],
      occasion: ["CASUAL_WEAR", "LOUNGEWEAR"],
    },
  },
  {
    img: pants,
    name: "Pants",
    filter: {
      mainCategory: ["Bottomwear"],
      category: ["TROUSERS"],
      gender: ["MEN"],
      sizes: [],
      brand: [],
      sleeve: [],
      discount: [],
      ageGroup: [],
      fitType: ["REGULAR", "RELAXED"],
      designType: ["SOLID"],
      occasion: ["FORMAL", "CASUAL_WEAR"],
    },
  },
  {
    img: pyjamas,
    name: "Pyjamas",
    filter: {
      mainCategory: ["Bottomwear"],
      category: ["PYJAMAS"],
      gender: ["MEN"],
      sizes: [],
      brand: [],
      sleeve: [],
      discount: [],
      ageGroup: [],
      fitType: ["RELAXED"],
      designType: [],
      occasion: ["LOUNGEWEAR", "CASUAL_WEAR"],
    },
  },
  {
    img: shirts,
    name: "Shirts",
    filter: {
      mainCategory: ["Topwear"],
      category: ["SHIRT"],
      gender: ["MEN"],
      sizes: [],
      brand: [],
      sleeve: ["FULL_SLEEVE", "HALF_SLEEVE"],
      discount: [],
      ageGroup: [],
      fitType: ["REGULAR", "SLIM"],
      designType: ["SOLID", "STRIPED", "CHECKED"],
      occasion: ["CASUAL_WEAR", "FORMAL", "PARTY"],
    },
  },
  {
    img: shorts,
    name: "Shorts",
    filter: {
      mainCategory: ["Bottomwear"],
      category: ["SHORTS"],
      gender: ["MEN"],
      sizes: [],
      brand: [],
      sleeve: [],
      discount: [],
      ageGroup: [],
      fitType: ["RELAXED", "REGULAR"],
      designType: [],
      occasion: ["CASUAL_WEAR", "GYM", "TRAVEL"],
    },
  },
];

export default function Home() {
  const merchRef = useRef();
  const bannerRef = useRef();
  const categoryRefs = useRef([]);
  categoryRefs.current = [];
  const router = useRouter();
  const user = userStore((state) => state.user);
  const products = prodcutStore((state) => state.products);
  const fetchProducts = prodcutStore((state) => state.fetchProducts);
  const choice = userStore((state) => state.choice);
  const setSearchData = searchStore((state) => state.setSearchData);
  const fetchByMerchandise = prodcutStore((state) => state.fetchByMerchandise);

  const handleFetchProducts = async () => {
    await fetchProducts(choice);
  };
  useEffect(() => {
    handleFetchProducts();
  }, [choice, user]);

  const handleCategoryClick = (filter) => {
    setSearchData(products);
    router.push(
      `/categories?filter=${encodeURIComponent(JSON.stringify(filter))}`
    );
  };
  useGSAP(() => {
    const items = gsap.utils.toArray(merchRef.current.children);

    items.forEach((item, i) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          y: 100,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: i * 0.2, // smooth stagger
          scrollTrigger: {
            trigger: item,
            start: "top 100%",
            toggleActions: "play none none none", // run once only
          },
        }
      );
    });
  }, [choice]);
  useEffect(() => {
    console.log(categoryRefs);
    categoryRefs.current.forEach((el) => {
      const onEnter = () => {
        gsap.to(el, {
          scale: 1.05,
          rotate: 3,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const onLeave = () => {
        gsap.to(el, {
          scale: 1,
          rotate: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      };

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      // cleanup
      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      };
    });
  }, []);

  useGSAP(() => {
    const container = bannerRef.current;
    gsap.fromTo(
      "#banner",
      {
        x: -10,
        opacity: 0,
        scale: 0.9,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        stagger: {
          amount: 0.4,
          from: "start",
        },
      }
    );
  }, [choice]);


  const handleMerchClick = (merchandiseName) => {
    router.push(
      `/merch?name=${encodeURIComponent(merchandiseName)}`
    );
  };


  return (
    <div className="h-[600px] bg-transparent w-screen pt-[110px] flex flex-col">
      <div ref={bannerRef} className="flex w-screen">
        <div id="banner" className="w-[1200px]  cursor-pointer">
          {choice ? (
            <Image src={ban1} alt="" className="w-full h-auto" />
          ) : (
            <Image src={ban4} alt="" className="w-full h-auto" />
          )}
        </div>
        <div id="banner" className="w-[1200px]">
          {choice ? (
            <Image src={ban2} alt="" className="w-full h-auto" />
          ) : (
            <Image src={ban5} alt="" className="w-full h-auto" />
          )}
        </div>
        <div id="banner" className="w-[1200px]">
          {choice ? (
            <Image src={ban3} alt="" className="w-full h-auto" />
          ) : (
            <Image src={ban6} alt="" className="w-full h-auto" />
          )}
        </div>
      </div>

      {/* Our Official Collection */}
      <div className="w-screen bg-amber-100 px-6 md:py-[60px] lg:mb-10 pt-10 pb-10">
        <h2 className="heading">Our Official Collection</h2>
        <div
          ref={merchRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-col-5 lg:grid-cols-5 gap-6"
        >
          {merch.map((item, index) => (
            <button
              onClick={() => handleMerchClick(item.name)}
              key={index}
              className="merch-item flex flex-col items-center cursor-pointer"
            >
              <Image
                src={item.imgMerch}
                alt={item.name}
                width={150}
                height={150}
                className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-cover rounded-full"
              />
              <span className="mt-3 text-xs md:text-sm font-medium text-center text-gray-700">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* <div className="w-full bg-blue-200 my-10 h-100">
        <div className=" absolute top-0 left-12 z-999 bg-black opacity-[0.4] w-20 h-100"></div>
        <span className="w-full h-full flex items-center justify-center font-extrabold text-4xl py-20">Free Shipping on orders above 999</span>
      </div> */}

      {/* Product Grid Section */}
      <div className="w-screen  bg-white  py-10  px-3 md:px-10 lg:px-30 pb-10">
        <h2 className="heading">Trending Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products &&
            products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
        </div>
      </div>
      <div className="flex flex-col w-screen  my-10 bg-violet-100 py-15">
        <h2 className="heading">Trending Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 md:gap-4 mb-4">
          {categories.slice(0, 6).map((item, index) => (
            <div
              key={index}
              ref={(el) => el && (categoryRefs.current[index] = el)}
              onClick={() => handleCategoryClick(item.filter)}
              className="cursor-pointer w-full h-auto"
            >
              <Image src={item.img} alt={item.name} className="w-full h-auto" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 md:gap-4 mb-4">
          {categories.slice(5, 10).map((item, index) => (
            <div
              key={index}
              ref={(el) => el && (categoryRefs.current[index + 6] = el)}
              onClick={() => handleCategoryClick(item.filter)}
              className="cursor-pointer w-full h-auto hover:scale-101"
            >
              <Image src={item.img} alt={item.name} className="w-screen h-auto" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white h-[200px] w-screen"></div>
    </div>
  );
}
