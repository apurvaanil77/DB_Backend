const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  aircraft: String,
  travellerType: String,
  seatType: String,
  route: String,
  dateFlown: Date,
  seatComfortRating: Number,
  cabinStaffServiceRating: Number,
  foodBeveragesRating: Number,
  groundServiceRating: Number,
  inflightEntertainmentRating: Number,
  wifiAndConnectivityRating: Number,
  valueForMoneyRating: Number,
  recommended: Boolean,
  // reviewSentiment: Number,
});

module.exports = mongoose.model("Review", reviewSchema);
