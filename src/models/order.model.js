const { randomUUID } = require('crypto');

function build(userId, cartItems, products) {
    const lookup = new Map(products.map((product) => [product.id, product]));
    const items = cartItems.map((item) => {
        const product = lookup.get(item.productId);
        return {
            productId: item.productId,
            title: product ? product.title : item.productId,
            price: product ? product.price : 0,
            quantity: item.quantity,
            variants: item.variants || {},
        };
    });

    return {
        id: randomUUID(),
        userId,
        items,
        total: calculateTotal(items),
        status: 'placed',
        createdAt: new Date().toISOString(),
    };
}

function calculateTotal(items) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Number(total.toFixed(2));
}

module.exports = { build, calculateTotal };