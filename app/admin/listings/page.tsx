"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Select,
  Input,
  Modal,
  Descriptions,
  Image,
  Popconfirm,
  message,
} from "antd";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import AdminLayout from "../AdminLayout";
import { ListingService } from "@/service/listing.service";
import { api } from "@/lib/api";

const { Option } = Select;
const { Search } = Input;

interface Listing {
  _id: string;
  seller?: { _id: string; name?: string; email?: string } | string;
  type: "car" | "battery";
  title: string;
  brand?: { _id: string; name?: string } | string;
  year?: number;
  batteryCapacity?: number;
  kmDriven?: number;
  price?: number;
  aiSuggestedPrice?: number;
  images?: string[];
  status: "active" | "sold" | "approved" | "pending" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined
  );
  const [searchText, setSearchText] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState<Listing | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await ListingService.getAllListings();
      // Expect data is array; if API returns { listings } adapt accordingly
      const arr = Array.isArray(data) ? data : data?.listings ?? [];
      setListings(arr);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách bài đăng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (filterStatus && l.status !== filterStatus) return false;
      if (searchText) {
        return l.title?.toLowerCase().includes(searchText.toLowerCase());
      }
      return true;
    });
  }, [listings, filterStatus, searchText]);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const data = await ListingService.getById(id);
      const detail = data?.listing ?? data;
      setCurrentListing(detail);
      setDetailModalOpen(true);
    } catch (err) {
      console.error(err);
      message.error("Không thể lấy thông tin chi tiết");
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      if (status === "approved") {
        await ListingService.approve(id);
      } else if (status === "rejected") {
        await ListingService.reject(id);
      } else {
        throw new Error("Trạng thái không hợp lệ");
      }
      message.success(
        status === "approved"
          ? "Duyệt bài thành công"
          : status === "rejected"
          ? "Từ chối bài thành công"
          : "Cập nhật trạng thái thành công"
      );
      loadListings();
      if (detailModalOpen && currentListing?._id === id) {
        openDetail(id);
      }
    } catch (err) {
      console.error(err);
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  // Helpers to display Vietnamese labels
  const statusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "active":
        return "Đăng bán";
      case "sold":
        return "Đã bán";
      case "rejected":
        return "Từ chối";
      default:
        return status;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "approved":
        return "blue";
      case "active":
        return "green";
      case "sold":
        return "red";
      case "rejected":
        return "default";
      default:
        return "default";
    }
  };

  const typeLabel = (type: string) =>
    type === "car" ? "Xe điện" : "Pin xe điện";

  // Table columns
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      width: 110,
      render: (images: string[]) =>
        images && images.length ? (
          <img
            src={images[0]}
            alt="thumb"
            className="w-24 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-24 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (t: string) => <div className="font-medium">{t}</div>,
    },
    {
      title: "Người bán",
      dataIndex: "seller",
      key: "seller",
      render: (seller: any) =>
        seller ? (
          typeof seller === "string" ? (
            seller
          ) : (
            <div>
              <div className="font-medium">{seller.name || seller.email}</div>
              {seller.email && (
                <div className="text-xs text-gray-500">{seller.email}</div>
              )}
            </div>
          )
        ) : (
          <span className="text-gray-500">-</span>
        ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (t: string) => typeLabel(t),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (p: number) =>
        p != null ? `${Number(p).toLocaleString()}₫` : "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s: string) => <Tag color={statusColor(s)}>{statusLabel(s)}</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 260,
      render: (_: any, record: Listing) => {
        const canApprove =
          record.status === "pending" ||
          record.status === "rejected" ||
          record.status === "active";
        const canReject =
          record.status === "pending" || record.status === "approved";
        const cannotChange = record.status === "sold";
        return (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => openDetail(record._id)}
            >
              Xem
            </Button>

            {canApprove && (
              <Popconfirm
                title="Duyệt bài này?"
                onConfirm={() => updateStatus(record._id, "approved")}
                okText="Duyệt"
                cancelText="Hủy"
              >
                <Button type="primary" icon={<CheckOutlined />}>
                  Duyệt
                </Button>
              </Popconfirm>
            )}

            {!cannotChange && canReject && (
              <Popconfirm
                title="Từ chối bài này?"
                onConfirm={() => updateStatus(record._id, "rejected")}
                okText="Từ chối"
                cancelText="Hủy"
              >
                <Button danger icon={<CloseOutlined />}>
                  Từ chối
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-2xl font-semibold">Quản lý bài đăng</h2>

          <div className="flex gap-3 items-center">
            <Select
              allowClear
              placeholder="Lọc theo trạng thái"
              style={{ width: 200 }}
              value={filterStatus}
              onChange={(v) => setFilterStatus(v)}
            >
              <Option value="pending">Chờ duyệt</Option>
              <Option value="approved">Đã duyệt</Option>
              <Option value="active">Đăng bán</Option>
              <Option value="sold">Đã bán</Option>
              <Option value="rejected">Từ chối</Option>
            </Select>

            <Search
              placeholder="Tìm theo tiêu đề"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
            />
            <Button onClick={loadListings}>Làm mới</Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey={(r) => r._id}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1100 }}
        />

        {/* Detail Modal */}
        <Modal
          open={detailModalOpen}
          title={currentListing?.title || "Chi tiết bài đăng"}
          onCancel={() => setDetailModalOpen(false)}
          footer={null}
          width={900}
        >
          {detailLoading || !currentListing ? (
            <div className="py-10 text-center">Loading...</div>
          ) : (
            <>
              <div className="mb-4">
                {currentListing.images && currentListing.images.length ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {currentListing.images.map((img, idx) => (
                      <Image
                        key={idx}
                        src={img}
                        alt={`img-${idx}`}
                        style={{ maxHeight: 160, objectFit: "cover" }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    Không có hình ảnh
                  </div>
                )}
              </div>

              <Descriptions column={1} bordered>
                <Descriptions.Item label="Tiêu đề">
                  {currentListing.title}
                </Descriptions.Item>
                <Descriptions.Item label="Người bán">
                  {typeof currentListing.seller === "string"
                    ? currentListing.seller
                    : currentListing.seller?.name ||
                      currentListing.seller?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Loại">
                  {typeLabel(currentListing.type)}
                </Descriptions.Item>
                <Descriptions.Item label="Hãng">
                  {typeof currentListing.brand === "string"
                    ? currentListing.brand
                    : currentListing.brand?.name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Năm">
                  {currentListing.year ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Dung lượng pin (kWh)">
                  {currentListing.batteryCapacity ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Số km đã đi">
                  {currentListing.kmDriven ?? "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Giá">
                  {currentListing.price != null
                    ? `${Number(currentListing.price).toLocaleString()}₫`
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Giá AI gợi ý">
                  {currentListing.aiSuggestedPrice != null
                    ? `${Number(
                        currentListing.aiSuggestedPrice
                      ).toLocaleString()}₫`
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={statusColor(currentListing.status)}>
                    {statusLabel(currentListing.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {currentListing.createdAt
                    ? new Date(currentListing.createdAt).toLocaleString()
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  {/* Nếu bạn có trường mô tả, show ở đây */}
                  {
                    // @ts-ignore
                    currentListing.description || "-"
                  }
                </Descriptions.Item>
              </Descriptions>

              <div className="mt-4 flex gap-2 justify-end">
                {(currentListing.status === "pending" ||
                  currentListing.status === "rejected") && (
                  <Popconfirm
                    title="Bạn chắc chắn muốn duyệt bài này?"
                    onConfirm={() =>
                      updateStatus(currentListing._id, "approved")
                    }
                    okText="Duyệt"
                    cancelText="Hủy"
                  >
                    <Button type="primary" icon={<CheckOutlined />}>
                      Duyệt
                    </Button>
                  </Popconfirm>
                )}

                {currentListing.status !== "sold" &&
                  currentListing.status !== "rejected" && (
                    <Popconfirm
                      title="Bạn chắc chắn muốn từ chối bài này?"
                      onConfirm={() =>
                        updateStatus(currentListing._id, "rejected")
                      }
                      okText="Từ chối"
                      cancelText="Hủy"
                    >
                      <Button danger icon={<CloseOutlined />}>
                        Từ chối
                      </Button>
                    </Popconfirm>
                  )}
              </div>
            </>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
