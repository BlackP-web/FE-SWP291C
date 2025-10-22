"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ListingService } from "@/service/listing.service";
import { useAuth } from "@/hooks/useAuth";
import { m, motion } from "framer-motion";
import {
  CreditCard,
  Wallet,
  User,
  Phone,
  Mail,
  Car,
  DollarSign,
  Coins,
  ArrowLeft,
} from "lucide-react";
import { OrderService } from "@/service/order.service";
import { message } from "antd";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");

  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<
    "bank" | "cash" | "deposit" | null
  >(null);

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

  const handlePayment = async () => {
    if (!isAuthenticated) {
      alert("⚠️ Vui lòng đăng nhập để mua xe.");
      router.push("/login");
      return;
    }

    if (!paymentMethod) {
      alert("Vui lòng chọn hình thức thanh toán!");
      return;
    }

    const payload = {
      buyer: user?._id,
      seller: listing.seller._id,
      listingId: listing._id,
      price: listing.price,
      paymentMethod,
    };
    try {
      await OrderService.create(payload);
      message.success("Thanh toán thành công!");
      router.push("/thankyou");
    } catch (error) {
      message.error("Thanh toán thất bại. Vui lòng thử lại.");
      console.error("Payment error:", error);
    }
  };

  if (loading)
    return <div className="text-center py-10 text-gray-500">Đang tải...</div>;
  if (!listing)
    return (
      <div className="text-center py-10 text-red-500">Không tìm thấy xe.</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại</span>
      </button>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Car className="text-blue-600" /> Thông tin xe
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
            <p className="text-gray-600">Năm: {listing.year}</p>
            <p className="text-gray-600">
              Quãng đường: {listing.kmDriven.toLocaleString()} km
            </p>
            <p className="text-xl text-green-600 mt-2 font-semibold">
              {formatPrice(listing.price)}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="text-blue-600" /> Người bán
          </h2>
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <p className="font-medium text-gray-700">
              Tên: {listing.seller?.name}
            </p>
            <p className="text-gray-600 flex items-center gap-1">
              <Mail className="w-4 h-4" /> {listing.seller?.email}
            </p>
            <p className="text-gray-600 flex items-center gap-1">
              <Phone className="w-4 h-4" /> {listing.seller?.phone}
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="text-green-600" /> Hình thức thanh toán
          </h2>
          <div className="space-y-3">
            {/* Chuyển khoản ngân hàng */}
            <button
              onClick={() => setPaymentMethod("bank")}
              className={`w-full flex items-center gap-3 p-4 border rounded-xl transition-all text-gray-800 font-medium ${
                paymentMethod === "bank"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <CreditCard className="text-blue-600 w-5 h-5" />
              <span className="flex-1 text-left">Chuyển khoản ngân hàng</span>
              {paymentMethod === "bank" && (
                <span className="text-blue-600 font-semibold text-sm">
                  Đã chọn
                </span>
              )}
            </button>

            {/* Thanh toán tiền mặt */}
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`w-full flex items-center gap-3 p-4 border rounded-xl transition-all text-gray-800 font-medium ${
                paymentMethod === "cash"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-green-300 hover:bg-gray-50"
              }`}
            >
              <Wallet className="text-green-600 w-5 h-5" />
              <span className="flex-1 text-left">Thanh toán tiền mặt</span>
              {paymentMethod === "cash" && (
                <span className="text-green-600 font-semibold text-sm">
                  Đã chọn
                </span>
              )}
            </button>

            {/* Đặt cọc giữ xe */}
            <button
              onClick={() => setPaymentMethod("deposit")}
              className={`w-full flex items-center gap-3 p-4 border rounded-xl transition-all text-gray-800 font-medium ${
                paymentMethod === "deposit"
                  ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                  : "border-gray-300 hover:border-yellow-300 hover:bg-gray-50"
              }`}
            >
              <Coins className="text-yellow-600 w-5 h-5" />
              <span className="flex-1 text-left">Đặt cọc giữ xe</span>
              {paymentMethod === "deposit" && (
                <span className="text-yellow-600 font-semibold text-sm">
                  Đã chọn
                </span>
              )}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Xác nhận thanh toán
          </motion.button>
        </div>
      </div>
    </div>
  );
}
