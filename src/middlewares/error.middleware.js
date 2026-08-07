const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

function notFound(req, res, next) {
    next(new ApiError(404, 'Route not found'));
}

function errorHandler(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                errors: err.errors || undefined,
            },
        });
    }

    logger.error(err.stack || err.message);
    res.status(500).json({ error: { message: 'Something went wrong' } });
}

module.exports = { notFound, errorHandler };