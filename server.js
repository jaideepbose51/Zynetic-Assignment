import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from './routes/userRouter.js';
import bookRouter from './routes/bookRouter.js';

dotenv.config();

const app = express();
const port = process.env.PORT||3000;

app.use(express.json());
app.use(cors());


app.use("/api/user",userRouter);
app.use("/api/admin",adminRouter);
app.use("/api/doctor",doctorRouter);

app.use(errorHandler);

app.listen(port, () => {
    connectDB();
    console.log(`Server running on port ${port}`);
  });