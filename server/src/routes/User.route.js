import { Router } from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = Router();

router.post("/register", registerUser);
router.get("/get-user", verifyJwt, getUser);
router.post("/login", loginUser);
router.post("/logout", verifyJwt, logoutUser);

export default router;
