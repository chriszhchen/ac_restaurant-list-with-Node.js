const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant.js')
const User = require('../user')
const restaurantData = require('./restaurant.json').results
const db = require('../../config/mongoose')

const SEED_USERS_DATA = [
  {
    email: 'user1@example.com',
    password: '12345678',
    restaurants: restaurantData.slice(0, 3)
  },
  {
    email: 'user2@example.com',
    password: '12345678',
    restaurants: restaurantData.slice(3, 6)
  }
]

db.once('open', async () => {
  try {
    for (let i = 0; i < 2; i++) {
      await bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(SEED_USERS_DATA[i].password, salt))
        .then(hash => User.create({
          email: SEED_USERS_DATA[i].email,
          password: hash
        }))
        .then(async user => {
          const userId = user._id
          const restaurants = SEED_USERS_DATA[i].restaurants.map(restaurant => {
            return {
              name: restaurant.name,
              name_en: restaurant.name_en,
              category: restaurant.category,
              image: restaurant.image,
              location: restaurant.location,
              phone: restaurant.phone,
              google_map: restaurant.google_map,
              rating: restaurant.rating,
              description: restaurant.description,
              userId
            }
          })
          await Restaurant.create(restaurants)
        })
    }
  } catch (error) {
    console.log(error)
  }
  console.log('Seeder done.')
  process.exit()
})
