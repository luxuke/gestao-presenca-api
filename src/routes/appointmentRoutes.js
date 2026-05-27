const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  getAppointments,
  createAppointment,
  updateAppointmentStatus
} = require("../controllers/appointmentController");

router.get("/", auth, getAppointments);

router.post("/", auth, createAppointment);

router.patch("/:id/status", auth, updateAppointmentStatus);

module.exports = router;