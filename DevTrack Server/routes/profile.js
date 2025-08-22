import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
  deleteProfileImage,
} from "../controllers/profileController.js";
import { authenticateToken } from "../middlewares/auth.js";
import {
  uploadProfileImage as multerUpload,
  handleMulterError,
} from "../middlewares/upload.js";

const router = express.Router();

// All profile routes require authentication
router.use(authenticateToken);

// GET /api/profile - Get user profile
router.get("/", getProfile);

// PUT /api/profile/edit - Update user profile
router.put("/edit", updateProfile);

// POST /api/profile/change-password - Change password
router.post("/change-password", changePassword);

// POST /api/profile/upload-picture - Upload profile image
router.post(
  "/upload-picture",
  multerUpload.single("avatar"),
  handleMulterError,
  uploadProfileImage
);

// DELETE /api/profile/delete-picture - Delete profile image
router.delete("/delete-picture", deleteProfileImage);

export default router;
