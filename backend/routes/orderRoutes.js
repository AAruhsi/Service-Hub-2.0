const express = require("express");
const orderRouter = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");

// POST /api/offers
orderRouter.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ err });
  }
});

// GET /api/offers
orderRouter.get("/", async (req, res) => {
  try {
    const offers = await Order.find()
      .populate("provider")
      .populate("service")
      .populate("offer");

    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

orderRouter.get("/:providerId", async (req, res) => {
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

orderRouter.get("/customer/:id", async (req, res) => {
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

orderRouter.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: "COMPLETED" },
      { new: true }
    );
    res.json({ message: "Order Completed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

orderRouter.patch("/isRated", async (req, res) => {
  try {
    const { isRated } = req.body;
    const order = await Order.findByIdAndUpdate(id, { isRated }, { new: true });
    res.json({ message: "Order Completed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { orderRouter };
