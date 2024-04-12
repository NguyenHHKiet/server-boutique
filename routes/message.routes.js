const express = require("express");
const {
    getRoom,
    getRooms,
    postCreateRoom,
    postMessage,
} = require("../controllers/message.controller");

const router = express.Router();

router.route("/").get(getRooms).post(postCreateRoom);

router.get("/room", getRoom);
router.get("/message", postMessage);

module.exports = router;
