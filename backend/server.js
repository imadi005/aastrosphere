import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from "./routes/authRoutes.js";

app.use("/api/auth", authRoutes);

// DB Connect
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
