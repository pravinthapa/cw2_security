import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

await connectDB();

http
  .createServer(app)
  .listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
