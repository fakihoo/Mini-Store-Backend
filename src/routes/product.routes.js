const { param } = require('express-validator');
const router = require('express').Router();
const controller = require('../controllers/product.controller');
const validate = require('../middlewares/validate.middleware');

router.get('/', controller.list);

router.get(
    '/:id',
    param('id').notEmpty().withMessage('Product id is required'),
    validate,
    controller.detail
);

module.exports = router;