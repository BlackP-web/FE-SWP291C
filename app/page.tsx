'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
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
      title: 'Tesla Model S Plaid',
      brand: 'Tesla',
      model: 'Model S',
      year: 2022,
      mileage: 15000,
      price: 1200000000,
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-New-Charge-Desktop-NA.png',
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
      image: 'https://digitalassets.tesla.com/discovery-tesla-com/image/upload/f_auto,q_auto/TD_Component_M3_Desktop.jpg',
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
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-2-Hero-Desktop.jpg',
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
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-X-New-Interior-Desktop-NA.jpg',
      batteryHealth: 92,
      condition: 'excellent' as const,
      type: 'vehicle' as const,
      isVerified: true
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
    <main className="min-h-screen bg-tesla-white">
      <Navbar />
      <Hero />
      
      {/* Tesla Models Showcase */}
      <section className="py-20 bg-tesla-white">
        <div className="container-tesla">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-tesla-title mb-6 text-tesla-black">
              Dòng xe Tesla
            </h2>
            <p className="text-tesla-body text-gray-700 max-w-3xl mx-auto">
              Khám phá toàn bộ dòng xe điện Tesla với công nghệ tiên tiến nhất và hiệu suất vượt trội
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
      <section className="py-20 bg-tesla-light-gray">
        <div className="container-tesla">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-tesla-title mb-6 text-tesla-black">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-tesla-body text-gray-700 max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với dịch vụ tốt nhất
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-tesla-black rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-tesla-dark-gray transition-colors duration-300"
                >
                  <feature.icon className="w-8 h-8 text-tesla-white" />
                </motion.div>
                <h3 className="text-xl font-medium text-tesla-black mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 bg-tesla-white">
        <div className="container-tesla">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-tesla-title mb-6 text-tesla-black">
              Xe điện nổi bật
            </h2>
            <p className="text-tesla-body text-gray-700 max-w-3xl mx-auto mb-8">
              Khám phá những chiếc xe điện Tesla đã qua sử dụng với chất lượng tốt nhất 
              và giá cả hợp lý nhất thị trường.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-tesla-outline"
            >
              Xem tất cả xe điện
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
      <section className="py-20 bg-tesla-black text-tesla-white">
        <div className="container-tesla">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-tesla-title mb-6">
              Sẵn sàng tìm xe điện của bạn?
            </h2>
            <p className="text-tesla-body text-tesla-white/90 max-w-3xl mx-auto mb-12">
              Tham gia cộng đồng người dùng xe điện lớn nhất Việt Nam và tìm kiếm chiếc xe phù hợp với bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-tesla bg-tesla-white text-tesla-black hover:bg-tesla-light-gray"
              >
                Bắt đầu tìm kiếm
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-tesla-outline border-tesla-white text-tesla-white hover:bg-tesla-white hover:text-tesla-black"
              >
                Đăng ký ngay
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
