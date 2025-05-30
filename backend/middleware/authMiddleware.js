const Provider = require("../models/users/Provider");
const User = require("../models/users/User");
const jwt = require("jsonwebtoken");
const Admin = require("../models/users/Admin");
// 1. JWT Authentication Middleware
const authenticateJWT = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not provided");
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded; // { _id, role, ... }
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

// 2. Role Authorization Middleware Generator
const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { _id, role } = req.user;

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      let Model;
      if (role === "admin") Model = Admin;
      else if (role === "provider") Model = Provider;
      else if (role === "user") Model = User;

      const userDoc = await Model.findById(_id);
      if (!userDoc) {
        return res.status(403).json({ error: "Invalid user" });
      }

      req.userDoc = userDoc; // You can use this instead of calling DB again
      console.log("validatePatch ", userDoc);
      next();
    } catch (error) {
      res.status(500).json({ error: "Authorization failed" });
    }
  };
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
};
