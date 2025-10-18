"use client";

import { ReactNode, useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { FiFileText, FiShoppingCart, FiDollarSign } from "react-icons/fi";
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
    { key: "/owner", icon: <FiFileText />, label: "Dashboard", path: "/owner" },
    {
      key: "/owner/posts",
      icon: <FiFileText />,
      label: "Quản lý bài đăng",
      path: "/owner/posts",
    },
    {
      key: "/owner/orders",
      icon: <FiShoppingCart />,
      label: "Quản lý đơn thuê",
      path: "/owner/orders",
    },
    {
      key: "/owner/finance",
      icon: <FiDollarSign />,
      label: "Quản lý dòng tiền",
      path: "/owner/finance",
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
              <span>{user?.name || "User"}</span>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: "16px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
