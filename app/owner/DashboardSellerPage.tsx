"use client";

import { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Table } from "antd";
import {
  DollarCircleOutlined,
  ShoppingOutlined,
  StarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { DashboardService } from "@/service/dashboard.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardSellerPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (user?._id) fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    const res = await DashboardService.getSellerDashboard(user._id);
    setData(res);
  };

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );

  const { totals, revenueByDay, topListings, recentOrders } = data;

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["listing", "title"],
      key: "title",
      render: (title: string, record: any) => (
        <div className="flex items-center gap-2">
          <img
            src={record.listing?.images?.[0]}
            alt=""
            className="w-12 h-12 object-cover rounded"
          />
          <span>{title}</span>
        </div>
      ),
    },
    { title: "Người mua", dataIndex: ["buyer", "name"], key: "buyer" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (v: number) => `${v.toLocaleString()} VND`,
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="pt-24 pb-12 container mx-auto px-6">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">
          Bảng điều khiển người bán
        </h1>

        {/* Card thống kê */}
        <Row gutter={16}>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu"
                value={totals.revenue}
                prefix={<DollarCircleOutlined />}
                suffix="VND"
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Đơn hàng"
                value={totals.orders}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Listing"
                value={totals.listings}
                prefix={<AppstoreOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Đánh giá"
                value={totals.reviews}
                prefix={<StarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Biểu đồ doanh thu */}
        <Card title="Doanh thu 7 ngày gần nhất" className="mt-8">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1890ff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top sản phẩm */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topListings.map((item: any) => (
            <Card
              key={item.listingId}
              hoverable
              cover={
                <img
                  src={item.image}
                  alt=""
                  className="h-48 w-full object-cover"
                />
              }
            >
              <Card.Meta
                title={item.title}
                description={
                  <>
                    <p>Doanh thu: {item.revenue.toLocaleString()} VND</p>
                    <p>Đơn: {item.orders}</p>
                  </>
                }
              />
            </Card>
          ))}
        </div>

        {/* Đơn gần đây */}
        <Card title="Đơn hàng gần đây" className="mt-10">
          <Table
            dataSource={recentOrders}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        </Card>
      </section>
    </main>
  );
}
