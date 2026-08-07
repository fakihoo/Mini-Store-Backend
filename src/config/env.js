const dotenv = require('dotenv');

dotenv.config({ quiet: true });

const config = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

module.exports = config;
