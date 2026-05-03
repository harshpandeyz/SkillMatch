const { validationResult } = require('express-validator');
const skillModel = require('../models/skillModel');

function normalizeSkill(body) {
  return {
    name: body.name.trim(),
    categoryId: Number(body.categoryId),
    difficulty: body.difficulty,
    description: body.description.trim(),
    resourceUrl: body.resourceUrl ? body.resourceUrl.trim() : null
  };
}

exports.index = async (req, res, next) => {
  try {
    const [skills, categories] = await Promise.all([
      skillModel.getAllSkills(),
      skillModel.getCategories()
    ]);
    res.render('skills/index', { title: 'Skills', skills, categories, errors: [], old: {} });
  } catch (error) {
    next(error);
  }
};

exports.show = async (req, res, next) => {
  try {
    const skill = await skillModel.findSkillById(req.params.id);
    if (!skill) {
      const error = new Error('Skill not found.');
      error.status = 404;
      throw error;
    }
    res.render('skills/details', { title: skill.name, skill });
  } catch (error) {
    next(error);
  }
};

exports.new = async (req, res, next) => {
  try {
    const categories = await skillModel.getCategories();
    res.render('skills/edit', { title: 'Add Skill', skill: null, categories, errors: [] });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await skillModel.getCategories();
      return res.status(422).render('skills/edit', {
        title: 'Add Skill',
        skill: {
          name: req.body.name || '',
          category_id: Number(req.body.categoryId) || '',
          difficulty: req.body.difficulty || 'Beginner',
          description: req.body.description || '',
          resource_url: req.body.resourceUrl || ''
        },
        categories,
        errors: errors.array(),
        old: req.body
      });
    }

    await skillModel.createSkill(normalizeSkill(req.body));
    req.session.flash = { type: 'success', message: 'Skill created successfully.' };
    res.redirect('/skills');
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const [skill, categories] = await Promise.all([
      skillModel.findSkillById(req.params.id),
      skillModel.getCategories()
    ]);
    if (!skill) {
      const error = new Error('Skill not found.');
      error.status = 404;
      throw error;
    }
    res.render('skills/edit', { title: 'Edit Skill', skill, categories, errors: [] });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [skill, categories] = await Promise.all([
        skillModel.findSkillById(req.params.id),
        skillModel.getCategories()
      ]);
      return res.status(422).render('skills/edit', {
        title: 'Edit Skill',
        skill: {
          ...skill,
          name: req.body.name || '',
          category_id: Number(req.body.categoryId) || '',
          difficulty: req.body.difficulty || 'Beginner',
          description: req.body.description || '',
          resource_url: req.body.resourceUrl || ''
        },
        categories,
        errors: errors.array()
      });
    }

    await skillModel.updateSkill(req.params.id, normalizeSkill(req.body));
    req.session.flash = { type: 'success', message: 'Skill updated successfully.' };
    res.redirect('/skills');
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    await skillModel.deleteSkill(req.params.id);
    req.session.flash = { type: 'success', message: 'Skill deleted successfully.' };
    res.redirect('/skills');
  } catch (error) {
    next(error);
  }
};
