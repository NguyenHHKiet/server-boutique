const express = require("express");
const messageController = require("../controllers/message.controller");

const router = express.Router();

router.get("/", messageController.getRooms);
router.post("/", messageController.postCreateRoom);
router.get("/room", messageController.getRoom);
router.get("/message", messageController.postMessage);

module.exports = router;
