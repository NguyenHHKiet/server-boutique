const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        category: { type: String, required: true },
        img1: { type: String },
        img2: { type: String },
        img3: { type: String },
        img4: { type: String },
        long_desc: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: String, required: true },
        short_desc: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        available: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// Thêm trường count vào lược đồ Product
productSchema.add({ count: { type: Number, default: 10 } });

module.exports = mongoose.model("Product", productSchema);
