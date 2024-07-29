import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { setUser } from "../redux/slices/user.slice";
import axios from "axios";

const PublicRoutes = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          "https://stakeclone-backend.onrender.com/api/v1/user/get-user",
        );
        dispatch(setUser(res.data.data.user));
      } catch (error) {
        dispatch(setUser(null));
      }
    };
    getUser();
  }, [dispatch]);

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoutes;
