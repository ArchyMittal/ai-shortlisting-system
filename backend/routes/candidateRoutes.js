const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

router.post("/", async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;