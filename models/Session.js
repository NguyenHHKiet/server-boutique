const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    expires: { type: Date, required: true },
    session: {
        chat: [
            {
                text: { type: String, required: true },
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    default: "123456789",
                },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
});

module.exports = mongoose.model("Session", messageSchema);
