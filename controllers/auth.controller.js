const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

exports.postSignUp = (req, res, next) => {
    const { email, password, name, phone } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new ErrorResponse("Validation failed.", 422);
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
        .catch(next);
};

exports.postLogin = asyncHandler(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new ErrorResponse("Validation failed.", 422);
        error.data = errors.array();
        next(error);
    }

    const isAdmin = req.get("isAdmin");

    const user = await User.findOne({ email: email });
    // const user = false;
    if (isAdmin) {
        if (!user.hasAccess("admin") && !user.hasAccess("counselors")) {
            return next(
                new ErrorResponse("Non-Authoritative Information", 401),
            );
        }
    }

    if (!user) {
        return next(
            new ErrorResponse(
                "A user with this email could not be found.",
                401,
            ),
        );
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
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
        );
        // OK The request succeeded.
        res.status(200).json({
            token: token,
            data: user,
        });
    } else {
        return next(new ErrorResponse("Wrong password!", 401));
    }
});

exports.postLogout = (req, res, next) => {
    return req.session.destroy();
};
