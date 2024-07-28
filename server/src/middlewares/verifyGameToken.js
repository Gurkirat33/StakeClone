import { v4 as uuidv4 } from "uuid";

export const verifyGameToken = async (req, res, next) => {
  const user = req.user;
  let gameToken = user.gameToken;

  if (!gameToken) {
    // No game token present, generate a new game ID
    const newGameId = uuidv4();
    user.gameToken = newGameId;

    try {
      await user.save(); // Save the updated user with the new game token
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating user with game token." });
    }

    gameToken = newGameId;
  }

  req.game = { gameId: gameToken };
  next();
};
