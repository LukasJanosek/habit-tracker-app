const STORAGE_KEY = 'habits';

function loadHabits() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveHabits(habits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function renderHabits(habits) {
  const list = document.getElementById('habit-list');
  list.innerHTML = '';

  habits.forEach((habit, index) => {
    const li = document.createElement('li');
    if (habit.done) li.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = habit.done;
    checkbox.addEventListener('change', () => {
      habits[index].done = checkbox.checked;
      saveHabits(habits);
      renderHabits(habits);
    });

    const nameSpan = document.createElement('span');
    nameSpan.className = 'habit-name';
    nameSpan.textContent = habit.name;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      habits.splice(index, 1);
      saveHabits(habits);
      renderHabits(habits);
    });

    li.appendChild(checkbox);
    li.appendChild(nameSpan);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

function initDarkMode() {
  const toggle = document.getElementById('dark-toggle');
  const isDark = localStorage.getItem('dark-mode') === 'true';
  if (isDark) {
    document.body.classList.add('dark');
    toggle.textContent = 'Light Mode';
  }
  toggle.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark');
    localStorage.setItem('dark-mode', dark);
    toggle.textContent = dark ? 'Light Mode' : 'Dark Mode';
  });
}

function init() {
  const habits = loadHabits();
  renderHabits(habits);
  initDarkMode();

  const input = document.getElementById('habit-input');
  const addBtn = document.getElementById('add-btn');

  function addHabit() {
    const name = input.value.trim();
    if (!name) return;
    habits.push({ name, done: false });
    saveHabits(habits);
    renderHabits(habits);
    input.value = '';
    input.focus();
  }

  addBtn.addEventListener('click', addHabit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addHabit();
  });

  document.getElementById('clear-completed-btn').addEventListener('click', () => {
    const remaining = habits.filter(h => !h.done);
    habits.length = 0;
    habits.push(...remaining);
    saveHabits(habits);
    renderHabits(habits);
  });
}

init();
