const router = require('express').Router();
const { body, param, validationResult } = require('express-validator');
const db = require('../config/db');
const skillModel = require('../models/skillModel');
const recModel = require('../models/recommendationModel');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const skillRules = [
  body('name').trim().isLength({ min: 2 }),
  body('categoryId').isInt({ min: 1 }),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']),
  body('description').trim().isLength({ min: 10 }),
  body('resourceUrl').optional({ checkFalsy: true }).isURL()
];

const idRule = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer.')
];

function validateApi(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

router.get('/health', asyncHandler(async (req, res) => {
  await db.query('SELECT 1');
  res.json({
    status: 'ok',
    app: 'Skill Recommendation System',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
}));

router.get('/categories', asyncHandler(async (req, res) => {
  res.json(await skillModel.getCategories());
}));

router.get('/skills', asyncHandler(async (req, res) => {
  res.json(await skillModel.getAllSkills());
}));

router.get('/skills/:id', idRule, validateApi, asyncHandler(async (req, res) => {
  const skill = await skillModel.findSkillById(req.params.id);
  if (!skill) {
    return res.status(404).json({ error: 'Skill not found.' });
  }
  res.json(skill);
}));

router.post('/skills', requireAdmin, skillRules, validateApi, asyncHandler(async (req, res) => {
  const id = await skillModel.createSkill({
    name: req.body.name,
    categoryId: req.body.categoryId,
    difficulty: req.body.difficulty,
    description: req.body.description,
    resourceUrl: req.body.resourceUrl
  });
  res.status(201).json({ message: 'Created', id });
}));

router.put('/skills/:id', requireAdmin, idRule, skillRules, validateApi, asyncHandler(async (req, res) => {
  await skillModel.updateSkill(req.params.id, {
    name: req.body.name,
    categoryId: req.body.categoryId,
    difficulty: req.body.difficulty,
    description: req.body.description,
    resourceUrl: req.body.resourceUrl
  });
  res.json({ message: 'Updated' });
}));

router.delete('/skills/:id', requireAdmin, idRule, validateApi, asyncHandler(async (req, res) => {
  await skillModel.deleteSkill(req.params.id);
  res.json({ message: 'Deleted' });
}));

router.get('/recommendations', requireAuth, asyncHandler(async (req, res) => {
  res.json(await recModel.getRecommendations(req.session.user.id));
}));

module.exports = router;
