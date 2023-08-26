const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getAdminProducts = (req, res, next) => {
    Product.find({ userId: req.userId, available: true })
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.postProduct = (req, res, next) => {
    const files = req.files;
    const reqFiles = {};

    if (!files) {
        const error = new Error("No image provided.");
        error.statusCode = 422;
        throw error;
    }

    const url = req.protocol + "://" + req.get("host");
    for (var i = 0; i < files.length; i++) {
        reqFiles[`img${i + 1}`] = url + "/public/" + req.files[i].filename;
    }

    const { name, category, price, shortDescription, longDescription } =
        req.body;

    const product = new Product({
        name,
        category,
        short_desc: shortDescription,
        long_desc: longDescription,
        price,
        ...reqFiles,
        userId: req.userId,
    });

    product
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Done upload!",
                productCreated: {
                    _id: result._id,
                },
            });
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.postEditProduct = async (req, res, next) => {
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
    console.log("DESTROYED PRODUCT", productId);
    // Product.findByIdAndRemove(productId)
    //     .then(() => {
    //         return res.status(202).json("DESTROYED PRODUCT");
    //     })
    //     .catch((err) => console.log(err));
    const productExists = await Product.findById(productId);
    if (!productExists) {
        const error = new Error("Product is not exists");
        if (!error.statusCode) error.statusCode = 400;
        next(error);
    }

    // updatedHotel
    await productExists.updateOne({ $set: { available: false } });
    res.status(201).json({ message: "DESTROYED PRODUCT" });
};

exports.getAdminOrders = async (req, res, next) => {
    const qtyOrders = await Order.estimatedDocumentCount();
    const qtyUser = await User.estimatedDocumentCount();

    Order.find()
        .sort({
            updatedAt: "desc",
        })
        .then((orders) => {
            const earnings = orders.reduce(
                (acc, order) => acc + order.totalAmount,
                0
            );
            res.status(200).json({ orders, qtyUser, qtyOrders, earnings });
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};
