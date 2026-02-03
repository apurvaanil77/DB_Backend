const express = require("express");
const asyncHandler = require("express-async-handler");
const ReviewHandler = require("../handler/review.handler");
const { getOrUpdateCache } = require("../utils/cache.utils");
const { query } = require("express-validator");
const { validate } = require("../utils/route.utils");

const router = new express.Router();

router.get(
  "/review/all",
  asyncHandler(getOrUpdateCache(ReviewHandler.getAllReviews))
);

router.get(
  "/review/cities",
  asyncHandler(getOrUpdateCache(ReviewHandler.getAllCities))
);

router.get(
  "/review/route",
  query("source")
    .exists()
    .withMessage("Invalid Input for Source")
    .isString()
    .withMessage("Source field value should be a string"),
  query("destination")
    .exists()
    .withMessage("Invalid Input for Destination")
    .isString()
    .withMessage("Destination field value should be a string"),
  validate,
  asyncHandler(ReviewHandler.getAllRouteReview)
);

router.get(
  "/review/1",
  asyncHandler(
    getOrUpdateCache(ReviewHandler.getSentimentAndProductInfoAggregate)
  )
);

router.get(
  "/review/2",
  asyncHandler(getOrUpdateCache(ReviewHandler.routeSentimentAnalysisAggregate))
);

router.get(
  "/review/3",
  asyncHandler(
    getOrUpdateCache(ReviewHandler.inflightAmenitiesSentimentAnalysisAggregate)
  )
);

router.get(
  "/review/4",
  asyncHandler(
    getOrUpdateCache(ReviewHandler.typeOfTravellerSentimentAnalysisAggregate)
  )
);

module.exports = router;
