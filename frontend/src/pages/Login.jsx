import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../utils/constants";
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { setLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { email, password, role } = data;

    try {
      let endpoint = role === "admin" ? "/admin/login" : "/auth/login";
      const res = await axios.post(
        BASE_URL + endpoint,
        { email, password, role },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setLoggedIn(true);
        setUser(res.data.data);
        toast.success(
          `${role.charAt(0).toUpperCase() + role.slice(1)} Login Successful`
        );

        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "provider") navigate("/provider/dashboard");
        else navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center w-full bg-white  dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
          Welcome Back!
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              className="shadow-sm text-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select User Type
            </label>
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select Role --</option>
              <option value="user">Customer</option>
              <option value="provider">Provider</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              className="shadow-sm text-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
            <Link
              to="/"
              className="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>

          <div className="text-right my-4 flex justify-center items-center ">
            <h4 className="text-xs">Don't have an account?</h4>
            <Link
              to="/register"
              className="text-xs text-indigo-500 hover:text-indigo-700 ml-1"
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
