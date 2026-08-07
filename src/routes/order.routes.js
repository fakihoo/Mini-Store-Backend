const router = require('express').Router();
const controller = require('../controllers/order.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.use(requireAuth);

router.post('/', controller.create);
router.get('/', controller.index);
router.get('/:id', controller.show);

module.exports = router;