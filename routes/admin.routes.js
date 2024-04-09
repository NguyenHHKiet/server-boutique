const express = require("express");
const {
    createProduct,
    deleteProduct,
    getOrders,
    getProduct,
    getProducts,
    updateProduct,
} = require("../controllers/admin.controller");
const isAuth = require("../middleware/is-auth");
const multiUpload = require("../middleware/is-upload");

const router = express.Router();

router.use(isAuth);

router
    .route("/")
    .get(getProducts)
    .post(multiUpload.array("uploadedImages", 5), createProduct);
router
    .route("/:productId")
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);

router.get("/get-orders", getOrders);

module.exports = router;
