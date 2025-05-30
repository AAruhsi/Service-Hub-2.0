const validator = require("validator");

const validatePatchRequest = (req, res, next) => {
  try {
    const { firstName, lastName, gender, phoneNo, address } = req.body;

    if (firstName !== undefined) {
      if (!validator.isAlpha(firstName, "en-US", { ignore: " " })) {
        throw new Error("First name must contain only letters.");
      }
    }

    if (lastName !== undefined) {
      if (!validator.isAlpha(lastName, "en-US", { ignore: " " })) {
        throw new Error("Last name must contain only letters.");
      }
    }

    if (gender !== undefined) {
      const allowedGenders = ["male", "female", "other"];
      if (!allowedGenders.includes(gender.toLowerCase())) {
        throw new Error("Gender must be 'male', 'female', or 'other'.");
      }
    }
    if (phoneNo != undefined) {
      if (!/^\d{10}$/.test(phoneNo)) {
        return res
          .status(400)
          .json({ message: "Phone number must be exactly 10 digits" });
      }
    }

    if (address !== undefined) {
      if (!validator.isLength(address, { min: 5 })) {
        throw new Error("Address must be at least 5 characters long.");
      }
    }

    next(); // All validations passed
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = { validatePatchRequest };
