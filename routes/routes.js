const express = require("express");
const router = express.Router();

const {register, login, updateUser} = require("../controllers/user");

const {validationRules} = require("../validations/validationRules");

const {loginValidationRules} = require("../validations/loginValidationRules");

const {handleValidation} = require("../middlewares/handleValidation");

const {createFolder, deleteFolder, getAllFolders} = require("../controllers/folder");

const {createForm, getFormsByFolderId, getFormsWithNoFolderId, deleteForm} = require("../controllers/form");

const {createBubble, getBubble} = require("../controllers/bubble")

const {sharePermission, findOwner} = require("../controllers/sharedUser")

router.post("/register", validationRules, handleValidation, register);
router.post("/login", loginValidationRules, handleValidation, login)
router.patch("/setting/:id", updateUser)

// ROUTES FOR CREATING FOLDER
router.post("/folder/:userId", createFolder);

//ROUTES FOR DELETETING FOLDER
router.delete("/folder/:id", deleteFolder);

//ROUTES FOR GETTING ALL FOLDERS
router.get("/folder/:userId", getAllFolders);

//ROUTES FOR CREATING FORM
router.post("/form/:userId/:folderId", createForm);


//ROUTES FOR GETTING FORM OF A PARTICULAR FOLDER ID AND USER ID
router.get("/form/:userId/:folderId", getFormsByFolderId);

//ROUTES FOR GETTING FORM WITH NO FOLDER ID
router.get("/form/:userId", getFormsWithNoFolderId)


router.delete("/form/:id", deleteForm)

//ROUTES FOR CREATING BUBBLE
router.post("/bubble/:formId", createBubble)

//ROUTES FOR GETTING BUBBLE
router.get("/bubble/:formId", getBubble)

router.post("/shared/user", sharePermission)

router.get("/findOwner/:userId", findOwner)


module.exports = router;