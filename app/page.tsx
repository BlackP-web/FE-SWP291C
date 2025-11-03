'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import StatsSection from '@/components/StatsSection'
import { Car, Battery, Shield, Zap, ArrowRight, Play } from 'lucide-react'

// Tesla Model Card Component with Auto Color Detection
const TeslaModelCard = ({ model, index }: { model: any, index: number }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isDarkImage, setIsDarkImage] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Function to detect if image is dark or light
  const detectImageBrightness = (imageUrl: string) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return
      
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      let brightness = 0
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        brightness += (r + g + b) / 3
      }
      
      brightness = brightness / (data.length / 4)
      setIsDarkImage(brightness < 128) // Threshold for dark/light
    }
    
    img.onerror = () => {
      setImageError(true)
      setIsDarkImage(false) // Default to light theme on error
    }
    
    img.src = imageUrl
  }

  useEffect(() => {
    if (model.image) {
      detectImageBrightness(model.image)
    }
  }, [model.image])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <motion.div
        whileHover={{ y: -12, scale: 1.02 }}
        className="bg-tesla-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100"
      >
        {/* Image Container */}
        <div className="relative h-96 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {/* Loading Skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          )}
          
          {/* Error Fallback */}
          {imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-tesla-black to-tesla-dark-gray flex items-center justify-center">
              <div className="text-center text-tesla-white">
                <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-light">Tesla {model.name}</p>
              </div>
            </div>
          )}
          
          {/* Main Image */}
          {!imageError && (
            <Image
              src={model.image}
              alt={model.name}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          
          {/* Dynamic Overlay based on image brightness */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            isDarkImage 
              ? 'bg-gradient-to-t from-black/60 via-black/20 to-transparent' 
              : 'bg-gradient-to-t from-white/80 via-white/20 to-transparent'
          }`} />
          
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out" />
          
          {/* Content Overlay */}
          <div className={`absolute inset-0 p-8 flex flex-col justify-end ${
            isDarkImage ? 'text-tesla-white' : 'text-tesla-black'
          }`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-4xl font-light mb-2 drop-shadow-lg">
                {model.name}
              </h3>
              <p className={`text-xl font-medium mb-2 drop-shadow-lg ${
                isDarkImage ? 'text-tesla-white/90' : 'text-tesla-dark-gray'
              }`}>
                {model.subtitle}
              </p>
              <p className={`text-lg mb-6 drop-shadow-lg ${
                isDarkImage ? 'text-tesla-white/90' : 'text-gray-700'
              }`}>
                {model.description}
              </p>
            </motion.div>
          </div>
          
          {/* Floating Action Buttons */}
          <div className="absolute top-6 right-6 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <motion.button
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              whileHover={{ 
                scale: 1.15,
                boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                y: -3
              }}
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl ${
                isDarkImage 
                  ? 'bg-white/20 text-tesla-white hover:bg-white/30' 
                  : 'bg-black/20 text-tesla-black hover:bg-black/30'
              }`}
            >
              <Play className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {model.specs.map((spec: string, specIndex: number) => (
              <motion.div
                key={specIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + specIndex * 0.1 }}
                className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
              >
                <div className="text-lg font-medium text-tesla-black">
                  {spec}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8 p-6 bg-gradient-to-r from-tesla-black to-tesla-dark-gray text-tesla-white rounded-xl"
          >
            <div className="text-3xl font-light mb-2">
              {model.price}
            </div>
            <div className="text-tesla-white/90 text-sm">
              Giá xe mới từ Tesla
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex space-x-4"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-tesla-black to-tesla-dark-gray text-tesla-white px-6 py-4 rounded-full font-medium transition-all duration-500 shadow-xl hover:shadow-2xl relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>Tìm hiểu thêm</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 border-2 border-tesla-black text-tesla-black px-6 py-4 rounded-full font-medium transition-all duration-500 shadow-lg hover:shadow-xl hover:bg-tesla-black hover:text-tesla-white"
            >
              Xem xe đã qua sử dụng
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  // Tesla Models Showcase Data
  const teslaModels = [
    {
      id: 'model-s',
      name: 'Model S',
      subtitle: 'Plaid',
      description: 'Sedan điện cao cấp với hiệu suất vượt trội',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Hero-Desktop-US.png',
      price: 'Từ 2.5 tỷ VNĐ',
      specs: ['1,020 hp', '637 km', '2.1s 0-100']
    },
    {
      id: 'model-3',
      name: 'Model 3',
      subtitle: 'Performance',
      description: 'Sedan điện phổ biến nhất thế giới',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promo-Model-3-Desktop-US-July.png',
      price: 'Từ 1.2 tỷ VNĐ',
      specs: ['450 hp', '567 km', '3.1s 0-100']
    },
    {
      id: 'model-x',
      name: 'Model X',
      subtitle: 'Plaid',
      description: 'SUV điện với cửa cánh bướm độc đáo',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-X-Hero-Desktop-US.png',
      price: 'Từ 3.2 tỷ VNĐ',
      specs: ['1,020 hp', '576 km', '2.6s 0-100']
    },
    {
      id: 'model-y',
      name: 'Model Y',
      subtitle: 'Long Range',
      description: 'SUV điện compact với không gian rộng rãi',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Card-Model-Y-Desktop-US.png',
      price: 'Từ 1.8 tỷ VNĐ',
      specs: ['533 hp', '565 km', '3.7s 0-100']
    }
  ]

  // Sample data for featured products
  const featuredVehicles = [
    {
      id: '1',
      title: 'Xe điện Model S Plaid',
      brand: 'Xe điện',
      model: 'Model S',
      year: 2022,
      mileage: 15000,
      price: 1200000000,
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-New-Charge-Desktop-NA.png',
      batteryHealth: 95,
      condition: 'excellent' as const,
      type: 'vehicle' as const,
      isVerified: 'approved'
    },
    {
      id: '2',
      title: 'Xe điện Model 3 Performance',
      brand: 'Xe điện',
      model: 'Model 3',
      year: 2021,
      mileage: 25000,
      price: 800000000,
      image: 'https://digitalassets.tesla.com/discovery-tesla-com/image/upload/f_auto,q_auto/TD_Component_M3_Desktop.jpg',
      batteryHealth: 88,
      condition: 'good' as const,
      type: 'vehicle' as const,
      isVerified: 'approved'
    },
    {
      id: '3',
      title: 'Xe điện Model Y Long Range',
      brand: 'Xe điện',
      model: 'Model Y',
      year: 2023,
      mileage: 8000,
      price: 1500000000,
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-2-Hero-Desktop.jpg',
      batteryHealth: 98,
      condition: 'excellent' as const,
      type: 'vehicle' as const,
      isVerified: 'approved'
    },
    {
      id: '4',
      title: 'Xe điện Model X Plaid',
      brand: 'Xe điện',
      model: 'Model X',
      year: 2022,
      mileage: 12000,
      price: 1800000000,
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-X-New-Interior-Desktop-NA.jpg',
      batteryHealth: 92,
      condition: 'excellent' as const,
      type: 'vehicle' as const,
      isVerified: 'approved'
    }
  ]

  const features = [
    {
      icon: Car,
      title: 'Xe điện đã qua sử dụng',
      description: 'Chúng tôi cung cấp các dòng xe điện Tesla đã qua sử dụng với chất lượng tốt nhất.'
    },
    {
      icon: Battery,
      title: 'Pin xe điện',
      description: 'Bán và mua pin xe điện với công nghệ tiên tiến và hiệu suất cao.'
    },
    {
      icon: Shield,
      title: 'Kiểm định chất lượng',
      description: 'Tất cả sản phẩm đều được kiểm định kỹ lưỡng trước khi bán.'
    },
    {
      icon: Zap,
      title: 'Giao dịch nhanh chóng',
      description: 'Quy trình mua bán đơn giản, thanh toán an toàn và giao hàng nhanh chóng.'
    }
  ]

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background gradients - ALWAYS VISIBLE */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
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
            ease: "linear"
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
            ease: "linear"
          }}
          className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [50, -50, 50],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-gradient-to-br from-orange-400 to-red-400 rounded-full blur-3xl opacity-30"
        />
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, ${
                ['rgb(59, 130, 246)', 'rgb(139, 92, 246)', 'rgb(236, 72, 153)', 'rgb(34, 197, 94)'][Math.floor(Math.random() * 4)]
              }, transparent)`
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
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/60" />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <Hero />
      
        {/* Stats Section */}
        <StatsSection />
      
        {/* Tesla Models Showcase */}
        <section className="py-20 bg-white/50 backdrop-blur-sm relative overflow-hidden">
        {/* Animated background decorations */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full blur-3xl opacity-20"
        />
        
        <div className="container-tesla relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Dòng xe điện
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Khám phá dòng xe điện
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá toàn bộ dòng xe điện với công nghệ tiên tiến nhất và hiệu suất vượt trội
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teslaModels.map((model, index) => (
              <TeslaModelCard key={model.id} model={model} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white relative overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"
        />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container-tesla relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Ưu điểm vượt trội
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với dịch vụ tốt nhất
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -15, scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl">
                  {/* Icon with gradient */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-blue-500/50"
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-center">
                    {feature.description}
                  </p>

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 bg-white/40 backdrop-blur-sm relative overflow-hidden">
        {/* Animated background decorations */}
        <motion.div
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-gradient-to-br from-green-300 to-emerald-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [100, -100, 100],
            y: [50, -50, 50],
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-300 to-pink-400 rounded-full blur-3xl"
        />
        
        <div className="container-tesla relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Xe nổi bật
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Xe điện nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Khám phá những chiếc xe điện đã qua sử dụng với chất lượng tốt nhất 
              và giá cả hợp lý nhất thị trường.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Xem tất cả xe điện
                <ArrowRight className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredVehicles.map((vehicle, index) => (
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-black via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [-50, 50, -50],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [50, -50, 50],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
          }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"
        />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating elements with colorful gradients */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                background: `linear-gradient(135deg, ${
                  ['rgb(59, 130, 246)', 'rgb(139, 92, 246)', 'rgb(236, 72, 153)', 'rgb(34, 197, 94)', 'rgb(251, 146, 60)'][Math.floor(Math.random() * 5)]
                }, transparent)`
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container-tesla relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <span className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Tham gia ngay
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Sẵn sàng tìm xe điện<br />của bạn?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Tham gia cộng đồng người dùng xe điện lớn nhất Việt Nam và tìm kiếm chiếc xe phù hợp với bạn.
            </p>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {[
                { icon: Shield, text: '100% được kiểm định' },
                { icon: Zap, text: 'Giao dịch nhanh chóng' },
                { icon: Battery, text: 'Pin chất lượng cao' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 flex items-center gap-4"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-lg font-semibold">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>Bắt đầu tìm kiếm</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 border-2 border-white/80 text-white rounded-full font-bold text-lg backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-6 h-6" />
                <span>Xem hướng dẫn</span>
              </motion.button>
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Bảo mật tuyệt đối</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>Hỗ trợ 24/7</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
      </div>
    </main>
  )
}
