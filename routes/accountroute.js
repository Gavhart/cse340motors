const express = require("express");
const utilities = require("../utilities");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');



// Deliver login and registration views
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
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

// Account Update View
router.get("/update/:account_id", utilities.handleErrors(accountController.buildAcctUpdate))

// Route to update user Account details
router.post("/update/acct",
    regValidate.acctUpdateRules(),
    regValidate.checkAcctUpdate,
    utilities.handleErrors(accountController.accountUpdate))

// Route to change a user's password
router.post("/update/pwd",
    regValidate.pwdUpdateRules(),
    regValidate.checkPwdUpdate,
    utilities.handleErrors(accountController.passwordUpdate))

// Logout
router.get("/logout", utilities.handleErrors(accountController.logout));



// Example of a correct route definition for account management
router.get("/management", utilities.handleErrors(accountController.buildAcctMgmt));

module.exports = router;
