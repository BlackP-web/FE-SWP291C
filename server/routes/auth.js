const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password
    })

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: user.toJSON()
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log('Login attempt:', { email, passwordLength: password?.length })

    // Validation
    if (!email || !password) {
      console.log('Validation failed: missing email or password')
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' })
    }

    // Find user
    const user = await User.findOne({ where: { email } })
    console.log('User found:', user ? 'Yes' : 'No')
    if (!user) {
      console.log('User not found for email:', email)
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    console.log('Password valid:', isPasswordValid)
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email)
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Tài khoản đã bị khóa' })
    }

    // Update last login
    await user.update({ lastLogin: new Date() })

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: user.toJSON()
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Logout
router.post('/logout', async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token from localStorage
    res.json({ message: 'Đăng xuất thành công' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.userId)
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }

    res.json({ user: user.toJSON() })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(401).json({ message: 'Token không hợp lệ' })
  }
})

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.userId)
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }

    const { name, phone, avatar, preferences } = req.body
    await user.update({ name, phone, avatar, preferences })

    res.json({
      message: 'Cập nhật thông tin thành công',
      user: user.toJSON()
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.userId)
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' })
    }

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' })
    }

    await user.update({ password: newPassword })

    res.json({ message: 'Đổi mật khẩu thành công' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router
