"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import searchStore from "../../store/searchStore";
import FilterSection from "../../components/FilterSection";
import api from "../../utils/Axios";
import { useSearchParams } from "next/navigation";

const CategoriesPage = () => {
  const searchParams = useSearchParams();
  const { searchResults, searchTerm } = searchStore();
  const [filteredResults, setFilteredResults] = useState(searchResults);
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

    if (filters.mainCategory?.length) {
      filtered = filtered.filter((product) =>
        filters.mainCategory.includes(product.mainCategory)
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

  useEffect(() => {
    const raw = searchParams.get("filter");
    if (raw) {
      try {
        const parsed = JSON.parse(decodeURIComponent(raw));
        console.log("parseddd--------------------------------");
        console.log(parsed);
        setAppliedFilters(parsed);
        const filtered = applyFilters(parsed, searchResults);
        setFilteredResults(filtered);
      } catch (err) {
        console.error("Failed to parse filters from URL", err);
      }
    } else {
      // Default if no filter in URL
      setFilteredResults(searchResults);
    }
  }, [searchParams, searchResults]);

  return (
    <div className="search-results-page md:pt-7 mt-10">
      <div className="flex flex-row items-start justify-start lg:flex-row px-4 py-4 gap-4">
        <div className="w-1/3 md:w-1/4">
          <FilterSection
            showFilters={true}
            initialFilters={appliedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="flex-1">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Filtered Products ({filteredResults.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mr-5 md:mr-20">
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

export default CategoriesPage;
