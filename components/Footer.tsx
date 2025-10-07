'use client'

import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const footerSections = [
    {
      title: 'Sản phẩm',
      links: [
        { name: 'Xe điện Tesla', href: '/tesla' },
        { name: 'Xe điện khác', href: '/other-brands' },
        { name: 'Pin xe điện', href: '/batteries' },
        { name: 'Phụ kiện', href: '/accessories' },
      ]
    },
    {
      title: 'Dịch vụ',
      links: [
        { name: 'Đấu giá', href: '/auctions' },
        { name: 'Kiểm định', href: '/inspection' },
        { name: 'Bảo hiểm', href: '/insurance' },
        { name: 'Vận chuyển', href: '/shipping' },
      ]
    },
    {
      title: 'Hỗ trợ',
      links: [
        { name: 'Trung tâm trợ giúp', href: '/help' },
        { name: 'Liên hệ', href: '/contact' },
        { name: 'Báo cáo lỗi', href: '/report' },
        { name: 'Điều khoản', href: '/terms' },
      ]
    },
    {
      title: 'Công ty',
      links: [
        { name: 'Về chúng tôi', href: '/about' },
        { name: 'Tin tức', href: '/news' },
        { name: 'Tuyển dụng', href: '/careers' },
        { name: 'Đối tác', href: '/partners' },
      ]
    }
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ]

  return (
    <footer className="bg-tesla-darker-gray text-tesla-white">
      <div className="container-tesla">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-tesla-white rounded-sm flex items-center justify-center">
                    <span className="text-tesla-black font-bold text-lg">E</span>
                  </div>
                  <span className="text-xl font-light">EV Trading</span>
                </div>
                <p className="text-tesla-white/95 leading-relaxed mb-6">
                  Nền tảng giao dịch xe điện và pin đã qua sử dụng hàng đầu Việt Nam. 
                  Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với giá cả hợp lý.
                </p>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-3"
              >
                <div className="flex items-center text-tesla-white/95">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>contact@evtrading.vn</span>
                </div>
                <div className="flex items-center text-tesla-white/95">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="flex items-center text-tesla-white/95">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>Hà Nội, Việt Nam</span>
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-medium mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={link.name}>
                      <motion.a
                        href={link.href}
                        whileHover={{ x: 5 }}
                        className="text-tesla-white/95 hover:text-tesla-white transition-colors duration-300"
                      >
                        {link.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-gray-600"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium mb-2">Đăng ký nhận tin</h3>
              <p className="text-tesla-white/95">Nhận thông tin về xe điện mới nhất và ưu đãi đặc biệt</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 md:w-80 px-4 py-3 bg-gray-700 text-tesla-white placeholder-tesla-white/80 border border-gray-600 focus:border-tesla-white focus:outline-none transition-colors duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-tesla-white text-tesla-black font-medium hover:bg-tesla-light-gray transition-colors duration-300"
              >
                Đăng ký
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-6 border-t border-gray-600"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-tesla-white/90 text-sm mb-4 md:mb-0">
              © 2024 EV Trading Platform. Tất cả quyền được bảo lưu.
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-gray-700 rounded-full text-tesla-white/95 hover:text-tesla-white hover:bg-gray-600 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
