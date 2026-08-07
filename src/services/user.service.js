const bcrypt = require('bcryptjs');
const store = require('../utils/fileStore');
const userModel = require('../models/user.model');
const ApiError = require('../utils/ApiError');

function getUsers() {
    return store.read('users');
}

function findByEmail(email) {
    return getUsers().find((user) => user.email === email);
}

function findById(id) {
    return getUsers().find((user) => user.id === id);
}

async function register(email, password) {
    if (findByEmail(email)) {
        throw new ApiError(400, 'A user with this email already exists');
    }
    const users = getUsers();
    const hash = await bcrypt.hash(password, 10);
    const user = userModel.create(email, hash);
    users.push(user);
    await store.write('users', users);
    return user;
}

module.exports = { getUsers, findByEmail, findById, register };