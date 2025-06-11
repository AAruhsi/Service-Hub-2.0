const express = require("express");
const Offer = require("../models/Offer");
const offerRouter = express.Router();
const { validateOfferreq } = require("../middleware/vaildateOffers");

const mongoose = require("mongoose");

// POST /api/offers
offerRouter.post("/", validateOfferreq, async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/offers
offerRouter.get("/", async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate("applicableSubcategoryIds", "name") // populate just the 'name' field
      .exec();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/offers
offerRouter.get("/getvalidOffers/:subCatId", async (req, res) => {
  try {
    const { subCatId } = req.params;

    // Make sure subCatId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(subCatId)) {
      return res.status(400).json({ error: "Invalid subcategory ID" });
    }

    const offers = await Offer.find({
      applicableSubcategoryIds: subCatId, // MongoDB auto-handles ObjectId cast
    })
      .populate("applicableSubcategoryIds", "name")
      .exec();

    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

offerRouter.patch("/:id", validateOfferreq, async (req, res) => {
  try {
    const offerId = req.params.id;
    const {
      title,
      description,
      discountValue,
      validFrom,
      validTill,
      isActive,
      couponCode,
      applicableSubcategoryIds,
    } = req.body;
    const updatedOffer = await Offer.findByIdAndUpdate(
      offerId,
      {
        title,
        description,
        discountValue,
        validFrom,
        validTill,
        isActive,
        couponCode,
        applicableSubcategoryIds,
      },
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    res.json({ message: "Offer updated successfully", data: updatedOffer });
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { offerRouter };
