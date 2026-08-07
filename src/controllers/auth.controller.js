const authService = require('../services/auth.service');
const userModel = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.register(email, password);
    res.status(201).json({ user: userModel.toPublic(result.user), token: result.token });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ user: userModel.toPublic(result.user), token: result.token });
});

exports.me = asyncHandler(async (req, res) => {
    res.json({ user: userModel.toPublic(req.user) });
});