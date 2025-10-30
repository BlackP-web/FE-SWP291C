"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Form, Input, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UserService } from "@/service/user.service";
import { UploadService } from "@/service/upload.service";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      setLoadingData(true);
      try {
        const data = await UserService.getById(user._id);
        setUserData(data);
        form.setFieldsValue({
          name: data.name,
          email: data.email,
          phone: data.phone,
          avatar: data.avatar,
        });
      } catch (err) {
        console.error("Lỗi khi fetch user:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUser();
  }, [user]);

  const handleFinish = async (values: any) => {
    if (!user) return;

    setUpdating(true);
    try {
      const payload = {
        name: values.name,
        phone: values.phone,
        avatar: values.avatar,
      };
      await UserService.update(user._id, payload);
      message.success("Cập nhật thông tin thành công!");
      setUserData({ ...userData, ...payload });
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || loadingData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <span>Đang tải...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-gray-200">
                <img
                  src={form.getFieldValue("avatar") || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0">
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={async (file: any) => {
                    try {
                      const res = await UploadService.uploadSingleImage(file);
                      if (res.url) {
                        form.setFieldsValue({ avatar: res.url });
                        message.success("Upload ảnh thành công!");
                      }
                    } catch (err) {
                      console.error(err);
                      message.error("Upload thất bại!");
                    }
                    return false;
                  }}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="small"
                    className="mt-2"
                  >
                    Đổi ảnh
                  </Button>
                </Upload>
              </div>
            </div>

            {/* Info Form */}
            <div className="flex-1 w-full">
              <h1 className="text-2xl font-bold mb-6 text-gray-900">
                Thông tin cá nhân
              </h1>

              <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                  label="Họ và tên"
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                  <Input placeholder="Nhập tên" size="large" />
                </Form.Item>

                <Form.Item label="Email" name="email">
                  <Input disabled size="large" />
                </Form.Item>

                <Form.Item label="Số điện thoại" name="phone">
                  <Input placeholder="Nhập số điện thoại" size="large" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={updating}
                    size="large"
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    Cập nhật thông tin
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
