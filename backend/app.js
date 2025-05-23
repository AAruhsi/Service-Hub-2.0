const express = require("express");
const mongoose = require("mongoose");
const app = express();

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://goelaarushi2203:rahul12345@cluster0.ho1de81.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/servideHub"
  );
};

app.use(express.json());
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
