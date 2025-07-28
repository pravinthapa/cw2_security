import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import vaultRoutes from "./routes/vaultRoutes.js";
import accessRoutes from "./routes/accessRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import mongoSanitize from "express-mongo-sanitize";
import adminLogRoutes from "./routes/adminLogRoutes.js";
// import contactRoutes from "./routes/contactRoutes.js";

// import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// ── Global middleware
app.use(helmet());
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:8080", // e.g. http://localhost:5173
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
// app.use(
//   mongoSanitize({
//     replaceWith: "_", // replaces dangerous keys like $set, $gt, etc.
//     onSanitize: ({ req, key }) => {
//       console.log(`Sanitized key: ${key}`);
//     },
//   })
// );

// ({
//   origin: process.env.CLIENT_URL,
//   credentials: true,
// })
// );
app.use(express.json()); // This parses incoming JSON requests automatically
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/logs", logRoutes);
// app.use("/api/contacts", contactRoutes);
// app.use(mongoSanitize());
app.use("/api/vault", mongoSanitize(), vaultRoutes);

app.use("/api/admin/logs", adminLogRoutes);

// ── Routes

// ── Error handler
// app.use(errorHandler);

export default app;
