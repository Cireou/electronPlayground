const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron')
const path = require('path')

describe('Application launch:', function () {
  this.timeout(10000)

  beforeEach(function () {
    this.app = new Application({
      // Your electron path can be any binary
      // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
      // But for the sake of the example we fetch it from our node_modules.
      path: electronPath,

      // Assuming you have the following directory structure

      //  |__ my project
      //     |__ ...
      //     |__ main.js
      //     |__ package.json
      //     |__ index.html
      //     |__ ...
      //     |__ test
      //        |__ spec.js  <- You are here! ~ Well you should be.

      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [path.join(__dirname, '..')]
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  // Spectron is built ontop of Mocha and Webdriver.io.
  // Mocha is what structures the test cases, while webdriver allows for 
  // the simulation of user's actions such as click, addValue, setValue, etc...
  // Electron already has assert from node.js, however, if needed, Chai offers
  // more functionality to assert.

  it('Opens initial window..', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
      // getWindowCount() will return 2 if `dev tools` are opened.
    })
  })

  describe('Login Screen Tests:', function () {
    it('Form loads..', function() {
      return this.app.client.getHTML('#loginForm').then(function (formHTML) {
        assert(formHTML !== null);
      })
    })

    it('Returns error for empty fields..', function() {
      this.app.client.click('#loginBtn');
      return this.app.client.getText('.errorMsg').then(function(errorMsg) {
        assert.equal('All fields need to be filled.', errorMsg);
      })
    })

    it('Returns error for incorrect credentials..', function () {
      this.app.client.addValue('#username', 'YqK0XUbzzlQPYEA');
      this.app.client.addValue('#password', 'JGSyvhTNu7WPrKp');
      this.app.client.click('#loginBtn');
      return this.app.client.getText('.errorMsg').then(function (errorText) {
        assert.equal(errorText, "Username/password is incorrect.");
      })
    })
  })

  describe('Sign Up Tests:', function() {
    it('Heading Update..', function() {
      this.app.client.click('#signUpBtn');
      return this.app.client.getText('h1').then(function(heading){
        assert.equal(heading, 'Welcome!');
      })
    })

    it('Clears username field..', function() {
      this.app.client.click('#signUpBtn');
      return this.app.client.getValue('#username').then(function(username){
        assert.equal(username, '');
      })
    })

    it('Clears password field..', function() {
      this.app.client.click('#signUpBtn');
      return this.app.client.getValue('#password').then(function(password){
        assert.equal(password, '');
      })
    })

    it('Username placeholder updated..', function () {
      this.app.client.click('#signUpBtn');
      return this.app.client.getAttribute('#username','placeholder').then(function(placeholder) {
        assert.equal(placeholder,'New Username');
      })
    })

    it('Password placeholder updated..', function () {
      this.app.client.click('#signUpBtn');
      return this.app.client.getAttribute('#username','placeholder').then(function(placeholder) {
        assert.equal(placeholder,'New Username');
      })
    })

    it('Confirm password field created..', function() {
      this.app.client.click('#signUpBtn');
      return this.app.client.getHTML('#confirm').then(function(confirm){
        assert(confirm !== null);
      })
    })

    it('Create Account Button added..', function() {
      this.app.client.click('#signUpBtn');
      return this.app.client.getText('#loginBtn').then(function(btnText) {
        assert.equal(btnText, 'Create Account');
      })
    })

    it('Returns error if username already exists..', function() {
      this.app.client.click('#signUpBtn')
      this.app.client.addValue('#username', 'Admin');
      this.app.client.addValue('#password', '5');
      this.app.client.addValue('#confirm', '5');
      this.app.client.click('#loginBtn');
      return this.app.client.getText('.errorMsg').then(function(errorMsg){
        assert.equal(errorMsg, 'Username unavailable.');
      })
    })

    it('Returns error for empty fields..', function() {
      this.app.client.click('#signUpBtn')
      this.app.client.click('#loginBtn');
      return this.app.client.getText('.errorMsg').then(function(errorMsg) {
        assert.equal('All fields must be filled.', errorMsg);
      })
    })

    it('Returns error if passwords don\'t match..', function() {
      this.app.client.click('#signUpBtn')
      this.app.client.addValue('#username', '$%!^&*@(#');
      this.app.client.addValue('#password', 'x');
      this.app.client.addValue('#confirm', 'd');
      this.app.client.click('#loginBtn');
      return this.app.client.getText('.errorMsg').then(function(errorMsg){
        assert.equal(errorMsg, 'Passwords do not match.');
      })
    })

    // The next test case is not completely finished.
    // Simulates the entire sign up process and successfully executes it, however it 
    // will fail the afterEach case since a new window is created. 

    // it('Sign up functional, successfully logins in after signing up..', function() {
    //   this.app.client.click('#signUpBtn')
    //   this.app.client.addValue('#username', 'xx798O(8798&#(*@Xnaiwu');
    //   this.app.client.addValue('#password', 'x');
    //   this.app.client.addValue('#confirm', 'x');
    //   this.app.client.click('#loginBtn');
    //   this.app.client.addValue('#username', 'xx798O(8798&#(*@Xnaiwu');
    //   this.app.client.addValue('#password', 'x');
    //   this.app.client.click('#loginBtn');
    // })

  })
})