import User from "../models/User.js";
import bcrypt from "bcryptjs";
import path from "path";
import { deleteOldProfileImage } from "../middlewares/upload.js";

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Format user response
    const formattedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      bio: user.bio || "",
      avatar: user.avatar
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/profiles/${path.basename(user.avatar)}`
        : null,
      status: user.status,
      joinDate: user.createdAt.toISOString().split("T")[0],
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      success: true,
      user: formattedUser,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio } = req.body;
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // Update user fields
    user.name = name.trim();
    user.phone = phone ? phone.trim() : user.phone;
    user.bio = bio ? bio.trim() : user.bio;

    await user.save();

    // Format response (exclude password)
    const formattedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      bio: user.bio || "",
      avatar: user.avatar
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/profiles/${path.basename(user.avatar)}`
        : null,
      status: user.status,
      joinDate: user.createdAt.toISOString().split("T")[0],
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: formattedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old profile image if exists
    if (user.avatar) {
      deleteOldProfileImage(user.avatar);
    }

    // Update user avatar path
    user.avatar = req.file.path;
    await user.save();

    // Generate image URL
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/profiles/${
      req.file.filename
    }`;

    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl,
      avatar: imageUrl,
    });
  } catch (error) {
    console.error("Upload profile image error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete profile image
export const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete profile image if exists
    if (user.avatar) {
      deleteOldProfileImage(user.avatar);
      user.avatar = null;
      await user.save();
    }

    res.json({
      success: true,
      message: "Profile image deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile image error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
