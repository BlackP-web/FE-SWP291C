"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Phone } from "lucide-react";
import Link from "next/link";
import { AuthService } from "@/service/auth.service";
import { message } from "antd";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const res = await AuthService.login({
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "owner") {
        router.push("/owner");
      } else if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      message.success("Đăng nhập thành công!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (err?.code === "ECONNABORTED"
          ? "Máy chủ không phản hồi, thử lại sau."
          : "Đăng nhập thất bại. Vui lòng kiểm tra thông tin.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-2xl p-6">
        <h1 className="text-2xl font-light text-tesla-black mb-6 text-center">
          Đăng nhập
        </h1>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-tesla-black to-tesla-dark-gray text-tesla-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
              }
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                Đăng nhập với Google
              </span>
            </button>

            <button
              onClick={() =>
                (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`)
              }
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-gray-700 font-medium">
                Đăng nhập với Facebook
              </span>
            </button>

            <button
              onClick={() => router.push("/login/phone")}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-5 h-5 mr-3 text-gray-600" />
              <span className="text-gray-700 font-medium">
                Đăng nhập bằng SĐT
              </span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-tesla-black hover:text-tesla-dark-gray font-medium"
            >
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
