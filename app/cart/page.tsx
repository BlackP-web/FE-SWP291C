"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Popconfirm,
  Typography,
  Space,
  Tag,
  message,
} from "antd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartService } from "@/service/cart.service";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

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
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!user?._id) return;
        const res = await CartService.getCartByUser(user?._id);
        setCart(res.cart?.items?.map((i: any) => i.listing) || []);
      } catch (err) {
        console.error("Lỗi tải giỏ hàng:", err);
        message.error("Không thể tải giỏ hàng!");
      }
    };
    fetchCart();
  }, [user?._id]);

  const handleRemoveFromCart = async (id: string) => {
    try {
      await CartService.removeFromCart(id, user?._id);
      setCart((prev) => prev.filter((item) => item._id !== id));
      message.success("Đã xóa khỏi giỏ hàng!");
    } catch (err) {
      console.error(err);
      message.error("Không thể xóa sản phẩm!");
    }
  };

  const handleBuyNow = (item: Listing) => {
    router.push(`/checkout?listingId=${item._id}`);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "image",
      render: (images: string[]) => (
        <img
          src={images?.[0] || "https://via.placeholder.com/100"}
          alt="listing"
          className="w-24 h-16 object-cover rounded-lg shadow-sm"
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
            {record.brand?.name} • {record.year}
          </div>
        </div>
      ),
    },
    {
      title: "Số km đã đi",
      dataIndex: "kmDriven",
      key: "km",
      render: (km: number) => <span>{km?.toLocaleString()} km</span>,
    },
    {
      title: "Dung lượng pin",
      dataIndex: "batteryCapacity",
      key: "battery",
      render: (battery: number) => <span>{battery}%</span>,
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span className="font-medium">{formatPrice(price)}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        let label = "Đang chờ";
        if (status === "approved") {
          color = "green";
          label = "Đang bán";
        } else if (status === "sold") {
          color = "red";
          label = "Đã bán";
        } else if (status === "pending") {
          color = "orange";
          label = "Đang xử lý";
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Listing) => (
        <Space>
          {record.status !== "sold" && (
            <Button type="primary" onClick={() => handleBuyNow(record)}>
              Mua ngay
            </Button>
          )}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa xe này khỏi giỏ hàng?"
            onConfirm={() => handleRemoveFromCart(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="pt-24 pb-12 container mx-auto px-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          🛒 Giỏ hàng của bạn
        </h1>
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 py-20 text-lg">
            Giỏ hàng của bạn hiện đang trống.
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <Table
              dataSource={cart}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
