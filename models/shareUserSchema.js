const mongoose = require("mongoose");

const SharedPermissionSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, 
  },
  sharedWith: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
      },
      permission: {
        type: String,
        enum: ["edit", "view"],
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const SharedPermission = mongoose.model("SharedPermission", SharedPermissionSchema);
module.exports = SharedPermission;
