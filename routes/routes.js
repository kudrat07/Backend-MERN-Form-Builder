const express = require("express");
const router = express.Router();

const {register, login} = require("../controllers/user")
const {validationRules} = require("../validations/validationRules")
const {loginValidationRules} = require("../validations/loginValidationRules")
const {handleValidation} = require("../middlewares/handleValidation")

router.post("/register", validationRules, handleValidation, register);
router.post("/login", loginValidationRules, handleValidation, login)

module.exports = router;