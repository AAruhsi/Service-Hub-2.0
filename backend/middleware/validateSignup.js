const validator = require("validator");

const validateUserSignup = (req, res, next) => {
  const { firstName, lastName, email, phoneNo, password, gender, address } =
    req.body;
  if (!firstName || !email || !phoneNo || !password || !gender || !address) {
    return res.status(400).send("All fields are required");
  }
  if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid Credentails");
  }
  // Validate phone number (basic check for 10 digits)
  if (!validator.isMobilePhone(phoneNo, "any")) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  // Password strength (optional)
  if (!validator.isStrongPassword(password, { minLength: 6 })) {
    return res.status(400).json({ message: "Password is too weak" });
  }
  next();
};
module.exports = { validateUserSignup };
