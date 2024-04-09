const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const MongooseDBStore = require("connect-mongodb-session")(expressSession);
const csrf = require("csurf");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");

const errorHandler = require("./middleware/errors");

const socketIO = require("./socket/socketIO");

const shopRoutes = require("./routes/shop.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const messageRoutes = require("./routes/message.routes");
const User = require("./models/User");

// Load environment variables
dotenv.config();

const app = express();
const csrfProtection = csrf();

// MongoDB Configuration
const store = new MongooseDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
});

store.on("error", (error) => {
    console.log(`Store error: ${error.message}`.red); // catch exceptions store
});

// Middleware Configuration
// CORS
app.use(cors());

// Body parser
app.use(express.json());

// Cookie parser
// The cookie-parser module used to parse the incoming cookies.
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.use(helmet());
app.use(compression());

// Creating session
// This express-session module used for session management in NodeJS.
app.use(
    expressSession({
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
    }),
);

// CSRF Protect
app.use(csrfProtection);

// Setup Folder
app.use("/public", express.static("public"));

// Routes Configuration
app.use((req, res, next) => {
    // Tăng số lần xem
    if (req.session.views) {
        req.session.views++;
    } else {
        req.session.views = 1;
    }
    req.session.chat = [];

    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then((user) => {
            if (!user) {
                return next();
            }
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

// next handler error if something goes wrong
app.use((req, res, next) => {
    // Error goes via `next()` method
    setImmediate(() => {
        next(new Error("Something went wrong"));
    });
});
app.use(errorHandler);

const port = process.env.PORT || 8080;

// Connect to the server
mongoose
    .connect(process.env.MONGO_URI)
    .then((x) => {
        const server = http.createServer(app);

        socketIO(server);

        console.log(
            `Connected to Mongo! Database name: ${x.connections[0].name}`.cyan
                .underline.bold,
        );

        server.listen(port, () => {
            console.log(colors.yellow.bold(`Connected to port ${port}`));
        });

        // Handle unhandled promise rejections
        process.on("uncaughtException", (err) => {
            console.log(`Error: ${err.message}`.red);
            // Close server & exit process
            server.close(() => process.exit(1));
        });
    })
    .catch((err) => {
        console.error(`Error connecting to mongo ${err.reason}`.red.underline);
    });
