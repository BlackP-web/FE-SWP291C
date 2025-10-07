# EV Trading Platform - Nền tảng giao dịch xe điện

Website full-stack cho việc mua bán xe điện và pin đã qua sử dụng, được thiết kế với phong cách Tesla.com.

## 🚀 Tính năng chính

### 👥 Người dùng (Guest)
- Xem danh sách xe điện và pin
- Xem chi tiết sản phẩm (ảnh, thông số, giá, tình trạng)
- Tìm kiếm và lọc theo hãng, model, pin, giá, tình trạng
- CTA để đăng ký/đăng nhập

### 👤 Thành viên (Member)
- **Đăng ký & Quản lý tài khoản**: Đăng nhập/đăng ký (email, SĐT, mạng xã hội)
- **Đăng tin bán**: Form đăng tin với AI gợi ý giá
- **Tìm kiếm & Mua**: Bộ lọc chi tiết, so sánh, yêu thích, đấu giá
- **Giao dịch & Thanh toán**: Thanh toán online, ký hợp đồng số
- **Hỗ trợ sau bán**: Đánh giá, phản hồi, lịch sử giao dịch

### 🔧 Admin
- Quản lý người dùng (phê duyệt, khóa)
- Quản lý tin đăng (kiểm duyệt, xác minh)
- Quản lý khiếu nại, tranh chấp
- Thống kê & báo cáo

## 🛠 Công nghệ sử dụng

### Frontend
- **Next.js 14** - React framework với App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Cấu trúc thư mục

```
cloneTesla/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── vehicles/         # Vehicles page
│   └── admin/            # Admin dashboard
├── components/            # React components
│   ├── Navbar.tsx        # Navigation bar
│   ├── Hero.tsx          # Hero section
│   ├── ProductCard.tsx   # Product card
│   ├── AuthModal.tsx     # Authentication modal
│   ├── SearchFilter.tsx  # Search and filter
│   └── Footer.tsx        # Footer
├── server/               # Backend API
│   ├── config/          # Database config
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── server.js        # Main server file
│   └── init-db.js       # Database initialization
├── package.json         # Frontend dependencies
├── next.config.js       # Next.js config
├── tailwind.config.js   # Tailwind config
└── tsconfig.json        # TypeScript config
```

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd cloneTesla
```

### 2. Cài đặt dependencies cho Frontend
```bash
npm install
```

### 3. Cài đặt dependencies cho Backend
```bash
cd server
npm install
cd ..
```

### 4. Cấu hình Database
1. Cài đặt PostgreSQL
2. Tạo database: `ev_trading_db`
3. Copy file cấu hình:
```bash
cp server/env.example server/.env
```
4. Chỉnh sửa `server/.env` với thông tin database của bạn

### 5. Khởi tạo Database
```bash
cd server
npm run init-db
cd ..
```

### 6. Chạy ứng dụng

**Development mode:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

**Production mode:**
```bash
# Build frontend
npm run build

# Start frontend
npm start

# Start backend
cd server
npm start
```

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📱 Responsive Design

Website được thiết kế responsive hoàn hảo cho:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎨 UI/UX Features

### Tesla-inspired Design
- **Minimalist**: Clean, elegant interface
- **Typography**: Inter font với spacing rộng
- **Colors**: Tesla color palette (black, white, gray)
- **Animations**: Smooth transitions và hover effects

### Advanced Features
- **Auto Color Detection**: Tự động thay đổi màu chữ dựa trên độ sáng hình ảnh
- **Image Optimization**: Sử dụng Next.js Image component
- **Loading States**: Skeleton loading và error handling
- **Smooth Animations**: Framer Motion với spring physics

## 🔐 Authentication

- **JWT-based**: Secure token authentication
- **Password Hashing**: bcryptjs với salt rounds
- **Role-based Access**: User, Admin, Moderator roles
- **Social Login**: Google, Facebook (placeholder)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user hiện tại
- `PUT /api/auth/profile` - Cập nhật profile
- `PUT /api/auth/change-password` - Đổi mật khẩu

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/featured` - Sản phẩm nổi bật
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm
- `POST /api/products/:id/like` - Like sản phẩm

### Admin
- `GET /api/admin/users` - Quản lý người dùng
- `GET /api/admin/products` - Quản lý sản phẩm
- `PUT /api/admin/products/:id/verify` - Xác minh sản phẩm
- `PUT /api/admin/products/:id/feature` - Đưa lên trang chủ
- `PUT /api/admin/users/:id/block` - Khóa/mở khóa user
- `GET /api/admin/stats` - Thống kê dashboard

## 🗄 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `phone` (String)
- `password` (String, Hashed)
- `avatar` (String)
- `role` (Enum: user, admin, moderator)
- `isVerified` (Boolean)
- `isActive` (Boolean)
- `lastLogin` (Date)
- `preferences` (JSON)

### Products Table
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `brand` (String)
- `model` (String)
- `year` (Integer)
- `mileage` (Integer)
- `price` (Decimal)
- `images` (JSON Array)
- `specifications` (JSON)
- `batteryHealth` (Integer)
- `condition` (Enum: excellent, good, fair, poor)
- `type` (Enum: vehicle, battery, accessory)
- `status` (Enum: active, sold, pending, inactive)
- `isVerified` (Boolean)
- `isFeatured` (Boolean)
- `sellerId` (UUID, Foreign Key)
- `location` (JSON)
- `viewCount` (Integer)
- `likeCount` (Integer)

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ev_trading_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Backend (Railway/Heroku)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

## 📝 Scripts

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint check
```

### Backend
```bash
npm run dev      # Development server
npm start        # Production server
npm run init-db  # Initialize database
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

- **Email**: contact@evtrading.vn
- **Phone**: +84 123 456 789
- **Website**: https://evtrading.vn

## 🙏 Acknowledgments

- Tesla.com for design inspiration
- Unsplash for high-quality images
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
