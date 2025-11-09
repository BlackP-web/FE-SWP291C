"use client";
import React from "react";
import { Shield, MessageCircle, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { message } from "antd";
import { useRouter } from "next/navigation";

type Seller = {
  id?: string;
  name?: string;
  avatar?: string;
  phone?: string;
  rating?: number;
};

export default function SellerCard({ seller }: { seller: Seller }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const maskedPhone = (p?: string) => {
    if (!p) return "—";
    return p.replace(/(\d{3})\d{4}(\d{2,})/, "$1****$2");
  };

  const revealPhone = () => {
    if (!isAuthenticated) {
      message.info("Vui lòng đăng nhập để xem số điện thoại");
      router.push("/login");
      return;
    }
    message.success(`SĐT: ${seller.phone}`);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3">
        {seller?.avatar ? (
          <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full object-cover shadow" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold">
            {seller?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900">{seller?.name || "Người bán ẩn danh"}</div>
          <div className="text-xs text-gray-500">Người bán uy tín</div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => message.info("Tính năng chat tạm chưa triển khai")}
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-gray-700" /> Chat
          </button>
          <button
            onClick={revealPhone}
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-gray-700" /> {maskedPhone(seller?.phone)}
          </button>
        </div>
      </div>
    </div>
  );
}
