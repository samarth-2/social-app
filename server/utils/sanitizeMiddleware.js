
const sanitizeHtml = require("sanitize-html");

function sanitizeInput(data) {
  if (typeof data === "string") {
    return sanitizeHtml(data, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();
  } else if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  } else if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitizeInput(value)])
    );
  }
  return data;
}

function sanitizeMiddleware(req, res, next) {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.params) req.params = sanitizeInput(req.params);
  next();
}

module.exports = sanitizeMiddleware;
