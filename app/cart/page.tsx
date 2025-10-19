"use client";

import { useState, useEffect } from "react";
import { Button, Table, Popconfirm, Typography, Space } from "antd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ListingService } from "@/service/listing.service";

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
  country: string;
}

interface Listing {
  _id: string;
  seller: Seller;
  type: string;
  title: string;
  brand: Brand;
  year: number;
  batteryCapacity: number;
  kmDriven: number;
  price: number;
  images: string[];
  status: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await ListingService.getListingByType("car");
        // Tạm thời lấy 5 item làm demo
        setCart(res.listings.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);

  const handleBuyNow = (item: Listing) => {
    alert(`Mua ngay: ${item.title} - ${formatPrice(item.price)}`);
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "image",
      render: (images: string[]) => (
        <img
          src={images?.[0] || "https://via.placeholder.com/80"}
          alt="listing"
          className="w-20 h-12 object-cover rounded-lg"
        />
      ),
    },
    {
      title: "Tên xe",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Listing) => (
        <div>
          <Typography.Text strong>{text}</Typography.Text>
          <div className="text-gray-500 text-sm">
            {record.brand.name} • {record.year}
          </div>
        </div>
      ),
    },
    {
      title: "Số km",
      dataIndex: "kmDriven",
      key: "km",
      render: (km: number) => <span>{km.toLocaleString()} km</span>,
    },
    {
      title: "Pin",
      dataIndex: "batteryCapacity",
      key: "battery",
      render: (battery: number) => <span>{battery}%</span>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span>{formatPrice(price)}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={status === "approved" ? "text-green-600" : "text-red-600"}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Listing) => (
        <Space>
          <Button type="primary" onClick={() => handleBuyNow(record)}>
            Mua ngay
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => removeFromCart(record._id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="min-h-screen bg-tesla-white">
      <Navbar />
      <section className="pt-24 pb-12 container-tesla">
        <h1 className="text-3xl font-semibold text-tesla-black mb-6">
          Giỏ hàng
        </h1>
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 py-20">Giỏ hàng trống</div>
        ) : (
          <>
            <Table
              dataSource={cart}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
            <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-xl shadow-sm">
              <span className="text-xl font-medium">
                Tổng tiền: {formatPrice(totalPrice)}
              </span>
              <Button
                type="primary"
                onClick={() =>
                  alert(`Thanh toán toàn bộ: ${formatPrice(totalPrice)}`)
                }
              >
                Thanh toán toàn bộ
              </Button>
            </div>
          </>
        )}
      </section>
      <Footer />
    </main>
  );
}
