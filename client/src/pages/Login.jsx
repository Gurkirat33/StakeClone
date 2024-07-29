import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/user.slice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleLogin = async (e) => {
    e.preventDefault();
    if (formData.username?.trim() === "" || formData.password?.trim() === "") {
      toast.error("All fields are required");
      return;
    }
    const regex = /^[a-zA-Z0-9]*$/;
    if (!regex.test(formData.username)) {
      toast.error("Only charters and numbers are allowed in username");
      return;
    }
    try {
      const res = await axios.post(
        "https://stakeclone-backend.onrender.com/api/v1/user/login",
        {
          username: formData.username,
          password: formData.password,
        },
      );
      dispatch(setUser(res.data.data.user));
      toast.success("User logged in successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary-800 px-4">
      <div className="w-full max-w-sm space-y-5 text-white">
        <div className="pb-8 text-center">
          <h2 className="text-4xl font-bold text-secondary-800 md:text-5xl">
            PointPlay
          </h2>
          <div className="mt-5">
            <h3 className="text-2xl font-semibold text-white md:text-3xl">
              Log in to your account
            </h3>
          </div>
        </div>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="text-lg font-medium" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 text-lite shadow-sm outline-none focus:border-secondary-600"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              value={formData.username}
            />
          </div>
          <div>
            <label className="text-lg font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                className="my-2 w-full rounded-lg border bg-transparent px-3 py-2 text-lite shadow-sm outline-none focus:border-secondary-600"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                value={formData.password}
              />
              {isPasswordVisible ? (
                <FaEyeSlash
                  className="absolute bottom-5 right-4 cursor-pointer text-xl"
                  onClick={() => setIsPasswordVisible(false)}
                />
              ) : (
                <FaEye
                  className="absolute bottom-5 right-4 cursor-pointer text-xl"
                  onClick={() => setIsPasswordVisible(true)}
                />
              )}
            </div>
          </div>
          <button className="w-full rounded-lg bg-secondary-600 px-4 py-2 font-medium text-white duration-150 hover:bg-secondary-500">
            Sign in
          </button>
        </form>
        <p className="text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-secondary-600 hover:text-secondary-500"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
