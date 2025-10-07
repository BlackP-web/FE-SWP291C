const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5001

// Middleware - Cấu hình CORS chi tiết
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://localhost:3007'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', status: 'OK' })
})

// Simple login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  
  console.log('Login attempt:', { email, passwordLength: password?.length })
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' })
  }
  
  // Mock login - accept any email/password for testing
  if (email && password) {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: email,
      role: 'user'
    }
    
    const mockToken = 'mock-jwt-token-' + Date.now()
    
    console.log('Login successful for:', email)
    
    res.json({
      message: 'Đăng nhập thành công',
      token: mockToken,
      user: mockUser
    })
  } else {
    res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
  }
})

// Simple register endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body
  
  console.log('Registration attempt:', { name, email, phone, passwordLength: password?.length })
  
  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' })
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  }
  
  // Mock registration - accept any valid data
  const mockUser = {
    id: Date.now().toString(),
    name: name,
    email: email,
    phone: phone || '',
    role: 'user'
  }
  
  const mockToken = 'mock-jwt-token-' + Date.now()
  
  console.log('Registration successful for:', email)
  
  res.json({
    message: 'Đăng ký thành công',
    token: mockToken,
    user: mockUser
  })
})

// Phone authentication endpoints
app.post('/api/auth/phone/send-code', (req, res) => {
  const { phone } = req.body
  
  console.log('Phone verification request for:', phone)
  
  if (!phone) {
    return res.status(400).json({ message: 'Vui lòng nhập số điện thoại' })
  }
  
  // Generate 6-digit code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
  
  console.log(`📱 Verification code for ${phone}: ${verificationCode}`)
  
  res.json({
    message: 'Mã xác thực đã được gửi',
    code: verificationCode // Return code for testing
  })
})

app.post('/api/auth/phone/verify', (req, res) => {
  const { phone, code } = req.body
  
  console.log('Phone verification attempt:', { phone, code })
  
  if (!phone || !code) {
    return res.status(400).json({ message: 'Vui lòng nhập số điện thoại và mã xác thực' })
  }
  
  // Mock verification - accept any 6-digit code
  if (code.length === 6) {
    const mockUser = {
      id: Date.now().toString(),
      name: 'Phone User',
      email: `phone_${phone}@temp.com`,
      phone: phone,
      role: 'user',
      phoneVerified: true
    }
    
    const mockToken = 'mock-jwt-token-' + Date.now()
    
    console.log('Phone verification successful for:', phone)
    
    res.json({
      message: 'Xác thực thành công',
      token: mockToken,
      user: mockUser
    })
  } else {
    res.status(400).json({ message: 'Mã xác thực không hợp lệ' })
  }
})

app.post('/api/auth/phone/complete', (req, res) => {
  const { phone, name, email } = req.body
  
  console.log('Complete phone registration:', { phone, name, email })
  
  if (!phone || !name || !email) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' })
  }
  
  const mockUser = {
    id: Date.now().toString(),
    name: name,
    email: email,
    phone: phone,
    role: 'user',
    phoneVerified: true
  }
  
  const mockToken = 'mock-jwt-token-' + Date.now()
  
  console.log('Phone registration completed for:', email)
  
  res.json({
    message: 'Đăng ký thành công',
    token: mockToken,
    user: mockUser
  })
})

// Social login mock endpoints
app.get('/api/auth/google', (req, res) => {
  // Mock Google OAuth redirect
  const mockToken = 'mock-jwt-token-' + Date.now()
  
  console.log('Google login successful')
  
  res.redirect(`http://localhost:3000/auth/callback?token=${mockToken}&provider=google`)
})

app.get('/api/auth/facebook', (req, res) => {
  // Mock Facebook OAuth redirect
  const mockToken = 'mock-jwt-token-' + Date.now()
  
  console.log('Facebook login successful')
  
  res.redirect(`http://localhost:3000/auth/callback?token=${mockToken}&provider=facebook`)
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`)
})
