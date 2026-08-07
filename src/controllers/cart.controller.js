const cartService = require('../services/cart.service');
const asyncHandler = require('../utils/asyncHandler');

exports.index = asyncHandler(async (req, res) => {
    res.json({ cart: cartService.getCart(req.user.id) });
});

exports.add = asyncHandler(async (req, res) => {
    const { productId, quantity, variants } = req.body;
    const cart = await cartService.addItem(req.user.id, productId, quantity, variants);
    res.status(201).json({ cart });
});

exports.update = asyncHandler(async (req, res) => {
    const changes = {};
    if (req.body.quantity !== undefined) {
        changes.quantity = req.body.quantity;
    }
    if (req.body.variants !== undefined) {
        changes.variants = req.body.variants;
    }
    const cart = await cartService.updateItem(req.user.id, req.params.itemId, changes);
    res.json({ cart });
});

exports.remove = asyncHandler(async (req, res) => {
    const cart = await cartService.removeItem(req.user.id, req.params.itemId);
    res.json({ cart });
});

exports.clear = asyncHandler(async (req, res) => {
    const cart = await cartService.clearCart(req.user.id);
    res.json({ cart });
});