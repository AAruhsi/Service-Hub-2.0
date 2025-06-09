const express = require("express");
const ServiceOffered = require("../models/category offered/ServiceOffered");
const serviceOfferedRouter = express.Router();

serviceOfferedRouter.post("/add", async (req, res) => {
  try {
    const { serviceId, providerId, price } = req.body;

    const newService = new ServiceOffered({ serviceId, providerId, price });
    await newService.save();
    res.send("Service Added to your name");
  } catch (error) {
    res.status(400).send(error);
  }
});

serviceOfferedRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const serviceData = await ServiceOffered.find({ providerId: id }).populate({
      path: "serviceId",
      populate: {
        path: "subcategoryId",
        populate: {
          path: "categoryId",
        },
      },
    });

    res.json({ message: "Data fetched successfully", data: serviceData });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(400).send(error);
  }
});

serviceOfferedRouter.patch("/:id", async (req, res) => {
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

serviceOfferedRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) res.status(400).send("Incomplete details");

    await ServiceOffered.findByIdAndDelete(id);

    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(400).send(error);
  }
});
module.exports = { serviceOfferedRouter };
