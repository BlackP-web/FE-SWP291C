"use client";

import React, { useEffect, useState } from "react";
import { Badge, Dropdown, List, Spin, message } from "antd";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";
import { api } from "@/lib/api";

interface Notification {
  _id: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationBellProps {
  userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/notifications/${userId}`);
        setNotifications(res.data?.notifications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const socket = io("http://localhost:8080");
    socket.emit("joinRoom", userId);

    socket.on("notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
      message.error("Đánh dấu thông báo thất bại");
    }
  };

  const menu = (
    <div style={{ width: 300, maxHeight: 400, overflowY: "auto" }}>
      {loading ? (
        <Spin style={{ display: "block", margin: "20px auto" }} />
      ) : notifications.length === 0 ? (
        <p className="text-center p-4 text-gray-500">Chưa có thông báo</p>
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              onClick={() => {
                if (!item.isRead) handleMarkAsRead(item._id);
              }}
              style={{
                backgroundColor: item.isRead ? "#fff" : "#f0f8ff",
                padding: "10px 15px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              <List.Item.Meta
                title={<strong>{item.title}</strong>}
                description={item.content}
              />
              <span className="text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleTimeString()}
              </span>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <Badge count={unreadCount} size="small">
        <Bell className="w-6 h-6 cursor-pointer" />
      </Badge>
    </Dropdown>
  );
}
