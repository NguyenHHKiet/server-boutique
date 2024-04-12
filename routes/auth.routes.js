const express = require("express");
const { body, check } = require("express-validator");

const User = require("../models/User");

const {
    postLogin,
    postLogout,
    postSignUp,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post(
    "/signup",
    [
        check("email")
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject(
                            "E-Mail exists already, please pick a different one.",
                        );
                    }
                });
            })
            .normalizeEmail(),
        body(
            "password",
            "Please enter a password with only numbers and text and at least 8 characters.",
        )
            .isLength({ min: 8 })
            .isAlphanumeric()
            .trim(),
        body(
            "phone",
            "Please enter a phone with only numbers at least 10 characters.",
        )
            .isLength({ min: 10, max: 11 })
            .trim(),
        body("name", "Please enter a username.").trim(),
    ],
    postSignUp,
);

router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email address.")
            .normalizeEmail(),
        body("password", "Password has to be valid.")
            .isLength({ min: 8 })
            .isAlphanumeric()
            .trim(),
    ],
    postLogin,
);

router.post("/logout", postLogout);

module.exports = router;
