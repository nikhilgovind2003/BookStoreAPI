import { userModel } from "../models/index.js";
import AppError from "../middlewares/AppError.js"

class UsersController {
  static getAllUsers = async (req, res) => {
    const users = await userModel.find();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Success",
      data: users,
    });
  };

  static getOneUserById = async (req, res) => {
    let { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User found",
      data: user,
    });
  };

  static addUsers = async (req, res) => {
    const data = req.body;

    if (!data.email) {
      res.status(404).json({
        success: false,
        message: "email is required",
      });
    }

    const isExistingUser = await userModel.find({ email: data?.email })

    if (isExistingUser) {
      throw new AppError('User already exists', 404);
    }

    const users = await userModel.create(data);

    return res.status(200).json({
      message: "User added succesfully",
      data: users,
    });
  };

  static deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await userModel.deleteOne({ _id: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exists!",
      });
    }

    return res.status(200).json({
      success: true,
      messages: "User deleted succesfully",
      data: user,
    });
  };

  static updateUserById = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const updatedUserData = await userModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...data,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedUserData) {
      return res.status(404).json({
        success: false,
        message: "User does not exists!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated succesfully!",
      data: updatedUserData,
    });
  };

  static subscriptionByUser = async (req, res) => {
    const { id } = req.params;

    const user = await userModel.findById(id);


    console.log("uer", user);

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User does not exists!!!",
      });

    const DateInDays = (data = "") => {
      let date;
      if (data == "") {
        date = new Date();
        console.log(date);
      } else {
        date = new Date(data);
        console.log(date);
      }
      let days = Math.floor(date / (1000 * 60 * 60 * 24));
      return days;
    };

    const subscriptionType = (date) => {
      if (user.subsrciptionType === "Basic") {
        date = date + 90;
      } else if (user.subsrciptionType === "Standard") {
        date = date + 180;
      } else if (user.subsrciptionType === "Premium") {
        date = date + 365;
      }
      return date;
    };

    let returnDate = DateInDays(user.returnDate);
    let currentDate = DateInDays();
    let subsrciptionStartDate = DateInDays(user.subsrciptionDate);
    let subscriptionExpiration = subscriptionType(subsrciptionStartDate);

    const data = {
      ...user.toObject(),
      isSubscriptionExpired: subscriptionExpiration <= currentDate,
      daysLeftForExpiration:
        subscriptionExpiration <= currentDate
          ? 0
          : subscriptionExpiration - currentDate,
      fine:
        returnDate < currentDate
          ? subscriptionExpiration <= currentDate
            ? 100
            : 50
          : 0,
    };

    return res.status(200).json({
      success: true,
      message: "User with subscription details here : ",
      data
    });
  };



  
}


export default UsersController;