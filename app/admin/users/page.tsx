"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
} from "antd";
import {
  EditOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { UserService } from "@/service/user.service";
import { AuthService } from "@/service/auth.service";
import AdminLayout from "../AdminLayout";

const { Option } = Select;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();

  const currentUserRole = "admin"; // mock tạm, có thể lấy từ auth context

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (err) {
      message.error("Không thể tải danh sách người dùng");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  const openAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await UserService.update(editingUser._id, values);
        message.success("Cập nhật người dùng thành công");
      } else {
        await AuthService.register(values);
        message.success("Thêm người dùng thành công");
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handleBanToggle = async (id: string, blocked: boolean) => {
    try {
      await UserService.banToggle(id, {});
      message.success(blocked ? "Đã bỏ chặn" : "Đã chặn người dùng");
      loadUsers();
    } catch {
      message.error("Thao tác thất bại");
    }
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const color =
          role === "admin" ? "red" : role === "owner" ? "blue" : "green";

        const displayText =
          role === "admin"
            ? "Quản trị viên"
            : role === "owner"
            ? "Người bán"
            : "Người mua";

        return <Tag color={color}>{displayText}</Tag>;
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "blocked",
      key: "blocked",
      render: (blocked: boolean) => (
        <Tag color={blocked ? "red" : "green"}>
          {blocked ? "Bị chặn" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          {record.role !== "admin" && (
            <Button
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          )}
          {record.role !== "admin" && (
            <Popconfirm
              title={
                record.blocked ? "Mở chặn người dùng?" : "Chặn người dùng?"
              }
              onConfirm={() => handleBanToggle(record._id, record.blocked)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                icon={
                  record.blocked ? <CheckCircleOutlined /> : <StopOutlined />
                }
                danger={!record.blocked}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 bg-white rounded shadow">
        <div className="flex justify-between mb-4">
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Thêm mới
          </Button>
        </div>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Quản lý người dùng</h2>
          <Space>
            <Select
              placeholder="Lọc theo vai trò"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setRoleFilter(value)}
            >
              <Option value="admin">Quản trị viên</Option>
              <Option value="owner">Người bán</Option>
              <Option value="seeker">Người mua</Option>
            </Select>

            <Input.Search
              placeholder="Tìm theo tên hoặc email"
              allowClear
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 250 }}
            />
          </Space>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
        />

        <Modal
          title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSave}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input disabled={!!editingUser} />
            </Form.Item>

            {!editingUser && (
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
            )}

            <Form.Item name="phone" label="Số điện thoại">
              <Input />
            </Form.Item>

            <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
              <Select disabled={editingUser?.role === "admin"}>
                <Option value="admin">Admin</Option>
                <Option value="owner">Owner</Option>
                <Option value="seeker">Seeker</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
