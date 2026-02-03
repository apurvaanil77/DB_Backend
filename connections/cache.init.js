const NodeCache = require("node-cache");

const inMemoryCache = new NodeCache({
  useClones: false,
  stdTTL: 60 * 60 * 24,
  deleteOnExpire: true,
});

const closeInMemoryCache = () => {
  inMemoryCache.close();
};

module.exports = {
  inMemoryCache,
  closeInMemoryCache,
};
