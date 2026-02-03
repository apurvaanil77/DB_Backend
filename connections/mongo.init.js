require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_REVIEWS_DB, {});

const reviewsDB = mongoose.connection;

reviewsDB.on("connected", () => {
  console.log("Connected to MongoDB");
});

reviewsDB.on("connecting", () => {
  console.log("Connecting to MongoDB");
});

reviewsDB.on("disconnecting", () => {
  console.log("Disconnecting to MongoDB");
});

reviewsDB.on("error", (error) => {
  console.error("MongoDB Connection Error:", error);
});

// Connection disconnected
reviewsDB.on("disconnected", () => {
  console.log("MongoDB Connection Disconnected");
});

function disconnect() {
  reviewsDB.destroy((err) => {
    if (err) console.log(err);
  });
}

module.exports = {
  reviewsDB,
  disconnect,
};
