'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronDown, Play, ArrowRight, Zap, Shield, Battery } from 'lucide-react'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: 'Xe điện Model S',
      subtitle: 'Hiệu suất vượt trội',
      description: 'Trải nghiệm lái xe điện với công nghệ tiên tiến và thiết kế đẳng cấp',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Hero-Desktop-US.png',
      price: '1.200.000.000 VNĐ',
      year: '2022',
      mileage: '15.000 km',
      badge: 'Nổi bật'
    },
    {
      id: 2,
      title: 'Xe điện Model 3',
      subtitle: 'Phổ biến nhất thế giới',
      description: 'Hiệu suất cao, giá cả hợp lý cho mọi gia đình',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promo-Model-3-Desktop-US-July.png',
      price: '800.000.000 VNĐ',
      year: '2021',
      mileage: '25.000 km',
      badge: 'Ưu đãi'
    },
    {
      id: 3,
      title: 'Xe điện CyberTruck',
      subtitle: 'Tương lai đã đến',
      description: 'Thiết kế đột phá, khả năng vận hành vượt trội',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Cybertruck-Accessories-Desktop.jpg',
      price: '1.800.000.000 VNĐ',
      year: '2023',
      mileage: '5.000 km',
      badge: 'Mới nhất'
    },
    {
      id: 4,
      title: 'Xe điện Model Y',
      subtitle: 'SUV điện đa năng',
      description: 'Không gian rộng rãi, tiện nghi cho cả gia đình',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-2-Hero-Desktop.jpg',
      price: '1.500.000.000 VNĐ',
      year: '2023',
      mileage: '8.000 km',
      badge: 'Bán chạy'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => 
          currentSlide === index && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background Image with Ken Burns effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05],
                  x: [0, -20, 0],
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear"
                }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </motion.div>

              {/* Multi-layer gradients for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
              
              {/* Animated Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-20, -100, -20],
                      opacity: [0, 0.8, 0],
                      scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container-tesla text-white relative z-10">
                  <div className="max-w-4xl">
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="mb-6"
                    >
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                        <Zap className="w-4 h-4" />
                        {slide.badge}
                      </span>
                    </motion.div>

                    {/* Title with stagger animation */}
                    <motion.h1
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-2xl md:text-3xl font-light mb-3 text-gray-200"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-lg md:text-xl mb-10 text-gray-300 max-w-2xl"
                    >
                      {slide.description}
                    </motion.p>
                    
                    {/* Specs Cards */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="flex flex-wrap gap-4 mb-10"
                    >
                      <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 flex items-center gap-3">
                        <div className="bg-green-500 p-2 rounded-lg">
                          <Battery className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-300">Giá bán</div>
                          <div className="text-lg font-bold">{slide.price}</div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 flex items-center gap-3">
                        <div className="bg-blue-500 p-2 rounded-lg">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-300">Năm SX</div>
                          <div className="text-lg font-bold">{slide.year}</div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 flex items-center gap-3">
                        <div className="bg-purple-500 p-2 rounded-lg">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-300">Đã đi</div>
                          <div className="text-lg font-bold">{slide.mileage}</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 20px 40px rgba(255,255,255,0.2)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg shadow-2xl overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <span>Xem chi tiết</span>
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 20px 40px rgba(255,255,255,0.1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="group px-8 py-4 border-2 border-white/80 text-white rounded-full font-semibold text-lg backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        <span>Xem video</span>
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4">
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
        >
          <ChevronDown className="w-5 h-5 rotate-90" />
        </motion.button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.8 }}
              className="relative"
            >
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`} />
              {currentSlide === index && (
                <motion.div
                  layoutId="activeSlide"
                  className="absolute inset-0 border-2 border-white rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
        >
          <ChevronDown className="w-5 h-5 -rotate-90" />
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-10 right-10 text-white z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-2"
        >
          <span className="text-sm font-light tracking-wider">Cuộn xuống</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
