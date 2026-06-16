import express from "express";
import AuthController from "../controllers/auth.Controller.js";
import validate from "../middlewares/validator.middleware.js";
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from "../validator/auth.validator.js";

const router = express.Router();

router.post("/register", registerValidator, validate, AuthController.register);
router.post("/login", loginValidator, validate, AuthController.login);
router.post("/forgot-password", forgotPasswordValidator, validate, AuthController.forgotPassword);
router.post("/reset-password", resetPasswordValidator, validate, AuthController.resetPassword);
router.post("/logout", AuthController.logout);

export default router;
