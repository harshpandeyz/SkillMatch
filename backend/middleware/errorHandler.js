module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(status);

  if (req.originalUrl.startsWith('/api')) {
    return res.json({ error: message });
  }

  return res.render('error', {
    title: 'Error',
    status,
    message
  });
};
