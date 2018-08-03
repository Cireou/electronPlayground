const path = require('path');
const electron = require('electron')
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

const loginForm = document.querySelector('.formDiv');
const loginBtn = document.querySelector('#loginBtn');
const signUpBtn = document.querySelector('#signUpBtn');
const errorMsg = document.querySelector('.errorMsg');
const header = document.querySelector('.header h1');
const form = document.querySelector('form');

var database = {
	'Admin' : 'admin'
}

loginForm.addEventListener('click', function(e) {	
	e.preventDefault();
	if(e.target.tagName === "BUTTON") {
		errorMsg.textContent = '';
		errorMsg.style.color = 'red';
		const button = e.target;
		let username = document.querySelector('#username')
		let password = document.querySelector('#password')
		if (button.textContent === 'Login'){ 
			console.log(database);
			if(!username.value || !password.value) {	
				errorMsg.textContent = 'All fields need to be filled.';
			} else if (database[username.value] && database[username.value] === password.value) {
				const modalPath = path.join('file://', __dirname, '../index.html');
				indexWin = new BrowserWindow({width: 1200, height: 900, frame: false});
				indexWin.on('close', function() {
					indexWin = null;
				})
				indexWin.loadURL(modalPath);
				indexWin.show();
				let currentWindow = remote.getCurrentWindow();
				currentWindow.close();
			} else {
				errorMsg.textContent = 'Username/password is incorrect.';
			}
		} else if (button.textContent === "Sign Up") {
			console.log(database);
			signUpBtn.style.display = 'none';
			loginBtn.textContent = 'Create Account';
			username.value = '';
			password.value = '';
			header.textContent = 'Welcome!'
			// var passConfirm = document.createElement('input');
			// passConfirm.type = "password"; 
			// passConfirm.placeholder = "Confirm Password";
			// passConfirm.id = 'confirm';
			// form.insertBefore(passConfirm, errorMsg);
			document.querySelector("#confirm").style.display = '';
			username.placeholder = 'New Username';
			password.placeholder = 'New Password';
		} else if (button.textContent === 'Create Account') {
			passConfirm = document.querySelector('#confirm');
			if (username.value === '' || password.value === '' || passConfirm.value === '') {
				errorMsg.textContent = 'All fields must be filled.'
			} else if (database[username.value]) {
				errorMsg.textContent = 'Username unavailable.'
			} else if (password.value !== passConfirm.value){
				errorMsg.textContent = 'Passwords do not match.	'
			} else {
				errorMsg.textContent = '';
				database[username.value] = password.value;
				header.textContent = 'Playground Login'
				loginBtn.textContent = 'Login';
				signUpBtn.style.display = '';
				signUpBtn.textContent = 'Sign Up';
				form.removeChild(passConfirm);
				username.value = '';
				username.placeholder = 'Username';
				password.value = '';
				password.placeholder = 'Password';
				console.log(database);
			}
		}
	}
})

