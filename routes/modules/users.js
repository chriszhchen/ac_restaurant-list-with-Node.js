const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')

// render login page
router.get('/login', (req, res) => {
  res.render('login')
})

// handle the login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

// render register page
router.get('/register', (req, res) => {
  res.render('register')
})

// handle the register
router.post('/register', (req, res) => {
  const { email, password, confirmPassword } = req.body
  let { name } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '除了Name欄位以外皆必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email, password, confirmPassword })
  }
  name = name || '我'

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
        res.render('register', { name, email, password, confirmPassword })
      } else {
        return User.create({ name, email, password })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
})

// handle the logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router
