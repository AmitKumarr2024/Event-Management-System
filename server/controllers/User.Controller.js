import UserModel from "../models/User.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../config/env.js";
import logger from "../utils/logger.js";

export const userRegister = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, gender, role } =
      req.body;

    if (password !== confirmPassword) {
      logger.error("Passwords do not match");
      return res.status(400).json({
        message: "Passwords do not match",
        error: true,
      });
    }

    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      logger.error("User already exists");
      return res.status(400).json({
        message: "User already exists",
        error: true,
      });
    }

    // Ensure role is valid
    const validRoles = ["admin", "organizer", "user"];
    if (role && !validRoles.includes(role)) {
      logger.error("Invalid role provided");
      return res.status(400).json({
        message: "Invalid role provided",
        error: true,
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Profile Pic API
    const profilePicUrl = `https://avatar.iran.liara.run/public/${
      gender === "male" ? "boy" : "girl"
    }?username=${fullName}`;

    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
      gender,
      profilePic: profilePicUrl,
      role: role || "user", // Default role is "user"
    });

    await newUser.save();

    logger.info("User registered successfully", { userId: newUser._id });

    return res.status(201).json({
      message: "Signup request created successfully",
      data: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        gender: newUser.gender,
        profilePic: newUser.profilePic,
        role: newUser.role,
      },
      success: true,
    });
  } catch (error) {
    logger.error("Error in userRegister controller", { error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      logger.error("User Not Found");
      return res.status(400).json({
        message: "User Not Found!!",
        error: true,
      });
    }

    // check password validity
    const isValidPassword = await bcrypt.compare(password, userExist.password);
    if (!isValidPassword) {
      logger.error("Invalid Credentials");
      return res.status(400).json({ message: "Invalid Credentials " });
    }

    // check if user is already logged in
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded._id === userExist._id.toString()) {
          logger.info("User is already logged in", { userId: userExist._id });
          return res.status(400).json({ message: "You are already Logged in" });
        }
      } catch (err) {
        // Token is invalid or expired
        logger.error("Invalid or expired token", { error: err.message });
        return res.status(400).json({
          message: "Invalid or expired token",
          error: err.message,
        });
      }
    }

    // Prepare token data
    const tokenData = {
      _id: userExist._id,
      email: userExist.email,
      gender: userExist.gender,
      profilePic: userExist.profilePic,
    };

    // Generate token
    const newToken = jwt.sign(tokenData, JWT_SECRET, {
      expiresIn: "10d", // Token expiry set to 10 days
    });

    // Determine if the environment is production
    const isProduction = NODE_ENV !== "production";

    const tokenOptions = {
      httpOnly: true,
      secure: isProduction, // Secure cookies only in production
      sameSite: "strict",
    };

    // Set cookie and respond
    res.cookie("token", newToken, tokenOptions).status(200).json({
      message: "Login successful",
      data: newToken,
      success: true,
      error: false,
    });

    logger.info("User logged in successfully", { userId: userExist._id });
  } catch (error) {
    logger.error("Error in Login controller", { error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const singleUser = async (req, res) => {
  try {
    logger.info("Request received for user ID:", { userId: req.params.id });

    if (!req.params.id) {
      logger.error("User ID is missing in the request");
      return res.status(400).json({
        message: "User ID is missing",
        error: true,
      });
    }

    const user = await UserModel.findById(req.params.id).select("-password");

    if (!user) {
      logger.error("User not found for ID:", { userId: req.params.id });
      return res.status(404).json({
        message: "User not found",
        error: true,
      });
    }

    logger.info("User fetched from DB:", { userId: user._id });

    res.status(200).json({
      data: user,
      message: "User details retrieved successfully",
      success: true,
    });
  } catch (error) {
    logger.error("Error in singleUser controller:", { error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, gender, role, password } = req.body;

    if (!id) {
      logger.error("User ID is required");
      return res.status(400).json({
        message: "User ID is required",
        error: true,
      });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      logger.error("User not found", { userId: id });
      return res.status(404).json({
        message: "User not found",
        error: true,
      });
    }

    const validRoles = ["admin", "organizer", "user"];
    if (role && !validRoles.includes(role)) {
      logger.error("Invalid role provided");
      return res.status(400).json({
        message: "Invalid role provided",
        error: true,
      });
    }

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email;
    if (gender) updateFields.gender = gender;
    if (role) updateFields.role = role;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    logger.info("User details updated successfully", { userId: updatedUser._id });

    res.status(200).json({
      message: "User details updated successfully",
      data: updatedUser,
      success: true,
    });
  } catch (error) {
    logger.error("Error in updateUserDetails controller:", { error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const allUser = async (req, res) => {
  try {
    const user = await UserModel.find();

    if (!user) {
      logger.error("No User available");
      return res.status(400).json({
        message: "No User available",
        data: [],
        error: true,
      });
    }

    logger.info("All users fetched successfully");

    res.status(200).json({
      message: "Request complete Successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    logger.error("Error in allUser controller", { error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: NODE_ENV === "production", // Ensures cookie is sent only over HTTPS in production
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: 0, // Set the cookie's maxAge to 0 to expire it
    });

    logger.info("User logged out successfully");

    res.status(200).json({ message: "Logout successfully", success: true });
  } catch (error) {
    logger.error("Error in logout controller:", { error: error.message });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
