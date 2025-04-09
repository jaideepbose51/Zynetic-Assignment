import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from './routes/userRouter.js';
import bookRouter from './routes/bookRouter.js';

dotenv.config();

const app = express();
const port = process.env.PORT||3000;

app.use(express.json());
app.use(cors());


app.use("/api/user",userRouter);
app.use("/api/books",bookRouter);

// app.use(errorHandler);

app.listen(port, () => {
    connectDB();
    console.log(`Server running on port ${port}`);
  });