"use client";

import { motion } from "framer-motion";
import { Heart, Eye, Gauge, Battery } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  image: string;
  batteryHealth: number;
  condition: "excellent" | "good" | "fair" | "poor";
  type: "vehicle" | "battery";
  isVerified?: string;
}

const ProductCard = ({
  id,
  title,
  brand,
  model,
  year,
  mileage,
  price,
  image,
  batteryHealth,
  condition,
  isVerified,
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat("vi-VN").format(mileage);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "Xuất sắc";
      case "good":
        return "Tốt";
      case "fair":
        return "Khá";
      case "poor":
        return "Kém";
      default:
        return "Không xác định";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Verified Badge */}
        <div
          className={`absolute top-8 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md ${
            isVerified === "sold"
              ? "bg-red-700 text-white"
              : isVerified === "approved"
              ? "bg-green-500 text-white"
              : isVerified === "active"
              ? "bg-orange-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {isVerified === "sold"
            ? "Đã bán"
            : isVerified === "approved"
            ? "✓ Đã kiểm định"
            : isVerified === "active"
            ? "Chưa kiểm định"
            : "Không xác định"}
        </div>

        {/* Condition Badge */}
        <div
          className={`absolute bottom-3 left-3 px-3 py-1 text-xs font-medium rounded-full ${getConditionColor(
            condition
          )}`}
        >
          {getConditionText(condition)}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-8 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full shadow-lg transition-all duration-300 ${
              isLiked ? "bg-red-500 text-white" : "bg-white/90 hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </button>
          <button className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg transition-all duration-300">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {brand} {model} • {year}
          </p>

          <div className="space-y-2 mb-5">
            <div className="flex items-center text-sm text-gray-700">
              <Gauge className="w-4 h-4 mr-2 text-gray-500" />
              <span>{formatMileage(mileage)} km</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Battery className="w-4 h-4 mr-2 text-gray-500" />
              <span>Pin: {batteryHealth}%</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(price)}
            </div>
            <div className="text-xs text-gray-500">Giá có thể thương lượng</div>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 bg-tesla-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-all"
            onClick={() => router.push(`/vehicles/${id}`)}
          >
            Xem chi tiết
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
          >
            Liên hệ
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
