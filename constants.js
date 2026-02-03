const allowedHeaders = [
  "content-type",
  "Content-Range",
  "Range",
  "authorization",
];

const exposedHeaders = [
  "Accept-Ranges",
  "Content-Encoding",
  "Content-Length",
  "Content-Range",
  "Content-Disposition",
];

module.exports = {
  allowedHeaders,
  exposedHeaders,
  SKIP_CORS_HEADER: "X-Skip-Cors",
};
