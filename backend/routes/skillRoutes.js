const router = require('express').Router();
const { body } = require('express-validator');
const controller = require('../controllers/skillController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const skillRules = [
  body('name').trim().escape().isLength({ min: 2 }).withMessage('Skill name must be at least 2 characters.'),
  body('categoryId').isInt({ min: 1 }).withMessage('Select a valid category.'),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Select a valid difficulty.'),
  body('description').trim().escape().isLength({ min: 10 }).withMessage('Description must be at least 10 characters.'),
  body('resourceUrl').optional({ checkFalsy: true }).isURL().withMessage('Resource URL must be valid.')
];

router.get('/', controller.index);
router.get('/new', requireAdmin, controller.new);
router.post('/', requireAdmin, skillRules, controller.create);
router.get('/:id', controller.show);
router.get('/:id/edit', requireAdmin, controller.edit);
router.put('/:id', requireAdmin, skillRules, controller.update);
router.delete('/:id', requireAdmin, controller.destroy);

module.exports = router;
