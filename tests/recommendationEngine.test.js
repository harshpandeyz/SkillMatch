const test = require('node:test');
const assert = require('node:assert/strict');
const { buildRecommendations } = require('../backend/utils/recommendationEngine');

test('recommendation engine prioritizes category and target role matches', () => {
  const skills = [
    {
      id: 1,
      name: 'JavaScript Fundamentals',
      category_id: 1,
      category_name: 'Programming',
      difficulty: 'Beginner',
      description: 'JavaScript basics'
    },
    {
      id: 2,
      name: 'Express.js',
      category_id: 2,
      category_name: 'Backend Development',
      difficulty: 'Intermediate',
      description: 'Backend API routing with Express'
    },
    {
      id: 3,
      name: 'UI Wireframing',
      category_id: 3,
      category_name: 'Design',
      difficulty: 'Beginner',
      description: 'Plan screen layouts'
    }
  ];

  const result = buildRecommendations({
    skills,
    ownedSkills: [skills[0]],
    targetRole: 'Backend Developer'
  });

  assert.equal(result[0].name, 'Express.js');
  assert.ok(result[0].score > result[1].score);
  assert.match(result[0].reason, /Backend Developer|adjacent|skills/);
});

test('recommendation engine excludes skills the user already owns', () => {
  const skills = [
    {
      id: 1,
      name: 'SQL CRUD Operations',
      category_id: 4,
      category_name: 'Database',
      difficulty: 'Beginner',
      description: 'Create read update delete'
    }
  ];

  const result = buildRecommendations({
    skills,
    ownedSkills: skills,
    targetRole: 'Backend Developer'
  });

  assert.equal(result.length, 0);
});
