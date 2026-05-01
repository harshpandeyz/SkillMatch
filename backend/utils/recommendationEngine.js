const difficultyScore = { Beginner: 10, Intermediate: 20, Advanced: 30 };
const proficiencyRank = { beginner: 1, intermediate: 2, advanced: 3 };

function buildRecommendations({ skills, ownedSkills, targetRole = '' }) {
  const ownedIds = new Set(ownedSkills.map((s) => s.id));
  const ownedCategories = new Map();
  for (const s of ownedSkills) {
    const rank = proficiencyRank[s.proficiency] || 1;
    if (!ownedCategories.has(s.category_id) || ownedCategories.get(s.category_id) < rank) {
      ownedCategories.set(s.category_id, rank);
    }
  }
  const goal = String(targetRole || '').toLowerCase();

  return skills
    .filter((skill) => !ownedIds.has(skill.id))
    .map((skill) => {
      let score = difficultyScore[skill.difficulty] || 15;
      const reasons = [];

      if (ownedCategories.has(skill.category_id)) {
        const catProficiency = ownedCategories.get(skill.category_id);
        const bonus = catProficiency === 3 ? 30 : catProficiency === 2 ? 40 : 45;
        score += bonus;
        reasons.push(`builds on your ${skill.category_name} skills`);
      }

      const haystack = `${skill.name} ${skill.category_name} ${skill.description || ''}`.toLowerCase();
      const goalTokens = goal.split(/\W+/).filter((t) => t.length > 2);
      const matchedGoal = goalTokens.some((t) => haystack.includes(t));
      if (matchedGoal) {
        score += 35;
        reasons.push(`matches your goal: ${targetRole}`);
      }

      if (ownedSkills.length === 0 && skill.difficulty === 'Beginner') {
        score += 25;
        reasons.push('good starting point for your profile');
      }

      if (reasons.length === 0) reasons.push('adds a useful adjacent capability');

      return { ...skill, score, reason: reasons.join(' and ') };
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 8);
}

module.exports = { buildRecommendations };
