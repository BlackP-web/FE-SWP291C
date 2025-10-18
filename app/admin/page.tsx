"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users,
  Package,
  Shield,
  TrendingUp,
  Eye,
  Heart,
  CheckCircle,
  Star,
} from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function DashboardAdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    activeProducts: 0,
    verifiedProducts: 0,
    featuredProducts: 0,
  });

  const tabs = [
    { id: "dashboard", label: "Tổng quan", icon: TrendingUp },
    { id: "users", label: "Người dùng", icon: Users },
    { id: "products", label: "Sản phẩm", icon: Package },
    { id: "settings", label: "Cài đặt", icon: Shield },
  ];

  const sampleUsers = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "user@example.com",
      phone: "0987654321",
      role: "user",
      isVerified: true,
      isActive: true,
      createdAt: "2024-01-15",
      lastLogin: "2024-01-20",
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "user2@example.com",
      phone: "0123456789",
      role: "user",
      isVerified: false,
      isActive: true,
      createdAt: "2024-01-10",
      lastLogin: "2024-01-18",
    },
  ];

  const sampleProducts = [
    {
      id: "1",
      title: "Tesla Model S Plaid 2022",
      brand: "Tesla",
      model: "Model S",
      year: 2022,
      price: 1200000000,
      status: "active",
      isVerified: true,
      isFeatured: true,
      seller: { name: "Nguyễn Văn A" },
      createdAt: "2024-01-15",
      viewCount: 150,
      likeCount: 25,
    },
    {
      id: "2",
      title: "Tesla Model 3 Performance 2021",
      brand: "Tesla",
      model: "Model 3",
      year: 2021,
      price: 800000000,
      status: "pending",
      isVerified: false,
      isFeatured: false,
      seller: { name: "Trần Thị B" },
      createdAt: "2024-01-10",
      viewCount: 89,
      likeCount: 12,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setStats({
      totalUsers: 1250,
      totalProducts: 89,
      activeProducts: 76,
      verifiedProducts: 45,
      featuredProducts: 12,
    });
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <AdminLayout>
      <div>Dashboard</div>
    </AdminLayout>
  );
}
