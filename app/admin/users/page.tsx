"use client";
import React, { useState } from "react";
import { Table, Tag, Select, Button, message } from "antd";
import AdminLayout from "../AdminLayout";

interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

const mockUsers: User[] = [
  { id: 1, name: "Super Admin", email: "admin1@gmail.com", role: "ADMIN" },
  { id: 2, name: "John Doe", email: "user1@gmail.com", role: "USER" },
  { id: 3, name: "Jane Doe", email: "user2@gmail.com", role: "USER" },
  { id: 4, name: "Another Admin", email: "admin2@gmail.com", role: "ADMIN" },
];

const currentUserId = 1; // Ví dụ: Admin đang đăng nhập có id = 1

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedRoles, setSelectedRoles] = useState<{
    [key: number]: "ADMIN" | "USER";
  }>({});

  const updateUserRole = async (userId: number, newRole: "ADMIN" | "USER") => {
    // TODO: Gọi API thật ở đây
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    message.success("Updated role successfully!");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role: string) => (
        <Tag color={role === "ADMIN" ? "red" : "green"}>{role}</Tag>
      ),
    },
    {
      title: "Change Role",
      render: (_: any, record: User) => {
        const isOtherAdmin =
          record.role === "ADMIN" && record.id !== currentUserId;

        return (
          <Select
            disabled={isOtherAdmin}
            value={selectedRoles[record.id] || record.role}
            onChange={(value: "ADMIN" | "USER") =>
              setSelectedRoles((prev) => ({ ...prev, [record.id]: value }))
            }
          >
            <Select.Option value="ADMIN">ADMIN</Select.Option>
            <Select.Option value="USER">USER</Select.Option>
          </Select>
        );
      },
    },
    {
      title: "Confirm",
      render: (_: any, record: User) => {
        const isOtherAdmin =
          record.role === "ADMIN" && record.id !== currentUserId;

        return (
          <Button
            type="primary"
            disabled={isOtherAdmin || selectedRoles[record.id] === record.role}
            onClick={() =>
              updateUserRole(record.id, selectedRoles[record.id] || record.role)
            }
          >
            Confirm
          </Button>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <h2>Quản lý người dùng</h2>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          pagination={false}
        />
      </div>
    </AdminLayout>
  );
}
