"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Zap,
  Shield,
  ArrowRight,
  Car,
  Battery,
  Award,
  TrendingUp,
} from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated background gradients - Same as homepage */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-40"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-40"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [-50, 50, -50],
            y: [-50, 50, -50],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-3xl opacity-30"
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, ${
                [
                  "rgb(59, 130, 246)",
                  "rgb(139, 92, 246)",
                  "rgb(236, 72, 153)",
                  "rgb(34, 197, 94)",
                ][Math.floor(Math.random() * 4)]
              }, transparent)`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content Container with 2 columns */}
      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - EV Theme Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-block"
          >
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Nền tảng xe điện #1 Việt Nam
            </span>
          </motion.div>

          {/* Main Title */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Đăng nhập vào
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-blue-600 to-purple-600">
                EV Trading
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Mua bán xe điện dễ dàng, nhanh chóng và an toàn với công nghệ hiện
              đại nhất.
            </p>
          </div>

          {/* EV Features */}
          <div className="space-y-4">
            {[
              {
                icon: Car,
                text: "1,200+ Xe điện chất lượng",
                color: "from-blue-500 to-cyan-600",
                desc: "Đã qua kiểm định",
              },
              {
                icon: Battery,
                text: "Pin sức khỏe 98%+",
                color: "from-green-500 to-emerald-600",
                desc: "Đảm bảo chất lượng",
              },
              {
                icon: Shield,
                text: "100% Bảo mật giao dịch",
                color: "from-purple-500 to-pink-600",
                desc: "An toàn tuyệt đối",
              },
              {
                icon: TrendingUp,
                text: "5,000+ Khách hàng tin tưởng",
                color: "from-orange-500 to-red-600",
                desc: "Đánh giá 4.9/5 sao",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 10, scale: 1.05 }}
                className="flex items-start gap-4 bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-white/60 shadow-lg group cursor-pointer"
              >
                <div
                  className={`bg-gradient-to-br ${item.color} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-lg font-bold text-gray-800 block">
                    {item.text}
                  </span>
                  <span className="text-sm text-gray-600">{item.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-3 gap-4 pt-6"
          >
            {[
              { value: "1.2K+", label: "Xe điện" },
              { value: "5K+", label: "Người dùng" },
              { value: "4.9★", label: "Đánh giá" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-8 md:p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Zap className="w-8 h-8 text-green-500" />
                </motion.div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
                  Đăng nhập
                </h1>
              </div>
              <p className="text-gray-600 text-lg font-medium">
                Truy cập vào thế giới xe điện! ⚡🚗
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Mua bán xe điện an toàn, nhanh chóng
              </p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-600" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-600" />
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm font-medium"
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  {loading ? "Đang đăng nhập..." : "Đăng nhập ngay"}
                  {!loading && (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 backdrop-blur-sm text-gray-600 font-semibold rounded-full">
                    Hoặc
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => AuthService.googleLogin()}
                  className="w-full flex items-center justify-center px-4 py-4 border-2 border-gray-200 rounded-xl hover:bg-white hover:border-blue-300 transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-md hover:shadow-xl group"
                >
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
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
                  <span className="text-gray-700 font-bold group-hover:text-blue-600 transition-colors">
                    Đăng nhập với Google
                  </span>
                </motion.button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-base text-gray-700 mt-6"
              >
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 font-bold transition-all"
                >
                  Đăng ký ngay
                </Link>
              </motion.p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
