
// -------------------------- HTML element variables  ------------------------------------ // 
var radios = document.getElementsByName("radio"),
  radioContainers = document.getElementsByClassName("container"),
  display = document.querySelector("#timer__clock"),
  start = document.querySelector(".start"),
  pause = document.querySelector(".pause"),
  reset = document.querySelector(".reset");



// -------------------------- Global variables for the clock  ----------------------------- // 
var time = 0,
  pausedTime;



// ----------------- Boolean switch variables to control clock usability or UX ------------- // 
var isPaused = false,
  isChecked = false,
  isCounting = false;



// ------ functions to enable or disable buttons & modify CSS, called via boolean values ---- // 

function disableButton(el) {
  el.disabled = true;
  el.classList.add("disableControl");
}

function enableButton(el) {
  el.disabled = false;
  el.classList.remove("disableControl");
}



// --------------------------------- disable buttons on page load ------------------------ // 

window.onload = function() {
  checkedSwitch();
};



// - modify the usability of the clock control buttons based on whether or not a time interval radio button has been selected - // 

function checkedSwitch() {
  if (isChecked == false) {
    disableButton(start);
    disableButton(pause);
    disableButton(reset);
  } else {
    enableButton(start);
  }
}



// ------------------------ on change function's for radio buttons - GETS TIME ------------------------ //

// if a button is selected, set a variable to hold that button's value
// set the h1 html element  to match that value, run checkedSwitch fn to control UX
// return the variable so that the countdown value can be used by other fn's
function getInterval() {
  var val = 0;
  for (let z = 0; z < radios.length; z++) {
    if (radios[z].checked == true) {
      isChecked = true;
      checkedSwitch();
      val = radios[z].value;
      display.textContent = val + ":00";
      return parseInt(val);
    }
  }
}



// --------------------------  Start button on click function - STARTS CLOCK ----------------------------- //

// if / else statement to determine whether the clock was previously running
// calls the counting function to control UX
// calls start timer function to update the time of the clock
function startClock() {
  if (isPaused) {
    isPaused = false;
    isCounting = true;
    counting();
    startTimer(pausedTime, display);
  } else {
    time = getInterval();
    var countDownTime = 60 * time;
    isPaused = false;
    isCounting = true;
    counting();
    startTimer(countDownTime, display);
  }
}

// --------- disable buttons and switch booleans while clock is running - UX FUNCTION -------------- //
function counting() {
  if (isCounting == true) {
    // disable radio buttons
    for (let z = 0; z < radios.length; z++) {
      disableButton(radios[z]);
      disableButton(radioContainers[z]);
    }
    disableButton(start);
    enableButton(pause);
    disableButton(reset);
  } else {
    for (let z = 0; z < radios.length; z++) {
      enableButton(radios[z]);
      enableButton(radioContainers[z]);
    }
    pause.disabled = true;
  }
}



// - function that will change the h1 element to reflect set interval's duration, updates values after clear interval - CLOCK DISPLAY AND AJAX CALL - //

// takes a time to count down from and an html element to modify
// the value from the radio button will be what is passed in and the
// h1 will be what reflects that time
// calls AJAX function from ajax.js to increment inProgress html elements after interval is cleared
function startTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds;

  var x = setInterval(function() {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ":" + seconds;

    if (isPaused) {
      pausedTime = timer;
      clearInterval(x);
    }

    if (--timer < 0) {
      clearInterval(x);
      resetClock();
      incrementIterations();
    }
  }, 1000);
}



// ------ function flips the bool switch & modifies the way startClock behaves - PAUSE CLOCK ----------------------------- //

function pauseClock() {
  isPaused = true;
  if (isPaused == true) {
    disableButton(pause);
    enableButton(start);
    enableButton(reset);
  }
}



// ------ reset all values to initial states once clearInterval is ran - RESET CLOCK ----------------------------- //

function resetClock() {
  display.textContent = "00:00";
  isPaused = false;
  isCounting = false;
  counting();
  for (let z = 0; z < radios.length; z++) {
    radios[z].checked = false;
  }
  isChecked = false;
  checkedSwitch();
}
