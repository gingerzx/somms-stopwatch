let startStopBtn = document.getElementById('start-stop-btn');
let lapResetBtn = document.getElementById('reset-btn');
let timeDisplay = document.querySelector('.time-display');
let lapList = document.getElementById('lap-list');


let timer = null;
let elapsedMilliseconds = 0;
let running = false;
let laps = [];



// Load saved state from localStorage
if (localStorage.getItem('stopwatch')) {
  const savedState = JSON.parse(localStorage.getItem('stopwatch'));
  elapsedMilliseconds = savedState.elapsedMilliseconds || 0;
  running = savedState.running || false;
  laps = savedState.laps || [];

  if (running) {
    const savedTime = Date.now() - savedState.lastUpdated;
    elapsedMilliseconds += savedTime;
  }
}

// Format time function
function formatTime(milliseconds) {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  let mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  let secs = String(totalSeconds % 60).padStart(2, '0');
  let millis = String(milliseconds % 1000).padStart(3, '0');
  return `${hrs}:${mins}:${secs}.${millis}`;
}

// Update display function
function updateDisplay() {
  timeDisplay.textContent = formatTime(elapsedMilliseconds);
}

function updateLaps() {
  lapList.innerHTML = ''; // Clear current lap list
  laps.forEach((lap, index) => {
    const lapItem = document.createElement('li');
    lapItem.textContent = `Lap ${index + 1}: ${formatTime(lap)}`;
    lapList.appendChild(lapItem);
  });
  if (laps.length > 0) {
    document.querySelector('.stopwatch-container h1').classList.add('slide-up');
  } else {
    document.querySelector('.stopwatch-container h1').classList.remove('slide-up');
  }
  // Add or remove has-laps class based on lap count
  const stopwatchContainer = document.querySelector('.stopwatch-container');
  if (laps.length > 0) {
      stopwatchContainer.classList.add('has-laps');
  } else {
      stopwatchContainer.classList.remove('has-laps');
  }
}

// Save state to localStorage
function saveState() {
  const state = {
    elapsedMilliseconds,
    running: false,  // Always save with running = false on exit
    laps,
    lastUpdated: Date.now(),
  };
  localStorage.setItem('stopwatch', JSON.stringify(state));
}

function updateButton() {
  if (running) {
    startStopBtn.textContent = 'Stop';
    startStopBtn.classList.add('stop');
    startStopBtn.classList.remove('continue', 'start');
    lapResetBtn.textContent = 'Lap';
  } else {
    if (elapsedMilliseconds === 0) {
      startStopBtn.textContent = 'Start';
      startStopBtn.classList.add('start');
      startStopBtn.classList.remove('stop', 'continue');
      lapResetBtn.textContent = 'Reset';
    } else {
      startStopBtn.textContent = 'Continue';
      startStopBtn.classList.add('continue');
      startStopBtn.classList.remove('stop', 'start');
      lapResetBtn.textContent = 'Reset';
      
    }
  }
}

// Start/Stop function
function startStopContinue() {
  if (running) {
    clearInterval(timer);
    running = false;
  } else {
    if (elapsedMilliseconds === 0) {
      elapsedMilliseconds = 0;
    } 
    const startTime = Date.now() - elapsedMilliseconds;
    timer = setInterval(() => {
      elapsedMilliseconds = Date.now() - startTime;
      updateDisplay();
    }, 10);
    running = true;
  }
  updateButton();
  saveState();
}

// Reset function
function lapReset() {
  if (running) {
    // If running, record a lap
    laps.push(elapsedMilliseconds);
    updateLaps();
  } else {
    // If not running, reset everything
    clearInterval(timer);
    elapsedMilliseconds = 0;
    laps = [];
    running = false;
    updateDisplay();
    updateLaps();
  }
  updateButton();
  

  saveState();
}

// Stop and save on window unload
window.addEventListener('beforeunload', () => {
  if (running) {
    clearInterval(timer); // Stop the timer
    saveState(); // Save the final state
  }
});

// Event listeners
startStopBtn.addEventListener('click', startStopContinue);
lapResetBtn.addEventListener('click', lapReset);


// Initialize display
updateDisplay();
updateButton();
updateLaps();