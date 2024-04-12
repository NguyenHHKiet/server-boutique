const Product = require("../models/Product");
const Order = require("../models/Order");
const { validationResult } = require("express-validator");

const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// eslint-disable-next-line no-unused-vars
exports.getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
        return next(
            new ErrorResponse(
                `Product not found with id of ${req.params.id}`,
                404,
            ),
        );
    }

    res.status(200).json({ success: true, data: product });
});

exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart;
            res.status(200).json(products);
        })
        .catch((err) => next(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    const quantity = req.body.quantity;

    Product.findById(prodId)
        .then((product) => {
            return req.user.addToCart(product, quantity);
        })
        .catch((err) => next(err));
};

exports.deleteCartItem = (req, res, next) => {
    const prodId = req.params.productId;
    const price = req.body.price;

    req.user
        .removeFromCart(prodId, price)
        .then(() => {
            res.status(200).json({ message: "Delete item cart successfully" });
        })
        .catch((err) => next(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .sort({
            updatedAt: "desc",
        })
        .then((orders) => {
            res.status(200).json(orders);
        })
        .catch((err) => next(err));
};

exports.postOrder = (req, res, next) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.", 422);
        error.data = errors.array();
        next(error);
    }

    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items.map((item) => {
                return {
                    quantity: item.quantity,
                    product: { ...item.productId._doc },
                };
            });

            user.cart.items.forEach(async (item) => {
                // Tìm sản phẩm theo id và giảm số lượng đi 1
                await Product.updateOne(
                    { _id: item.productId._id },
                    { $inc: { count: -item.quantity } },
                );
            });

            const order = new Order({
                user: {
                    name: name,
                    email: req.user.email,
                    phone: phone,
                    address: address,
                    userId: req.user,
                },
                products: products,
                totalAmount: user.cart.totalAmount,
            });
            return order.save();
        })
        .catch((err) => next(err));
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                return next(new Error("No order found."));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error("Unauthorized"));
            }
            res.status(200).json(order);
        })
        .catch((err) => next(err));
};
