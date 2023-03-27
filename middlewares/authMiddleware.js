const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');

const protect = (permissions) = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id);

            next();

        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized , token Failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

//Authenticates Admin and Volunteer Roles
const authAdmin = asyncHandler(async (req, res, next) => {
    const userRole = req.user.role;

    if (userRole === "admin" || userRole === "volunteer") {
        next();
    } else {
        res.status(401)
        throw new Error("You Don't Have the PERMISSIONS");
    }
})

//authenticates only Admin
const authOnlyAdmin = asyncHandler(async (req, res, next) => {
    const userRole = req.user.role;

    if (userRole === "admin") {
        next();
    } else {
        res.status(401)
        throw new Error("You Don't Have the PERMISSIONS");
    }
})


module.exports = { protect, authAdmin, authOnlyAdmin }