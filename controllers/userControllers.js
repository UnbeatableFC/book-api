import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




// Get all users with pagination
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalDocuments = await UserModel.countDocuments();
    const users = await UserModel.find()
      .skip(skip)
      .limit(limitNum)
      .sort({ username: 1 });

    res.status(200).json({
      success: true,
      count: users.length,
      total: totalDocuments,
      page: pageNum,
      pages: Math.ceil(totalDocuments / limitNum),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single user by ID
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      throw Object.assign(new Error("User ID is required"), {
        statusCode: 400,
      });

    const user = await UserModel.findById(id);
    if (!user)
      throw Object.assign(new Error("User not found"), {
        statusCode: 404,
      });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};


// Update user
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      throw Object.assign(new Error("User ID is required"), {
        statusCode: 400,
      });

    const updates = req.body;
    const user = await UserModel.findById(id);
    if (!user)
      throw Object.assign(new Error("User not found"), {
        statusCode: 404,
      });

    Object.assign(user, updates);
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      throw Object.assign(new Error("User ID is required"), {
        statusCode: 400,
      });

    const user = await UserModel.findByIdAndDelete(id);
    if (!user)
      throw Object.assign(new Error("User not found"), {
        statusCode: 404,
      });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
