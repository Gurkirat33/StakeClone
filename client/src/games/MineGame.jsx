import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { changePoints } from "../redux/slices/user.slice";
import GemImg from "../assets/gem.svg";
import MineImg from "../assets/mine.svg";

const numberOfMinesArray = Array.from({ length: 22 }, (_, i) => i + 3);

const MineGame = () => {
  const dispatch = useDispatch();
  const [mineArray, setMineArray] = useState(Array(25).fill(""));
  const [mineData, setMineData] = useState({
    numberOfMines: "3",
    betAmount: "",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [profitPercentage, setProfitPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  let profit = parseFloat(profitPercentage * mineData.betAmount).toFixed(2);
  if (profit === "NaN") profit = 0;
  const revealUnknownMine = (array, mines) => {
    const dynamicComparisonValues = Array.from({ length: 8 }, () =>
      parseFloat(Math.random().toFixed(2)),
    );
    array.forEach((item, index) => {
      let emptyItems = array.filter((item) => item === "");
      if (item === "") {
        if (emptyItems.length <= parseInt(mineData.numberOfMines) - mines) {
          array[index] = "Y";
          mines += 1;
          return;
        }
        if (mines === parseInt(mineData.numberOfMines)) {
          array[index] = "X";
          return;
        }
        if (
          Math.random() > dynamicComparisonValues[Math.floor(Math.random() * 8)]
        ) {
          array[index] = "X";
        } else {
          array[index] = "Y";
          mines += 1;
        }
      }
    });
  };

  const setPoints = (amount) => {
    dispatch(changePoints(amount));
  };
  const handleBoxClick = async (index) => {
    if (!isPlaying) {
      toast.error("Click on Play Button to get started");
      return;
    }
    if (loading) return;
    if (mineArray[index] === "X") {
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/v1/game/mine", {
        betAmount: mineData.betAmount,
        numberOfMines: mineData.numberOfMines,
      });

      setMineArray((prev) => {
        const newMineArray = [...prev];
        if (res.data.statusCode === 202) {
          newMineArray[index] = "Y";
          setIsPlaying(false);
          revealUnknownMine(newMineArray, 1);
          // handleResetBtn();
          return newMineArray;
        }
        newMineArray[index] = "X";
        return newMineArray;
      });
      setProfitPercentage(res.data.data?.profitPercentage);
      if (res.data.data.isGameFinished) {
        toast.success("Max Win achived for this bet.");
        revealUnknownMine(mineArray, -1);
      }
      // addPoints(+res.data.data?.profit);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const handlePlayBtn = async () => {
    if (!mineData.betAmount) {
      toast.error("Please enter bet amount");
      return;
    }
    try {
      const res = await axios.post("/api/v1/game/deduct-points", {
        betAmount: mineData.betAmount,
      });
      setPoints(res.data.data?.points);
      handleResetBtn();
      setIsPlaying(true);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  const handleResetBtn = () => {
    setMineArray(Array(25).fill(""));
    setIsPlaying(false);
    setProfitPercentage(0);
  };
  const handleCashoutBtn = async () => {
    try {
      const res = await axios.post("/api/v1/game/add-points", {
        profit,
        betAmount: mineData.betAmount,
      });
      setPoints(+res.data.data?.points);
      revealUnknownMine(mineArray, 0);
      // handleResetBtn();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
    setIsPlaying(false);
  };
  useEffect(() => {
    const handleBeforeUnload = async () => {
      console.log("before unload");
      try {
        const res = await axios.post("/api/v1/game/clear-game", {
          betAmount: mineData.betAmount,
        });
        dispatch(changePoints(res.data.data.points));
      } catch (error) {
        console.log(error);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch, mineData.betAmount]);

  return (
    <div className="bg-primary-800 pt-12 md:pt-16">
      <div className="section-container flex flex-col gap-8 sm:flex-row">
        <div className="rounded-lg bg-primary-400 p-4 sm:w-1/4">
          <h1 className="mb-4 text-3xl font-semibold">Mine Game</h1>
          <label htmlFor="amount" className="text-lg font-medium">
            Bet Amount
          </label>
          <input
            type="number"
            id="amount"
            className="mb-4 w-full rounded-md p-1 focus:outline-none"
            placeholder="100"
            disabled={isPlaying}
            onChange={(e) =>
              setMineData({ ...mineData, betAmount: e.target.value })
            }
            value={mineData.betAmount}
          />
          <label htmlFor="mines" className="text-lg font-medium">
            Number of Mines
          </label>
          <select
            id="mines"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2.5 shadow-sm focus:outline-none sm:text-sm"
            onChange={(e) =>
              setMineData({ ...mineData, numberOfMines: e.target.value })
            }
            disabled={isPlaying}
            value={mineData.numberOfMines}
          >
            {numberOfMinesArray.map((option, index) => (
              <option key={index} className="py-1 text-gray-700">
                {option}
              </option>
            ))}
          </select>
          {!isPlaying && (
            <button
              className="mt-2 w-full rounded-lg bg-secondary-600 px-4 py-2 text-white"
              onClick={handlePlayBtn}
            >
              Play
            </button>
          )}
          {isPlaying && (
            <>
              <p className="mt-2 border-2 border-black p-1 text-lg">
                Your total profit is {profit}
              </p>
            </>
          )}
          {isPlaying && (
            <button
              className="mt-2 w-full rounded-lg bg-primary-500 px-4 py-2 text-white"
              onClick={handleCashoutBtn}
            >
              Cashout
            </button>
          )}
        </div>
        <div className="grid max-w-3xl grid-cols-5 gap-4 sm:w-3/4">
          {mineArray.map((item, index) => (
            <div
              key={index}
              className={`${mineArray.filter((item) => item === "").length === 0 ? "brightness-[0.7]" : ""} flex h-16 w-full ${mineArray[index] === "X" || mineArray[index] === "Y" ? "" : "cursor-pointer hover:-translate-y-1 hover:bg-primary-200"} items-center justify-center rounded-lg bg-primary-400 duration-300 sm:h-24`}
              onClick={() => handleBoxClick(index)}
            >
              {item ? (
                <div>
                  {item === "X" ? (
                    <img
                      src={GemImg}
                      alt="gem"
                      className="h-10 w-10 sm:h-16 sm:w-16"
                    />
                  ) : (
                    <img
                      src={MineImg}
                      alt="mine"
                      className="h-10 w-10 sm:h-16 sm:w-16"
                    />
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MineGame;
