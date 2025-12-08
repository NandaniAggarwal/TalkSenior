const sanitizeHtml = require("sanitize-html");

const sanitize = (dirty) => {
  return sanitizeHtml(dirty || "", {
    allowedTags: ["b", "i", "strong", "a"],        // no HTML tags allowed
    allowedAttributes: {a: ["href"]},  // no attributes
    textFilter: function (text) {
      return text.trim();
    },
  });
};

module.exports = sanitize;