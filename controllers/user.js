const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// * Register
exports.register = async (req, res) => {
  //  taking input from req body
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    //checking if user with email is already registered or not
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email is already registered",
      });
    }

    // ^ hashing the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (hashError) {
      res.status(500).json({
        success: false,
        message: "error while hashing password",
        error: hashError.message,
      });
    }

    //creating a new user in database
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    //generating jwt token and sending success message
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.status(201).json({
      success: true,
      message: "Registration successfull",
      token,
      username: user.name,
      userId:user._id
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//*Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email is not found",
      });
    }

    //! If user exist then compare password
    try {
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      }

      //If password match then create jwt token
      user.password = undefined;
      const token = jwt.sign({ email }, process.env.JWT_SECRET);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        username: user.name,
        token,
        userId:user._id
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Something went wrong while comparing password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

//*UPDATING USER DETAILS
exports.updateUser = async (req, res) => {
  const { name, email, newPassword, password } = req.body;
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    if (name && email && password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Incorrect password",
        });
      }
      (updates.email = email), (updates.name = name);
    }

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Incorrect old password",
        });
      }

      // ! Hash the new password
      updates.password = await bcrypt.hash(newPassword, 12);
    }

    Object.assign(user, updates);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfullly",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
