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
      .populate("applicableSubcategoryIds", "name") // populate just the 'name' field
      .exec();
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
module.exports = { orderRouter };
