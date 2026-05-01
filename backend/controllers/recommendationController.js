const recModel = require('../models/recommendationModel');

exports.getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await recModel.getRecommendations(req.session.user.id);
    res.render('skills/recommendations', {
      title: 'Recommendations',
      skills: recommendations
    });
  } catch (error) {
    next(error);
  }
};
