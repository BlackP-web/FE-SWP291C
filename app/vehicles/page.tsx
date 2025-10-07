'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import SearchFilter from '@/components/SearchFilter'
import Footer from '@/components/Footer'

export default function VehiclesPage() {
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')

  // Sample data for vehicles
  const vehicles = [
    {
      id: '1',
      title: 'Tesla Model S Plaid',
      brand: 'Tesla',
      model: 'Model S',
      year: 2022,
      mileage: 15000,
      price: 1200000000,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      batteryHealth: 95,
      condition: 'excellent' as const,
      type: 'vehicle' as const,
      isVerified: true
    },
    {
      id: '2',
      title: 'Tesla Model 3 Performance',
      brand: 'Tesla',
      model: 'Model 3',
      year: 2021,
      mileage: 25000,
      price: 800000000,
      image: 'https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      batteryHealth: 88,
      condition: 'good' as const,
      type: 'vehicle' as const,
      isVerified: true
    },
    {
      id: '3',
      title: 'Tesla Model Y Long Range',
      brand: 'Tesla',
      model: 'Model Y',
      year: 2023,
      mileage: 8000,
      price: 1500000000,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      batteryHealth: 98,
      condition: 'excellent' as const,
      type: 'vehicle' as const,
      isVerified: true
    },
    {
      id: '4',
      title: 'Tesla Model X Plaid',
      brand: 'Tesla',
      model: 'Model X',
      year: 2022,
      mileage: 12000,
      price: 1800000000,
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
      batteryHealth: 92,
      condition: 'excellent' as const,
      type: 'vehicle' as const,
      isVerified: true
    },
    {
      id: '5',
      title: 'BMW iX xDrive50',
      brand: 'BMW',
      model: 'iX',
      year: 2023,
      mileage: 5000,
      price: 2200000000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      batteryHealth: 99,
      condition: 'excellent' as const,
      type: 'vehicle' as const,
      isVerified: true
    },
    {
      id: '6',
      title: 'Mercedes EQS 450+',
      brand: 'Mercedes',
      model: 'EQS',
      year: 2022,
      mileage: 18000,
      price: 2500000000,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      batteryHealth: 87,
      condition: 'good' as const,
      type: 'vehicle' as const,
      isVerified: true
    },
    {
      id: '7',
      title: 'Audi e-tron GT',
      brand: 'Audi',
      model: 'e-tron GT',
      year: 2023,
      mileage: 3000,
      price: 2800000000,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      batteryHealth: 96,
      condition: 'excellent' as const,
      type: 'vehicle' as const,
      isVerified: true
    },
    {
      id: '8',
      title: 'Porsche Taycan Turbo S',
      brand: 'Porsche',
      model: 'Taycan',
      year: 2022,
      mileage: 22000,
      price: 3200000000,
      image: 'https://images.unsplash.com/photo-1614200187522-cc61c72a2d19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      batteryHealth: 89,
      condition: 'good' as const,
      type: 'vehicle' as const,
      isVerified: true
    }
  ]

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
              Xe điện đã qua sử dụng
            </h1>
            <p className="text-tesla-body text-gray-600 max-w-3xl mx-auto">
              Khám phá bộ sưu tập xe điện đã qua sử dụng với chất lượng tốt nhất và giá cả hợp lý. 
              Tất cả xe đều được kiểm định kỹ lưỡng trước khi bán.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <SearchFilter />

      {/* Results Section */}
      <section className="py-12">
        <div className="container-tesla">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-light text-tesla-black">
                Tìm thấy {vehicles.length} xe điện
              </h2>
              <p className="text-gray-600 mt-1">
                Hiển thị kết quả theo thứ tự mới nhất
              </p>
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tesla-black/20 focus:border-tesla-black transition-all duration-300"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="mileage-low">Số km ít nhất</option>
                <option value="mileage-high">Số km nhiều nhất</option>
              </select>

              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-colors duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-tesla-black text-tesla-white'
                      : 'bg-tesla-white text-tesla-black hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-colors duration-300 ${
                    viewMode === 'list'
                      ? 'bg-tesla-black text-tesla-white'
                      : 'bg-tesla-white text-tesla-black hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className={`grid gap-8 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard {...vehicle} />
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-tesla-outline"
            >
              Xem thêm xe điện
            </motion.button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
