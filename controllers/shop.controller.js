const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "nhoangkiet35@gmail.com",
        pass: "dathanhtoanso12#PASSWORD",
    },
});

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.status(200).json(products);
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            res.status(200).json(product);
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart;
            res.status(200).json(products);
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    const quantity = req.body.quantity;

    Product.findById(prodId)
        .then((product) => {
            return req.user.addToCart(product, quantity);
        })
        .then((result) => {
            console.log("Add to Cart Success!!");
            res.status(201).json({ message: "Add to Cart Success!!" });
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.deleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    const price = req.body.price;

    req.user
        .removeFromCart(prodId, price)
        .then(() => {
            res.status(200).json({ message: "Delete item cart successfully" });
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .sort({
            updatedAt: "desc",
        })
        .then((orders) => {
            res.status(200).json(orders);
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};

exports.postOrder = (req, res, next) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
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
                    { $inc: { count: -item.quantity } }
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
        .then((result) => {
            const mailOptions = {
                from: "nhoangkiet35@gmail.com",
                to: result.user.email,
                subject: "Sending Email using Node.js",
                html: `<html>
                <head>
                    <style>
                        table, td, th {
                            border: 1px solid #ddd;
                            text-align: left;
                        }
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            padding: 15px;
                        }
                        img {
                            max-width: 7rem;
                        }
                    </style>
                </head>
                        <body >
                            <h1>Xin Chào ${result.user.name}</h1>
                            <div>Phone: ${result.user.phone}</div>
                            <div>Address: ${result.user.address}</div>
                            <table>
                                <tr>
                                    <th>Tên Sản Phẩm</th>
                                    <th>Hình Ảnh</th>
                                    <th>Giá</th>
                                    <th>Số Lượng</th>
                                    <th>Thành Tiền</th>
                                </tr>
                                ${result.products.map(
                                    (item) =>
                                        `<tr>
                                        <td>${item.product.name}</td>
                                        <td class='img'>${
                                            item.product.img1
                                        }</td>
                                        <td>${item.product.price} VND</td>
                                        <td>${item.quantity}</td>
                                        <td>${
                                            item.product.price * item.quantity
                                        } VND</td>
                                    </tr>`
                                )}
                            </table>
                            <h1>Tổng Thanh Toán: <br/>${result.totalAmount}</h1>
                            <h1>Cảm ơn bạn!</h1>
                        </body>
                    </html >`,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
            return req.user.clearCart();
        })
        .then((result) => {
            res.status(201).json({ message: "Success Order Added!" });
        })
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
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
        .catch((err) => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};
