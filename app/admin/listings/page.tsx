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
      render: (imgs: string[]) =>
        imgs?.length ? (
          <img
            src={imgs[0]}
            className="w-20 h-14 object-cover rounded shadow-sm"
          />
        ) : (
          <div className="w-20 h-14 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        ),
    },
    { title: "Tiêu đề", dataIndex: "title" },
    {
      title: "Người bán",
      dataIndex: "seller",
      render: (s: any) =>
        s ? (
          <div>
            <Text strong>{typeof s === "string" ? s : s.name || s.email}</Text>
            {typeof s !== "string" && s.email && (
              <div className="text-xs text-gray-500">{s.email}</div>
            )}
          </div>
        ) : (
          "-"
        ),
    },
    { title: "Loại", dataIndex: "type", render: (t: string) => typeLabel(t) },
    {
      title: "Giá",
      dataIndex: "price",
      render: (p: number) =>
        p != null ? `${Number(p).toLocaleString()}₫` : "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s: string) => <Tag color={statusColor(s)}>{statusLabel(s)}</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Listing) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openDetail(record._id)}>
            Xem
          </Button>
          {(record.status === "pending" ||
            record.status === "rejected" ||
            record.status === "active") && (
            <Popconfirm
              title="Duyệt bài này?"
              onConfirm={() => updateStatus(record._id, "approved")}
            >
              <Button type="primary" icon={<CheckOutlined />}>
                Duyệt
              </Button>
            </Popconfirm>
          )}
          {(record.status === "pending" || record.status === "approved") && (
            <Popconfirm
              title="Từ chối bài này?"
              onConfirm={() => updateStatus(record._id, "rejected")}
            >
              <Button danger icon={<CloseOutlined />}>
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
      <div className="p-6 bg-white rounded-xl shadow-md">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
          <Title level={3} className="!mb-0">
            Quản lý bài đăng
          </Title>
          <div className="flex flex-wrap gap-3">
            <Select
              allowClear
              placeholder="Lọc theo trạng thái"
              style={{ width: 180 }}
              value={filterStatus}
              onChange={setFilterStatus}
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
              style={{ width: 260 }}
            />
            <Button icon={<ReloadOutlined />} onClick={loadListings}>
              Làm mới
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey={(r) => r._id}
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1000 }}
        />

        <Modal
          open={detailModalOpen}
          title={
            <span>
              <EyeOutlined className="mr-2" />
              {currentListing?.title}
            </span>
          }
          onCancel={() => setDetailModalOpen(false)}
          footer={null}
          width={950}
        >
          {detailLoading || !currentListing ? (
            <div className="py-10 text-center">Đang tải...</div>
          ) : (
            <>
              {/* Ảnh */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {currentListing.images?.length ? (
                  currentListing.images.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`img-${idx}`}
                      className="rounded-lg"
                    />
                  ))
                ) : (
                  <div className="col-span-4 text-center text-gray-400 py-10">
                    Không có hình ảnh
                  </div>
                )}
              </div>

              <Divider orientation="left">Thông tin chung</Divider>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Tiêu đề">
                  {currentListing.title}
                </Descriptions.Item>
                <Descriptions.Item label="Người bán">
                  <UserOutlined className="mr-1" />
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
                <Descriptions.Item label="Giá">
                  {currentListing.price
                    ? `${currentListing.price.toLocaleString()}₫`
                    : "-"}
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
                  <Divider orientation="left">Chi tiết xe điện</Divider>
                  <Descriptions bordered size="small" column={2}>
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
                  <Divider orientation="left">Chi tiết pin xe điện</Divider>
                  <Descriptions bordered size="small" column={2}>
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

              <div className="mt-4 flex justify-end gap-2">
                {currentListing.status === "pending" && (
                  <Popconfirm
                    title="Duyệt bài đăng này?"
                    onConfirm={() =>
                      updateStatus(currentListing._id, "approved")
                    }
                  >
                    <Button type="primary" icon={<CheckOutlined />}>
                      Duyệt
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
