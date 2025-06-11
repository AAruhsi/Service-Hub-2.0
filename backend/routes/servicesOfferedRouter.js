const express = require("express");
const ServiceOffered = require("../models/category offered/ServiceOffered");
const serviceOfferedRouter = express.Router();
const moment = require("moment"); // For date-to-day conversion

const ProviderAvailability = require("../models/ProviderAvailability");

serviceOfferedRouter.post("/add", async (req, res) => {
  try {
    const { serviceId, providerId, price } = req.body;
    const serviceExists = await ServiceOffered.find({
      serviceId: serviceId,
      providerId: providerId,
    });

    if (serviceExists) res.send("ServiceAlready Exists");
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
    const data = await ServiceOffered.find({ providerId: id })
      .populate("providerId")
      .populate({
        path: "serviceId",
        populate: {
          path: "subcategoryId",
          populate: {
            path: "categoryId",
          },
        },
      });
    res.json({ message: "data sent ", data: data });
  } catch (error) {
    res.status(404).send(error);
  }
});

serviceOfferedRouter.get("/:serviceId/:date/:time", async (req, res) => {
  try {
    const { serviceId, date, time } = req.params;

    // Step 1: Get all ServiceOffered objects for the service
    const serviceOfferedList = await ServiceOffered.find({
      serviceId,
    }).populate("providerId");

    if (!serviceOfferedList.length) {
      return res
        .status(404)
        .json({ message: "No providers offer this service." });
    }

    // Step 2: Extract providerIds
    const providerIds = serviceOfferedList.map(
      (s) => s.providerId._id || s.providerId
    );

    // Step 3: Determine the day of the week
    const dayOfWeek = moment(date).format("dddd"); // e.g. "Monday"

    // Step 4: Get availabilities
    const availabilities = await ProviderAvailability.find({
      providerId: { $in: providerIds },
      [`availability.${dayOfWeek}.${time}`]: true,
    }).populate("providerId");

    // Optional: filter ServiceOffered to only include available ones
    const availableProviderIds = availabilities.map((a) =>
      a.providerId._id.toString()
    );

    const filteredServiceOffered = serviceOfferedList.filter((s) =>
      availableProviderIds.includes(s.providerId._id.toString())
    );

    res.json({
      message:
        "Available service offerings and providers fetched successfully.",
      serviceOffered: filteredServiceOffered,
    });
  } catch (error) {
    console.error("Error fetching available providers:", error);
    res.status(500).json({ message: "Internal server error", error });
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
