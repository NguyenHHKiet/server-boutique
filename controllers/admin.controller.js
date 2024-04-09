const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

exports.getProducts = asyncHandler(async (req, res, next) => {
    const results = await Product.find({ userId: req.userId });
    res.status(200).json({ success: true, data: results });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
    const results = await Product.findById(req.params.productId);
    res.status(200).json({ success: true, data: results });
});

exports.createProduct = async (req, res, next) => {
    const files = req.files;
    const reqFiles = {};

    if (!files) {
        return next(new ErrorResponse("No image provided.", 422));
    }

    for (var i = 0; i < files.length; i++) {
        reqFiles[`img${i + 1}`] = req.files[i].filename;
    }

    const { shortDescription, longDescription } = req.body;

    const product = await Product.create({
        ...req.body,
        short_desc: shortDescription,
        long_desc: longDescription,
        ...reqFiles,
        userId: req.user._id,
    });

    const result = await product.save();

    res.status(201).json({ success: true, data: result._id });
};

exports.updateProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const productExists = await Product.findById(productId);
    /*
        not yet implemented update images
    */
    if (!productExists) {
        const error = new Error("Product is not exists");
        if (!error.statusCode) error.statusCode = 400;
        next(error);
    }

    // updatedHotel
    await productExists.updateOne({ $set: { ...req.body } });
    res.status(201).json({ message: "Done update successfully!" });
};

exports.deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;
    Product.findByIdAndRemove(productId)
        .then(() => res.status(202).json({ success: true, data: {} }))
        .catch((err) => console.log(err));
};

exports.getOrders = async (req, res, next) => {
    const qtyOrders = await Order.estimatedDocumentCount();
    const qtyUser = await User.estimatedDocumentCount();

    Order.find()
        .sort({
            updatedAt: "desc",
        })
        .then((orders) => {
            const earnings = orders.reduce(
                (acc, order) => acc + order.totalAmount,
                0,
            );
            res.status(200).json({ orders, qtyUser, qtyOrders, earnings });
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};
