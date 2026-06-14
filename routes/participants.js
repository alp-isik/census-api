const express = require("express");
const router = express.Router();
const basicAuth = require("../middleware/auth");
const Participant = require("../models/Participant");
const Work = require("../models/Work");
const Home = require("../models/Home");

router.use(basicAuth);

// POST /participants/add
router.post("/add", async (req, res) => {
  try {
    const { participant, work, home } = req.body;

    // Validate objects exist
    if (!participant || !work || !home) {
      return res.status(400).json({
        status: "error",
        message: "participant, work and home are required",
      });
    }

    const { email, firstname, lastname, dob } = participant;
    const { companyname, salary, currency } = work;
    const { country, city } = home;

    // Validate fields exist
    if (
      !email ||
      !firstname ||
      !lastname ||
      !dob ||
      !companyname ||
      !salary ||
      !currency ||
      !country ||
      !city
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email format" });
    }

    // Validate DOB format
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(dob)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid DOB format, use YYYY-MM-DD",
      });
    }

    await Participant.create({ email, firstname, lastname, dob });
    await Work.create({ companyname, salary, currency, email });
    await Home.create({ country, city, email });

    const result = await Participant.findOne({
      where: { email },
      include: [Work, Home],
    });

    res
      .status(201)
      .json({ status: "success", message: "Participant added", data: result });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /participants
router.get("/", async (req, res) => {
  try {
    const participants = await Participant.findAll({ include: [Work, Home] });
    res.json({ status: "success", data: participants });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /participants/details
router.get("/details", async (req, res) => {
  try {
    const participants = await Participant.findAll({
      attributes: ["firstname", "lastname", "email"],
    });
    res.json({ status: "success", data: participants });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /participants/details/:email
router.get("/details/:email", async (req, res) => {
  try {
    const participant = await Participant.findOne({
      where: { email: req.params.email },
      attributes: ["firstname", "lastname", "dob"],
    });
    if (!participant)
      return res
        .status(404)
        .json({ status: "error", message: "Participant not found" });
    res.json({ status: "success", data: participant });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /participants/work/:email
router.get("/work/:email", async (req, res) => {
  try {
    const work = await Work.findOne({
      where: { email: req.params.email },
      attributes: ["companyname", "salary", "currency"],
    });
    if (!work)
      return res
        .status(404)
        .json({ status: "error", message: "Work details not found" });
    res.json({ status: "success", data: work });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /participants/home/:email
router.get("/home/:email", async (req, res) => {
  try {
    const home = await Home.findOne({
      where: { email: req.params.email },
      attributes: ["country", "city"],
    });
    if (!home)
      return res
        .status(404)
        .json({ status: "error", message: "Home details not found" });
    res.json({ status: "success", data: home });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// PUT /participants/:email
router.put("/:email", async (req, res) => {
  try {
    const { participant, work, home } = req.body;

    // Validate objects exist
    if (!participant || !work || !home) {
      return res.status(400).json({
        status: "error",
        message: "participant, work and home are required",
      });
    }

    const { firstname, lastname, dob } = participant;
    const { companyname, salary, currency } = work;
    const { country, city } = home;

    // Validate fields exist
    if (
      !firstname ||
      !lastname ||
      !dob ||
      !companyname ||
      !salary ||
      !currency ||
      !country ||
      !city
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }

    // Validate DOB format
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(dob)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid DOB format, use YYYY-MM-DD",
      });
    }

    const existingParticipant = await Participant.findOne({
      where: { email: req.params.email },
    });
    if (!existingParticipant)
      return res
        .status(404)
        .json({ status: "error", message: "Participant not found" });

    await existingParticipant.update({ firstname, lastname, dob });
    await Work.update(
      { companyname, salary, currency },
      { where: { email: req.params.email } },
    );
    await Home.update(
      { country, city },
      { where: { email: req.params.email } },
    );

    res.json({ status: "success", message: "Participant updated" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE /participants/:email
router.delete("/:email", async (req, res) => {
  try {
    const participant = await Participant.findOne({
      where: { email: req.params.email },
    });
    if (!participant)
      return res
        .status(404)
        .json({ status: "error", message: "Participant not found" });
    await participant.destroy();
    res.json({ status: "success", message: "Participant deleted" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
