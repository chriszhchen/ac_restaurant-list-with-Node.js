// include express and define related variable
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
// const Restaurant = require('./models/restaurant.js')
const methodOverride = require('method-override')
const routes = require('./routes')

// modules setting
mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// --- route setting ---
app.use(routes)

// start and listen the server
app.listen(3000, () => {
  console.log('The server is listening on http://localhost:3000')
})
