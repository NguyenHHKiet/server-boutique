const { Server } = require("socket.io");
let io;

const whitelist = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://server-boutique-tau.vercel.app",
    "https://client-boutique.vercel.app",
    "https://admin-boutique.vercel.app",
];
const corsOptions = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.header("Origin")) !== -1) {
        corsOptions = {
            origin: true,
            credentials: true,
            methods: ["GET", "POST"],
        }; // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
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
