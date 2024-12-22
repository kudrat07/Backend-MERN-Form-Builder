const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Register
exports.register = async (req, res) => {
  // taking input from req body
  const { name, email, password} = req.body;

  try {
    const existingUser = await User.findOne({ email });

    //checking if user with email is already registered or not
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email is already registered",
      });
    }
    //hashing the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "error while hashing password",
        error: error,
      });
    }

    //creating a new user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //sending a success message
    res.status(201).json({
      success: true,
      message: "Registration successfull",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    return res.status(400).json({
      success: false,
      message:"Email and password are required"
    })
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email is not found",
      });
    }

    // If user exist then compare password
    try {
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if(!isPasswordMatched){
        return res.status(401).json({
          success: false,
          message:"Incorrect password"
        })
      }

      //If password match then create jwt token
      const token = jwt.sign({email}, process.env.JWT_SECRET);
      user.password = undefined;
      return res.status(200).json({
        success: true,
        message:"Login successful",
        token,
        user,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:"Something went wrong while comparing password"
      })
      
    }
 
  } catch (error) {
    res.status(500).json({
      success: false,
      message:"Something went wrong during login"
    })
  }
};
