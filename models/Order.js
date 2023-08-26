const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        products: [
            {
                product: { type: Object, required: true },
                quantity: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true, default: 0 },
        user: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            userId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
        },
        delivery: { type: String, required: true, default: "Not Delivering" },
        status: { type: String, required: true, default: "Unpaid" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);
