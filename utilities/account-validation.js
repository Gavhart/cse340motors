const utilities = require('.');
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/* Registration Data Validation Rules */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email already exists. Please log in or use a different email.");
        }
      }),

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* Check registration data and return errors or continue */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors: errors.array(),
      title: "Registration",
      nav,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
    return;
  }
  next();
};

/* Login Data Validation Rules */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (!emailExists) {
          throw new Error("Email not associated with an account. Please register first.");
        }
      }),
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements.")
  ];
};

/* Check login data and return errors or continue */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors: errors.array(),
      title: "Login",
      nav,
      account_email: req.body.account_email,
    });
    return;
  }
  next();
};

/* Account Update Validation Rules */
validate.acctUpdateRules = () => {
  return [
    body("account_firstname")
      .optional()
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid first name."),

    body("account_lastname")
      .optional()
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid last name."),

    body("account_email")
      .optional()
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const user = await accountModel.getAccountByEmail(account_email);
        if (user && user.id !== req.user.id) {
          throw new Error("Email already in use by another account.");
        }
      }),
  ];
};

/* Check account update data and proceed or return errors */
validate.checkAcctUpdate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors: errors.array(),
      title: "Update Account",
      nav,
      user: req.body, // Pass the entire body for simplicity
    });
    return;
  }
  next();
};

/* Password Update Validation Rules */
validate.pwdUpdateRules = () => {
  return [
    body("new_password")
      .not().isEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("New password does not meet complexity requirements."),

    body("confirm_password", "Passwords must match")
      .custom((value, { req }) => value === req.body.new_password)
  ];
};

/* Check password update data and proceed or return errors */
validate.checkPwdUpdate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/change-password", {
      errors: errors.array(),
      title: "Change Password",
      nav,
    });
    return;
  }
  next();
};

module.exports = validate;
