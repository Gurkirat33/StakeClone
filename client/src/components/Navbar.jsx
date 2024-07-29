import axios from "axios";
import { useState } from "react";
import { FaSearch, FaUser, FaWallet, FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/slices/user.slice";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogoutBtn = async () => {
    try {
      await axios.post(
        "https://stakeclone-backend.onrender.com/api/v1/user/logout",
      );
      dispatch(setUser(undefined));
      toast.success("User logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b-2 bg-primary-800 text-white">
      <div className="section-container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <button className="mr-4 block text-xl md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="text-2xl font-bold">
            PointPlay
          </Link>
        </div>
        <div className="hidden flex-grow items-center justify-center md:flex"></div>
        <div className="hidden items-center md:flex">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaWallet className="mr-1" />
              <span>{user ? parseInt(user.points).toFixed(2) : 0}</span>
            </div>
            <FaUser className="cursor-pointer" />
            <Link
              className="rounded-lg border border-primary-600 bg-primary-700 px-4 py-2"
              to="/dashboard"
            >
              Dashboard
            </Link>
            <button
              className="rounded-lg border border-primary-600 bg-primary-700 px-4 py-2"
              onClick={handleLogoutBtn}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex items-center space-x-4">
            (
            <div className="flex items-center">
              <FaWallet className="mr-1" />
              {<span>{user ? parseFloat(user.points).toFixed(2) : 0}</span>}
            </div>
            )
            <FaUser className="cursor-pointer" />
            <button
              className="rounded-lg border border-primary-600 bg-primary-700 px-4 py-2"
              onClick={handleLogoutBtn}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
