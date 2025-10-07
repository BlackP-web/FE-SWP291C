const express = require('express')
const { Op } = require('sequelize')
const Product = require('../models/Product')
const User = require('../models/User')
const router = express.Router()

// Get all products with filters and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      brand,
      model,
      year,
      minPrice,
      maxPrice,
      condition,
      type,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query

    const offset = (page - 1) * limit
    const whereClause = { status: 'active' }

    // Apply filters
    if (brand) whereClause.brand = brand
    if (model) whereClause.model = model
    if (year) whereClause.year = year
    if (condition) whereClause.condition = condition
    if (type) whereClause.type = type

    // Price range filter
    if (minPrice || maxPrice) {
      whereClause.price = {}
      if (minPrice) whereClause.price[Op.gte] = minPrice
      if (maxPrice) whereClause.price[Op.lte] = maxPrice
    }

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        { model: { [Op.iLike]: `%${search}%` } }
      ]
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ],
      order: [[sortBy, sortOrder]],
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

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        status: 'active',
        isFeatured: true
      },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 8
    })

    res.json({ products })
  } catch (error) {
    console.error('Get featured products error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email', 'avatar', 'phone']
        }
      ]
    })

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }

    // Increment view count
    await product.increment('viewCount')

    res.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Create new product
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token' })
    }

    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const productData = {
      ...req.body,
      sellerId: decoded.userId
    }

    const product = await Product.create(productData)
    
    res.status(201).json({
      message: 'Tạo sản phẩm thành công',
      product
    })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Update product
router.put('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token' })
    }

    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const product = await Product.findByPk(req.params.id)
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }

    // Check if user owns the product or is admin
    if (product.sellerId !== decoded.userId) {
      return res.status(403).json({ message: 'Không có quyền chỉnh sửa sản phẩm này' })
    }

    await product.update(req.body)
    
    res.json({
      message: 'Cập nhật sản phẩm thành công',
      product
    })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token' })
    }

    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const product = await Product.findByPk(req.params.id)
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }

    // Check if user owns the product or is admin
    if (product.sellerId !== decoded.userId) {
      return res.status(403).json({ message: 'Không có quyền xóa sản phẩm này' })
    }

    await product.destroy()
    
    res.json({ message: 'Xóa sản phẩm thành công' })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Like/Unlike product
router.post('/:id/like', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token' })
    }

    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const product = await Product.findByPk(req.params.id)
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
    }

    // Toggle like count (simplified - in real app, you'd have a separate Likes table)
    const newLikeCount = product.likeCount + 1
    await product.update({ likeCount: newLikeCount })
    
    res.json({
      message: 'Đã thích sản phẩm',
      likeCount: newLikeCount
    })
  } catch (error) {
    console.error('Like product error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Get user's products
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 12 } = req.query
    
    const offset = (page - 1) * limit

    const { count, rows: products } = await Product.findAndCountAll({
      where: { sellerId: userId },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email', 'avatar']
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
    console.error('Get user products error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router
