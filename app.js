const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongooseDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const colors = require("colors");

const shopRoutes = require("./routes/shop.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const messageRoutes = require("./routes/message.routes");
const User = require("./models/User");

const store = new MongooseDBStore({
    uri: uri,
    collection: "sessions",
});
store.on("error", (error) => {
    console.log("Store error: " + error); // catch exceptions store
});

// middleware configuration ---------------------------
const app = express();
const csrfProtection = csrf();

app.use(express.json());

app.use(cors());
app.use("/public", express.static("public"));
app.use(
    session({
        secret: "my-secret",
        resave: false,
        saveUninitialized: false,
        store: store,
    }),
);

app.use(csrfProtection);
app.use(helmet());
app.use(compression());
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
// routes configuration ---------------------------
app.use((req, res, next) => {
    // Tăng số lần xem
    if (req.session.views) req.session.views++;
    else req.session.views = 1;
    req.session.chat = [];

    if (!req.session.user) return next();

    User.findById(req.session.user._id)
        .then((user) => {
            if (!user) return next();
            req.user = user;
            next();
        })

        .catch((err) => {
            next(new Error(err));
        });
});

app.use("/api/v2/products", shopRoutes);
app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/admin", adminRoutes);
app.use("/api/v2/message", messageRoutes);

// next handler error if something goes wrong ---------------------------
app.use((req, res, next) => {
    // Error goes via `next()` method
    setImmediate(() => {
        next(new Error("Something went wrong"));
    });
});
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

// MongoDB Configuration ---------------------------
const port = process.env.PORT || 5000;

mongoose
    .connect(uri)
    .then((x) => {
        // TODO Error connecting to mongo bad decrypt key and cert
        // TODO Error connecting to mongo no start line
        // const server = https.createServer(
        //     { key: privateKey, cert: certificate },
        //     app
        // );

        const server = https.createServer(app);

        const io = require("./socket").init(server);
        io.on("connection", (socket) => {
            console.log(`User Connected: ${socket.id}`);

            socket.on("join_room", (data) => {
                socket.join(data);
                console.log(
                    `User with ID: ${socket.id} joined session: ${data}`,
                );
            });

            socket.on("send_message", (data) => {
                socket.to(data.session).emit("receive_message", data);
            });

            socket.on("disconnect", () => {
                console.log("User Disconnected", socket.id);
            });
        });

        server.listen(port, () => {
            console.log(colors.yellow.bold(`Connected to port ${port}`));
        });

        console.log(
            `Connected to Mongo! Database name: ${x.connections[0].name}`.cyan,
        );
    })
    .catch((err) => {
        console.error("Error connecting to mongo", err.reason);
    });

// Handle unhandled promise rejections
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});
