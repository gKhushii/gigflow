const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createGig, getGigs, getSingleGig } = require("../controllers/gigController");

router.post("/", protect, createGig);      // create gig
router.get("/", getGigs);                   // browse gigs + search
router.get("/:id", getSingleGig);            // single gig

module.exports = router;
