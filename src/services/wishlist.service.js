const store = require('../utils/fileStore');
const productService = require('./product.service');
const cartService = require('./cart.service');
const productModel = require('../models/product.model');

function getRecord(userId) {
    const wishlists = store.read('wishlists');
    let record = wishlists.find((w) => w.userId === userId);
    if (!record) {
        record = { userId, productIds: [] };
        wishlists.push(record);
    }
    return { record, wishlists };
}

async function getWishlist(userId) {
    const { record } = getRecord(userId);
    const products = productService.getAll();
    return record.productIds
        .map((id) => products.find((product) => product.id === id))
        .filter(Boolean)
        .map((product) => productModel.toPublic(product));
}

async function add(userId, productId) {
    productService.getById(productId);
    const { record, wishlists } = getRecord(userId);
    if (!record.productIds.includes(productId)) {
        record.productIds.push(productId);
        await store.write('wishlists', wishlists);
    }
    return getWishlist(userId);
}

async function remove(userId, productId) {
    const { record, wishlists } = getRecord(userId);
    record.productIds = record.productIds.filter((id) => id !== productId);
    if (record.productIds.length === 0) {
        wishlists.splice(wishlists.indexOf(record), 1);
    }
    await store.write('wishlists', wishlists);
    return getWishlist(userId);
}

async function moveToCart(userId, productId) {
    productService.getById(productId);
    const cart = await cartService.addItem(userId, productId, 1, {});
    await remove(userId, productId);
    return cart;
}

module.exports = { getWishlist, add, remove, moveToCart };