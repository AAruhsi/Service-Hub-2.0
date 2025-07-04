const express = require("express");
const Review = require("../models/Review");
const reviewRouter = express.Router();

reviewRouter.post("/", async (req, res) => {
  try {
    const { serviceId, orderId, providerId, userId, rating, comment } =
      req.body;

    if (!serviceId || !orderId || !providerId || !userId)
      res.status(400).send("Invalid Credentials");
    const newreview = new Review({
      serviceId,
      orderId,
      providerId,
      userId,
      rating,
      comment,
    });
    await newreview.save();
    res.status(201).json("Review Saved");
  } catch (err) {
    res.status(400).json({ err });
  }
});

reviewRouter.get("/getallreviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

reviewRouter.get("/:providerId", async (req, res) => {
  try {
    const { providerId } = req.params;
    const reviews = await Review.find({ providerId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

reviewRouter.get("/:providerId", async (req, res) => {
  try {
    const { providerId } = req.params;

    const offers = await Order.find({ provider: providerId })
      .populate("customer")
      .populate("service");

    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

reviewRouter.get("/customer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ customer: id })
      .populate("provider")
      .populate("service");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { reviewRouter };
