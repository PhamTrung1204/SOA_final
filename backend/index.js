import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import routesAdmin from "./routes/admin/index.route.js";
import expressSession from "express-session";
import routesClient from "./routes/client/index.js";
// const punycode = require('punycode/');

import punycode from "punycode";

import dotenv, { parse } from "dotenv";
import database from "./config/database.js";
import cookieParser from "cookie-parser";

// App config
const app = express();
const port = process.env.PORT || 4000;

// MiddleWare
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

app.use((req, res, next) => {
  const isHttps = req.protocol === "https"; // Check if the protocol is HTTPS
  const secureCookie = isHttps ? true : false; // Set secure flag based on protocol

  // Fetch or generate token (use a session value or any dynamic value you prefer)
  const liveToken = req.session ? req.session.liveToken : "default_token_value";

  res.cookie("__vercel_live_token", liveToken, {
    httpOnly: true,
    secure: true, // Only set secure flag if HTTPS
    sameSite: "strict", // Use dynamic SameSite value
  });

  next();
});

// Dotenv
dotenv.config();
// End dotenv

// Database
database();
// End database

// Routes
routesAdmin(app);
routesClient(app);

// Start Server
app.listen(port, () => {
  console.log("Server is running at port: " + port);
});
