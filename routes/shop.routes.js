const express = require("express");
const {
    deleteCartItem,
    getCart,
    getInvoice,
    getOrders,
    getProduct,
    getProducts,
    postCart,
    postOrder,
} = require("../controllers/shop.controller");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", getProducts);
router.get("/:productId", getProduct);

// cart
router.route("/cart", isAuth).get(getCart).post(postCart);

router.post("/cart/:productId", isAuth, deleteCartItem);

// order
router
    .route("/orders", isAuth)
    .get(getOrders)
    .post(
        [
            body("name", "Name has to be valid.").trim(),
            body("phone", "Phone has to be valid.")
                .isNumeric()
                .isLength({ min: 10, max: 11 })
                .trim(),
            body("address", "Address has to be valid.")
                .isLength({ min: 8 })
                .trim(),
        ],
        postOrder,
    );

router.get("/orders/:orderId", isAuth, getInvoice);

module.exports = router;
