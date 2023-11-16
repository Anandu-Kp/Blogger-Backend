const express = require("express");
const { isAuth } = require("../middlewares/authMiddleware");
const { followUser, unFollowuser, isFollowing } = require("../controllers/followController");
const app = express();


app.post("/follow-user", isAuth, followUser);
app.post("/unfollow-user", isAuth, unFollowuser);
app.post("/is-following", isAuth, isFollowing);


module.exports = app;