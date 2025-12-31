// Import packages
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

// Import routes
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import reportsRoute from "./routes/reports.js";
import logoutRoute from "./routes/logout.js";
import customersRoute from "./routes/customers.js";
import backendRoute from "./routes/backend.js";

// Middleware
app.use(cookieParser());

const whitelist = ["http://localhost:3000", "http://localhost:8000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// To support JSON-encoded bodies
app.use(express.json());

// To support URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Route middlewares
app.use("/api/auth", authRoute);
app.use("/api", logoutRoute);
app.use("/api/users", usersRoute);
app.use("/api/report", reportsRoute);
app.use("/api/customers", customersRoute);
app.use("/api/backend", backendRoute);

// Error handling
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).json({
    sucess: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

/*app.all("*", (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(__dirname + "/views/404.html");
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});*/

app.listen(process.env.PORT, () => {
  console.log(`Server has started on port ${process.env.PORT}`);
});
