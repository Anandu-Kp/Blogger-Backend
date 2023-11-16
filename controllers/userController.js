const Joi = require("joi");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User");
const Blog = require("../models/Blog")
const Follow = require("../models/Follow");

let SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

const userRegister = async (req, res) => {

    const isValid = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required().min(3).max(25).alphanum(),
        password: Joi.string().required(),
        email: Joi.string().email().required(),
    }).validate(req.body);

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: "invalid input",
            data: isValid.error
        })
    }


    try {
        const userExists = await User.find({
            $or: [{ email: req.body.email, username: req.body.username }],
        });

        if (userExists.length != 0) {
            return res.status(400).send({
                status: 400,
                message: "Username/Email already exisits",
            });
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to check username/email",
            data: error
        })

    }


    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const userDetails = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    }
    const userData = new User(userDetails)

    // try for saving user data
    try {
        await userData.save();
        const token = jwt.sign(userDetails, process.env.JWT_SECRET_KEY);
        return res.status(201).send({
            status: 201,
            message: "user created successfully",
            data: { token }
        })




    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to register user",
            data: error
        })

    }

}

const userLogin = async (req, res) => {
    const isValid = Joi.object({
        username: Joi.string().required().min(3).max(25).alphanum(),
        password: Joi.string().required(),
    }).validate(req.body);

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: "invalid input",
            data: isValid.error
        })
    }

    let userData;
    try {

        userData = await User.findOne({ username: req.body.username });
        if (!userData) {
            return res.status(400).send({
                status: 400,
                message: "invalid username"
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch user details",
            data: error
        })
    }

    const isUserMatching = await bcrypt.compare(req.body.password, userData.password);

    if (!isUserMatching) {
        return res.status(401).send({
            status: 401,
            message: "incorrect password"
        })
    }
    const payload = {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        userId: userData.id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    res.status(201).send({
        status: 201,
        message: "user logged in successfully",
        data: { token }
    })
}

const getUser = async (req, res) => {
    let currentUserId = req.locals.userId;
    let requestUserId = req.body.userId;
    if (!currentUserId && !requestUserId) {
        return res.status(400).send({
            message: "please provide credentials"
        })
    }

    let userId = requestUserId ? requestUserId : currentUserId;

    // fetching user Details
    let userObj;
    try {
        userObj = await User.findById(userId);
        if (!userId) {
            res.status(400).send({
                status: 400,
                message: "user Doesn,t Exist"
            })
        }

    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "failed to fetch user details",
            data: err
        })
    }

    // fetching blog details

    let blogList = [];
    try {
        blogList = await Blog.find({ userId }).sort({ creationDateAndTime: -1 });


    } catch (err) {
        res.status(400).send({
            status: 400,
            message: "failed to fetch blog details",
            data: err
        })
    }


    const isMyProfile = requestUserId ? false : true;
    const resultObj = {
        userId,
        username: userObj.username,
        blogs: blogList,
        isMyProfile
    }
    res.status(200).send({
        status: 200,
        message: "fetched successfully",
        data: resultObj
    })

}
const getUsers = async (req, res) => {

    const userId = req.locals.userId;

    let usersList;
    try {
        usersList = await User.find({ _id: { $ne: userId } })
        if (!usersList) {
            return res.status(204).send({
                status: 204,
                message: "No users found"
            })
        }
    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch users",
            data: error
        })
    }

    let followList;
    try {
        followList = await Follow.find({ currentUserId: userId })

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch follow details",
            data: error
        })
    }


    let followMap = new Map();

    followList.forEach((ele) => {
        followMap.set(ele.followingUserId, ele);
    })
    const resultArr = usersList.map((user) => {
        let userData = {
            userId: user.id,
            username: user.username,
            following: false,
        }
        // console.log('654b64bee48c4222ac5567c2' == user.id);
        if (followMap.get(String(user.id))) {
            userData.following = true;
        }
        return userData;
    })
    res.status(200).send({
        status: 200,
        message: "successfully fetched users",
        data: resultArr
    })

}

module.exports = { userRegister, userLogin, getUser, getUsers }