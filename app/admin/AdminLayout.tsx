"use client";

import { ReactNode, useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import {
  FiUsers,
  FiFileText,
  FiShoppingCart,
  FiDollarSign,
  FiSettings,
  FiHome,
  FiPackage,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<string>("/admin");

  const menuItems = [
    {
      key: "/admin",
      icon: <FiFileText />,
      label: "Dashboard",
      path: "/admin",
    },
    {
      key: "/admin/users",
      icon: <FiUsers />,
      label: "Quản lý người dùng",
      path: "/admin/users",
    },
    {
      key: "/admin/listings",
      icon: <FiFileText />,
      label: "Quản lý bài đăng",
      path: "/admin/listings",
    },
    {
      key: "/admin/brands",
      icon: <FiPackage />,
      label: "Quản lý nhãn hiệu",
      path: "/admin/brands",
    },
    {
      key: "/admin/orders",
      icon: <FiShoppingCart />,
      label: "Quản lý giao dịch",
      path: "/admin/orders",
    },
    {
      key: "/admin/package",
      icon: <FiDollarSign />,
      label: "Quản lý gói",
      path: "/admin/packge",
    },
    {
      key: "/admin/settings",
      icon: <FiSettings />,
      label: "Cài đặt & báo cáo",
      path: "/admin/settings",
    },
    {
      key: "/",
      icon: <FiHome />,
      label: "Trang chủ",
      path: "/",
    },
  ];

  // Cập nhật menu active dựa vào pathname
  useEffect(() => {
    if (!pathname) return;
    const matchedItem = menuItems
      .slice()
      .sort((a, b) => b.key.length - a.key.length)
      .find((item) => pathname.startsWith(item.key));
    if (matchedItem) setSelectedKey(matchedItem.key);
  }, [pathname]);

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Thông tin cá nhân",
        onClick: () => router.push("/profile"),
      },
      {
        key: "logout",
        label: "Đăng xuất",
        danger: true,
        onClick: () => {
          logout?.();
          router.push("/");
        },
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          boxShadow: "2px 0 8px rgba(0,0,0,0.08)",
        }}
        theme="light"
      >
        <div
          style={{
            padding: collapsed ? "16px 12px" : "20px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <div style={{ fontSize: collapsed ? 18 : 22, fontWeight: 700 }}>
            {collapsed ? "AP" : "Admin Panel"}
          </div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => handleMenuClick(item.path),
            style: {
              borderRadius: 8,
              margin: "4px 8px",
            },
          }))}
          style={{ border: "none", padding: "8px 0" }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 600, color: "#1e293b" }}>
            Welcome back, {user?.name || "Admin"}!
          </div>
          <Dropdown menu={userMenu} placement="bottomRight">
            <div
              className="flex items-center cursor-pointer gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              style={{ border: "1px solid #f0f0f0" }}
            >
              <Avatar
                size={36}
                src={user?.avatar}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </Avatar>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>
                  {user?.name || "Admin"}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {user?.role || "Administrator"}
                </div>
              </div>
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: "0",
            background: "#f8fafc",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
