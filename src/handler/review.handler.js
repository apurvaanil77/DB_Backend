const ReviewModel = require("../models/reviews");
const {
  sentimentAggregateQuery,
  SentimentAndProductInfoAggregateQuery,
  routeSentimentAnalysisAggregateQuery,
  inflightAmenitiesSentimentAnalysisAggregateQuery,
  typeOfTravellerSentimentAnalysisAggregateQuery,
} = require("../queries/review");

const getAggregateResult = async (matchCriteria, aggregateQuery) => {
  return await ReviewModel.aggregate([
    {
      $match: matchCriteria,
    },
    ...aggregateQuery,
  ]).exec();
};

const formatAggregateResult = (result) => {
  return result.map(({ airlineInfo }) => {
    const sentimentDistribution = airlineInfo.sentimentDistribution;
    return {
      airline: airlineInfo.airline,
      averageRating: airlineInfo.averageRating,
      totalReviews: airlineInfo.totalReviews,
      totalRecommended: airlineInfo.totalRecommended,
      recommendationRate: airlineInfo.recommendationRate,
      overallSentiment: sentimentDistribution["overall sentiment"],
      overallScore: sentimentDistribution["overall score"],
      overallRating: sentimentDistribution["overall rating"],
    };
  });
};

const ReviewHandler = {
  getAllReviews: async (req, res) => {
    try {
      const result = await ReviewModel.find({});

      return result;
    } catch (err) {
      throw err;
    }
  },

  getAllCities: async (req, res) => {
    try {
      const uniqueCities = [];

      const toCities = await ReviewModel.distinct("destination").exec();
      uniqueCities.push(...toCities);

      const fromCities = await ReviewModel.distinct("source").exec();
      uniqueCities.push(...fromCities);

      const filteredCities = uniqueCities.filter((city) => city !== null);

      const result = [...new Set(filteredCities)].map((a) => a.trim());

      return result;
    } catch (err) {
      throw err;
    }
  },

  getAllRouteReview: async (req, res) => {
    try {
      const { source, destination } = req.query;
      const matchCriteria = {};

      if (source) matchCriteria.source = source;
      if (destination) matchCriteria.destination = destination;

      const matchRes = await ReviewModel.aggregate([
        {
          $match: matchCriteria,
        },
      ]).exec();

      if (!matchRes.length) {
        return res.json({ noResult: true });
      }

      const [
        sentimentAndProductRes,
        routeSentimentResult,
        inflightAmenitiesResult,
        typeOfTravellerResult,
      ] = await Promise.all([
        getAggregateResult(
          matchCriteria,
          SentimentAndProductInfoAggregateQuery
        ),
        getAggregateResult(matchCriteria, routeSentimentAnalysisAggregateQuery),
        getAggregateResult(
          matchCriteria,
          inflightAmenitiesSentimentAnalysisAggregateQuery
        ),
        getAggregateResult(
          matchCriteria,
          typeOfTravellerSentimentAnalysisAggregateQuery
        ),
      ]);

      const formatedRes = formatAggregateResult(sentimentAndProductRes);

      return res.json({
        1: formatedRes,
        2: routeSentimentResult,
        3: inflightAmenitiesResult,
        4: typeOfTravellerResult,
      });
    } catch (err) {
      throw err;
    }
  },

  getSentimentAndProductInfoAggregate: async (req, res) => {
    try {
      const result = await ReviewModel.aggregate(
        SentimentAndProductInfoAggregateQuery
      ).exec();

      const transformedResult = result.map(({ airlineInfo }) => {
        const sentimentDistribution = airlineInfo.sentimentDistribution;
        return {
          airline: airlineInfo.airline,
          averageRating: airlineInfo.averageRating,
          totalReviews: airlineInfo.totalReviews,
          totalRecommended: airlineInfo.totalRecommended,
          recommendationRate: airlineInfo.recommendationRate,
          overallSentiment: sentimentDistribution["overall sentiment"],
          overallScore: sentimentDistribution["overall score"],
          overallRating: sentimentDistribution["overall rating"],
        };
      });

      return transformedResult;
    } catch (err) {
      throw err;
    }
  },

  routeSentimentAnalysisAggregate: async (req, res) => {
    try {
      const result = await ReviewModel.aggregate(
        routeSentimentAnalysisAggregateQuery
      ).exec();

      return result;
    } catch (err) {
      throw err;
    }
  },

  inflightAmenitiesSentimentAnalysisAggregate: async (req, res) => {
    try {
      const result = await ReviewModel.aggregate(
        inflightAmenitiesSentimentAnalysisAggregateQuery
      ).exec();

      return result;
    } catch (err) {
      throw err;
    }
  },

  typeOfTravellerSentimentAnalysisAggregate: async (req, res) => {
    try {
      const result = await ReviewModel.aggregate(
        typeOfTravellerSentimentAnalysisAggregateQuery
      ).exec();
      return result;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = ReviewHandler;
