"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";

const SearchFilter = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    year: "",
    priceMin: "",
    priceMax: "",
    condition: "",
    batteryHealth: "",
  });

  const brands = [
    "Xe điện",
    "BMW",
    "Mercedes",
    "Audi",
    "Porsche",
    "Hyundai",
    "Kia",
    "VinFast",
  ];
  const conditions = ["excellent", "good", "fair", "poor"];
  const years = Array.from({ length: 10 }, (_, i) => 2024 - i);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      brand: "",
      model: "",
      year: "",
      priceMin: "",
      priceMax: "",
      condition: "",
      batteryHealth: "",
    });
  };

  const handleSearch = () => {
    console.log("Search with filters:", filters);
  };

  return (
    <div className="bg-white/98 backdrop-blur-xl border-b border-gray-200 sticky top-[64px] z-[90] shadow-md">
      <div className="container-tesla py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm xe điện, pin, phụ kiện..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
              />
            </div>
          </div>

          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-300"
          >
            <Filter className="w-5 h-5 text-gray-600" />
            <span>Bộ lọc</span>
          </motion.button>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="px-8 py-3 bg-gradient-to-r from-tesla-black to-tesla-dark-gray text-tesla-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Tìm kiếm
          </motion.button>
        </div>

        {/* Filter Panel */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isFilterOpen ? 1 : 0,
            height: isFilterOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-6 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-tesla-black">
                Bộ lọc nâng cao
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-tesla-black transition-colors duration-300"
              >
                Xóa tất cả
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hãng xe
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                >
                  <option value="">Tất cả hãng</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Năm sản xuất
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                >
                  <option value="">Tất cả năm</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tình trạng
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) =>
                    handleFilterChange("condition", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                >
                  <option value="">Tất cả tình trạng</option>
                  <option value="excellent">Xuất sắc</option>
                  <option value="good">Tốt</option>
                  <option value="fair">Khá</option>
                  <option value="poor">Kém</option>
                </select>
              </div>

              {/* Battery Health Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tình trạng pin
                </label>
                <select
                  value={filters.batteryHealth}
                  onChange={(e) =>
                    handleFilterChange("batteryHealth", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                >
                  <option value="">Tất cả</option>
                  <option value="90-100">90-100%</option>
                  <option value="80-89">80-89%</option>
                  <option value="70-79">70-79%</option>
                  <option value="60-69">60-69%</option>
                  <option value="0-59">Dưới 60%</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng giá (VNĐ)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Giá tối thiểu"
                    value={filters.priceMin}
                    onChange={(e) =>
                      handleFilterChange("priceMin", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Giá tối đa"
                    value={filters.priceMax}
                    onChange={(e) =>
                      handleFilterChange("priceMax", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchFilter;
