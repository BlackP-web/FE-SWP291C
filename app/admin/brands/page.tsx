"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Tag, message } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import AdminLayout from "../AdminLayout";
import { BrandService } from "@/service/brand.service";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [form] = Form.useForm();

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
    setIsModalOpen(true);
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
    { title: "Tên hãng", dataIndex: "name", key: "name" },
    { title: "Quốc gia", dataIndex: "country", key: "country" },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (url: string) =>
        url ? (
          <img src={url} alt="logo" className="w-12 h-12 object-contain" />
        ) : (
          <Tag>Không có</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 bg-white rounded shadow">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Quản lý hãng xe</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Thêm hãng
          </Button>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={brands}
          loading={loading}
        />

        <Modal
          title={editingBrand ? "Chỉnh sửa hãng xe" : "Thêm hãng xe"}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSave}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên hãng"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="country" label="Quốc gia">
              <Input />
            </Form.Item>
            <Form.Item name="logo" label="Logo (URL)">
              <Input placeholder="https://example.com/logo.png" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
