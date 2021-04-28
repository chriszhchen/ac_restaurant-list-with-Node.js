// include express and define related variable
const express = require('express')
const exphbs = require('express-handlebars')
const restaurantData = require('./restaurant.json')
const app = express()
const port = 3000
const stylesheetPath = { index: '/stylesheets/index.css', show: '/stylesheets/show.css' }

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))

app.set('view engine', 'handlebars')

// setting static files

app.use(express.static('public'))

// setting the route and response
app.get('/', (req, res) => {
  // console.log(restaurantData.results)
  res.render('index', { stylesheetPath: stylesheetPath.index, restaurants: restaurantData.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  // console.log(req)
  const chosenRestaurant = restaurantData.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { stylesheetPath: stylesheetPath.show, restaurant: chosenRestaurant })
})
app.get('/search', (req, res) => {
  // console.log(req)
  const filteredRestaurants = restaurantData.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(req.query.keyword.trim().toLowerCase())
  })
  res.render('index', { stylesheetPath: stylesheetPath.index, restaurants: filteredRestaurants, keyword: req.query.keyword })
})


// start and listen the server
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})
