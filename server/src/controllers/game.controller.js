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
  const numberOfWinsAndLosses = () => {
    let wins = 0;
    let losses = 0;
    let profitTillNow = 0;
    let lossTillNow = 0;
    let averageBetAmount = 0;
    averageBetAmount /= userStats.games.length;
    userStats.games.forEach((game) => {
      if (!game) return { wins: 0, losses: 0 };
      averageBetAmount += +game.betAmount;
      if (game.isGameWon) {
        wins += 1;
        const profitPerGame =
          game.tempPreviousMineSuccessProfit * game.betAmount;
        profitTillNow += profitPerGame;
      } else {
        losses += 1;
        lossTillNow += game.betAmount;
      }
    });
    return { wins, losses, profitTillNow, lossTillNow, averageBetAmount };
  };
  if (!userStats) {
    userStats = await UserStats.create({
      user_id: user._id,
      games: [
        {
          gameId,
          betAmount: betAmount,
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
        betAmount: betAmount,
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
    const successCount = existingGame.tempMineSuccessCount; //number of gems opened
    const userBetAmount = parseInt(betAmount); //Money user spend on current game
    const { wins, losses, profitTillNow, lossTillNow, averageBetAmount } =
      numberOfWinsAndLosses();
    const profitDiffernce = profitTillNow - lossTillNow;
    const userNumberOfMines = parseInt(numberOfMines); //Number of mines in current game
    const points = user.points; //User overall balance

    // ALGO
    // if (wins - losses > 3 && userNumberOfMines > 4) {
    //   return true;
    // }
    if (
      wins - losses < -3 &&
      userNumberOfMines < 5 &&
      successCount < 4 &&
      Math.random() < 0.55
    ) {
      return false;
    }
    // ALGO
    if (profitDiffernce > 0) {
      if ((profitDiffernce > 450 && userNumberOfMines > 7) || points > 800) {
        return true;
      }
      if (Math.random() > 0.45) {
        return true;
      }
    }

    if (userBetAmount < averageBetAmount * 2.5) {
      if (
        userBetAmount < averageBetAmount * 3.5 &&
        userNumberOfMines > 4 &&
        successCount < 3
      ) {
        return true;
      }
      if (Math.random() < 0.55) {
        return true;
      }
    }
    // ALGO
    const randomComparison = parseFloat(Math.random()).toFixed(2);
    if (
      successCount < 3 &&
      randomComparison < successCount / (8 - successCount)
    ) {
      return true;
    }

    if (25 - +numberOfMines === existingGame.tempMineSuccessCount) {
      return true;
    }

    // if (numberOfMines <= 10) {
    //   const probabilty = Math.random() + numberOfMines / 30;
    //   if (probabilty < 0.4) {
    //     return false;
    //   } else {
    //     if (probabilty > 0.4 && probabilty < 0.85) {
    //       return true;
    //     }
    //   }
    // }
    if (numberOfMines > 15 || (successCount > 2 && Math.random() > 0.85)) {
      return true;
    }

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
  user.gameToken = null;
  user.points = user.points + +betAmount;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(apiResponse(200, "Balance points", { points: user.points }));
});
