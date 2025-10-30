import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Spin, Table, Avatar, Tag } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DashboardService } from "@/service/dashboard.service";

const COLORS = ["#4caf50", "#ff9800", "#f44336", "#2196f3", "#9c27b0"];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await DashboardService.getDashboardAdmin();
      setData(res);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading || !data)
    return <Spin tip="Đang tải dashboard..." style={{ margin: 40 }} />;

  const { totals, revenueByDay, listingStatus, topSellers, recentOrders } =
    data;

  const pieData = Object.keys(listingStatus || {}).map((k) => ({
    name: k,
    value: listingStatus[k],
  }));

  const columns = [
    {
      title: "Listing",
      dataIndex: "listing",
      key: "listing",
      render: (listing: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar src={listing?.images?.[0] || undefined} />
          <div>
            <div style={{ fontWeight: 600 }}>{listing?.title}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {listing?._id?.slice?.(0, 8)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      key: "buyer",
      render: (buyer: any) => <div>{buyer?.name || buyer?.email}</div>,
    },
    {
      title: "Seller",
      dataIndex: "seller",
      key: "seller",
      render: (seller: any) => <div>{seller?.name}</div>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (p: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          maximumFractionDigits: 0,
        }).format(p),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: string) => {
        let color = "default";
        if (s === "completed") color = "green";
        if (s === "pending") color = "orange";
        if (s === "cancelled") color = "red";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => new Date(d).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="Người dùng" value={totals.users} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Listings" value={totals.listings} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Đơn hàng" value={totals.orders} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Đánh giá" value={totals.reviews} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="Doanh thu (7 ngày gần nhất)" style={{ height: 360 }}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueByDay}>
                <XAxis dataKey="date" />
                <YAxis
                  tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                />
                <Tooltip
                  formatter={(value: number) =>
                    new Intl.NumberFormat("vi-VN").format(value)
                  }
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4caf50"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Trạng thái Listings" style={{ height: 360 }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={pieData}
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 8 }}>
              {pieData.map((p: any, i: number) => (
                <div
                  key={p.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 6,
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        background: COLORS[i % COLORS.length],
                        borderRadius: 3,
                      }}
                    />
                    <div style={{ textTransform: "capitalize" }}>{p.name}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{p.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 16 }} gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top sellers">
            {topSellers.map((s: any) => (
              <div
                key={s.sellerId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.email}</div>
                </div>
                <div style={{ fontWeight: 700 }}>{s.listings}</div>
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Đơn hàng gần đây">
            <Table
              dataSource={recentOrders}
              columns={columns}
              rowKey={(r: any) => r._id}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
