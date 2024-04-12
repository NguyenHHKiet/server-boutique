// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    // Log to console for dev
    console.log(err.stack.red);

    res.status(error.statusCode || 500).json({
        ...error,
        success: false,
        error: error.message || "Server Error",
    });
};

module.exports = errorHandler;
