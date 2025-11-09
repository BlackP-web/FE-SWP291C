"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ShoppingCart, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Dropdown, Avatar } from "antd";
// import AuthModal from './AuthModal'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Xe điện", href: "/vehicles" },
    { name: "Pin xe điện", href: "/batteries" },
    { name: "Tin tức", href: "/news" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? "bg-tesla-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-100"
            : "bg-tesla-white/95 backdrop-blur-md shadow-lg"
        }`}
      >
        <div className="container-tesla">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-tesla-black rounded-sm flex items-center justify-center">
                <span className="text-tesla-white font-bold text-lg">E</span>
              </div>
              <span
                className={`text-xl font-light transition-colors duration-300 ${
                  isScrolled
                    ? "text-tesla-black"
                    : "text-tesla-black"
                }`}
              >
                EV Trading
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ y: -2 }}
                  className={`transition-colors duration-300 font-medium ${
                    isScrolled
                      ? "text-tesla-black hover:text-tesla-dark-gray"
                      : "text-tesla-black hover:text-tesla-dark-gray"
                  }`}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 transition-colors duration-300 ${
                  isScrolled
                    ? "text-tesla-black hover:text-tesla-dark-gray"
                    : "text-tesla-black hover:text-tesla-dark-gray"
                }`}
                onClick={() => router.push("/favorites")}
              >
                <Heart className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 transition-colors duration-300 ${
                  isScrolled
                    ? "text-tesla-black hover:text-tesla-dark-gray"
                    : "text-tesla-black hover:text-tesla-dark-gray"
                }`}
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.button>

              {isAuthenticated ? (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "profile",
                        label: "Thông tin cá nhân",
                        onClick: () => router.push("/profile"),
                      },
                      {
                        key: "buyer-orders",
                        label: "Theo dõi đơn hàng",
                        onClick: () => router.push("/buyer-orders"),
                      },
                      {
                        key: "logout",
                        label: "Đăng xuất",
                        danger: true,
                        onClick: logout,
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Avatar size="small" src={user?.avatar} />
                    <span
                      className={
                        isScrolled ? "text-tesla-black" : "text-tesla-white"
                      }
                    >
                      {user?.name || "User"}
                    </span>
                  </motion.div>
                </Dropdown>
              ) : (
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    y: -2,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/login")}
                  className="bg-tesla-black text-tesla-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Đăng nhập
                </motion.button>
              )}
            </div>
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 transition-colors duration-300 ${
        isScrolled
          ? "text-tesla-black"
          : "text-tesla-black"
        }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-tesla-white border-t border-gray-100"
            >
              <div className="container-tesla py-4">
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      whileHover={{ x: 5 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-tesla-black hover:text-tesla-dark-gray transition-colors duration-300 font-medium py-2"
                    >
                      {item.name}
                    </motion.a>
                  ))}
                  <div className="pt-4 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/login");
                      }}
                      className="w-full bg-gradient-to-r from-tesla-black to-tesla-dark-gray text-tesla-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Đăng nhập
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Auth Modal removed: now navigating to /login */}
    </>
  );
};

export default Navbar;
