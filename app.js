// include express and define related variable
const express = require('express')
const exphbs = require('express-handlebars')
const restaurantData = require('./restaurant.json') // 改為從資料庫拿
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant.js')

const app = express()
const port = 3000
const stylesheetPath = { index: '/stylesheets/index.css', show: '/stylesheets/show.css' }

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

// --- route setting ---

// render index page
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { stylesheetPath: stylesheetPath.index, restaurants }))
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
      res.render('index', { stylesheetPath: stylesheetPath.index, restaurants: filteredRestaurants, keyword: req.query.keyword })
    })
    .catch(err => console.log(err))
})

// render create page

// CREATE function

// READ function and render detail page
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('detail', { stylesheetPath: stylesheetPath.show, restaurant })
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
