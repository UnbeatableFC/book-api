import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";

// Helper to generate tokens
const generateTokens = (user) => {
  const payload = { id: user._id, username: user.username, email: user.email };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

export const createNewUser = async (userData) => {
  const { username, email, password } = userData;

  // 1. Check duplicates
  const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error("User already exists"); // Throw error, don't send res
  }

  // 2. Hash and Create
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    username,
    email,
    password: hashedPassword,
  });

  return user; // Return the data
};

export const loginUser = async (loginData) => {
  const { email, password } = loginData;

  // 1. Find User
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // 2. Check Password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // 3. Return Tokens
  const { accessToken, refreshToken } = generateTokens(user);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    
    // Assuming you added 'refreshTokenHash: String' to your UserModel schema
    user.refreshTokenHash = hashedRefreshToken;
    await user.save(); 
    
    return { accessToken, refreshToken };
};