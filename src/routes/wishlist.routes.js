const { param } = require('express-validator');
const router = require('express').Router();
const controller = require('../controllers/wishlist.controller');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');

router.use(requireAuth);

router.get('/', controller.index);

router.post('/:productId/move-to-cart', controller.moveToCart);

router.post(
    '/:productId',
    param('productId').notEmpty().withMessage('Product id is required'),
    validate,
    controller.add
);

router.delete(
    '/:productId',
    param('productId').notEmpty().withMessage('Product id is required'),
    validate,
    controller.remove
);

module.exports = router;