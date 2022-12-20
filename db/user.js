const mongoose=require("mongoose");

const dbName = "e-comm";
const collectionName = 'users';

const productSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,

});

 module.exports = mongoose.model('users', productSchema);