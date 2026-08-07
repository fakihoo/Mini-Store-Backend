const productService = require('../services/product.service');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
    res.json({ products: productService.list() });
});

exports.detail = asyncHandler(async (req, res) => {
    res.json({ product: productService.getById(req.params.id) });
});