const { inMemoryCache } = require("../../connections/cache.init");

const getOrUpdateCache = (queryFn) => {
  return async (req, res) => {
    const cacheKey = `nodecache_query_${queryFn.name}`;

    let cachedData = inMemoryCache.get(cacheKey);

    if (cachedData) return res.json(cachedData);

    try {
      const data = await queryFn(req, res);

      inMemoryCache.set(
        cacheKey,
        data,
        10 * 60 // 10 min
      );

      return res.json(data);
    } catch (err) {
      throw err;
    }
  };
};

module.exports = { getOrUpdateCache };
