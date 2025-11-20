"use client";

import React, { useEffect, useState } from "react";
import { Plus, Users, Tag, Clock } from "lucide-react";
import AdminLayout from "../AdminLayout";
import { Button } from "antd";
import AddPackageModal from "./AddPackageModal";
import UsersModal from "./UsersModal";
import { PackageService } from "@/service/package.service";

export default function PackageAdminPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await PackageService.getAllPackages();
      const packagesData = res.data || [];
      const enriched = await Promise.all(
        packagesData.map(async (pkg: any) => {
          try {
            const countRes = await PackageService.getUserCountByPackage(
              pkg._id
            );
            return { ...pkg, userCount: countRes.totalUsers };
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
      <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Tag className="text-blue-600" style={{ fontSize: 24 }} />
            Quản lý gói dịch vụ
          </h1>
          <p style={{ color: "#64748b", marginTop: 4 }}>
            Quản lý các gói dịch vụ và người dùng đã mua
          </p>
        </div>

        {/* Add Package Button */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => {
              setEditingPackage(null);
              setShowAddModal(true);
            }}
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            size="large"
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              height: 44,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Thêm gói mới
          </Button>
        </div>

        {/* Package List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
            Đang tải dữ liệu...
          </div>
        ) : packages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              background: "white",
              borderRadius: 12,
              color: "#cbd5e1",
            }}
          >
            Chưa có gói nào. Hãy thêm gói mới!
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {packages.map((pkg, idx) => {
              const gradients = [
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              ];
              const gradient = gradients[idx % gradients.length];

              return (
                <div
                  key={pkg._id}
                  style={{
                    background: "white",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                    transition: "all 0.3s",
                    border: "1px solid #f1f5f9",
                  }}
                  className="hover:shadow-xl hover:-translate-y-1"
                >
                  <div
                    style={{
                      background: gradient,
                      padding: "24px 20px",
                      color: "white",
                    }}
                  >
                    <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
                      {pkg.name}
                    </h2>
                    <p
                      style={{
                        fontSize: 14,
                        margin: 0,
                        opacity: 0.95,
                        minHeight: 40,
                      }}
                    >
                      {pkg.description || "Không có mô tả"}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "20px",
                      background: "#f8fafc",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 40,
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      {Number(pkg.price || 0).toLocaleString("vi-VN")}
                      <span style={{ fontSize: 18, color: "#64748b" }}>
                        {" "}
                        {pkg.currency || "VND"}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: 20 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 0",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <Clock style={{ color: "#ca8a04" }} />
                      <div>
                        <div style={{ fontSize: 13, color: "#64748b" }}>
                          Thời hạn
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#1e293b",
                          }}
                        >
                          {pkg.durationDays} ngày
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 0",
                      }}
                    >
                      <Users style={{ color: "#1d4ed8" }} />
                      <div>
                        <div style={{ fontSize: 13, color: "#64748b" }}>
                          Người dùng
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#1e293b",
                          }}
                        >
                          {pkg.userCount || 0} người
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setSelectedPackage(pkg)}
                      size="large"
                      style={{
                        width: "100%",
                        marginTop: 16,
                        borderRadius: 8,
                        height: 44,
                        fontWeight: 600,
                        borderColor: "#667eea",
                        color: "#667eea",
                      }}
                    >
                      Xem người dùng
                    </Button>

                    <Button
                      onClick={() => {
                        setEditingPackage(pkg);
                        setShowAddModal(true);
                      }}
                      size="large"
                      style={{
                        width: "100%",
                        marginTop: 8,
                        borderRadius: 8,
                        height: 44,
                        fontWeight: 600,
                        borderColor: "#10b981",
                        color: "#10b981",
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showAddModal && (
          <AddPackageModal
            pkg={editingPackage}
            onClose={() => {
              setShowAddModal(false);
              setEditingPackage(null);
            }}
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
    </AdminLayout>
  );
}
