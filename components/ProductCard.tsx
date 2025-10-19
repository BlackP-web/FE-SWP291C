"use client";

import { motion } from "framer-motion";
import { Heart, Eye, Calendar, Gauge, Battery } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
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
  isVerified?: boolean;
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
  type,
  isVerified = false,
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("vi-VN").format(mileage);
  };

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
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="bg-tesla-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          // fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              isLiked
                ? "bg-red-500 text-white shadow-lg"
                : "bg-white/20 text-tesla-black hover:bg-white/30"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </button>
          <button className="p-2 rounded-full bg-white/20 text-tesla-black backdrop-blur-md hover:bg-white/30 transition-all duration-300 shadow-lg">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Verified Badge */}
        {isVerified && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
          >
            ✓ Đã kiểm định
          </motion.div>
        )}

        {!isVerified && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
          >
            Chưa kiểm định
          </motion.div>
        )}

        {/* Condition Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium shadow-lg ${getConditionColor(
            condition
          )}`}
        >
          {getConditionText(condition)}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-medium text-tesla-black mb-2 group-hover:text-tesla-dark-gray transition-colors duration-300">
          {title}
        </h3>

        {/* Brand & Model */}
        <p className="text-tesla-dark-gray mb-4">
          {brand} {model} • {year}
        </p>

        {/* Specs */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-gray-700">
            <Gauge className="w-4 h-4 mr-2" />
            <span>{formatMileage(mileage)} km</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Battery className="w-4 h-4 mr-2" />
            <span>Pin: {batteryHealth}%</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="text-2xl font-light text-tesla-black mb-1">
            {formatPrice(price)}
          </div>
          <div className="text-sm text-gray-600">Giá có thể thương lượng</div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 btn-tesla-small"
            onClick={() => router.push(`/vehicles/${id}`)}
          >
            Xem chi tiết
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 btn-tesla-secondary"
          >
            Liên hệ
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
