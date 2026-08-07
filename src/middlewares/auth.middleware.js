const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userService = require('../services/user.service');
const ApiError = require('../utils/ApiError');

function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return next(new ApiError(401, 'Authentication required'));
    }

    const token = header.slice(7);
    let payload;
    try {
        payload = jwt.verify(token, config.jwtSecret);
    } catch (e) {
        return next(new ApiError(401, 'Invalid or expired token'));
    }

    const user = userService.findById(payload.sub);
    if (!user) {
        return next(new ApiError(401, 'Invalid or expired token'));
    }

    req.user = user;
    next();
}

module.exports = { requireAuth };