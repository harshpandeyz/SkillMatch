document.addEventListener('submit', (event) => {
  const form = event.target;
  const isDeleteForm = form.matches('form[action*="_method=DELETE"]');

  if (isDeleteForm && !window.confirm('Delete this skill?')) {
    event.preventDefault();
  }
});

const flash = document.querySelector('.flash');
if (flash) {
  setTimeout(() => {
    flash.style.transition = 'opacity 0.4s';
    flash.style.opacity = '0';
    setTimeout(() => flash.remove(), 400);
  }, 3500);
}

const courseSearch = document.querySelector('#courseSearch');
const categoryFilter = document.querySelector('#categoryFilter');
const difficultyFilter = document.querySelector('#difficultyFilter');
const courseCards = Array.from(document.querySelectorAll('.course-card[data-name]'));

function filterCourses() {
  const search = (courseSearch?.value || '').trim().toLowerCase();
  const category = categoryFilter?.value || '';
  const difficulty = difficultyFilter?.value || '';

  courseCards.forEach((card) => {
    const matchesSearch = !search || card.dataset.name.includes(search);
    const matchesCategory = !category || card.dataset.category === category;
    const matchesDifficulty = !difficulty || card.dataset.difficulty === difficulty;
    card.hidden = !(matchesSearch && matchesCategory && matchesDifficulty);
  });
}

[courseSearch, categoryFilter, difficultyFilter].forEach((control) => {
  if (control) control.addEventListener('input', filterCourses);
});
