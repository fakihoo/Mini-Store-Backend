const { randomUUID } = require('crypto');

function create(email, password) {
    const now = new Date().toISOString();
    return {
        id: randomUUID(),
        email,
        password,
        role: 'client',
        createdAt: now,
    };
}

function toPublic(user) {
    if (!user) {
        return null;
    }
    const { password, ...safe } = user;
    return safe;
}

module.exports = { create, toPublic };