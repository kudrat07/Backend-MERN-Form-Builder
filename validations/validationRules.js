const { body } = require("express-validator");

const validationRules = [
  body("name")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Name must be atleast 3 characters long"),

  body("email").isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain atleast one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
];

module.exports = { validationRules };
