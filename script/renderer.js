// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const path = require('path');
const electron = require('electron')
const fs = require('fs')
const BrowserWindow = electron.remote.BrowserWindow;
const shell = electron.shell;
const desktopCapturer = electron.desktopCapturer
const electronScreen = electron.screen

const pomodoroBtn = document.querySelector('#pomodoroBtn');
const fileBtn = document.querySelector('#filesBtn');
const hivedeskBtn = document.querySelector('#hivedeskBtn');
const screenshot = document.querySelector('#screenShotBtn');
const screenshotMsg = document.querySelector('.console');
const okayBtn = document.querySelector('#confirmBtn');

var pomodoroWin;

okayBtn.style.display = "none";

pomodoroBtn.addEventListener('click', function(event) {
	const modalPath = path.join('file://', __dirname, '../pomodoro.html');
	pomodoroWin = new BrowserWindow({width: 600, height: 480, frame: false});
	pomodoroWin.on('close', function() {
		pomodoroWin = null;
	})
	pomodoroWin.loadURL(modalPath);
	pomodoroWin.show();
})

screenshot.addEventListener('click', function (event) {
  screenshotMsg.textContent = 'Gathering screens...'
  const thumbSize = determineScreenShotSize()
  let options = { types: ['screen'], thumbnailSize: thumbSize }

  desktopCapturer.getSources(options, function (error, sources) {
    if (error) return console.log(error)

    sources.forEach(function (source) {
      if (source.name === 'Entire screen' || source.name === 'Screen 1') {
        const screenshotPath = path.join(__dirname, '../images/', 'screenshot.png')

        fs.writeFile(screenshotPath, source.thumbnail.toPNG(), function (error) {
          if (error) return console.log(error)
          shell.openExternal('file://' + screenshotPath)
          const message = `Saved Screenshot`;
          screenshotMsg.textContent = message
          okayBtn.style.display = "";
          okayBtn.addEventListener('click', function(event) {
            screenshotMsg.textContent = "Standby...";
            okayBtn.style.display = "none";
          })
        })
      }
    })
  })
})

function determineScreenShotSize () {
  const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
  const maxDimension = Math.max(screenSize.width, screenSize.height)
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  }
}

fileBtn.addEventListener('click', (e) => shell.showItemInFolder(__dirname));
hivedeskBtn.addEventListener('click', (e) => shell.openExternal('https://www.hivedesk.com/'));