const mongoose = require("mongoose");
const config = require("../config");

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    path: {
        type: Array,
        required: true,
    },
    admin: {
        type: Boolean,
        Default: false,
    },
    storage: {
        type: Number,
        Default: 0,
    },
    storageLimit: {
        type: Number,
        Default: config.USER_STORAGE_LIMIT,
    },
});

module.exports = mongoose.model("User", userSchema);
