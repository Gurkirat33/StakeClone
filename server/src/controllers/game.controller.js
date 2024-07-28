import { UserStats } from "../models/userStats.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v4 as uuidv4 } from "uuid";

export const determineMineOrBomb = asyncHandler(async (req, res) => {
  const { betAmount, numberOfMines } = req.body;
  const user = req.user;
  const gameId = user.gameToken;
  let userStats = await UserStats.findOne({ user_id: user._id });
  let existingGame;
  if (!userStats) {
    userStats = await UserStats.create({
      user_id: user._id,
      games: [
        {
          gameId,
          isGameWon: true,
          tempMineSuccessCount: 0,
          tempPreviousMineSuccessProfit: 0,
        },
      ],
    });
    await userStats.save();
    existingGame = userStats.games.find((game) => game.gameId === gameId);
  } else {
    existingGame = userStats.games.find((game) => game.gameId === gameId);
    if (!existingGame) {
      userStats.games.push({
        gameId,
        isGameWon: true,
        tempMineSuccessCount: 0,
        tempPreviousMineSuccessProfit: 0,
      });
      await userStats.save();
      existingGame = userStats.games.find((game) => game.gameId === gameId);
    }
  }
  await userStats.save();
  const isMine = () => {
    console.log("existingGame", existingGame);
    const successCount = existingGame.tempMineSuccessCount; //number of gems opened
    console.log("successCount", successCount);
    const userBetAmount = parseInt(betAmount); //Money user spend on current game
    const numberOfWins = userStats.games.map((game) => {
      if (!game) return 0;
      return game.isGameWon - game.isGameLost;
    });
    const userNumberOfMines = parseInt(numberOfMines); //Number of mines in current game
    const points = user.points; //User overall balance

    const randomComparison = parseFloat(Math.random()).toFixed(2);
    if (
      successCount < 5 &&
      randomComparison < successCount / (8 - successCount)
    ) {
      return true;
    }

    if (userBetAmount) {
      // TODO
    }
    if (25 - +numberOfMines === existingGame.tempMineSuccessCount) {
      return true;
    }

    // const probability = Math.random() * 100;
    // if (probability < 60) {
    //   return true;
    // }

    return false;
  };

  const profitPerctangeCalculator = async (betAmount, numberOfMines) => {
    const numberOfSuccess = existingGame.tempMineSuccessCount || 0;

    const numberOfMinesNumber = +numberOfMines;
    const baseMultiplier = 1.1;
    let dynamicDivisor =
      10 - numberOfSuccess * numberOfMinesNumber * (0.07 * numberOfMinesNumber);

    if (dynamicDivisor < 0) {
      const previousProfit = existingGame.tempPreviousMineSuccessProfit;
      if (previousProfit > 30 && previousProfit < 50) {
        dynamicDivisor = 0.3;
      } else if (previousProfit > 50 && previousProfit < 70) {
        dynamicDivisor = 0.2;
      } else if (previousProfit > 70) {
        dynamicDivisor = 0.1;
      } else {
        dynamicDivisor = 0.5;
      }
    }
    let initialDynamicDivisor = 9;
    if (numberOfMinesNumber > 5) {
      initialDynamicDivisor = 8.6;
    } else if (numberOfMinesNumber >= 10) {
      initialDynamicDivisor = 8.2;
    } else if (numberOfMinesNumber >= 15) {
      initialDynamicDivisor = 6;
    } else if (numberOfMinesNumber >= 20) {
      initialDynamicDivisor = 0.001;
    }
    const initialMultiplier = parseFloat(
      baseMultiplier * (numberOfMinesNumber / initialDynamicDivisor)
    ).toFixed(2);

    const increaseMultiplier = parseFloat(
      (numberOfMinesNumber + numberOfSuccess) / dynamicDivisor
    ).toFixed(2);
    existingGame.tempMineSuccessCount += 1;
    await userStats.save({ validateBeforeSave: false });
    if (numberOfSuccess === 0) {
      return initialMultiplier;
    }
    const totalProfit = parseFloat(
      +initialMultiplier + +increaseMultiplier
    ).toFixed(2);
    return totalProfit;
  };

  const result = isMine();

  if (result) {
    existingGame.isGameWon = false;
    try {
      user.gameToken = null;
      await user.save({ validateBeforeSave: false });

      await userStats.save({ validateBeforeSave: false });
      // 202 because request is accepted but the response is not by the user
      return res.status(202).json(apiResponse(202, "", {}));
    } catch (error) {
      return res.status(500).json(apiResponse(500, "Error updating user", {}));
    }
  } else {
    const profitPercentage = await profitPerctangeCalculator(
      betAmount,
      numberOfMines
    );
    existingGame.tempPreviousMineSuccessProfit = profitPercentage;
    await userStats.save({ validateBeforeSave: false });
    console.log(existingGame.tempMineSuccessCount);
    console.log(+numberOfMines);
    const isGameFinished =
      existingGame.tempMineSuccessCount == 25 - +numberOfMines;
    return res
      .status(200)
      .json(apiResponse(200, "", { profitPercentage, isGameFinished }));
  }
});

export const deductPoints = asyncHandler(async (req, res) => {
  const user = req.user;
  const { betAmount } = req.body;
  if (user.points < betAmount) {
    return res.status(400).json(apiResponse(400, "Insufficient balance", {}));
  }
  user.points = user.points - betAmount;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(apiResponse(200, "Balance points", { points: user.points }));
});

export const addPoints = asyncHandler(async (req, res) => {
  const user = req.user;
  const { profit, betAmount } = req.body;
  user.points = parseFloat(+user.points + +profit + +betAmount).toFixed(2);
  user.gameToken = null;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(apiResponse(200, "Balance points", { points: user.points }));
});

export const clearGame = asyncHandler(async (req, res) => {
  const { betAmount } = req.body;
  const user = req.user;
  console.log("user", user);
  console.log("User points", user.points);
  console.log("betAmount", +betAmount);
  user.gameToken = null;
  user.points = user.points + +betAmount;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(apiResponse(200, "Balance points", { points: user.points }));
});
