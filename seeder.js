const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

// Load models
const Product = require("./models/Product");

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/products.json`, "utf-8"),
);

// Import into DB
const importData = async () => {
    try {
        await Product.create(products);
        console.log("Data Imported...".green.inverse);
        process.exit();
    } catch (error) {
        console.error(`Error importing ${error}`.red);
    }
};
// Delete DB
const deleteData = async () => {
    try {
        await Product.deleteMany();
        console.log("Data Destroyed...".red.inverse);
        process.exit();
    } catch (error) {
        console.error(`Error importing ${error}`.red);
    }
};

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
}
