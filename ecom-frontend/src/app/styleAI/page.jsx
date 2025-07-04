"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import FilterSection from "../../components/FilterSection";
import api from "../../utils/Axios";
import { toast } from "sonner";

const StyleAIPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const initialFilters = {
    mainCategory: [],
    category: [],
    color: [],
    gender: [],
    sizes: [],
    brand: [],
    sleeve: [],
    discount: [],
    ageGroup: [],
    fitType: [],
    designType: [],
    occasion: [],
  };

  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/all");
      const data = res.data;
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast.error(`Error fetching products: ${error}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://localhost:5000/styleAI", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const result = await response.json();
      setAiResults(result);
      
      // Apply AI results as filters
      const aiFilters = {
        mainCategory: result.mainCategory || [],
        category: result.category || [],
        color: result.color || [],
        gender: result.gender || [],
        sizes: result.sizes || [],
        brand: result.brand || [],
        sleeve: result.sleeve || [],
        discount: result.discount || [],
        ageGroup: result.ageGroup || [],
        fitType: result.fitType || [],
        designType: result.designType || [],
        occasion: result.occasion || [],
      };
      
      setAppliedFilters(aiFilters);
      applyFilters(aiFilters, products);
      toast.success("Image analyzed successfully!");
    } catch (error) {
      toast.error(`Error analyzing image: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyFilters = (filters, productList) => {
    let filtered = [...productList];

    if (filters.gender?.length) {
      filtered = filtered.filter((product) =>
        filters.gender.includes(product.targetGender)
      );
    }

    if (filters.sizes?.length) {
      filtered = filtered.filter((product) =>
        product.colorVariants?.some((variant) =>
          variant.sizes?.some((sizeObj) => filters.sizes.includes(sizeObj.size))
        )
      );
    }

    if (filters.brand?.length) {
      filtered = filtered.filter((product) =>
        filters.brand.includes(product.productBrand)
      );
    }

    if (filters.sleeve?.length) {
      filtered = filtered.filter((product) =>
        filters.sleeve.includes(product.sleeveType)
      );
    }

    if (filters.ageGroup?.length) {
      filtered = filtered.filter((product) =>
        filters.ageGroup.includes(product.targetAgeGroup)
      );
    }

    if (filters.fitType?.length) {
      filtered = filtered.filter((product) =>
        filters.fitType.includes(product.fitType)
      );
    }

    if (filters.designType?.length) {
      filtered = filtered.filter((product) =>
        filters.designType.includes(product.designType)
      );
    }

    if (filters.occasion?.length) {
      filtered = filtered.filter((product) =>
        filters.occasion.includes(product.occasion)
      );
    }

    if (filters.category?.length) {
      filtered = filtered.filter((product) =>
        filters.category.includes(product.category)
      );
    }

    if (filters.color?.length) {
      filtered = filtered.filter((product) =>
        product.colorVariants?.some((variant) =>
          filters.color.some(
            (selectedColor) =>
              variant.colorName.toLowerCase() === selectedColor.toLowerCase()
          )
        )
      );
    }

    if (filters.mainCategory?.length) {
      filtered = filtered.filter((product) =>
        filters.mainCategory.includes(product.mainCategory)
      );
    }

    if (filters.discount?.length) {
      filtered = filtered.filter((product) => {
        const discount = product.discountPercent || 0;
        return filters.discount.some((range) => {
          const value = parseInt(range.match(/\d+/)[0]);
          return discount >= value;
        });
      });
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setAppliedFilters(newFilters);
    applyFilters(newFilters, products);
  };

  const resetFilters = () => {
    setAppliedFilters(initialFilters);
    setFilteredProducts(products);
    setAiResults(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="style-ai-page">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Style AI
          </h1>
          <p className="text-xl md:text-2xl mb-2">
            Upload your fashion image and find similar products instantly
          </p>
          <p className="text-lg opacity-90">
            Powered by AI to match your style preferences
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-start px-4 py-8 gap-8 max-w-7xl mx-auto">

        <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-30 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          
          {/* Image Upload Section */}
          <div className="bg-white rounded-sm shadow-lg p-6 border border-gray-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Upload Your Style
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-sm p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                </label>
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-90 object-cover rounded-sm border"
                  />
                </div>
              )}

              <button
                onClick={handleAnalyzeImage}
                disabled={!selectedImage || isProcessing}
                className="w-full bg-amber-600 text-white py-3 px-6 rounded-sm font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Analyze Style"
                )}
              </button>

              {aiResults && (
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-400 text-white py-2 px-4 rounded-sm hover:bg-gray-600 transition-colors"
                >
                  Reset & Upload New Image
                </button>
              )}
            </div>
          </div>

          {aiResults && (
            <div className="bg-white rounded-sm shadow-lg p-6 border border-gray-300">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                AI Analysis Results
              </h3>
              
              <div className="space-y-3">
                {aiResults.description && (
                  <div>
                    <h4 className="font-semibold text-gray-700">Description:</h4>
                    <p className="text-gray-600 text-sm">{aiResults.description}</p>
                  </div>
                )}
                
                {aiResults.keywords && aiResults.keywords.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700">Keywords:</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiResults.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Products */}
        <div className="w-full lg:w-2/3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {aiResults ? "Matching Products" : "All Products"} ({filteredProducts.length})
            </h2>
            {aiResults && (
              <p className="text-gray-600">
                Products matching your uploaded style
              </p>
            )}
          </div>

          <div className="grid grid-cols- md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.productId} className="product-card-wrapper">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-lg">
                    {products.length > 0
                      ? "No products match the current filters."
                      : "No products found."}
                  </p>
                  {aiResults && (
                    <p className="text-sm mt-2">
                      Try uploading a different image or adjusting the filters.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StyleAIPage;