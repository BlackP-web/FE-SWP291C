"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input, Button, Select, Form, Typography } from "antd";
import Image from "next/image";

interface Seller {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Brand {
  _id: string;
  name: string;
  logo: string;
}

interface Listing {
  _id: string;
  title: string;
  brand: Brand;
  year: number;
  batteryCapacity: number;
  kmDriven: number;
  price: number;
  images: string[];
  seller: Seller;
}

interface CheckoutProps {
  listing: Listing;
}

export default function Checkout({ listing }: CheckoutProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);

  const handleSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Xác nhận thành công!\nTên: ${values.name}\nSĐT: ${values.phone}`);
      router.push("/payment"); // redirect đến trang payment giả lập
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-tesla-white">
      <Navbar />
      <section className="pt-24 pb-12 container-tesla">
        <Typography.Title level={2} className="text-tesla-black mb-8">
          Xác nhận thông tin mua xe
        </Typography.Title>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Thông tin khách hàng */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                name: "",
                phone: "",
                email: "",
                address: "",
                paymentMethod: "cod",
              }}
            >
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input placeholder="0987654321" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email" }]}
              >
                <Input placeholder="abc@gmail.com" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ nhận xe"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input.TextArea placeholder="Nhập địa chỉ..." rows={3} />
              </Form.Item>

              <Form.Item label="Phương thức thanh toán" name="paymentMethod">
                <Select>
                  <Select.Option value="cod">
                    Thanh toán khi nhận xe
                  </Select.Option>
                  <Select.Option value="bank">
                    Chuyển khoản ngân hàng
                  </Select.Option>
                  <Select.Option value="momo">Momo / QR Pay</Select.Option>
                </Select>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="w-full mt-4 bg-gradient-to-r from-tesla-black to-tesla-dark-gray"
                loading={loading}
              >
                Tiếp tục
              </Button>
            </Form>
          </div>

          {/* Tóm tắt xe */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Typography.Title level={4} className="text-tesla-black mb-4">
              Thông tin xe
            </Typography.Title>
            <div className="flex items-center mb-4 space-x-4">
              <Image
                src={listing.images?.[0] || "https://via.placeholder.com/150"}
                alt={listing.title}
                width={120}
                height={80}
                className="rounded-lg object-cover"
              />
              <div>
                <Typography.Text strong>{listing.title}</Typography.Text>
                <div className="text-gray-500">
                  {listing.brand.name} • {listing.year}
                </div>
              </div>
            </div>
            <div className="text-gray-700 mb-2">
              <span>Km đã đi: </span>
              {listing.kmDriven?.toLocaleString()} km
            </div>
            <div className="text-gray-700 mb-2">
              <span>Pin: </span>
              {listing.batteryCapacity}%
            </div>
            <div className="text-2xl font-semibold text-tesla-black mt-4">
              {formatPrice(listing.price)}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
