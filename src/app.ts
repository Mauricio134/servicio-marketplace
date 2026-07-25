import express from "express";
import cors from "cors";

import usersRouter from "./routes/users.js"
import postsRouter from "./routes/posts.js";
import offersRouter from "./routes/offers.js";
import authRouter from "./routes/auth.js";
import notificationsRouter from "./routes/notifications.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Servicio Marketplace API funcionando...",
  });
});

app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/offers", offersRouter);
app.use("/api/auth", authRouter);
app.use(
  "/api/notifications",
  notificationsRouter,
);

export default app;
