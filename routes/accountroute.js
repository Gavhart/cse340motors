const express = require("express");
const utilities = require("../utilities");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');


// Deliver login and registration views
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// Process the registration and login data
router.post("/register",
  regValidate.registrationRules(), 
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);



// Example of a correct route definition for account management
router.get("/management", utilities.handleErrors(accountController.buildAcctMgmt));

module.exports = router;
