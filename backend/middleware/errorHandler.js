module.exports = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  res.status(status);

  if (req.originalUrl.startsWith('/api')) {
    return res.json({
      error: status === 500 ? 'Internal server error' : err.message
    });
  }

  return res.render('error', {
    title: 'Error',
    status,
    message: status === 500 ? 'Something went wrong. Please try again.' : err.message
  });
};
