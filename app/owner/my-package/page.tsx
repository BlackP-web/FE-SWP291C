"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, Clock, Layers } from "lucide-react";
import { message, Spin } from "antd";
import OwnerLayout from "../OwnerLayout";
import { useAuth } from "@/hooks/useAuth";
import { PackageService } from "@/service/package.service";

interface Package {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  durationDays: number;
  maxListings: number;
}

interface UserPackage {
  _id: string;
  package: Package;
  status: "active" | "expired";
}

export default function UserPackagePage() {
  const { user } = useAuth();
  const [userPackage, setUserPackage] = useState<UserPackage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserPackage = async () => {
    setLoading(true);
    try {
      if (!user) return;
      const resUserPackages = await PackageService.getUserPackages(user._id);
      const activePackage = resUserPackages?.data?.find(
        (p: UserPackage) => p.status === "active"
      );
      setUserPackage(activePackage || null);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải dữ liệu gói của bạn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPackage();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!userPackage) {
    return (
      <OwnerLayout>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Bạn chưa có gói nào đang sử dụng
          </h2>
          <p className="text-gray-500">Vui lòng mua gói để sử dụng dịch vụ</p>
        </div>
      </OwnerLayout>
    );
  }

  const pkg = userPackage.package;

  return (
    <OwnerLayout>
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-100 to-gray-200 p-6">
        <div className="relative w-full max-w-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-10 text-white overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full"></div>

          {/* Icon + Title */}
          <div className="flex items-center gap-4 mb-6">
            <Layers className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-3xl font-bold">{pkg.name}</h1>
              <span className="text-sm opacity-90">Đang sử dụng</span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-6 opacity-90">
            {pkg.description || "Không có mô tả"}
          </p>

          {/* Info */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              <span className="text-xl font-semibold">
                {Number(pkg.price).toLocaleString("vi-VN")}{" "}
                {pkg.currency || "VND"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{pkg.durationDays} ngày</span>
            </div>
          </div>

          <div className="text-center opacity-90 mb-6">
            {pkg.maxListings !== null
              ? `Giới hạn tối đa ${pkg.maxListings} bài đăng`
              : "Không giới hạn bài đăng"}
          </div>

          <button
            disabled
            className="w-full py-3 bg-white/20 rounded-xl font-semibold text-white cursor-not-allowed"
          >
            Đang sử dụng
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
