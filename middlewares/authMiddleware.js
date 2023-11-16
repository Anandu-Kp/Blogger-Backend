const jwt = require("jsonwebtoken")

const isAuth = (req, res, next) => {
    console.log(req.headers);
    const token = req.headers["blog-token"]
    let verified;

    try {
        verified = jwt.verify(token, process.env.JWT_SECRET_KEY)

    } catch (error) {
        res.status(400).send({
            status: 400,
            message: "jwt not provided",
            data: error
        })
    }

    if (verified) {
        req.locals = verified;
        next();
    }
    else {
        res.status(401).send({
            status: 401,
            message: "user authentication failed",
        })
    }
}

module.exports = { isAuth }