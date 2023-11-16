const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Blog = new Schema({
    title: {
        type: String,
        required: true,
    },
    textBody: {
        type: String,
        required: true,
    },
    creationDateAndTime: {
        type: Date,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: false,
    },
    deletedDateAndTime: {
        type: Date,
        required: false,
    }
})

module.exports = mongoose.model("blogs", Blog)