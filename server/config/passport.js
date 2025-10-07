const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/User')

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5001/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile:', profile)
    
    // Check if user exists
    let user = await User.findOne({ where: { email: profile.emails[0].value } })
    
    if (user) {
      // Update existing user with Google info
      await user.update({
        googleId: profile.id,
        avatar: profile.photos[0]?.value || user.avatar,
        isVerified: true
      })
      return done(null, user)
    }
    
    // Create new user
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
      avatar: profile.photos[0]?.value,
      isVerified: true,
      role: 'user'
    })
    
    return done(null, user)
  } catch (error) {
    console.error('Google OAuth error:', error)
    return done(error, null)
  }
}))

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:5001/api/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name', 'picture']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Facebook profile:', profile)
    
    // Check if user exists
    let user = await User.findOne({ where: { email: profile.emails[0].value } })
    
    if (user) {
      // Update existing user with Facebook info
      await user.update({
        facebookId: profile.id,
        avatar: profile.photos[0]?.value || user.avatar,
        isVerified: true
      })
      return done(null, user)
    }
    
    // Create new user
    user = await User.create({
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      email: profile.emails[0].value,
      facebookId: profile.id,
      avatar: profile.photos[0]?.value,
      isVerified: true,
      role: 'user'
    })
    
    return done(null, user)
  } catch (error) {
    console.error('Facebook OAuth error:', error)
    return done(error, null)
  }
}))

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

module.exports = passport
