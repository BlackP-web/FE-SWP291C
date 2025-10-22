"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Space,
  Upload,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import OwnerLayout from "../OwnerLayout";
import { ListingService } from "@/service/listing.service";
import { BrandService } from "@/service/brand.service";
import { useAuth } from "@/hooks/useAuth";
import { UploadService } from "@/service/upload.service";

const { Option } = Select;
const { confirm } = Modal;

interface Listing {
  _id: string;
  seller: string;
  type: "car" | "battery";
  title: string;
  brand: { _id: string; name: string };
  year: number;
  batteryCapacity?: number;
  kmDriven?: number;
  price: number;
  aiSuggestedPrice?: number;
  images: string[];
  status: "active" | "sold" | "pending";
}

export default function OwnerListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const { user } = useAuth();

  const fetchBrands = async () => {
    try {
      const res = await BrandService.getAllBrands();
      if (res?.data?.length) setBrands(res.data);
    } catch {
      message.error("Lấy danh sách hãng thất bại");
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await ListingService.getListingsBySeller();
      setListings(res?.listings || []);
    } catch {
      message.error("Lấy danh sách bài đăng thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await ListingService.deleteListing(id);
      message.success("Xóa thành công");
      fetchListings();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    form.setFieldsValue({
      ...listing,
      brand: listing.brand?._id,
    });
    setFileList(
      listing.images.map((url, index) => ({
        uid: index.toString(),
        name: `image-${index}`,
        status: "done",
        url,
      }))
    );
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingListing(null);
    form.resetFields();
    setFileList([]);
    setModalOpen(true);
  };

  const handleBrandChange = (brandId: string) => {
    form.setFieldsValue({ model: null });
  };

  const handleImageUpload = async ({ file, onSuccess, onError }: any) => {
    try {
      const res = await UploadService.uploadSingleImage(file);
      onSuccess(res);
    } catch (err) {
      onError(err);
    }
  };

  const handleImageChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values: any) => {
    try {
      const imageUrls = fileList
        .filter((f) => f.status === "done" && (f.url || f.response?.data?.url))
        .map((f) => f.url || f.response.data.url);

      const payload = {
        ...values,
        seller: user?._id,
        images: imageUrls,
      };

      if (editingListing) {
        await ListingService.updateListing(editingListing._id, payload);
        message.success("Cập nhật thành công");
      } else {
        await ListingService.createListing(payload);
        message.success("Tạo bài đăng thành công");
      }

      setModalOpen(false);
      fetchListings();
    } catch {
      message.error("Thao tác thất bại");
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      key: "images",
      render: (_: any, record: Listing) => (
        <img
          src={record.images?.[0]}
          alt=""
          style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    {
      title: "Hãng",
      key: "brandModel",
      render: (_, record: Listing) => <>{record.brand?.name || record.brand}</>,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) =>
        type === "car" ? "Xe điện" : type === "battery" ? "Pin xe điện" : type,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (v: number) => `${v.toLocaleString()}₫`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color: string;
        let label: string;

        switch (status) {
          case "active":
            color = "green";
            label = "Đăng bán";
            break;
          case "sold":
            color = "volcano";
            label = "Đã bán";
            break;
          case "approved":
            color = "blue";
            label = "Đã kiểm định";
            break;
          case "pending":
            color = "orange";
            label = "Lưu trữ";
            break;
          case "processing":
            color = "purple";
            label = "Lên hồ sơ";
            break;
          case "rejected":
            color = "red";
            label = "Vi phạm";
            break;
          default:
            color = "default";
            label = status;
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Listing) => (
        <Space>
          {record.status !== "sold" && (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() =>
                  confirm({
                    title: "Xác nhận xóa",
                    icon: <ExclamationCircleOutlined />,
                    content: "Bạn có chắc chắn muốn xóa bài đăng này không?",
                    okText: "Xóa",
                    okType: "danger",
                    cancelText: "Hủy",
                    onOk() {
                      handleDelete(record._id);
                    },
                  })
                }
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <OwnerLayout>
      <div>
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">Quản lý bài đăng</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm bài đăng
          </Button>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={listings}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />

        <Modal
          title={editingListing ? "Cập nhật bài đăng" : "Tạo bài đăng mới"}
          open={modalOpen}
          width={1000}
          onCancel={() => setModalOpen(false)}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="title"
                  label="Tiêu đề"
                  rules={[{ required: true, message: "Nhập tiêu đề" }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Loại"
                  rules={[{ required: true, message: "Chọn loại" }]}
                >
                  <Select>
                    <Option value="car">Xe điện</Option>
                    <Option value="battery">Pin xe điện</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="brand"
                  label="Hãng"
                  rules={[{ required: true, message: "Chọn hãng" }]}
                >
                  <Select onChange={handleBrandChange}>
                    {brands.map((brand) => (
                      <Option key={brand._id} value={brand._id}>
                        {brand.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="year" label="Năm sản xuất">
                  <InputNumber
                    min={1900}
                    max={2100}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="kmDriven" label="Số km đã đi">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="batteryCapacity" label="Dung lượng pin (kWh)">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="price"
                  label="Giá"
                  rules={[{ required: true, message: "Nhập giá" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="pending">Lưu trữ</Option>
                    <Option value="active">Đăng bán</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="images" label="Hình ảnh">
                  <Upload
                    listType="picture-card"
                    customRequest={handleImageUpload}
                    fileList={fileList}
                    onChange={handleImageChange}
                    multiple
                    maxCount={5}
                  >
                    {fileList.length < 5 && <PlusOutlined />}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </OwnerLayout>
  );
}
