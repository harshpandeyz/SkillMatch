const router = require('express').Router();
const { body } = require('express-validator');
const controller = require('../controllers/authController');

const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('targetRole').optional({ checkFalsy: true }).trim().isLength({ max: 100 })
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.')
];

router.get('/login', controller.showLogin);
router.get('/register', controller.showRegister);
router.post('/register', registerRules, controller.register);
router.post('/login', loginRules, controller.login);
router.get('/logout', controller.logout);

module.exports = router;
