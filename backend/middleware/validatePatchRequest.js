const validatePatchRequest = (req, res, next) => {
  try {
    const { firstName, lastName, gender, phoneNo, address } = req.body;
  } catch (error) {
    res.status(400).send("Error in the code" + error);
  }
};
module.exports = { validatePatchRequest };
