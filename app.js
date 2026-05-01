const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./backend/config/env');
const sessionStore = require('./backend/config/sessionStore');
const { apiLimiter, authLimiter } = require('./backend/middleware/rateLimiters');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend', 'views'));

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(morgan(config.isProduction ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.json({ limit: '100kb' }));
app.use(methodOverride('_method'));
app.use(session({
  name: 'skillmatch.sid',
  secret: config.sessionSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 4
  }
}));

app.use(express.static(path.join(__dirname, 'frontend', 'public'), {
  maxAge: config.isProduction ? '7d' : 0,
  etag: true
}));

app.use((req, res, next) => {
  const flash = req.session.flash || null;
  delete req.session.flash;
  res.locals.currentUser = req.session.user || null;
  res.locals.flash = flash;
  res.locals.title = 'Skill Recommendation System';
  next();
});

app.use('/', require('./backend/routes/pageRoutes'));
app.use('/auth', authLimiter, require('./backend/routes/authRoutes'));
app.use('/skills', require('./backend/routes/skillRoutes'));
app.use('/recommend', require('./backend/routes/recommendationRoutes'));
app.use('/api', apiLimiter, require('./backend/routes/apiRoutes'));

app.use(require('./backend/middleware/notFound'));
app.use(require('./backend/middleware/errorHandler'));

if (require.main === module) {
  const server = app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });

  const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = app;
