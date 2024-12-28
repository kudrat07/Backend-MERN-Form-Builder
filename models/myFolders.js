const mongoose = require("mongoose")

const myFolders = new mongoose.Schema({
    folderName:{
        type:String,
        trim:true,
        unique:true,
        required:[true, "Folder name is required"]
    },
    user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})
module.exports = mongoose.model("Folder", myFolders);