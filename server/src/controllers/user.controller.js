import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (username?.trim() === "" || password?.trim() === "") {
    return res
      .status(400)
      .json(apiError(400, "Username and password are required"));
  }

  if (await User.findOne({ username })) {
    return res.status(400).json(apiError(400, "Username already exists"));
  }

  const user = await User.create({ username, password });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const userWithoutPassword = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      apiResponse(201, "User created successfully", {
        user: userWithoutPassword,
      })
    );
});

export const getUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return res
    .status(200)
    .json(apiResponse(200, "User fetched successfully", { user }));
});
