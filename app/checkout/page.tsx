"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ListingService } from "@/service/listing.service";
import { OrderService } from "@/service/order.service";
import { useAuth } from "@/hooks/useAuth";
import { message } from "antd";
import {
  Car,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  ArrowLeft,
  Battery,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const { user, isAuthenticated } = useAuth();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [acceptedContract, setAcceptedContract] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    if (!listingId) return;
    const fetchListing = async () => {
      try {
        const res = await ListingService.getById(listingId);
        setListing(res.listing);
      } catch (err) {
        console.error("Fetch listing error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);

  const handleCreateOrder = async () => {
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để tiếp tục");
      router.push("/login");
      return;
    }

    if (!acceptedContract) {
      message.warning("Vui lòng đồng ý điều khoản hợp đồng trước khi tiếp tục");
      return;
    }

    try {
      setCreatingOrder(true);
      const payload = {
        buyer: user?._id,
        seller: listing.seller._id,
        listing: listing._id,
        price: listing.price,
      };
      await OrderService.create(payload);
      message.success("Tạo đơn hàng thành công!");
      router.push("/thankyou");
    } catch (error) {
      console.error("Order error:", error);
      message.error("Tạo đơn hàng thất bại. Vui lòng thử lại.");
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading)
    return <div className="text-center py-10 text-gray-500">Đang tải...</div>;
  if (!listing)
    return (
      <div className="text-center py-10 text-red-500">
        Không tìm thấy bài đăng.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại</span>
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Thông tin xe */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            {listing.type === "battery" ? (
              <Battery className="text-blue-600" />
            ) : (
              <Car className="text-blue-600" />
            )}
            {listing.type === "battery" ? "Thông tin PIN" : "Thông tin xe"}
          </h2>
          <div className="rounded-xl overflow-hidden shadow-md">
            <img
              src={listing.images?.[0]}
              alt={listing.title}
              className="object-cover w-full h-64"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">{listing.title}</h3>
            <p className="text-gray-600">
              Hãng: <span className="font-medium">{listing.brand?.name}</span>
            </p>
            <p className="text-xl text-green-600 mt-2 font-semibold">
              {formatPrice(listing.price)}
            </p>
          </div>
        </div>

        {/* Bên phải - hợp đồng + người bán */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="text-blue-600" /> Hợp đồng mua bán
          </h2>

          {listing.contract ? (
            <iframe
              src={listing.contract}
              className="w-full h-80 border rounded-xl mb-4"
            />
          ) : (
            <div className="p-4 bg-gray-100 rounded-xl text-center text-gray-500">
              <FileText className="inline-block w-6 h-6 mb-2" />
              <p>Không có hợp đồng đính kèm</p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="agree"
              checked={acceptedContract}
              onChange={(e) => setAcceptedContract(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <label
              htmlFor="agree"
              className="text-gray-700 cursor-pointer select-none"
            >
              Tôi đã đọc và đồng ý với các điều khoản trong hợp đồng
            </label>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-blue-600" /> Thông tin người bán
          </h2>
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <p className="font-medium text-gray-700">
              {listing.seller?.name || "Chưa có tên"}
            </p>
            <p className="text-gray-600 flex items-center gap-1">
              <Mail className="w-4 h-4" /> {listing.seller?.email}
            </p>
            <p className="text-gray-600 flex items-center gap-1">
              <Phone className="w-4 h-4" /> {listing.seller?.phone}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateOrder}
            disabled={!acceptedContract || creatingOrder}
            className={`w-full mt-4 py-3 rounded-xl font-medium text-white shadow-lg transition-all ${
              acceptedContract
                ? "bg-gradient-to-r from-green-600 to-green-700 hover:shadow-xl"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {creatingOrder ? "Đang tạo đơn hàng..." : "Tạo đơn hàng"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
