"use client";

import { ReactNode, useState, useEffect } from "react";
import { Layout, Avatar, Dropdown } from "antd";
import {
  FiFileText,
  FiShoppingCart,
  FiDollarSign,
  FiLayers,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;

interface OwnerLayoutProps {
  children: ReactNode;
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<string>("/owner");
  const menuItems = [
    {
      key: "/owner",
      icon: <FiFileText />,
      label: "Bảng điều khiển",
      path: "/owner",
    },
    {
      key: "/owner/posts",
      icon: <FiFileText />,
      label: "Quản lý bài đăng",
      path: "/owner/posts",
    },
    {
      key: "/owner/orders",
      icon: <FiShoppingCart />,
      label: "Quản lý đơn hàng",
      path: "/owner/orders",
    },
    {
      key: "/owner/my-package",
      icon: <FiDollarSign />,
      label: "Gói của bạn",
      path: "/owner/my-package",
    },
    {
      key: "/owner/package",
      icon: <FiLayers />,
      label: "Các gói dịch vụ",
      path: "/owner/package",
    },
  ];

  // Cập nhật selectedKey dựa vào pathname
  useEffect(() => {
    if (!pathname) return;

    // Tìm menuItem có key mà pathname bắt đầu với nó
    const matchedItem = menuItems
      .slice() // clone
      .sort((a, b) => b.key.length - a.key.length) // ưu tiên key dài nhất
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
          {collapsed ? "EV" : "EV Market Owner"}
        </div>
        {/* Custom nav to allow monochrome styling and remove 'Trang chủ' */}
        <nav className="p-2">
          {menuItems.map((item) => {
            const active = selectedKey === item.key;
            return (
              <div
                key={item.key}
                onClick={() => handleMenuClick(item.path)}
                className={`flex items-center gap-3 px-3 py-2 mb-1 rounded-md cursor-pointer transition-colors duration-150 ${
                  active
                    ? "bg-gray-800 text-white"
                    : "text-gray-200 hover:bg-gray-700 hover:text-white"
                }`}
                title={item.label}
                style={{ justifyContent: collapsed ? "center" : "flex-start" }}
              >
                <div className="text-lg">{item.icon}</div>
                {!collapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
              </div>
            );
          })}
        </nav>
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
              <span>{user?.name || "User"}</span>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: "16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
