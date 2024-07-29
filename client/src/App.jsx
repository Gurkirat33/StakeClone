import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import MineGame from "./games/MineGame";
import PublicRoutes from "./components/PublicRoutes";
import Dashboard from "./pages/Dashboard";

const AppRouting = () => {
  const location = useLocation();
  const hideHeaderPaths = ["/register", "/login"];
  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && <Navbar />}
      <Toaster />
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/mine" element={<MineGame />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppRouting />
    </Router>
  );
};
export default App;
