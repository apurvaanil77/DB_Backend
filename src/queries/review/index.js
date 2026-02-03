const { sentiment } = require("../../services");

const sentimentAggregateQuery = [
  {
    $addFields: {
      reviewSentimentScore: {
        $function: {
          body: sentiment.toString(),
          args: ["$review"],
          lang: "js",
        },
      },
    },
  },
  {
    $addFields: {
      reviewSentiment: {
        $cond: {
          if: { $eq: [0, "$reviewSentimentScore"] },
          then: "neutral",
          else: {
            $cond: {
              if: {
                $gt: ["$reviewSentimentScore", 0],
              },
              then: "positive",
              else: "negative",
            },
          },
        },
      },
    },
  },
];

const SentimentAndProductInfoAggregateQuery = [
  ...sentimentAggregateQuery,
  {
    $project: {
      _id: 0,
      name: 1,
      rating: 1,
      review: 1,
      recommended: 1,
      reviewSentiment: 1,
      reviewSentimentScore: 1,
    },
  },
  {
    $group: {
      _id: "$name",
      averageRating: { $avg: "$rating" },
      totalReviews: { $sum: 1 },
      sentimentDistribution: {
        $push: {
          sentiment: "$reviewSentiment",
          score: "$reviewSentimentScore",
          rating: "$rating",
        },
      },
      totalRecommended: {
        $sum: {
          $cond: [{ $eq: ["$recommended", true] }, 1, 0],
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      airlineInfo: {
        airline: "$_id",
        averageRating: "$averageRating",
        totalReviews: "$totalReviews",
        totalRecommended: "$totalRecommended",
        recommendationRate: {
          $cond: [
            { $ne: ["$totalReviews", 0] },
            {
              $divide: ["$totalRecommended", "$totalReviews"],
            },
            0,
          ],
        },
        sentimentDistribution: {
          $map: {
            input: "$sentimentDistribution",
            as: "sentiment",
            in: {
              "overall sentiment": "$$sentiment.sentiment",
              "overall score": "$$sentiment.score",
              "overall rating": "$$sentiment.rating",
            },
          },
        },
      },
    },
  },
  {
    $unwind: "$airlineInfo.sentimentDistribution",
  },
  {
    $group: {
      _id: "$airlineInfo.airline",
      airlineInfo: {
        $first: "$airlineInfo",
      },
      sentimentDistribution: {
        $push: "$airlineInfo.sentimentDistribution",
      },
    },
  },
  {
    $project: {
      _id: 0,
      airlineInfo: 1,
    },
  },
  {
    $sort: { "airlineInfo.totalRecommended": -1 },
  },
  { $limit: 20 },
];

const routeSentimentAnalysisAggregateQuery = [
  ...sentimentAggregateQuery,
  {
    $project: {
      _id: 0,
      route: 1,
      rating: 1,
      reviewSentiment: 1,
      reviewSentimentScore: 1,
      seatComfortRating: 1,
      foodBeveragesRating: 1,
    },
  },
  {
    $unwind: "$reviewSentiment",
  },
  {
    $group: {
      _id: {
        route: "$route",
        sentiment: "$reviewSentiment",
      },
      averageRating: { $avg: "$rating" },
      seatComfortRating: { $avg: "$seatComfortRating" },
      foodBeveragesRating: { $avg: "$foodBeveragesRating" },
      totalReviews: { $sum: 1 },
      totalScore: { $sum: "$reviewSentimentScore" },
    },
  },
  {
    $group: {
      _id: "$_id.route",
      sentimentDistribution: {
        $push: {
          sentiment: {
            $cond: [{ $gte: ["$_id.sentiment", 3] }, "positive", "negative"],
          },
          averageRating: "$averageRating",
          seatComfortRating: "$seatComfortRating",
          foodBeveragesRating: "$foodBeveragesRating",
          totalReviews: "$totalReviews",
        },
      },
      overallScore: { $avg: "$totalScore" },
    },
  },
  {
    $project: {
      route: "$_id",
      _id: 0,
      totalReviews: { $sum: "$sentimentDistribution.totalReviews" },
      averageRating: { $avg: "$sentimentDistribution.averageRating" },
      seatComfortRating: {
        $avg: "$sentimentDistribution.seatComfortRating",
      },
      foodBeveragesRating: {
        $avg: "$sentimentDistribution.foodBeveragesRating",
      },
      overallScore: 1,
    },
  },

  {
    $project: {
      overallScore: 1,
      route: 1,
      totalReviews: 1,
      averageRating: 1,
      seatComfortRating: 1,
      foodBeveragesRating: 1,
    },
  },
  {
    $sort: { totalReviews: -1 },
  },
  { $limit: 20 },
];

const inflightAmenitiesSentimentAnalysisAggregateQuery = [
  ...sentimentAggregateQuery,
  {
    $project: {
      _id: 0,
      name: 1,
      inflightEntertainmentRating: 1,
      wifiAndConnectivityRating: 1,
      reviewSentiment: 1,
      rating: 1,
      recommended: 1,
      reviewSentimentScore: 1,
    },
  },
  {
    $group: {
      _id: {
        name: "$name",
      },
      averageRating: { $avg: "$rating" },
      totalReviews: { $sum: 1 },
      sentimentDistribution: {
        $push: {
          sentiment: "$reviewSentiment",
          sentimentScore: "$reviewSentimentScore",
          inflightEntertainment: "$inflightEntertainmentRating",
          wifiAndConnectivity: "$wifiAndConnectivityRating",
        },
      },
      totalRecommended: {
        $sum: {
          $cond: [{ $eq: ["$recommended", true] }, 1, 0],
        },
      },
    },
  },
  {
    $project: {
      _id: 0, // Exclude _id field
      name: "$_id.name",
      inflightEntertainmentRating: {
        $avg: "$sentimentDistribution.inflightEntertainment",
      },
      sentimentScore: {
        $avg: "$sentimentDistribution.sentimentScore",
      },
      wifiAndConnectivityRating: {
        $avg: "$sentimentDistribution.wifiAndConnectivity",
      },
      averageRating: 1,
      totalReviews: 1,
      totalRecommended: 1,
      recommendationRate: {
        $cond: [
          { $ne: ["$totalReviews", 0] },
          {
            $divide: ["$totalRecommended", "$totalReviews"],
          },
          0,
        ],
      },
    },
  },
  {
    $sort: {
      totalRecommended: -1,
    },
  },
  { $limit: 20 },
];

const typeOfTravellerSentimentAnalysisAggregateQuery = [
  ...sentimentAggregateQuery,
  {
    $project: {
      _id: 0,
      travellerType: 1,
      seatComfortRating: 1,
      groundServiceRating: 1,
      valueForMoneyRating: 1,
      reviewSentiment: 1,
      rating: 1,
      reviewSentimentScore: 1,
    },
  },
  {
    $group: {
      _id: "$travellerType",
      averageRating: { $avg: "$rating" },
      totalReviews: { $sum: 1 },
      sentimentDistribution: {
        $push: {
          sentiment: "$reviewSentiment",
          sentimentScore: "$reviewSentimentScore",
          rating: "$rating",
        },
      },
      seatComfortRating: { $avg: "$seatComfortRating" },
      groundServiceRating: { $avg: "$groundServiceRating" },
      valueForMoneyRating: { $avg: "$valueForMoneyRating" },
    },
  },
  {
    $project: {
      travellerType: "$_id",
      _id: 0,
      sentimentScore: {
        $avg: "$sentimentDistribution.sentimentScore",
      },
      averageRating: 1,
      totalReviews: 1,
      // sentimentDistribution: 1,
      seatComfortRating: 1,
      groundServiceRating: 1,
      valueForMoneyRating: 1,
    },
  },
  {
    $sort: { averageRating: -1 },
  },
];

module.exports = {
  sentimentAggregateQuery,
  SentimentAndProductInfoAggregateQuery,
  routeSentimentAnalysisAggregateQuery,
  inflightAmenitiesSentimentAnalysisAggregateQuery,
  typeOfTravellerSentimentAnalysisAggregateQuery,
};
