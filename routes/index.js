var express = require('express');
var router = express.Router();
var Hotel = require('../models').Hotel;
var Restaurant = require('../models').Restaurant;
var Activity = require('../models').Activity;
var Place = require('../models').Place;
var Promise = require('bluebird');

router.get('/', function(req, res, next) {

  var findingHotels = Hotel.findAll({
    include: [Place]
  });

  var findingActivities = Activity.findAll({
    include: [Place]
  });

  var findingRestaurants = Restaurant.findAll({
    include: [Place]
  });

  Promise.all([
    findingHotels,
    findingActivities,
    findingRestaurants
  ])
  .spread(function(hotels, activities, restaurants) {
    res.render('index', {
      hotels: hotels,
      activities: activities,
      restaurants: restaurants
    });
  })
  .catch(next);

});

module.exports = router;
