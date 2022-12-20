const mongoose=require("mongoose");

const dbName = "e-comm";
const collectionName = 'products';

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    userId: String,
    company: String,


});

 module.exports = mongoose.model('products', productSchema);