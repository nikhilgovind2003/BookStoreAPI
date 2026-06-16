import { userModel } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

class AuthController {
  static register = async (req, res) => {
    try {
      const { name, surName, email, password, issuedBook, issuedDate, returnDate, subsrciptionType, subsrciptionDate } = req.body;

      const existing = await userModel.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }

      const hashed = password ? await bcrypt.hash(password, 10) : undefined;

      const userPayload = {
        name,
        surName,
        email,
        issuedBook,
        issuedDate,
        returnDate,
        subsrciptionType,
        subsrciptionDate,
      };

      console.log("subsrciptionType", subsrciptionType);

      if (hashed) userPayload.password = hashed;

      const user = await userModel.create(userPayload);

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "changeme", { expiresIn: "1d" });

      // set auth cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      const userObj = user.toObject();
      delete userObj.password;

      return res.status(201).json({ success: true, message: "User registered", data: { user: userObj } });
    } catch (error) {
      console.error("AuthController.register error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  static login = async (req, res) => {
    try {


      const { email, password } = req.body;

      const user = await userModel.findOne({ email });
      if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

      if (!user.password) return res.status(401).json({ success: false, message: "No local password set for this user" });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "changeme", { expiresIn: "1d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      const userObj = user.toObject();
      delete userObj.password;

      return res.status(200).json({ success: true, message: "Login successful", data: { user: userObj } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return res.status(200).json({ success: true, message: "Logged out" });
    } catch (error) {
      console.error("AuthController.logout error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  static forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

      user.passwordResetToken = hashed;
      user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
      await user.save();

      return res.status(200).json({ success: true, message: "Password reset token generated", data: { resetToken } });
    } catch (error) {
      console.error("AuthController.forgotPassword error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  static resetPassword = async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) return res.status(400).json({ success: false, message: "Token and new password required" });

      const hashed = crypto.createHash("sha256").update(token).digest("hex");

      const user = await userModel.findOne({ passwordResetToken: hashed, passwordResetExpires: { $gt: Date.now() } });
      if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });

      user.password = await bcrypt.hash(password, 10);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
      console.error("AuthController.resetPassword error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default AuthController;
