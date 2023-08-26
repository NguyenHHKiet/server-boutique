const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.getCSRFToken = (req, res, next) => {
    res.status(200).send({
        isAuthenticated: req.session.isLoggedIn || false,
        csrfToken: req.csrfToken(),
    });
};

exports.postSignUp = (req, res, next) => {
    const { email, password, name, phone } = req.body;
    console.log({ email, password, name, phone });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name,
                phone: phone,
                cart: { items: [] },
            });
            return user.save();
        })
        .then((result) => {
            // OK The request succeeded.
            return res.status(201).json({
                message: "The register user succeeded.",
                userId: result._id,
            });
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.postLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email, password);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed.");
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const isAdmin = req.get("isAdmin");

        const user = await User.findOne({ email: email });
        // const user = false;
        if (isAdmin) {
            if (!user.hasAccess("admin") && !user.hasAccess("counselors")) {
                const error = new Error("Non-Authoritative Information");
                error.statusCode = 401;
                next(error);
            }
        }

        if (!user) {
            const error = new Error(
                "A user with this email could not be found."
            );
            error.statusCode = 401;
            throw error;
        }

        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            req.session["isLoggedIn"] = true;
            req.session["user"] = user;
            req.session.save();
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id.toString(),
                },
                "somesupersecretsecret",
                { expiresIn: "2h" }
            );
            // OK The request succeeded.
            res.status(200).json({
                token: token,
                userId: user._id.toString(),
                name: user.name,
                email: user.email,
                message: "The login user succeeded",
            });
        } else {
            const error = new Error("Wrong password!");
            error.statusCode = 401;
            throw error;
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.postLogout = (req, res, next) => {
    return req.session.destroy((err) => {
        console.log(err);
        // 203 Non-Authoritative Information
        res.status(203).json({ message: "203 Non-Authoritative Information" });
    });
};
