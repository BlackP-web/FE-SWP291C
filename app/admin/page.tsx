'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Users, Package, Shield, TrendingUp, Eye, Heart, CheckCircle, Star } from 'lucide-react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    activeProducts: 0,
    verifiedProducts: 0,
    featuredProducts: 0
  })

  const tabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: TrendingUp },
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'products', label: 'Sản phẩm', icon: Package },
    { id: 'settings', label: 'Cài đặt', icon: Shield }
  ]

  const sampleUsers = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'user@example.com',
      phone: '0987654321',
      role: 'user',
      isVerified: true,
      isActive: true,
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'user2@example.com',
      phone: '0123456789',
      role: 'user',
      isVerified: false,
      isActive: true,
      createdAt: '2024-01-10',
      lastLogin: '2024-01-18'
    }
  ]

  const sampleProducts = [
    {
      id: '1',
      title: 'Tesla Model S Plaid 2022',
      brand: 'Tesla',
      model: 'Model S',
      year: 2022,
      price: 1200000000,
      status: 'active',
      isVerified: true,
      isFeatured: true,
      seller: { name: 'Nguyễn Văn A' },
      createdAt: '2024-01-15',
      viewCount: 150,
      likeCount: 25
    },
    {
      id: '2',
      title: 'Tesla Model 3 Performance 2021',
      brand: 'Tesla',
      model: 'Model 3',
      year: 2021,
      price: 800000000,
      status: 'pending',
      isVerified: false,
      isFeatured: false,
      seller: { name: 'Trần Thị B' },
      createdAt: '2024-01-10',
      viewCount: 89,
      likeCount: 12
    }
  ]

  useEffect(() => {
    // Simulate API call
    setStats({
      totalUsers: 1250,
      totalProducts: 89,
      activeProducts: 76,
      verifiedProducts: 45,
      featuredProducts: 12
    })
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  return (
    <main className="min-h-screen bg-tesla-white">
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-tesla-light-gray to-tesla-white">
        <div className="container-tesla">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h1 className="text-tesla-title mb-6 text-tesla-black">
              Admin Dashboard
            </h1>
            <p className="text-tesla-body text-gray-600 max-w-3xl mx-auto">
              Quản lý hệ thống EV Trading Platform
            </p>
          </motion.div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-12">
        <div className="container-tesla">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-tesla-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-medium text-tesla-black mb-4">Menu</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ x: 5 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-tesla-black text-tesla-white'
                          : 'text-tesla-black hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Tổng người dùng</p>
                          <p className="text-3xl font-light">{stats.totalUsers}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-200" />
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Tổng sản phẩm</p>
                          <p className="text-3xl font-light">{stats.totalProducts}</p>
                        </div>
                        <Package className="w-8 h-8 text-green-200" />
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Đã xác minh</p>
                          <p className="text-3xl font-light">{stats.verifiedProducts}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-purple-200" />
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">Nổi bật</p>
                          <p className="text-3xl font-light">{stats.featuredProducts}</p>
                        </div>
                        <Star className="w-8 h-8 text-orange-200" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-tesla-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-medium text-tesla-black mb-6">Hoạt động gần đây</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-tesla-black">Sản phẩm mới được đăng</p>
                          <p className="text-sm text-gray-600">Tesla Model Y Long Range 2023</p>
                        </div>
                        <span className="text-sm text-gray-500">2 giờ trước</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-tesla-black">Người dùng mới đăng ký</p>
                          <p className="text-sm text-gray-600">Nguyễn Văn C</p>
                        </div>
                        <span className="text-sm text-gray-500">4 giờ trước</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-tesla-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-medium text-tesla-black mb-6">Quản lý người dùng</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-tesla-black">Tên</th>
                          <th className="text-left py-3 px-4 font-medium text-tesla-black">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-tesla-black">Trạng thái</th>
                          <th className="text-left py-3 px-4 font-medium text-tesla-black">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-tesla-black">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.phone}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-tesla-black">{user.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                {user.isActive ? 'Khóa' : 'Mở khóa'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-tesla-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-medium text-tesla-black mb-6">Quản lý sản phẩm</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-tesla-black">Sản phẩm</th>
                          <th className="text-left py-3 px-4 font-medium text-tesla-black">Giá</th>
                          <th className="text-left py-3 px-4 font-medium text-tesla-black">Trạng thái</th>
                          <th className="text-left py-3 px-4 font-medium text-tesla-black">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleProducts.map((product) => (
                          <tr key={product.id} className="border-b border-gray-100">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-tesla-black">{product.title}</p>
                                <p className="text-sm text-gray-600">{product.seller.name}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-tesla-black">{formatPrice(product.price)}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {product.status === 'active' ? 'Hoạt động' : 'Chờ duyệt'}
                                </span>
                                {product.isVerified && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Đã xác minh
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                  Xác minh
                                </button>
                                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                                  Nổi bật
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-tesla-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-medium text-tesla-black mb-6">Cài đặt hệ thống</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-tesla-black mb-2">
                        Tên website
                      </label>
                      <input
                        type="text"
                        defaultValue="EV Trading Platform"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tesla-black mb-2">
                        Email liên hệ
                      </label>
                      <input
                        type="email"
                        defaultValue="contact@evtrading.vn"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tesla-black mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        defaultValue="+84 123 456 789"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-tesla"
                    >
                      Lưu cài đặt
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
