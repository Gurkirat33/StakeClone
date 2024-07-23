import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

const AppRouting = () => {
  const location = useLocation();
  const hideFooterPaths = ["/register", "/login"];
  return (
    <>
      {/* <Navbar /> */}
      <Toaster />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
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
