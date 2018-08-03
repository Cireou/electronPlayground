const REMOTE = require('electron').remote;
const BUTTONHOLDER  = document.querySelector('.buttonHolder')
const STARTBTN = document.querySelector('#startTimer');
const TITLE = document.querySelector('h1');
const TIME = document.querySelector('#time')

// Initiates a global interval and timer, minutes and seconds are represented 
// in different indexes.
var timer = [25, 0];
var interval;

// Initiates the clock, gets current hour, minute, and seconds
function runTheClock() {
	let d = new Date();
	let hour = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
	let minute = d.getMinutes();
	let seconds = d.getSeconds();
	TIME.textContent = hour  + ":" + timeAesthetics(minute) + ":" + timeAesthetics(seconds);
}

// Runs the timer, subtracts from timer[1] every second until it gets to 0, in which case
// 1 is subtracted from timer[0] and timer[1] is set back to 59.
function runTimer() {
	if (timer[1] === 0) {
		// If both minute and seconds are 0, then call ring alarm function
		if (timer[0] === 0) {
			ringAlarm();
		} 
		else {
			timer[0]--;
			timer[1] = 59;
		} 
	}
	else {
		timer[1]--;
	}
	TIME.textContent = timer[0] + ":" + timeAesthetics(timer[1]);
}

// The timer reached zero and the alarm goes off, clearing the interval 
function ringAlarm() {
	console.log('ringa ling ling');
	clearInterval(interval);
	STARTBTN.textContent = "Start"
	STARTBTN.className = "btn btn-outline-success";
	if (TITLE.textContent == "Break Time") {
		TITLE.textContent = "Be Productive";
		timer = [25, 0];
	} else {
		TITLE.textContent = "Break Time";
		timer = [5, 0];
	}
}

// Makes sure seconds and minutes are always two digits
function timeAesthetics(time) {
	if (time < 10) {
		return "0" + time;
	}
	else {
		return time
	}
}

// creates a global resume and stop button to append and remove anytime to the HTML
var resumeBtn = document.createElement('button')
var stopBtn = document.createElement('button');
resumeBtn.textContent =  'Resume';
resumeBtn.id = 'resume';
resumeBtn.className = "btn btn-outline-success";
resumeBtn.style.marginRight = "0.75em";
stopBtn.textContent = "Stop";
stopBtn.id = 'stop';
stopBtn.className = "btn btn-outline-danger";

// Starts the Pomodoro Timer, stopping the clock and clearing the interval
BUTTONHOLDER.addEventListener('click', function(e) {
	if (e.target.tagName == "BUTTON"){
		const button = e.target;
		// Starts break timer
		if (button.textContent == "Start" && TITLE.textContent == "Break Time") {
			runTimer();
			interval = setInterval(runTimer, 1000);
			STARTBTN.textContent = 'Pause';
			STARTBTN.className = "btn btn-outline-warning";
			console.log("break");
		}
		// Run Button
		else if (button.textContent == "Run") {
			STARTBTN.textContent = 'Pause';
			STARTBTN.className = 'btn btn-outline-warning';
			TITLE.textContent = "Be Productive"
			runTimer();
			interval = setInterval(runTimer, 1000);
			console.log("run");
		}
		// Pause Button
		else if (button.textContent == "Pause") {
			clearInterval(interval);
			STARTBTN.style.display = 'none';
			BUTTONHOLDER.appendChild(resumeBtn);
			BUTTONHOLDER.appendChild(stopBtn);
			console.log("pause");
		}
		// Resume Button
		else if (button.textContent == "Resume") {
			STARTBTN.style.display = '';
			BUTTONHOLDER.removeChild(resumeBtn);
			BUTTONHOLDER.removeChild(stopBtn);
			interval = setInterval(runTimer, 1000);
			console.log("resume");	
		}
		// Stop Button
		else if (button.textContent == "Stop") {
			timer = [25, 0];
			TIME.textContent = timer[0] + ":" + timeAesthetics(timer[1]);
			STARTBTN.textContent = "Run";
			STARTBTN.className = 'btn btn-outline-success';
			STARTBTN.style.display = '';
			BUTTONHOLDER.removeChild(resumeBtn);
			BUTTONHOLDER.removeChild(stopBtn);
			TITLE.textContent = "Pomodoro";
			console.log("stop");
		}
		// Start Button,Initiate Pomodoro Timer
		else if (button.textContent == "Start") {
			clearInterval(interval);
			TITLE.textContent = 'Pomodoro';
			TIME.textContent = timer[0] + ":" + timeAesthetics(timer[1]);
			STARTBTN.textContent = "Run";
			STARTBTN.className = 'btn btn-outline-success';	
			console.log("start");
		}
	}
})


// Calls function to initiate the clock, then runs in 1 second intervals, when 
// app is launched
runTheClock();
var interval = setInterval(runTheClock, 1000);










