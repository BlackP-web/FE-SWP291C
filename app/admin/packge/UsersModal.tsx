"use client";

import React, { useEffect, useState } from "react";
import { X, User } from "lucide-react";
import { PackageService } from "@/service/package.service";

export default function UsersModal({ pkg, onClose }: any) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await PackageService.getUsersByPackage(pkg._id);
      setUsers(res.data || []);
    };
    fetchUsers();
  }, [pkg]);

  const renderStatus = (status: string) => {
    const map: Record<string, { color: string; text: string }> = {
      cancelled: { color: "red", text: "Đã hủy" },
      active: { color: "green", text: "Đang hoạt động" },
      pending: { color: "orange", text: "Chờ xử lý" },
    };
    const item = map[status] || { color: "default", text: status };
    return (
      <span
        className={`inline-block px-2 py-1 rounded text-white text-xs`}
        style={{ backgroundColor: item.color }}
      >
        {item.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Người dùng đã mua: <span className="text-blue-600">{pkg.name}</span>
        </h2>

        {users.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có ai mua gói này.</p>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-3">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between gap-3 border p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">{u.user.name}</p>
                    <p className="text-gray-600 text-sm">{u.user.email}</p>
                  </div>
                </div>
                <div>{renderStatus(u.status)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
