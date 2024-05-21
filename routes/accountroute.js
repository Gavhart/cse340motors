const express = require("express");
const utilities = require("../utilities");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

// Deliver login and registration views
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// Process the registration and login data
router.post("/register",
  regValidate.registrationRules(), // Assuming the typo is corrected
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;
