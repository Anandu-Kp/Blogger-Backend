const express = require("express");
const { isAuth } = require("../middlewares/authMiddleware");
const { createBlog, getBlog, getUserBlogs, deleteBlogs, updateBlogs, getHomePageBlogs } = require("../controllers/blogController");
const app = express();


app.post("/create", isAuth, createBlog);
app.get("/get-blog/:blogId", isAuth, getBlog)
app.get("/get-blogs", isAuth, getUserBlogs)
app.delete("/delete/:id", isAuth, deleteBlogs);
app.put("/update", isAuth, updateBlogs);
app.get("/get-home-page-blogs", isAuth, getHomePageBlogs)


module.exports = app;