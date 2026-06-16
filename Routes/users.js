import express from "express";
import { users } from "../data/users.js";
import UsersController from "../controllers/user.Controller.js";
import validate from "../middlewares/validator.middleware.js"
import { createUserValidator, getUserByIdValidator, updateUserValidator } from "../validator/user.validator.js"

const router = express.Router();



// Get all user details
router.get("/", UsersController.getAllUsers);


// Get the details of a single user by id
router.get("/:id", getUserByIdValidator, validate, UsersController.getOneUserById);


// Create new user
router.post("/", createUserValidator, validate, UsersController.addUsers);


router.get("/subscription_by_user/:id", UsersController.subscriptionByUser);


// Update the user
router.put("/:id", updateUserValidator, validate, UsersController.updateUserById);


// Delete user
router.delete("/:id", UsersController.deleteUser);


export default router;
