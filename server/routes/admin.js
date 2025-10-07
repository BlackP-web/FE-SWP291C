const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Product = require('../models/Product')
const router = express.Router()

// Middleware to check admin role
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.userId)
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền admin' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' })
  }
}

// Get all users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit

    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Get all products for admin
router.get('/products', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const offset = (page - 1) * limit

    const whereClause = {}
    if (status) whereClause.status = status

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Verify product
router.put('/products/:id/verify', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }

    await product.update({ isVerified: true })
    
    res.json({
      message: 'Đã xác minh sản phẩm',
      product
    })
  } catch (error) {
    console.error('Verify product error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Feature product
router.put('/products/:id/feature', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }

    await product.update({ isFeatured: true })
    
    res.json({
      message: 'Đã đưa sản phẩm lên trang chủ',
      product
    })
  } catch (error) {
    console.error('Feature product error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Block/Unblock user
router.put('/users/:id/block', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }

    const { isActive } = req.body
    await user.update({ isActive })

    res.json({
      message: isActive ? 'Đã mở khóa người dùng' : 'Đã khóa người dùng',
      user: user.toJSON()
    })
  } catch (error) {
    console.error('Block user error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Get dashboard stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.count()
    const totalProducts = await Product.count()
    const activeProducts = await Product.count({ where: { status: 'active' } })
    const verifiedProducts = await Product.count({ where: { isVerified: true } })
    const featuredProducts = await Product.count({ where: { isFeatured: true } })

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        activeProducts,
        verifiedProducts,
        featuredProducts
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router
