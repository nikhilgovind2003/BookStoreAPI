import express from "express";
import indexRouter from "./routes/index.js";
import cookieParser from 'cookie-parser';
import dbConnection from "./DB/DBConfig.js";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();
dbConnection();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use("/api", indexRouter);



app.get("*splat", (req, res) => {
  res.status(404).json({
    message: "This router does not exist",
  });
});

app.listen(PORT, () => {
  console.log("Server is up and running at PORT:5000");
});
