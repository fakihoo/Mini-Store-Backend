const store = require('../utils/fileStore');
const productModel = require('../models/product.model');
const ApiError = require('../utils/ApiError');

function list() {
    return store.read('products').map((product) => productModel.toPublic(product));
}

function getById(id) {
    const product = store.read('products').find((p) => p.id === id);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    return productModel.toPublic(product);
}

function getAll() {
    return store.read('products');
}

async function decrementStock(productId, quantity) {
    const products = store.read('products');
    const product = products.find((p) => p.id === productId);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    if (product.stock < quantity) {
        throw new ApiError(400, `${product.title} does not have enough stock`);
    }
    product.stock -= quantity;
    await store.write('products', products);
    return product;
}

module.exports = { list, getById, getAll, decrementStock };