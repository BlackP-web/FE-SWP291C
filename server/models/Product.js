const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2010,
      max: new Date().getFullYear() + 1
    }
  },
  mileage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  images: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  specifications: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  batteryHealth: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  condition: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('vehicle', 'battery', 'accessory'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'pending', 'inactive'),
    defaultValue: 'active'
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  seller_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  location: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  auctionEndTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  currentBid: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likeCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'products',
  indexes: [
    {
      fields: ['brand', 'model']
    },
    {
      fields: ['year']
    },
    {
      fields: ['price']
    },
    {
      fields: ['condition']
    },
    {
      fields: ['type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['seller_id']
    },
    {
      fields: ['is_verified']
    },
    {
      fields: ['is_featured']
    }
  ]
})

module.exports = Product
