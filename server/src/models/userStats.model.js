import mongoose from "mongoose";

const gameStatsSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
      required: true,
    },
    betAmount: {
      type: Number,
      default: 0,
    },
    isGameWon: {
      type: Boolean,
      default: true,
    },
    tempMineSuccessCount: {
      type: Number,
      default: 0,
    },
    tempPreviousMineSuccessProfit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const userStatsSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    games: [gameStatsSchema],
  },
  { timestamps: true }
);

export const UserStats = mongoose.model("UserStats", userStatsSchema);
