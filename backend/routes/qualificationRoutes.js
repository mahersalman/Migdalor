const express = require("express");
const router = express.Router();
const Qualification = require("../models/Qualification");
const Person = require("../models/Person");

// Get all qualifications
router.get("/qualifications", async (req, res) => {
  try {
    console.log("Fetching qualifications...");
    const qualifications = await Qualification.find({});
    console.log("Qualifications found:", qualifications.length);
    console.log("Sample qualification:", qualifications[0]);
    res.json(qualifications);
  } catch (error) {
    console.error("Error fetching qualifications:", error);
    res.status(500).json({
      message: "Error fetching qualifications",
      error: error.message,
    });
  }
});

// Create new qualification
router.post("/qualifications", async (req, res) => {
  try {
    const { person_id, station_name, avg } = req.body;
    const newQualification = new Qualification({
      person_id,
      station_name,
      avg,
    });
    const savedQualification = await newQualification.save();
    res.status(201).json(savedQualification);
  } catch (error) {
    console.error("Error saving qualification:", error);
    res.status(500).json({
      message: "Error saving qualification",
      error: error.message,
    });
  }
});

// Update or create employee qualifications
router.put("/qualifications", async (req, res) => {
  try {
    const { person_id, station_name, avg } = req.body;
    console.log("Received qualification update request:", {
      person_id,
      station_name,
      avg,
    });

    // First, find the person by their person_id
    const person = await Person.findOne({ person_id });
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    // Find and update the qualification, or create a new one if it doesn't exist
    const qualification = await Qualification.findOneAndUpdate(
      { person_id: person.person_id, station_name },
      { avg },
      { new: true, upsert: true }
    );

    console.log("Qualification updated:", qualification);
    res.json(qualification);
  } catch (error) {
    console.error("Error updating qualification:", error);
    res.status(500).json({
      message: "Error updating qualification",
      error: error.message,
    });
  }
});

// Get employee qualifications
router.get("/qualifications/:employeeId", async (req, res) => {
  try {
    console.log(
      "Fetching qualifications for employeeId:",
      req.params.employeeId
    );
    const qualifications = await Qualification.find({
      person_id: req.params.employeeId,
    });
    console.log("Qualifications found:", qualifications);
    res.json(qualifications);
  } catch (error) {
    console.error("Error fetching qualifications:", error);
    res.status(500).json({
      message: "Error fetching qualifications",
      error: error.message,
    });
  }
});

module.exports = router;
