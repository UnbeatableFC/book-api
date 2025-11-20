import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import auth from "./routes/authRoutes.js";
import books from "./routes/bookRoutes.js";
import users from "./routes/userRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import rateLimit from "express-rate-limit";
import loggerMiddleware from "./middlewares/loggerMiddleware.js";
import { authenticateToken } from "./middlewares/auth.js";
import notFound from "./middlewares/notFound.js";

const PORT = process.env.PORT || 5000;

const app = express();

// Body Parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(loggerMiddleware);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, error: { message: "Too many requests, try again later." } },
});
app.use(limiter);

// Routes
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/books", books);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Book Manager API is running 🚀" });
});

// Error Handler
app.use(notFound);
app.use(errorHandler);


// Connect to Database and start server
mongoose
  .connect(process.env.ATLAS_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log(`MONGO_DB is connected`);
    app.listen(PORT, () => {
      console.log(`Server listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

export default app;
