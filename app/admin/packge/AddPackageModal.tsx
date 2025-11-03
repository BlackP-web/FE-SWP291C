"use client";

import React from "react";
import { Modal, Form, Input, InputNumber, Button, message } from "antd";
import { PackageService } from "@/service/package.service";

interface AddPackageModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPackageModal({
  onClose,
  onSuccess,
}: AddPackageModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await PackageService.createPackage(values);
      message.success("Tạo gói thành công!");
      onClose();
      onSuccess();
    } catch (err: any) {
      if (!err.errorFields) message.error("Tạo gói thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      title="Thêm gói dịch vụ"
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ durationDays: 30, price: 0 }}
      >
        <Form.Item
          label="Tên gói"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên gói!" }]}
        >
          <Input placeholder="Nhập tên gói..." />
        </Form.Item>

        <Form.Item
          label="Mã gói (duy nhất)"
          name="key"
          rules={[{ required: true, message: "Vui lòng nhập mã gói!" }]}
        >
          <Input placeholder="Ví dụ: BASIC, PREMIUM..." />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Nhập mô tả..." rows={3} />
        </Form.Item>

        <Form.Item
          label="Giá (VND)"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            formatter={(value) =>
              `${Number(value).toLocaleString("vi-VN")} VND`
            }
            parser={(value: any) => value.replace(/[^\d]/g, "")}
          />
        </Form.Item>

        <Form.Item
          label="Số lượng bài đăng tối đa"
          name="maxListings"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng bài đăng!" },
          ]}
        >
          <InputNumber className="w-full" min={0} />
        </Form.Item>

        <Form.Item
          label="Thời hạn (ngày)"
          name="durationDays"
          rules={[{ required: true, message: "Vui lòng nhập số ngày!" }]}
        >
          <InputNumber className="w-full" min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
