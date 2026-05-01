const db = require('../config/db');

exports.createUser = async ({ name, email, passwordHash, role = 'learner', targetRole = null }) => {
  const [result] = await db.query(
    `INSERT INTO users (name, email, password_hash, role, target_role)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, passwordHash, role, targetRole]
  );
  return result.insertId;
};

exports.findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

exports.findUserById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, name, email, role, target_role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

exports.updateProfile = async (id, { name, targetRole }) => {
  await db.query(
    'UPDATE users SET name = ?, target_role = ? WHERE id = ?',
    [name, targetRole, id]
  );
};

exports.replaceUserSkills = async (userId, skillIds = [], proficiencyMap = {}) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query('DELETE FROM user_skills WHERE user_id = ?', [userId]);
    const uniqueSkillIds = [...new Set(skillIds.map(Number).filter(Boolean))];
    for (const skillId of uniqueSkillIds) {
      const proficiency = proficiencyMap[skillId] || 'beginner';
      await connection.query(
        'INSERT INTO user_skills (user_id, skill_id, proficiency) VALUES (?, ?, ?)',
        [userId, skillId, proficiency]
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.getUserSkillIds = async (userId) => {
  const [rows] = await db.query(
    'SELECT skill_id FROM user_skills WHERE user_id = ?',
    [userId]
  );
  return rows.map((row) => row.skill_id);
};

exports.getUserSkillsWithProficiency = async (userId) => {
  const [rows] = await db.query(
    'SELECT skill_id, proficiency FROM user_skills WHERE user_id = ?',
    [userId]
  );
  return rows;
};
