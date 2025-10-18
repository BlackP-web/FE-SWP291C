"use client";

import { ReactNode, useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import {
  FiUsers,
  FiFileText,
  FiShoppingCart,
  FiDollarSign,
  FiSettings,
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
    { key: "/admin", icon: <FiFileText />, label: "Dashboard", path: "/admin" },
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
      key: "/admin/orders",
      icon: <FiShoppingCart />,
      label: "Quản lý giao dịch",
      path: "/admin/orders",
    },
    {
      key: "/admin/finance",
      icon: <FiDollarSign />,
      label: "Quản lý phí & hoa hồng",
      path: "/admin/finance",
    },
    {
      key: "/admin/settings",
      icon: <FiSettings />,
      label: "Cài đặt & báo cáo",
      path: "/admin/settings",
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
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="text-white text-xl font-bold p-4">
          {collapsed ? "ADM" : "Admin Panel"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => handleMenuClick(item.path),
          }))}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Dropdown menu={userMenu} placement="bottomRight">
            <div className="flex items-center cursor-pointer gap-2">
              <Avatar size="small" src={user?.avatar} />
              <span>{user?.name || "Admin"}</span>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: "16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
