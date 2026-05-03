const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const skillModel = require('../models/skillModel');
const recModel = require('../models/recommendationModel');
const userModel = require('../models/userModel');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('home', { title: 'Skill Recommendation System' });
});

router.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const [user, skills, userSkillsWithProf, recommendations] = await Promise.all([
      userModel.findUserById(req.session.user.id),
      skillModel.getAllSkills(),
      userModel.getUserSkillsWithProficiency(req.session.user.id),
      recModel.getRecommendations(req.session.user.id)
    ]);

    const userSkillIds = userSkillsWithProf.map((row) => row.skill_id);
    const userProficiencyMap = Object.fromEntries(
      userSkillsWithProf.map((row) => [row.skill_id, row.proficiency])
    );

    req.session.user = { ...req.session.user, name: user.name, target_role: user.target_role };
    res.render('dashboard/index', {
      title: 'Dashboard',
      user,
      skills,
      userSkillIds,
      userProficiencyMap,
      recommendations,
      errors: []
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/profile',
  requireAuth,
  [
    body('name').trim().escape().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
    body('targetRole').optional({ checkFalsy: true }).trim().escape().isLength({ max: 100 }),
    body('skillIds').optional()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.flash = { type: 'error', message: errors.array()[0].msg };
        return res.redirect('/dashboard');
      }

      const skillIds = Array.isArray(req.body.skillIds)
        ? req.body.skillIds
        : req.body.skillIds ? [req.body.skillIds] : [];
      const proficiencyMap = req.body.proficiency || {};

      await userModel.updateProfile(req.session.user.id, {
        name: req.body.name,
        targetRole: req.body.targetRole || null
      });
      await userModel.replaceUserSkills(req.session.user.id, skillIds, proficiencyMap);

      req.session.user.name = req.body.name;
      req.session.user.target_role = req.body.targetRole || null;
      req.session.flash = { type: 'success', message: 'Profile and skills updated.' };
      res.redirect('/dashboard');
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
