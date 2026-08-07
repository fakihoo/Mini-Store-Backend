const store = require('../utils/fileStore');
const productModel = require('../models/product.model');
const ApiError = require('../utils/ApiError');

function list({ page = 1, pageSize = 8, filter = '', size = '', color = '' } = {}) {
    let products = store.read('products');

    const query = String(filter).trim().toLowerCase();
    if (query) {
        products = products.filter((p) => {
            const title = (p.title || '').toLowerCase();
            const description = (p.description || '').toLowerCase();
            return title.includes(query) || description.includes(query);
        });
    }

    const hasVariant = (product, variantNames, value) => {
        const normalizedValue = String(value).trim();
        if (!normalizedValue) {
            return false;
        }
        return (product.variants || []).some((v) => {
            const name = (v.name || v.id || '').toLowerCase().replace(/\s+/g, '');
            return variantNames.includes(name) && (v.values || []).includes(normalizedValue);
        });
    };

    const sizeValue = String(size).trim();
    if (sizeValue) {
        products = products.filter((p) => hasVariant(p, ['size', 'bandsize'], sizeValue));
    }

    const colorValue = String(color).trim();
    if (colorValue) {
        products = products.filter((p) => hasVariant(p, ['color', 'framecolor'], colorValue));
    }

    const total = products.length;
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safePageSize = Math.max(1, parseInt(pageSize, 10) || 10);
    const totalPages = Math.ceil(total / safePageSize);
    const start = (safePage - 1) * safePageSize;
    const paginated = products.slice(start, start + safePageSize).map((p) => productModel.toPublic(p));

    return {
        products: paginated,
        page: safePage,
        pageSize: safePageSize,
        total,
        totalPages,
    };
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