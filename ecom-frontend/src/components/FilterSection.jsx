"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import clothingColors from "../assets/clothingColors";

const FilterSection = ({ initialFilters, onFilterChange }) => {
  const [filters, setFilters] = useState(initialFilters);

  const [expandedSections, setExpandedSections] = useState({
    mainCategory: true,
    category: true,
    color: true,
    gender: true,
    sizes: true,
    brand: false,
    sleeve: false,
    discount: false,
    ageGroup: false,
    fitType: false,
    designType: false,
    occasion: false,
  });

  const filterOptions = {
    mainCategory: ["Topwear", "Bottomwear"],
    category: [
      "T_SHIRT",
      "SHIRT",
      "SWEATSHIRT",
      "HOODIE",
      "JACKET",
      "KURTA",
      "JEANS",
      "JOGGERS",
      "SHORTS",
      "TRACK_PANTS",
      "TROUSERS",
      "PYJAMAS",
    ],
    color: Object.keys(clothingColors),
    gender: ["WOMEN", "MEN"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    brand: ["Bewakoof", "Nike", "Adidas", "H&M"],
    sleeve: [
      "HALF_SLEEVE",
      "FULL_SLEEVE",
      "SLEEVELESS",
      "THREE_QUARTER_SLEEVE",
      "CAP_SLEEVE",
      "RAGLAN_SLEEVE",
      "PUFF_SLEEVE",
      "BELL_SLEEVE",
    ],
    discount: [
      "10% or more",
      "20% or more",
      "40% or more",
      "50% or more",
      "60% or more",
      "80% or more",
    ],
    ageGroup: ["KIDS", "TEENS", "ADULTS", "ALL"],
    fitType: ["REGULAR", "SLIM", "OVERSIZED", "RELAXED", "BODYCON", "LOOSE"],
    designType: [
      "GRAPHIC_PRINT",
      "PLAIN",
      "EMBROIDERED",
      "TYPOGRAPHY",
      "SOLID",
      "COLORBLOCK",
      "CHECKERED",
      "STRIPED",
    ],
    occasion: [
      "CASUAL_WEAR",
      "FORMAL",
      "PARTY",
      "SPORTS",
      "LOUNGEWEAR",
      "GYM",
      "TRAVEL",
      "FESTIVE",
      "WEDDING",
    ],
  };

  const handleCheckboxChange = (category, value) => {
    const updatedFilters = { ...filters };
    if (updatedFilters[category].includes(value)) {
      updatedFilters[category] = updatedFilters[category].filter(
        (item) => item !== value
      );
    } else {
      updatedFilters[category] = [...updatedFilters[category], value];
    }
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters = Object.fromEntries(
      Object.keys(filters).map((key) => [key, []])
    );
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const getActiveFilterCount = () =>
    Object.values(filters).reduce((total, arr) => total + arr.length, 0);

  const FilterGroup = ({ title, category, options }) => (
    <div className=" py-2 scrollbar-hide border-b-1 pb-2 mb-2 border-gray-200">
      <div
        onClick={() => toggleSection(category)}
        className="flex justify-between items-center cursor-pointer"
      >
        <div className="flex items-center gap-2 my-2">
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <p className="text-gray-700 text-md font-semibold">{title}</p>
        </div>
        {expandedSections[category] ? (
          <ChevronUp size={20} />
        ) : (
          <ChevronDown size={20} />
        )}
      </div>

      {expandedSections[category] && (
        <div
          className={`flex flex-col mt-2 gap-1 mb-3 ${
            category === "color" ? "max-h-64 overflow-y-scroll pr-2 scrollbar-hide" : ""
          }`}
        >
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer font-light text-xs md:text-sm text-gray-700 select-none"
            >
              <input
                type="checkbox"
                checked={filters[category].includes(option)}
                onChange={() => handleCheckboxChange(category, option)}
                className="hidden peer"
              />
              <div className="w-5 h-5 border-1 mb-3 border-gray-400 peer-checked:bg-yellow-500 peer-checked:border-yellow-600 flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-white hidden peer-checked:block"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              {category === "color" ? (
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-5 h-5 border-1 border-gray-200"
                    style={{ backgroundColor: clothingColors[option] }}
                  />
                  <span className="capitalize text-xs">{option}</span>
                </div>
              ) : (
                <span className="font-light text-md mb-3 text-gray-700">
                  {option.replaceAll("_", " ").toLowerCase()}
                </span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`w-screen md:w-full sticky top-0  md:pl-20 lg:pl-20 border-r border-gray-200  overflow-y-auto max-h-screen scrollbar-hide bg-white pr-10`}
    >
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold border-b-1 border-gray-300 w-full pb-2">
          {"Filters"}
        </h2>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-500 font-light"
          >
            Clear All ({getActiveFilterCount()})
          </button>
        )}
      </div>

      {Object.keys(filterOptions).map((key) => (
        <FilterGroup
          key={key}
          title={key
            .replaceAll(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
          category={key}
          options={filterOptions[key]}
        />
      ))}
    </div>
  );
};

export default FilterSection;
