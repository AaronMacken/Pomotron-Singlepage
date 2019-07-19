// html element vars
var radios = document.getElementsByName("radio"),
  radioContainers = document.getElementsByClassName("container"),
  display = document.querySelector("#timer__clock"),
  start = document.querySelector(".start"),
  pause = document.querySelector(".pause"),
  reset = document.querySelector(".reset");

// clock variables
var time = 0,
  pausedTime;

// boolean UX variables
var isPaused = false,
  isChecked = false,
  isCounting = false;



function disableButton(el) {
  el.disabled = true;
  el.classList.add('disableControl');
}

function enableButton(el) {
  el.disabled = false;
  el.classList.remove('disableControl');
}



window.onload = function() {
  checkedSwitch();
  pause.disabled = true;
};



// on change function's for radio buttons
// if a button is selected, set a variable to hold that button's value
// set the clock to match that value, run checkedSwitch fn to control UX
// and return the variable so that the countdown value can be used by other fn's
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

// calls disable or enable button functions based on which control booleans are active
// this will modify the css & enabled/disabled properties of the buttons
function checkedSwitch() {
  if (isChecked == false) {
    disableButton(start);
    disableButton(pause);
    disableButton(reset);
  } else {
    enableButton(start);
  }
}

// start button's on click function
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

// disable time interval buttons while the clock is running
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

// takes a time to count down from and an html element to modify
// the value from the radio button will be what is passed in and the 
// h1 will be what reflects that time
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
      // call ajax here to modify iterations completed
    }
  }, 1000);
}

// function flips the bool switch & modifies the way startClock behaves
function pauseClock() {
  isPaused = true;
  if (isPaused == true) {
    disableButton(pause);
    enableButton(start);
    enableButton(reset);
  }
}

// reset to default values
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