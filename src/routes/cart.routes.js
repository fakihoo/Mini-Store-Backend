const { body, param } = require('express-validator');
const router = require('express').Router();
const controller = require('../controllers/cart.controller');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');

router.use(requireAuth);

router.get('/', controller.index);

router.post(
    '/items',
    body('productId').isString().notEmpty().withMessage('Product id is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('variants').optional().isObject().withMessage('Variants must be an object'),
    validate,
    controller.add
);

router.patch(
    '/items/:itemId',
    param('itemId').notEmpty().withMessage('Item id is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('variants').optional().isObject().withMessage('Variants must be an object'),
    validate,
    controller.update
);

router.delete('/items/:itemId', controller.remove);

router.delete('/', controller.clear);

module.exports = router;