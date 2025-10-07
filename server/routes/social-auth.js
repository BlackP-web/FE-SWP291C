const express = require('express')
const passport = require('../config/passport')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login?error=google_failed' }),
  async (req, res) => {
    try {
      const user = req.user
      
      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}&provider=google`)
    } catch (error) {
      console.error('Google callback error:', error)
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_failed`)
    }
  }
)

// Facebook OAuth routes
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}))

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login?error=facebook_failed' }),
  async (req, res) => {
    try {
      const user = req.user
      
      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}&provider=facebook`)
    } catch (error) {
      console.error('Facebook callback error:', error)
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=facebook_failed`)
    }
  }
)

// Phone authentication routes
router.post('/phone/send-code', async (req, res) => {
  try {
    const { phone } = req.body

    if (!phone) {
      return res.status(400).json({ message: 'Vui lòng nhập số điện thoại' })
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Check if user exists with this phone
    let user = await User.findOne({ where: { phone } })
    
    if (user) {
      // Update existing user's verification code
      await user.update({
        phoneVerificationCode: verificationCode,
        phoneVerificationExpires: expiresAt
      })
    } else {
      // Create temporary user record
      user = await User.create({
        name: 'Temporary User',
        email: `temp_${phone}@temp.com`,
        phone,
        phoneVerificationCode: verificationCode,
        phoneVerificationExpires: expiresAt,
        isActive: false // Will be activated after verification
      })
    }

    // In production, send SMS here using Twilio
    // For development, we'll just log the code
    console.log(`📱 Verification code for ${phone}: ${verificationCode}`)
    
    res.json({
      message: 'Mã xác thực đã được gửi',
      // In development, return the code for testing
      ...(process.env.NODE_ENV === 'development' && { code: verificationCode })
    })
  } catch (error) {
    console.error('Send phone code error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/phone/verify', async (req, res) => {
  try {
    const { phone, code } = req.body

    if (!phone || !code) {
      return res.status(400).json({ message: 'Vui lòng nhập số điện thoại và mã xác thực' })
    }

    // Find user by phone
    const user = await User.findOne({ where: { phone } })
    
    if (!user) {
      return res.status(400).json({ message: 'Số điện thoại chưa được đăng ký' })
    }

    // Check if code is valid and not expired
    if (!user.phoneVerificationCode || 
        user.phoneVerificationCode !== code ||
        new Date() > user.phoneVerificationExpires) {
      return res.status(400).json({ message: 'Mã xác thực không hợp lệ hoặc đã hết hạn' })
    }

    // Update user
    await user.update({
      phoneVerified: true,
      phoneVerificationCode: null,
      phoneVerificationExpires: null,
      isActive: true
    })

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      message: 'Xác thực thành công',
      token,
      user: user.toJSON()
    })
  } catch (error) {
    console.error('Phone verify error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

// Complete phone registration
router.post('/phone/complete', async (req, res) => {
  try {
    const { phone, name, email } = req.body

    if (!phone || !name || !email) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' })
    }

    // Find user by phone
    const user = await User.findOne({ where: { phone } })
    
    if (!user || !user.phoneVerified) {
      return res.status(400).json({ message: 'Số điện thoại chưa được xác thực' })
    }

    // Check if email is already used
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser && existingUser.id !== user.id) {
      return res.status(400).json({ message: 'Email đã được sử dụng' })
    }

    // Update user with complete information
    await user.update({
      name,
      email,
      phoneVerified: true
    })

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      message: 'Đăng ký thành công',
      token,
      user: user.toJSON()
    })
  } catch (error) {
    console.error('Complete phone registration error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router
