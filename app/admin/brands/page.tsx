"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Tag,
  message,
  Upload,
  Card,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
  GlobalOutlined,
  CarOutlined,
} from "@ant-design/icons";
import AdminLayout from "../AdminLayout";
import { BrandService } from "@/service/brand.service";
import { UploadService } from "@/service/upload.service";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await BrandService.getAllBrands();
      setBrands(data?.data);
    } catch {
      message.error("Không thể tải danh sách hãng xe");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const openModal = (brand: any | null = null) => {
    setEditingBrand(brand);
    form.setFieldsValue(brand || { name: "", country: "", logo: "" });
    setFileList(
      brand?.logo ? [{ url: brand.logo, name: "logo", status: "done" }] : []
    );
    setIsModalOpen(true);
  };

  const handleUpload = async ({ file }: any) => {
    try {
      const res = await UploadService.uploadSingleImage(file);
      const imageUrl = res?.data?.url;

      if (!imageUrl) throw new Error("Không tìm thấy URL ảnh");

      form.setFieldValue("logo", imageUrl);
      setFileList([{ url: imageUrl, name: file.name, status: "done" }]);
      message.success("Tải logo thành công!");
    } catch (err) {
      console.error(err);
      message.error("Upload thất bại");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingBrand) {
        await BrandService.updateBrand(editingBrand._id, values);
        message.success("Cập nhật hãng xe thành công");
      } else {
        await BrandService.createBrand(values);
        message.success("Thêm hãng xe thành công");
      }
      setIsModalOpen(false);
      loadBrands();
    } catch {
      message.error("Có lỗi xảy ra");
    }
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: 100,
      render: (url: string, record: any) =>
        url ? (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              padding: 8,
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #f1f5f9",
            }}
          >
            <img
              src={url}
              alt={record.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CarOutlined style={{ fontSize: 24, color: "#94a3b8" }} />
          </div>
        ),
    },
    {
      title: "Tên hãng",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>
          {name}
        </span>
      ),
    },
    {
      title: "Quốc gia",
      dataIndex: "country",
      key: "country",
      render: (country: string) =>
        country ? (
          <Tag
            icon={<GlobalOutlined />}
            color="blue"
            style={{
              borderRadius: 8,
              padding: "4px 12px",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {country}
          </Tag>
        ) : (
          <span style={{ color: "#cbd5e1" }}>—</span>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_: any, record: any) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => openModal(record)}
          style={{
            borderRadius: 8,
            borderColor: "#667eea",
            color: "#667eea",
          }}
        >
          Sửa
        </Button>
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
            Quản lý nhãn hiệu
          </h1>
          <p style={{ color: "#64748b", marginTop: 4 }}>
            Quản lý các nhãn hiệu xe điện trong hệ thống
          </p>
        </div>

        {/* Stats Card */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <div style={{ color: "white" }}>
                <div style={{ fontSize: 14, opacity: 0.9 }}>
                  Tổng nhãn hiệu
                </div>
                <div style={{ fontSize: 36, fontWeight: 700, marginTop: 8 }}>
                  {brands.length}
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: 12,
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              }}
            >
              <div style={{ color: "white" }}>
                <div style={{ fontSize: 14, opacity: 0.9 }}>Quốc gia</div>
                <div style={{ fontSize: 36, fontWeight: 700, marginTop: 8 }}>
                  {new Set(brands.map((b) => b.country).filter(Boolean)).size}
                </div>
              </div>
            </Card>
          </Col>
        </Row>

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
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", margin: 0 }}>
              Danh sách nhãn hiệu
            </h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              size="large"
              style={{
                borderRadius: 8,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                height: 40,
                fontWeight: 600,
              }}
            >
              Thêm nhãn hiệu
            </Button>
          </div>

          <Table
            rowKey="_id"
            columns={columns}
            dataSource={brands}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} nhãn hiệu`,
            }}
          />
        </Card>

        <Modal
          title={
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {editingBrand ? "Chỉnh sửa nhãn hiệu" : "Thêm nhãn hiệu mới"}
            </span>
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSave}
          okText="Lưu"
          cancelText="Hủy"
          width={600}
          okButtonProps={{
            style: {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: 8,
            },
          }}
          cancelButtonProps={{ style: { borderRadius: 8 } }}
        >
          <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
            <Form.Item
              name="name"
              label="Tên nhãn hiệu"
              rules={[
                { required: true, message: "Vui lòng nhập tên nhãn hiệu" },
              ]}
            >
              <Input
                prefix={<CarOutlined />}
                placeholder="VD: Tesla, BMW, ..."
                size="large"
              />
            </Form.Item>
            <Form.Item name="country" label="Quốc gia">
              <Input
                prefix={<GlobalOutlined />}
                placeholder="VD: USA, Germany, ..."
                size="large"
              />
            </Form.Item>

            <Form.Item label="Logo nhãn hiệu">
              <Upload
                listType="picture-card"
                fileList={fileList}
                customRequest={handleUpload}
                onRemove={() => {
                  setFileList([]);
                  form.setFieldValue("logo", "");
                }}
                maxCount={1}
              >
                {fileList.length === 0 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải logo</div>
                  </div>
                )}
              </Upload>
              <Form.Item name="logo" hidden>
                <Input />
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
