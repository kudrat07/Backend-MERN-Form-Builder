const mongoose = require("mongoose");

const bubbleSchema = new mongoose.Schema(
  {
   
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "form",
      required: true,
    },
    bubbles: [
      {
        type: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          default: "",
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Bubble", bubbleSchema);
