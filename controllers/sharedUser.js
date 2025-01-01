const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Assume you have a User model
const SharedPermission = require("../models/shareUserSchema");
require("dotenv").config();

exports.sharePermission = async (req, res) => {
  try {
    
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Authorization token is required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const ownerEmail = decoded.email;

   
    const owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
      return res.status(404).json({ message: "Owner not found in the database." });
    }

    const ownerId = owner._id;

    console.log("Owner email:", ownerEmail);
    console.log("Owner ID:", ownerId);

    const { userEmail, permission } = req.body;

    
    if (!userEmail || !["edit", "view"].includes(permission)) {
      return res.status(400).json({ message: "Invalid email or permission." });
    }

    
    const sharedUser = await User.findOne({ email: userEmail });
    if (!sharedUser) {
      return res.status(404).json({ message: "Email is not registered." });
    }

    const userId = sharedUser._id;

    console.log("Shared user email:", userEmail);
    console.log("Shared user ID:", userId);

    let sharedPermission = await SharedPermission.findOne({ ownerId });

    if (!sharedPermission) {
      sharedPermission = new SharedPermission({
        ownerId,
        sharedWith: [{ userId, permission }],
      });
    } else {
      const existingIndex = sharedPermission.sharedWith.findIndex(
        (share) => share.userId.toString() === userId.toString()
      );

      if (existingIndex > -1) {
        sharedPermission.sharedWith[existingIndex].permission = permission;
      } else {

        sharedPermission.sharedWith.push({ userId, permission });
      }
    }

    await sharedPermission.save();

    return res.status(201).json({ message: "Permission shared successfully." });
  } catch (error) {
    console.error("Error in sharePermission:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//FINDING OWNER WHO IS SHARING DASHBOARD
exports.findOwner = async (req, res) => {
  try {
    const { userId } = req.params; 

    const sharedPermissions = await SharedPermission.find({
      "sharedWith.userId": userId,
    }).populate("ownerId", "name email");

    if (!sharedPermissions.length) {
      return res.status(200).json({
        owners: [],
      });
    }

    // Extract owner details and permissions for the shared user
    const ownerDetails = sharedPermissions.map((record) => {
      const sharedUser = record.sharedWith.find(
        (share) => share.userId.toString() === userId.toString()
      );

      return {
        ownerId: record.ownerId._id,
        ownerName: record.ownerId.name,
        ownerEmail: record.ownerId.email,
        permission: sharedUser?.permission || "No permission found",
      };
    });

    return res.status(200).json({
      message: "Owners and permissions found successfully.",
      owners: ownerDetails,
    });
  } catch (error) {
    console.error("Error in findAllOwnersAndPermissions:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};





