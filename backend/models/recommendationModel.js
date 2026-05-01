const db = require('../config/db');
const { buildRecommendations } = require('../utils/recommendationEngine');

exports.getRecommendations = async (userId) => {
  const [users] = await db.query('SELECT id, target_role FROM users WHERE id = ?', [userId]);
  const [skills] = await db.query(
    `SELECT s.*, c.name AS category_name
     FROM skills s
     JOIN categories c ON c.id = s.category_id
     ORDER BY c.name, s.name`
  );
  const [ownedSkills] = await db.query(
    `SELECT s.*, c.name AS category_name, us.proficiency
     FROM user_skills us
     JOIN skills s ON s.id = us.skill_id
     JOIN categories c ON c.id = s.category_id
     WHERE us.user_id = ?`,
    [userId]
  );

  return buildRecommendations({
    skills,
    ownedSkills,
    targetRole: users[0] ? users[0].target_role : ''
  });
};
