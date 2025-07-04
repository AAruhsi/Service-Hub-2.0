import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../utils/constants";
import Footer from "../components/Footer";
const VisitorPage = () => {
  const { setUser, setLoggedIn, user } = useAuth();
  const fetchData = async () => {
    if (user != null) return;
    try {
      const res = await axios.get(BASE_URL + "/auth/profile", {
        withCredentials: true,
      });

      setUser(res.data.data);
      setLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen w-screen overflow-x-hidden">
        <Navbar />

        {/* This makes the main content grow and push footer to bottom */}
        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VisitorPage;
