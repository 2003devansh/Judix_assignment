import express, { urlencoded } from "express";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", (req, res) => {
  res.send("Server is Boomming BItch");
});

app.use("/auth", authRoutes);

app.use("/tasks", taskRoutes);

export default app;
