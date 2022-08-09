const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    mobile: Number,
    password: String
});

module.exports = mongoose.model("users", userSchema);