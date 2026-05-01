exports.requireAuth = (req, res, next) => {
  if (!req.session.user) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    req.session.flash = { type: 'error', message: 'Please login to continue.' };
    return res.redirect('/auth/login');
  }
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (!req.session.user) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    req.session.flash = { type: 'error', message: 'Please login to continue.' };
    return res.redirect('/auth/login');
  }

  if (req.session.user.role !== 'admin') {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    req.session.flash = { type: 'error', message: 'Admin access required.' };
    return res.redirect('/dashboard');
  }

  next();
};
