const express = require("express");
const adminController = require("../controllers/admin.controller");
const isAuth = require("../middleware/is-auth");
const multiUpload = require("../middleware/is-upload");

const router = express.Router();

router.get("/get-products", isAuth, adminController.getAdminProducts);
router.post(
    "/add-product",
    isAuth,
    multiUpload.array("uploadedImages", 5),
    adminController.postProduct
);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.put("/edit-product/:productId", isAuth, adminController.postEditProduct);
router.delete(
    "/delete-product/:productId",
    isAuth,
    adminController.deleteProduct
);

router.get("/get-orders", isAuth, adminController.getAdminOrders);

module.exports = router;
