const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Product = require('../models/Product')
const router = express.Router()

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Product,
          as: 'products',
          where: { status: 'active' },
          required: false,
          limit: 6
        }
      ]
    })

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Get user's products
router.get('/:id/products', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query
    const offset = (page - 1) * limit

    const { count, rows: products } = await Product.findAndCountAll({
      where: { sellerId: req.params.id },
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
