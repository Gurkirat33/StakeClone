import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const gameHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/v1/game/game-history");
        setGameHistory(res.data.data.games);
      } catch (error) {
        setGameHistory([]);
      } finally {
        setLoading(false);
      }
    };
    gameHistory();
  }, []);
  if (loading) return <p>Loading...</p>;
  return (
    <div className="bg-primary-800 pt-12 md:pt-16">
      <div className="section-container">
        <h1 className="mb-4 py-4 text-center text-3xl font-semibold text-white md:text-5xl">
          Game Dashboard
        </h1>
        {!gameHistory ||
          (gameHistory.length === 0 && (
            <p className="text-center text-white">
              No games found. Please start a new game.
            </p>
          ))}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {gameHistory.map((game, index) => (
            <div
              key={index}
              className={`flex flex-col justify-between rounded-lg bg-white p-4 shadow-md ${
                game.isGameWon ? "hover:bg-green-300" : "hover:bg-red-300"
              }`}
            >
              <div>
                <h2 className="mb-2 text-xl font-bold">Game Name : Mines</h2>
                <p className="mb-2 text-gray-600">
                  Bet Amount:{" "}
                  <span className="font-semibold">{game.betAmount}</span>
                </p>
                <p className="mb-2 text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      game.isGameWon ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {game.isGameWon ? "Won" : "Lost"}
                  </span>
                </p>
                <p className="mb-2 text-gray-600">
                  Profit:{" "}
                  <span className="font-semibold">
                    {game.isGameWon
                      ? game.tempPreviousMineSuccessProfit * game.betAmount
                      : "0"}
                  </span>
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {new Date(game.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
