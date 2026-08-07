const { randomUUID } = require('crypto');

function createItem(productId, quantity, variants) {
    return {
        id: randomUUID(),
        productId,
        quantity,
        variants: variants || {},
    };
}

function findLine(cart, itemId) {
    return cart.items.find((item) => item.id === itemId);
}

function findByCombo(cart, productId, variants) {
    const incoming = normalizeVariants(variants);
    return cart.items.find(
        (item) =>
            item.productId === productId &&
            JSON.stringify(normalizeVariants(item.variants)) === JSON.stringify(incoming)
    );
}

function normalizeVariants(variants) {
    const result = {};
    for (const key of Object.keys(variants || {}).sort()) {
        if (variants[key] !== undefined && variants[key] !== null) {
            result[key] = variants[key];
        }
    }
    return result;
}

function enrichWithProducts(items, products) {
    const lookup = new Map(products.map((product) => [product.id, product]));
    return items.map((item) => {
        const product = lookup.get(item.productId);
        if (!product) {
            return null;
        }
        const subtotal = Number((product.price * item.quantity).toFixed(2));
        return {
            ...item,
            title: product.title,
            price: product.price,
            stock: product.stock,
            image: product.image || null,
            subtotal,
        };
    });
}

module.exports = { createItem, findLine, findByCombo, normalizeVariants, enrichWithProducts };