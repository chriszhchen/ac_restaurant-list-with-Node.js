// include express and define related variable
const express = require('express')
const exphbs = require('express-handlebars')
// const restaurantData = require('./restaurant.json') // 改為從資料庫拿
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant.js')

const app = express()
const port = 3000

// modules setting
mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
// --- route setting ---

// render index page
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.log(err))
})
// render search results
app.get('/search', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => {
      const filteredRestaurants = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(req.query.keyword.trim().toLowerCase())
      })
      res.render('index', { restaurants: filteredRestaurants, keyword: req.query.keyword })
    })
    .catch(err => console.log(err))
})

// render create page
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})
// CREATE function
app.post('/restaurants', (req, res) => {
  const newRestaurant = req.body

  // 直接新增資料到資料庫
  return Restaurant.create({
    name: newRestaurant.name,
    name_en: newRestaurant.name_en,
    category: newRestaurant.category,
    image: newRestaurant.image,
    location: newRestaurant.location,
    phone: newRestaurant.phone,
    google_map: newRestaurant.google_map,
    rating: newRestaurant.rating,
    description: newRestaurant.description
  })
    .then(res.redirect('/'))
    .catch(err => console.log(err))
})

// READ function and render detail page
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('detail', { restaurant })
    })
    .catch(err => console.log(err))
})

// render edit page

// UPDATE function

// DELETE function

// start and listen the server
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})
