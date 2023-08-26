const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        cart: {
            items: [
                {
                    productId: {
                        type: Schema.Types.ObjectId,
                        ref: "Product",
                        required: true,
                    },
                    quantity: { type: Number, required: true },
                },
            ],
            totalAmount: { type: Number, required: true, default: 0 },
        },
        role: { type: String, required: true, default: "client" },
    },
    {
        timestamps: true,
    }
);

/*
Khách hàng: Chỉ có thể truy cập vào Client.
Tư vấn viên: Đây là những người sẽ chat với khách hàng để tư vấn về sản phẩm. Role này có thể truy cập được cả Client và Admin nhưng ở Admin chỉ có thể sử dụng được chức năng Livechat.
Admin: Quản trị viên, có thể truy cập và sử dụng được tất cả các chức năng ở Client và Admin.
*/

userSchema.plugin(require("mongoose-role"), {
    roles: ["client", "counselors", "admin"],
    accessLevels: {
        public: ["client", "counselors", "admin"],
        anon: ["client"],
        counselors: ["counselors", "admin"],
        admin: ["admin"],
    },
});

userSchema.methods.addToCart = function (product, quantity) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity;
    const updatedCartItems = [...this.cart.items];
    const totalAmount = this.cart.totalAmount ?? 0;
    // total amount of price is
    const updatedTotalAmount = totalAmount + product.price * quantity;

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + +quantity;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: +quantity,
        });
    }

    const updatedCart = {
        items: updatedCartItems,
        totalAmount: updatedTotalAmount,
    };

    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.removeFromCart = function (productId, price) {
    let updatedTotalAmount;
    const existingCartItemIndex = this.cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
    );

    const existingCartItem = this.cart.items[existingCartItemIndex];
    const updatedCartItems = this.cart.items.filter((item) => {
        return item.productId.toString() !== productId.toString();
    });
    updatedTotalAmount =
        +this.cart.totalAmount - price * existingCartItem.quantity;
    console.log(+this.cart.totalAmount, price, existingCartItem.quantity);

    this.cart = {
        items: updatedCartItems,
        totalAmount: updatedTotalAmount,
    };
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = { items: [], totalAmount: 0 };
    return this.save();
};

module.exports = mongoose.model("User", userSchema);
