"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import searchStore from "../../store/searchStore";
import FilterSection from "../../components/FilterSection";
import api from "../../utils/Axios";

const WishlistPage = () => {
  const { searchResults, searchTerm } = searchStore();
  const [filteredResults, setFilteredResults] = useState(searchResults);
  const [appliedFilters, setAppliedFilters] = useState({});
  const showFilters = false;
  const initialFilters = {
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
  };

  const applyFilters = (filters, results) => {
    let filtered = [...results];

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

    return filtered;
  };

  const handleFilterChange = (newFilters) => {
    setAppliedFilters(newFilters);
    const filtered = applyFilters(newFilters, searchResults);
    setFilteredResults(filtered);
  };

  const addSearchHistory = async () => {
    try {
      await api.post(`/search-history/${searchTerm}`);
    } catch (error) {
      console.log("Failed to add search history:", error);
    }
  };

  useEffect(() => {
    addSearchHistory();
    setFilteredResults(searchResults);
  }, [searchResults]);

  return (
    <div className="search-results-page pt-7 px-5 md:px-20 lg:px-30">
      <div className="flex flex-row items-start justify-start lg:flex-row px-4 py-4 gap-4">
        {!showFilters && (
          <div className="w-1/4">
            <FilterSection
              initialFilters={initialFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}
        <div className="flex-1">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Your Wishlist ({filteredResults.length}) items
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((product) => (
                <div key={product.productId} className="product-card-wrapper">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                {searchResults.length > 0
                  ? "No products match the selected filters."
                  : "No products found."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
