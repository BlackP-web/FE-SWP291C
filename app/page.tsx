"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import StatsSection from '@/components/StatsSection'
import { Car, Battery, Shield, Zap, ArrowRight, Play } from 'lucide-react'

// Lightweight TeslaModelCard — simplified and neutralized
const TeslaModelCard = ({ model, index }: { model: any, index: number }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="bg-tesla-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="relative h-72 bg-tesla-gray-50">
          <Image
            src={model.image}
            alt={model.name}
            fill
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-tesla-black mb-1">{model.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{model.subtitle} • {model.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium text-tesla-black">{model.price}</div>
            <button className="text-sm px-3 py-2 bg-tesla-black text-tesla-white rounded-md">Xem chi tiết</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const teslaModels = [
    { id: 'model-s', name: 'Model S', subtitle: 'Plaid', description: 'Sedan điện cao cấp', image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Hero-Desktop-US.png', price: 'Từ 2.5 tỷ VNĐ' },
    { id: 'model-3', name: 'Model 3', subtitle: 'Performance', description: 'Sedan phổ biến', image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promo-Model-3-Desktop-US-July.png', price: 'Từ 1.2 tỷ VNĐ' },
    { id: 'model-x', name: 'Model X', subtitle: 'Plaid', description: 'SUV điện', image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-X-Hero-Desktop-US.png', price: 'Từ 3.2 tỷ VNĐ' },
    { id: 'model-y', name: 'Model Y', subtitle: 'Long Range', description: 'SUV compact', image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Card-Model-Y-Desktop-US.png', price: 'Từ 1.8 tỷ VNĐ' }
  ]

  const featuredVehicles = [
    { id: '1', title: 'Xe điện Model S Plaid', brand: 'Xe điện', model: 'Model S', year: 2022, mileage: 15000, price: 1200000000, image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-New-Charge-Desktop-NA.png', batteryHealth: 95, condition: 'excellent' as const, type: 'vehicle' as const, isVerified: 'approved' },
    { id: '2', title: 'Xe điện Model 3 Performance', brand: 'Xe điện', model: 'Model 3', year: 2021, mileage: 25000, price: 800000000, image: 'https://digitalassets.tesla.com/discovery-tesla-com/image/upload/f_auto,q_auto/TD_Component_M3_Desktop.jpg', batteryHealth: 88, condition: 'good' as const, type: 'vehicle' as const, isVerified: 'approved' },
    { id: '3', title: 'Xe điện Model Y Long Range', brand: 'Xe điện', model: 'Model Y', year: 2023, mileage: 8000, price: 1500000000, image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-2-Hero-Desktop.jpg', batteryHealth: 98, condition: 'excellent' as const, type: 'vehicle' as const, isVerified: 'approved' },
    { id: '4', title: 'Xe điện Model X Plaid', brand: 'Xe điện', model: 'Model X', year: 2022, mileage: 12000, price: 1800000000, image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-X-New-Interior-Desktop-NA.jpg', batteryHealth: 92, condition: 'excellent' as const, type: 'vehicle' as const, isVerified: 'approved' }
  ]

  const features = [
    { icon: Car, title: 'Xe điện đã qua sử dụng', description: 'Chúng tôi cung cấp các dòng xe điện đã qua sử dụng với chất lượng tốt nhất.' },
    { icon: Battery, title: 'Pin xe điện', description: 'Bán và mua pin xe điện với công nghệ tiên tiến và hiệu suất cao.' },
    { icon: Shield, title: 'Kiểm định chất lượng', description: 'Tất cả sản phẩm đều được kiểm định kỹ lưỡng trước khi bán.' },
    { icon: Zap, title: 'Giao dịch nhanh chóng', description: 'Quy trình mua bán đơn giản, thanh toán an toàn và giao hàng nhanh chóng.' }
  ]

  return (
    <main className="min-h-screen relative bg-tesla-white">
      {/* Background orbs (subtle, monochrome) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div className="absolute -left-40 -top-40 w-[520px] h-[520px] bg-tesla-gray-100 rounded-full blur-3xl opacity-30" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 12, repeat: Infinity }} />
        <motion.div className="absolute right-[-120px] top-20 w-[420px] h-[420px] bg-tesla-gray-100 rounded-full blur-3xl opacity-20" animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 16, repeat: Infinity }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />

        <StatsSection />

        {/* Models showcase */}
        <section className="py-16 container-tesla">
          <div className="text-center mb-10">
            <span className="inline-block bg-tesla-black text-tesla-white px-4 py-1 rounded-full text-sm font-semibold">Dòng xe điện</span>
            <h2 className="text-4xl md:text-5xl font-bold text-tesla-black mt-6">Khám phá dòng xe điện</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mt-4">Khám phá toàn bộ dòng xe điện với công nghệ tiên tiến nhất và hiệu suất vượt trội</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teslaModels.map((m, i) => <TeslaModelCard key={m.id} model={m} index={i} />)}
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-tesla-gray-50">
          <div className="container-tesla text-center mb-10">
            <span className="inline-block bg-tesla-black text-tesla-white px-4 py-1 rounded-full text-sm font-semibold">Ưu điểm vượt trội</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6">Tại sao chọn chúng tôi?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mt-4">Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với dịch vụ tốt nhất</p>
          </div>

          <div className="container-tesla grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-tesla-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-tesla-black" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured vehicles */}
        <section className="py-16 container-tesla">
          <div className="text-center mb-10">
            <span className="inline-block bg-tesla-black text-tesla-white px-4 py-1 rounded-full text-sm font-semibold">Xe nổi bật</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6">Xe điện nổi bật</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mt-4">Khám phá những chiếc xe điện đã qua sử dụng với chất lượng tốt nhất và giá cả hợp lý nhất thị trường.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((v, i) => (
              <ProductCard key={v.id} {...v} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-tesla-black text-white">
          <div className="container-tesla text-center">
            <span className="inline-block bg-tesla-black text-tesla-white px-4 py-1 rounded-full text-sm font-semibold">Tham gia ngay</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6">Sẵn sàng tìm xe điện của bạn?</h2>
            <p className="text-gray-300 max-w-3xl mx-auto mt-4 mb-8">Tham gia cộng đồng người dùng xe điện lớn nhất Việt Nam và tìm kiếm chiếc xe phù hợp với bạn.</p>
            <div className="flex items-center justify-center gap-4">
              <button className="bg-tesla-white text-tesla-black px-6 py-3 rounded-full font-semibold">Bắt đầu tìm kiếm</button>
              <button className="border border-white/30 px-6 py-3 rounded-full">Xem hướng dẫn</button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
