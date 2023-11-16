const Joi = require("joi");
const Blog = require("../models/Blog")
const Follow = require("../models/Follow");

const createBlog = async (req, res) => {
    const isValid = Joi.object({
        title: Joi.string().required().max(30),
        textBody: Joi.string().min(30).max(1000).required(),
    }).validate(req.body)

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: "invalid input",
            data: isValid.error
        })
    }

    let blogData = new Blog({
        title: req.body.title,
        textBody: req.body.textBody,
        creationDateAndTime: new Date(),
        userId: req.locals.userId,
        username: req.locals.username
    })

    try {

        await blogData.save();

        return res.status(201).send({
            status: 201,
            message: "blog created successfully"
        })

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to create blog",
            data: error
        })
    }
}

const getBlog = async (req, res) => {
    const blogId = req.params.blogId;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(400).send({
                status: 400,
                message: "blog is not availible"
            })
        }
        return res.status(200).send({
            status: 200,
            message: "successfully fetched blog",
            data: blog
        })

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch blog",
            data: error
        })

    }
}

const getUserBlogs = async (req, res) => {
    const userId = req.locals.userId;
    const page = req.param.page || 1;
    const limit = 10;

    try {

        const blogs = await Blog.find({ userId, isDeleted: false }).sort({ creationDateAndTime: -1 }).skip((page - 1) * 10).limit(limit);

        if (blogs.length == 0) {
            res.status(400).send({
                status: 400,
                message: "no blogs for the user"
            })
        }

        res.status(200).send({
            status: 200,
            message: "successfully fetched user blogs",
            data: { blogs }
        })

    } catch (error) {
        res.status(400).send({
            status: 400,
            message: "failed to fetch blogs",
            data: error
        })
    }
}

const deleteBlogs = async (req, res) => {
    const blogId = req.params.id;
    const userId = req.locals.userId;

    let blogData;
    try {
        blogData = await Blog.findById(blogId);
        console.log(userId);
    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch blog",
            data: error
        })

    }
    if (!blogData) {
        return res.status(404).send({
            status: 404,
            message: "blog not found"
        })
    }
    if (blogData.userId != userId) {
        return res.status(400).send({
            status: 400,
            message: "You are not authorised to delete this blog"
        })
    }

    try {
        await Blog.findByIdAndDelete(blogId, { isDeleted: true, deletedDateAndTime: Date.now() });

        return res.status(200).send({
            status: 200,
            message: "successfully deleted the blog"
        })

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to delete blog",
            data: error
        })
    }

}

const updateBlogs = async (req, res) => {

    const isValid = Joi.object({
        blogId: Joi.string().required(),
        title: Joi.string().required().max(30),
        textBody: Joi.string().min(30).max(10000).required(),
    }).validate(req.body)

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: "invalid input"
        })
    }
    let { blogId, title, textBody } = req.body;
    let userId = req.locals.userId;
    try {
        let blogData = await Blog.findById(blogId);
        if (!blogData) {
            return res.status(400).send({
                status: 400,
                message: "blog not found "
            })
        }

        if (blogData.userId != userId) {
            return res.status(400).send({
                status: 400,
                message: "blog not belongs to the user "
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch blog details",
            data: error
        })
    }

    let blogData = {
        title,
        textBody
    }
    try {
        await Blog.findByIdAndUpdate(blogId, blogData);
        return res.status(200).send({
            status: 200,
            message: "successfully updated the Blog"
        })

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to update Blog",
            data: error
        })
    }

}

const getHomePageBlogs = async (req, res) => {
    const currentUserId = req.locals.userId;

    // we should access the following list of this user 
    // and extract their IDs
    let followingList
    try {
        followingList = await Follow.find({ currentUserId });
        if (followingList.length === 0) {
            return res.status(204).send({
                status: 204,
                message: "user not following any body"
            })
        }
    } catch (error) {

        return res.status(400).send({
            status: 400,
            message: "failed to fetch following users details",
            data: error
        })

    }

    let followingUsersId = [];
    followingList.forEach((follow) => {
        followingUsersId.push(follow.followingUserId);
    })


    try {

        let homePageBlogs = await Blog.find({
            userId: { $in: followingUsersId },
            isDeleted: false
        }).sort({ creationDateAndTime: -1 });

        if (homePageBlogs.length == 0) {
            return res.status(204).send({
                status: 204,
                message: "no blogs to show"
            })
        }

        return res.status(200).send({
            status: 200,
            message: "blogs fetched successfully",
            data: homePageBlogs
        })


    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch home page blogs",
            data: error
        })
    }

}

module.exports = { createBlog, getBlog, getUserBlogs, deleteBlogs, updateBlogs, getHomePageBlogs }

