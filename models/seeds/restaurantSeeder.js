const Restaurant = require('../restaurant.js')
const restaurantData = require('./restaurant.json').results
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connected!')
  const restaurants = restaurantData.map(restaurant => {
    return {
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    }
  })
  Restaurant.create(restaurants)
    .then(() => {
      console.log('seeder done!')
      db.close()
    })
    .then(() => {
      console.log('mongodb connection closed!')
    })

})
