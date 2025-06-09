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
import CategoryAdmin from "./pages/admin/CategoryAdmin";
import ProvidersAdmin from "./pages/admin/ProvidersAdmin";
import Subcategory from "./pages/Subcategory";
import DashboardProvider from "./pages/provider/DashboardProvider";
import ServiceProviding from "./pages/provider/ServiceProviding";
import Availability from "./pages/provider/Availability";

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
            <Route path="/subcategory/:id" element={<Subcategory />}></Route>
          </Route>

          {/* admin pages */}
          <Route path="/admin">
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="home" element={<DashboardHomePage />} />
              <Route path="category" element={<CategoryAdmin />} />
              <Route path="providers" element={<ProvidersAdmin />} />
            </Route>
          </Route>
          <Route path="provider">
            <Route path="dashboard" element={<DashboardProvider />}>
              <Route path="home" element={<DashboardHomePage />} />
              <Route path="services" element={<ServiceProviding />} />
              <Route path="availability" element={<Availability />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
