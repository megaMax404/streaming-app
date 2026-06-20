const validator = require("validator");

function sanitizeString(value) {
  if (typeof value !== "string") return value;
  return validator.escape(value.trim());
}

function sanitizeObject(obj) {
  const sanitized = {};

  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      sanitized[key] = obj[key].map(item =>
        typeof item === "string"
          ? sanitizeString(item)
          : item
      );
    } else {
      sanitized[key] = sanitizeString(obj[key]);
    }
  }

  return sanitized;
}

module.exports = {
  sanitizeString,
  sanitizeObject,
};