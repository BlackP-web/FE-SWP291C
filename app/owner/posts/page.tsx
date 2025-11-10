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
import { formatVND } from "@/lib/formatCurrency";
import { ListingService } from "@/service/listing.service";
import { BrandService } from "@/service/brand.service";
import { useAuth } from "@/hooks/useAuth";
import { UploadService } from "@/service/upload.service";
import { UserService } from "@/service/user.service";
import { PackageService } from "@/service/package.service";

const { Option } = Select;
const { confirm } = Modal;

interface Listing {
  _id: string;
  seller: string;
  type: "car" | "battery";
  title: string;
  brand?: { _id: string; name: string };
  year?: number;
  price: number;
  images: string[];
  status: string;
  carDetails?: any;
  batteryDetails?: any;
  contract: string;
}

export default function OwnerListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const { user, isAuthenticated } = useAuth();
  const [remainingPosts, setRemainingPosts] = useState<number | null>(null);

  const fetchUserInfo = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      // 1. Lấy số bài đăng hiện tại
      const resUser = await UserService.getById(user._id);
      const postCount = resUser.postCount || 0;

      // 2. Lấy gói active của user để biết maxListings
      const resPackages = await PackageService.getUserPackages(user._id);
      console.log({ resPackages });
      const activePackage = resPackages.data?.find(
        (p: any) => p.status === "active"
      );

      let maxListings = null;
      if (activePackage) {
        maxListings = activePackage.package.maxListings; // lấy maxListings từ gói
      }

      // 3. Tính số bài còn lại
      if (maxListings !== null) {
        const remaining = maxListings - postCount;
        setRemainingPosts(remaining >= 0 ? remaining : 0);
      } else {
        setRemainingPosts(null); // Không giới hạn
      }
    } catch (err) {
      console.log({ err });
      message.error("Không thể tải thông tin người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUserInfo();
  }, [isAuthenticated, user]);
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
    setSelectedType(listing.type);
    form.setFieldsValue({
      ...listing,
      brand: listing.brand?._id,
      contract: listing.contract || null,
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
    setSelectedType(null);
    setModalOpen(true);
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
        contract: values.contract,
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
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Thao tác thất bại");
    }
  };
  const handleContractUpload = async ({ file, onSuccess, onError }: any) => {
    try {
      const res = await UploadService.uploadSingleImage(file); // nếu UploadService xử lý file PDF cũng ok
      const fileUrl = res?.data?.url;
      form.setFieldValue("contract", fileUrl);
      onSuccess(res);
      message.success("Tải lên hợp đồng thành công");
    } catch (err) {
      message.error("Tải lên hợp đồng thất bại");
      onError(err);
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
      render: (v: number) => formatVND(v),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap: Record<string, string> = {
          active: "Đăng bán",
          sold: "Đã bán",
          approved: "Đã kiểm định",
          pending: "Lưu trữ",
          processing: "Lên hồ sơ",
          rejected: "Vi phạm",
        };
        // monochrome / grayscale color mapping to match project theme
        const colorMap: Record<string, string> = {
          active: "#111827", // gray-900
          sold: "#374151", // gray-700
          approved: "#1f2937", // gray-800
          pending: "#6b7280", // gray-500
          processing: "#4b5563", // gray-600
          rejected: "#9ca3af", // gray-400
        };
        const bg = colorMap[status] ?? "#6b7280";
        return (
          <Tag
            style={{
              backgroundColor: bg,
              color: "#fff",
              fontWeight: 600,
              borderRadius: 6,
              padding: "0 8px",
            }}
          >
            {statusMap[status]}
          </Tag>
        );
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
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Quản lý bài đăng</h1>
          <div className="flex items-center gap-2">
            {remainingPosts !== null && (
              <Tag
                className="font-semibold"
                style={{
                  backgroundColor: remainingPosts > 0 ? "#111827" : "#6b7280",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {remainingPosts} bài đăng còn lại
              </Tag>
            )}
            <Button
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
            >
              Thêm bài đăng
            </Button>
          </div>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={listings}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
          size="small"
          tableLayout="fixed"
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
                  <Select
                    onChange={(value) => {
                      setSelectedType(value);
                      form.setFieldsValue({ type: value });
                    }}
                  >
                    <Option value="car">Xe điện</Option>
                    <Option value="battery">Pin xe điện</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="description" label="Mô tả">
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="brand"
                  label="Hãng"
                  rules={[{ required: true, message: "Chọn hãng" }]}
                >
                  <Select placeholder="Chọn hãng">
                    {brands.map((brand) => (
                      <Option key={brand._id} value={brand._id}>
                        {brand.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="price"
                  label="Giá"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá" },
                    {
                      type: "number",
                      min: 0,
                      message: "Giá phải là số lớn hơn hoặc bằng 0",
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="status" label="Trạng thái">
                  <Select>
                    <Option value="pending">Lưu trữ</Option>
                    <Option value="active">Đăng bán</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {selectedType === "car" && (
              <>
                <h3 className="font-bold mt-4 mb-2">Thông tin xe điện</h3>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name={["carDetails", "registrationNumber"]}
                      label="Biển số xe"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["carDetails", "ownerNumber"]}
                      label="Số đời chủ sở hữu"
                    >
                      <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["carDetails", "fuelType"]}
                      label="Loại nhiên liệu"
                    >
                      <Select>
                        <Option value="electric">Điện</Option>
                        <Option value="hybrid">Hybrid</Option>
                        <Option value="petrol">Xăng</Option>
                        <Option value="diesel">Dầu</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["carDetails", "transmission"]}
                      label="Hộp số"
                    >
                      <Select>
                        <Option value="manual">Số sàn</Option>
                        <Option value="automatic">Tự động</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["carDetails", "batteryCapacity"]}
                      label="Dung lượng pin (kWh)"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập dung lượng pin",
                        },
                        {
                          type: "number",
                          min: 0,
                          message:
                            "Dung lượng pin phải là số lớn hơn hoặc bằng 0",
                        },
                      ]}
                    >
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name={["carDetails", "kmDriven"]}
                      label="Số km đã đi"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số km đã đi",
                        },
                        {
                          type: "number",
                          min: 0,
                          message: "Số km phải là số lớn hơn hoặc bằng 0",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        addonAfter="km"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name={["carDetails", "seats"]}
                      label="Số ghế ngồi"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số ghế ngồi",
                        },
                        {
                          type: "number",
                          min: 1,
                          message: "Số ghế phải lớn hơn hoặc bằng 1",
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: "100%" }}
                        addonAfter="ghế"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name={["carDetails", "color"]} label="Màu sắc">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["carDetails", "insuranceExpiry"]}
                      label="Hạn bảo hiểm"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn hạn bảo hiểm",
                        },
                        {
                          validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            const date = new Date(value);
                            return isNaN(date.getTime())
                              ? Promise.reject(new Error("Ngày không hợp lệ"))
                              : Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input type="date" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name={["carDetails", "inspectionExpiry"]}
                      label="Hạn đăng kiểm"
                    >
                      <Input type="date" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name={["carDetails", "accidentHistory"]}
                      label="Lịch sử tai nạn"
                    >
                      <Input.TextArea rows={2} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name={["carDetails", "location"]}
                      label="Địa điểm"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            {selectedType === "battery" && (
              <>
                <h3 className="font-bold mt-4 mb-2">Thông tin pin xe điện</h3>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name={["batteryDetails", "brand"]}
                      label="Hãng pin"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["batteryDetails", "capacity"]}
                      label="Dung lượng (kWh)"
                      rules={[
                        { required: true, message: "Vui lòng nhập dung lượng" },
                        {
                          type: "number",
                          min: 0,
                          message: "Dung lượng phải là số lớn hơn hoặc bằng 0",
                        },
                      ]}
                    >
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name={["batteryDetails", "voltage"]}
                      label="Điện áp (V)"
                      rules={[
                        { required: true, message: "Vui lòng nhập điện áp" },
                        {
                          type: "number",
                          min: 0,
                          message: "Điện áp phải là số lớn hơn hoặc bằng 0",
                        },
                      ]}
                    >
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name={["batteryDetails", "healthPercentage"]}
                      label="Tình trạng pin (%)"
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["batteryDetails", "warranty"]}
                      label="Bảo hành"
                    >
                      <Input placeholder="VD: 12 tháng hoặc 6 tháng còn lại" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name={["batteryDetails", "compatibleModels"]}
                      label="Xe tương thích"
                    >
                      <Select mode="tags" placeholder="Nhập xe tương thích" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["batteryDetails", "serialNumber"]}
                      label="Số seri"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["batteryDetails", "manufactureDate"]}
                      label="Ngày sản xuất"
                    >
                      <Input type="date" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name={["batteryDetails", "location"]}
                      label="Địa điểm"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            <Col span={24}>
              <Form.Item
                name="contract"
                label="Hợp đồng mua bán"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng tải lên hợp đồng mua bán",
                  },
                ]}
              >
                <Upload
                  customRequest={handleContractUpload}
                  fileList={
                    form.getFieldValue("contract")
                      ? [
                          {
                            uid: "-1",
                            name: "contract",
                            status: "done",
                            url: form.getFieldValue("contract"),
                          },
                        ]
                      : []
                  }
                  onRemove={() => {
                    form.setFieldValue("contract", null);
                  }}
                  maxCount={1}
                >
                  {!form.getFieldValue("contract") && (
                    <Button icon={<UploadOutlined />}>Tải lên hợp đồng</Button>
                  )}
                </Upload>
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
          </Form>
        </Modal>
      </div>
    </OwnerLayout>
  );
}
