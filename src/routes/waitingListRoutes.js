const express = require("express");

const router = express.Router();

const {
  getWaitingList,
  createWaiting
} = require("../controllers/waitingListController");

router.get("/", getWaitingList);

router.post("/", createWaiting);

module.exports = router;