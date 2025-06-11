import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../utils/constants";
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
      <div>
        <Navbar />
        <Outlet />
      </div>
    </>
  );
};

export default VisitorPage;
