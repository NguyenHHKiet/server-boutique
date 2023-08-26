const { Server } = require("socket.io");
let io;

const whitelist = ["http://localhost:3000", "http://localhost:5173"];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST"],
};

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: corsOptions,
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    },
};
