// include express and define related variable
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes')
require('./config/mongoose')

// modules setting

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers: { eq: function (v1, v2) { return v1 === v2 } } }))
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
