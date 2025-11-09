"use client";

import { CheckCircle2, Home, FileText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ThankYouPage() {
  const router = useRouter();
  const params = useSearchParams();

  const orderId = params.get("orderId");
  const paymentMethod = params.get("method");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      {/* Hiệu ứng xuất hiện */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-3xl p-8 max-w-md w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="flex justify-center mb-4"
        >
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Yêu Cầu Đã Được Gửi Đến Nhà Cung Cấp!
        </h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã tin tưởng và giao dịch cùng chúng tôi.
        </p>

        {/* Thông tin đơn */}
        {/* <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-medium">Mã giao dịch:</span>{" "}
            <span className="text-blue-600">{orderId || "Đang xử lý..."}</span>
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Hình thức thanh toán:</span>{" "}
            <span className="capitalize">
              {paymentMethod === "bank"
                ? "Chuyển khoản ngân hàng"
                : paymentMethod === "cash"
                ? "Tiền mặt"
                : paymentMethod === "deposit"
                ? "Đặt cọc giữ xe"
                : "Không xác định"}
            </span>
          </p>
        </div> */}

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Về trang chủ</span>
          </button>

          <button
            onClick={() => router.push("/buyer-orders")}
            className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 rounded-xl font-semibold transition-all"
          >
            <FileText className="w-5 h-5" />
            <span>Xem đơn hàng</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
