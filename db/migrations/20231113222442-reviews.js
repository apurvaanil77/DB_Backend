/* eslint-disable valid-typeof */
const reviews = require("../migrationData/reviews.json");
const Review = require("../../src/models/reviews"); // Adjust the path accordingly

module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    const schemaKeys = Object.keys(Review.schema.paths);

    const splitRoute = (route) => {
      if (!route) return "";

      const cities = route.split(" to ");

      let from = cities[0];
      let to = cities[1];

      const viaIndex = to?.indexOf(" via ");
      if (viaIndex !== -1) {
        to = to?.substring(0, viaIndex);
      }

      return { from, to };
    };

    const convertValue = (key, value, targetType) => {
      switch (targetType) {
        case "Number":
          return Number(value);
        case "Date":
          return new Date(value);
        case "Boolean":
          return key === "recommended"
            ? value.toLowerCase() === "yes"
            : value.toLowerCase() === "true";
        case "String":
          return value.replace(/"/g, "").trim();
        default:
          return value;
      }
    };

    reviews.forEach((row) => {
      delete row.id;
      schemaKeys.forEach((key) => {
        if (
          row[key] !== undefined &&
          typeof row[key] !== Review.schema.paths[key].instance
        ) {
          row[key] = convertValue(
            key,
            row[key],
            Review.schema.paths[key].instance
          );
        }
      });

      const { from, to } = splitRoute(row.route);
      row.source = from;
      row.destination = to;
    });

    await db.collection("reviews").insertMany(reviews);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection("reviews").deleteMany({});
  },
};
