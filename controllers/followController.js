const Joi = require("joi");
const User = require("../models/User");
const Follow = require("../models/Follow");

const followUser = async (req, res) => {

    let currentUserId = req.locals.userId;
    let { followingUserId } = req.body

    const isValid = Joi.object({
        followingUserId: Joi.string().required(),
    }).validate(req.body)

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: "invalid input"
        })
    }

    // checking that it is a valid user
    try {
        let userData = await User.findById(followingUserId);
        if (!userData) {
            return res.status(400).send({
                status: 400,
                message: "invalid user details"
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch following user details",
            data: error
        })
    }

    // check the user is already following
    // console.log(currentUserId, followingUserId);

    try {

        let followData = await Follow.find({ currentUserId, followingUserId })
        if (followData.length != 0) {

            return res.status(400).send({
                status: 400,
                message: "already following",
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch follow details",
            data: error
        })
    }

    const followData = new Follow({
        currentUserId,
        followingUserId,
        creationDateAndTime: new Date()

    })

    try {
        await followData.save();
        return res.status(201).send({
            status: 201,
            message: "successfully followed"
        })

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to add follow",
            data: error
        })
    }

}

const unFollowuser = async (req, res) => {
    let currentUserId = req.locals.userId;
    let { followingUserId } = req.body;

    const isValid = Joi.object({
        followingUserId: Joi.string().required(),
    }).validate(req.body);

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: "invalid input"
        });
    }

    // checking that it is a valid user
    try {
        let userData = await User.findById(followingUserId);
        if (!userData) {
            return res.status(400).send({
                status: 400,
                message: "invalid user details"
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch following user details",
            data: error
        })
    }

    // check the user is already following
    // console.log(currentUserId, followingUserId);

    try {

        let followData = await Follow.findOne({ currentUserId, followingUserId })
        if (!followData) {

            return res.status(400).send({
                status: 400,
                message: "not following",
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch follow details",
            data: error
        })
    }

    try {
        await Follow.findOneAndDelete({ currentUserId, followingUserId })
        return res.status(200).send({
            status: 200,
            message: "unfollowed successfully"
        })

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch follow details",
            data: error
        })
    }

}

const isFollowing = async (req, res) => {
    let currentUserId = req.locals.userId;
    let { followingUserId } = req.body;

    const isValid = Joi.object({
        followingUserId: Joi.string().required(),
    }).validate(req.body);

    if (isValid.error) {
        return res.status(400).send({
            status: 400,
            message: "invalid input"
        });
    }
    // checking that it is a valid user
    try {
        let userData = await User.findById(followingUserId);
        if (!userData) {
            return res.status(400).send({
                status: 400,
                message: "invalid user details"
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch following user details",
            data: error
        })
    }

    // check the user is already following
    // console.log(currentUserId, followingUserId);
    let isFollowing = false;

    try {

        let followData = await Follow.findOne({ currentUserId, followingUserId })
        if (!followData) {

            return res.status(200).send({
                status: 200,
                message: "not following",
            })
        }
        else {
            isFollowing = true;
            return res.status(200).send({
                status: 200,
                message: "user is following",
                data: isFollowing
            })
        }

    } catch (error) {
        return res.status(400).send({
            status: 400,
            message: "failed to fetch follow details",
            data: error
        })
    }
}



module.exports = { followUser, unFollowuser, isFollowing }