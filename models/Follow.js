const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Follow = new Schema({
    currentUserId: {
        type: String,
        required: true,
        ref: "users"
    },
    followingUserId: {
        type: String,
        required: true,
        ref: "users"
    },
    creationDateAndTime: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model("follows", Follow)