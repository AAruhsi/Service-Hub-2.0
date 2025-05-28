const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const { authRouter } = require("./routes/authRouter");
const { adminRouter } = require("./routes/adminRouter");
const { serviceRouter } = require("./routes/serviceRouter");
require("./listener/categoryListener");

require("dotenv").config();
const app = express();

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://goelaarushi2203:rahul12345@cluster0.ho1de81.mongodb.net/service_hub?retryWrites=true&w=majority"
  );
};

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/", authRouter);
app.use("/api/admin/", adminRouter);
app.use("/api", serviceRouter);

connectDB()
  .then(() => {
    console.log("Database Connected Successfully...");
    app.listen(3000, () => {
      console.log("App is listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error COnnecting to database", err);
  });
