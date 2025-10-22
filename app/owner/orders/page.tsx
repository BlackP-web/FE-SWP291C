"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Select,
  message,
  Modal,
  Descriptions,
  Upload,
} from "antd";
import {
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
} from "lucide-react";
import { UploadOutlined } from "@ant-design/icons";
import { OrderService } from "@/service/order.service";
import { UploadService } from "@/service/upload.service";
import { useAuth } from "@/hooks/useAuth";
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
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

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

  const handleUploadContract = async (file: any) => {
    try {
      const res = await UploadService.uploadSingleImage(file);
      const contractUrl = res.url || res.data?.url;

      if (!contractUrl) throw new Error("Không nhận được link hợp đồng!");

      if (selectedOrder?._id) {
        await OrderService.updateContract(selectedOrder._id, contractUrl);
        await OrderService.updateStatus(selectedOrder._id, "completed");
      }

      message.success("Tải và lưu hợp đồng thành công!");
      setShowContractModal(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
      message.error("Không thể tải hoặc lưu hợp đồng!");
    }

    return false; // tránh auto upload của antd
  };

  const filteredOrders = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders;

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
              {record.listing?.year || ""} •{" "}
              {record.listing?.price
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }).format(record.listing.price)
                : ""}
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
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: string) =>
        method === "bank" ? "Chuyển khoản" : "Tiền mặt",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap: Record<string, { label: string; color: string }> = {
          pending: { label: "Đang xử lý", color: "gold" },
          completed: { label: "Hoàn tất", color: "green" },
          cancelled: { label: "Đã hủy", color: "red" },
          approved: { label: "Duyệt đơn", color: "blue" },
        };

        const { label, color } = statusMap[status] || {
          label: "Không xác định",
          color: "default",
        };

        return (
          <Tag color={color} className="capitalize">
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Hợp đồng",
      key: "contract",
      render: (_: any, record: any) =>
        record.contractUrl ? (
          <a
            href={record.contractUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Xem hợp đồng
          </a>
        ) : (
          <span className="text-gray-400">Chưa có</span>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => {
        const status = record.status;
        return (
          <div className="flex gap-2">
            {status === "pending" && (
              <>
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
              </>
            )}

            {status === "approved" && (
              <Button
                icon={<FileText className="w-4 h-4" />}
                onClick={() => {
                  setSelectedOrder(record);
                  setShowContractModal(true);
                }}
              >
                Lên hợp đồng
              </Button>
            )}

            <Button
              size="small"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => {
                setSelectedOrder(record);
                setShowDetailModal(true);
              }}
            />
          </div>
        );
      },
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
            <div className="flex gap-3">
              <Select
                placeholder="Lọc theo trạng thái"
                allowClear
                style={{ width: 180 }}
                onChange={(value) => setFilterStatus(value || null)}
                options={[
                  { value: "pending", label: "Chờ duyệt" },
                  { value: "approved", label: "Đã duyệt" },
                  { value: "rejected", label: "Từ chối" },
                  { value: "sold", label: "Đã bán" },
                ]}
              />
              <Button
                icon={<RefreshCcw className="w-4 h-4" />}
                onClick={fetchOrders}
              >
                Làm mới
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 8 }}
          />
        </div>
      </div>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title="Chi tiết đơn hàng"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
      >
        {selectedOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Xe">
              {selectedOrder.listing?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Người mua">
              {selectedOrder.buyer?.name} ({selectedOrder.buyer?.email})
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedOrder.buyer?.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Giá">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(selectedOrder.price)}
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {selectedOrder.paymentMethod === "bank"
                ? "Chuyển khoản"
                : "Tiền mặt"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusColors[selectedOrder.status]}>
                {selectedOrder.status}
              </Tag>
            </Descriptions.Item>
            {selectedOrder.contractUrl && (
              <Descriptions.Item label="Hợp đồng">
                <a
                  href={selectedOrder.contractUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xem hợp đồng
                </a>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Modal lên hợp đồng */}
      <Modal
        title="Lên hợp đồng"
        open={showContractModal}
        onCancel={() => setShowContractModal(false)}
        footer={null}
      >
        <p className="mb-3 text-gray-600">
          Vui lòng tải lên file hợp đồng mua bán (PDF hoặc hình ảnh).
        </p>
        <Upload beforeUpload={handleUploadContract} maxCount={1}>
          <Button icon={<UploadOutlined className="w-4 h-4" />}>
            Chọn file
          </Button>
        </Upload>
      </Modal>
    </OwnerLayout>
  );
}
