"use client";

import { motion } from "framer-motion";
import { Heart, Eye, Gauge, Battery, Zap, Shield, Award } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { FavoriteService } from "@/service/favorite.service";
import { CartService } from "@/service/cart.service";
import { message } from "antd";
import { formatVND } from '@/lib/formatCurrency'

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
  const formatPrice = (price: number) => formatVND(price)

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
    if (!user?._id) {
      message.info("Vui lòng đăng nhập để thích sản phẩm!");
      router.push("/login");
      return;
    }

    try {
      await FavoriteService.toggleFavorite({ userId: user._id, listingId: id });
      setIsLiked((prev) => !prev);
      message.success("Cập nhật yêu thích thành công");
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra khi cập nhật yêu thích");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden group border border-gray-100"
    >
      {/* Image Container */}
  <div className="relative aspect-[3/2] bg-gray-50 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay gradient with shine effect */}
  <div className="absolute inset-0 bg-black/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

        {/* Verified Badge - Top Left với gradient sắc màu */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="absolute top-4 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow backdrop-blur-sm flex items-center gap-2 bg-gray-800 text-white"
        >
          {isVerified === "approved" && <Shield className="w-3.5 h-3.5" />}
          <span className="font-semibold tracking-wide text-xs">
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
          className="absolute bottom-3 left-3 px-3 py-1 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm flex items-center gap-2 bg-gray-100 text-gray-900"
        >
          <Award className="w-3.5 h-3.5" />
          <span className="font-medium text-xs">{getConditionText(condition)}</span>
        </motion.div>

        {/* Action Buttons - Top Right với màu gradient */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full shadow transition-all duration-300 backdrop-blur-sm ${
              isLiked
                ? "bg-gray-800 text-white scale-105"
                : "bg-white/95 hover:bg-white text-gray-700"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gray-800 text-white shadow transition-all duration-300 backdrop-blur-sm hover:opacity-90"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Quick Stats Overlay - Bottom Right */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-2"
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="text-xs">{year}</span>
        </motion.div>
      </div>

      {/* Content */}
  <div className="p-4 flex flex-col justify-between bg-white">
        <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 transition-all">
            {title}
          </h3>
          <p className="text-xs text-gray-600 mb-3 font-medium">
            {brand} {model} • {year}
          </p>

          {/* Specs with icons and better layout với gradient backgrounds */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              className="flex items-center text-xs text-gray-700 bg-gray-100 p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="bg-gray-700 p-1.5 rounded-md mr-2 shadow">
                <Gauge className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">
                  Quãng đường
                </div>
                <div className="font-semibold text-gray-800 text-sm">
                  {formatMileage(mileage)} km
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, x: 5 }}
              className="flex items-center text-xs text-gray-700 bg-gray-100 p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="bg-gray-700 p-1.5 rounded-md mr-2 shadow">
                <Battery className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">
                  Dung lượng pin
                </div>
                <div className="font-semibold text-gray-800 text-sm">{batteryHealth}%</div>
              </div>
            </motion.div>
          </div>

          {/* Price Section with vibrant gradient background */}
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm transition-all relative overflow-hidden border border-gray-100"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <div className="relative z-10">
              <div className="text-xs text-gray-500 mb-1 font-medium flex items-center gap-2">
                <Zap className="w-3 h-3 text-gray-600" />
                Giá xe
              </div>
              <div className="text-xl font-bold mb-1 text-gray-900">
                {formatPrice(price)}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                <Zap className="w-3 h-3 text-gray-500" />
                Có thể thương lượng
              </div>
            </div>
          </motion.div>
        </div>
        {/* Action Buttons compact and neutral */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gray-900 text-white py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2"
            onClick={() => router.push(`/vehicles/${id}`)}
          >
            <Eye className="w-4 h-4" />
            <span>Xem chi tiết</span>
          </motion.button>
          {isVerified !== "sold" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              onClick={handleAddToCart}
              className={`flex-1 border border-gray-200 bg-white text-gray-900 py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{loading ? "Đang thêm..." : "Thêm giỏ hàng"}</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
