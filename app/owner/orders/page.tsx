"use client";

import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Select, message } from "antd";
import { OrderService } from "@/service/order.service";
import { useAuth } from "@/hooks/useAuth";
import { Car, CheckCircle, XCircle, Clock, RefreshCcw } from "lucide-react";
import OwnerLayout from "../OwnerLayout";

const statusColors: Record<string, string> = {
  pending: "orange",
  approved: "blue",
  sold: "green",
  rejected: "red",
  processing: "purple",
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await OrderService.getOrdersBySeller(user?._id);
      setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await OrderService.updateStatus(orderId, newStatus);
      message.success("Cập nhật trạng thái thành công!");
      fetchOrders();
    } catch (err) {
      message.error("Không thể cập nhật trạng thái!");
    }
  };

  const columns = [
    {
      title: "Xe",
      dataIndex: ["listing", "title"],
      key: "listing",
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <img
            src={record.listing?.images?.[0]}
            alt={record.listing?.title}
            className="w-16 h-12 object-cover rounded-md"
          />
          <div>
            <div className="font-medium text-gray-800">{text}</div>
            <div className="text-gray-500 text-sm">
              {record.listing?.brand?.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Người mua",
      dataIndex: ["buyer", "name"],
      key: "buyer",
      render: (text: string, record: any) => (
        <>
          <div className="font-medium">{text}</div>
          <div className="text-gray-500 text-sm">{record.buyer?.email}</div>
        </>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }).format(price),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status] || "default"} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            size="small"
            type="primary"
            icon={<CheckCircle className="w-4 h-4" />}
            onClick={() => handleStatusChange(record._id, "approved")}
          >
            Duyệt
          </Button>
          <Button
            size="small"
            danger
            icon={<XCircle className="w-4 h-4" />}
            onClick={() => handleStatusChange(record._id, "rejected")}
          >
            Từ chối
          </Button>
          <Button
            size="small"
            icon={<Car className="w-4 h-4" />}
            onClick={() => handleStatusChange(record._id, "sold")}
          >
            Đã bán
          </Button>
        </div>
      ),
    },
  ];

  return (
    <OwnerLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Clock className="text-blue-600" /> Quản lý đơn hàng
            </h1>
            <Button
              icon={<RefreshCcw className="w-4 h-4" />}
              onClick={fetchOrders}
            >
              Làm mới
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 8 }}
          />
        </div>
      </div>
    </OwnerLayout>
  );
}
