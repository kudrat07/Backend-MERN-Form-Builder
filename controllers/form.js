const Form = require("../models/formSchema");
const User = require("../models/userModel.js");

//CREATING A FORM
exports.createForm = async (req, res) => {
  const { userId, folderId } = req.params;
  const { formName } = req.body;
  try {
    if (!formName) {
      return res.status(400).json({
        success: false,
        message: "Form name is required",
      });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    const finalFolderId = folderId === "null" ? null : folderId;
    const form = await Form.create({
      formName,
      folderId: finalFolderId,
      userId,
    });
    res.status(201).json({
      success: true,
      message: "New Form created",
      form,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Form name already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//GETTING ALL FORMS WITH A PARTICULAR FOLDER ID
exports.getFormsByFolderId = async (req, res) => {
  const { folderId, userId } = req.params;

  try {
    if (!folderId) {
      return res.status(400).json({
        success: false,
        message: "Folder ID is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Check if the user exists
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const forms = await Form.find({ userId, folderId });

    if (forms.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No forms found for the specified user and folder ID",
        data: [],
      });
    }

    res.status(200).json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//GETTING ALL FORMS WITH folderId = null value
exports.getFormsWithNoFolderId = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user does not exist",
      });
    }
    formsWithNoFolder = await Form.find({ userId, folderId: null });
    if (formsWithNoFolder.length === 0) {
      return res.status(200);
    }
    res.status(200).json(formsWithNoFolder);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong while fetching forms",
      error: error.message,
    });
  }
};

//DELETING A FORM
exports.deleteForm = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedForm = await Form.findByIdAndDelete(id);
    if (!deletedForm) {
      return res.status(400).json({
        success: false,
        message: "Form not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Form deleted",
      deletedForm,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
