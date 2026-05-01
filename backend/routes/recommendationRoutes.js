const router = require('express').Router();
const controller = require('../controllers/recommendationController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', requireAuth, controller.getRecommendations);

module.exports = router;
