import { UserModel } from "../models/UserModel.js";
import {
  createNewUser,
  loginUser,
} from "../services/authServices.js";

export const signUp = async (req, res, next) => {
  try {
    // Pass only the body data to the service
    const user = await createNewUser(req.body);

    // Handle the response HERE, not in the service
    res.status(201).json({
      message: "Sign Up Successful",
      user: { username: user.username, id: user._id },
    });
  } catch (error) {
    console.error(error.message);
    // If the service threw "User already exists", we can handle status codes here
    if (error.message === "User already exists") {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

export const logIn = async (req, res, next) => {
  try {
    // Get the tokens from the service
    const tokens = await loginUser(req.body);

    // Send response
    res.status(200).json({
      message: "Log In Successful",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.error(error.message);
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Refresh token is required" });
  }

  try {
    // 1. Verify the Refresh Token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // 2. Find the user based on the decoded payload ID
    const user = await UserModel.findById(decoded.id);

    if (!user || !user.refreshTokenHash) {
      // Token is valid but user/token not found in DB
      return res
        .status(403)
        .json({ message: "Invalid refresh token." });
    }

    // 3. Compare the sent plaintext token against the stored HASH
    const isTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash
    );

    if (!isTokenMatch) {
      return res
        .status(403)
        .json({ message: "Invalid refresh token." });
    }

    // 4. Token is valid and matches DB hash! Generate NEW tokens.
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = generateTokens(payload);

    // --- OPTIONAL SECURITY (Token Rotation) ---
    // Invalidate old token hash and save the new one (prevents token reuse)
    const hashedNewRefreshToken = await bcrypt.hash(
      newRefreshToken,
      10
    );
    user.refreshTokenHash = hashedNewRefreshToken;
    await user.save();

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    // Handle expired token or signature error
    return res
      .status(403)
      .json({ message: "Refresh token is invalid or expired." });
  }
};
