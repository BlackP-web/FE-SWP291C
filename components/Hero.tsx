'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronDown, Play } from 'lucide-react'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: 'Tesla Model S',
      subtitle: 'Xe điện cao cấp đã qua sử dụng',
      description: 'Trải nghiệm lái xe điện với công nghệ tiên tiến nhất',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Hero-Desktop-US.png',
      price: '1.200.000.000 VNĐ',
      year: '2022',
      mileage: '15.000 km'
    },
    {
      id: 2,
      title: 'Tesla Model 3',
      subtitle: 'Xe điện phổ biến nhất',
      description: 'Hiệu suất cao, giá cả hợp lý cho mọi gia đình',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promo-Model-3-Desktop-US-July.png',
      price: '800.000.000 VNĐ',
      year: '2021',
      mileage: '25.000 km'
    },
    {
        id: 3,
        title: 'Tesla CyberTruck',
        subtitle: 'Xe điện phổ biến nhất',
        description: 'Hiệu suất cao, giá cả hợp lý cho mọi gia đình',
        image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Cybertruck-Accessories-Desktop.jpg',
        price: '800.000.000 VNĐ',
        year: '2021',
        mileage: '25.000 km'
      },
    {
      id: 4,
      title: 'Tesla Model Y',
      subtitle: 'SUV điện đa năng',
      description: 'Không gian rộng rãi, phù hợp cho gia đình',
      image: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-2-Hero-Desktop.jpg',
      price: '1.500.000.000 VNĐ',
      year: '2023',
      mileage: '8.000 km'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: currentSlide === index ? 1 : 0,
            scale: currentSlide === index ? 1 : 1.1
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60" />
          
          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container-tesla text-center text-tesla-white">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-tesla-title mb-4 font-light">
                  {slide.title}
                </h1>
                <p className="text-2xl md:text-3xl mb-6 font-light text-tesla-white/95">
                  {slide.subtitle}
                </p>
                <p className="text-lg md:text-xl mb-8 text-tesla-white/90 max-w-2xl mx-auto">
                  {slide.description}
                </p>
                
                {/* Specs */}
                <div className="flex justify-center space-x-8 mb-12">
                  <div className="text-center">
                    <div className="text-2xl font-light text-tesla-white">
                      {slide.price}
                    </div>
                    <div className="text-sm text-tesla-white/85">Giá bán</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-light text-tesla-white">
                      {slide.year}
                    </div>
                    <div className="text-sm text-tesla-white/85">Năm sản xuất</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-light text-tesla-white">
                      {slide.mileage}
                    </div>
                    <div className="text-sm text-tesla-white/85">Số km</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                      y: -5
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-tesla-white to-tesla-light-gray text-tesla-black px-8 py-4 rounded-full font-medium transition-all duration-500 shadow-xl hover:shadow-2xl relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>Xem chi tiết</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
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
                    className="border-2 border-tesla-white text-tesla-white px-8 py-4 rounded-full font-medium transition-all duration-500 shadow-lg hover:shadow-xl hover:bg-tesla-white hover:text-tesla-black backdrop-blur-sm"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>Xem video</span>
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-tesla-white shadow-lg'
                : 'bg-tesla-white/50 hover:bg-tesla-white/70'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 right-8 text-tesla-white"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-2"
        >
          <span className="text-sm font-light">Cuộn xuống</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
