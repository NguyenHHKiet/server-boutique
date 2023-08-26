const express = require("express");
const shopController = require("../controllers/shop.controller");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.post("/delete-cart-item", isAuth, shopController.deleteCartItem);
router.post(
    "/create-order",
    isAuth,
    [
        body("name", "Name has to be valid.").trim(),
        body("phone", "Phone has to be valid.")
            .isNumeric()
            .isLength({ min: 10, max: 11 })
            .trim(),
        body("address", "Address has to be valid.").isLength({ min: 8 }).trim(),
    ],
    shopController.postOrder
);
router.get("/orders", isAuth, shopController.getOrders);
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

router.get("/csrfSecret", (req, res, next) => {
    res.status(200).json({ csrfSecret: req.session.csrfSecret });
});

module.exports = router;
