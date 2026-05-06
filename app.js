(function() {
  'use strict';

  // ==================== Storage ====================
  const Storage = {
    save(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    load(key, defaultValue) {
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultValue;
      } catch {
        return defaultValue;
      }
    }
  };

  // ==================== State ====================
  let state = {
    mode: 'focus',
    remaining: 25 * 60 * 1000,
    isRunning: false,
    startTime: null,
    sessionCount: 0,
    settings: {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      soundEnabled: true,
      theme: 'dark'
    },
    tasks: []
  };

  function loadState() {
    const saved = Storage.load('zenTimerState', {});
    Object.assign(state, {
      mode: saved.mode || 'focus',
      remaining: saved.remaining || state.settings.focusDuration * 60 * 1000,
      isRunning: saved.isRunning || false,
      startTime: saved.startTime || null,
      sessionCount: saved.sessionCount || 0,
      settings: { ...state.settings, ...saved.settings },
      tasks: saved.tasks || []
    });

    if (state.isRunning && state.startTime) {
      const elapsed = Date.now() - state.startTime;
      state.remaining = Math.max(0, state.remaining - elapsed);
      if (state.remaining <= 0) {
        state.remaining = 0;
        state.isRunning = false;
        handleTimerEnd();
      } else {
        state.startTime = Date.now();
      }
    }

    applyTheme(state.settings.theme);
  }

  function saveState() {
    Storage.save('zenTimerState', {
      mode: state.mode,
      remaining: state.remaining,
      isRunning: state.isRunning,
      startTime: state.startTime,
      sessionCount: state.sessionCount,
      settings: state.settings,
      tasks: state.tasks
    });
  }

  // ==================== Timer Logic ====================
  const timerDisplay = document.querySelector('.timer-time');
  const timerMode = document.querySelector('.timer-mode');
  const startPauseBtn = document.getElementById('startPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const progressCircle = document.querySelector('.progress-ring__circle');
  const circumference = 2 * Math.PI * 90;

  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = circumference;

  function updateProgressRing() {
    const total = getModeDurationMs(state.mode);
    const offset = circumference - (state.remaining / total) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  function getModeDurationMs(mode) {
    const durations = {
      focus: state.settings.focusDuration * 60 * 1000,
      shortBreak: state.settings.shortBreakDuration * 60 * 1000,
      longBreak: state.settings.longBreakDuration * 60 * 1000
    };
    return durations[mode];
  }

  function updateTimerDisplay() {
    let remaining = state.remaining;
    if (state.isRunning && state.startTime) {
      remaining = Math.max(0, state.remaining - (Date.now() - state.startTime));
    }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const modeNames = { focus: 'Focus', shortBreak: 'Short Break', longBreak: 'Long Break' };
    document.title = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} - ${modeNames[state.mode]} | Zen Timer`;
    updateProgressRing();
  }

  function startTimer() {
    if (state.isRunning) return;
    state.isRunning = true;
    state.startTime = Date.now();
    startPauseBtn.textContent = 'Pause';
    saveState();
    tick();
  }

  function pauseTimer() {
    if (!state.isRunning) return;
    state.remaining = Math.max(0, state.remaining - (Date.now() - state.startTime));
    state.isRunning = false;
    state.startTime = null;
    startPauseBtn.textContent = 'Start';
    saveState();
  }

  function toggleTimer() {
    state.isRunning ? pauseTimer() : startTimer();
  }

  function resetTimer() {
    state.isRunning = false;
    state.startTime = null;
    state.remaining = getModeDurationMs(state.mode);
    startPauseBtn.textContent = 'Start';
    updateTimerDisplay();
    saveState();
  }

  function switchMode(mode) {
    state.mode = mode;
    state.isRunning = false;
    state.startTime = null;
    state.remaining = getModeDurationMs(mode);
    startPauseBtn.textContent = 'Start';
    updateModeButtons();
    updateTimerDisplay();
    saveState();
  }

  function updateModeButtons() {
    modeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === state.mode));
    const modeNames = { focus: 'Focus', shortBreak: 'Short Break', longBreak: 'Long Break' };
    timerMode.textContent = modeNames[state.mode];
  }

  function tick() {
    if (!state.isRunning) return;
    const remaining = Math.max(0, state.remaining - (Date.now() - state.startTime));
    updateTimerDisplay();
    if (remaining <= 0) {
      handleTimerEnd();
      return;
    }
    requestAnimationFrame(tick);
  }

  function handleTimerEnd() {
    state.isRunning = false;
    state.startTime = null;
    state.remaining = 0;
    startPauseBtn.textContent = 'Start';
    updateTimerDisplay();
    saveState();

    if (state.settings.soundEnabled) playBeep();
    showNotification();

    if (state.mode === 'focus') {
      state.sessionCount++;
      const nextMode = state.sessionCount % 4 === 0 ? 'longBreak' : 'shortBreak';
      switchMode(nextMode);
      if (state.settings.autoStartBreaks) startTimer();
    } else {
      switchMode('focus');
      if (state.settings.autoStartPomodoros) startTimer();
    }
  }

  // ==================== Audio ====================
  function playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 440;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1);
    } catch (e) {
      console.error('Audio error:', e);
    }
  }

  // ==================== Notifications ====================
  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  function showNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      const modeNames = { focus: 'Focus', shortBreak: 'Short Break', longBreak: 'Long Break' };
      new Notification(`Zen Timer: ${modeNames[state.mode]} complete!`, {
        body: `Time for ${state.mode === 'focus' ? 'a break' : 'focus session'}`
      });
    }
  }

  // ==================== Tasks ====================
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

  function renderTasks() {
    taskList.innerHTML = '';
    state.tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.draggable = true;
      li.dataset.index = index;

      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" aria-label="Mark task complete" ${task.completed ? 'checked' : ''} data-index="${index}">
        <span class="task-text" data-index="${index}">${task.text}</span>
        <span class="task-est">${task.completedPomodoros}/${task.estimatedPomodoros}</span>
        <div class="task-actions">
          <button class="task-edit-btn" data-index="${index}">Edit</button>
          <button class="task-delete-btn" data-index="${index}">Delete</button>
        </div>
      `;

      li.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', index);
        li.classList.add('dragging');
      });

      li.addEventListener('dragend', () => li.classList.remove('dragging'));
      taskList.appendChild(li);
    });

    taskList.addEventListener('dragover', (e) => {
      e.preventDefault();
      const dragging = document.querySelector('.dragging');
      if (!dragging) return;
      const after = getDragAfterElement(taskList, e.clientY);
      after ? taskList.insertBefore(dragging, after) : taskList.appendChild(dragging);
    });

    taskList.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const items = [...taskList.querySelectorAll('.task-item')];
      const toIndex = items.findIndex(item => item.classList.contains('dragging'));
      if (fromIndex === toIndex) return;

      const [moved] = state.tasks.splice(fromIndex, 1);
      state.tasks.splice(toIndex, 0, moved);
      saveState();
      renderTasks();
    });
  }

  function getDragAfterElement(container, y) {
    const elements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    return elements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  function addTask(text) {
    if (!text.trim()) return;
    state.tasks.push({
      text: text.trim(),
      completed: false,
      completedPomodoros: 0,
      estimatedPomodoros: 1
    });
    saveState();
    renderTasks();
    taskInput.value = '';
  }

  function deleteTask(index) {
    state.tasks.splice(index, 1);
    saveState();
    renderTasks();
  }

  function toggleTaskComplete(index) {
    state.tasks[index].completed = !state.tasks[index].completed;
    saveState();
    renderTasks();
  }

  // ==================== Settings ====================
  const settingsModal = document.getElementById('settingsModal');
  const settingsBtn = document.getElementById('settingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const focusSlider = document.getElementById('focusDuration');
  const focusVal = document.getElementById('focusDurationVal');
  const shortSlider = document.getElementById('shortBreakDuration');
  const shortVal = document.getElementById('shortBreakVal');
  const longSlider = document.getElementById('longBreakDuration');
  const longVal = document.getElementById('longBreakVal');
  const autoStartBreaks = document.getElementById('autoStartBreaks');
  const autoStartPomodoros = document.getElementById('autoStartPomodoros');
  const soundToggle = document.getElementById('soundToggle');
  const themeToggle = document.getElementById('themeToggle');

  function initSettings() {
    focusSlider.value = state.settings.focusDuration;
    focusVal.textContent = state.settings.focusDuration;
    shortSlider.value = state.settings.shortBreakDuration;
    shortVal.textContent = state.settings.shortBreakDuration;
    longSlider.value = state.settings.longBreakDuration;
    longVal.textContent = state.settings.longBreakDuration;
    autoStartBreaks.checked = state.settings.autoStartBreaks;
    autoStartPomodoros.checked = state.settings.autoStartPomodoros;
    soundToggle.checked = state.settings.soundEnabled;
    themeToggle.checked = state.settings.theme === 'light';
  }

  function updateSettings() {
    state.settings.focusDuration = parseInt(focusSlider.value);
    state.settings.shortBreakDuration = parseInt(shortSlider.value);
    state.settings.longBreakDuration = parseInt(longSlider.value);
    state.settings.autoStartBreaks = autoStartBreaks.checked;
    state.settings.autoStartPomodoros = autoStartPomodoros.checked;
    state.settings.soundEnabled = soundToggle.checked;
    state.settings.theme = themeToggle.checked ? 'light' : 'dark';
    applyTheme(state.settings.theme);
    saveState();
    updateTimerDisplay();
  }

  function applyTheme(theme) {
    const vars = theme === 'light' 
      ? { '--bg': '#ffffff', '--fg': '#0f0f14', '--muted': '#6b6b7b' }
      : { '--bg': '#0f0f14', '--fg': '#f5f5f7', '--muted': '#8a8a9b' };
    Object.entries(vars).forEach(([key, val]) => document.documentElement.style.setProperty(key, val));
  }

  // ==================== Event Listeners ====================
  function setupEventListeners() {
    startPauseBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    modeBtns.forEach(btn => btn.addEventListener('click', () => switchMode(btn.dataset.mode)));

    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      switch(e.key) {
        case ' ': e.preventDefault(); toggleTimer(); break;
        case 'r': case 'R': resetTimer(); break;
        case '1': switchMode('focus'); break;
        case '2': switchMode('shortBreak'); break;
        case '3': switchMode('longBreak'); break;
      }
    });

    taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask(taskInput.value));

    taskList.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (e.target.classList.contains('task-delete-btn')) deleteTask(index);
      if (e.target.classList.contains('task-checkbox')) toggleTaskComplete(index);
      if (e.target.classList.contains('task-edit-btn')) {
        const newText = prompt('Edit task:', state.tasks[index].text);
        if (newText) {
          state.tasks[index].text = newText.trim();
          saveState();
          renderTasks();
        }
      }
    });

    taskList.addEventListener('dblclick', (e) => {
      if (e.target.classList.contains('task-text')) {
        const index = parseInt(e.target.dataset.index);
        const newText = prompt('Edit task:', state.tasks[index].text);
        if (newText) {
          state.tasks[index].text = newText.trim();
          saveState();
          renderTasks();
        }
      }
    });

    settingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.remove('active');
      updateSettings();
    });

    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.remove('active');
        updateSettings();
      }
    });

    [focusSlider, shortSlider, longSlider].forEach(slider => {
      slider.addEventListener('input', () => {
        slider.nextElementSibling.textContent = slider.value;
      });
    });
  }

  // ==================== Init ====================
  function init() {
    loadState();
    initSettings();
    updateModeButtons();
    updateTimerDisplay();
    renderTasks();
    setupEventListeners();
    requestNotificationPermission();
    if (state.isRunning) tick();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
