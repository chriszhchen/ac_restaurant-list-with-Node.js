const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// render search results
router.get('/restaurants/search', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => {
      let noResult = false
      const filteredRestaurants = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(req.query.keyword.trim().toLowerCase())
      })
      if (filteredRestaurants.length === 0) {
        noResult = true
      }
      res.render('index', { restaurants: filteredRestaurants, noResult, keyword: req.query.keyword })
    })
    .catch(err => console.log(err))
})

// render create page
router.get('/restaurants/new', (req, res) => {
  res.render('new')
})
// CREATE function
router.post('/restaurants', (req, res) => {
  const newRestaurant = req.body

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
router.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(err => console.log(err))
})

// render edit page
router.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.log(err))
})

// UPDATE function
router.put('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  const editedRestaurant = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      Object.assign(restaurant, editedRestaurant)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => console.log(err))
})

// DELETE function
router.delete('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id

  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router
