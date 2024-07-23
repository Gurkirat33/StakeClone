import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const verifyJwt = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(404).json(apiError(404, "Access token not found", null));
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!decodedToken) {
    return res.status(401).json(apiError(401, "Invalid access token", null));
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    return res.status(404).json(apiError(404, "User not found", null));
  }

  req.user = user;
  next();
};
