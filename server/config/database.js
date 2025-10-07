const { Sequelize } = require('sequelize')
require('dotenv').config()

// Database configuration - Using SQLite for development
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
})

module.exports = { sequelize }
