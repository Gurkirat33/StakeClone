import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { setUser } from "../redux/slices/user.slice";

const ProtectedRoutes = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const location = useLocation();

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
  }, [dispatch, location.pathname]);

  if (user === undefined) {
    return <div>Loading</div>;
  }
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
