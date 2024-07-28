import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { setUser } from "../redux/slices/user.slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleFormChange = (e, id) => {
    if (id === "username") {
      const regex = /^[a-zA-Z0-9]*$/;
      if (!regex.test(e.target.value)) {
        toast.error("Only charters and numbers are allowed");
        return;
      }
    }
    setFormData({ ...formData, [id]: e.target.value });
  };

  const handlePaste = (event) => {
    event.preventDefault();
    toast.error("Pasting is not allowed. Please enter the password manually.");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (
      formData.username.trim() === "" ||
      formData.password.trim() === "" ||
      formData.confirmPassword.trim() === ""
    ) {
      toast.error("All fields are required");
      return;
    }
    if (formData.username.length < 8 || formData.password.length < 8) {
      toast.error("Username and password must be at least 8 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("/api/v1/user/register", {
        username: formData.username,
        password: formData.password,
      });
      toast.success("User created successfully");
      dispatch(setUser(res.data.data.user));
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
              Create an account
            </h3>
          </div>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="text-lg font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 text-lite shadow-sm outline-none focus:border-secondary-600"
              onChange={(e) => handleFormChange(e, "username")}
              value={formData.username}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-lg font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="password"
              className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 text-lite shadow-sm outline-none focus:border-secondary-600"
              onChange={(e) => handleFormChange(e, "password")}
              value={formData.password}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-lg font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              className="mt-2 w-full rounded-lg border bg-transparent px-3 py-2 text-lite shadow-sm outline-none focus:border-secondary-600"
              onChange={(e) => handleFormChange(e, "confirmPassword")}
              value={formData.confirmPassword}
              onPaste={handlePaste}
            />
          </div>
          <button className="w-full rounded-lg bg-secondary-600 px-4 py-2 font-medium text-white duration-150 hover:bg-secondary-500">
            Register
          </button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-secondary-600 hover:text-secondary-500"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
