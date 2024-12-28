const Form = require("../models/formSchema");

//CREATING A FORM
exports.createForm = async (req, res) => {
  const { formName, folderId } = req.body;
  try {
    if (!formName) {
      return res.status(400).json({
        success: false,
        message: "Form name is required",
      });
    }
    const form = await Form.create({ formName, folderId:folderId || null });
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
  const { folderId } = req.params; 
  try {
    if (!folderId) {
      return res.status(400).json({
        success: false,
        message: "Folder ID is required",
      });
    }

    const forms = await Form.find({ folderId });

    if (forms.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No forms found for the specified folder ID",
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

exports.getFormsWithNoFolderId = async(req, res) => {
    try{
         formsWithNoFolder = await Form.find({ folderId: null });
         if(!formsWithNoFolder){
           return res.status(200)
         }
         res.status(200).json(formsWithNoFolder)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({
            message:"Something went wrong while fetching forms",
            error:error.message
        })
    }
}



