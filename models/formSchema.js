const mongoose = require("mongoose")


const formSchema = new mongoose.Schema({
    formName:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    folderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Folder",
        default:null,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
module.exports = mongoose.model("form", formSchema)