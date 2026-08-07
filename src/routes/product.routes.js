const { param, query } = require('express-validator');
const router = require('express').Router();
const controller = require('../controllers/product.controller');
const validate = require('../middlewares/validate.middleware');

router.get(
    '/',
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('pageSize must be a positive integer'),
    validate,
    controller.list
);

router.get(
    '/:id',
    param('id').notEmpty().withMessage('Product id is required'),
    validate,
    controller.detail
);

module.exports = router;