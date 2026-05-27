const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  getUsers,
  createUser,
  login,
  getProfile
} = require("../controllers/userController");

router.get("/", getUsers);

router.post("/", createUser);

router.post("/login", login);

router.get("/profile", auth, getProfile);

module.exports = router;