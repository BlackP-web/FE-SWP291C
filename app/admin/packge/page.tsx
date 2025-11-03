"use client";

import React, { useEffect, useState } from "react";
import { Plus, Users, Tag, Clock, DollarSign } from "lucide-react";
import AdminLayout from "../AdminLayout";
import { Button } from "antd";
import AddPackageModal from "./AddPackageModal";
import UsersModal from "./UsersModal";
import { PackageService } from "@/service/package.service";

export default function PackageAdminPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await PackageService.getAllPackages();
      const packagesData = res.data || []; // lấy mảng data
      const enriched = await Promise.all(
        packagesData.map(async (pkg: any) => {
          try {
            const countRes = await PackageService.getUserCountByPackage(
              pkg._id
            );
            return { ...pkg, userCount: countRes.count };
          } catch {
            return { ...pkg, userCount: 0 };
          }
        })
      );
      setPackages(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Tag className="text-blue-600" /> Quản lý gói dịch vụ
            </h1>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm gói mới
            </Button>
          </div>

          {loading ? (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          ) : packages.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có gói nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {pkg.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {pkg.description || "Không có mô tả"}
                  </p>

                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      {Number(pkg.price || 0).toLocaleString("vi-VN")}{" "}
                      {pkg.currency || "VND"}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />{" "}
                      {pkg.durationDays} ngày
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />{" "}
                      {pkg.userCount || 0} người đã mua
                    </p>
                  </div>

                  <div className="flex justify-end mt-5">
                    <Button
                      variant="outline"
                      className="text-blue-600 border-blue-400 hover:bg-blue-50"
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      Xem người dùng
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAddModal && (
            <AddPackageModal
              onClose={() => setShowAddModal(false)}
              onSuccess={fetchPackages}
            />
          )}

          {selectedPackage && (
            <UsersModal
              pkg={selectedPackage}
              onClose={() => setSelectedPackage(null)}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
