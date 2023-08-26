const Session = require("../models/Session");
const users = [];

const addUser = (socketId) => {
    !users.some((user) => user.socketId === socketId) &&
        users.push({ socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (socketId) => {
    return users.find((user) => user.socketId === socketId);
};

exports.getRooms = (req, res, next) => {
    res.status(200).json({ users });
};

exports.getRoom = (req, res, next) => {
    const socketId = req.body.socketId;
};

exports.postCreateRoom = (req, res, next) => {
    addUser(req.session.csrfSecret);
    res.status(201).json({ message: "Room created successfully" });
};

exports.postMessage = (req, res, next) => {
    const message = req.body.message;

    const session = new Session({ text: message, sender: req.user._id });
    session
        .save()
        .then((result) => {
            req.session.chat.push(result);
            res.status(201).json({
                message: "Send message successfully",
                text: result,
            });
        })
        .catch((error) => console.log(error));
};
