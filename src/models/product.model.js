function toPublic(product) {
    if (!product) {
        return null;
    }
    return {
        public_id: product.public_id,
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        variants: product.variants || [],
        image: product.image || null,
    };
}

module.exports = { toPublic };