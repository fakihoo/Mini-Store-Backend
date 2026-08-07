const store = require('../utils/fileStore');
const productService = require('./product.service');
const cartModel = require('../models/cart.model');
const ApiError = require('../utils/ApiError');

function findCartRecord(userId) {
    return store.read('carts').find((cart) => cart.userId === userId);
}

function ensureCart(userId) {
    const carts = store.read('carts');
    let cart = carts.find((c) => c.userId === userId);
    if (!cart) {
        cart = { userId, items: [] };
        carts.push(cart);
    }
    return { cart, carts };
}

async function persistCart(userId, cart) {
    const carts = store.read('carts');
    const index = carts.findIndex((c) => c.userId === userId);
    if (index === -1) {
        carts.push(cart);
    } else {
        carts[index] = cart;
    }
    await store.write('carts', carts);
}

function decorate(cart) {
    const products = productService.getAll();
    const items = cartModel.enrichWithProducts(cart.items, products).filter(Boolean);
    const total = Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
    return { userId: cart.userId, items, total };
}

function getCart(userId) {
    const record = findCartRecord(userId);
    return decorate(record || { userId, items: [] });
}

function checkStock(product, quantity) {
    if (product.stock < quantity) {
        throw new ApiError(400, `${product.title} only has ${product.stock} in stock`);
    }
}

async function addItem(userId, productId, quantity, variants) {
    const product = productService.getById(productId);
    checkStock(product, quantity);

    const { cart, carts } = ensureCart(userId);
    const existing = cartModel.findByCombo(cart, productId, variants);

    if (existing) {
        const nextQuantity = existing.quantity + quantity;
        checkStock(product, nextQuantity);
        existing.quantity = nextQuantity;
    } else {
        cart.items.push(cartModel.createItem(productId, quantity, variants));
    }

    await store.write('carts', carts);
    return decorate(cart);
}

async function updateItem(userId, itemId, changes) {
    const record = findCartRecord(userId);
    if (!record) {
        throw new ApiError(404, 'Cart item not found');
    }

    const line = cartModel.findLine(record, itemId);
    if (!line) {
        throw new ApiError(404, 'Cart item not found');
    }

    if (changes.quantity !== undefined) {
        const product = productService.getById(line.productId);
        checkStock(product, changes.quantity);
        line.quantity = changes.quantity;
    }

    if (changes.variants) {
        const product = productService.getById(line.productId);
        checkStock(product, line.quantity);
        const replacement = cartModel.findByCombo(record, line.productId, changes.variants);

        if (replacement && replacement.id !== line.id) {
            replacement.quantity += line.quantity;
            checkStock(product, replacement.quantity);
            record.items = record.items.filter((item) => item.id !== line.id);
        } else {
            line.variants = cartModel.normalizeVariants(changes.variants);
        }
    }

    await store.write('carts', store.read('carts'));
    return decorate(record);
}

async function removeItem(userId, itemId) {
    const record = findCartRecord(userId);
    if (!record) {
        throw new ApiError(404, 'Cart item not found');
    }
    const nextItems = record.items.filter((item) => item.id !== itemId);
    if (nextItems.length === record.items.length) {
        throw new ApiError(404, 'Cart item not found');
    }
    record.items = nextItems;
    await store.write('carts', store.read('carts'));
    return decorate(record);
}

async function clearCart(userId) {
    const carts = store.read('carts');
    const index = carts.findIndex((c) => c.userId === userId);
    if (index !== -1) {
        carts.splice(index, 1);
        await store.write('carts', carts);
    }
    return decorate({ userId, items: [] });
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };