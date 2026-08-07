const productService = require('../services/product.service');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
    const { page, pageSize, filter, size, color } = req.query;
    const result = productService.list({ page, pageSize, filter, size, color });
    res.json({ products: result.products, page: result.page, pageSize: result.pageSize, total: result.total, totalPages: result.totalPages });
});

exports.detail = asyncHandler(async (req, res) => {
    res.json({ product: productService.getById(req.params.id) });
});