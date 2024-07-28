import { Router } from "express";
import {
  addPoints,
  clearGame,
  deductPoints,
  determineMineOrBomb,
} from "../controllers/game.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
import { verifyGameToken } from "../middlewares/verifyGameToken.js";

const router = Router();

router.post("/mine", verifyJwt, verifyGameToken, determineMineOrBomb);
router.post("/deduct-points", verifyJwt, deductPoints);
router.post("/add-points", verifyJwt, addPoints);
router.post("/clear-game", verifyJwt, clearGame);

export default router;
