const { body } = require('express-validator');
const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');

router.post(
    '/register',
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
    controller.register
);

router.post(
    '/login',
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
    controller.login
);

router.get('/me', requireAuth, controller.me);

module.exports = router;