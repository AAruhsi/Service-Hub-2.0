const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const { authRouter } = require("./routes/authRouter");
const { adminRouter } = require("./routes/adminRouter");
const { serviceRouter } = require("./routes/serviceRouter");
const cors = require("cors");
const { serviceOfferedRouter } = require("./routes/servicesOfferedRouter");
const { providerRouter } = require("./routes/providerRoute");
const { offerRouter } = require("./routes/offerRouter");
const { orderRouter } = require("./routes/orderRoutes");

require("./listener/categoryListener");

require("dotenv").config();
const app = express();
app.use(
  cors({
    origin: "https://service-hub-2-0-frontend.onrender.com/",
    credentials: true,
  })
);
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
app.use("/api/serviceOffered/", serviceOfferedRouter);
app.use("/api/provider/", providerRouter);
app.use("/api/offer/", offerRouter);
app.use("/api/order/", orderRouter);

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
