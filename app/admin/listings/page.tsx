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
  Divider,
  Typography,
  Card,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  CarOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AdminLayout from "../AdminLayout";
import { ListingService } from "@/service/listing.service";

const { Option } = Select;
const { Search } = Input;
const { Title, Text } = Typography;

interface Listing {
  _id: string;
  seller?: { _id: string; name?: string; email?: string } | string;
  type: "car" | "battery";
  title: string;
  description?: string;
  brand?: { _id: string; name?: string } | string;
  year?: number;
  batteryCapacity?: number;
  kmDriven?: number;
  price?: number;
  aiSuggestedPrice?: number;
  images?: string[];
  status:
    | "active"
    | "sold"
    | "approved"
    | "pending"
    | "processing"
    | "rejected";
  createdAt?: string;
  updatedAt?: string;
  carDetails?: any;
  batteryDetails?: any;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [searchText, setSearchText] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState<Listing | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await ListingService.getAllListings();
      const arr = Array.isArray(data) ? data : data?.listings ?? [];
      setListings(arr);
    } catch (err) {
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
      if (searchText)
        return l.title?.toLowerCase().includes(searchText.toLowerCase());
      return true;
    });
  }, [listings, filterStatus, searchText]);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const data = await ListingService.getById(id);
      setCurrentListing(data?.listing ?? data);
      setDetailModalOpen(true);
    } catch (err) {
      message.error("Không thể lấy thông tin chi tiết");
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      if (status === "approved") await ListingService.approve(id);
      else if (status === "rejected") await ListingService.reject(id);
      else throw new Error("Trạng thái không hợp lệ");
      message.success(
        status === "approved" ? "Đã duyệt bài" : "Đã từ chối bài"
      );
      loadListings();
    } catch {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const statusLabel = (s: string) =>
    ({
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      active: "Đăng bán",
      processing: "Đang giao dịch",
      sold: "Đã bán",
      rejected: "Từ chối",
    }[s] || s);

  const statusColor = (s: string) =>
    ({
      pending: "orange",
      approved: "blue",
      active: "green",
      processing: "purple",
      sold: "red",
      rejected: "default",
    }[s] || "default");

  const typeLabel = (type: string) =>
    type === "car" ? (
      <>
        <CarOutlined className="text-blue-500 mr-1" />
        Xe điện
      </>
    ) : (
      <>
        <ThunderboltOutlined className="text-yellow-500 mr-1" />
        Pin xe điện
      </>
    );

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "images",
      width: 120,
      render: (imgs: string[]) =>
        imgs?.length ? (
          <img
            src={imgs[0]}
            className="w-24 h-16 object-cover rounded-lg shadow-md"
            style={{ border: "2px solid #f1f5f9" }}
          />
        ) : (
          <div className="w-24 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 shadow-sm">
            <CarOutlined style={{ fontSize: 24, opacity: 0.3 }} />
          </div>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      render: (title: string) => (
        <Text strong style={{ fontSize: 14, color: "#1e293b" }}>
          {title}
        </Text>
      ),
    },
    {
      title: "Người bán",
      dataIndex: "seller",
      render: (s: any) =>
        s ? (
          <div>
            <div style={{ fontWeight: 600, color: "#475569", fontSize: 14 }}>
              <UserOutlined style={{ marginRight: 4, color: "#667eea" }} />
              {typeof s === "string" ? s : s.name || s.email}
            </div>
            {typeof s !== "string" && s.email && (
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.email}</div>
            )}
          </div>
        ) : (
          <span style={{ color: "#cbd5e1" }}>—</span>
        ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      width: 140,
      render: (t: string) => (
        <Tag
          icon={
            t === "car" ? (
              <CarOutlined />
            ) : (
              <ThunderboltOutlined />
            )
          }
          color={t === "car" ? "blue" : "gold"}
          style={{
            borderRadius: 8,
            padding: "4px 12px",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {t === "car" ? "Xe điện" : "Pin"}
        </Tag>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: 150,
      render: (p: number) =>
        p != null ? (
          <span style={{ fontWeight: 700, color: "#10b981", fontSize: 15 }}>
            {Number(p).toLocaleString()}₫
          </span>
        ) : (
          <span style={{ color: "#cbd5e1" }}>—</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      render: (s: string) => {
        const configs: Record<string, { color: string; icon: string }> = {
          pending: { color: "orange", icon: "🕐" },
          approved: { color: "blue", icon: "✅" },
          active: { color: "green", icon: "🟢" },
          processing: { color: "purple", icon: "🔄" },
          sold: { color: "red", icon: "🔴" },
          rejected: { color: "default", icon: "❌" },
        };
        const config = configs[s] || configs.pending;
        return (
          <Tag
            color={config.color}
            style={{
              borderRadius: 8,
              padding: "4px 12px",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {config.icon} {statusLabel(s)}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      render: (_: any, record: Listing) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => openDetail(record._id)}
            style={{ borderRadius: 8 }}
          >
            Xem
          </Button>
          {(record.status === "pending" ||
            record.status === "rejected" ||
            record.status === "active") && (
            <Popconfirm
              title="Duyệt bài này?"
              onConfirm={() => updateStatus(record._id, "approved")}
            >
              <Button
                type="primary"
                icon={<CheckOutlined />}
                style={{
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                }}
              >
                Duyệt
              </Button>
            </Popconfirm>
          )}
          {(record.status === "pending" || record.status === "approved") && (
            <Popconfirm
              title="Từ chối bài này?"
              onConfirm={() => updateStatus(record._id, "rejected")}
            >
              <Button
                danger
                icon={<CloseOutlined />}
                style={{ borderRadius: 8 }}
              >
                Từ chối
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

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
            }}
          >
            Quản lý bài đăng
          </h1>
          <p style={{ color: "#64748b", marginTop: 4 }}>
            Quản lý và duyệt tất cả bài đăng xe điện và pin
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            }}
          >
            <div style={{ color: "white" }}>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Chờ duyệt</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
                {listings.filter((l) => l.status === "pending").length}
              </div>
            </div>
          </Card>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            }}
          >
            <div style={{ color: "white" }}>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Đã duyệt</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
                {listings.filter((l) => l.status === "approved").length}
              </div>
            </div>
          </Card>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
          >
            <div style={{ color: "white" }}>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Đang bán</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
                {listings.filter((l) => l.status === "active").length}
              </div>
            </div>
          </Card>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            }}
          >
            <div style={{ color: "white" }}>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Đã bán</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
                {listings.filter((l) => l.status === "sold").length}
              </div>
            </div>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card
          bordered={false}
          style={{ borderRadius: 12 }}
          className="hover:shadow-lg transition-shadow duration-300"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <Space size="middle">
              <Select
                allowClear
                placeholder="Lọc theo trạng thái"
                style={{ width: 180 }}
                value={filterStatus}
                onChange={setFilterStatus}
                size="large"
              >
                <Option value="pending">🕐 Chờ duyệt</Option>
                <Option value="approved">✅ Đã duyệt</Option>
                <Option value="active">🟢 Đang bán</Option>
                <Option value="sold">🔴 Đã bán</Option>
                <Option value="rejected">❌ Từ chối</Option>
              </Select>
              <Search
                placeholder="Tìm theo tiêu đề"
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 280 }}
                size="large"
              />
            </Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadListings}
              size="large"
              style={{
                borderRadius: 8,
                borderColor: "#667eea",
                color: "#667eea",
              }}
            >
              Làm mới
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={filtered}
            rowKey={(r) => r._id}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} bài đăng`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        <Modal
          open={detailModalOpen}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <EyeOutlined style={{ color: "#667eea", fontSize: 20 }} />
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                {currentListing?.title}
              </span>
            </div>
          }
          onCancel={() => setDetailModalOpen(false)}
          footer={null}
          width={1000}
          style={{ top: 20 }}
        >
          {detailLoading || !currentListing ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "#94a3b8" }}>
              Đang tải...
            </div>
          ) : (
            <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "8px 0" }}>
              {/* Ảnh */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#1e293b" }}>
                  Hình ảnh
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
                  {currentListing.images?.length ? (
                    currentListing.images.map((img, idx) => (
                      <Image
                        key={idx}
                        src={img}
                        alt={`img-${idx}`}
                        style={{ borderRadius: 12, objectFit: "cover", height: 120 }}
                      />
                    ))
                  ) : (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#cbd5e1", padding: 40 }}>
                      Không có hình ảnh
                    </div>
                  )}
                </div>
              </div>

              <Divider style={{ margin: "24px 0" }} />

              {/* Thông tin chung */}
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#1e293b" }}>
                Thông tin chung
              </h4>
              <Descriptions bordered column={2} size="middle" style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Tiêu đề" span={2}>
                  <Text strong>{currentListing.title}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Người bán">
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <UserOutlined style={{ color: "#667eea" }} />
                    {typeof currentListing.seller === "string"
                      ? currentListing.seller
                      : currentListing.seller?.name ||
                        currentListing.seller?.email}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Loại">
                  {currentListing.type === "car" ? (
                    <Tag icon={<CarOutlined />} color="blue">Xe điện</Tag>
                  ) : (
                    <Tag icon={<ThunderboltOutlined />} color="gold">Pin xe điện</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Hãng">
                  {typeof currentListing.brand === "string"
                    ? currentListing.brand
                    : currentListing.brand?.name || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Giá">
                  <Text strong style={{ color: "#10b981", fontSize: 16 }}>
                    {currentListing.price
                      ? `${currentListing.price.toLocaleString()}₫`
                      : "-"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Giá AI gợi ý">
                  {currentListing.aiSuggestedPrice
                    ? `${currentListing.aiSuggestedPrice.toLocaleString()}₫`
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={statusColor(currentListing.status)}>
                    {statusLabel(currentListing.status)}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              {/* Chi tiết kỹ thuật */}
              {currentListing.type === "car" && (
                <>
                  <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#1e293b" }}>
                    Chi tiết xe điện
                  </h4>
                  <Descriptions bordered size="middle" column={2} style={{ marginBottom: 24 }}>
                    <Descriptions.Item label="Số km đã đi">
                      {currentListing.carDetails?.kmDriven ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Dung lượng pin (kWh)">
                      {currentListing.carDetails?.batteryCapacity ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Màu sắc">
                      {currentListing.carDetails?.color ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số chỗ ngồi">
                      {currentListing.carDetails?.seats ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại nhiên liệu">
                      {currentListing.carDetails?.fuelType ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Truyền động">
                      {currentListing.carDetails?.transmission ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày hết hạn kiểm định">
                      {currentListing.carDetails?.inspectionExpiry
                        ? new Date(
                            currentListing.carDetails?.inspectionExpiry
                          ).toLocaleDateString()
                        : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số chủ sở hữu">
                      {currentListing.carDetails?.ownerNumber ?? "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}

              {currentListing.type === "battery" && (
                <>
                  <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#1e293b" }}>
                    Chi tiết pin xe điện
                  </h4>
                  <Descriptions bordered size="middle" column={2} style={{ marginBottom: 24 }}>
                    <Descriptions.Item label="Thương hiệu">
                      {currentListing.batteryDetails?.brand ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Dung lượng (kWh)">
                      {currentListing.batteryDetails?.capacity ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số chu kỳ sạc">
                      {currentListing.batteryDetails?.cyclesUsed ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tình trạng pin (%)">
                      {currentListing.batteryDetails?.healthPercentage ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Bảo hành">
                      {currentListing.batteryDetails?.warranty ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sản xuất">
                      {currentListing.batteryDetails?.manufactureDate
                        ? new Date(
                            currentListing.batteryDetails.manufactureDate
                          ).toLocaleDateString()
                        : "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}

              <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                {currentListing.status === "pending" && (
                  <Popconfirm
                    title="Duyệt bài đăng này?"
                    onConfirm={() =>
                      updateStatus(currentListing._id, "approved")
                    }
                  >
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      size="large"
                      style={{
                        borderRadius: 8,
                        background:
                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        border: "none",
                      }}
                    >
                      Duyệt bài đăng
                    </Button>
                  </Popconfirm>
                )}
                {currentListing.status !== "sold" && (
                  <Popconfirm
                    title="Từ chối bài đăng này?"
                    onConfirm={() =>
                      updateStatus(currentListing._id, "rejected")
                    }
                  >
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      size="large"
                      style={{ borderRadius: 8 }}
                    >
                      Từ chối
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
