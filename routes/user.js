const express = require("express");
const { userRegister, userLogin, getUser, getUsers } = require("../controllers/userController");
const { isAuth } = require("../middlewares/authMiddleware");
const app = express();


app.post("/register", userRegister);
app.post("/login", userLogin);
app.post("/get-user", isAuth, getUser);
app.get("/get-users", isAuth, getUsers);

module.exports = app;