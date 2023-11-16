const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");

require("./config/db");


const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);



// importing functions
// const User = require("./models/User")
const userRoutes = require("./routes/user")
const blogRoutes = require("./routes/blog")
const followRoutes = require("./routes/follow");


// routes
app.use("/user", userRoutes)
app.use("/blog", blogRoutes)
app.use("/follow", followRoutes)




app.listen(PORT, () => {
    console.log("server started at port", PORT);
});