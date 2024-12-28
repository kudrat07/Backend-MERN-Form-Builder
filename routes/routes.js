const express = require("express");
const router = express.Router();

const {register, login, updateUser} = require("../controllers/user")
const {validationRules} = require("../validations/validationRules")
const {loginValidationRules} = require("../validations/loginValidationRules")
const {handleValidation} = require("../middlewares/handleValidation")
const {createFolder, deleteFolder, getAllFolders} = require("../controllers/folder")
const {createForm, getFormsByFolderId, getFormsWithNoFolderId} = require("../controllers/form")

router.post("/register", validationRules, handleValidation, register);
router.post("/login", loginValidationRules, handleValidation, login)
router.patch("/setting/:id", updateUser)

// ROUTES FOR CREATING FOLDER
router.post("/folder", createFolder)

//ROUTES FOR DELETETING FOLDER
router.delete("/folder/:id", deleteFolder)

//ROUTES FOR GETTING ALL FOLDERS
router.get("/folder", getAllFolders)

//ROUTES FOR CREATING FORM
router.post("/form", createForm)

//ROUTES FOR GETTING FORM OF A PARTICULAR FOLDER ID
router.get("/form/:folderId", getFormsByFolderId)

//ROUTES FOR GETTING FORM WITH NO FOLDER ID
router.get("/form", getFormsWithNoFolderId)


module.exports = router;