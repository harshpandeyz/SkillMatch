const db = require('../config/db');

exports.getAllSkills = async () => {
  const [rows] = await db.query(
    `SELECT s.*, c.name AS category_name
     FROM skills s
     JOIN categories c ON c.id = s.category_id
     ORDER BY c.name, s.name`
  );
  return rows;
};

exports.getCategories = async () => {
  const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
  return rows;
};

exports.findSkillById = async (id) => {
  const [rows] = await db.query(
    `SELECT s.*, c.name AS category_name
     FROM skills s
     JOIN categories c ON c.id = s.category_id
     WHERE s.id = ?`,
    [id]
  );
  return rows[0] || null;
};

exports.createSkill = async ({ name, categoryId, difficulty, description, resourceUrl }) => {
  const [result] = await db.query(
    `INSERT INTO skills (name, category_id, difficulty, description, resource_url)
     VALUES (?, ?, ?, ?, ?)`,
    [name, categoryId, difficulty, description, resourceUrl || null]
  );
  return result.insertId;
};

exports.updateSkill = async (id, { name, categoryId, difficulty, description, resourceUrl }) => {
  await db.query(
    `UPDATE skills
     SET name = ?, category_id = ?, difficulty = ?, description = ?, resource_url = ?
     WHERE id = ?`,
    [name, categoryId, difficulty, description, resourceUrl || null, id]
  );
};

exports.deleteSkill = async (id) => {
  await db.query('DELETE FROM skills WHERE id = ?', [id]);
};
