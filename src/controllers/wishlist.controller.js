const wishlistService = require('../services/wishlist.service');
const asyncHandler = require('../utils/asyncHandler');

exports.index = asyncHandler(async (req, res) => {
    res.json({ wishlist: await wishlistService.getWishlist(req.user.id) });
});

exports.add = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.add(req.user.id, req.params.productId);
    res.status(201).json({ wishlist });
});

exports.remove = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.remove(req.user.id, req.params.productId);
    res.json({ wishlist });
});

exports.moveToCart = asyncHandler(async (req, res) => {
    const cart = await wishlistService.moveToCart(req.user.id, req.params.productId);
    res.json({ cart });
});