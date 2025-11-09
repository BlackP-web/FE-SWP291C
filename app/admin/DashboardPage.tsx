import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spin, Table, Avatar, Tag } from "antd";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { DashboardService } from "@/service/dashboard.service";
import {
  FiUsers,
  FiFileText,
  FiShoppingBag,
  FiStar,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

// Stat Card Component với gradient và icon
const StatCard = ({
  title,
  value,
  icon,
  color,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}) => {
  return (
    <Card
      bordered={false}
      className="hover:shadow-lg transition-shadow duration-300"
      style={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#1e293b" }}>
            {value.toLocaleString()}
          </div>
          {trend !== undefined && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 8,
                fontSize: 13,
                color: trend >= 0 ? "#10b981" : "#ef4444",
              }}
            >
              {trend >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              <span>{Math.abs(trend)}% vs yesterday</span>
            </div>
          )}
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 24,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

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
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Spin size="large" tip="Đang tải dashboard..." />
      </div>
    );

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
          <Avatar
            src={listing?.images?.[0] || undefined}
            size={40}
            style={{ borderRadius: 8 }}
          />
          <div>
            <div style={{ fontWeight: 600, color: "#1e293b" }}>
              {listing?.title}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
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
      render: (buyer: any) => (
        <div style={{ color: "#475569" }}>{buyer?.name || buyer?.email}</div>
      ),
    },
    {
      title: "Seller",
      dataIndex: "seller",
      key: "seller",
      render: (seller: any) => (
        <div style={{ color: "#475569" }}>{seller?.name}</div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (p: number) => (
        <span style={{ fontWeight: 600, color: "#10b981" }}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          }).format(p)}
        </span>
      ),
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
      render: (d: string) => (
        <span style={{ color: "#64748b", fontSize: 13 }}>
          {new Date(d).toLocaleString("vi-VN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>
          Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Người dùng"
            value={totals.users}
            icon={<FiUsers />}
            color="#3b82f6"
            trend={11}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Listings"
            value={totals.listings}
            icon={<FiFileText />}
            color="#10b981"
            trend={-5}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Đơn hàng"
            value={totals.orders}
            icon={<FiShoppingBag />}
            color="#f59e0b"
            trend={8}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Đánh giá"
            value={totals.reviews}
            icon={<FiStar />}
            color="#8b5cf6"
            trend={3}
          />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            title={
              <span style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
                Doanh thu (7 ngày gần nhất)
              </span>
            }
            style={{ height: 420, borderRadius: 12 }}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={revenueByDay}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  style={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                  stroke="#94a3b8"
                  style={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) =>
                    new Intl.NumberFormat("vi-VN").format(value) + " ₫"
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            title={
              <span style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
                Trạng thái Listings
              </span>
            }
            style={{ height: 420, borderRadius: 12 }}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 20 }}>
              {pieData.map((p: any, i: number) => (
                <div
                  key={p.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom:
                      i < pieData.length - 1 ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        background: COLORS[i % COLORS.length],
                        borderRadius: 4,
                      }}
                    />
                    <div style={{ textTransform: "capitalize", color: "#475569" }}>
                      {p.name}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>
                    {p.value}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row style={{ marginTop: 24 }} gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            title={
              <span style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
                Top sellers
              </span>
            }
            style={{ borderRadius: 12, minHeight: 400 }}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            {topSellers.map((s: any, idx: number) => (
              <div
                key={s.sellerId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom:
                    idx < topSellers.length - 1 ? "1px solid #f1f5f9" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background:
                        idx === 0
                          ? "#fbbf24"
                          : idx === 1
                          ? "#94a3b8"
                          : "#cd7f32",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1e293b" }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      {s.email}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#10b981",
                  }}
                >
                  {s.listings}
                </div>
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            title={
              <span style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
                Đơn hàng gần đây
              </span>
            }
            style={{ borderRadius: 12, minHeight: 400 }}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <Table
              dataSource={recentOrders}
              columns={columns}
              rowKey={(r: any) => r._id}
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
