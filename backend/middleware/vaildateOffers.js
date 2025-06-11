const validateOfferreq = (req, res, next) => {
  const { title, discountValue, validFrom, validTill, applicableServiceIds } =
    req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res
      .status(400)
      .send("Title is required and must be a non-empty string");
  }

  if (typeof discountValue !== "number" || discountValue <= 0) {
    return res.status(400).send("Discount value must be a positive number.");
  }

  if (validFrom && isNaN(Date.parse(validFrom))) {
    return res.status(400).send("validFrom must be a valid date.");
  }

  if (validTill && isNaN(Date.parse(validTill))) {
    return res.status(400).send("validTill must be a valid date.");
  }

  if (validFrom && validTill && new Date(validTill) < new Date(validFrom)) {
    return res.status(400).send("validTill must be after validFrom.");
  }

  if (applicableServiceIds && !Array.isArray(applicableServiceIds)) {
    return res.status(400).send("applicableServiceIds must be an array.");
  }

  next();
};

module.exports = { validateOfferreq };
