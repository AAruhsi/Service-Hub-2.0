import { BrowserRouter, Routes, Route } from "react-router-dom";
import VisitorPage from "./pages/VisitorPage";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./pages/Profile";
import Dashboard from "./pages/admin/Dashboard";
import DashboardHomePage from "./components/dashboard components/DashboardHomePage";
import CategoryAdmin from "./components/dashboard components/CategoryAdmin";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* normal pages */}
          <Route path="/" element={<VisitorPage />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* admin pages */}
          <Route path="/admin">
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="home" element={<DashboardHomePage />} />
              <Route path="category" element={<CategoryAdmin />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
