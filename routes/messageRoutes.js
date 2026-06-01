const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

const messageValidator = require("../middlewares/messageValidator");

router.post("/create", messageValidator, messageController.createMessage);

module.exports = router;