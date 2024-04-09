const socketIO = (server) => {
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on("join_room", (data) => {
            socket.join(data);
            console.log(`User with ID: ${socket.id} joined session: ${data}`);
        });

        socket.on("send_message", (data) => {
            socket.to(data.session).emit("receive_message", data);
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
        });
    });
};

module.exports = socketIO;
