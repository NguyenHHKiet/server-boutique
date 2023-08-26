const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongooseDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const shopRoutes = require("./routes/shop.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const messageRoutes = require("./routes/message.routes");
const User = require("./models/User");

// const run = require("./emailMailchimp");
// (async () => {
//     await run();
// })();

// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, "access.log"),
//     { flags: "a" }
// );

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.yq5iral.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
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

let whitelist = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5000",
    "https://server-boutique-tau.vercel.app",
    "https://client-boutique.vercel.app",
    "https://admin-boutique.vercel.app",
];
// Configuring CORS Asynchronously
const corsOptions = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.header("Origin")) !== -1) {
        corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(cors(corsOptions));
app.use("/public", express.static("public"));
app.use(
    session({
        secret: "my-secret",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(csrfProtection);
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
// app.use(morgan("combined", { stream: accessLogStream }));

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
// app.use((req, res, next) => {
//     console.log(req.session);
//     next();
// });

app.use("/api", shopRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/message", messageRoutes);

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
const directory = path.join(process.cwd());
const privateKey = fs.readFileSync(directory + "/key.pem");
const certificate = fs.readFileSync(directory + "/cert.pem");

mongoose
    .connect(uri)
    .then((x) => {
        // const server = app.listen(port, () => {
        //     console.log("Connected to port " + port);
        // });
        // TODO Error connecting to mongo bad decrypt key and cert
        // TODO Error connecting to mongo no start line
        // const server = https
        //     .createServer({ key: privateKey, cert: certificate }, app)
        //     .listen(port, () => {
        //         console.log("Connected to port " + port);
        //     });

        const server = https.createServer(app).listen(port, () => {
            console.log("Connected to port " + port);
        });

        const io = require("./socket").init(server);
        io.on("connection", (socket) => {
            console.log(`User Connected: ${socket.id}`);

            socket.on("join_room", (data) => {
                socket.join(data);
                console.log(
                    `User with ID: ${socket.id} joined session: ${data}`
                );
            });

            socket.on("send_message", (data) => {
                socket.to(data.session).emit("receive_message", data);
            });

            socket.on("disconnect", () => {
                console.log("User Disconnected", socket.id);
            });
        });

        console.log(
            `Connected to Mongo! Database name: "${x.connections[0].name}"`
        );
    })
    .catch((err) => {
        console.error("Error connecting to mongo", err.reason);
    });

module.exports = app;
