const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    target_role: user.target_role
  };
}

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Login', errors: [], old: {} });
};

exports.showRegister = (req, res) => {
  res.render('auth/register', { title: 'Register', errors: [], old: {} });
};

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/register', {
        title: 'Register',
        errors: errors.array(),
        old: req.body
      });
    }

    const existingUser = await userModel.findUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(409).render('auth/register', {
        title: 'Register',
        errors: [{ msg: 'Email is already registered.' }],
        old: req.body
      });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    await userModel.createUser({
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      passwordHash,
      targetRole: req.body.targetRole || null
    });

    req.session.flash = { type: 'success', message: 'Registration successful. Please login.' };
    res.redirect('/auth/login');
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        title: 'Login',
        errors: errors.array(),
        old: req.body
      });
    }

    const user = await userModel.findUserByEmail(req.body.email.trim().toLowerCase());
    const isValid = user && await bcrypt.compare(req.body.password, user.password_hash);

    if (!isValid) {
      return res.status(401).render('auth/login', {
        title: 'Login',
        errors: [{ msg: 'Invalid email or password.' }],
        old: req.body
      });
    }

    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.user = safeUser(user);
      res.redirect('/dashboard');
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
