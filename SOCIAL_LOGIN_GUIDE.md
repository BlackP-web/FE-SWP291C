# 🔐 Social Login & Phone Authentication Guide

## 📋 Tổng quan

Hệ thống đăng nhập đã được hoàn thiện với 4 phương thức:

1. **Email/Password** - Đăng nhập truyền thống
2. **Google OAuth** - Đăng nhập bằng Google
3. **Facebook OAuth** - Đăng nhập bằng Facebook  
4. **Phone Authentication** - Đăng nhập bằng số điện thoại

## 🚀 Cách sử dụng

### 1. Đăng nhập bằng Email/Password
```
URL: /login
- Nhập email và password
- Click "Đăng nhập"
```

### 2. Đăng nhập bằng Google
```
URL: /login
- Click "Đăng nhập với Google"
- Redirect đến Google OAuth
- Tự động redirect về trang chủ sau khi đăng nhập thành công
```

### 3. Đăng nhập bằng Facebook
```
URL: /login
- Click "Đăng nhập với Facebook"
- Redirect đến Facebook OAuth
- Tự động redirect về trang chủ sau khi đăng nhập thành công
```

### 4. Đăng nhập bằng SĐT
```
URL: /login/phone
- Nhập số điện thoại
- Nhận mã xác thực 6 chữ số (hiển thị trong console server)
- Nhập mã xác thực
- Hoàn tất thông tin (nếu cần)
```

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập email/password
- `POST /api/auth/register` - Đăng ký email/password
- `POST /api/auth/logout` - Đăng xuất

### Social Login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/facebook` - Facebook OAuth

### Phone Authentication
- `POST /api/auth/phone/send-code` - Gửi mã xác thực
- `POST /api/auth/phone/verify` - Xác thực mã
- `POST /api/auth/phone/complete` - Hoàn tất đăng ký

## 🔧 Cấu hình Environment Variables

### Backend (.env)
```env
# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Session
SESSION_SECRET=your_session_secret

# OAuth (Production)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5001/api/auth/facebook/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 📱 Frontend Pages

### 1. Login Page (`/login`)
- Email/Password form
- Social login buttons (Google, Facebook)
- Phone login button
- Link to register page

### 2. Register Page (`/register`)
- Registration form
- Social register buttons
- Phone register button
- Link to login page

### 3. Phone Login Page (`/login/phone`)
- Step 1: Enter phone number
- Step 2: Enter verification code
- Step 3: Complete registration (if needed)

### 4. Auth Callback Page (`/auth/callback`)
- Handles OAuth redirects
- Processes tokens from social login
- Redirects to home page

## 🗄 Database Schema Updates

### User Model
```javascript
// New fields added:
googleId: STRING (unique)
facebookId: STRING (unique)
phoneVerified: BOOLEAN
phoneVerificationCode: STRING
phoneVerificationExpires: DATE
password: STRING (nullable for social users)
```

## 🧪 Testing

### Development Mode
- Phone verification codes are logged to console
- Social login uses mock endpoints
- All authentication methods work without external services

### Test Commands
```bash
# Test phone authentication
curl -X POST http://localhost:5001/api/auth/phone/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone":"0123456789"}'

# Test phone verification
curl -X POST http://localhost:5001/api/auth/phone/verify \
  -H "Content-Type: application/json" \
  -d '{"phone":"0123456789","code":"123456"}'

# Test social login
curl -X GET http://localhost:5001/api/auth/google
curl -X GET http://localhost:5001/api/auth/facebook
```

## 🔒 Security Features

1. **JWT Tokens** - Secure authentication
2. **Password Hashing** - bcryptjs with salt
3. **Phone Verification** - 6-digit codes with expiration
4. **CORS Protection** - Configured for specific origins
5. **Session Management** - Express sessions for OAuth

## 🚀 Production Setup

### 1. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs
4. Update environment variables

### 2. Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create Facebook App
3. Add Facebook Login product
4. Configure OAuth settings
5. Update environment variables

### 3. SMS Service (Optional)
- Integrate Twilio for real SMS
- Update phone authentication to send real SMS
- Remove development mode logging

## 📊 User Flow

### Email/Password Flow
```
User → Login Form → API → JWT Token → Home Page
```

### Social Login Flow
```
User → Social Button → OAuth Provider → Callback → JWT Token → Home Page
```

### Phone Login Flow
```
User → Phone Form → Send Code → Verify Code → Complete Info → JWT Token → Home Page
```

## 🎯 Next Steps

1. **Production OAuth Setup** - Configure real Google/Facebook apps
2. **SMS Integration** - Add real SMS service
3. **Email Verification** - Add email verification for email/password users
4. **Two-Factor Authentication** - Add 2FA for enhanced security
5. **Social Profile Sync** - Sync profile data from social providers

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors** - Check CORS configuration in server
2. **OAuth Redirects** - Verify callback URLs match exactly
3. **Token Issues** - Check JWT secret and expiration
4. **Phone Verification** - Check console for verification codes in development

### Debug Mode
- All API calls are logged to console
- Phone codes are displayed in server console
- Social login redirects are logged
- Token generation is logged

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Server logs trong console
2. Network tab trong browser dev tools
3. Environment variables
4. CORS configuration
5. Database connection
