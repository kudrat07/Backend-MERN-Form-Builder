const Folder = require("../models/myFolders");
const Form = require("../models/formSchema")

// controller for creating a folder
exports.createFolder = async (req, res) => {
    const { folderName } = req.body;
    const {userId} = req.params;
    try {
      if (!folderName) {
        return res.status(400).json({
          success: false,
          message: "Folder name is required",
        });
      }

      const normalizedFolderName = folderName.trim().toLowerCase();
  
      const folder = await Folder.create({ folderName:normalizedFolderName, userId});
      res.status(201).json({
        success: true,
        message: "New folder created",
        folder,
      });
    } catch (error) {
      console.error(error);
  
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Folder name already exists",
        });
      }
  
      res.status(500).json({
        success: false,
        message: "Something went wrong while creating folder",
        error: error.message,
      });
    }
  };

  // controller for deleting a folder along with form associated with it
  exports.deleteFolder = async(req, res) => {
    const {id} = req.params;
    try{

        const folder = await Folder.findById(id);
        if(!folder) {
          return res.status(400).json({
            message:"Folder not found"
          })
        }
        const deleteForms = await Form.deleteMany({folderId: id})
        const deletedFolder = await Folder.findByIdAndDelete(id)
        if(!deletedFolder) {
            return res.status(404).json({
                success: false,
                message:"Folder not found",
            });
        }
        res.status(200).json({
            success: true,
            message:"Folder deleted successfullly",
            deletedFolder,
            deleteForms: deleteForms.deletedCount,
        })
    }
    catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        })

    }
  }

  exports.getAllFolders =  async(req, res) => {
    try {
      const {userId} = req.params;
      const folders = await Folder.find({userId});
      if(!folders) {
       return res.status(200)
      }

      res.status(200).json(folders)

    } catch (error) {
      console.error(error) 
      res.status(500).json({
        message:"Server error",
        error: error.message
      })
    }
  }
  