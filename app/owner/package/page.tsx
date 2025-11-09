"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, Clock, Tag } from "lucide-react";
import { Card, Button, message, Spin, Badge } from "antd";
import OwnerLayout from "../OwnerLayout";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { PackageService } from "@/service/package.service";
import { PayosService } from "@/service/payos.service";
import { useSearchParams } from "next/navigation"; // dùng Next.js App Router

interface Package {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  durationDays: number;
  active?: boolean;
  maxListings: number;
}

interface UserPackage {
  _id: string;
  package: any;
  status: "active" | "expired";
}

export default function UserPackagePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<Package[]>([]);
  const [userPackages, setUserPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);

  // fetch packages + user packages
  const fetchData = async () => {
    setLoading(true);
    try {
      if (user) {
        const resPackages = await PackageService.getAllPackages();
        setPackages(resPackages?.data || []);

        const resUserPackages = await PackageService.getUserPackages(user._id);
        setUserPackages(resUserPackages?.data || []);
      }
    } catch (err) {
      message.error("Không thể tải dữ liệu gói");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // handle mua gói (PayOS)
  const handleBuy = async (pkg: Package) => {
    setAssigning(pkg._id);
    try {
      if (!user) return;

      const res = await PayosService.createPayment({
        userId: user._id,
        packageId: pkg._id,
        amount: pkg.price,
        description: `Mua gói ${pkg.name}`,
      });

      const checkoutUrl = res.data.checkoutUrl;
      if (checkoutUrl) {
        // Redirect user qua PayOS
        window.location.href = checkoutUrl;
      } else {
        message.error("Không tạo được link thanh toán");
      }
    } catch (err) {
      console.error(err);
      message.error("Mua gói thất bại");
    } finally {
      setAssigning(null);
    }
  };

  // handle auto assign khi quay lại từ PayOS
  useEffect(() => {
    const status = searchParams.get("status");
    const packageId = searchParams.get("packageId");

    if (status === "PAID" && packageId && user) {
      const assignPaidPackage = async () => {
        setAssigning(packageId);
        try {
          await PackageService.assignPackageToUser({
            userId: user._id,
            packageId,
          });
          message.success("Thanh toán thành công! Gói đã được kích hoạt.");
          fetchData();
        } catch (err) {
          console.error(err);
          message.error("Kích hoạt gói thất bại");
        } finally {
          setAssigning(null);
        }
      };
      assignPaidPackage();
    }
  }, [searchParams, user]);

  const userPackageStatus = (pkgId: string) => {
    const up = userPackages.find((p) => p?.package?._id === pkgId);
    return up?.status || null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <OwnerLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Các gói dịch vụ
        </h1>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const status = userPackageStatus(pkg._id);
            return (
              <Badge.Ribbon
                key={pkg._id}
                text={status === "active" ? "Đang sử dụng" : ""}
                color="green"
              >
                <Card
                  title={
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">{pkg.name}</span>
                      <Tag color="blue">{pkg.durationDays} ngày</Tag>
                    </div>
                  }
                  bordered={false}
                  className={`rounded-3xl shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-2xl ${
                    status === "active" ? "opacity-90" : "opacity-100"
                  }`}
                >
                  <p className="text-gray-600 mb-4">
                    {pkg.description || "Không có mô tả"}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                      <DollarSign className="w-5 h-5" />
                      {Number(pkg.price).toLocaleString("vi-VN")}{" "}
                      {pkg.currency || "VND"}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      {pkg.maxListings !== null
                        ? `${pkg.maxListings} bài đăng tối đa`
                        : "Không giới hạn bài đăng"}
                    </p>
                  </div>

                  <Button
                    type={status === "active" ? "default" : "primary"}
                    block
                    size="large"
                    disabled={status === "active"}
                    loading={assigning === pkg._id}
                    className={`rounded-xl font-semibold ${
                      status !== "active"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                        : ""
                    }`}
                    onClick={() => handleBuy(pkg)}
                  >
                    {status === "active" ? "Đang sử dụng" : "Mua gói"}
                  </Button>
                </Card>
              </Badge.Ribbon>
            );
          })}
        </div>
      </div>
    </OwnerLayout>
  );
}
