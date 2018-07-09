// Functions to run the timers and play bells - all the business logic
// that isn't related to being a service worker.


// Is there a better solution than global varaibles?
var startTime;
var timer = null;
var lastBellTime = 0;
var THRESHOLD = 60;
var END_THRESHOLD = 300;

// Handle a press of the start/stop button.
function handleStartStop() {
  console.log("Button clicked!");

  var button = document.getElementById("StartStop");
  console.log("Button text is " + button.value);
  if (button.value == "Start") {
    playBell();
    setButtonText("Stop");
    startTimer();
  } else {
    playEndBell();
    setButtonText("Start");
    stopTimer();
  }
}

// TODO: Do I really need to set all 3 of these?  Can I get by with just one?
// Set the button text and state.
function setButtonText(newText) {
  var button = document.getElementById("StartStop");
  button.value = newText;
  button.text = newText;
  button.innerHTML = newText;
}

// Start the session.
function startTimer() {
  console.log("startTimer");
  timer = window.setInterval(updateDisplayTime, 1000);
  startTime = new Date();
  reset();
}

// End the session
function stopTimer() {
  console.log("stopTimer");
  window.clearInterval(timer);
  startTime = null;
  reset();
  setButtonText("Start");
}

// Make the sound of a starting or intermediate bell
function playBell() {
  console.log("Playing intermediate bell");
  // Play a sound
  var audio = new Audio('HighBell.mp3');
  audio.play();
}

// Sound the ending bell.
function playEndBell() {
  console.log("Playing final bell");
  var audio = new Audio('TempleBell.mp3');
  audio.play();
}

// Update the time display.
function updateDisplayTime() {
  var now = new Date();
  var diff = now - startTime;
  var minutes = Math.floor(diff /(1000*60));
  var seconds = Math.floor(diff/1000) % 60;
  // Write current time in mm:ss format into DOM.
  var timeToDisplay = minutes.toString() + ":";
  if (seconds < 10)
    timeToDisplay = timeToDisplay + "0";
  timeToDisplay = timeToDisplay + seconds.toString();
  // console.log("new time " + timeToDisplay);
  var timeDiv = document.getElementById("TimeDisplay");
  timeDiv.innerHTML = timeToDisplay;
  checkIfBellIsNeeded(diff);
}

// Look at the time, if needed, sound an intermediate bell or end.
function checkIfBellIsNeeded(milliseconds) {
  var seconds = milliseconds/1000;
  if (seconds >= END_THRESHOLD) {
    stopTimer();
    playEndBell();
    return;
  }

  if (seconds - lastBellTime >= THRESHOLD) {
    lastBellTime = seconds;
    playBell();
  }

}

// Clear the display time indicator, reset variables.
function reset() {
  console.log("resetDisplayTime");
  var timeDiv = document.getElementById("TimeDisplay");
  timeDiv.innerHTML = "0:00";
  lastBellTime = 0;
  var button = document.getElementById("StartStop");
}

