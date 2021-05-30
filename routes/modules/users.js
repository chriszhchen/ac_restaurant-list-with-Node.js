const express = require('express')
const router = express.Router()
const User = require('../../models/user')

// render login page
router.get('/login', (req, res) => {
  res.render('login')
})

// handle the login
router.post('/login', (req, res) => {
})

// render register page
router.get('/register', (req, res) => {
  res.render('register')
})

// handle the register
router.post('/register', (req, res) => {
  const { email, password, confirmPassword } = req.body
  const name = req.body.name || '我'

  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('User already exists.')
        res.render('register', { name, email, password, confirmPassword })
      } else {
        return User.create({ name, email, password })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
})

module.exports = router
