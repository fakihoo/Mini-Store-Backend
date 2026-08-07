const orderService = require('../services/order.service');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
    const order = await orderService.createOrder(req.user.id);
    res.status(201).json({ order });
});

exports.index = asyncHandler(async (req, res) => {
    res.json({ orders: orderService.listByUser(req.user.id) });
});

exports.show = asyncHandler(async (req, res) => {
    res.json({ order: orderService.getById(req.user.id, req.params.id) });
});