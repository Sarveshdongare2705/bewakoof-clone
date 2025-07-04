"use client";

import {
  address,
  cart,
  logoutBut,
  menu,
  search,
  styleAI,
  trending,
  wishlist,
} from "../assets/Assets";
import userStore from "../store/userStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import cartStore from "../store/cartStore";
import wishListStore from "../store/wishListStore";
import api from "../utils/Axios";
import { toast } from "sonner";
import searchStore from "../store/searchStore";
import prodcutStore from "../store/productStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Truck,
  Package,
  Package2,
  ShoppingBag,
  Heart,
  Power,
  Menu,
  MenuIcon,
} from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const user = userStore((state) => state.user);
  const logout = userStore((state) => state.logout);
  const currentAddress = userStore((state) => state.currentAddress);
  const getCurrentAddress = userStore((state) => state.getCurrentAddress);
  const cartCount = cartStore((state) => state.cartCount);
  const wishListCount = wishListStore((state) => state.wishListCount);
  const wishList = wishListStore((state) => state.wishList);
  const fetchCart = cartStore((state) => state.fetchCart);
  const fetchWishlist = wishListStore((state) => state.fetchWishlist);
  const chooseGender = userStore((state) => state.chooseGender);
  const choice = userStore((state) => state.choice);
  const setSearchData = searchStore((state) => state.setSearchData);
  const products = prodcutStore((state) => state.products);

  const addrRef = useRef();

  //g-sap part
  useGSAP(() => {
    gsap.to(addrRef.current, {
      y: -3,
      repeat: -1,
      repeatDelay: 1,
      yoyo: true,
      duration: 1,
    });
  }, [user]);

  const categories = [
    {
      name: "Joggers",
      filter: {
        mainCategory: ["Bottomwear"],
        category: ["JOGGERS"],
        color : [],
        gender: [],
        sizes: [],
        brand: [],
        sleeve: [],
        discount: [],
        ageGroup: [],
        fitType: [],
        designType: [],
        occasion: [],
      },
    },
    {
      name: "T-Shirts",
      filter: {
        mainCategory: ["Topwear"],
        category: ["T_SHIRT"],
        color : [],
        gender: [],
        sizes: [],
        brand: [],
        sleeve: [],
        discount: [],
        ageGroup: [],
        fitType: [],
        designType: [],
        occasion: [],
      },
    },
    {
      name: "Shirts",
      filter: {
        mainCategory: ["Topwear"],
        category: ["SHIRT"],
        color : [],
        gender: [],
        sizes: [],
        brand: [],
        sleeve: [],
        discount: [],
        ageGroup: [],
        fitType: [],
        designType: [],
        occasion: [],
      },
    },
    {
      name: "Hoodies",
      filter: {
        mainCategory: ["Topwear"],
        category: ["HOODIE"],
        color : [],
        gender: [],
        sizes: [],
        brand: [],
        sleeve: [],
        discount: [],
        ageGroup: [],
        fitType: [],
        designType: [],
        occasion: [],
      },
    },
    {
      name: "Jeans",
      filter: {
        mainCategory: ["Bottomwear"],
        category: ["JEANS"],
        color : [],
        gender: [],
        sizes: [],
        brand: [],
        sleeve: [],
        discount: [],
        ageGroup: [],
        fitType: [],
        designType: [],
        occasion: [],
      },
    },
    {
      name: "Shorts",
      filter: {
        mainCategory: ["Bottomwear"],
        category: ["SHORTS"],
        color : [],
        gender: [],
        sizes: [],
        brand: [],
        sleeve: [],
        discount: [],
        ageGroup: [],
        fitType: [],
        designType: [],
        occasion: [],
      },
    },
    {
      name: "Sweatshirts",
      filter: {
        mainCategory: ["Topwear"],
        category: ["SWEATSHIRT"],
        color : [],
        gender: [],
        sizes: [],
        brand: [],
        sleeve: [],
        discount: [],
        ageGroup: [],
        fitType: [],
        designType: [],
        occasion: [],
      },
    },
    {
      name: "Shoes",
      filter: {
        mainCategory: [],
        category: [],
        color : [],
        gender: [],
        sizes: [],
        brand: [],
        sleeve: [],
        discount: [],
        ageGroup: [],
        fitType: [],
        designType: [],
        occasion: [],
      }, // Not in category list, you can later customize
    },
    {
      name: "Accessories",
      filter: {
        mainCategory: [],
        category: [],
        color : [],
        gender: [],
        sizes: [],
        brand: [],
        sleeve: [],
        discount: [],
        ageGroup: [],
        fitType: [],
        designType: [],
        occasion: [],
      }, // Not in category list
    },
    {
      name: "Caps",
      filter: {
        mainCategory: [],
        category: [],
        color : [],
        gender: [],
        sizes: [],
        brand: [],
        sleeve: [],
        discount: [],
        ageGroup: [],
        fitType: [],
        designType: [],
        occasion: [],
      }, // Not in category list
    },
  ];
  const handleCategoryClick = (filter) => {
    setSearchData(products);
    router.push(
      `/categories?filter=${encodeURIComponent(JSON.stringify(filter))}`
    );
  };

  const isHomePage = pathName === "/";
  const isProductDetailsPage = pathName.startsWith("/product/");
  const isCategoriesPage = pathName.startsWith("/categories");
  const isCartPage = pathName.startsWith("/cart");

  const handleLogout = () => {
    logout();
  };

  //button part
  const chooseBut = (data) => {
    chooseGender(data);
  };

  useEffect(() => {
    if (user) {
      getCurrentAddress();
      fetchWishlist();
    }
  }, [user, getCurrentAddress]);

  //search part
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchProducts = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await api.get(
        `/search/products/${searchTerm}?choice=${choice}`
      );

      const updatedResults = response.data.map((result) => {
        const color = result.colorVariants?.[0];
        const image =
          color?.images?.[0]?.url || "https://via.placeholder.com/50";
        return {
          ...result,
          imageUrl: image,
        };
      });
      console.log(updatedResults);
      setSearchResults(updatedResults);
    } catch (error) {
      toast.error(`An error occured during search : ${error}`);
      console.log(error);
      setSearchResults([]);
    }
  };

  const getSearchHistory = async () => {
    try {
      const res = await api.get("/search-history");
      setSearchHistory(res.data);
    } catch (error) {}
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchProducts();
      getSearchHistory();
    }, 700);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  //menu part
  const mensMenu = [
    {
      title: "Topwear",
      links: [
        "All Topwear",
        "All T-Shirts",
        "Oversized T-shirts",
        "Classic Fit T-shirts",
        "All Shirts",
        "Half Sleeve T-Shirts",
        "Printed T-Shirts",
        "Plain T-Shirts",
        "Plus Size Topwear",
        "Customize T-shirts",
        "Polo T-Shirts",
      ],
    },
    {
      title: "Bottomwear",
      links: [
        "All Bottomwear",
        "Joggers",
        "Trousers & Pants",
        "Trackpants",
        "Jeans",
        "Pajamas",
        "Shorts",
        "Boxers",
        "Plus Size Bottomwear",
        "Cargos",
        "Cargo Joggers",
      ],
    },
    {
      title: "Plus Size",
      links: [
        "All Plus-size",
        "All Topwear",
        "All Bottomwear",
        "All T-shirts",
        "All Shirts",
        "Joggers",
        "Pants & Trousers",
        "Jeans",
        "Pajamas",
        "shorts",
        "Hoodies",
      ],
    },
    {
      title: "Footwear",
      links: ["Bewakoof Sneakers", "Sliders", "Casual Shoes"],
    },
    {
      title: "Accessories",
      links: [
        "Mobile covers",
        "Backpacks",
        "Sunglasses",
        "Sling bags",
        "Caps",
        "Mobile Card-holder",
      ],
    },
  ];
  const womensMenu = [
    {
      title: "Topwear",
      links: [
        "All Topwear",
        "T-Shirts",
        "Oversized T-Shirts",
        "Crop Tops",
        "Shirts",
        "Tops",
        "Tunics",
        "Kurtis",
        "Hoodies & Sweatshirts",
        "Jackets",
        "Sweaters",
      ],
    },
    {
      title: "Bottomwear",
      links: [
        "All Bottomwear",
        "Jeans",
        "Joggers",
        "Trousers & Pants",
        "Leggings",
        "Pajamas",
        "Shorts",
        "Skirts",
        "Culottes",
        "Palazzos",
      ],
    },
    {
      title: "Indian Wear",
      links: [
        "Kurtas",
        "Kurtis",
        "Kurta Sets",
        "Ethnic Dresses",
        "Dupattas",
        "Sarees",
      ],
    },
    {
      title: "Plus Size",
      links: [
        "All Plus-size",
        "Plus Size T-Shirts",
        "Plus Size Tops",
        "Plus Size Bottomwear",
        "Plus Size Dresses",
        "Plus Size Kurtis",
      ],
    },
    {
      title: "Footwear",
      links: ["Sneakers", "Sliders", "Flats", "Heels", "Casual Shoes"],
    },
    {
      title: "Accessories",
      links: [
        "Bags & Backpacks",
        "Mobile Covers",
        "Sling Bags",
        "Sunglasses",
        "Caps & Hats",
        "Jewellery",
        "Belts",
        "Wallets",
      ],
    },
  ];
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const stripRef1 = useRef();
  const stripRef2 = useRef();
  const bannerText =
    isProductDetailsPage || isCartPage
      ? "Free shipping on orders above ₹1,499 !"
      : isCategoriesPage
      ? "Latest products available with offers"
      : "";
  useGSAP(() => {
    if (stripRef1.current && stripRef2.current) {
      // First strip animation
      gsap.fromTo(
        stripRef1.current,
        {
          x: "-100%",
          rotation: 45,
        },
        {
          x: "100vw",
          rotation: 45,
          duration: 2,
          repeat: -1,
          delay: 0.05,
          ease: "none",
          repeatDelay: 2,
        }
      );

      // Second strip animation with delay
      gsap.fromTo(
        stripRef2.current,
        {
          x: "-100%",
          rotation: 45,
        },
        {
          x: "100vw",
          rotation: 45,
          duration: 2,
          repeat: -1,
          delay: 0,
          ease: "none",
          repeatDelay: 2,
        }
      );
    }
  }, [isProductDetailsPage, isCategoriesPage, isCartPage]);

  return (
    <div className="fixed flex flex-col w-screen z-999">
      <div className="bg-gray-200 flex flex-row w-full items-center justify-between overflow-hidden px-2 py-2 md:px-30 lg:px-40">
        <div className="flex gap-4">
          <span className="font-normal text-[10px] cursor-pointer text-gray-800 hidden md:block">
            Offers.
          </span>
          <span className="font-normal text-[10px] cursor-pointer text-gray-800 hidden md:block">
            Fanbook.
          </span>
          <span className="font-bold text-[10px] cursor-pointer text-gray-800">
            Download App.
          </span>
          <span className="font-normal cursor-pointer text-[10px] text-gray-800 hidden md:block">
            Find a store near me.
          </span>
        </div>
        <div className="flex gap-4">
          <span className="font-bold text-[10px] cursor-pointer text-gray-900 ">
            Contact Us.
          </span>
          <span className="font-bold cursor-pointer text-[10px] text-gray-900">
            Track Order.
          </span>
        </div>
      </div>
      <div
        style={{ backgroundColor: "white" }}
        className=" w-screen flex 
    justify-between relative
    items-center max-w-screen px-3 py-2 md:flex lg:px-22 border-b-1 pr-6 md:pr-0 border-gray-200"
      >
        <div id="box" className="flex gap-7 items-baseline">
          <Link
            style={{ backgroundColor: "white" }}
            href={"/"}
            className="py-2 hidden md:block"
          >
            <span
              style={{ backgroundColor: "#facc15" }}
              className=" text-xl py-2 text-black font-extrabold px-5 md:block "
            >
              {"BEWAKOOF."}
            </span>
          </Link>
          <Link
            style={{ backgroundColor: "white" }}
            href={"/"}
            className="py-2 block md:hidden"
          >
            <span
              style={{ backgroundColor: "#facc15" }}
              className="text-md py-3 text-black font-extrabold px-5 rounded-sm "
            >
              {"B"}
            </span>
          </Link>
          <div className="flex flex-row gap-4 items-center justify-center hidden  xl:flex ">
            {choice ? (
              <button className=" text-base cursor-pointer py-2">
                {"men"}
              </button>
            ) : (
              <button className=" text-base cursor-pointer py-2">women</button>
            )}
            <button className=" text-base cursor-pointer py-2">
              accessories
            </button>
          </div>
        </div>
        {user ? (
          <div className="flex items-center">
            {isHomePage && (
              <div className="relative">
                <div className="bg-gray-50 flex items-center gap-3 py-2 px-3">
                  <Image src={search} alt="wish" width={27} height={27} />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full min-w-40 max-w-200 border-none bg-transparent outline-none font-normal text-sm lg:min-w-80 lg:max-w-120"
                    placeholder="Search for a product"
                  />
                </div>
                {searchResults.length !== 0 && (
                  <div className="absolute w-full h-[300px] bg-white shadow-sm mt-1 z-999">
                    <div className="w-full h-[70px] px-2 py-2 ">
                      <span className="w-screen text-black font-light text-xs">
                        Recent searches ...
                      </span>
                      <div className="flex overflow-x-auto whitespace-nowrap  scrollbar-hide mt-2 pr-30">
                        {searchHistory
                          .filter((item) =>
                            item
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((search, id) => (
                            <button
                              style={{ backgroundColor: "#f9f9f9" }}
                              className="w-full flex gap-3 py-2 px-3 mr-1  text-xs"
                            >
                              <Image
                                src={trending}
                                alt=""
                                width={12}
                                height={12}
                              />
                              <span className="mr-2">{search}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                    <div className="px-2 py-2 mt-3 flex flex-col bg-yellow-100 border-t-1 border-b-1 border-y-amber-800">
                      <Link
                        href={"/result"}
                        onClick={() => {
                          setSearchData(searchResults, searchTerm);
                        }}
                        className="text-xs text-yellow-800 font-normal"
                      >{`Total products obtained from search ( ${searchResults.length} ) Check All...`}</Link>
                    </div>
                    <div className="h-[160px] mt-2 overflow-y-scroll scrollbar-hide px-2 ">
                      {searchResults.map((product) => (
                        <Link
                          href={`/product/${product.productId}`}
                          key={product.productId}
                          className="bg-gray-50 flex mb-2 gap-3 py-2"
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.productName}
                            className="w-[50px] h-[70px] ml-2 md:w-[60px] md:h-[80px]"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/50";
                            }}
                          />
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-light">
                              {product.productName}
                            </span>
                            <span className="text-xs font-normal">
                              {product.productBrand}
                            </span>
                            <span className="text-sm font-bold">{` ${formatPrice(
                              product.discountPrice
                            )}`}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <Link
              id="buttons"
              href={"/profile"}
              className="pr-4 pl-2 font-normal text-base border-r-2 border-gray-200 md:mx-2 hidden md:block"
            >
              <span>{user?.userName.split(" ")[0]}</span>
            </Link>
            <Link href={"/profile"} className="nav-but block md:hidden">
              <MenuIcon className="w-6 h-6 text-gray-700" />
            </Link>
            <button
              onClick={() => router.push("/profile")}
              className="relative flex flex-col items-center justify-center nav-but hidden md:block"
            >
              <Image
                ref={addrRef}
                src={address}
                alt="home"
                width={21}
                height={21}
              />
              {!currentAddress ? (
                <span className="text-xs font-light mt-1">Set address</span>
              ) : (
                <span className="text-xs font-light mt-1 ml-[-7px]">
                  {currentAddress.addressType.toLowerCase() || "Set address"}
                </span>
              )}
            </button>

            <Link
              href={"/wishlist"}
              onClick={() => {
                setSearchData(wishList, "");
              }}
              className="relative nav-but hidden md:block"
            >
              <span className="absolute top-[-11px] right-[-11px] bg-red-400 rounded-full w-[20px] h-[20px] text-xs text-center pt-0.5 pl-[1px]">
                {wishListCount}
              </span>
              <Heart className="w-6 h-6 text-gray-700" />
            </Link>
            <Link href={"/cart"} className="nav-but relative">
              <span className="absolute top-[-11px] right-[-11px] bg-yellow-400 rounded-full w-[20px] h-[20px] text-xs text-center pt-0.5 pl-[1px]">
                {cartCount}
              </span>
              <ShoppingBag className="w-6 h-6 text-gray-700" />
            </Link>

            <Link href={"/styleAI"} className="relative nav-but hidden md:block overflow-visible">
              <Image
                src={styleAI}
                alt="style"
                width={30}
                height={30}
                className="w-[27px] h-[27px]"
              />
            </Link>

            <button className="nav-but hidden md:block" onClick={handleLogout}>
              <Power className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <Link
              href={"/login"}
              className="px-4 font-medium text-base border-r-2 "
            >
              <span>{"Login"}</span>
            </Link>
          </div>
        )}

        {/* <div
          className="absolute top-19 left-[90px] bg-white h-[400px] z-999"
          style={{ width: "calc(100% - 180px)", right: "120px" }}
        ></div> */}
      </div>
      {isHomePage && (
        <div className="flex items-center bg-white w-screen px-4 py-3 md:px-10 sm:items-center sm:justify-center z-399">
          <div className="relative flex bg-gray-100 w-[300px] h-[60px] rounded-full overflow-hidden px-[2px] py-[4px] gap-1">
            {/* Sliding highlight pill */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-1 left-1 w-[calc(50%-8px)] h-[calc(100%-8px)] bg-yellow-400 rounded-full z-0"
              style={{
                transform: choice ? "translateX(0%)" : "translateX(100%)",
                transition: "transform 0.3s ease",
              }}
            />

            {/* MEN Button */}
            <button
              onClick={() => chooseBut("MEN")}
              className={`flex-1 z-10 flex items-center justify-center text-center rounded-full cursor-pointer font-medium ${
                choice ? "text-black" : "text-gray-500"
              }`}
            >
              MEN
            </button>

            {/* WOMEN Button */}
            <button
              onClick={() => chooseBut("WOMEN")}
              className={`flex-1 z-10 flex items-center justify-center text-center rounded-full cursor-pointer font-medium ${
                !choice ? "text-black" : "text-gray-500"
              }`}
            >
              WOMEN
            </button>
          </div>
          <div className="flex overflow-x-auto scroll-smooth w-[110px] whitespace-nowrap scrollbar-hide gap-2 px-4 sm:w-[30px] lg:flex md:w-full">
            {categories.map((item, index) => (
              <button
                id="buttons"
                key={index}
                className="nav-opt whitespace-nowrap"
                onClick={() => handleCategoryClick(item.filter)}
              >
                {item.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
      {isProductDetailsPage && (
        <div className="relative w-screen bg-blue-400 py-4 flex items-center overflow-hidden h-[27px]">
          <div
            ref={stripRef1}
            className="absolute top-[-50px] w-7 h-40 bg-white  opacity-[0.4]"
          />
          <div
            ref={stripRef2}
            className="absolute  top-[-50px] w-7 h-40  bg-white  opacity-[0.4]"
          />

          {/* Banner Text */}
          <div className="w-full flex gap-1 items-center justify-center">
            <Package className="w-5 h-5 text-white" />
            <span className="relative flex items-center text-center justify-center font-bold text-white text-sm z-10">
              {bannerText}
            </span>
          </div>
        </div>
      )}
      {isCartPage && (
        <div className="relative w-screen bg-blue-400 py-4 flex items-center overflow-hidden h-[27px]">
          <div
            ref={stripRef1}
            className="absolute top-[-50px] w-7 h-40 bg-white  opacity-[0.4]"
          />
          <div
            ref={stripRef2}
            className="absolute  top-[-50px] w-7 h-40  bg-white  opacity-[0.4]"
          />

          {/* Banner Text */}
          <div className="w-full flex gap-1 items-center justify-center">
            <Package className="w-5 h-5 text-white" />
            <span className="relative flex items-center text-center justify-center font-bold text-white text-sm z-10">
              {bannerText}
            </span>
          </div>
        </div>
      )}
      {isCategoriesPage && (
        <div className="relative w-screen bg-green-500 py-4 flex items-center overflow-hidden h-[27px]">
          <div
            ref={stripRef1}
            className="absolute top-[-50px] w-7 h-40 bg-white  opacity-[0.4]"
          />
          <div
            ref={stripRef2}
            className="absolute  top-[-50px] w-7 h-40  bg-white  opacity-[0.4]"
          />

          {/* Banner Text */}
          <div className="w-full flex gap-1 items-center justify-center">
            <Package2 className="w-5 h-5 text-white" />
            <span className="relative flex items-center text-center justify-center font-bold text-white text-sm z-10">
              {bannerText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
