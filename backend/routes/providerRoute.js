const express = require("express");
const ProviderAvailability = require("../models/ProviderAvailability");

const providerRouter = express.Router();

providerRouter.post("/availability/:id", async (req, res) => {
  try {
    const { availability } = req.body;
    const { id } = req.params;

    const providerExist = await ProviderAvailability.findOne({
      providerId: id,
    });

    if (providerExist) {
      const updating = await ProviderAvailability.findByIdAndUpdate(
        providerExist._id,
        { availability },
        { new: true }
      );
      res.json({ message: "Availability updated", data: updating });
    } else {
      const newtiming = new ProviderAvailability({
        providerId: id,
        availability,
      });
      await newtiming.save();
      res.send("Service Added to your name");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("Something went wrong");
  }
});

providerRouter.get("/availability/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const Data = await ProviderAvailability.find({ providerId: id });

    res.json({ message: "Data fetched successfully", data: Data });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(400).send(error);
  }
});

providerRouter.patch("/:id", async (req, res) => {
  try {
    const { price } = req.body;
    const { id } = req.params;

    if (!id) res.status(400).send("Incomplete details");

    const serviceData = await ServiceOffered.findByIdAndUpdate(
      id,
      { price },
      { new: true }
    );

    res.json({ message: "Data updated successfully", data: serviceData });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(400).send(error);
  }
});

module.exports = { providerRouter };
