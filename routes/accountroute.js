// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

// Default account view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegister)
)

// Route to process registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.buildLogin)
)

module.exports = router