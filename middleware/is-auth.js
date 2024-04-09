const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");

module.exports = asyncHandler(async (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        next(new ErrorResponse("Not authenticated.", 401));
    }
    const token = authHeader.split(" ")[1];

    try {
        let decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodedToken.userId);

        next();
    } catch (err) {
        next(new ErrorResponse("Not authenticated.", 401));
    }
});
