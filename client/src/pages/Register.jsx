import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { setUser } from "../redux/slices/user.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  console.log(formData);

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
    <div className="bg-primary-600 section-container min-h-screen text-white">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="rounded-lg border-2 border-white p-2 text-black focus:outline-none"
          onChange={(e) => handleFormChange(e, "username")}
          value={formData.username}
        />
        <input
          type="text"
          placeholder="password"
          className="rounded-lg border-2 border-white p-2 text-black focus:outline-none"
          onChange={(e) => handleFormChange(e, "password")}
          value={formData.password}
        />
        <input
          type="text"
          placeholder="Confirm password"
          className="rounded-lg border-2 border-white p-2 text-black focus:outline-none"
          onChange={(e) => handleFormChange(e, "confirmPassword")}
          value={formData.confirmPassword}
        />
        <button className="bg-primary-400 mt-2 rounded-lg px-4 py-2 text-white">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
