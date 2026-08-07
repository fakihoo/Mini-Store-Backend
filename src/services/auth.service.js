const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');

function signToken(user) {
    return jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });
}

async function register(email, password) {
    const user = await userService.register(email, password);
    return { user, token: signToken(user) };
}

async function login(email, password) {
    const user = userService.findByEmail(email);
    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
        throw new ApiError(401, 'Invalid email or password');
    }
    return { user, token: signToken(user) };
}

module.exports = { register, login, signToken };