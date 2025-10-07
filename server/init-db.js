const { sequelize } = require('./config/database')
const User = require('./models/User')
const Product = require('./models/Product')

// Define associations
User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' })
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' })

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...')
    
    // Test connection
    await sequelize.authenticate()
    console.log('✅ Database connection established')
    
    // Sync models
    await sequelize.sync({ force: true })
    console.log('✅ Database models synchronized')
    
    // Create sample data
    await createSampleData()
    console.log('✅ Sample data created')
    
    console.log('🎉 Database initialization completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  }
}

const createSampleData = async () => {
  // Create admin user
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@evtrading.vn',
    phone: '0123456789',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
    isActive: true
  })
  console.log('👤 Admin user created:', adminUser.email)

  // Create regular user
  const regularUser = await User.create({
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    phone: '0987654321',
    password: 'user123',
    role: 'user',
    isVerified: true,
    isActive: true
  })
  console.log('👤 Regular user created:', regularUser.email)

  // Create sample products
  const sampleProducts = [
    {
      title: 'Tesla Model S Plaid 2022',
      description: 'Xe điện Tesla Model S Plaid với hiệu suất vượt trội, chỉ chạy 15,000km',
      brand: 'Tesla',
      model: 'Model S',
      year: 2022,
      mileage: 15000,
      price: 1200000000,
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      specifications: {
        power: '1,020 hp',
        range: '637 km',
        acceleration: '2.1s 0-100km/h',
        battery: '100 kWh'
      },
      batteryHealth: 95,
      condition: 'excellent',
      type: 'vehicle',
      status: 'active',
      isVerified: true,
      isFeatured: true,
      seller_id: regularUser.id,
      location: {
        city: 'Hà Nội',
        district: 'Cầu Giấy'
      }
    },
    {
      title: 'Tesla Model 3 Performance 2021',
      description: 'Tesla Model 3 Performance với hiệu suất cao và giá cả hợp lý',
      brand: 'Tesla',
      model: 'Model 3',
      year: 2021,
      mileage: 25000,
      price: 800000000,
      images: [
        'https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      specifications: {
        power: '450 hp',
        range: '567 km',
        acceleration: '3.1s 0-100km/h',
        battery: '75 kWh'
      },
      batteryHealth: 88,
      condition: 'good',
      type: 'vehicle',
      status: 'active',
      isVerified: true,
      isFeatured: true,
      seller_id: regularUser.id,
      location: {
        city: 'TP.HCM',
        district: 'Quận 1'
      }
    },
    {
      title: 'Tesla Model Y Long Range 2023',
      description: 'SUV điện Tesla Model Y với không gian rộng rãi, phù hợp cho gia đình',
      brand: 'Tesla',
      model: 'Model Y',
      year: 2023,
      mileage: 8000,
      price: 1500000000,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      specifications: {
        power: '533 hp',
        range: '565 km',
        acceleration: '3.7s 0-100km/h',
        battery: '75 kWh'
      },
      batteryHealth: 98,
      condition: 'excellent',
      type: 'vehicle',
      status: 'active',
      isVerified: true,
      isFeatured: true,
      seller_id: regularUser.id,
      location: {
        city: 'Đà Nẵng',
        district: 'Hải Châu'
      }
    },
    {
      title: 'Tesla Model X Plaid 2022',
      description: 'SUV điện Tesla Model X với cửa cánh bướm độc đáo',
      brand: 'Tesla',
      model: 'Model X',
      year: 2022,
      mileage: 12000,
      price: 1800000000,
      images: [
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      specifications: {
        power: '1,020 hp',
        range: '576 km',
        acceleration: '2.6s 0-100km/h',
        battery: '100 kWh'
      },
      batteryHealth: 92,
      condition: 'excellent',
      type: 'vehicle',
      status: 'active',
      isVerified: true,
      isFeatured: true,
      seller_id: regularUser.id,
      location: {
        city: 'Hà Nội',
        district: 'Ba Đình'
      }
    }
  ]

  for (const productData of sampleProducts) {
    await Product.create(productData)
  }
  console.log('🚗 Sample products created')
}

// Run initialization
initDatabase()
