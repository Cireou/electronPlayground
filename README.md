This is an application I built thats meant to get comfortable with Electron and set up automated testing with Spectron/Mocha. The first interface will be the login screen with an object that simulates a database. It will default with the account "Username: Admin, Password: admin". Signing up and account will simply add to this object. There are two main commands that are used to run this application:

npm start: Initiate the application. 
npm test: Will run the Mocha library and execute the test cases under test/spec.js

Note: There are a few errors and inconsistencies with Webdriver.io. It seems that there is currently a bug where putting consecutive lines of addValue/setValue will sometimes cause the values to either be inputted incorrectly or not inputted at all, causing inconsistencies in the test result. This is a known bug and at the time of making this application I was unable to find a fix.