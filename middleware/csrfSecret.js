const csrfSecret = (req, res, next) => {
    res.status(200).json({ csrfSecret: req.session.csrfSecret });
};

module.exports = csrfSecret;
