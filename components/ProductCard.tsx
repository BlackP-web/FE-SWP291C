"use client";

import { motion } from "framer-motion";
import { Heart, Eye, Gauge, Battery, Zap, Shield, Award } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { FavoriteService } from "@/service/favorite.service";
import { CartService } from "@/service/cart.service";
import { message } from "antd";

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
  initialLiked?: boolean;
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
  initialLiked = false,
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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

  const handleAddToCart = async () => {
    if (!user?._id) {
      message.info("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
      return;
    }

    try {
      setLoading(true);
      const res = await CartService.addToCart({
        userId: user?._id,
        listingId: id,
      });
      message.success(res.message || "Đã thêm vào giỏ hàng!");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Thêm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thích sản phẩm!");
      return;
    }

    try {
      await FavoriteService.toggleFavorite({ userId: user._id, listingId: id });
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi thích sản phẩm.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay gradient with shine effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

        {/* Verified Badge - Top Left với gradient sắc màu */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`absolute top-3 left-3 px-4 py-2 text-xs font-bold rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 ${
            isVerified === "sold"
              ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
              : isVerified === "approved"
              ? "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white"
              : isVerified === "active"
              ? "bg-gradient-to-r from-orange-400 to-red-500 text-white"
              : "bg-gradient-to-r from-gray-500 to-gray-700 text-white"
          }`}
        >
          {isVerified === "approved" && <Shield className="w-4 h-4" />}
          <span className="font-extrabold tracking-wide">
            {isVerified === "sold"
              ? "ĐÃ BÁN"
              : isVerified === "approved"
              ? "ĐÃ KIỂM ĐỊNH"
              : isVerified === "active"
              ? "CHƯA KIỂM ĐỊNH"
              : "KHÔNG XÁC ĐỊNH"}
          </span>
        </motion.div>

        {/* Condition Badge - Bottom Left với màu sắc rực rỡ */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`absolute bottom-3 left-3 px-4 py-2 text-sm font-bold rounded-full shadow-xl backdrop-blur-md flex items-center gap-2 ${
            condition === "excellent"
              ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white"
              : condition === "good"
              ? "bg-gradient-to-r from-blue-400 to-cyan-600 text-white"
              : condition === "fair"
              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
              : "bg-gradient-to-r from-red-400 to-pink-600 text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          <span className="font-extrabold">{getConditionText(condition)}</span>
        </motion.div>

        {/* Action Buttons - Top Right với màu gradient */}
        <div className="absolute top-3 right-3 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className={`p-3 rounded-full shadow-2xl transition-all duration-300 backdrop-blur-md ${
              isLiked 
                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white scale-110" 
                : "bg-white/95 hover:bg-white text-red-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl transition-all duration-300 backdrop-blur-md hover:from-blue-600 hover:to-purple-700"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Quick Stats Overlay - Bottom Right */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          <span>{year}</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-between bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <div>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 mb-2 line-clamp-1 group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 font-semibold">
            {brand} {model} • {year}
          </p>

          {/* Specs with icons and better layout với gradient backgrounds */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              className="flex items-center text-sm text-gray-700 bg-gradient-to-br from-blue-50 to-cyan-100 p-3 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-lg mr-2 shadow-lg">
                <Gauge className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-blue-600 font-semibold">Quãng đường</div>
                <div className="font-bold text-blue-900">{formatMileage(mileage)} km</div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              className="flex items-center text-sm text-gray-700 bg-gradient-to-br from-green-50 to-emerald-100 p-3 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-2 rounded-lg mr-2 shadow-lg">
                <Battery className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-green-600 font-semibold">Dung lượng pin</div>
                <div className="font-bold text-green-900">{batteryHealth}%</div>
              </div>
            </motion.div>
          </div>

          {/* Price Section with vibrant gradient background */}
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="mb-5 p-5 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="text-xs text-blue-100 mb-1 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Giá xe
              </div>
              <div className="text-3xl font-extrabold mb-1 drop-shadow-lg">
                {formatPrice(price)}
              </div>
              <div className="text-xs text-green-200 flex items-center gap-1 font-semibold">
                <Zap className="w-3 h-3" />
                Có thể thương lượng
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons with vibrant gradients */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group/btn flex items-center justify-center gap-2"
            onClick={() => router.push(`/vehicles/${id}`)}
          >
            <Eye className="w-5 h-5 relative z-10 group-hover/btn:scale-110 transition-transform" />
            <span className="relative z-10">Xem chi tiết</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          </motion.button>
          {isVerified !== "sold" && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              onClick={handleAddToCart}
              className={`flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group/cart flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Zap className="w-5 h-5 relative z-10 group-hover/cart:rotate-12 transition-transform" />
              <span className="relative z-10">{loading ? "Đang thêm..." : "Thêm giỏ hàng"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/cart:translate-x-full transition-transform duration-700" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
