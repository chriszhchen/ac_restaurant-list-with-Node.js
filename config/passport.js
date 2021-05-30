const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // initialize Passport module
  app.use(passport.initialize())
  app.use(passport.session())
  // set up strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { type: 'danger_msg', message: '此信箱尚未完成註冊！' })
        }
        if (user.password !== password) {
          return done(null, false, { type: 'danger_msg', message: '信箱或密碼輸入錯誤。' })
        }
        return done(null, user)
      })
      .catch(err => done(err, false))
  }))
  // set up serialization and deserialization
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}
