const store = require('../utils/fileStore');
const orderModel = require('../models/order.model');
const cartService = require('./cart.service');
const productService = require('./product.service');
const emailService = require('./email.service');
const ApiError = require('../utils/ApiError');

async function createOrder(userId) {
    const cart = cartService.getCart(userId);
    if (cart.items.length === 0) {
        throw new ApiError(400, 'Your cart is empty');
    }

    const products = productService.getAll();
    for (const item of cart.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
            throw new ApiError(400, 'A product in your cart is no longer available');
        }
        if (product.stock < item.quantity) {
            throw new ApiError(400, `${product.title} only has ${product.stock} in stock`);
        }
    }

    const order = orderModel.build(userId, cart.items, products);

    for (const item of cart.items) {
        await productService.decrementStock(item.productId, item.quantity);
    }

    const orders = store.read('orders');
    orders.push(order);
    await store.write('orders', orders);
    await cartService.clearCart(userId);
    await emailService.sendOrderConfirmation(order);

    return order;
}

function listByUser(userId) {
    return store.read('orders').filter((order) => order.userId === userId);
}

function getById(userId, orderId) {
    const order = store.read('orders').find((o) => o.id === orderId && o.userId === userId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }
    return order;
}

module.exports = { createOrder, listByUser, getById };