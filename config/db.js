const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MONGODB connected");
    })
    .catch((err) => {
        console.log(err);
    });